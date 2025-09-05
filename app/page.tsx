import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Building2, CreditCard, FileText, Search, Users, MapPin, Phone, Mail } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <Building2 className="h-8 w-8 sm:h-10 sm:w-10" />
              <div className="text-center sm:text-left">
                <h1 className="text-lg sm:text-2xl font-bold">Municipalidad de La Leonesa</h1>
                <p className="text-sm sm:text-base text-primary-foreground/80">Provincia del Chaco, Argentina</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Button variant="secondary" size="sm" className="sm:size-default" asChild>
                <Link href="/login">Iniciar Sesión</Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="sm:size-default bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                asChild
              >
                <Link href="/register">Registrarse</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-8 sm:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-4xl font-bold text-foreground mb-4">Portal Ciudadano Digital</h2>
          <p className="text-base sm:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto">
            Realiza tus trámites municipales de forma rápida y segura. Paga impuestos, consulta deudas y gestiona
            procedimientos online.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-6 sm:mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="Buscar trámites, servicios..." className="pl-10 py-2 sm:py-3" />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Services */}
      <section className="py-8 sm:py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Servicios Principales</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <CreditCard className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Pagos de Impuestos</CardTitle>
                <CardDescription>Paga tus impuestos municipales de forma segura con MercadoPago</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" asChild>
                  <Link href="/payments">Pagar Ahora</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <FileText className="h-12 w-12 text-secondary mx-auto mb-4" />
                <CardTitle>Trámites Online</CardTitle>
                <CardDescription>Inicia y consulta el estado de tus trámites municipales</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="secondary" asChild>
                  <Link href="/procedures">Ver Trámites</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <Users className="h-12 w-12 text-accent mx-auto mb-4" />
                <CardTitle>Mi Cuenta</CardTitle>
                <CardDescription>Accede a tu panel personal y consulta tu historial</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-transparent" variant="outline" asChild>
                  <Link href="/dashboard">Mi Panel</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Information Section */}
      <section className="bg-muted py-8 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">¿Cómo funciona?</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3 sm:gap-4">
                  <Badge className="bg-primary text-primary-foreground flex-shrink-0">1</Badge>
                  <div>
                    <h4 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Regístrate con tu CUIT</h4>
                    <p className="text-muted-foreground text-sm sm:text-base">
                      Crea tu cuenta usando tu CUIT para acceder a todos los servicios
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:gap-4">
                  <Badge className="bg-secondary text-secondary-foreground flex-shrink-0">2</Badge>
                  <div>
                    <h4 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Consulta tus deudas</h4>
                    <p className="text-muted-foreground text-sm sm:text-base">Ve el estado de tus impuestos y multas pendientes</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:gap-4">
                  <Badge className="bg-accent text-accent-foreground flex-shrink-0">3</Badge>
                  <div>
                    <h4 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Paga online</h4>
                    <p className="text-muted-foreground text-sm sm:text-base">Realiza pagos seguros con MercadoPago desde tu casa</p>
                  </div>
                </div>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Información de Contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>Av. San Martín 123, La Leonesa, Chaco</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <span>(03722) 123-456</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <span>info@laleonesa.gob.ar</span>
                </div>
                <div className="pt-4">
                  <p className="text-sm text-muted-foreground">
                    Horario de atención: Lunes a Viernes de 8:00 a 16:00 hs
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-6 sm:py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div>
              <h4 className="font-bold mb-4">Municipalidad de La Leonesa</h4>
              <p className="text-primary-foreground/80">
                Trabajando por el desarrollo y bienestar de nuestra comunidad.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Enlaces Útiles</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li>
                  <Link href="/about" className="hover:text-primary-foreground">
                    Sobre Nosotros
                  </Link>
                </li>
                <li>
                  <Link href="/news" className="hover:text-primary-foreground">
                    Noticias
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-primary-foreground">
                    Contacto
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="hover:text-primary-foreground">
                    Ayuda
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Servicios</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li>
                  <Link href="/payments" className="hover:text-primary-foreground">
                    Pagos Online
                  </Link>
                </li>
                <li>
                  <Link href="/procedures" className="hover:text-primary-foreground">
                    Trámites
                  </Link>
                </li>
                <li>
                  <Link href="/certificates" className="hover:text-primary-foreground">
                    Certificados
                  </Link>
                </li>
                <li>
                  <Link href="/permits" className="hover:text-primary-foreground">
                    Permisos
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/80">
            <p>&copy; 2025 Municipalidad de La Leonesa. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
