import prisma from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { title, items } = body;

  if (!title || !items) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    const newTask = await prisma.task.create({
      data: {
        title,
        author: {
          connect: { id: Number(session.user.id) },
        },
        items: {
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
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json({ error: "Error creating task" }, { status: 500 });
  }
}
