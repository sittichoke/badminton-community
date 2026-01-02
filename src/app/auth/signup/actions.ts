"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { z } from "zod";

const signUpSchema = z.object({
  name: z.string().min(1, "กรุณาระบุชื่อ"),
  email: z.string().email("อีเมลไม่ถูกต้อง").toLowerCase(),
  password: z.string().min(8, "รหัสผ่านอย่างน้อย 8 ตัวอักษร"),
});

export async function signUp(formData: FormData) {
  const parsed = signUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง" };
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing?.hashedPassword) {
    return { error: "อีเมลนี้มีบัญชีอยู่แล้ว" };
  }

  const hashedPassword = await hashPassword(password);

  await prisma.user.upsert({
    where: { email },
    update: {
      name: existing?.name ?? name,
      hashedPassword,
    },
    create: {
      name,
      email,
      hashedPassword,
    },
  });

  return { success: true };
}
