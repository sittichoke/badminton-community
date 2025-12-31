import { describe, it, expect } from "vitest";
import { createEventSchema } from "@/features/events/schemas";

const base = {
  groupId: "g1",
  title: "ทดสอบ",
  date: "2025-01-02",
  startTime: "10:00",
  endTime: "12:00",
  locationText: "สนาม",
  courtCost: 100,
  shuttleCost: 50,
  otherCost: 0,
  maxParticipants: 4,
  allowOverbook: false,
  skillLevels: ["BEGINNER"],
  notes: "",
  imageUrls: [],
};

describe("createEventSchema", () => {
  it("fails when endTime is before startTime", () => {
    const parsed = createEventSchema.safeParse({
      ...base,
      endTime: "09:00",
    });
    expect(parsed.success).toBe(false);
  });

  it("requires at least one skill level", () => {
    const parsed = createEventSchema.safeParse({
      ...base,
      skillLevels: [],
    });
    expect(parsed.success).toBe(false);
  });

  it("limits images to five", () => {
    const parsed = createEventSchema.safeParse({
      ...base,
      imageUrls: Array(6).fill("https://example.com/img.jpg"),
    });
    expect(parsed.success).toBe(false);
  });

  it("rejects negative costs", () => {
    const parsed = createEventSchema.safeParse({
      ...base,
      courtCost: -10,
    });
    expect(parsed.success).toBe(false);
  });

  it("accepts valid payload", () => {
    const parsed = createEventSchema.safeParse(base);
    expect(parsed.success).toBe(true);
  });
});
