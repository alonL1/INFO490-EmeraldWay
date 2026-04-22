"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils/cn";
import { LoadingSpinner } from "@/components/shared/loading-spinner";

type SubmitButtonProps = {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  pendingChildren?: ReactNode;
  pendingLabel?: string;
};

export function SubmitButton({
  children,
  className,
  disabled = false,
  pendingChildren,
  pendingLabel = "Working...",
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className={cn(
        "disabled:cursor-wait disabled:opacity-70",
        className,
      )}
    >
      {pending ? (
        pendingChildren ?? (
          <>
            <LoadingSpinner className="text-current" label={pendingLabel} />
            <span>{pendingLabel}</span>
          </>
        )
      ) : (
        children
      )}
    </button>
  );
}
