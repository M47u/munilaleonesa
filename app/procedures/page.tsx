"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Search, FileText, Clock, CheckCircle, AlertCircle, User, LogOut, Plus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Mock procedures data
const availableProcedures = [
  {
    id: 1,
    title: "Certificado de Libre Deuda",
    description: "Certificado que acredita no tener deudas municipales pendientes",
    category: "Certificados",
    duration: "3-5 días hábiles",
    requirements: ["CUIT", "Documento de identidad", "Comprobante de domicilio"],
    cost: 2500,
  },
  {
    id: 2,
    title: "Habilitación Comercial",
    description: "Permiso para ejercer actividad comercial en el municipio",
    category: "Habilitaciones",
    duration: "10-15 días hábiles",
    requirements: ["CUIT", "Contrato de alquiler", "Plano del local", "Certificado de bomberos"],
    cost: 15000,
  },
  {
    id: 3,
    title: "Permiso de Construcción",
    description: "Autorización para realizar obras de construcción",
    category: "Permisos",
    duration: "15-20 días hábiles",
    requirements: ["Planos aprobados", "Memoria técnica", "Matrícula del profesional", "Seguro de obra"],
    cost: 25000,
  },
  {
    id: 4,
    title: "Certificado de Zonificación",
    description: "Documento que indica el uso permitido del suelo",
    category: "Certificados",
    duration: "2-3 días hábiles",
    requirements: ["Plano de ubicación", "Documento de identidad"],
    cost: 1500,
  },
  {
    id: 5,
    title: "Permiso de Evento",
    description: "Autorización para realizar eventos públicos o privados",
    category: "Permisos",
    duration: "5-7 días hábiles",
    requirements: ["Descripción del evento", "Seguro de responsabilidad civil", "Plan de seguridad"],
    cost: 5000,
  },
]

const myProcedures = [
  {
    id: 1,
    title: "Certificado de Libre Deuda",
    status: "in-progress",
    date: "2024-11-20",
    progress: 75,
    nextStep: "Revisión final",
    trackingCode: "CLD-2024-001234",
  },
  {
    id: 2,
    title: "Permiso de Construcción",
    status: "pending",
    date: "2024-11-18",
    progress: 25,
    nextStep: "Documentación faltante",
    trackingCode: "PC-2024-005678",
  },
  {
    id: 3,
    title: "Habilitación Comercial",
    status: "completed",
    date: "2024-10-30",
    progress: 100,
    nextStep: "Finalizado",
    trackingCode: "HC-2024-009876",
  },
]

export default function ProceduresPage() {
  const [user, setUser] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-secondary text-secondary-foreground"
      case "pending":
        return "bg-yellow-500 text-white"
      case "in-progress":
        return "bg-primary text-primary-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completado"
      case "pending":
        return "Pendiente"
      case "in-progress":
        return "En Proceso"
      default:
        return "Desconocido"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <AlertCircle className="h-4 w-4" />
      case "in-progress":
        return <Clock className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const filteredProcedures = availableProcedures.filter((procedure) => {
    const matchesSearch =
      procedure.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      procedure.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || procedure.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ["all", ...Array.from(new Set(availableProcedures.map((p) => p.category)))]

  if (!user) {
    return <div>Cargando...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <Link href="/dashboard" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm sm:text-base">Volver al Dashboard</span>
              </Link>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="text-xs sm:text-sm">{user.name}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-xs sm:text-sm">
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Trámites Municipales</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Inicia nuevos trámites o consulta el estado de los existentes</p>
        </div>

        <Tabs defaultValue="available" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="available" className="text-xs sm:text-sm">Trámites Disponibles</TabsTrigger>
            <TabsTrigger value="my-procedures" className="text-xs sm:text-sm">Mis Trámites</TabsTrigger>
          </TabsList>

          {/* Available Procedures Tab */}
          <TabsContent value="available" className="space-y-6">
            {/* Search and Filter */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Buscar trámites..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category === "all" ? "Todos" : category}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Procedures Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredProcedures.map((procedure) => (
                <Card key={procedure.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{procedure.title}</CardTitle>
                        <Badge variant="secondary" className="mt-2">
                          {procedure.category}
                        </Badge>
                      </div>
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <CardDescription className="mt-2">{procedure.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Duración:</span>
                        <span>{procedure.duration}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Costo:</span>
                        <span className="font-semibold">${procedure.cost.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Requisitos:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {procedure.requirements.slice(0, 2).map((req, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="h-1 w-1 bg-muted-foreground rounded-full" />
                            {req}
                          </li>
                        ))}
                        {procedure.requirements.length > 2 && (
                          <li className="text-xs">+{procedure.requirements.length - 2} más...</li>
                        )}
                      </ul>
                    </div>

                    <Button className="w-full" asChild>
                      <Link href={`/procedures/${procedure.id}`}>
                        <Plus className="h-4 w-4 mr-2" />
                        Iniciar Trámite
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* My Procedures Tab */}
          <TabsContent value="my-procedures" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mis Trámites en Curso</CardTitle>
                <CardDescription>Seguimiento del estado de tus trámites municipales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {myProcedures.map((procedure) => (
                    <div key={procedure.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold">{procedure.title}</h3>
                          <p className="text-sm text-muted-foreground">Código: {procedure.trackingCode}</p>
                          <p className="text-sm text-muted-foreground">
                            Iniciado: {new Date(procedure.date).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className={getStatusColor(procedure.status)}>
                          {getStatusIcon(procedure.status)}
                          <span className="ml-1">{getStatusText(procedure.status)}</span>
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progreso</span>
                          <span>{procedure.progress}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${procedure.progress}%` }}
                          />
                        </div>
                        <p className="text-sm text-muted-foreground">Próximo paso: {procedure.nextStep}</p>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/procedures/track/${procedure.trackingCode}`}>Ver Detalle</Link>
                        </Button>
                        {procedure.status === "completed" && <Button size="sm">Descargar Certificado</Button>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
