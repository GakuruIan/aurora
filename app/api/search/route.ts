import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/lib/current-user";
import OramaDB from "@/lib/orama/orama";
import { createOAuth2Client } from "@/lib/utils/google";

export async function GET(req: NextRequest) {
  const user = await currentUser();

  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("term");

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

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

    const oauth2 = google.oauth2({ version: "v2", auth: oauthClient });
    const userInfo = await oauth2.userinfo.get();

    const orama = await OramaDB.getInstance(userInfo.data.id!);

    const results = await orama.search({ term: query });

    return NextResponse.json(results);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
