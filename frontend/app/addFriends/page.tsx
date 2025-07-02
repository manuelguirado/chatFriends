import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MessageCircle } from "lucide-react"
import { Card, CardContent, CardDescription,  CardHeader, CardTitle } from "@/components/ui/card"
export default function AddFriendsPage() {
    return (
         <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <MessageCircle className="h-8 w-8 text-emerald-500" />
          </div>
          <CardTitle className="text-2xl font-bold">Añada amigos para empezar a chatear con ellos</CardTitle>
          <CardDescription>Ingresa el gmail  de tu amigo</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input id="email" type="email" placeholder="tu@ejemplo.com" required />
            </div>
            <Button type="submit" className="w-full" >
                 Buscar amigo 
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}