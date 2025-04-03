import { db } from "@/lib/db";
import { currentUser } from "@/lib/current-user";
import { NextResponse, NextRequest } from "next/server";
import { google } from "googleapis";
import { createOAuth2Client } from "@/lib/utils/google";
import OramaDB from "@/lib/orama/orama";
import { getEmbeddings } from "@/lib/openai/embeddings";

export async function GET() {
  const user = await currentUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const notes = await db.note.findMany({
      where: {
        ownerId: user.id,
      },
      include: {
        category: {
          select: {
            colorCode: true,
            name: true,
            id: true,
          },
        },
      },
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.log(`${error}`);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const accessToken = req.cookies.get("google_access_token")?.value;

    if (!accessToken) {
      return new NextResponse("No access token found", { status: 401 });
    }

    const oauthClient = createOAuth2Client();
    oauthClient.setCredentials({
      access_token: accessToken,
    });

    const oauth2 = google.oauth2({ version: "v2", auth: oauthClient });
    const userInfo = await oauth2.userinfo.get();

    const user = await currentUser();

    if (!user) {
      return new NextResponse("unauthorize", { status: 401 });
    }

    const { title, content, categoryId } = await req.json();

    if (!title || !content || !categoryId) {
      return NextResponse.json(
        {
          error: "Title ,note and category is required",
        },
        { status: 400 }
      );
    }

    // checking or existing note
    const isExistingNote = await db.note.findFirst({
      where: {
        title,
        ownerId: user.id,
      },
    });

    if (isExistingNote) {
      return NextResponse.json(
        {
          error: "Note with this title already exists",
        },
        { status: 400 }
      );
    }

    const category = await db.noteCategory.findUnique({
      where: {
        id: categoryId,
      },
      select: {
        name: true,
      },
    });

    if (!category) {
      return NextResponse.json(
        {
          error: "No category exists with the that ID",
        },
        { status: 404 }
      );
    }

    const newNote = await db.note.create({
      data: {
        title,
        content,
        categoryId: categoryId,
        ownerId: user.id,
      },
    });

    const accountId = userInfo.data.id;

    if (!accountId) {
      return NextResponse.json(
        { error: "Google account not found" },
        { status: 404 }
      );
    }

    const orama = OramaDB.getInstance(accountId);

    (await orama).insert({
      id: newNote.id,
      title: newNote.title,
      content: newNote.content,
      type: "Notes",
      tags: [`${category.name}`],
      date: new Date().toISOString(),
      embeddings: getEmbeddings(newNote.content ?? newNote.title ?? ""),
    });

    return NextResponse.json(
      {
        message: "Note created successfully",
        data: newNote,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating note:", error);
    return NextResponse.json(
      {
        error: "Failed to create note",
      },
      { status: 500 }
    );
  }
}
