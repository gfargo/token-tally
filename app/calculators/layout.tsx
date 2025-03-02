"use client";

import { AnimatedMainContainer } from "@/components/animated-main-container";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AnimatedMainContainer>{children}</AnimatedMainContainer>;
}
