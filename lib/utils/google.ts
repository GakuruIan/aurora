import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

export const createOAuth2Client = (): OAuth2Client => {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_URL}/api/auth/callback`
  );
};
