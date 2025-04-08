import { google } from "googleapis";
import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { createOAuth2Client } from "@/lib/utils/google";
import { NextResponse, NextRequest } from "next/server";

// utils
import { PreprocessEmailContent } from "@/lib/utils/processEmail";
import { extractEmailPayload } from "@/lib/utils/extractEmailPayload";

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    const auth = createOAuth2Client();

    const accessToken = req.cookies.get("google_access_token")?.value;

    if (!user) {
      return new NextResponse("Unauthorized user", { status: 401 });
    }

    if (!accessToken) {
      return new NextResponse("No access token found", { status: 401 });
    }

    auth.setCredentials({
      access_token: accessToken,
    });

    const gmail = google.gmail({ version: "v1", auth });

    const db_historyid = await db.googleWatch.findUnique({
      where: {
        userId: user.id,
      },
    });

    const hist_response = await gmail.users.history.list({
      userId: "me",
      startHistoryId: db_historyid,
      historyTypes: ["messageAdded"],
    });

    const histories = hist_response.data.history || [];

    for (const history in histories) {
      for (const msg of history.messages || []) {
        // Fetch full email content
        const email = await gmail.users.messages.get({
          userId: "me",
          id: msg.id,
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

        const email_address = from.match(/<([^>]+)>/)?.[1] || from;
        const name = from.split("<")[0].trim() || "";

        await db.googleEmail.upsert({
          where: {
            messageId: email.data.id!,
          },
          update: {
            ownerId: user.id,
            address: email_address,
            name,
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
            ownerId: user.id,
            messageId: email.data.id!,
            from: from,
            to: recipient,
            address: email_address,
            name,
            subject,
            snippet,
            body: extractedBody,
            preprocessedBody: PreprocessEmailContent(extractedBody),
            labels: email?.data.labelIds ?? [],
            receivedAt: new Date(Number(email?.data.internalDate) || 0),
          },
        });
      }
    }

    await db.googleWatch.update({
      where: {
        userId: user.id,
      },
      data: {
        historyId: hist_response.data.historyId,
      },
    });

    return NextResponse.json("updated from webhook");
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
