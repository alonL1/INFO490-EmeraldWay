import Image from "next/image";
import { cn } from "@/lib/utils/cn";

type CompassMarkProps = {
  className?: string;
  priority?: boolean;
};

export function CompassMark({ className, priority = false }: CompassMarkProps) {
  return (
    <Image
      src="/brand/compass-mark.svg"
      alt="Community Compass logo mark"
      width={88}
      height={113}
      priority={priority}
      className={cn("h-auto w-10 sm:w-12 lg:w-14", className)}
    />
  );
}
