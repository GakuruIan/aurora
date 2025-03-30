import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/current-user";
import { createOAuth2Client } from "@/lib/utils/google";

export async function POST(req: NextRequest) {
  const user = await currentUser();

  if (!user) {
    return new NextResponse("Unauthorized user", { status: 401 });
  }

  const accessToken = req.cookies.get("google_access_token")?.value;
  const refreshToken = req.cookies.get("google_refresh_token")?.value;

  if (!accessToken || !refreshToken) {
    return NextResponse.redirect(new URL("/integrations", req.url));
  }

  try {
    const oauthClient = createOAuth2Client();

    oauthClient.setCredentials({
      refresh_token: refreshToken,
      access_token: accessToken,
    });

    const currentAccessToken = await oauthClient.getAccessToken();

    if (currentAccessToken.token) {
      return NextResponse.next();
    }

    const { credentials } = await oauthClient.refreshAccessToken();

    await db.oAuthToken.update({
      where: {
        ownerId: user.clerkId,
      },
      data: {
        accessToken: credentials.access_token!,
        refreshToken: credentials.refresh_token!,
      },
    });

    const response = NextResponse.next();

    response.cookies.set({
      name: "google_access_token",
      value: credentials.access_token!,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: credentials.expiry_date
        ? Math.max(0, Math.floor((credentials.expiry_date - Date.now()) / 1000))
        : 3600,
    });

    if (credentials.refresh_token) {
      response.cookies.set("google_refresh_token", credentials.refresh_token!, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });
    }

    if (credentials.expiry_date) {
      response.cookies.set("expiry", credentials.expiry_date.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });
    }
    return response;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return NextResponse.json(
      { error: "Failed to refresh token" },
      { status: 500 }
    );
  }
}
