"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { KeycloakSingleton, KeycloakService } from "../lib/keycloack";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
interface AuthContextType {
	isAuthenticated: boolean;
	username?: string;
	email?: string;
	token?: string;
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
	const [firstName, setFirstName] = useState<string>();
  	const [lastName, setLastName] = useState<string>();

	useEffect(() => {
		const keycloakService = new KeycloakService();

		keycloakService.init().then((authenticated) => {
			setIsAuthenticated(authenticated);

			const kc = KeycloakSingleton.getInstance();
			if (authenticated) {
				setUsername(kc.tokenParsed?.preferred_username as string | undefined);
				setEmail(kc.tokenParsed?.email as string | undefined);
				setToken(kc.token as string | undefined);
				setFirstName(kc.tokenParsed?.given_name as string | undefined);
				setLastName(kc.tokenParsed?.family_name as string | undefined);
			} else {
				kc.login();
			}
		});
	}, []);

	const kc = KeycloakSingleton.getInstance();

return (
		<AuthContext.Provider
			value={{
				isAuthenticated,
				username,
				email,
				token,
				firstName,
				lastName,
				login: () => kc.login(),
				logout: () =>
					kc.logout({
						redirectUri:
							typeof window !== "undefined"
								? window.location.origin + baseUrl
								: undefined
					})
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider");
	return context;
};

