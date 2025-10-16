import BgNotfound from '../../public/Not-found.png'
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

     <div className="w-full max-w-sm rounded-2xl overflow-hidden shadow-md bg-card hover:scale-101 transition-all duration-300 border border-border">
      {/* Imagem */}
      <Image
        width={320}
        height={160}
        src={foto || BgNotfound}
        alt="Eletric Games"
        className="h-32 sm:h-40 w-full object-cover"
      />

      {/* Conteúdo */}
      <div className="p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-bold text-card-foreground flex items-center gap-2">
         {title}
        </h3>

        <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2 line-clamp-3">
          {description}
        </p>

        <Button onClick={() => window.open(link, '_blank')} className="mt-3 sm:mt-4 w-full cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm">
          Acessar
        </Button>
      </div>
    </div>
  )
}