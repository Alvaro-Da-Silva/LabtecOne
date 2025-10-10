"use client";

import React from 'react';
import Link from 'next/link';

// Contexts
import { useAuth } from '../../../contexts/AuthContext';
import { useState } from 'react';

// UI
import { Button } from '@/components/ui/button'
import { Spinner } from "@/components/ui/spinner"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Settings, Camera, User, Bell, Shield, Palette, Globe } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import ImageCropper from '@/components/ImageCrooper';
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export default function ConfigsPage() {
    const { email, username, firstName, lastName, isAuthenticated } = useAuth();
    const version = process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0';

    // Estados e funções para o diálogo de confirmação de logout
    const [cropOpen, setCropOpen] = useState(false);
    const [tempImage, setTempImage] = useState<string | null>(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    // Estado para imagem de perfil (local)
    const [profilePicture, setProfilePicture] = useState<string | null>(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("profileImage");
        }
        return null;
    });

    // Estados de configurações
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [language, setLanguage] = useState('pt-BR');
    const [autoSave, setAutoSave] = useState(true);

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
    const handleSaveCropped = async (cropped: string) => {
        setUploadingImage(true);
        
        try {
            // Salvar localmente
            setProfilePicture(cropped);
            localStorage.setItem("profileImage", cropped);
            console.log('✅ Imagem de perfil atualizada com sucesso!');
        } catch (error) {
            console.error('❌ Erro ao processar imagem:', error);
        }
        
        setUploadingImage(false);
        setCropOpen(false);
    };

    return (
        <>
            <div className=''>
                <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-3 sm:px-5 h-14 border-b bg-white shadow-sm">
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
                                        onCancel={() => setCropOpen(false)}
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
                                            <p className="text-sm text-muted-foreground">@{username}</p>
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

                            {/* Seção de Notificações */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Bell className="h-5 w-5" />
                                        Notificações
                                    </CardTitle>
                                    <CardDescription>
                                        Configure como você deseja receber notificações
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="notifications">Receber notificações</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Receba alertas sobre atualizações e atividades
                                            </p>
                                        </div>
                                        <Switch
                                            id="notifications"
                                            checked={notifications}
                                            onCheckedChange={setNotifications}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="auto-save">Salvamento automático</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Salve automaticamente suas alterações
                                            </p>
                                        </div>
                                        <Switch
                                            id="auto-save"
                                            checked={autoSave}
                                            onCheckedChange={setAutoSave}
                                        />
                                    </div>
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
                                            <Label htmlFor="dark-mode">Modo escuro</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Ative o tema escuro para reduzir o cansaço visual
                                            </p>
                                        </div>
                                        <Switch
                                            id="dark-mode"
                                            checked={darkMode}
                                            onCheckedChange={setDarkMode}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Seção de Idioma */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Globe className="h-5 w-5" />
                                        Idioma e Região
                                    </CardTitle>
                                    <CardDescription>
                                        Configure o idioma da interface
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="language">Idioma</Label>
                                        <Select value={language} onValueChange={setLanguage}>
                                            <SelectTrigger className="w-full sm:w-[300px]">
                                                <SelectValue placeholder="Selecione um idioma" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                                                <SelectItem value="en-US">English (US)</SelectItem>
                                                <SelectItem value="es-ES">Español</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Seção de Segurança */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Shield className="h-5 w-5" />
                                        Segurança
                                    </CardTitle>
                                    <CardDescription>
                                        Informações sobre sua conta e segurança
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Última sessão</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Sessão atual ativa
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Versão da aplicação</Label>
                                        <p className="text-sm text-muted-foreground">
                                            {version}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Botões de ação */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                <Button className="cursor-pointer flex-1">
                                    Salvar Configurações
                                </Button>
                                <Button variant="outline" className="cursor-pointer flex-1">
                                    Restaurar Padrões
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
