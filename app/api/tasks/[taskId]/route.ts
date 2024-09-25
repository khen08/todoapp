import prisma from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";

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
  request: Request,
  { params }: { params: { taskId: string } }
) {
  try {
    const taskId = parseInt(params.taskId);
    const { title, items, tags, color } = await request.json();

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        title,
        color,
        items: {
          deleteMany: {},
          create: items.map((item: any) => ({
            name: item.name,
            checked: item.checked,
          })),
        },
        tags: {
          set: tags.set,
        },
      },
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
