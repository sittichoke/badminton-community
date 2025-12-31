import { prisma } from "@/lib/prisma";

export async function getUpcomingEvents(limit = 10) {
  const now = new Date();
  return prisma.event.findMany({
    where: {
      endAt: {
        gte: now,
      },
    },
    include: {
      group: true,
      participants: {
        where: { status: "JOINED" },
      },
    },
    orderBy: { startAt: "asc" },
    take: limit,
  });
}

export async function getPastEvents(limit = 10) {
  const now = new Date();
  return prisma.event.findMany({
    where: {
      endAt: {
        lt: now,
      },
    },
    include: {
      group: true,
      participants: {
        where: { status: "JOINED" },
      },
    },
    orderBy: { startAt: "desc" },
    take: limit,
  });
}

export async function getEventWithRelations(eventId: string) {
  return prisma.event.findUnique({
    where: { id: eventId },
    include: {
      group: {
        include: {
          members: true,
        },
      },
      participants: {
        include: { user: true },
      },
    },
  });
}

export async function getGroupWithMembership(groupId: string, userId?: string) {
  return prisma.group.findUnique({
    where: { id: groupId },
    include: {
      members: true,
      followers:
        userId !== undefined
          ? { where: { userId } }
          : false,
      events: {
        where: {
          endAt: { gte: new Date() },
        },
        orderBy: { startAt: "asc" },
      },
    },
  });
}

export async function isGroupAdmin(groupId: string, userId: string) {
  const member = await prisma.groupMember.findFirst({
    where: { groupId, userId, role: "ADMIN" },
  });
  return Boolean(member);
}
