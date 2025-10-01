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
import Image, { StaticImageData } from "next/image"


export default function CardSites({title, description,content, link, foto,H, W}:
   {
    title?: string,
    description?: string,
    content?: string,
    link?: string,
    foto?: string | StaticImageData,
    H?: number,
    W?: number
        }) {
  return (

    <Card className="w-85 h border hover:scale-101 transition-transform">
      <CardHeader>
             <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardAction>
          <Image
            src={foto || LogoLabTec}
            alt="Logo do site"
            width={W || 80}
            height={H || 80}
            className=""
          />
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>{content}</p>
      </CardContent>
      <CardFooter>
        <Badge asChild>
          <a href={link} target="_blank" rel="noopener noreferrer" className="flex bg-blue-500 w-18 h-8 items-center justify-center text-white text-xl">
            Acessar
          </a>
        </Badge>
      </CardFooter>
  </Card>
  )
}