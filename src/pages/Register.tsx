import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, User, Mail, Lock, Phone, Eye, EyeOff, FileText, Shield, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const commissionByLevel: Record<number, number> = { 1: 7500, 2: 10000, 3: 15000, 4: 17500 };
const levelNames: Record<number, string> = { 1: "Promotor Común", 2: "Promotor Cabeza", 3: "Sub Socio", 4: "Socio" };

const legalDocs = {
  terms: {
    title: "Términos y Condiciones de Uso",
    content: `TÉRMINOS Y CONDICIONES DE USO DE LA PLATAFORMA CREWS\n\nÚltima actualización: Febrero 2026\n\n1. ACEPTACIÓN DE LOS TÉRMINOS\nAl registrarse y utilizar la plataforma CREWS ("la Plataforma"), usted acepta estos Términos y Condiciones en su totalidad.\n\n2. DESCRIPCIÓN DEL SERVICIO\nCREWS es una plataforma tecnológica que facilita la gestión de redes de vendedores de boletas para eventos, incluyendo la atribución de ventas, el cálculo de comisiones y la gestión de pagos virtuales.\n\n3. REGISTRO Y CUENTA\nPara utilizar la Plataforma, el usuario debe completar el formulario de registro con información veraz y actualizada. La cuenta es personal e intransferible.\n\n4. OBLIGACIONES DEL VENDEDOR\n- Vender boletas únicamente a través de los links proporcionados por la Plataforma.\n- No realizar ventas por fuera de la Plataforma para eventos gestionados en CREWS.\n- Mantener actualizada su información de contacto y datos bancarios.\n\n5. COMISIONES Y PAGOS\nLas comisiones se calculan según el nivel del vendedor y se pagan de forma 100% virtual posterior al cierre de cada evento. El vendedor debe confirmar la recepción del pago en la Plataforma.\n\n6. PROPIEDAD INTELECTUAL\nTodos los derechos de propiedad intelectual de la Plataforma pertenecen a CREWS.\n\n7. TERMINACIÓN\nCREWS se reserva el derecho de suspender o cancelar la cuenta de cualquier usuario que incumpla estos términos.\n\n8. LEY APLICABLE\nEstos términos se rigen por las leyes de la República de Colombia.`,
  },
  privacy: {
    title: "Política de Tratamiento de Datos Personales",
    content: `POLÍTICA DE TRATAMIENTO DE DATOS PERSONALES\n\nEn cumplimiento de la Ley 1581 de 2012 y el Decreto 1377 de 2013, CREWS informa:\n\n1. RESPONSABLE DEL TRATAMIENTO\nCREWS S.A.S., con domicilio en Bogotá D.C., Colombia.\n\n2. FINALIDADES DEL TRATAMIENTO\n- Gestionar el registro y la cuenta del usuario en la Plataforma.\n- Procesar y gestionar el pago de comisiones.\n- Enviar notificaciones relacionadas con eventos, ventas y pagos.\n- Generar reportes y estadísticas de ventas.\n- Contactar al usuario vía WhatsApp, email o SMS para asuntos operativos.\n\n3. DATOS RECOPILADOS\n- Nombre completo, documento de identidad, correo electrónico, número de teléfono.\n- Información bancaria para el procesamiento de pagos.\n- Datos de actividad en la Plataforma (ventas, comisiones, eventos).\n- Dirección IP al momento del registro.\n\n4. DERECHOS DEL TITULAR\nEl titular tiene derecho a conocer, actualizar, rectificar y solicitar la supresión de sus datos personales.\n\n5. VIGENCIA\nLos datos personales serán tratados mientras exista la relación con el usuario y durante el período establecido por la ley.`,
  },
  commissions: {
    title: "Acuerdo de Comisiones",
    content: `ACUERDO DE COMISIONES — CREWS\n\nAl aceptar este acuerdo, el vendedor declara conocer y aceptar las siguientes condiciones:\n\n1. ESTRUCTURA DE COMISIONES\n- Promotor Común (Nivel 1): $7,500 COP por ticket vendido\n- Promotor Cabeza (Nivel 2): $10,000 COP por ticket vendido\n- Sub Socio (Nivel 3): $15,000 COP por ticket vendido\n- Socio (Nivel 4): $17,500 COP por ticket vendido\n\n2. MÉTODO DE PAGO\nTodas las comisiones se pagan de forma 100% virtual mediante transferencia bancaria, Nequi, Daviplata u otro medio digital acordado.\n\n3. CICLO DE PAGOS\nLas comisiones se liquidan después de cada evento, cuando la promotora ejecuta el cierre y procesa los pagos individuales.\n\n4. COMPROBANTE DE PAGO\nLa promotora subirá un comprobante de pago a la Plataforma. El vendedor deberá confirmar la recepción del pago.\n\n5. ATRIBUCIÓN DE VENTAS\nLas ventas se atribuyen automáticamente mediante el link único de ventas del vendedor.\n\n6. ASCENSO DE NIVEL\nEl vendedor puede ascender de nivel según su desempeño, aumentando su comisión por ticket.`,
  },
};

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "vendedor";

  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", password: "", level: 1,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [acceptCommissions, setAcceptCommissions] = useState(false);

  const [openDoc, setOpenDoc] = useState<keyof typeof legalDocs | null>(null);

  const allAccepted = acceptTerms && acceptPrivacy && acceptCommissions;
  const commission = commissionByLevel[formData.level];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allAccepted) return;
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1500));

    const termsData = {
      termsAcceptedAt: new Date().toISOString(),
      termsVersion: "1.0",
      ipAddress: "192.168.1.1", // Simulated
    };
    console.log("[Registration]", { ...formData, type, terms: termsData });

    sessionStorage.setItem("demoUserLevel", formData.level.toString());
    sessionStorage.setItem("termsAcceptance", JSON.stringify(termsData));

    toast.success("¡Registro exitoso! Tu solicitud está pendiente de aprobación.");
    setIsLoading(false);
    navigate(type === "promotora" ? "/admin" : "/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden crews-mode">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-primary/20 via-transparent to-transparent opacity-50 animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-radial from-accent/20 via-transparent to-transparent opacity-50 animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="w-full max-w-lg relative z-10">
        <Card variant="glass" className="p-8 border-primary/20 glass-dark">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }} className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-party mb-3 shadow-lg shadow-primary/30">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold font-display text-gradient-party">CREWS</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {type === "promotora" ? "Registro de Promotora" : "Registro de Vendedor"}
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Nombre completo</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Tu nombre" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="pl-10" required />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Correo electrónico</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="email" placeholder="tu@email.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="pl-10" required />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Teléfono (WhatsApp)</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="+57 300 123 4567" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="pl-10" required />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type={showPassword ? "text" : "password"} placeholder="••••••••" value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })} className="pl-10 pr-10" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* T&C Section */}
            <div className="pt-4 border-t border-border space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Documentos legales</p>

              <label className="flex items-start gap-3 cursor-pointer group">
                <Checkbox checked={acceptTerms} onCheckedChange={(v) => setAcceptTerms(v === true)} className="mt-0.5" />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  Acepto los{" "}
                  <button type="button" onClick={() => setOpenDoc("terms")} className="text-primary underline underline-offset-2 hover:text-primary/80">
                    Términos y Condiciones
                  </button>{" "}de uso de la plataforma
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <Checkbox checked={acceptPrivacy} onCheckedChange={(v) => setAcceptPrivacy(v === true)} className="mt-0.5" />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  Autorizo el tratamiento de mis datos personales conforme a la{" "}
                  <button type="button" onClick={() => setOpenDoc("privacy")} className="text-primary underline underline-offset-2 hover:text-primary/80">
                    Política de Privacidad
                  </button>
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <Checkbox checked={acceptCommissions} onCheckedChange={(v) => setAcceptCommissions(v === true)} className="mt-0.5" />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  Acepto el{" "}
                  <button type="button" onClick={() => setOpenDoc("commissions")} className="text-primary underline underline-offset-2 hover:text-primary/80">
                    Acuerdo de Comisiones
                  </button>
                  : recibiré <strong className="text-foreground">${commission.toLocaleString()} COP</strong> por cada ticket vendido, pagado de forma 100% virtual en los cierres de cada evento
                </span>
              </label>
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Button type="submit" variant="party" size="lg" className="w-full gap-2" disabled={!allAccepted || isLoading}>
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>Registrarme <ArrowRight className="w-5 h-5" /></>
                    )}
                  </Button>
                </div>
              </TooltipTrigger>
              {!allAccepted && (
                <TooltipContent>
                  <p>Debes aceptar todos los términos para continuar</p>
                </TooltipContent>
              )}
            </Tooltip>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            ¿Ya tienes cuenta?{" "}
            <button onClick={() => navigate("/login")} className="text-primary hover:underline">Iniciar sesión</button>
          </p>
        </Card>
      </motion.div>

      {/* Legal Document Modal */}
      <Dialog open={!!openDoc} onOpenChange={() => setOpenDoc(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              {openDoc && legalDocs[openDoc].title}
            </DialogTitle>
            <DialogDescription>Versión 1.0 — Febrero 2026</DialogDescription>
          </DialogHeader>
          <div className="mt-4 whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed">
            {openDoc && legalDocs[openDoc].content}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
