import { createOAuth2Client } from "@/lib/utils/google";
import { NextResponse } from "next/server";

const SCOPES = [
  // Gmail API scopes
  "https://www.googleapis.com/auth/gmail.modify",
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/gmail.compose",

  // Calendar API scope
  "https://www.googleapis.com/auth/calendar",

  // Tasks API scope
  "https://www.googleapis.com/auth/tasks",

  // accessing user info
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

export function generateAuthURL() {
  const oauthClient = createOAuth2Client();

  const authUrl = oauthClient.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });
  return authUrl;
}

export async function GET() {
  try {
    const authUrl = generateAuthURL();
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("Error generating auth URL:", error);
    return NextResponse.json(
      { error: "Failed to generate auth URL" },
      { status: 500 }
    );
  }
}
