import prisma from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

interface Params {
  taskId: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { taskId } = params;
  try {
    const task = await prisma.task.findUnique({
      where: { id: parseInt(taskId) },
      include: {
        items: true,
        tags: true,
      },
    });
    return task
      ? NextResponse.json(task, { status: 200 })
      : NextResponse.json({ error: "Task not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching task" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const taskId = parseInt(params.taskId);
    const { title, items, tags, color } = await request.json();

    const updateData: any = {};

    if (title !== undefined) updateData.title = title;
    if (color !== undefined) updateData.color = color;

    if (items !== undefined) {
      updateData.items = {
        deleteMany: {},
        create: items.map((item: any) => ({
          name: item.name,
          checked: item.checked,
        })),
      };
    }

    if (tags !== undefined) {
      updateData.tags = {
        set: Array.isArray(tags) ? tags.map((tagId: number) => ({ id: tagId })) : [],
      };
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
      include: {
        items: true,
        tags: true,
      },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json({ error: "Error updating task" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  const { taskId } = params;

  try {
    await prisma.task.delete({
      where: { id: Number(taskId) },
    });
    return NextResponse.json(
      { message: "Task deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json({ error: "Error deleting task" }, { status: 500 });
  }
}
