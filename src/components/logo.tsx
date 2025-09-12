"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function Logo({ className }: { className?: string }) {
  const [imageError, setImageError] = useState(false);

  return (
    <Link href="/" className={cn("flex items-center", className)}>
      {!imageError ? (
        <Image
          src="/logo1.png"
          alt="Age Restore Logo"
          width={600}
          height={180}
          className="h-24 w-auto sm:h-32 md:h-40 lg:h-48 xl:h-56 object-contain"
          priority
          onError={() => setImageError(true)}
        />
      ) : (
        <span className="text-xl font-bold text-foreground">Age Restore</span>
      )}
    </Link>
  );
}
