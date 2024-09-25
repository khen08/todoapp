import prisma from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = Number(session.user.id);
    const tags = await prisma.tag.findMany({
      where: { userId: userId },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(tags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json({ error: "Error fetching tags" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = Number(session.user.id);
    const { name, color } = await request.json();

    const newTag = await prisma.tag.create({
      data: {
        name,
        color,
        userId,
      },
    });

    return NextResponse.json(newTag, { status: 201 });
  } catch (error) {
    console.error("Error creating tag:", error);
    return NextResponse.json({ error: "Error creating tag" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = Number(session.user.id);
    const { tagIds } = await request.json();

    await prisma.tag.deleteMany({
      where: {
        id: { in: tagIds },
        userId: userId,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting tags:", error);
    return NextResponse.json({ error: "Error deleting tags" }, { status: 500 });
  }
}
