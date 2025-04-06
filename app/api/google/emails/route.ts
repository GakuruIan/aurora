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

    const gmail = google.gmail({ version: "v1", auth: oauthClient });

    let messages: any[] = [];
    let nextPageToken: string | undefined = undefined;
    const maxResults = 50;

    do {
      const emails = await gmail.users.messages.list({
        userId: "me",
        q: "label:INBOX label:IMPORTANT OR label:STARRED OR label:CATEGORY_PERSONAL OR label:SENT OR is:unread",
        maxResults,
      });

      if (emails.data.messages) {
        messages = [...messages, ...emails.data.messages];
      }

      nextPageToken = emails.data.nextPageToken;
    } while (nextPageToken);

    const detailedMessages = await Promise.all(
      messages.map(async (message) => {
        const messageDetails = await gmail.users.messages.get({
          userId: "me",
          id: message.id,
        });
        // Extract sender information
        const fromHeader = messageDetails.data.payload?.headers?.find(
          (header) => header.name?.toLowerCase() === "from"
        );

        // Extract subject
        const subjectHeader = messageDetails.data.payload?.headers?.find(
          (header) => header.name?.toLowerCase() === "subject"
        );

        // Sender extraction logic
        const sender = fromHeader
          ? {
              fullSender: fromHeader.value || "",
              email:
                fromHeader.value?.match(/<([^>]+)>/)?.[1] || fromHeader.value,
              name: fromHeader.value?.split("<")[0].trim() || "",
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

    return NextResponse.json(detailedMessages);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
