"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function getWorkspaceId() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const member = await prisma.workspaceMember.findFirst({
    where: { userId: session.user.id },
  });
  if (!member) throw new Error("No workspace found");
  return member.workspaceId;
}

export async function getContents() {
  const workspaceId = await getWorkspaceId();
  return prisma.content.findMany({
    where: { workspaceId },
    include: { pillar: true, tags: { include: { tag: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function createContent(data: {
  title: string;
  platform?: string;
  contentType?: string;
  pillarId?: string;
  publishDate?: string;
  brief?: string;
  referenceUrl?: string;
  notes?: string;
}) {
  const workspaceId = await getWorkspaceId();
  await prisma.content.create({
    data: {
      workspaceId,
      title: data.title,
      platform: data.platform,
      contentType: data.contentType,
      pillarId: data.pillarId || null,
      publishDate: data.publishDate ? new Date(data.publishDate) : null,
      brief: data.brief,
      referenceUrl: data.referenceUrl,
      notes: data.notes,
      status: "idea",
    },
  });
  revalidatePath("/planner");
}

export async function updateContentStatus(id: string, status: string) {
  await prisma.content.update({ where: { id }, data: { status } });
  revalidatePath("/planner");
}

export async function updateContent(id: string, data: {
  title?: string;
  platform?: string;
  contentType?: string;
  brief?: string;
  referenceUrl?: string;
  notes?: string;
  publishDate?: string;
  status?: string;
}) {
  await prisma.content.update({
    where: { id },
    data: {
      ...data,
      publishDate: data.publishDate ? new Date(data.publishDate) : undefined,
    },
  });
  revalidatePath("/planner");
}

export async function deleteContent(id: string) {
  await prisma.content.delete({ where: { id } });
  revalidatePath("/planner");
}

export async function getPillars() {
  const workspaceId = await getWorkspaceId();
  return prisma.contentPillar.findMany({ where: { workspaceId } });
}

export async function createPillar(name: string, description?: string) {
  const workspaceId = await getWorkspaceId();
  await prisma.contentPillar.create({
    data: { workspaceId, name, description },
  });
  revalidatePath("/planner");
}