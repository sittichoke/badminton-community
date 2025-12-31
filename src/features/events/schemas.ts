import { z } from "zod";

export const skillLevelOptions = [
  "BEGINNER",
  "INTERMEDIATE",
  "ADVANCED",
  "COMPETITIVE",
] as const;

export type SkillLevel = (typeof skillLevelOptions)[number];

export const createEventSchema = z
  .object({
    groupId: z.string().min(1, "ต้องเลือกกลุ่ม"),
    title: z.string().min(3, "กรุณากรอกชื่อกิจกรรม"),
    date: z.string().min(1, "กรุณาเลือกวัน"),
    startTime: z.string().min(1, "กรุณาเลือกเวลาเริ่ม"),
    endTime: z.string().min(1, "กรุณาเลือกเวลาจบ"),
    locationText: z.string().min(3, "กรุณากรอกสถานที่"),
    mapUrl: z
      .string()
      .url("ต้องเป็น URL")
      .optional()
      .or(z.literal("")),
    courtCost: z.number().int().min(0, "ค่าคอร์ทต้องไม่ติดลบ"),
    shuttleCost: z.number().int().min(0, "ค่าลูกขนไก่ต้องไม่ติดลบ"),
    otherCost: z.number().int().min(0).optional(),
    maxParticipants: z.number().int().min(2, "ต้องมีอย่างน้อย 2 คน"),
    allowOverbook: z.boolean().default(false),
    skillLevels: z.array(z.enum(skillLevelOptions)).min(1, "เลือกระดับอย่างน้อย 1"),
    notes: z.string().optional(),
    imageUrls: z.array(z.string().url("ต้องเป็น URL")).max(5, "รูปไม่เกิน 5").default([]),
  })
  .refine(
    (data) => {
      const start = new Date(`${data.date}T${data.startTime}:00`);
      const end = new Date(`${data.date}T${data.endTime}:00`);
      return end.getTime() > start.getTime();
    },
    { message: "เวลาจบต้องหลังเวลาเริ่ม", path: ["endTime"] },
  );

export type CreateEventInput = z.infer<typeof createEventSchema>;
