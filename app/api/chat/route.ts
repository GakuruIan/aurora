import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/lib/current-user";
import { google } from "googleapis";
import { createOAuth2Client } from "@/lib/utils/google";
import OramaDB from "@/lib/orama/orama";

// util openai
import { openai } from "@/lib/openai/openAi";

export async function POST(req: NextRequest) {
  const user = await currentUser();

  if (!user) {
    return new NextResponse("Unauthorized user", { status: 401 });
  }

  const { messages } = await req.json();

  console.log(messages);

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

    const orama = await OramaDB.getInstance(userInfo.data.id!);
    const context = await orama.vectorSearch({ term: lastmessage.content });

    console.log(context);

    // const prompt = {
    //   role: "system",
    //   content: `You are an AI personal assistant embedded in a productivity app, helping the user manage their emails, tasks, and notes efficiently. Your purpose is to assist the user by answering questions, providing suggestions, and offering relevant information based on their previous interactions.

    // THE TIME NOW IS ${new Date().toLocaleString()}

    // START CONTEXT BLOCK
    // ${context.hits.map((hit) => JSON.stringify(hit.document)).join("\n")}
    // END OF CONTEXT BLOCK

    // When responding, please keep in mind:
    // - Be helpful, insightful, and concise.
    // - Rely on the provided context (emails, tasks, notes) to inform your responses.
    // - If the context does not contain enough information to answer a question, politely indicate that more details are needed.
    // - Avoid apologizing for gaps in knowledge; instead, indicate that you have updated your understanding based on new information.
    // - Do not invent or speculate about anything that is not directly supported by the provided context.
    // - Maintain clarity and relevance, tailoring responses to the user's queries or the specific email, task, or note being composed or referenced.`,
    // };

    // const response = await openai.chat.completions.create({
    //   model: "gpt-3.5-turbo",
    //   messages: [prompt, messages.filter((message) => message.role === "user")],
    //   stream: true,
    // });

    // return new Response(response.body, {
    //   headers: { "Content-Type": "text/event-stream" },
    // });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
