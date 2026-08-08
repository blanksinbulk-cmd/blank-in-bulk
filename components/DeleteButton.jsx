"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function DeleteButton({ action, confirmText = "Delete this item? This can't be undone.", className }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (!window.confirm(confirmText)) return;
        startTransition(async () => {
          await action();
          router.refresh();
        });
      }}
      className={className || "text-xs text-[#B23B3B] hover:underline disabled:opacity-50"}
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}
