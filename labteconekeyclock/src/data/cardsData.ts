//Import de imagens usadas no card
import { StaticImageData } from 'next/image';
import BgEletric from '../../public/loginBackgroundEletric.svg';

//Tipagem dos dados usados 
export interface CardData {
  id: number;
  title: string;
  description: string;
  content?: string;
  link: string;
  foto: string | StaticImageData;
}

//Dados de cada card
export const defaultCards: CardData[] = [
    {
        id: 1,
        title: "Eletric Games - Aprenda Elétrica",
        description: "Site interativo voltado ao aprendizado de elétrica, com jogos educativos e desafios práticos.",
        link: "https://electricgames.satc.edu.br/",
        foto: BgEletric
    }
];