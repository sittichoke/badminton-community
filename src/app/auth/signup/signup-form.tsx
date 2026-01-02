"use client";

import { useState, useTransition } from "react";
import type { FormEvent } from "react";
import { signIn } from "next-auth/react";
import { signUp } from "./actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignUpForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setError(null);
    startTransition(async () => {
      const result = await signUp(formData);
      if (result?.error) {
        setError(result.error);
        return;
      }
      await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirect: true,
        callbackUrl: "/",
      });
    });
  };

  return (
    <form action={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="name">
          ชื่อที่แสดง
        </label>
        <Input name="name" id="name" required placeholder="เช่น โค้ชแนน" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="email">
          อีเมล
        </label>
        <Input type="email" name="email" id="email" required placeholder="you@example.com" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="password">
          รหัสผ่าน
        </label>
        <Input type="password" name="password" id="password" required minLength={8} />
        <p className="text-xs text-slate-500">รหัสผ่านอย่างน้อย 8 ตัวอักษร</p>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button className="w-full" disabled={pending} type="submit">
        {pending ? "กำลังสร้างบัญชี..." : "สร้างบัญชีใหม่"}
      </Button>
    </form>
  );
}
