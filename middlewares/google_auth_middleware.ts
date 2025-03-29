import { createOAuth2Client } from "../lib/utils/google";
import { db } from "../lib/db";
import { currentUser } from "../lib/current-user";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

async function isAccessTokenExpired(oauthClient: any): Promise<boolean> {
  try {
    await oauthClient.getAccessToken();
    return false;
  } catch (error) {
    console.log(error);
    return true;
  }
}

export async function googleRefreshTokenMiddleware(req: NextRequest) {
  const isGooglePath = req.nextUrl.pathname.startsWith("/api/google/");

  const user = await currentUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  if (!isGooglePath) {
    return NextResponse.next();
  }

  const accessToken = req.cookies.get("google_access_token")?.value;
  const refreshToken = req.cookies.get("google_refresh_token")?.value;

  if (!accessToken || !refreshToken) {
    return NextResponse.redirect(new URL("/integrations", req.url));
  }

  try {
    const oauthClient = createOAuth2Client();

    oauthClient.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    const isTokenExpired = await isAccessTokenExpired(oauthClient);

    if (isTokenExpired) {
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
          ? Math.max(
              0,
              Math.floor((credentials.expiry_date - Date.now()) / 1000)
            )
          : 3600,
      });

      if (credentials.refresh_token) {
        response.cookies.set(
          "google_refresh_token",
          credentials.refresh_token!,
          {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 7 * 24 * 60 * 60, // 7 days
          }
        );
      }

      return response;
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Token refresh error:", error);
    return NextResponse.next();
  }
}
