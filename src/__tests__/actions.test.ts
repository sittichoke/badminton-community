import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  joinEventAction,
  cancelJoinAction,
  createEventAction,
  getAdminSummaryAction,
} from "@/features/events/actions";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

const eventFindUnique = vi.hoisted(() => vi.fn());
const eventCreate = vi.hoisted(() => vi.fn());
const eventParticipantCreate = vi.hoisted(() => vi.fn());
const eventParticipantUpdate = vi.hoisted(() => vi.fn());
const eventParticipantFindUnique = vi.hoisted(() => vi.fn());

const mockPrisma = vi.hoisted(() => ({
  event: {
    findUnique: eventFindUnique,
    create: eventCreate,
  },
  eventParticipant: {
    create: eventParticipantCreate,
    update: eventParticipantUpdate,
    findUnique: eventParticipantFindUnique,
  },
  groupFollow: {
    findUnique: vi.fn(),
    delete: vi.fn(),
    create: vi.fn(),
  },
}));

vi.mock("@/lib/prisma", () => ({
  prisma: mockPrisma,
}));

const getCurrentUser = vi.hoisted(() => vi.fn());
vi.mock("@/lib/auth", () => ({ getCurrentUser }));

const isGroupAdmin = vi.hoisted(() => vi.fn());
vi.mock("@/features/events/services", () => ({ isGroupAdmin }));

describe("Event actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("joins event successfully", async () => {
    getCurrentUser.mockResolvedValue({ id: "u1" });
    eventFindUnique.mockResolvedValue({
      id: "e1",
      maxParticipants: 5,
      allowOverbook: false,
      participants: [],
    });
    eventParticipantCreate.mockResolvedValue({});

    const result = await joinEventAction("e1");
    expect(result).toEqual({ ok: true });
    expect(eventParticipantCreate).toHaveBeenCalled();
  });

  it("prevents duplicate join", async () => {
    getCurrentUser.mockResolvedValue({ id: "u1" });
    eventFindUnique.mockResolvedValue({
      id: "e1",
      maxParticipants: 5,
      allowOverbook: false,
      participants: [{ userId: "u1", status: "JOINED" }],
    });

    await expect(joinEventAction("e1")).rejects.toThrow("เข้าร่วมแล้ว");
  });

  it("cancels join", async () => {
    getCurrentUser.mockResolvedValue({ id: "u1" });
    eventParticipantFindUnique.mockResolvedValue({
      id: "p1",
      status: "JOINED",
    });
    eventParticipantUpdate.mockResolvedValue({});

    await expect(cancelJoinAction("e1")).resolves.toEqual({ ok: true });
    expect(eventParticipantUpdate).toHaveBeenCalled();
  });

  it("throws when cancelling without join", async () => {
    getCurrentUser.mockResolvedValue({ id: "u1" });
    eventParticipantFindUnique.mockResolvedValue(null);

    await expect(cancelJoinAction("e1")).rejects.toThrow("ยังไม่ได้เข้าร่วมกิจกรรม");
  });

  it("requires admin to create event", async () => {
    getCurrentUser.mockResolvedValue({ id: "u1" });
    isGroupAdmin.mockResolvedValue(false);

    await expect(
      createEventAction({
        groupId: "g1",
        title: "Test",
        date: "2025-01-01",
        startTime: "10:00",
        endTime: "11:00",
        locationText: "สนาม",
        courtCost: 0,
        shuttleCost: 0,
        otherCost: 0,
        maxParticipants: 4,
        allowOverbook: false,
        skillLevels: ["BEGINNER"],
        notes: "",
        imageUrls: [],
      }),
    ).rejects.toThrow("ต้องเป็นแอดมินของกลุ่ม");
  });

  it("requires admin to view summary", async () => {
    getCurrentUser.mockResolvedValue({ id: "u1" });
    eventFindUnique.mockResolvedValue({
      id: "e1",
      groupId: "g1",
      group: {},
      participants: [],
    });
    isGroupAdmin.mockResolvedValue(false);

    await expect(getAdminSummaryAction("e1")).rejects.toThrow("เฉพาะแอดมินเท่านั้น");
  });
});
