import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";

type AdminPageProps = {
  params: { id: string };
};

export default async function EventAdminPage({ params }: AdminPageProps) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/signin");

  const event = await prisma.event.findUnique({
    where: { id: params.id },
    include: {
      group: { include: { members: true } },
      participants: { include: { user: true } },
    },
  });

  if (!event) redirect("/");

  const isAdmin = event.group.members.some(
    (m) => m.userId === user.id && m.role === "ADMIN",
  );
  if (!isAdmin) redirect(`/events/${event.id}`);

  const activeParticipants = event.participants.filter((p) => p.status === "JOINED");

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">สรุปผู้เข้าร่วม</h1>
      <Card className="space-y-2">
        <p className="font-semibold">
          {event.title} - {activeParticipants.length} คน
        </p>
        <ul className="divide-y divide-slate-100">
          {activeParticipants.map((p) => (
            <li key={p.id} className="py-2 text-sm">
              {p.user?.name ?? "ไม่ระบุชื่อ"} ({p.user?.email ?? "ไม่มีอีเมล"})
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
