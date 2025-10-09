"use client";

import { useEffect } from "react";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "/dev/one";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
useEffect(() => {
  if (window.location.pathname === "/") {
    window.location.replace(baseUrl);
    console.log("Redirecionando para:", baseUrl);
  }
}, []);

  return <>{children}</>;
}
