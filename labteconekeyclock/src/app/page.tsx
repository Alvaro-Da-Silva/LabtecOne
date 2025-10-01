"use client";

import React from 'react';
// Contexts
import { useAuth } from '../../contexts/AuthContext';
import { useGroup } from '../../contexts/GroupContext';
import { useSidebar } from '../components/ui/sidebar';
import { useState } from 'react';

// UI
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarInset, SidebarTrigger, } from '@/components/ui/sidebar';
import { CircleAlert, EllipsisVertical, Import, LogOut, Pencil, Settings, Trash2, UserRoundCog,Camera } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import CardSites from '@/components/CardSites';
import LogoEletric from '../../public/logoEletric.svg'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';



export default function Page() {
    const { email, username, firstName, lastName, logout } = useAuth();
    const { selectedGroup } = useGroup();
    const [confirmOpen, setConfirmOpen] = React.useState(false);
    const {state} = useSidebar()
    const [profileImage, setProfileImage] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("profileImage");
    }
    return null;
  });

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string;
            setProfileImage(result);
            localStorage.setItem("profileImage", result); 
          };
          reader.readAsDataURL(file); 
        }
    };

    return (
        <>
            {/* Criação da page arredondada */}
            <SidebarInset>
                {/* Header */}
                <header className="flex h-12 shrink-0 items-center gap-2 border-b px-6">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="cursor-pointer hover:bg-secondary/20 hover:text-primary" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    {selectedGroup ? selectedGroup.name : "Nenhum grupo selecionado"}
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink
                                        href="/dashboard"
                                        className='hover:underline'
                                    >Dashboard
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    
                    <div className='flex flex-1 items-center justify-end'>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Avatar className='cursor-pointer'>
                                    {profileImage ? (
                                        <AvatarImage src={profileImage} alt="Foto de perfil" />
                                    ) : (
                                        <AvatarFallback>
                                            {firstName && lastName
                                            ? `${firstName.charAt(0)}${lastName.charAt(0)}`
                                            : username?.charAt(0)}
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="bottom" align="end">
                                <DropdownMenuLabel className='flex items-center gap-2'>
                                    <Avatar>
                                       {profileImage ? (
                                        <AvatarImage src={profileImage} alt="Foto de perfil" />
                                       ) : (
                                        <AvatarFallback>
                                            {firstName && lastName
                                            ? `${firstName.charAt(0)}${lastName.charAt(0)}`
                                            : username?.charAt(0)}
                                        </AvatarFallback>
                                       )}
                                    </Avatar>
                                    <div className='flex flex-col'>
                                        <span className='text-sm font-medium'>{username}</span>
                                        <span className="text-xs font-normal text-muted-foreground">{email}</span>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="focus:bg-secondary/20 focus:text-primary cursor-pointer"
                                    onSelect={(e) => e.preventDefault()}
                                >
                                    <label className="flex items-center gap-2 cursor-pointer w-full">
                                    <Camera className="focus:text-primary" />
                                    Alterar foto de perfil
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    </label>
                                </DropdownMenuItem>
                                <DropdownMenuItem className='focus:bg-secondary/20 focus:text-primary cursor-pointer'>
                                    <Settings className='focus:text-primary' />
                                    Configurações
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className='focus:bg-destructive/10 focus:text-destructive cursor-pointer'
                                    onSelect={() => setConfirmOpen(true)}
                                >
                                    <LogOut className='focus:text-destructive' />
                                    Sair
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    
                    {/* Dialog controlado para Logout (fora do Dropdown) */}
                    <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                        <DialogContent className='gap-0 sm:max-w-[284px]'>
                            <DialogHeader className='flex items-center mb-3 gap-1'>
                                <DialogTitle className='flex flex-col items-center gap-1'>
                                    <CircleAlert className='h-5 w-5 text-destructive' />
                                    <span>Sair da sua conta?</span>
                                </DialogTitle>
                                <DialogDescription className='text-center text-sm text-muted-foreground mt-1 mb-3'>
                                    Será necessário fazer login de novo para acessar seus grupos.
                                </DialogDescription>
                            </DialogHeader>
                            <Button
                                variant="logout"
                                size={"sm"}
                                className='mb-2 cursor-pointer'
                                onClick={logout}
                            >
                                Sair
                            </Button>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button
                                        variant="outline"
                                        size={"sm"}
                                        className='w-full hover:bg-secondary/10 hover:text-secondary cursor-pointer'>Cancelar</Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </header>
                {/* Div para os cards de apps */}
                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 p-5 flex-1 bg-background justify-items-center max-w-6xl mx-auto ${state === "collapsed" ? "gap-10" : "gap-5"}`}>
                    <CardSites
                        title="Eletric Games"
                        description="Site para jogo de eletrica"
                        content="Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima a adipisci tempora. Eaque adipisci dolor ullam non repellendus, error deserunt aliquam cupiditate neque eveniet aspernatur maiores quibusdam officia magni iure."
                        link="https://electricgames.satc.edu.br/"
                        foto={LogoEletric}
                    />
                    <CardSites
                        title="EduMind"
                        description="Site para jogo de kahoot"
                        content="Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima a adipisci tempora. Eaque adipisci dolor ullam non repellendus, error deserunt aliquam cupiditate neque eveniet aspernatur maiores quibusdam officia magni iure."
                        link="https://electricgames.satc.edu.br/"
                        foto={""}
                    />
                    <CardSites
                        title="Controle de Estoque"
                        description="Site para controle de estoque"
                        content="Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima a adipisci tempora. Eaque adipisci dolor ullam non repellendus, error deserunt aliquam cupiditate neque eveniet aspernatur maiores quibusdam officia magni iure."
                        link="https://electricgames.satc.edu.br/"
                        foto={""}
                    />
                    <CardSites
                        title="Cartão Teste"
                        description="Site para controle de estoque"
                        content="Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima a adipisci tempora. Eaque adipisci dolor ullam non repellendus, error deserunt aliquam cupiditate neque eveniet aspernatur maiores quibusdam officia magni iure."
                        link="https://electricgames.satc.edu.br/"
                        foto={""}
                    />
                </div>
                
            </SidebarInset>

            
        </>
    )
}