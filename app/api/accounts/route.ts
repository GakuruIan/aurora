import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/current-user";

export async function GET() {
  const user = await currentUser();

  if (!user) {
    return new NextResponse("Unauthorized user", { status: 401 });
  }

  try {
    const accounts = await db.oAuthToken.findMany({
      where: {
        ownerId: user.id,
      },
      select: {
        id: true,
        googleEmail: true,
        googleId: true,
      },
    });

    if (!accounts) {
      return new NextResponse("No account found", { status: 404 });
    }

    return NextResponse.json(accounts, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
