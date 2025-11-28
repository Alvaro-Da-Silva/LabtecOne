"use client";

import { useEffect } from "react";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "/dev/one";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  // Executa no cliente após o primeiro render
  useEffect(() => {
    // Se o caminho atual for a raiz, redireciona para a base da aplicação
    if (window.location.pathname === "/") {
      window.location.replace(baseUrl);
    }
  }, []);

  // Apenas encapsula os children; o redirecionamento ocorre no efeito acima
  return <>{children}</>;
}
