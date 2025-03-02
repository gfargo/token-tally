"use client";

import { AnimatePresence, motion } from "framer-motion";
import type React from "react";

export function AnimatedMainContainer({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={
          typeof window !== "undefined" ? window.location.pathname : undefined
        }
        className="flex-1"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.main>
    </AnimatePresence>
  );
}
