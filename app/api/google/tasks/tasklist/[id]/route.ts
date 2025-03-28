import { createOAuth2Client } from "@/lib/utils/google";
import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/lib/current-user";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await currentUser();

  if (!user) {
    return new NextResponse("Unauthorized user", { status: 401 });
  }

  const { title, notes, due } = await req.json();

  const { id } = params;

  if (!id) {
    return NextResponse.json(
      {
        error: "Tasklist is required",
      },
      { status: 400 }
    );
  }

  if (!title) {
    return NextResponse.json(
      {
        error: "Title is required",
      },
      { status: 400 }
    );
  }

  try {
    const accessToken = req.cookies.get("google_access_token")?.value;

    if (!accessToken) {
      return new NextResponse("No access token found", { status: 401 });
    }

    const oauthClient = createOAuth2Client();
    oauthClient.setCredentials({
      access_token: accessToken,
    });

    const tasks = google.tasks({ version: "v1", auth: oauthClient });

    const response = await tasks.tasks.insert({
      tasklist: id,
      requestBody: {
        title,
        due,
        notes,
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await currentUser();

  const { id } = params;

  if (!user) {
    return new NextResponse("Unauthorized user", { status: 401 });
  }

  if (!id) {
    return new NextResponse("Task list id is missing", { status: 400 });
  }

  try {
    const accessToken = req.cookies.get("google_access_token")?.value;

    if (!accessToken) {
      return new NextResponse("No access token found", { status: 401 });
    }

    const oauthClient = createOAuth2Client();
    oauthClient.setCredentials({
      access_token: accessToken,
    });

    const tasks = google.tasks({ version: "v1", auth: oauthClient });

    await tasks.tasklists.delete({
      tasklist: id,
    });

    return NextResponse.json({ message: "TaskList deleted successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
