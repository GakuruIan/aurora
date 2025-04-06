import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/current-user";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await currentUser();

  const { id } = params;

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  if (!id) {
    return new NextResponse("Missing route parameters", { status: 400 });
  }

  try {
    const task = await db.googleTask.findUnique({
      where: {
        taskId: id,
        ownerId: user.id,
      },
    });

    if (!task) {
      return new NextResponse("Task not found", { status: 404 });
    }

    return NextResponse.json(task, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}
