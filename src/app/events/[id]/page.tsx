import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getEventWithRelations } from "@/features/events/services";
import { JoinButton } from "@/features/events/components/join-button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { toStringArray } from "@/lib/utils";
import { format } from "date-fns";
import { th } from "date-fns/locale";

type EventPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params;
  const user = await getCurrentUser();
  const event = await getEventWithRelations(id);
  if (!event) notFound();

  const joinedCount = event.participants.filter((p) => p.status === "JOINED").length;
  const isJoined = event.participants.some(
    (p) => p.userId === user?.id && p.status === "JOINED",
  );
  const isAdmin = event.group.members.some(
    (m) => m.userId === user?.id && m.role === "ADMIN",
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold">{event.title}</h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-700">
          <Badge className="bg-emerald-100 text-emerald-700">
            {format(event.startAt, "dd MMM yyyy HH:mm", { locale: th })} -{" "}
            {format(event.endAt, "HH:mm", { locale: th })}
          </Badge>
          <Badge className="bg-blue-100 text-blue-700">
            ~{event.pricePerPerson} บาท/คน
          </Badge>
          <Badge className="bg-slate-100 text-slate-700">
            {joinedCount}/{event.maxParticipants} คน
          </Badge>
          {event.allowOverbook && (
            <Badge className="bg-amber-100 text-amber-700">รับเกินได้</Badge>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card className="space-y-4">
          <div>
            <p className="font-semibold">สถานที่</p>
            <p className="text-slate-700">{event.locationText}</p>
            {event.mapUrl && (
              <a
                href={event.mapUrl}
                className="text-sm text-blue-700 underline"
                target="_blank"
                rel="noreferrer"
              >
                เปิดแผนที่
              </a>
            )}
          </div>
          <div>
            <p className="font-semibold">ค่าใช้จ่าย</p>
            <ul className="text-sm text-slate-700">
              <li>ค่าคอร์ท: {event.courtCost} บาท</li>
              <li>ค่าลูก: {event.shuttleCost} บาท</li>
              {event.otherCost ? <li>ค่าอื่นๆ: {event.otherCost} บาท</li> : null}
            </ul>
          </div>
          <div>
            <p className="font-semibold">ระดับฝีมือ</p>
            <div className="flex flex-wrap gap-2">
              {toStringArray(event.skillLevels).map((level) => (
                <Badge key={level} className="bg-emerald-100 text-emerald-700">
                  {level}
                </Badge>
              ))}
            </div>
          </div>
          {event.notes && (
            <div>
              <p className="font-semibold">หมายเหตุ</p>
              <p className="text-sm text-slate-700 whitespace-pre-wrap">
                {event.notes}
              </p>
            </div>
          )}
          {toStringArray(event.imageUrls).length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {toStringArray(event.imageUrls).map((url) => (
                <img
                  key={url}
                  src={url}
                  alt={event.title}
                  className="h-32 w-full rounded-md object-cover"
                />
              ))}
            </div>
          )}
        </Card>

        <div className="space-y-3">
          <Card className="space-y-3">
            <p className="text-sm text-slate-700">
              กลุ่ม:{" "}
              <Link
                href={`/groups/${event.groupId}`}
                className="font-semibold text-blue-700 underline"
              >
                {event.group.name}
              </Link>
            </p>
            {user ? (
              <JoinButton eventId={event.id} joined={isJoined} />
            ) : (
              <Link href="/auth/signin" className="text-sm text-blue-700 underline">
                เข้าสู่ระบบเพื่อเข้าร่วม
              </Link>
            )}
          </Card>

          {isAdmin && (
            <Card>
              <Link
                href={`/events/${event.id}/admin`}
                className="text-sm font-semibold text-blue-700 underline"
              >
                ดูรายชื่อผู้เข้าร่วม
              </Link>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
