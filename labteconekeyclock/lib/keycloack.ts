import Keycloak, { KeycloakInitOptions, KeycloakOnLoad } from "keycloak-js";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "/dev/one";

class KeycloakSingleton {
	private static instance: Keycloak | null = null;
	private static initialized: boolean = false;
	private static configError: string | null = null;

	static getInstance() {
		// Se há erro de configuração, retornar null ao invés de tentar criar
		if (KeycloakSingleton.configError) {
			console.warn(`Keycloak não pode ser inicializado: ${KeycloakSingleton.configError}`);
			return null;
		}

		if (!KeycloakSingleton.instance) {
			const url = process.env.NEXT_PUBLIC_KEYCLOAK_URL;
			const realm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM;
			const clientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID;

			// Validar antes de criar instância
			if (!url || !realm || !clientId) {
				KeycloakSingleton.configError = 
					`Variáveis obrigatórias não definidas: URL=${!!url}, REALM=${!!realm}, CLIENT_ID=${!!clientId}. ` +
					`Defina NEXT_PUBLIC_KEYCLOAK_OFF=true para desabilitar Keycloak.`;
				console.warn(`${KeycloakSingleton.configError}`);
				return null;
			}

			try {
				KeycloakSingleton.instance = new Keycloak({
					url,
					realm,
					clientId
				});
			} catch (err) {
				KeycloakSingleton.configError = `Erro ao criar Keycloak: ${err}`;
				console.warn(`${KeycloakSingleton.configError}`);
				return null;
			}
		}
		return KeycloakSingleton.instance;
	}

	static isInitialized() {
		return KeycloakSingleton.initialized;
	}

	static setInitialized() {
		KeycloakSingleton.initialized = true;
	}
}

export class KeycloakService {
    async init() {
        // Evita execução no server-side (SSR)
        if (typeof window === "undefined") {
            return false;
        }
		
        // Permite desabilitar Keycloak via env var em desenvolvimento
        if (process.env.KEYCLOACK_OFF === "true" || process.env.NEXT_PUBLIC_KEYCLOAK_OFF === "true") {
            console.info('Keycloak desabilitado via NEXT_PUBLIC_KEYCLOAK_OFF ou KEYCLOACK_OFF');
            return false;
        }

        // Evitar múltiplas inicializações
        if (KeycloakSingleton.isInitialized()) {
            const kc = KeycloakSingleton.getInstance();
            const auth = kc?.authenticated || false;
            return auth;
        }

        const kc = KeycloakSingleton.getInstance();
        if (!kc) {
            console.warn("Keycloak não pode ser inicializado — configuração ausente ou inválida");
            return false;
        }

        const options: KeycloakInitOptions = {
            onLoad: "login-required" as KeycloakOnLoad,
            silentCheckSsoRedirectUri: `${window.location.origin}${baseUrl}/silent-check-sso.html`,
            redirectUri: `${window.location.origin}${baseUrl}`,
        };

        console.debug("Iniciando Keycloak...", {
            silentCheckSsoUri: options.silentCheckSsoRedirectUri,
            redirectUri: options.redirectUri
        });

        let authenticated = false;

        try {
            authenticated = await kc.init(options);
        } catch (err) {
            console.warn("Keycloak init falhou:", err);
            authenticated = false;
        }

        KeycloakSingleton.setInitialized();
        return authenticated;
    }
}


export { KeycloakSingleton };