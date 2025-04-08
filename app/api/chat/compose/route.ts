import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/lib/current-user";

import ollama from "ollama";

export async function POST(req: NextRequest) {
  const user = await currentUser();

  if (!user) {
    return new NextResponse("Unauthorized user", { status: 401 });
  }

  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    const composeEmailPrompt = {
      role: "system",
      content: `You are Aurora, a highly capable AI assistant designed to help users compose emails quickly and effectively.

        Your task is to write a clear, well-structured email based only on the user’s input. The user will describe:
        - The purpose of the email (e.g., follow-up, request, update, thank-you, apology).
        - The recipient (e.g., manager, colleague, client).
        - The tone they want (e.g., formal, friendly, persuasive).
        - Any specific points or facts they want included.

        ## Instructions:
        - Analyze the user’s input carefully and infer the full message they want to send.
        - Compose a polished, complete email with:
        - A relevant subject line (if the user didn’t provide one, create one).
        - An appropriate greeting.
        - A concise, well-organized body.
        - A respectful closing and sign-off.
        - Use the tone and language that fits the user’s intent and audience.
        - If the user input is vague, ask follow-up questions instead of guessing.
        - Do not include placeholders like "[Your Name]" — write the full draft as if ready to send.

        Your goal is to save the user time by composing an email that feels natural, thoughtful, and effective.`,
    };

    const messages = [
      composeEmailPrompt,
      {
        role: "user",
        content: prompt,
      },
    ];

    console.log(prompt);

    const response = await ollama.chat({
      model: "llama3",
      messages: messages,
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
