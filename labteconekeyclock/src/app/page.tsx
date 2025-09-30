"use client";

import React from 'react';
// Contexts
import { useAuth } from '../../contexts/AuthContext';
import { useGroup } from '../../contexts/GroupContext';

// UI
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { SidebarInset, SidebarTrigger, } from '@/components/ui/sidebar';
import { CircleAlert, EllipsisVertical, Import, LogOut, Pencil, Settings, Trash2, UserRoundCog } from 'lucide-react';
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
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CardSites from '@/components/CardSites';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';



export default function Page() {
    const { email, username, firstName, lastName, logout } = useAuth();
    const { selectedGroup } = useGroup();
    const [confirmOpen, setConfirmOpen] = React.useState(false);

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
                                    <AvatarFallback>
                                        {firstName && lastName ? `${firstName.charAt(0)}${lastName.charAt(0)}` : username?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="bottom" align="end">
                                <DropdownMenuLabel className='flex items-center gap-2'>
                                    <Avatar>
                                        <AvatarFallback>
                                            {firstName && lastName ? `${firstName.charAt(0)}${lastName.charAt(0)}` : username?.charAt(0)}
                                        </AvatarFallback>
                                        <label htmlFor="avatar-upload" className="cursor-pointer text-xs text-primary underline ml-2">
                                            Trocar foto
                                        </label>
                                    </Avatar>
                                    <div className='flex flex-col'>
                                        <span className='text-sm font-medium'>{username}</span>
                                        <span className="text-xs font-normal text-muted-foreground">{email}</span>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
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
                <div className='flex flex-1 p-5 bg-background gap-4 items-start'>
                    <CardSites title="Eletric Games" description="Site para jogo sobre eletrica" content="Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima a adipisci tempora. Eaque adipisci dolor ullam non repellendus, error deserunt aliquam cupiditate neque eveniet aspernatur maiores quibusdam officia magni iure." link="https://electricgames.satc.edu.br/" />
                    <CardSites title="EduMind" description="Site para jogo de kahoot" content="Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima a adipisci tempora. Eaque adipisci dolor ullam non repellendus, error deserunt aliquam cupiditate neque eveniet aspernatur maiores quibusdam officia magni iure." link="https://electricgames.satc.edu.br/" />
                    <CardSites title="Controle de Estoque" description="Site para controle de estoque" content="Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima a adipisci tempora. Eaque adipisci dolor ullam non repellendus, error deserunt aliquam cupiditate neque eveniet aspernatur maiores quibusdam officia magni iure." link="https://electricgames.satc.edu.br/" />
                </div>
                
            </SidebarInset>

            
        </>
    )
}