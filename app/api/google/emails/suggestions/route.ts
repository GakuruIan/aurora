import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { currentUser } from "@/lib/current-user";

export async function GET() {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const suggestions = await db.googleEmail.findMany({
      where: {
        ownerId: user.id,
      },
      select: {
        address: true,
        name: true,
      },
    });

    return NextResponse.json(suggestions, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json("Internal server Error", { status: 500 });
  }
}
