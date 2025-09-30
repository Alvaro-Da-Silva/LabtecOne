import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function CardSites({title, description,content, link}: {title?: string, description?: string, content?: string, link?: string}) {
  return (
    <Card className='w-85'>
      <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
            <p>{content}</p>
        </CardContent>
        <CardFooter>
            <p className='text-center text-sm text-muted-foreground'>
                <a href={link} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
                    Acesse aqui
                </a>
            </p>
        </CardFooter>
    </Card>
  )
}