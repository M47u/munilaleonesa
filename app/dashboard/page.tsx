"use client"

import { Label } from "@/components/ui/label"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { FileText, AlertCircle, CheckCircle, DollarSign, Download, Eye, User, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Mock data
const mockUser = {
  cuit: "20-12345678-9",
  name: "Juan Carlos Pérez",
  email: "juan.perez@email.com",
  phone: "(03722) 123-456",
}

const mockDebts = [
  {
    id: 1,
    type: "Impuesto Inmobiliario",
    property: "Av. San Martín 456",
    amount: 25000,
    dueDate: "2024-12-31",
    status: "pending",
    periods: ["Nov 2024", "Dic 2024"],
  },
  {
    id: 2,
    type: "Tasa de Servicios",
    property: "Av. San Martín 456",
    amount: 8500,
    dueDate: "2024-11-30",
    status: "overdue",
    periods: ["Oct 2024"],
  },
]

const mockPayments = [
  {
    id: 1,
    type: "Impuesto Inmobiliario",
    amount: 22000,
    date: "2024-10-15",
    status: "completed",
    receipt: "MP001234567",
  },
  {
    id: 2,
    type: "Tasa de Servicios",
    amount: 8500,
    date: "2024-09-20",
    status: "completed",
    receipt: "MP001234568",
  },
]

const mockProcedures = [
  {
    id: 1,
    title: "Certificado de Libre Deuda",
    status: "in-progress",
    date: "2024-11-20",
    progress: 75,
    nextStep: "Revisión final",
  },
  {
    id: 2,
    title: "Permiso de Construcción",
    status: "pending",
    date: "2024-11-18",
    progress: 25,
    nextStep: "Documentación faltante",
  },
  {
    id: 3,
    title: "Habilitación Comercial",
    status: "completed",
    date: "2024-10-30",
    progress: 100,
    nextStep: "Finalizado",
  },
]

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [payments, setPayments] = useState(mockPayments)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))

    const storedPayments = localStorage.getItem("payments")
    if (storedPayments) {
      const parsedPayments = JSON.parse(storedPayments)
      setPayments([...mockPayments, ...parsedPayments])
    }
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
      case "overdue":
        return "bg-destructive text-destructive-foreground"
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
      case "overdue":
        return "Vencido"
      case "in-progress":
        return "En Proceso"
      default:
        return "Desconocido"
    }
  }

  const totalDebt = mockDebts.reduce((sum, debt) => sum + debt.amount, 0)
  const overdueDebt = mockDebts.filter((debt) => debt.status === "overdue").reduce((sum, debt) => sum + debt.amount, 0)

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
              <Link href="/" className="flex items-center gap-2">
                <div className="h-6 w-6 sm:h-8 sm:w-8 bg-primary-foreground text-primary rounded flex items-center justify-center font-bold text-xs sm:text-sm">
                  ML
                </div>
                <span className="font-semibold text-sm sm:text-base">Portal Ciudadano</span>
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
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Bienvenido, {user.name}</h1>
          <p className="text-sm sm:text-base text-muted-foreground">CUIT: {user.cuit}</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Deuda Total</p>
                  <p className="text-lg sm:text-2xl font-bold">${totalDebt.toLocaleString()}</p>
                </div>
                <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Vencido</p>
                  <p className="text-lg sm:text-2xl font-bold text-destructive">${overdueDebt.toLocaleString()}</p>
                </div>
                <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Trámites Activos</p>
                  <p className="text-lg sm:text-2xl font-bold">{mockProcedures.filter((p) => p.status !== "completed").length}</p>
                </div>
                <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-secondary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Pagos Este Mes</p>
                  <p className="text-lg sm:text-2xl font-bold">2</p>
                </div>
                <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="debts" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
            <TabsTrigger value="debts" className="text-xs sm:text-sm">Deudas</TabsTrigger>
            <TabsTrigger value="payments" className="text-xs sm:text-sm">Pagos</TabsTrigger>
            <TabsTrigger value="procedures" className="text-xs sm:text-sm">Trámites</TabsTrigger>
            <TabsTrigger value="profile" className="text-xs sm:text-sm">Mi Perfil</TabsTrigger>
          </TabsList>

          {/* Debts Tab */}
          <TabsContent value="debts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Deudas Pendientes</CardTitle>
                <CardDescription>Consulta y paga tus impuestos y tasas municipales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockDebts.map((debt) => (
                    <div key={debt.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{debt.type}</h3>
                          <Badge className={getStatusColor(debt.status)}>{getStatusText(debt.status)}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{debt.property}</p>
                        <p className="text-sm text-muted-foreground">Períodos: {debt.periods.join(", ")}</p>
                        <p className="text-sm text-muted-foreground">
                          Vencimiento: {new Date(debt.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">${debt.amount.toLocaleString()}</p>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" asChild>
                            <Link href={`/payments?debt=${debt.id}`}>Pagar</Link>
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Historial de Pagos</CardTitle>
                <CardDescription>Consulta tus pagos realizados y descarga comprobantes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {payments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-secondary rounded-full flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-secondary-foreground" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{payment.type || payment.debts}</h3>
                          <p className="text-sm text-muted-foreground">{new Date(payment.date).toLocaleDateString()}</p>
                          <p className="text-sm text-muted-foreground">Comprobante: {payment.receipt}</p>
                          {payment.method && <p className="text-xs text-muted-foreground">Método: {payment.method}</p>}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">${payment.amount.toLocaleString()}</p>
                        <Button size="sm" variant="outline" className="mt-2 bg-transparent">
                          <Download className="h-4 w-4 mr-1" />
                          Descargar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Procedures Tab */}
          <TabsContent value="procedures" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mis Trámites</CardTitle>
                <CardDescription>Seguimiento del estado de tus trámites municipales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {mockProcedures.map((procedure) => (
                    <div key={procedure.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold">{procedure.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            Iniciado: {new Date(procedure.date).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className={getStatusColor(procedure.status)}>{getStatusText(procedure.status)}</Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progreso</span>
                          <span>{procedure.progress}%</span>
                        </div>
                        <Progress value={procedure.progress} className="h-2" />
                        <p className="text-sm text-muted-foreground">Próximo paso: {procedure.nextStep}</p>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Ver Detalle
                        </Button>
                        {procedure.status === "completed" && (
                          <Button size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Descargar
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <Button asChild>
                    <Link href="/procedures">
                      <FileText className="h-4 w-4 mr-2" />
                      Iniciar Nuevo Trámite
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mi Perfil</CardTitle>
                <CardDescription>Información personal y configuración de cuenta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">CUIT</Label>
                    <p className="text-lg">{user.cuit}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Nombre Completo</Label>
                    <p className="text-lg">{user.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Email</Label>
                    <p className="text-lg">{user.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Teléfono</Label>
                    <p className="text-lg">{mockUser.phone}</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button variant="outline">Editar Información</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
