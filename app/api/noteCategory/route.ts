import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await currentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const categories = await db.noteCategory.findMany({
      where: {
        ownerId: user.id,
      },
      select: {
        id: true,
        name: true,
        colorCode: true,
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const user = await currentUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  try {
    const { name, colorCode } = await req.json();

    if (!name || !colorCode) {
      return NextResponse.json(
        {
          error: "Name and colorCode is required",
        },
        { status: 400 }
      );
    }

    const newCategory = await db.noteCategory.create({
      data: {
        name,
        colorCode,
        ownerId: user.id,
      },
    });

    return NextResponse.json(newCategory);
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
