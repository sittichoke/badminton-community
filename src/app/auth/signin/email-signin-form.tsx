"use client";

import { useState, useTransition } from "react";
import type { FormEvent } from "react";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function EmailSignInForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setError(null);
    startTransition(async () => {
      const res = await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirect: false,
        callbackUrl: "/",
      });
      if (res?.error) {
        setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        return;
      }
      window.location.href = res?.url ?? "/";
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700" htmlFor="email">
          อีเมล
        </label>
        <Input type="email" name="email" id="email" required placeholder="you@example.com" />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700" htmlFor="password">
          รหัสผ่าน
        </label>
        <Input type="password" name="password" id="password" required />
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button className="w-full" disabled={pending} type="submit">
        {pending ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบด้วยอีเมล"}
      </Button>
    </form>
  );
}
