import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CreateEventForm } from "@/features/events/components/create-event-form";
import { Card } from "@/components/ui/card";

type Props = {
  params: { id: string };
};

export default async function GroupCreateEventPage({ params }: Props) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/signin");

  const membership = await prisma.groupMember.findFirst({
    where: { groupId: params.id, userId: user.id, role: "ADMIN" },
  });

  if (!membership) {
    redirect(`/groups/${params.id}`);
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">สร้างกิจกรรมใหม่</h1>
      <Card>
        <CreateEventForm groupId={params.id} />
      </Card>
    </div>
  );
}
