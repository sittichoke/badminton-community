import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import SignUpForm from "./signup-form";

export default async function SignUpPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/");
  }

  return (
    <div className="mx-auto max-w-md">
      <Card className="space-y-4">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">สมัครใช้งานด้วยอีเมล</h1>
          <p className="text-sm text-slate-600">ไม่มี Google/LINE ก็ใช้งานได้</p>
        </div>
        <SignUpForm />
        <p className="text-sm text-slate-600">
          มีบัญชีแล้ว?{" "}
          <Link href="/auth/signin" className="text-blue-700 underline">
            เข้าสู่ระบบ
          </Link>
        </p>
      </Card>
    </div>
  );
}
