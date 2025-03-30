import { NextResponse, NextRequest } from "next/server";
import { currentUser } from "@/lib/current-user";
import { InitialTaskSync } from "@/lib/sync/sync";
import { createOAuth2Client } from "@/lib/utils/google";
import { google } from "googleapis";

export async function POST(req: NextRequest) {
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

    const tasks = google.tasks({ version: "v1", auth: oauthClient });

    await InitialTaskSync(tasks, user.id);

    return NextResponse.json("Synced successfully");
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
