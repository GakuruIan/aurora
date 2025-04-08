import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/lib/current-user";
import { google } from "googleapis";
import { createOAuth2Client } from "@/lib/utils/google";
import OramaDB from "@/lib/orama/orama";

// util openai
import ollama from "ollama";

export async function POST(req: NextRequest) {
  const user = await currentUser();

  if (!user) {
    return new NextResponse("Unauthorized user", { status: 401 });
  }

  const { messages } = await req.json();

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

    const lastmessage = messages[messages.length - 1];

    console.log(`Last message -> ${lastmessage.content}`);

    const orama = await OramaDB.getInstance(userInfo.data.id!);
    const context = await orama.vectorSearch({ term: lastmessage.content });

    const prompt = {
      role: "system",
      content: `You are Aurora, a highly capable personal AI assistant embedded in a productivity app. Your job is to help the user stay organized and productive using their notes, tasks, and emails.

You have direct access to the user’s data retrieved via semantic search, including:
- Notes: ideas, plans, thoughts, research.
- Tasks: to-dos, reminders, or scheduled actions.
- Emails: communications, notifications, or updates.

🕒 CURRENT TIME: ${new Date().toLocaleString()}

The following is the user’s most relevant context. Use this as your complete knowledge base for answering.

--- START OF CONTEXT ---
${context.hits
  .map(
    (hit, i) =>
      `(${i + 1}) [${hit.document.type.toUpperCase()}] — ${
        hit.document.title
      }\nContent:\n${hit.document.content.trim()}`
  )
  .join("\n\n")}
--- END OF CONTEXT ---

## Instructions:
- Read and analyze the context carefully.
- Identify any important insights, summaries, and potential action points.
- Use the user’s tone and language where appropriate.
- If the user asks a question, use this context to answer accurately.
- Reference specific items using their type and title when helpful.
- Do **not** say you lack context — use only the above content as your knowledge.
- If anything is missing, ask the user follow-up questions.
- Be concise, intelligent, and helpful.

If the user provides **no direct input**, proactively summarize the context by:
- Highlighting important notes, tasks, or emails.
- Suggesting any next steps or decisions that can be made.
- Offering helpful insights or reminders from the data.

Respond like a trusted personal assistant focused on getting things done.`,
    };

    const response = await ollama.chat({
      model: "llama3",
      messages: [prompt, ...messages.filter((m) => m.role === "user")],
      stream: true,
      options: {
        num_thread: 4,
        num_gpu: 0,
        num_ctx: 2048,
      },
    });

    const encoder = new TextEncoder();
    let buffer = "";
    let lastFlushTime = Date.now();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            const content = chunk.message?.content ?? "";

            if (content) {
              buffer += content;

              const now = Date.now();
              if (buffer.length > 100 || now - lastFlushTime > 100) {
                controller.enqueue(encoder.encode(`data: ${buffer}\n\n`));
                buffer = "";
                lastFlushTime = now;

                await new Promise((resolve) => setTimeout(resolve, 100));
              }
            }
          }

          if (buffer.length > 0) {
            controller.enqueue(encoder.encode(`data: ${buffer}\n\n`));
          }

          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal serval error" },
      { status: 500 }
    );
  }
}
