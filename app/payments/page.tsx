"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, CreditCard, Shield, AlertCircle, CheckCircle, Building2, User, LogOut, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

// Mock debts data
const mockDebts = [
  {
    id: 1,
    type: "Impuesto Inmobiliario",
    property: "Av. San Martín 456",
    amount: 25000,
    dueDate: "2024-12-31",
    status: "pending",
    periods: ["Nov 2024", "Dic 2024"],
    discount: 0,
  },
  {
    id: 2,
    type: "Tasa de Servicios",
    property: "Av. San Martín 456",
    amount: 8500,
    dueDate: "2024-11-30",
    status: "overdue",
    periods: ["Oct 2024"],
    discount: 0,
  },
  {
    id: 3,
    type: "Impuesto Automotor",
    property: "Vehículo ABC123",
    amount: 15000,
    dueDate: "2024-12-15",
    status: "pending",
    periods: ["Nov 2024"],
    discount: 10, // 10% discount for early payment
  },
]

export default function PaymentsPage() {
  const [user, setUser] = useState<any>(null)
  const [selectedDebts, setSelectedDebts] = useState<number[]>([])
  const [paymentMethod, setPaymentMethod] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showMercadoPago, setShowMercadoPago] = useState(false)
  const [paymentStep, setPaymentStep] = useState<"method" | "mercadopago" | "processing" | "success">("method")
  const [cardData, setCardData] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
    installments: "1",
  })
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedDebt = searchParams.get("debt")

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))

    // Preselect debt if coming from dashboard
    if (preselectedDebt) {
      setSelectedDebts([Number.parseInt(preselectedDebt)])
    }
  }, [router, preselectedDebt])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  const handleDebtSelection = (debtId: number, checked: boolean) => {
    if (checked) {
      setSelectedDebts([...selectedDebts, debtId])
    } else {
      setSelectedDebts(selectedDebts.filter((id) => id !== debtId))
    }
  }

  const calculateTotal = () => {
    return mockDebts
      .filter((debt) => selectedDebts.includes(debt.id))
      .reduce((total, debt) => {
        const discountAmount = debt.amount * (debt.discount / 100)
        return total + (debt.amount - discountAmount)
      }, 0)
  }

  const calculateDiscount = () => {
    return mockDebts
      .filter((debt) => selectedDebts.includes(debt.id))
      .reduce((total, debt) => {
        return total + debt.amount * (debt.discount / 100)
      }, 0)
  }

  const handlePayment = async () => {
    if (selectedDebts.length === 0 || !paymentMethod) return

    if (paymentMethod === "mercadopago") {
      setPaymentStep("mercadopago")
      setShowMercadoPago(true)
    } else {
      // Bank transfer simulation
      setIsProcessing(true)
      setTimeout(() => {
        setIsProcessing(false)
        setPaymentStep("success")
        setShowSuccess(true)
        setTimeout(() => {
          router.push("/dashboard?tab=payments")
        }, 3000)
      }, 2000)
    }
  }

  const processMercadoPagoPayment = async () => {
    if (!cardData.number || !cardData.expiry || !cardData.cvv || !cardData.name) {
      alert("Por favor completa todos los campos de la tarjeta")
      return
    }

    setPaymentStep("processing")
    setIsProcessing(true)

    // Simulate realistic payment processing with potential failure
    const shouldFail = Math.random() < 0.1 // 10% chance of failure for realism

    setTimeout(() => {
      setIsProcessing(false)

      if (shouldFail) {
        alert("Error en el procesamiento del pago. Por favor intenta nuevamente.")
        setPaymentStep("mercadopago")
      } else {
        setPaymentStep("success")
        setShowSuccess(true)

        // Store payment in localStorage for dashboard
        const existingPayments = JSON.parse(localStorage.getItem("payments") || "[]")
        const newPayment = {
          id: Date.now(),
          debts: selectedDebts.map((id) => mockDebts.find((d) => d.id === id)?.type).join(", "),
          amount: calculateTotal(),
          date: new Date().toISOString(),
          method: "MercadoPago",
          status: "completed",
          receipt: `MP${Date.now().toString().slice(-8)}`,
        }
        localStorage.setItem("payments", JSON.stringify([...existingPayments, newPayment]))

        setTimeout(() => {
          router.push("/dashboard?tab=payments")
        }, 3000)
      }
    }, 3000)
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\D/g, "")
    if (v.length >= 2) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}`
    }
    return v
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500 text-white"
      case "overdue":
        return "bg-destructive text-destructive-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente"
      case "overdue":
        return "Vencido"
      default:
        return "Desconocido"
    }
  }

  if (!user) {
    return <div>Cargando...</div>
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-secondary/5 to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-16 w-16 text-secondary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">¡Pago Exitoso!</h2>
            <p className="text-muted-foreground mb-4">
              Tu pago ha sido procesado correctamente. Recibirás un comprobante por email.
            </p>
            <div className="bg-muted p-4 rounded-lg mb-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Pagado:</span>
                <span className="font-bold">${calculateTotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Método:</span>
                <span>{paymentMethod === "mercadopago" ? "MercadoPago" : "Transferencia"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Fecha:</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>
            <Button asChild>
              <Link href="/dashboard?tab=payments">Ver Comprobante</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (showMercadoPago && paymentStep === "mercadopago") {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-primary text-primary-foreground shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowMercadoPago(false)
                    setPaymentStep("method")
                  }}
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Volver
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="text-sm">{user.name}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">MP</span>
                </div>
                <CardTitle>MercadoPago</CardTitle>
                <CardDescription>Completa los datos de tu tarjeta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Total a pagar:</span>
                    <span className="font-bold">${calculateTotal().toLocaleString()}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Municipalidad de La Leonesa</div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Número de tarjeta</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardData.number}
                      onChange={(e) => setCardData((prev) => ({ ...prev, number: formatCardNumber(e.target.value) }))}
                      maxLength={19}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Vencimiento</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/AA"
                        value={cardData.expiry}
                        onChange={(e) => setCardData((prev) => ({ ...prev, expiry: formatExpiry(e.target.value) }))}
                        maxLength={5}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={cardData.cvv}
                        onChange={(e) => setCardData((prev) => ({ ...prev, cvv: e.target.value.replace(/\D/g, "") }))}
                        maxLength={4}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardName">Nombre del titular</Label>
                    <Input
                      id="cardName"
                      placeholder="Juan Pérez"
                      value={cardData.name}
                      onChange={(e) => setCardData((prev) => ({ ...prev, name: e.target.value.toUpperCase() }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="installments">Cuotas</Label>
                    <Select
                      value={cardData.installments}
                      onValueChange={(value) => setCardData((prev) => ({ ...prev, installments: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 cuota de ${calculateTotal().toLocaleString()}</SelectItem>
                        <SelectItem value="3">
                          3 cuotas de ${Math.round((calculateTotal() * 1.05) / 3).toLocaleString()}
                        </SelectItem>
                        <SelectItem value="6">
                          6 cuotas de ${Math.round((calculateTotal() * 1.1) / 6).toLocaleString()}
                        </SelectItem>
                        <SelectItem value="12">
                          12 cuotas de ${Math.round((calculateTotal() * 1.2) / 12).toLocaleString()}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>Tus datos están protegidos con encriptación de nivel bancario.</AlertDescription>
                </Alert>

                <Button className="w-full" onClick={processMercadoPagoPayment}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pagar ${calculateTotal().toLocaleString()}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Al continuar aceptas los términos y condiciones de MercadoPago
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (paymentStep === "processing") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Loader2 className="h-16 w-16 text-primary mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-bold mb-2">Procesando Pago</h2>
            <p className="text-muted-foreground mb-4">
              Estamos procesando tu pago de forma segura. No cierres esta ventana.
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-medium">Monto: ${calculateTotal().toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">MercadoPago</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
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
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Pagos de Impuestos</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Selecciona las deudas que deseas pagar</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Debts Selection */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Deudas Disponibles</CardTitle>
                <CardDescription>Selecciona una o más deudas para proceder con el pago</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockDebts.map((debt) => (
                  <div key={debt.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                    <Checkbox
                      id={`debt-${debt.id}`}
                      checked={selectedDebts.includes(debt.id)}
                      onCheckedChange={(checked) => handleDebtSelection(debt.id, checked as boolean)}
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={`debt-${debt.id}`} className="font-semibold cursor-pointer">
                          {debt.type}
                        </Label>
                        <Badge className={getStatusColor(debt.status)}>{getStatusText(debt.status)}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{debt.property}</p>
                      <p className="text-sm text-muted-foreground">Períodos: {debt.periods.join(", ")}</p>
                      <p className="text-sm text-muted-foreground">
                        Vencimiento: {new Date(debt.dueDate).toLocaleDateString()}
                      </p>

                      <div className="flex items-center justify-between">
                        <div>
                          {debt.discount > 0 && (
                            <div className="text-sm">
                              <span className="line-through text-muted-foreground">
                                ${debt.amount.toLocaleString()}
                              </span>
                              <Badge variant="secondary" className="ml-2">
                                {debt.discount}% OFF
                              </Badge>
                            </div>
                          )}
                          <p className="text-lg font-bold">
                            ${(debt.amount - (debt.amount * debt.discount) / 100).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Payment Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumen de Pago</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedDebts.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">Selecciona al menos una deuda para continuar</p>
                ) : (
                  <>
                    <div className="space-y-2">
                      {mockDebts
                        .filter((debt) => selectedDebts.includes(debt.id))
                        .map((debt) => (
                          <div key={debt.id} className="flex justify-between text-sm">
                            <span>{debt.type}</span>
                            <span>${(debt.amount - (debt.amount * debt.discount) / 100).toLocaleString()}</span>
                          </div>
                        ))}
                    </div>

                    {calculateDiscount() > 0 && (
                      <>
                        <Separator />
                        <div className="flex justify-between text-sm text-secondary">
                          <span>Descuento aplicado</span>
                          <span>-${calculateDiscount().toLocaleString()}</span>
                        </div>
                      </>
                    )}

                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total a Pagar</span>
                      <span>${calculateTotal().toLocaleString()}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {selectedDebts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Método de Pago</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Label>Selecciona tu método de pago</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger>
                        <SelectValue placeholder="Elegir método de pago" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mercadopago">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            MercadoPago
                          </div>
                        </SelectItem>
                        <SelectItem value="transfer">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            Transferencia Bancaria
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      Todos los pagos son procesados de forma segura. Recibirás un comprobante por email.
                    </AlertDescription>
                  </Alert>

                  <Button className="w-full" onClick={handlePayment} disabled={!paymentMethod || isProcessing}>
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      `Pagar $${calculateTotal().toLocaleString()}`
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Payment Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Información Importante</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 mt-0.5 text-primary" />
                  <p>Los pagos pueden tardar hasta 48hs en reflejarse en el sistema.</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 text-secondary" />
                  <p>Recibirás un comprobante de pago por email.</p>
                </div>
                <div className="flex items-start gap-2">
                  <Shield className="h-4 w-4 mt-0.5 text-accent" />
                  <p>Todos los pagos son procesados de forma segura.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
