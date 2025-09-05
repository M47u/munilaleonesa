"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Upload, FileText, CheckCircle, AlertCircle, User, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"

// Mock procedure data
const procedureDetails = {
  1: {
    title: "Certificado de Libre Deuda",
    description: "Certificado que acredita no tener deudas municipales pendientes",
    duration: "3-5 días hábiles",
    cost: 2500,
    requirements: ["CUIT del solicitante", "Documento de identidad vigente", "Comprobante de domicilio actualizado"],
    steps: [
      "Completar formulario online",
      "Adjuntar documentación requerida",
      "Realizar pago del arancel",
      "Revisión por parte del área competente",
      "Emisión del certificado",
    ],
  },
  2: {
    title: "Habilitación Comercial",
    description: "Permiso para ejercer actividad comercial en el municipio",
    duration: "10-15 días hábiles",
    cost: 15000,
    requirements: [
      "CUIT de la empresa",
      "Contrato de alquiler o escritura del inmueble",
      "Plano del local comercial",
      "Certificado de bomberos",
      "Habilitación sanitaria (si corresponde)",
    ],
    steps: [
      "Completar solicitud de habilitación",
      "Adjuntar documentación completa",
      "Inspección técnica del local",
      "Pago de tasas municipales",
      "Emisión de la habilitación",
    ],
  },
  3: {
    title: "Permiso de Construcción",
    description: "Autorización para realizar obras de construcción",
    duration: "15-20 días hábiles",
    cost: 25000,
    requirements: [
      "Planos aprobados por profesional matriculado",
      "Memoria técnica de la obra",
      "Matrícula del profesional responsable",
      "Seguro de obra vigente",
      "Estudio de suelo (si corresponde)",
    ],
    steps: [
      "Presentación de documentación técnica",
      "Revisión de planos y memoria técnica",
      "Inspección del terreno",
      "Pago de derechos de construcción",
      "Emisión del permiso",
    ],
  },
}

export default function ProcedureDetailPage() {
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    applicantName: "",
    cuit: "",
    email: "",
    phone: "",
    address: "",
    observations: "",
    acceptTerms: false,
  })
  const [files, setFiles] = useState<Record<string, File | null>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const router = useRouter()
  const params = useParams()
  const procedureId = params.id as string

  const procedure = procedureDetails[procedureId as keyof typeof procedureDetails]

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    const user = JSON.parse(userData)
    setUser(user)

    // Pre-fill form with user data
    setFormData((prev) => ({
      ...prev,
      applicantName: user.name,
      cuit: user.cuit,
      email: user.email,
    }))
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  const handleFileChange = (requirement: string, file: File | null) => {
    setFiles((prev) => ({
      ...prev,
      [requirement]: file,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.acceptTerms) {
      alert("Debes aceptar los términos y condiciones")
      return
    }

    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setShowSuccess(true)

      // Redirect after success
      setTimeout(() => {
        router.push("/procedures?tab=my-procedures")
      }, 3000)
    }, 2000)
  }

  if (!user || !procedure) {
    return <div>Cargando...</div>
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-secondary/5 to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-16 w-16 text-secondary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">¡Trámite Iniciado!</h2>
            <p className="text-muted-foreground mb-4">
              Tu solicitud ha sido recibida correctamente. Recibirás un código de seguimiento por email.
            </p>
            <div className="bg-muted p-4 rounded-lg mb-4">
              <p className="text-sm font-medium">Código de Seguimiento</p>
              <p className="text-lg font-bold text-primary">TR-2024-{Math.random().toString().slice(2, 8)}</p>
            </div>
            <Button asChild>
              <Link href="/procedures?tab=my-procedures">Ver Mis Trámites</Link>
            </Button>
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
              <Link href="/procedures" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm sm:text-base">Volver a Trámites</span>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Procedure Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {procedure.title}
                </CardTitle>
                <CardDescription>{procedure.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Duración:</span>
                    <span>{procedure.duration}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Costo:</span>
                    <span className="font-semibold">${procedure.cost.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Requisitos</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {procedure.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Proceso</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2">
                  {procedure.steps.map((step, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>

          {/* Application Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Solicitud de Trámite</CardTitle>
                <CardDescription>Completa todos los campos requeridos para iniciar tu trámite</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Datos del Solicitante</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="applicantName">Nombre Completo *</Label>
                        <Input
                          id="applicantName"
                          value={formData.applicantName}
                          onChange={(e) => setFormData((prev) => ({ ...prev, applicantName: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cuit">CUIT *</Label>
                        <Input
                          id="cuit"
                          value={formData.cuit}
                          onChange={(e) => setFormData((prev) => ({ ...prev, cuit: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Domicilio *</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  {/* Document Upload */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Documentación Requerida</h3>

                    {procedure.requirements.map((requirement, index) => (
                      <div key={index} className="space-y-2">
                        <Label>{requirement} *</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileChange(requirement, e.target.files?.[0] || null)}
                            className="flex-1"
                          />
                          <Button type="button" variant="outline" size="sm">
                            <Upload className="h-4 w-4" />
                          </Button>
                        </div>
                        {files[requirement] && <p className="text-sm text-secondary">✓ {files[requirement]?.name}</p>}
                      </div>
                    ))}
                  </div>

                  {/* Observations */}
                  <div className="space-y-2">
                    <Label htmlFor="observations">Observaciones</Label>
                    <Textarea
                      id="observations"
                      placeholder="Información adicional que consideres relevante..."
                      value={formData.observations}
                      onChange={(e) => setFormData((prev) => ({ ...prev, observations: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  {/* Terms and Conditions */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.acceptTerms}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, acceptTerms: checked as boolean }))
                      }
                    />
                    <Label htmlFor="terms" className="text-sm">
                      Acepto los términos y condiciones del trámite y declaro que la información proporcionada es veraz
                    </Label>
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Una vez enviada la solicitud, recibirás un código de seguimiento por email. El pago del arancel se
                      realizará una vez aprobada la documentación.
                    </AlertDescription>
                  </Alert>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Enviando Solicitud..." : "Enviar Solicitud"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
