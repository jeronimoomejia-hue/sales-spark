import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  User, Lock, Bell, CreditCard, Shield, Camera, Save, Eye, EyeOff, FileText, CheckCircle2
} from "lucide-react";

export default function Configuracion() {
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // Get terms from session
  const termsRaw = sessionStorage.getItem("termsAcceptance");
  const terms = termsRaw ? JSON.parse(termsRaw) : { termsAcceptedAt: "2026-02-01T10:30:00", termsVersion: "1.0", ipAddress: "192.168.1.1" };

  const tabs = [
    { id: "profile", label: "Perfil", icon: User },
    { id: "security", label: "Seguridad", icon: Lock },
    { id: "notifications", label: "Notificaciones", icon: Bell },
    { id: "payment", label: "Método de Pago", icon: CreditCard },
    { id: "documents", label: "Documentos", icon: FileText },
  ];

  return (
    <DashboardLayout title="Configuración" subtitle="Personaliza tu cuenta" userLevel={1}>
      <div className="flex flex-col lg:flex-row gap-6">
        <Card variant="glass" className="lg:w-64 p-2">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === tab.id ? "bg-primary/10 text-primary border border-primary/30" : "hover:bg-card-elevated text-muted-foreground"
                }`}>
                <tab.icon className="w-5 h-5" /><span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </Card>

        <div className="flex-1">
          {activeTab === "profile" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card variant="glass" className="p-6">
                <h2 className="text-xl font-bold mb-6">Información Personal</h2>
                <div className="flex items-center gap-6 mb-8">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-party flex items-center justify-center text-white text-3xl font-bold">JP</div>
                    <button className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"><Camera className="w-4 h-4" /></button>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Juan Pérez</h3>
                    <p className="text-muted-foreground">PROMO-12345</p>
                    <Badge variant="secondary" className="mt-2">Promotor Común</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className="text-sm font-medium text-muted-foreground mb-2 block">Nombre Completo</label><Input defaultValue="Juan Pérez" /></div>
                  <div><label className="text-sm font-medium text-muted-foreground mb-2 block">Correo Electrónico</label><Input defaultValue="juan.perez@email.com" type="email" /></div>
                  <div><label className="text-sm font-medium text-muted-foreground mb-2 block">Teléfono</label><Input defaultValue="+57 300 123 4567" /></div>
                  <div><label className="text-sm font-medium text-muted-foreground mb-2 block">Documento de Identidad</label><Input defaultValue="1234567890" /></div>
                </div>
                <div className="flex justify-end mt-6"><Button variant="party" className="gap-2"><Save className="w-4 h-4" />Guardar Cambios</Button></div>
              </Card>
            </motion.div>
          )}

          {activeTab === "security" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card variant="glass" className="p-6">
                <h2 className="text-xl font-bold mb-6">Seguridad</h2>
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Contraseña Actual</label>
                    <div className="relative">
                      <Input type={showPassword ? "text" : "password"} placeholder="••••••••" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <div><label className="text-sm font-medium text-muted-foreground mb-2 block">Nueva Contraseña</label><Input type="password" placeholder="••••••••" /></div>
                  <div><label className="text-sm font-medium text-muted-foreground mb-2 block">Confirmar Contraseña</label><Input type="password" placeholder="••••••••" /></div>
                </div>
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 mt-6">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-primary" />
                    <div><p className="font-medium">Autenticación de dos factores</p><p className="text-sm text-muted-foreground">Añade una capa extra de seguridad</p></div>
                    <Button variant="outline" size="sm" className="ml-auto">Activar</Button>
                  </div>
                </div>
                <div className="flex justify-end mt-6"><Button variant="party" className="gap-2"><Save className="w-4 h-4" />Actualizar Contraseña</Button></div>
              </Card>
            </motion.div>
          )}

          {activeTab === "notifications" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card variant="glass" className="p-6">
                <h2 className="text-xl font-bold mb-6">Notificaciones</h2>
                <div className="space-y-4">
                  {[
                    { title: "Nueva venta registrada", desc: "Recibe una notificación cuando se registre una venta", enabled: true },
                    { title: "Hito completado", desc: "Notificación cuando alcances un hito", enabled: true },
                    { title: "Cierre de evento", desc: "Cuando se ejecute un cierre y tengas pagos pendientes", enabled: true },
                    { title: "Pagos recibidos", desc: "Confirmación cuando se procese tu pago", enabled: true },
                    { title: "Actualizaciones del equipo", desc: "Cambios en tu equipo o estructura", enabled: false },
                    { title: "WhatsApp", desc: "Recibir notificaciones clave por WhatsApp", enabled: true },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-card-elevated">
                      <div><p className="font-medium">{item.title}</p><p className="text-sm text-muted-foreground">{item.desc}</p></div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={item.enabled} className="sr-only peer" />
                        <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                      </label>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-6"><Button variant="party" className="gap-2"><Save className="w-4 h-4" />Guardar Preferencias</Button></div>
              </Card>
            </motion.div>
          )}

          {activeTab === "payment" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card variant="glass" className="p-6">
                <h2 className="text-xl font-bold mb-6">Método de Pago</h2>
                <div className="space-y-6">
                  <div><label className="text-sm font-medium text-muted-foreground mb-2 block">Tipo de Cuenta</label>
                    <select className="w-full p-3 rounded-lg bg-card border border-border text-foreground"><option>Cuenta Bancaria</option><option>Nequi</option><option>Daviplata</option></select></div>
                  <div><label className="text-sm font-medium text-muted-foreground mb-2 block">Banco</label>
                    <select className="w-full p-3 rounded-lg bg-card border border-border text-foreground"><option>Bancolombia</option><option>Davivienda</option><option>BBVA</option><option>Banco de Bogotá</option></select></div>
                  <div><label className="text-sm font-medium text-muted-foreground mb-2 block">Número de Cuenta</label><Input defaultValue="****1234" /></div>
                  <div><label className="text-sm font-medium text-muted-foreground mb-2 block">Tipo</label>
                    <select className="w-full p-3 rounded-lg bg-card border border-border text-foreground"><option>Ahorros</option><option>Corriente</option></select></div>
                </div>
                <div className="flex justify-end mt-6"><Button variant="party" className="gap-2"><Save className="w-4 h-4" />Guardar Cambios</Button></div>
              </Card>
            </motion.div>
          )}

          {activeTab === "documents" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card variant="glass" className="p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Documentos Firmados
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Estos son los documentos legales que aceptaste al registrarte en la plataforma.
                </p>
                <div className="space-y-4">
                  {[
                    { name: "Términos y Condiciones de Uso", version: terms.termsVersion },
                    { name: "Política de Tratamiento de Datos Personales", version: terms.termsVersion },
                    { name: "Acuerdo de Comisiones", version: terms.termsVersion },
                  ].map((doc, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-card-elevated border border-border">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-success" />
                        <div>
                          <p className="font-medium text-sm">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Versión {doc.version} • Aceptado el {new Date(terms.termsAcceptedAt).toLocaleDateString()} a las {new Date(terms.termsAcceptedAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-success border-success gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Firmado
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/10">
                  <p className="text-xs text-muted-foreground">
                    <strong>IP de registro:</strong> {terms.ipAddress} • Todos los documentos tienen validez legal conforme a la Ley 527 de 1999 (Colombia).
                  </p>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
