"use client";

import React from 'react';

// Contexts
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';

// UI
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CircleAlert, EllipsisVertical, Import, LogOut, Pencil, Settings, Trash2, UserRoundCog,Camera, Search } from 'lucide-react';
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
import LogoLabTec from '../../public/logo-labtec.png'
import Image from 'next/image';
import { CardData, defaultCards } from '@/data/cardsData';

interface PageProps {
  cardsData?: CardData[];
}

export default function Page({ cardsData }: PageProps) {
    const { email, username, firstName, lastName, logout, token } = useAuth();

    // State de pesquisa
    const [searchTerm, setSearchTerm] = useState('');
    
    // lógica de paginação
    const cardsPerPage = 9;
    const [currentPage, setCurrentPage] = useState(1);
    
    // Const de dados e fallback caso não tenha dados 
    const allCards: CardData[] = cardsData || defaultCards;
    
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

    // Função para lidar com o upload da imagem
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
    const handleSaveCropped = (cropped: string) => {
        setProfileImage(cropped);
        try { localStorage.setItem("profileImage", cropped); } catch {}
        setCropOpen(false);
    };



    return (
        <>
            <div className=''>
                <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 h-14 border-b bg-white shadow-sm">
                    <div className="flex items-center gap-2">
                    </div>
                    
                    <div className="flex flex-1 items-center justify-between">
                        <div>
                            <Image
                             src={LogoLabTec}
                             alt="Logo LabtecOne"
                             width={100}
                             height={24}
                             className="object-contain"
                            />
                        </div>


                        <DropdownMenu>
                            <div className='flex flex-row items-center gap-5'>
                                
                                <div className="relative w-64 max-w-sm">
                                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder="Pesquisar..."
                                        className="pl-10"
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
                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 p-5 pt-20 flex-1 bg-background justify-items-center max-w-6xl mx-auto w-full`}>
                    {currentCards.length > 0 ? (
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
                        <div className="col-span-full flex flex-col items-center justify-center py-12">
                            <Search className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium text-muted-foreground mb-2">
                                Nenhum resultado encontrado
                            </h3>
                            <p className="text-sm text-muted-foreground text-center">
                                Tente pesquisar com outros termos ou limpe a pesquisa
                            </p>
                        </div>
                    )}
                </div>
                    {/* Paginação - só mostra se há resultados e mais de 1 página */}
                    {filteredCards.length > 0 && totalPages > 1 && (
                        <div className="m-4 flex items-center justify-center gap-2 lg:ml-0">
                            <Button
                                variant="default"
                                className={`size-8 bg-white hover:bg-white hover:text-black transition-opacity ${
                                    currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
                                }`}
                                size="icon"
                                onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft color='black' />
                            </Button>
                            {Array.from({ length: totalPages }, (_, index) => {
                                const pageNumber = index + 1;
                                return (
                                    <Button
                                        key={pageNumber}
                                        variant="outline"
                                        className={`size-9 rounded-full ${
                                            currentPage === pageNumber ? 'bg-[#0173F2] text-white hover:bg-[#0173F2] hover:text-white' : ''
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
                                className={`size-8 bg-white hover:bg-white hover:text-black transition-opacity ${
                                    currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
                                }`}
                                size="icon"
                                onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                <ChevronRight color='black' />
                            </Button>
                        </div>
                    )}
                </div>
        </>
    )
}