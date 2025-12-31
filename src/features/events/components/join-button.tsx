"use client";

import { useTransition, useState } from "react";
import { joinEventAction, cancelJoinAction } from "../actions";
import { Button } from "@/components/ui/button";

type JoinButtonProps = {
  eventId: string;
  joined: boolean;
};

export function JoinButton({ eventId, joined }: JoinButtonProps) {
  const [isJoined, setIsJoined] = useState(joined);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    setError(null);
    startTransition(async () => {
      try {
        if (isJoined) {
          await cancelJoinAction(eventId);
          setIsJoined(false);
        } else {
          await joinEventAction(eventId);
          setIsJoined(true);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "ไม่สำเร็จ";
        setError(message);
      }
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <Button onClick={handleClick} disabled={isPending} size="md">
        {isJoined ? "ยกเลิกการเข้าร่วม" : "เข้าร่วมทันที"}
      </Button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
