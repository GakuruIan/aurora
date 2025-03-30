import { NextResponse } from "next/server";
import { google } from "googleapis";
import { createOAuth2Client } from "@/lib/utils/google";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/current-user";

export async function POST() {
  const user = await currentUser();

  if (!user) {
    return new NextResponse("unauthorized user", { status: 401 });
  }

  try {
    const auth = createOAuth2Client();

    const gmail = google.gmail({ version: "v1", auth });

    const watchResponse = await gmail.users.watch({
      userId: "me",
      requestBody: {
        topicName: process.env.GOOGLE_PUB_SUB,
        labelIds: ["INBOX"],
        labelFilterAction: "include",
      },
    });

    await db.googleWatch.upsert({
      where: {
        userId: user.id,
      },
      update: {
        historyId: watchResponse.data.historyId!,
      },
      create: {
        userId: user.id,
        historyId: watchResponse.data.historyId!,
      },
    });

    return NextResponse.json(watchResponse.data);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
