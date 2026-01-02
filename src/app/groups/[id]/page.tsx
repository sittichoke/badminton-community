import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { FollowButton } from "@/features/groups/components/follow-button";
import { EventCard } from "@/features/events/components/event-card";

type GroupPageProps = {
  params: Promise<{ id: string }>;
};

export default async function GroupPage({ params }: GroupPageProps) {
  const { id } = await params;
  const user = await getCurrentUser();

  const group = await prisma.group.findUnique({
    where: { id },
    include: {
      members: true,
      ...(user
        ? {
            followers: {
              where: { userId: user.id },
            },
          }
        : {}),
      events: {
        where: { endAt: { gte: new Date() } },
        include: {
          group: true,
          participants: true,
        },
        orderBy: { startAt: "asc" },
      },
    },
  });

  if (!group) {
    notFound();
  }

  const isFollowing = !!group.followers && group.followers.length > 0;
  const isAdmin = user
    ? group.members.some((m) => m.userId === user.id && m.role === "ADMIN")
    : false;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{group.name}</h1>
          <p className="text-slate-700">{group.description}</p>
        </div>
        <div className="flex items-center gap-3">
          {user && <FollowButton groupId={group.id} isFollowing={isFollowing} />}
          {isAdmin && (
            <Link
              href={`/groups/${id}/create-event`}
              className="text-sm font-semibold text-blue-700 underline"
            >
              สร้างกิจกรรม
            </Link>
          )}
        </div>
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">กิจกรรมที่กำลังจะมาถึง</h2>
          {!isAdmin && user && (
            <span className="text-sm text-slate-600">
              {group.events.length} กิจกรรม
            </span>
          )}
        </div>
        <div className="grid gap-4">
          {group.events.length === 0 && (
            <Card className="text-slate-700">ยังไม่มีกิจกรรม</Card>
          )}
          {group.events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>
    </div>
  );
}
