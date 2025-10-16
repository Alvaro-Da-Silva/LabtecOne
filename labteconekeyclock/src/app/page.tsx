"use client";

import React from 'react';

// Contexts
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';

// UI
import { Button } from '@/components/ui/button'
import { Spinner } from "@/components/ui/spinner"
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CircleAlert, LogOut, Settings, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import ImageCropper from '@/components/ImageCrooper';
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
import LogoLabTec from '../../public/logo-labtec-sem-texto.png'
import Image from 'next/image';
import Link from 'next/link';
import { CardData, defaultCards } from '@/data/cardsData';
import  Package  from '../../package.json';


export default function Page() {
    const { email, username, firstName, lastName, logout, isAuthenticated } = useAuth();
    

    // State de pesquisa
    const [searchTerm, setSearchTerm] = useState('');
    
    // lógica de paginação
    const cardsPerPage = 9;
    const [currentPage, setCurrentPage] = useState(1);
    
    // Const de dados e fallback caso não tenha dados 
    const allCards: CardData[] = defaultCards;
    
    // filtra os cards com base no termo de pesquisa
    const filteredCards = allCards.filter(card => 
        card.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    //Reseta a página atual para 1 quando o termo de pesquisa mudar
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);
    
    // Calcula total de páginas dinamicamente com base no comprimento dos dados filtrados
    const totalPages = Math.ceil(filteredCards.length / cardsPerPage);

    // Calcula quais cards mostrar na página atual
    const startIndex = (currentPage - 1) * cardsPerPage;
    const endIndex = startIndex + cardsPerPage;
    const currentCards = filteredCards.slice(startIndex, endIndex);
    // Estados e funções para o diálogo de confirmação de logout
    const [confirmOpen, setConfirmOpen] = React.useState(false);
    const [cropOpen, setCropOpen] = useState(false);
    const [tempImage, setTempImage] = useState<string | null>(null);

        // Estado e função para o upload e crop da imagem de perfil
        const [profileImage, setProfileImage] = useState<string | null>(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("profileImage");
        }
        return null;
    });

    // Função para salvar a imagem cortada
    const handleSaveCropped = (cropped: string) => {
        setProfileImage(cropped);
        try { localStorage.setItem("profileImage", cropped); } catch {}
        setCropOpen(false);
    };


    return (
        <>
            <div className=''>
                <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-background px-3 sm:px-5 h-14 border-b shadow-sm">   
                    <div className="flex flex-1 items-center justify-between">
                        <div className="flex-shrink-0 flex items-center gap-2">
                            <Image
                             src={LogoLabTec}
                             alt="Logo LabtecOne"
                             width={110}
                             height={30}
                             className="object-contain sm:w-auto sm:h-[33px]"
                            />
                            <div className='flex flex-col justify-center items-start leading-none'>
                                <p className="text-foreground">Labtec<span className='text-primary'>One</span></p>
                                <span className='text-muted-foreground text-xs'>{Package.version}</span>
                            </div>
                        </div>


                        <DropdownMenu>
                            <div className='flex flex-row items-center gap-2 sm:gap-5'>
                                
                                <div className="relative w-32 sm:w-48 md:w-64 max-w-sm">
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder="Pesquisar..."
                                        className="pl-8 sm:pl-10 text-sm"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                <DropdownMenuTrigger className='flex flex-row items-center gap-7'>
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
                            </div>
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
                                <DropdownMenuItem className='focus:bg-secondary/20 focus:text-primary cursor-pointer' asChild>
                                    <Link href="/Configs" className="flex items-center gap-2">
                                        <Settings className='focus:text-primary' />
                                        Configurações
                                    </Link>
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
                                    Será necessário fazer login de novo.
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

                    <Dialog open={cropOpen} onOpenChange={setCropOpen}>
                        <DialogContent className="sm:max-w-[400px]">
                            <DialogHeader>
                            <DialogTitle>Ajustar foto de perfil</DialogTitle>
                            </DialogHeader>
                            {tempImage && (
                            <ImageCropper
                                imageSrc={tempImage}
                                onSave={handleSaveCropped}
                                onCancel={() => setCropOpen(false)}
                            />
                            )}
                        </DialogContent>
                    </Dialog>


                </header>
                {/* Div para os cards de apps, compensando o header fixo com padding-top */}
                <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-5 p-3 sm:p-5 pt-16 sm:pt-20 flex-1 bg-background justify-items-center max-w-7xl mx-auto w-full`}>
                    {!isAuthenticated ? (
                        // Mostrar spinner centralizado apenas na área de cards enquanto não autenticado
                        <div className="col-span-full flex items-center justify-center py-16 sm:py-24">
                            <div className="flex flex-col items-center gap-2 sm:gap-3">
                                <Spinner className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                                <span className="text-xs sm:text-sm text-muted-foreground">Carregando...</span>
                            </div>
                        </div>
                    ) : (
                        currentCards.length > 0 ? (
                            currentCards.map((card) => (
                                <CardSites
                                    key={card.id}
                                    title={card.title}
                                    description={card.description}
                                    link={card.link}
                                    foto={card.foto}
                                />
                            ))
                        ) : (
                            <div className="col-span-full flex flex-col items-center justify-center py-8 sm:py-12 px-4">
                                <Search className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground mb-3 sm:mb-4" />
                                <h3 className="text-base sm:text-lg font-medium text-muted-foreground mb-1 sm:mb-2 text-center">
                                    Nenhum resultado encontrado
                                </h3>
                                <p className="text-xs sm:text-sm text-muted-foreground text-center max-w-xs sm:max-w-sm">
                                    Tente pesquisar com outros termos ou limpe a pesquisa
                                </p>
                            </div>
                        )
                    )}
                </div>
                    {/* Paginação - só mostra se há resultados e mais de 1 página */}
                    {isAuthenticated && filteredCards.length > 0 && totalPages > 1 && (
                        <div className="m-2 sm:m-4 flex items-center justify-center gap-1 sm:gap-2 lg:ml-0 flex-wrap">
                            <Button
                                variant="default"
                                className={`size-8 bg-card hover:bg-muted border border-border text-foreground hover:text-foreground transition-opacity ${
                                    currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
                                }`}
                                size="icon"
                                onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            {Array.from({ length: totalPages }, (_, index) => {
                                const pageNumber = index + 1;
                                return (
                                    <Button
                                        key={pageNumber}
                                        variant={currentPage === pageNumber ? "default" : "outline"}
                                        className={`size-8 sm:size-9 rounded-full bg-primary text-xs sm:text-sm ${
                                            currentPage === pageNumber ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-card hover:bg-muted text-card-foreground'
                                        }`}
                                        size="icon"
                                        onClick={() => setCurrentPage(pageNumber)}
                                    >
                                        {pageNumber}
                                    </Button>
                                );
                            })}
                            <Button
                                variant="default"
                                className={`size-8 bg-card hover:bg-muted border border-border text-foreground hover:text-foreground transition-opacity ${
                                    currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
                                }`}
                                size="icon"
                                onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>
        </>
    )
}