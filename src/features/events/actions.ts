'use server';

import { revalidatePath } from "next/cache";
import { createEventSchema } from "./schemas";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isGroupAdmin } from "./services";

export async function createEventAction(raw: unknown) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("ต้องเข้าสู่ระบบ");
  }

  const parsed = createEventSchema.parse(raw);
  const admin = await isGroupAdmin(parsed.groupId, user.id);
  if (!admin) {
    throw new Error("ต้องเป็นแอดมินของกลุ่ม");
  }

  const startAt = new Date(`${parsed.date}T${parsed.startTime}:00`);
  const endAt = new Date(`${parsed.date}T${parsed.endTime}:00`);
  const totalCost = parsed.courtCost + parsed.shuttleCost + (parsed.otherCost ?? 0);
  const pricePerPerson = Math.ceil(totalCost / parsed.maxParticipants);

  const event = await prisma.event.create({
    data: {
      groupId: parsed.groupId,
      createdById: user.id,
      title: parsed.title,
      locationText: parsed.locationText,
      mapUrl: parsed.mapUrl || null,
      startAt,
      endAt,
      courtCost: parsed.courtCost,
      shuttleCost: parsed.shuttleCost,
      otherCost: parsed.otherCost ?? 0,
      pricePerPerson,
      maxParticipants: parsed.maxParticipants,
      allowOverbook: parsed.allowOverbook,
      skillLevels: JSON.stringify(parsed.skillLevels),
      notes: parsed.notes ?? null,
      imageUrls: JSON.stringify(parsed.imageUrls ?? []),
    },
  });

  revalidatePath("/");
  revalidatePath(`/groups/${parsed.groupId}`);
  revalidatePath(`/events/${event.id}`);
  return event;
}

export async function joinEventAction(eventId: string) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("ต้องเข้าสู่ระบบ");
  }

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { participants: true },
  });
  if (!event) throw new Error("ไม่พบกิจกรรม");

  const joinedCount = event.participants.filter((p) => p.status === "JOINED").length;
  const existing = event.participants.find((p) => p.userId === user.id);

  if (existing && existing.status === "JOINED") {
    throw new Error("เข้าร่วมแล้ว");
  }

  if (!event.allowOverbook && joinedCount >= event.maxParticipants) {
    throw new Error("เต็มแล้ว");
  }

  if (existing && existing.status === ParticipantStatus.CANCELLED) {
    await prisma.eventParticipant.update({
      where: { id: existing.id },
      data: { status: "JOINED", joinedAt: new Date() },
    });
  } else {
    await prisma.eventParticipant.create({
      data: {
        eventId,
        userId: user.id,
        status: "JOINED",
      },
    });
  }

  revalidatePath(`/events/${eventId}`);
  revalidatePath("/");
  return { ok: true };
}

export async function cancelJoinAction(eventId: string) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("ต้องเข้าสู่ระบบ");
  }

  const participant = await prisma.eventParticipant.findUnique({
    where: {
      eventId_userId: { eventId, userId: user.id },
    },
  });

  if (!participant || participant.status === "CANCELLED") {
    throw new Error("ยังไม่ได้เข้าร่วมกิจกรรม");
  }

  await prisma.eventParticipant.update({
    where: { id: participant.id },
    data: { status: "CANCELLED" },
  });

  revalidatePath(`/events/${eventId}`);
  revalidatePath("/");
  return { ok: true };
}

export async function getAdminSummaryAction(eventId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("ต้องเข้าสู่ระบบ");

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      group: true,
      participants: {
        include: { user: true },
      },
    },
  });

  if (!event) throw new Error("ไม่พบกิจกรรม");

  const admin = await isGroupAdmin(event.groupId, user.id);
  if (!admin) throw new Error("เฉพาะแอดมินเท่านั้น");

  const active = event.participants.filter((p) => p.status === "JOINED");

  return {
    count: active.length,
    participants: active.map((p) => ({
      id: p.id,
      name: p.user?.name ?? "ไม่ระบุชื่อ",
      email: p.user?.email ?? "",
      status: p.status,
    })),
  };
}
