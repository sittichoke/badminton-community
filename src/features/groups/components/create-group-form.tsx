"use client";

import { useState, useTransition } from "react";
import { createGroupAction } from "../actions";
import { createGroupSchema } from "../schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function CreateGroupForm() {
  const [state, setState] = useState({
    name: "",
    description: "",
    coverImageUrl: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    const parsed = createGroupSchema.safeParse(state);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.errors.forEach((err) => {
        const key = err.path[0]?.toString() ?? "form";
        fieldErrors[key] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    startTransition(async () => {
      try {
        await createGroupAction(parsed.data);
        setMessage("สร้างกลุ่มเรียบร้อย");
      } catch (err) {
        const msg = err instanceof Error ? err.message : "ไม่สำเร็จ";
        setMessage(msg);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">ชื่อกลุ่ม</label>
        <Input
          value={state.name}
          onChange={(e) => setState({ ...state, name: e.target.value })}
          required
        />
        {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
      </div>
      <div>
        <label className="text-sm font-medium">รายละเอียด</label>
        <Textarea
          rows={3}
          value={state.description}
          onChange={(e) => setState({ ...state, description: e.target.value })}
          required
        />
        {errors.description && (
          <p className="text-sm text-red-600">{errors.description}</p>
        )}
      </div>
      <div>
        <label className="text-sm font-medium">รูปภาพปก (ถ้ามี)</label>
        <Input
          value={state.coverImageUrl}
          onChange={(e) =>
            setState({ ...state, coverImageUrl: e.target.value })
          }
          placeholder="https://..."
        />
      </div>
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending}>
          สร้างกลุ่ม
        </Button>
        {message && <span className="text-sm text-slate-700">{message}</span>}
      </div>
    </form>
  );
}
