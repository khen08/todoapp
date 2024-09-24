import UserForm from "@/components/UserForm";
import prisma from "@/prisma/db";
import { auth } from "@/auth";
import React from "react";

interface Props {
  params: { id: string };
}

const EditUser = async ({ params }: Props) => {
  const session = await auth();

  if (session?.user.role !== "ADMIN") {
    return <p className="pt-4 text-destructive">Admin access required.</p>;
  }

  const user = await prisma.user.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!user) {
    return <p className="pt-4 text-destructive">User Not Found.</p>;
  }

  user.password = "";
  return <UserForm user={user} />;
};
export default EditUser;
