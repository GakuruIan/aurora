import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/lib/current-user";
import { google } from "googleapis";
import { createOAuth2Client } from "@/lib/utils/google";
import { InitialEmailSync, InitialTaskSync } from "@/lib/sync/sync";

export async function GET(req: NextRequest) {
  const user = await currentUser();

  if (!user) {
    return new NextResponse("Unauthorized user", { status: 401 });
  }

  const accessToken = req.cookies.get("google_access_token")?.value;

  if (!accessToken) {
    return new NextResponse("No access Token found", { status: 401 });
  }

  try {
    const oauthClient = createOAuth2Client();
    oauthClient.setCredentials({
      access_token: accessToken,
    });

    const gmail = google.gmail({ version: "v1", auth: oauthClient });

    const tasks = google.tasks({ version: "v1", auth: oauthClient });

    await InitialEmailSync(gmail, user.id);

    await InitialTaskSync(tasks, user.id);

    return NextResponse.json({ message: "User data synced Successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
