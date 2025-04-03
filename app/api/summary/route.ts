import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { google } from "googleapis";
import { createOAuth2Client } from "@/lib/utils/google";

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
    oauthClient.setCredentials({ access_token: accessToken });

    const [notesCount, tasks, unreadEmailsData] = await Promise.all([
      db.note.count(),
      fetchTaskData(oauthClient),
      fetchEmailData(oauthClient),
    ]);

    return NextResponse.json({
      notes: notesCount,
      tasks: tasks.statusCount,
      todayTask: tasks.todaysTasks,
      unreadEmails: unreadEmailsData,
    });
  } catch (error) {
    console.error("Dashboard data fetch error:", error);
    return new NextResponse("Failed to fetch dashboard data", { status: 500 });
  }
}

async function fetchTaskData(oauthClient) {
  const tasks = google.tasks({ version: "v1", auth: oauthClient });
  const statusCount: Record<string, number> = { needsAction: 0, completed: 0 };
  const todaysTasks = [];

  const today = new Date().toISOString().split("T")[0];

  try {
    const taskListsRes = await tasks.tasklists.list();
    const taskLists = taskListsRes.data.items || [];

    await Promise.all(
      taskLists.map(async (list) => {
        const tasksRes = await tasks.tasks.list({ tasklist: list.id });
        const taskItems = tasksRes.data.items || [];

        taskItems.forEach((task) => {
          if (task.status) {
            statusCount[task.status] = (statusCount[task.status] || 0) + 1;
          }

          // Check for tasks due today with needsAction status
          if (
            task.status === "needsAction" &&
            task.due &&
            task.due.split("T")[0] === today
          ) {
            todaysTasks.push({
              id: task.id,
              title: task.title,
              listId: list.id,
              listTitle: list.title,
            });
          }
        });
      })
    );

    return { statusCount, todaysTasks };
  } catch (error) {
    console.error("Task data fetch error:", error);
    throw error;
  }
}

async function fetchEmailData(oauthClient) {
  try {
    const gmail = google.gmail({ version: "v1", auth: oauthClient });
    const unreadEmailsRes = await gmail.users.messages.list({
      userId: "me",
      q: "label:INBOX label:IMPORTANT OR label:STARRED OR label:CATEGORY_PERSONAL OR is:unread",
    });

    return unreadEmailsRes.data.messages?.length || 0;
  } catch (error) {
    console.error("Email data fetch error:", error);
    throw error;
  }
}
