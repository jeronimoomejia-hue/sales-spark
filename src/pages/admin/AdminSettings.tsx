import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Building2, 
  Bell, 
  Shield, 
  Palette,
  Save,
  Upload,
  Calendar
} from "lucide-react";

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("organization");

  const tabs = [
    { id: "organization", label: "Organización", icon: Building2 },
    { id: "notifications", label: "Notificaciones", icon: Bell },
    { id: "security", label: "Seguridad", icon: Shield },
    { id: "appearance", label: "Apariencia", icon: Palette },
  ];

  return (
    <DashboardLayout 
      title="Configuración" 
      subtitle="Personaliza la plataforma"
      userLevel={4}
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <Card variant="glass" className="lg:w-64 p-2">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === tab.id 
                    ? "bg-primary/10 text-primary border border-primary/30" 
                    : "hover:bg-card-elevated text-muted-foreground"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </Card>

        {/* Content */}
        <div className="flex-1">
          {activeTab === "organization" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <Card variant="glass" className="p-6">
                <h2 className="text-xl font-bold mb-6">Información de la Organización</h2>
                
                <div className="flex items-center gap-6 mb-8">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-party flex items-center justify-center text-white text-3xl font-bold">
                      NE
                    </div>
                    <button className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors">
                      <Upload className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">NeonEvents</h3>
                    <p className="text-muted-foreground">Promotora de eventos</p>
                    <Badge variant="success" className="mt-2">Plan Profesional</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">
                      Nombre de la Organización
                    </label>
                    <Input defaultValue="NeonEvents" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">
                      Slug (URL)
                    </label>
                    <Input defaultValue="neonevents" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">
                      Correo de Contacto
                    </label>
                    <Input defaultValue="admin@neonevents.co" type="email" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">
                      Teléfono
                    </label>
                    <Input defaultValue="+57 300 000 0000" />
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <Button variant="party" className="gap-2">
                    <Save className="w-4 h-4" />
                    Guardar Cambios
                  </Button>
                </div>
              </Card>

              <Card variant="glass" className="p-6">
                <h2 className="text-xl font-bold mb-6">Configuración de Cierres</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">
                      Día de Cierre (1-31)
                    </label>
                    <Input type="number" defaultValue="15" min="1" max="31" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Los cierres se realizarán el día 15 y último día de cada mes
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">
                      Cargo por Servicio (COP)
                    </label>
                    <Input type="number" defaultValue="5000" />
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-card-elevated">
                    <div>
                      <p className="font-medium">Requerir envío de cierres</p>
                      <p className="text-sm text-muted-foreground">Los promotores deben enviar su cierre manualmente</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-card-elevated">
                    <div>
                      <p className="font-medium">Permitir transferencias entre promotores</p>
                      <p className="text-sm text-muted-foreground">Los promotores pueden transferir ventas entre ellos</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <Button variant="party" className="gap-2">
                    <Save className="w-4 h-4" />
                    Guardar Configuración
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === "notifications" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card variant="glass" className="p-6">
                <h2 className="text-xl font-bold mb-6">Notificaciones del Sistema</h2>
                
                <div className="space-y-4">
                  {[
                    { title: "Nueva venta registrada", desc: "Notificar cuando se procese una venta via webhook", enabled: true },
                    { title: "Cierre pendiente", desc: "Alertar sobre cierres sin enviar", enabled: true },
                    { title: "Hito completado", desc: "Notificar cuando un promotor alcance un hito", enabled: true },
                    { title: "Nuevo usuario registrado", desc: "Alertar sobre nuevos promotores en el sistema", enabled: false },
                    { title: "Error de webhook", desc: "Notificar errores en la sincronización", enabled: true },
                    { title: "Resumen diario", desc: "Enviar resumen de ventas cada día", enabled: false },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-card-elevated">
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={item.enabled} className="sr-only peer" />
                        <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                      </label>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end mt-6">
                  <Button variant="party" className="gap-2">
                    <Save className="w-4 h-4" />
                    Guardar Preferencias
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === "security" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card variant="glass" className="p-6">
                <h2 className="text-xl font-bold mb-6">Configuración de Seguridad</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-card-elevated">
                    <div>
                      <p className="font-medium">Autenticación de dos factores obligatoria</p>
                      <p className="text-sm text-muted-foreground">Requerir 2FA para todos los administradores</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-card-elevated">
                    <div>
                      <p className="font-medium">Sesiones activas limitadas</p>
                      <p className="text-sm text-muted-foreground">Limitar a 3 sesiones simultáneas por usuario</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-card-elevated">
                    <div>
                      <p className="font-medium">Registro de actividad</p>
                      <p className="text-sm text-muted-foreground">Mantener logs de todas las acciones administrativas</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-lg bg-warning/10 border border-warning/20">
                  <h3 className="font-medium text-warning mb-2">Zona de Peligro</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Estas acciones son irreversibles. Procede con precaución.
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline">Exportar todos los datos</Button>
                    <Button variant="destructive">Eliminar organización</Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === "appearance" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card variant="glass" className="p-6">
                <h2 className="text-xl font-bold mb-6">Personalización Visual</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-3 block">
                      Color Principal
                    </label>
                    <div className="flex gap-3">
                      {["#a855f7", "#ec4899", "#f97316", "#3b82f6", "#10b981", "#fbbf24"].map((color) => (
                        <button
                          key={color}
                          className="w-10 h-10 rounded-lg border-2 border-transparent hover:border-white transition-all"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                      <Input type="color" className="w-10 h-10 p-1" defaultValue="#a855f7" />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-3 block">
                      Tema
                    </label>
                    <div className="flex gap-4">
                      <button className="p-4 rounded-lg bg-card-elevated border-2 border-primary flex-1">
                        <div className="w-full h-8 bg-[#0a0a0f] rounded mb-2" />
                        <p className="text-sm font-medium">Oscuro (Actual)</p>
                      </button>
                      <button className="p-4 rounded-lg bg-card-elevated border-2 border-transparent flex-1 opacity-50">
                        <div className="w-full h-8 bg-white rounded mb-2" />
                        <p className="text-sm font-medium">Claro (Próximamente)</p>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <Button variant="party" className="gap-2">
                    <Save className="w-4 h-4" />
                    Guardar Apariencia
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
