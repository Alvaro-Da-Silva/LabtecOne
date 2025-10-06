import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "./ui/badge"
import LogoLabTec from '../../public/logo-labtec.png'
import BgTeste from '../../public/wallpaper.jpg'
import Image, { StaticImageData } from "next/image"
import { Button } from "./ui/button"


export default function CardSites({title, description, link, foto}:
   {
    title?: string,
    description?: string,
    link?: string,
    foto?: string | StaticImageData,
        }) {
  return (

     <div className="max-w-sm rounded-2xl overflow-hidden shadow-md bg-white hover:scale-101 transition-all duration-300">
      {/* Imagem */}
      <Image
        width={320}
        height={160}
        src={foto || ''}
        alt="Eletric Games"
        className="h-40 w-full object-cover"
      />

      {/* Conteúdo */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
         {title}
        </h3>

        <p className="text-sm text-gray-600 mt-2">
          {description}
        </p>

        <Button onClick={() => window.open(link, '_blank')} className="mt-4 w-full cursor-pointer bg-[#0173F2] text-white hover:opacity-105 transition-colors">
          Acessar
        </Button>
      </div>
    </div>
  )
}