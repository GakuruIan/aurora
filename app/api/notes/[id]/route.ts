import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await currentUser();

    const { id } = params;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!id) {
      return new NextResponse("Note id is missing", { status: 400 });
    }

    const note = await db.note.findFirst({
      where: {
        id,
        ownerId: user.id,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            colorCode: true,
          },
        },
      },
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json(note);
  } catch (error) {
    console.error("Error in Fetching note", error);
    return NextResponse.json(
      {
        error: "Error in Fetching note",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await currentUser();

  const { title, content, categoryId } = await req.json();

  const { id } = params;

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  if (!id) {
    return new NextResponse("Note id is missing", { status: 400 });
  }

  try {
    if (!title || !content || !categoryId) {
      return NextResponse.json(
        {
          error: "Title ,note and category is required",
        },
        { status: 400 }
      );
    }

    // validating category

    if (categoryId) {
      const category = await db.noteCategory.findFirst({
        where: {
          id: categoryId,
        },
      });

      if (!category) {
        return NextResponse.json(
          {
            error: "Category not found or does not belong to user",
          },
          { status: 404 }
        );
      }
    }

    const note = await db.note.update({
      where: {
        id: id,
        ownerId: user.id,
      },
      data: {
        title,
        content,
        categoryId,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(note, { status: 200 });
  } catch (error) {
    console.error("Error updating note:", error);
    return NextResponse.json(
      {
        error: "Failed to create note",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await currentUser();
  const { id } = params;

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  if (!id) {
    return new NextResponse("Note id is missing", { status: 401 });
  }

  try {
    const noteId = id;
    const note = await db.note.findFirst({
      where: {
        id: noteId,
        ownerId: user.id,
      },
    });

    if (!note) {
      return new NextResponse("No note found", { status: 404 });
    }

    await db.note.delete({
      where: {
        id: noteId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error updating note:", error);
    return NextResponse.json(
      {
        error: "Failed to create note",
      },
      { status: 500 }
    );
  }
}
