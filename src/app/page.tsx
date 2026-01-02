import Link from "next/link";
import { getUpcomingEvents, getPastEvents } from "@/features/events/services";
import { EventCard } from "@/features/events/components/event-card";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const user = await getCurrentUser();
  const upcoming = await getUpcomingEvents();
  const past = await getPastEvents(4);
  const followedIds =
    user &&
    (
      await prisma.groupFollow.findMany({
        where: { userId: user.id },
        select: { groupId: true },
      })
    ).map((f) => f.groupId);

  const params = searchParams ? await searchParams : undefined;
  const onlyFollowing = params?.followed === "1";
  const filteredUpcoming =
    onlyFollowing && followedIds
      ? upcoming.filter((e) => followedIds.includes(e.groupId))
      : upcoming;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">กิจกรรมแบดมินตัน</h1>
          <p className="text-slate-700">
            เรียงตามวันเริ่ม ใครๆ ก็เข้ามาดูและเข้าร่วมได้ทันที
          </p>
        </div>
        <div className="flex gap-2">
          {user && (
            <Link href="/groups/new">
              <Button variant="secondary">สร้างกลุ่ม</Button>
            </Link>
          )}
          {user && (
            <Link href={onlyFollowing ? "/" : "/?followed=1"}>
              <Button>{onlyFollowing ? "ดูทั้งหมด" : "เฉพาะกลุ่มที่ติดตาม"}</Button>
            </Link>
          )}
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">กำลังจะมาถึง</h2>
        {filteredUpcoming.length === 0 ? (
          <Card className="text-slate-700">
            ยังไม่มีกิจกรรม {onlyFollowing ? "จากกลุ่มที่ติดตาม" : ""}
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredUpcoming.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">ที่ผ่านมา</h2>
        {past.length === 0 ? (
          <Card className="text-slate-700">ยังไม่มีประวัติกิจกรรม</Card>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {past.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
