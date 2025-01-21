"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system" // Use "system" to match user OS preference
      enableSystem
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
