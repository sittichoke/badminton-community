import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EmailSignInForm from "./email-signin-form";

export default async function SignInPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/");
  }

  return (
    <div className="mx-auto max-w-md space-y-4">
      <Card className="space-y-4">
        <div>
          <h1 className="text-xl font-semibold">เข้าสู่ระบบ</h1>
          <p className="text-sm text-slate-600">
            เลือกวิธีที่สะดวก หรือเข้าสู่ระบบด้วยอีเมล
          </p>
        </div>
        <EmailSignInForm />
        <div className="space-y-2">
          <Link href="/api/auth/signin/google">
            <Button className="w-full" variant="outline">
              เข้าสู่ระบบด้วย Google
            </Button>
          </Link>
          <Link href="/api/auth/signin/line">
            <Button className="w-full" variant="secondary">
              เข้าสู่ระบบด้วย LINE
            </Button>
          </Link>
        </div>
        <p className="text-sm text-slate-600">
          ยังไม่มีบัญชี?{" "}
          <Link href="/auth/signup" className="text-blue-700 underline">
            สมัครใช้งาน
          </Link>
        </p>
      </Card>
    </div>
  );
}
