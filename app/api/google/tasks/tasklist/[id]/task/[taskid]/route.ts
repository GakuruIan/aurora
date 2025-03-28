import { createOAuth2Client } from "@/lib/utils/google";
import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/lib/current-user";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; taskid: string } }
) {
  const user = await currentUser();

  const { id, taskid } = params;

  if (!user) {
    return new NextResponse("Unauthorized user", { status: 401 });
  }

  if (!id || !taskid) {
    return new NextResponse("Missing route parameters", { status: 400 });
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

    await tasks.tasks.delete({
      tasklist: id,
      task: taskid,
    });

    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
