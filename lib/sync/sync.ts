import { db } from "../db";
import { extractEmailPayload } from "../utils/extractEmailPayload";
import { PreprocessEmailContent } from "../utils/processEmail";

import { gmail_v1, tasks_v1 } from "googleapis";

export async function InitialEmailSync(gmail: gmail_v1.Gmail, userId: string) {
  let nextPageToken: string | null = null;
  let allMessages: gmail_v1.Schema$Message[] = [];

  const latest_history_id = (await gmail.users.getProfile({ userId: "me" }))
    .data.historyId;

  try {
    do {
      const messagesRes = await gmail.users.messages.list({
        userId: "me",
        maxResults: 150,
        q: "label:INBOX label:IMPORTANT OR label:STARRED OR label:CATEGORY_PERSONAL OR label:SENT OR is:unread",
        pageToken: nextPageToken,
      });

      const messages = messagesRes.data.messages || [];
      allMessages.push(...messages);

      nextPageToken = messagesRes.data.nextPageToken || null;
    } while (nextPageToken);

    for (const message of allMessages) {
      const email = await gmail.users.messages.get({
        userId: "me",
        id: message.id,
      });

      const headers = email.data.payload?.headers || [];
      const subject =
        headers.find((h) => h.name === "Subject")?.value || "No Subject";
      const from =
        headers.find((h) => h.name === "From")?.value || "Unknown Sender";
      const recipient =
        headers.find((h) => h.name === "To")?.value || "Unknown recipient";
      const snippet = email.data.snippet || "No preview available";

      const extractedBody = extractEmailPayload(email.data.payload);

      await db.googleEmail.upsert({
        where: {
          messageId: email.data.id!,
        },
        update: {
          ownerId: userId,
          from: from,
          to: recipient,
          subject,
          snippet,
          body: extractedBody,
          preprocessedBody: PreprocessEmailContent(extractedBody),
          labels: email?.data.labelIds ?? [],
          receivedAt: new Date(Number(email?.data.internalDate) || 0),
        },
        create: {
          ownerId: userId,
          messageId: email.data.id!,
          from: from,
          to: recipient,
          subject,
          snippet,
          body: extractedBody,
          preprocessedBody: PreprocessEmailContent(extractedBody),
          labels: email?.data.labelIds ?? [],
          receivedAt: new Date(Number(email?.data.internalDate) || 0),
        },
      });
    }

    const historyRes = await gmail.users.history.list({
      userId: "me",
      startHistoryId: latest_history_id,
      maxResults: 1,
    });

    const historyId = historyRes.data.history?.[0].id ?? null;

    if (historyId) {
      db.googleWatch.upsert({
        where: {
          userId: userId,
        },
        update: {
          historyId: historyId,
        },
        create: {
          userId,
          historyId,
        },
      });
    }
  } catch (error) {
    console.error("Error during initial Gmail sync:", error);
    throw error;
  }
}

export async function InitialTaskSync(tasks: tasks_v1.Tasks, userId: string) {
  try {
    const taskListsRes = await tasks.tasklists.list();
    const taskLists = taskListsRes.data.items || [];

    for (const tasklist of taskLists) {
      const tasklistId = tasklist.id;
      if (!tasklistId) continue;

      // Fetch existing syncToken for incremental sync
      const userSyncData = await db.syncToken.findUnique({
        where: {
          ownerId_taskListId: { ownerId: userId, taskListId: tasklistId },
        },
      });

      const syncToken = userSyncData?.syncToken;
      let nextPageToken: string | undefined = undefined;

      do {
        const tasksRes = await tasks.tasks.list({
          tasklist: tasklistId,
          showCompleted: true,
          showDeleted: false,
          syncToken, // Use sync token if available
          pageToken: nextPageToken, // Handle pagination
        });

        const userTasks = tasksRes.data.items || [];
        nextPageToken = tasksRes.data.nextPageToken; // Get next page token

        for (const task of userTasks) {
          await db.googleTask.upsert({
            where: { taskId: task.id },
            update: {
              title: task.title || "Untitled task",
              notes: task.notes || "",
              dueDate: task.due ? new Date(task.due) : null,
              status: task.status,
              listId: tasklistId,
              listTitle: tasklist.title || "Untitled task list",
              completed: task.completed ? new Date(task.completed) : null,
              updatedAt: new Date(task.updated || Date.now()),
            },
            create: {
              ownerId: userId,
              taskId: task.id,
              title: task.title || "Untitled task",
              notes: task.notes || "",
              dueDate: task.due ? new Date(task.due) : null,
              status: task.status,
              listId: tasklistId,
              listTitle: tasklist.title || "Untitled task list",
              completed: task.completed ? new Date(task.completed) : null,
            },
          });
        }
      } while (nextPageToken); // Continue fetching until there's no next page

      // Save the latest sync token for incremental updates
      if (syncToken) {
        await db.syncToken.upsert({
          where: {
            ownerId_taskListId: { ownerId: userId, taskListId: tasklistId },
          },
          update: { syncToken },
          create: { ownerId: userId, taskListId: tasklistId, syncToken },
        });
      }
    }
  } catch (error) {
    console.error("Error syncing Google Tasks:", error);
  }
}
