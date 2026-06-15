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

async function groq(systemPrompt: string, userPrompt: string, maxTokens = 500) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      max_tokens: maxTokens,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

export async function getHookTypes() {
  return prisma.hookType.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { hooks: true } } },
  });
}

export async function getHookEmotions() {
  return prisma.hookEmotion.findMany({ orderBy: { name: "asc" } });
}

export async function getContentHooks() {
  const workspaceId = await getWorkspaceId();
  return prisma.contentHook.findMany({
    where: { content: { workspaceId } },
    include: {
      content: true,
      hookType: true,
      emotion: true,
      formula: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function addContentHook(data: {
  contentId: string;
  hookText: string;
  hookTypeId?: string;
  emotionId?: string;
  confidenceScore?: number;
}) {
  await prisma.contentHook.create({ data });
  revalidatePath("/hooks");
}

export async function classifyHook(hookText: string): Promise<{
  hookType: string;
  emotion: string;
  confidence: number;
  suggestion: string;
}> {
  const system = `Kamu adalah ahli klasifikasi hook untuk content creator Indonesia.
Berikan klasifikasi hook ke salah satu tipe berikut:
Good = Bad, Crazy Math, Broken Label, Silent Killer, Time Shock, Dark Horse, Future Shock, Hidden Pattern, Reverse Logic, Confession, Prediction, Comparison, Identity Clash, Unexpected Truth, Contrarian.

Klasifikasikan juga emotional driver-nya ke salah satu: Gain, Pain, Curiosity.

Respond ONLY with this exact JSON format, no extra text, no markdown:
{"hookType":"...","emotion":"...","confidence":0.85,"suggestion":"satu kalimat saran perbaikan dalam bahasa Indonesia"}`;

  const text = await groq(system, `Classify this hook: "${hookText}"`);

  try {
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch {
    return { hookType: "Unknown", emotion: "Curiosity", confidence: 0.5, suggestion: "" };
  }
}

export async function generateHooks(data: {
  brand: string;
  pillar: string;
  goal: string;
  hookType?: string;
}): Promise<string[]> {
  const system = `Kamu adalah penulis hook konten viral untuk media sosial (TikTok, Instagram Reels) berbahasa Indonesia.
Buat 5 hook yang powerful berdasarkan brand, content pillar, dan goal yang diberikan.
Setiap hook maksimal 1-2 kalimat, singkat, tajam, dan bikin orang berhenti scroll.
Gunakan bahasa Indonesia yang natural, gaul, dan relevan untuk audiens Indonesia.
Respond ONLY with a JSON array of strings, no extra text, no markdown:
["hook1","hook2","hook3","hook4","hook5"]`;

  const user = `Brand: ${data.brand}
Pillar: ${data.pillar}
Goal: ${data.goal}
Hook Type: ${data.hookType || "any"}

Generate 5 hooks.`;

  const text = await groq(system, user, 800);

  try {
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch {
    return [];
  }
}