"use client";

import { useState, useTransition } from "react";
import { z } from "zod";
import { createEventAction } from "../actions";
import { createEventSchema, skillLevelOptions } from "../schemas";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { Badge } from "@/components/ui/badge";

type FormState = z.infer<typeof createEventSchema>;

const defaultState: FormState = {
  groupId: "",
  title: "",
  date: "",
  startTime: "",
  endTime: "",
  locationText: "",
  mapUrl: "",
  courtCost: 0,
  shuttleCost: 0,
  otherCost: 0,
  maxParticipants: 8,
  allowOverbook: false,
  skillLevels: ["INTERMEDIATE"],
  notes: "",
  imageUrls: [],
};

export function CreateEventForm({ groupId }: { groupId: string }) {
  const [form, setForm] = useState<FormState>({ ...defaultState, groupId });
  const [imageInput, setImageInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const estimatedCost =
    form.maxParticipants > 0
      ? Math.ceil(
          (form.courtCost + form.shuttleCost + (form.otherCost ?? 0)) /
            form.maxParticipants,
        )
      : 0;

  const handleSkillToggle = (value: string) => {
    setForm((prev) => {
      const exists = prev.skillLevels.includes(value as any);
      const next = exists
        ? prev.skillLevels.filter((s) => s !== value)
        : [...prev.skillLevels, value as any];
      return { ...prev, skillLevels: next };
    });
  };

  const addImage = () => {
    if (!imageInput) return;
    if ((form.imageUrls?.length ?? 0) >= 5) {
      setErrors({ imageUrls: "เพิ่มรูปได้สูงสุด 5 รูป" });
      return;
    }
    setErrors({});
    setForm((prev) => ({
      ...prev,
      imageUrls: [...(prev.imageUrls ?? []), imageInput],
    }));
    setImageInput("");
  };

  const removeImage = (url: string) => {
    setForm((prev) => ({
      ...prev,
      imageUrls: (prev.imageUrls ?? []).filter((img) => img !== url),
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    const payload = {
      ...form,
      mapUrl: form.mapUrl || undefined,
      otherCost: form.otherCost ?? 0,
      imageUrls: form.imageUrls ?? [],
    };

    const parsed = createEventSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      const issues = parsed.error?.errors ?? [];
      issues.forEach((err) => {
        const key = err.path[0]?.toString() ?? "form";
        fieldErrors[key] = err.message;
      });
      setErrors(fieldErrors);
      setMessage("กรุณาแก้ไขข้อมูลที่ไม่ถูกต้อง");
      return;
    }

    setErrors({});
    startTransition(async () => {
      try {
        await createEventAction(parsed.data);
        setMessage("สร้างกิจกรรมเรียบร้อย");
      } catch (err) {
        const msg = err instanceof Error ? err.message : "ไม่สำเร็จ";
        setMessage(msg);
      }
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">ข้อมูลพื้นฐาน</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium" htmlFor="title">
                ชื่อกิจกรรม
              </label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setField("title", e.target.value)}
                placeholder="ตีแบดวันศุกร์"
                required
              />
              {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="locationText">
                สถานที่
              </label>
              <Input
                id="locationText"
                value={form.locationText}
                onChange={(e) => setField("locationText", e.target.value)}
                placeholder="สนาม XYZ บางนา"
                required
              />
              {errors.locationText && (
                <p className="text-sm text-red-600">{errors.locationText}</p>
              )}
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium" htmlFor="date">
                วันที่
              </label>
              <Input
                type="date"
                id="date"
                value={form.date}
                onChange={(e) => setField("date", e.target.value)}
                required
              />
              {errors.date && <p className="text-sm text-red-600">{errors.date}</p>}
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="startTime">
                เวลาเริ่ม
              </label>
              <Input
                type="time"
                id="startTime"
                value={form.startTime}
                onChange={(e) => setField("startTime", e.target.value)}
                required
              />
              {errors.startTime && (
                <p className="text-sm text-red-600">{errors.startTime}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="endTime">
                เวลาจบ
              </label>
              <Input
                type="time"
                id="endTime"
                value={form.endTime}
                onChange={(e) => setField("endTime", e.target.value)}
                required
              />
              {errors.endTime && (
                <p className="text-sm text-red-600">{errors.endTime}</p>
              )}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="mapUrl">
              ลิงก์แผนที่ (ถ้ามี)
            </label>
            <Input
              id="mapUrl"
              value={form.mapUrl ?? ""}
              onChange={(e) => setField("mapUrl", e.target.value)}
              placeholder="https://maps.google.com/..."
            />
            {errors.mapUrl && <p className="text-sm text-red-600">{errors.mapUrl}</p>}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">ค่าใช้จ่าย</h2>
          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium" htmlFor="courtCost">
                ค่าคอร์ท (บาท)
              </label>
              <Input
                type="number"
                min={0}
                id="courtCost"
                value={form.courtCost}
                onChange={(e) => setField("courtCost", Number(e.target.value))}
                required
              />
              {errors.courtCost && (
                <p className="text-sm text-red-600">{errors.courtCost}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="shuttleCost">
                ค่าลูก (บาท)
              </label>
              <Input
                type="number"
                min={0}
                id="shuttleCost"
                value={form.shuttleCost}
                onChange={(e) => setField("shuttleCost", Number(e.target.value))}
                required
              />
              {errors.shuttleCost && (
                <p className="text-sm text-red-600">{errors.shuttleCost}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="otherCost">
                ค่าอื่นๆ (ถ้ามี)
              </label>
              <Input
                type="number"
                min={0}
                id="otherCost"
                value={form.otherCost ?? 0}
                onChange={(e) => setField("otherCost", Number(e.target.value))}
              />
            </div>
          </div>
          <div className="rounded-md bg-slate-100 px-3 py-2 text-sm">
            ประมาณ {estimatedCost || 0} บาท/คน (คำนวณอัตโนมัติ)
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">จำนวนผู้เล่น & กติกา</h2>
          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium" htmlFor="maxParticipants">
                จำนวนสูงสุด
              </label>
              <Input
                type="number"
                min={2}
                id="maxParticipants"
                value={form.maxParticipants}
                onChange={(e) => setField("maxParticipants", Number(e.target.value))}
                required
              />
              {errors.maxParticipants && (
                <p className="text-sm text-red-600">{errors.maxParticipants}</p>
              )}
            </div>
            <div className="flex items-end">
              <Toggle
                checked={form.allowOverbook}
                onChange={(e) => setField("allowOverbook", e.target.checked)}
                label="อนุญาตรับเกิน"
              />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium">ระดับฝีมือที่รับ</p>
            <div className="flex flex-wrap gap-2">
              {skillLevelOptions.map((level) => (
                <button
                  type="button"
                  key={level}
                  onClick={() => handleSkillToggle(level)}
                  className={`rounded-full border px-3 py-1 text-xs ${
                    form.skillLevels.includes(level)
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-slate-200 text-slate-700"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            {errors.skillLevels && (
              <p className="text-sm text-red-600">{errors.skillLevels}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium">บันทึกเพิ่มเติม</label>
            <Textarea
              rows={3}
              value={form.notes ?? ""}
              onChange={(e) => setField("notes", e.target.value)}
              placeholder="เช่น ขอความร่วมมือเก็บลูกหลังจบเกม"
            />
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">รูปภาพ (สูงสุด 5)</h2>
          <div className="flex gap-2">
            <Input
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              placeholder="วางลิงก์รูป"
            />
            <Button type="button" variant="secondary" onClick={addImage}>
              เพิ่มรูป
            </Button>
          </div>
          {errors.imageUrls && (
            <p className="text-sm text-red-600">{errors.imageUrls}</p>
          )}
          <div className="flex flex-wrap gap-3">
            {(form.imageUrls ?? []).map((url) => (
              <div key={url} className="relative">
                <img
                  src={url}
                  alt="รูปกิจกรรม"
                  className="h-24 w-32 rounded-md object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="absolute right-1 top-1 rounded-full bg-white/80 px-2 py-0.5 text-xs"
                >
                  ลบ
                </button>
              </div>
            ))}
          </div>
        </section>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={isPending}>
            บันทึกกิจกรรม
          </Button>
          {message && <span className="text-sm text-slate-700">{message}</span>}
        </div>
      </form>

      <Card className="space-y-3 border-blue-100 bg-blue-50">
        <h3 className="text-lg font-semibold">พรีวิว</h3>
        <p className="text-base font-semibold">{form.title || "ชื่อกิจกรรม"}</p>
        <p className="text-sm text-slate-700">
          วันที่ {form.date || "-"} เวลา {form.startTime || "--:--"} -{" "}
          {form.endTime || "--:--"}
        </p>
        <p className="text-sm text-slate-700">
          สถานที่: {form.locationText || "ระบุสนาม"}
        </p>
        <p className="text-sm text-slate-700">
          ประมาณ {estimatedCost || 0} บาท/คน
        </p>
        <div className="flex flex-wrap gap-2">
          {form.skillLevels.map((level) => (
            <Badge key={level} className="bg-emerald-100 text-emerald-700">
              {level}
            </Badge>
          ))}
        </div>
      </Card>
    </div>
  );
}
