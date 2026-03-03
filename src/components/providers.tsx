"use client";

import { SessionProvider } from "next-auth/react";
import { Sonner } from "@/components/ui/sonner";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider basePath="/auth">
      {children}
      <Sonner />
    </SessionProvider>
  );
};
