import prisma from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  console.log("Received task data:", JSON.stringify(body, null, 2));

  const { title, items, tags, color } = body;

  if (!title || !items || !Array.isArray(tags)) {
    console.log("Missing or invalid fields:", { title, items, tags, color });
    return NextResponse.json({ error: "Missing or invalid required fields" }, { status: 400 });
  }

  try {
    const userId = Number(session.user.id);

    const newTask = await prisma.task.create({
      data: {
        title,
        color,
        author: {
          connect: { id: userId },
        },
        items: {
          create: items.map((item: { name: string; checked: boolean }) => ({
            name: item.name,
            checked: item.checked,
          })),
        },
        tags: {
          connect: tags.map((tagId: number) => ({ id: tagId })),
        },
      },
      include: {
        items: true,
        tags: true,
      },
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json({ error: "Error creating task" }, { status: 500 });
  }
}
