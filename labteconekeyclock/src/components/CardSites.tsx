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

     <div className="w-full max-w-sm rounded-2xl overflow-hidden shadow-md bg-white hover:scale-101 transition-all duration-300">
      {/* Imagem */}
      <Image
        width={320}
        height={160}
        src={foto || BgTeste}
        alt="Eletric Games"
        className="h-32 sm:h-40 w-full object-cover"
      />

      {/* Conteúdo */}
      <div className="p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2">
         {title}
        </h3>

        <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2 line-clamp-3">
          {description}
        </p>

        <Button onClick={() => window.open(link, '_blank')} className="mt-3 sm:mt-4 w-full cursor-pointer bg-[#0173F2] text-white hover:opacity-105 transition-colors text-sm">
          Acessar
        </Button>
      </div>
    </div>
  )
}