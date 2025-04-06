import { createOAuth2Client } from "@/lib/utils/google";
import { currentUser } from "@/lib/current-user";
import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const user = await currentUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const accessToken = req.cookies.get("google_access_token")?.value;

  if (!accessToken) {
    return new NextResponse("No access token found", { status: 401 });
  }

  const oauth2Client = createOAuth2Client();
  oauth2Client.setCredentials({
    access_token: accessToken,
  });

  const gmail = google.gmail({ version: "v1", auth: oauth2Client });

  try {
    let messages: any[] = [];
    let nextPageToken: string | undefined = undefined;
    const maxResults = 50;

    do {
      const response = await gmail.users.messages.list({
        userId: "me",
        q: "in:sent",
        maxResults,
        pageToken: nextPageToken,
      });

      if (response.data.messages) {
        messages = [...messages, ...response.data.messages];
      }

      nextPageToken = response.data.nextPageToken;
    } while (nextPageToken);

    const detailedMessages = await Promise.all(
      messages.map(async (message) => {
        const messageDetails = await gmail.users.messages.get({
          userId: "me",
          id: message.id,
        });
        // Extract sender information
        const toHeader = messageDetails.data.payload?.headers?.find(
          (header) => header.name?.toLowerCase() === "to"
        );

        // Extract subject
        const subjectHeader = messageDetails.data.payload?.headers?.find(
          (header) => header.name?.toLowerCase() === "subject"
        );

        // Sender extraction logic
        const sender = toHeader
          ? {
              fullSender: toHeader.value || "",
              email: toHeader.value?.match(/<([^>]+)>/)?.[1] || toHeader.value,
              name: toHeader.value?.split("<")[0].trim() || "",
            }
          : null;

        const { payload, ...emailData } = messageDetails.data;

        return {
          sender: sender,
          subject: subjectHeader?.value || "",
          ...emailData,
        };
      })
    );

    return NextResponse.json(detailedMessages, { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Failed to fetch emails", { status: 500 });
  }
}
