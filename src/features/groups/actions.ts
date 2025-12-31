'use server';

import { revalidatePath } from "next/cache";
import { createGroupSchema } from "./schemas";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function createGroupAction(raw: unknown) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("ต้องเข้าสู่ระบบ");
  }
  const data = createGroupSchema.parse(raw);

  const group = await prisma.group.create({
    data: {
      name: data.name,
      description: data.description,
      coverImageUrl: data.coverImageUrl || null,
      createdById: user.id,
      members: {
        create: {
          userId: user.id,
          role: "ADMIN",
        },
      },
    },
  });

  revalidatePath("/");
  revalidatePath(`/groups/${group.id}`);
  return group;
}

export async function toggleFollowGroupAction(groupId: string) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("ต้องเข้าสู่ระบบ");
  }

  const existing = await prisma.groupFollow.findUnique({
    where: {
      userId_groupId: {
        userId: user.id,
        groupId,
      },
    },
  });

  if (existing) {
    await prisma.groupFollow.delete({ where: { id: existing.id } });
  } else {
    await prisma.groupFollow.create({
      data: { groupId, userId: user.id },
    });
  }

  revalidatePath(`/groups/${groupId}`);
  revalidatePath("/");
  return { followed: !existing };
}
