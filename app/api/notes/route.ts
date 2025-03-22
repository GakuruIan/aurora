import { db } from "@/lib/db";
import { currentUser } from "@/lib/current-user";
import { NextResponse } from "next/server";

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

export async function POST(req: Request) {
  try {
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

    const newNote = await db.note.create({
      data: {
        title,
        content,
        categoryId: categoryId,
        ownerId: user.id,
      },
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
