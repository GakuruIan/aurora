import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { google } from "googleapis";
import { db } from "./lib/db";

const isProtectedRoute = createRouteMatcher(["/(main)(.*)", "/api/(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const url = req.nextUrl.pathname;

  if (url.startsWith("/api/webhooks/clerk")) {
    return NextResponse.next();
  }

  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",

    "/(main)(.*)",
  ],
};
