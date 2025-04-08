import { NextResponse, NextRequest } from "next/server";
import { currentUser } from "@/lib/current-user";

import { google } from "googleapis";
import { createOAuth2Client } from "@/lib/utils/google";
import MailComposer from "nodemailer/lib/mail-composer";

export async function POST(req: NextRequest) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { subject, to, content, cc, bcc } = await req.json();

    if (!content || !to) {
      return NextResponse.json(
        { message: "Recipient and Email content is required" },
        { status: 400 }
      );
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

    const mail = new MailComposer({
      to,
      subject,
      text: content,
      cc,
      bcc,
      textEncoding: "base64",
      headers: [
        { key: "Content-Type", value: "text/plain; charset=UTF-8" },
        { key: "Content-Transfer-Encoding", value: "base64" },
      ],
    });

    const message = await new Promise((resolve, reject) => {
      mail.compile().build((err, msg) => {
        if (err) reject(err);
        else
          resolve(
            msg
              .toString("base64")
              .replace(/\+/g, "-")
              .replace(/\//g, "_")
              .replace(/=+$/, "")
          );
      });
    });

    const raw = message as string;

    const response = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw,
      },
    });

    console.log(response.data);

    return NextResponse.json({ message: "Email sent successfully" });
  } catch (error) {
    console.log(error);
    return new NextResponse("Failed to fetch emails", { status: 500 });
  }
}
