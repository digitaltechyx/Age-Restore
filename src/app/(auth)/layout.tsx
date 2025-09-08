import type { ReactNode } from "react";
import { Logo } from "@/components/logo";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="-mb-3 -p-4">
        <Logo className="!h-32 !w-32 sm:!h-40 sm:!w-40 md:!h-48 md:!w-48" />
      </div>
      {children}
    </div>
  );
}
