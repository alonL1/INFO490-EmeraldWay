import Image from "next/image";
import { cn } from "@/lib/utils/cn";

type CompassMarkProps = {
  className?: string;
  priority?: boolean;
};

export function CompassMark({ className, priority = false }: CompassMarkProps) {
  return (
    <Image
      src="/brand/commcompass_logo.png"
      alt="Community Compass logo mark"
      width={346}
      height={447}
      priority={priority}
      className={cn("h-auto w-[clamp(2.25rem,6vw,3.25rem)] shrink-0", className)}
    />
  );
}
