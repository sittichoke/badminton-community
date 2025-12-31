import Link from "next/link";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { toStringArray } from "@/lib/utils";
import { type Event, type Group } from "@prisma/client";

type EventCardProps = {
  event: Event & {
    group: Group;
    participants: { status: string }[];
  };
};

export function EventCard({ event }: EventCardProps) {
  const start = format(event.startAt, "dd MMM yyyy HH:mm", { locale: th });
  const end = format(event.endAt, "HH:mm", { locale: th });
  const joined = event.participants.filter((p) => p.status === "JOINED").length;
  const images = toStringArray(event.imageUrls);

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <Link href={`/events/${event.id}`} className="text-lg font-semibold">
            {event.title}
          </Link>
          <p className="text-sm text-slate-600">กลุ่ม: {event.group.name}</p>
        </div>
        <Badge>เริ่ม {start}</Badge>
      </div>
      <p className="text-sm text-slate-700">
        เวลา {start} - {end}
      </p>
      <p className="text-sm text-slate-700">สถานที่: {event.locationText}</p>
      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-700">
        <Badge className="bg-emerald-100 text-emerald-700">
          {joined}/{event.maxParticipants} คน
        </Badge>
        <Badge className="bg-blue-100 text-blue-700">
          ~{event.pricePerPerson} บาท/คน
        </Badge>
        {event.allowOverbook && (
          <Badge className="bg-amber-100 text-amber-700">รับเกินได้</Badge>
        )}
      </div>
      {images.length > 0 && (
        <div className="flex gap-2">
          {images.slice(0, 2).map((url) => (
            <img
              key={url}
              src={url}
              alt={event.title}
              className="h-20 w-28 rounded-md object-cover"
            />
          ))}
        </div>
      )}
    </Card>
  );
}
