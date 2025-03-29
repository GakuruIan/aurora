import { createOAuth2Client } from "@/lib/utils/google";
import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/lib/current-user";

export async function GET(req: NextRequest) {
  const user = await currentUser();

  if (!user) {
    return new NextResponse("Unauthorized user", { status: 401 });
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

    const List = await tasks.tasklists.list();

    const taskList = List.data.items || [];

    const detailedTaskList = await Promise.all(
      taskList.map(async (task) => {
        const taskDetails = await tasks.tasks.list({
          showCompleted: true,
          showHidden: true,
          maxResults: 50,
          tasklist: task.id,
        });

        const tasksWithCompletion =
          taskDetails?.data?.items?.map((t) => ({
            ...t,
            isCompleted: t.status === "completed", // Add isCompleted property
          })) || [];

        return {
          ...task,
          tasks: tasksWithCompletion,
        };
      })
    );

    return NextResponse.json(detailedTaskList);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const user = await currentUser();

  if (!user) {
    return new NextResponse("Unauthorized user", { status: 401 });
  }

  const { title } = await req.json();

  if (!title) {
    return NextResponse.json(
      {
        error: "Task title is required",
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

    const response = await tasks.tasklists.insert({
      requestBody: {
        title,
      },
    });

    return NextResponse.json(response);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
