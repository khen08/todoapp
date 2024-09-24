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
  const { taskId } = params;
  const body = await request.json();
  const { title, items } = body;

  if (!title || !items) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    const updatedTask = await prisma.task.update({
      where: { id: Number(taskId) },
      data: {
        title,
        items: {
          deleteMany: {},
          create: items.map((item: { name: string; checked: boolean }) => ({
            name: item.name,
            checked: item.checked,
          })),
        },
      },
      include: {
        items: true,
      },
    });
    return NextResponse.json(updatedTask, { status: 200 });
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
