"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import Package from '../../../package.json';

//API
import { UserServer } from '@/services/UserService';

// Contexts
import { useAuth } from '../../../contexts/AuthContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { useState } from 'react';

// UI
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Spinner } from "@/components/ui/spinner"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Settings, Camera, User, Shield, Palette, Sun, Moon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Toaster } from "@/components/ui/sonner";
import ImageCropper from '@/components/ImageCrooper';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';

// Schema de validação dos campos do formulário de perfil
// zod para validação e react-hook-form para gerenciamento do formulário
const baseSchema = z.object({
    firstName: z.string()
        .min(3, "Nome deve ter pelo menos 3 caracteres.")
        .max(100, "Nome deve ter no máximo 100 caracteres.")
        .nonempty("Nome é obrigatório."),
    lastName: z.string()
        .min(3, "Sobrenome deve ter pelo menos 3 caracteres.")
        .max(100, "Sobrenome deve ter no máximo 100 caracteres.")
        .nonempty("Sobrenome é obrigatório."),
    username: z.string()
        .min(3, "Nome de usuário deve ter pelo menos 3 caracteres.")
        .max(50, "Nome de usuário deve ter no máximo 50 caracteres.")
        .nonempty("Nome de usuário é obrigatório."),
    email: z.string().email("Email inválido.").nonempty("Email é obrigatório."),
})

export default function ConfigsPage() {
    const { email, username, firstName, lastName, isAuthenticated } = useAuth();
    const { theme, setTheme } = useTheme();
    const [UserData, setUserData] = useState([])
    const [loading, setLoading] = useState(true);

    type FormValues = z.infer<typeof baseSchema>;
    
    const form = useForm<FormValues>({
        mode: "onChange",
        reValidateMode: "onChange",
        resolver: zodResolver(baseSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            username: "",
        }
    })

    // Buscar dados do usuário ao carregar
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await UserServer.user();
                
                if (data) {
                    setUserData(data);
                    
                    // Carregar tema do banco se disponível
                    if (data.backgroundTheme && (data.backgroundTheme === 'BG_LIGHT' || data.backgroundTheme === 'BG_DARK')) {
                        setTheme(data.backgroundTheme);
                    }
                    
                    // Carregar foto de perfil do backend
                    if (data.profilePictureUrl) {
                        // Se for URL completa, usar diretamente
                        if (data.profilePictureUrl.startsWith('http')) {
                            setProfilePicture(data.profilePictureUrl);
                        } else {
                            // Se for nome de arquivo, buscar via API
                            const imageData = await UserServer.GetPicture(data.profilePictureUrl);
                            if (imageData) {
                                setProfilePicture(imageData);
                            } 
                        }
                    } 
                }
            } catch (error) {
                console.error('Erro ao buscar dados do usuário:', error);
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchUserData();
        } else {
            setLoading(false);
        }
    }, [isAuthenticated, setTheme]);

    useEffect(() => {
        if (isAuthenticated && firstName && lastName && email && username) {
            form.reset({
                firstName: firstName || "",
                lastName: lastName || "",
                email: email || "",
                username: username || "",
            });
        }
    }, [isAuthenticated, firstName, lastName, email, username, form]);



    const handleUpdateProfile = async (data: FormValues) => {
        try {
            await UserServer.EditUser({
                username: data.username,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
            });
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            toast.error('Erro ao atualizar perfil');
        }
    };

    const handleToggleTheme = async () => {
        const newTheme = theme === 'BG_LIGHT' ? 'BG_DARK' : 'BG_LIGHT';
        
        try {
            // Salvar no backend
            await UserServer.EditUser({
                backgroundTheme: newTheme,
            });
            // Recarregar dados do backend para confirmar a mudança
            const data = await UserServer.user();
            if (data.backgroundTheme && (data.backgroundTheme === 'BG_LIGHT' || data.backgroundTheme === 'BG_DARK')) {
                setTheme(data.backgroundTheme);
            }
        } catch (error) {
            console.error('Erro ao atualizar tema:', error);
            toast.error('Erro ao atualizar tema');
        }
    }

    // Estado para imagem de perfil (do backend)
    const [profilePicture, setProfilePicture] = useState<string | null>(null);

    const [cropOpen, setCropOpen] = useState(false);
    const [tempImage, setTempImage] = useState<string | null>(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setTempImage(result);
                setCropOpen(true);
            };
            reader.readAsDataURL(file);
        }
    };

    // Função para salvar a imagem cortada
    const handleSaveCropped = async (croppedBase64: string) => {
        console.log('handleSaveCropped chamado com base64 de tamanho:', croppedBase64.length);
        setUploadingImage(true);
        
        try {
            // Converter base64 para blob
            const response = await fetch(croppedBase64);
            let blob = await response.blob();
            
            // Se o arquivo for maior que 800KB, redimensionar ainda mais
            const MAX_SIZE = 800 * 1024; // 800KB
            if (blob.size > MAX_SIZE) {
                // Redimensionar a imagem
                const img = new Image();
                img.src = croppedBase64;
                await img.decode();
                
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Reduzir tamanho mantendo proporção
                const maxDimension = 800;
                let width = img.width;
                let height = img.height;
                
                if (width > height && width > maxDimension) {
                    height = (height * maxDimension) / width;
                    width = maxDimension;
                } else if (height > maxDimension) {
                    width = (width * maxDimension) / height;
                    height = maxDimension;
                }
                
                canvas.width = width;
                canvas.height = height;
                ctx?.drawImage(img, 0, 0, width, height);
                
                // Converter com qualidade reduzida
                const resizedBase64 = canvas.toDataURL('image/jpeg', 0.6);
                const resizedResponse = await fetch(resizedBase64);
                blob = await resizedResponse.blob();
                
                console.log('Imagem redimensionada:', { 
                    tamanhoOriginal: response.blob().then(b => b.size),
                    tamanhoNovo: blob.size 
                });
            }
            
            const file = new File([blob], 'profile.jpg', { type: 'image/jpeg' });
            console.log('📤 Enviando arquivo:', file.size, 'bytes');
            
            // Enviar para o backend
            await UserServer.PostPicture(file, 'profilePicture');
            
            console.log('✅ Upload concluído! Recarregando dados do usuário...');
            
            // Aguardar um pouco para o backend processar
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Recarregar dados do usuário para obter o nome da imagem atualizada
            const userData = await UserServer.user();
            console.log('📦 Dados do usuário após upload:', userData);
            
            if (userData?.profilePictureUrl) {
                console.log('📸 URL da imagem atualizada:', userData.profilePictureUrl);
                
                // Se for URL completa do MinIO, usar diretamente
                if (userData.profilePictureUrl.startsWith('http')) {
                    setProfilePicture(userData.profilePictureUrl);
                    console.log('✅ Imagem de perfil atualizada com sucesso!');
                } else {
                    // Se for nome de arquivo, buscar via API
                    const imageData = await UserServer.GetPicture(userData.profilePictureUrl);
                    
                    if (imageData) {
                        setProfilePicture(imageData);
                        console.log('✅ Imagem de perfil atualizada com sucesso!');
                    } else {
                        console.warn('⚠️ Upload bem-sucedido mas não foi possível carregar a imagem');
                    }
                }
            } else {
                console.warn('⚠️ Upload bem-sucedido mas campo profilePictureUrl ainda está vazio');
            }
        } catch (error) {
            console.error('❌ Erro ao processar imagem:', error);
            // Não duplicar o toast, pois já é exibido no UserService
        } finally {
            setUploadingImage(false);
            setCropOpen(false);
            setTempImage(null);
        }
    };

    return (
        <>
            <Toaster />
            <div className=''>
                <header className="fixed top-0 left-0 right-0 z-50 flex items-center bg-background justify-between px-3 sm:px-5 h-14 border-b shadow-sm">
                    <div className="flex items-center gap-2">
                        <Link href="/">
                            <Button variant="ghost" size="sm" className="gap-2 cursor-pointer">
                                <ArrowLeft className="h-4 w-4" />
                                Voltar
                            </Button>
                        </Link>
                    </div>
                    
                    <Dialog open={cropOpen} onOpenChange={setCropOpen}>
                        <DialogContent className="sm:max-w-[400px]">
                            <DialogHeader>
                                <DialogTitle>
                                    {uploadingImage ? 'Salvando imagem...' : 'Ajustar foto de perfil'}
                                </DialogTitle>
                            </DialogHeader>
                            {uploadingImage ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="flex flex-col items-center gap-3">
                                        <Spinner className="h-8 w-8 text-primary" />
                                        <span className="text-sm text-muted-foreground">
                                            Processando imagem...
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                tempImage && (
                                    <ImageCropper
                                        imageSrc={tempImage}
                                        onSave={handleSaveCropped}
                                        onCancel={() => {
                                            setCropOpen(false);
                                            setTempImage(null);
                                        }}
                                    />
                                )
                            )}
                        </DialogContent>
                    </Dialog>
                </header>

                {/* Conteúdo principal das configurações */}
                <div className="pt-16 sm:pt-20 p-3 sm:p-5 bg-background min-h-screen">
                    {!isAuthenticated ? (
                        <div className="flex items-center justify-center py-16 sm:py-24">
                            <div className="flex flex-col items-center gap-2 sm:gap-3">
                                <Spinner className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                                <span className="text-xs sm:text-sm text-muted-foreground">Carregando...</span>
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-4xl mx-auto space-y-6">
                            {/* Título da página */}
                            <div className="flex items-center gap-3 mb-6">
                                <Settings className="h-6 w-6 text-primary" />
                                <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
                            </div>

                            {/* Seção de Perfil */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="h-5 w-5" />
                                        Perfil do Usuário
                                    </CardTitle>
                                    <CardDescription>
                                        Gerencie suas informações pessoais e foto de perfil
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-16 w-16">
                                            {profilePicture ? (
                                                <AvatarImage src={profilePicture} alt="Foto de perfil" />
                                            ) : (
                                                <AvatarFallback className="text-lg">
                                                    {firstName && lastName
                                                    ? `${firstName.charAt(0)}${lastName.charAt(0)}`
                                                    : username?.charAt(0)}
                                                </AvatarFallback>
                                            )}
                                        </Avatar>
                                        <div className="flex-1">
                                            <h3 className="font-medium">{firstName} {lastName}</h3>
                                            <p className="text-sm text-muted-foreground">{email}</p>
                                        </div>
                                        <label className="cursor-pointer">
                                            <Button variant="outline" size="sm" asChild>
                                                <span>
                                                    <Camera className="h-4 w-4 mr-2" />
                                                    Alterar Foto
                                                </span>
                                            </Button>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                </CardContent>
                            </Card>

                           {/* Seção de Informações da Conta */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    Informações da conta
                                </CardTitle>
                                <CardDescription>
                                    Gerencie suas informações
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...form}>
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        form.handleSubmit(handleUpdateProfile)();
                                    }} className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="firstName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Nome</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Digite seu nome" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="lastName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Sobrenome</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Digite seu sobrenome" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="username"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Nome de usuário</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Digite seu nome de usuário" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Digite seu email" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className='flex justify-end'>
                                            <Button className="cursor-pointer" type='submit'>
                                                Salvar Configurações
                                            </Button>
                                        </div>       

                                    </form>
                                </Form>
                            </CardContent>
                        </Card>

                            {/* Seção de Aparência */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Palette className="h-5 w-5" />
                                        Aparência
                                    </CardTitle>
                                    <CardDescription>
                                        Personalize a aparência da aplicação
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label className="text-base">Tema</Label>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                {theme === 'BG_DARK' ? (
                                                    <>
                                                        <Moon className="h-4 w-4" />
                                                        <span>Tema escuro ativado</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Sun className="h-4 w-4" />
                                                        <span>Tema claro ativado</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <Switch
                                            checked={theme === 'BG_DARK'}
                                            onCheckedChange={handleToggleTheme}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Seção de Segurança */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Shield className="h-5 w-5" />
                                        Informações sobre a aplicação
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Versão da aplicação</Label>
                                        <p className="text-sm text-muted-foreground">
                                            {Package.version}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
