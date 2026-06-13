"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function registerUser(name: string, email: string, password: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("Email already registered");

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashed },
  });

  const workspace = await prisma.workspace.create({
    data: {
      name: `${name}'s Workspace`,
      members: {
        create: { userId: user.id, role: "owner" },
      },
    },
  });

  return { user, workspace };
}