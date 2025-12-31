import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CreateEventForm } from "@/features/events/components/create-event-form";
import { JoinButton } from "@/features/events/components/join-button";

const createEventAction = vi.hoisted(() => vi.fn());
const joinEventAction = vi.hoisted(() => vi.fn());
const cancelJoinAction = vi.hoisted(() => vi.fn());

vi.mock("@/features/events/actions", () => ({
  createEventAction,
  joinEventAction,
  cancelJoinAction,
}));

describe("UI components", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows cost per person estimation", async () => {
    render(<CreateEventForm groupId="g1" />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText("ชื่อกิจกรรม"), "ทดสอบ");
    await user.type(screen.getByLabelText("สถานที่"), "สนาม");
    await user.type(screen.getByLabelText("วันที่"), "2025-01-01");
    await user.type(screen.getByLabelText("เวลาเริ่ม"), "10:00");
    await user.type(screen.getByLabelText("เวลาจบ"), "12:00");
    await user.clear(screen.getByLabelText("ค่าคอร์ท (บาท)"));
    await user.type(screen.getByLabelText("ค่าคอร์ท (บาท)"), "800");
    await user.clear(screen.getByLabelText("ค่าลูก (บาท)"));
    await user.type(screen.getByLabelText("ค่าลูก (บาท)"), "200");
    await user.clear(screen.getByLabelText("จำนวนสูงสุด"));
    await user.type(screen.getByLabelText("จำนวนสูงสุด"), "10");

    expect(screen.getAllByText(/ประมาณ 100 บาท\/คน/).length).toBeGreaterThan(0);
  });

  it("JoinButton toggles joined state", async () => {
    joinEventAction.mockResolvedValue({ ok: true });
    cancelJoinAction.mockResolvedValue({ ok: true });
    render(<JoinButton eventId="e1" joined={false} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /เข้าร่วมทันที/ }));
    expect(joinEventAction).toHaveBeenCalledWith("e1");

    await user.click(screen.getByRole("button", { name: /ยกเลิกการเข้าร่วม/ }));
    expect(cancelJoinAction).toHaveBeenCalledWith("e1");
  });

  it("shows error message when submission fails", async () => {
    render(<CreateEventForm groupId="g1" />);
    const user = userEvent.setup();
    createEventAction.mockRejectedValue(new Error("ไม่สำเร็จ"));

    await user.type(screen.getByLabelText("ชื่อกิจกรรม"), "ทดสอบ");
    await user.type(screen.getByLabelText("สถานที่"), "สนาม");
    await user.type(screen.getByLabelText("วันที่"), "2025-01-01");
    await user.type(screen.getByLabelText("เวลาเริ่ม"), "10:00");
    await user.type(screen.getByLabelText("เวลาจบ"), "12:00");
    await user.clear(screen.getByLabelText("ค่าคอร์ท (บาท)"));
    await user.type(screen.getByLabelText("ค่าคอร์ท (บาท)"), "100");
    await user.clear(screen.getByLabelText("ค่าลูก (บาท)"));
    await user.type(screen.getByLabelText("ค่าลูก (บาท)"), "50");
    await user.click(screen.getByRole("button", { name: /บันทึกกิจกรรม/ }));

    expect(await screen.findByText(/ไม่สำเร็จ/)).toBeInTheDocument();
  });
});
