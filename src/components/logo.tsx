import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center", className)}>
      <Image
        src="/logo.png"
        alt="Age Restore Logo"
        width={336}
        height={336}
        className="h-32 w-32 sm:h-40 sm:w-40 md:h-48 md:w-48 object-contain"
        priority
      />
    </Link>
  );
}
