import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { CreateGroupForm } from "@/features/groups/components/create-group-form";

export default async function NewGroupPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/signin");

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-2xl font-semibold">สร้างกลุ่มใหม่</h1>
      <Card>
        <CreateGroupForm />
      </Card>
    </div>
  );
}
