import { z } from "zod";

export const createGroupSchema = z.object({
  name: z.string().min(3, "กรุณากรอกชื่อกลุ่ม"),
  description: z.string().min(10, "รายละเอียดอย่างน้อย 10 ตัวอักษร"),
  coverImageUrl: z
    .string()
    .url("ต้องเป็น URL")
    .optional()
    .or(z.literal("")),
});

export type CreateGroupInput = z.infer<typeof createGroupSchema>;
