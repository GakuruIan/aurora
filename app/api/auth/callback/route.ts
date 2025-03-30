import { NextResponse } from "next/server";
import { createOAuth2Client } from "@/lib/utils/google";
import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { google } from "googleapis";

export async function GET(req: Request) {
  try {
    const user = await currentUser();

    const url = new URL(req.url);
    const code = url.searchParams.get("code");

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { error: "Authorization code is missing" },
        { status: 400 }
      );
    }

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const oauthClient = createOAuth2Client();

    const { tokens } = await oauthClient.getToken(code as string);

    oauthClient.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: "v2", auth: oauthClient });
    const userInfo = await oauth2.userinfo.get();

    await db.oAuthToken.upsert({
      where: {
        googleId: userInfo.data.id!,
      },
      update: {
        accessToken: tokens.access_token!,
        refreshToken: tokens.refresh_token,
        expiryDate: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
        tokenType: tokens.token_type!,
        scope: tokens.scope,
      },
      create: {
        ownerId: user.id,
        googleId: userInfo.data.id!,
        googleEmail: userInfo.data.email!,
        accessToken: tokens.access_token!,
        refreshToken: tokens.refresh_token,
        tokenType: tokens.token_type!,
        scope: tokens.scope,
        expiryDate: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
      },
    });

    const response = NextResponse.redirect(new URL("/sync", req.url));

    response.cookies.set({
      name: "google_access_token",
      value: tokens.access_token!,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: tokens.expiry_date
        ? Math.max(0, Math.floor((tokens.expiry_date - Date.now()) / 1000))
        : 3600,
    });

    response.cookies.set("expiry", tokens?.expiry_date.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    response.cookies.set("google_refresh_token", tokens.refresh_token!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Token Exchange Error:", {
      message: error.message,
      redirectUri: process.env.GOOGLE_REDIRECT_URI,
    });
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
