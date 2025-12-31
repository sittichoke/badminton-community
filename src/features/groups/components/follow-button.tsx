"use client";

import { useTransition, useState } from "react";
import { toggleFollowGroupAction } from "../actions";
import { Button } from "@/components/ui/button";

type FollowButtonProps = {
  groupId: string;
  isFollowing: boolean;
};

export function FollowButton({ groupId, isFollowing }: FollowButtonProps) {
  const [following, setFollowing] = useState(isFollowing);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      try {
        const result = await toggleFollowGroupAction(groupId);
        setFollowing(result.followed);
        setError(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : "ไม่สำเร็จ";
        setError(message);
      }
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant={following ? "secondary" : "primary"}
        onClick={handleClick}
        disabled={isPending}
        size="sm"
      >
        {following ? "เลิกติดตาม" : "ติดตามกลุ่ม"}
      </Button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
