import { toast } from "sonner";
import api from "./api";

// Prioriza variável de ambiente para a base da API (expõe fallback já configurado em `api`)
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || '';

//Exporta um objeto `UserServer` com métodos que representam operações/endpoint.
export const UserServer = {
    // Busca dados do usuário.
    user: async () => {
        try{
            const response = await api.get(`${API_BASE.replace(/\/$/, '')}/users`);
            return response.data;
        }catch (error) {
            console.error('Erro ao buscar usuário:', error);
            throw error;
        }
    },

    // Alterar dados do usuário — aceita objeto parcial OU parâmetros separados
    // Strings vazias ou undefined não são enviadas ao backend
    EditUser: async (
        arg1?: Partial<{
            firstName: string;
            lastName: string;
            email: string;
            profilePicture: string;
            backgroundTheme: string;
        }> | string,
        firstName?: string,
        lastName?: string,
        email?: string,
        profilePicture?: string,
        backgroundTheme?: string
    ) => {
        try {
            // Normaliza payload: se o primeiro argumento for um objeto, usa ele; caso contrário monta a partir dos params.
            const payload: Partial<Record<string, unknown>> =
                arg1 && typeof arg1 === 'object' && !Array.isArray(arg1)
                    ? (arg1 as Partial<Record<string, unknown>>)
                    : {
                          username: typeof arg1 === 'string' ? arg1 : undefined,
                          firstName,
                          lastName,
                          email,
                          profilePicture,
                          backgroundTheme,
                      };

            // Constrói o body só com campos válidos (ignora undefined, null e strings vazias)
            const body: Record<string, unknown> = {};
            const setIf = (key: string, value: unknown) => {
                if (value === undefined || value === null) return;
                if (typeof value === 'string' && value.trim() === '') return;
                body[key] = value;
            };

            setIf('firstName', payload.firstName);
            setIf('lastName', payload.lastName);
            setIf('email', payload.email);
            setIf('profilePicture', payload.profilePicture);
            setIf('backgroundTheme', payload.backgroundTheme);

            if (Object.keys(body).length === 0) {
                // nada para atualizar
                return Promise.resolve();
            }

            const response = await api.patch(`${API_BASE.replace(/\/$/, '')}/users`, body);
            return response;
        } catch (error) {
            console.error('Erro ao editar usuário:', error);
            throw error;
        }
    },

    PostPicture: async (file: File, pictureType: 'profilePicture' | 'backgroundPicture') => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await api.put(
                `${API_BASE.replace(/\/$/, '')}/users/profile-pic`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    params: {
                        pictureType: pictureType
                    }
                }
            );  
            toast.success('Foto de perfil atualizada!');
            
            return response.data;
        } catch (error: any) {
            console.error('Erro ao enviar imagem:', error);
            
            // Verificar se é erro de tamanho máximo
            if (error?.response?.data?.details?.includes('Maximum upload size exceeded')) {
                toast.error('Imagem muito grande! Tamanho máximo permitido pelo servidor.');
            } else {
                toast.error('Erro ao fazer upload da imagem');
            }
            throw error;
        }
    },

    GetPicture: async (fileName: string): Promise<string | null> => {
        try {
            const response = await api.get(
                `${API_BASE.replace(/\/$/, '')}/users/profile-pic/${encodeURIComponent(fileName)}`,
                {
                    responseType: 'blob',
                }
            );

            if (response.data && response.data.size > 0) {
                // Converter blob para base64 data URL
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        resolve(reader.result as string);
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(response.data);
                });
            }
            return null;
        } catch (error: any) {
            if (error?.response?.status === 404) {
                return null;
            }
            console.error('Erro ao buscar a imagem:', error);
            return null;
        }
    }
}