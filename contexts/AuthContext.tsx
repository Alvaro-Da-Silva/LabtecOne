"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef
} from "react";
import { KeycloakSingleton, KeycloakService } from "../lib/keycloack";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

interface AuthContextType {
  isAuthenticated: boolean;
  username?: string;
  email?: string;
  token?: string;
  tokenParsed?: any;
  firstName?: string;
  lastName?: string;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [token, setToken] = useState<string>();
  const [tokenParsed, setTokenParsed] = useState<any>();
  const [firstName, setFirstName] = useState<string>();
  const [lastName, setLastName] = useState<string>();

  // Keycloak nunca deve ser criado no topo → somente no browser
  const kcRef = useRef<any>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Criar instância APÓS garantir que está no browser
    kcRef.current = KeycloakSingleton.getInstance();

    const keycloakService = new KeycloakService();

    // Modo mock
    if (process.env.NEXT_PUBLIC_AUTH_MOCK === "true") {
      console.info("AUTH MOCK ativo — usuário fake carregado.");

      setIsAuthenticated(true);
      setUsername(process.env.NEXT_PUBLIC_AUTH_MOCK_USERNAME || "dev.user");
      setEmail(process.env.NEXT_PUBLIC_AUTH_MOCK_EMAIL || "dev.user@example.com");
      setToken(process.env.NEXT_PUBLIC_AUTH_MOCK_TOKEN || "mock-token");
      setTokenParsed({
        preferred_username:
          process.env.NEXT_PUBLIC_AUTH_MOCK_USERNAME || "dev.user"
      });

      return;
    }

    // Keycloak OFF
    if (
      process.env.NEXT_PUBLIC_KEYCLOAK_OFF === "true" ||
      process.env.KEYCLOACK_OFF === "true"
    ) {
      console.warn("Keycloak desabilitado via env.");
      setIsAuthenticated(false);
      return;
    }

    // Inicialização real
    keycloakService
      .init()
      .then((authenticated) => {
        const kc = kcRef.current;

        setIsAuthenticated(authenticated);

        if (authenticated && kc) {
          setUsername(kc.tokenParsed?.preferred_username);
          setEmail(kc.tokenParsed?.email);
          setToken(kc.token);
          setTokenParsed(kc.tokenParsed);
          setFirstName(kc.tokenParsed?.given_name);
          setLastName(kc.tokenParsed?.family_name);

          if (kc.token) {
            localStorage.setItem("token", kc.token);
          }
        } else {
          // Se não autenticado → tenta login se Keycloak estiver ativo
          if (
            !(
              process.env.NEXT_PUBLIC_KEYCLOAK_OFF === "true" ||
              process.env.KEYCLOACK_OFF === "true"
            )
          ) {
            try {
              kc?.login();
            } catch (err) {
              console.warn("Erro ao iniciar login:", err);
            }
          }
        }
      })
      .catch((err) => {
        console.error("Erro ao inicializar Keycloak:", err);
      });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        username,
        email,
        token,
        tokenParsed,
        firstName,
        lastName,
        login: () => {
          if (!kcRef.current) {
            console.warn("Keycloak não está disponível para fazer login");
            return;
          }
          kcRef.current.login();
        },
        logout: () => {
          if (typeof window !== "undefined") {
            localStorage.removeItem("token");
          }

          if (!kcRef.current) {
            console.warn("Keycloak não está disponível para fazer logout");
            return;
          }

          kcRef.current.logout({
            redirectUri:
              typeof window !== "undefined"
                ? window.location.origin + (baseUrl || "/")
                : undefined
          });
        }
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return context;
};
