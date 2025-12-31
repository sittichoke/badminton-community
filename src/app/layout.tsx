import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Badminton Community",
  description: "ชุมชนแบดมินตัน จัดกลุ่ม นัดเล่นง่าย",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="th">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <header className="border-b border-slate-200 bg-white/70 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
            <Link href="/" className="text-lg font-semibold">
              Badminton Community
            </Link>
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <span className="text-sm text-slate-700">
                    สวัสดี, {user.name ?? "ผู้เล่น"}
                  </span>
                  <form action="/api/auth/signout" method="post">
                    <Button type="submit" variant="secondary" size="sm">
                      ออกจากระบบ
                    </Button>
                  </form>
                </>
              ) : (
                <Link href="/auth/signin">
                  <Button size="sm">เข้าสู่ระบบ</Button>
                </Link>
              )}
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
