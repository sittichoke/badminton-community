import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function SignInPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/");
  }

  return (
    <div className="mx-auto max-w-md">
      <Card className="space-y-4">
        <div>
          <h1 className="text-xl font-semibold">เข้าสู่ระบบ</h1>
          <p className="text-sm text-slate-600">
            เลือกผู้ให้บริการที่คุณสะดวก
          </p>
        </div>
        <Link href="/api/auth/signin/google">
          <Button className="w-full">เข้าสู่ระบบด้วย Google</Button>
        </Link>
        <Link href="/api/auth/signin/line">
          <Button className="w-full" variant="secondary">
            เข้าสู่ระบบด้วย LINE
          </Button>
        </Link>
      </Card>
    </div>
  );
}
