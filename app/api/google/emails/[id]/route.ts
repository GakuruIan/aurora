import { createOAuth2Client } from "@/lib/utils/google";
import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/lib/current-user";

// utils
import { extractEmailPayload } from "@/lib/utils/extractEmailPayload";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await currentUser();

  const { id } = params;

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

    const gmail = google.gmail({ version: "v1", auth: oauthClient });

    const response = await gmail.users.threads.get({
      userId: "me",
      id: id,
    });

    const thread = response.data;

    if (!thread.messages || thread.messages.length === 0) {
      return [];
    }

    const message = thread.messages[0];

    const fromHeader = message.payload?.headers?.find(
      (header) => header.name?.toLowerCase() === "from"
    );

    const sender = fromHeader
      ? {
          fullSender: fromHeader.value || "",
          email: fromHeader.value?.match(/<([^>]+)>/)?.[1] || fromHeader.value,
          name: fromHeader.value?.split("<")[0].trim() || "",
        }
      : null;

    const detailedMessages = thread.messages.map((message) => {
      const payload = message.payload;

      const subjectHeader = payload?.headers?.find(
        (header) => header.name?.toLowerCase() === "subject"
      );

      const emailContent = extractEmailPayload(payload);

      return {
        id: message.id,
        subject: subjectHeader?.value ?? "No subject",
        content: emailContent,
      };
    });

    return NextResponse.json({
      sender,
      messages: detailedMessages,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
