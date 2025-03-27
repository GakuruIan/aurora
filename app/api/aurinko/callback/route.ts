import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { getAccountDetails, getAurinkoToken } from "@/lib/aurinko";

export const GET = async (req: NextRequest) => {
  const user = await currentUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const params = req.nextUrl.searchParams;
    const status = params.get("status");

    if (status !== "success") {
      return NextResponse.json("Failed to link account", { status: 400 });
    }

    const code = params.get("code");

    if (!code) {
      return NextResponse.json("No code was provided", { status: 400 });
    }

    const token = await getAurinkoToken(code);

    if (!token) {
      return NextResponse.json("Failed to exchange token for code", {
        status: 400,
      });
    }

    const accountDetails = await getAccountDetails(token.accessToken);

    //    add details to databases
    await db.linkedAccount.upsert({
      where: {
        id: token.accountId.toString(),
      },
      update: {
        accessToken: token.accessToken,
      },
      create: {
        id: token.accountId.toString(),
        ownerId: user.id,
        email: accountDetails.email,
        name: accountDetails.name,
        accessToken: token.accessToken,
      },
    });

    return NextResponse.redirect(new URL("/emails", req.url));
  } catch (error) {
    console.error("Error creating note:", error);
    return NextResponse.json(
      {
        error: "Failed to create note",
      },
      { status: 500 }
    );
  }
};
