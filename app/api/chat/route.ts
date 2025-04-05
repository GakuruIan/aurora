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
      content: `You are a highly capable AI personal assistant embedded in a productivity app. Your role is to help the user manage their tasks, notes, and emails effectively.

      You have direct access to the user's personal information via semantic search. This includes:
      - Notes (ideas, planning, thoughts, or research),
      - Tasks (to-dos, reminders, or scheduled actions),
      - Emails (communications or notifications).

      🕒 CURRENT TIME: ${new Date().toLocaleString()}

      Below is the user’s recent context. Treat it as your source of truth.

      --- START OF CONTEXT ---
      ${context.hits
        .map(
          (hit, i) =>
            `(${i + 1}) [${hit.document.type}] ${hit.document.title}\n${
              hit.document.content
            }`
        )
        .join("\n\n")}
      --- END OF CONTEXT ---

      ### Instructions:
      - Use this information to answer the user's questions, offer suggestions, or summarize insights.
      - Reference and quote from the content when relevant.
      - If something is unclear or missing, politely ask the user for more information.
      - Do not mention that you're an AI or that you lack access — this is your full context.
      - Avoid speculation. Only use what’s present in the context block.
      - Keep your responses concise, helpful, and tailored to the user’s needs.`,
    };

    console.log(prompt.content);

    const response = await ollama.chat({
      model: "mistral",
      messages: [prompt, ...messages.filter((m) => m.role === "user")],
      stream: true,
    });

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            const content = chunk.message?.content ?? "";

            if (content) {
              controller.enqueue(encoder.encode(`data: ${content}\n\n`));
              // Prevent CPU from maxing out
              await new Promise((resolve) => setTimeout(resolve, 15));
            }
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
