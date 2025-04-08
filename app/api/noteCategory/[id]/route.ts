import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/current-user";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await currentUser();
  const body = await req.json();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, colorCode } = body;

    if (!name || !colorCode) {
      return NextResponse.json(
        { message: "Name and color code are required" },
        { status: 400 }
      );
    }

    const noteCategory = await db.noteCategory.update({
      where: {
        id: params.id,
      },
      data: {
        name,
        colorCode,
      },
    });

    return NextResponse.json(noteCategory, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const noteCategory = await db.noteCategory.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json(noteCategory, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
