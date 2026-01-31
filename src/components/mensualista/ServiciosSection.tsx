import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { 
  ArrowRight, 
  RefreshCcw, 
  Users, 
  BarChart3,
  CheckCircle2,
  X
} from "lucide-react";

const services = [
  {
    id: 1,
    logo: "🔧",
    name: "Briki CRM",
    industry: "Software",
    price: "$99.000 COP/mes",
    commission: "15%",
    description: "Sistema de gestión de clientes para pequeñas empresas. Incluye seguimiento de leads, automatización y reportes.",
    features: ["Seguimiento de leads", "Automatización de emails", "Reportes mensuales", "App móvil"],
  },
  {
    id: 2,
    logo: "📊",
    name: "Contify",
    industry: "Contabilidad",
    price: "$149.000 COP/mes",
    commission: "12%",
    description: "Plataforma de contabilidad en la nube para PYMEs. Facturación, reportes DIAN y conciliación bancaria.",
    features: ["Facturación electrónica", "Reportes DIAN", "Conciliación automática", "Multi-empresa"],
  },
  {
    id: 3,
    logo: "🛡️",
    name: "SecureCloud",
    industry: "Ciberseguridad",
    price: "$199.000 COP/mes",
    commission: "18%",
    description: "Protección empresarial contra amenazas digitales. Monitoreo 24/7 y respuesta a incidentes.",
    features: ["Monitoreo 24/7", "Firewall avanzado", "Respuesta a incidentes", "Capacitación"],
  },
  {
    id: 4,
    logo: "📱",
    name: "SocialPro",
    industry: "Marketing",
    price: "$79.000 COP/mes",
    commission: "20%",
    description: "Herramienta de gestión de redes sociales. Programación de posts, analytics y gestión de comentarios.",
    features: ["Programación de posts", "Analytics detallados", "Gestión multicanal", "Reportes automáticos"],
  },
  {
    id: 5,
    logo: "🚚",
    name: "LogiTrack",
    industry: "Logística",
    price: "$129.000 COP/mes",
    commission: "14%",
    description: "Sistema de seguimiento de envíos y gestión de flotas. GPS en tiempo real y optimización de rutas.",
    features: ["GPS en tiempo real", "Optimización de rutas", "Control de flotas", "Notificaciones"],
  },
  {
    id: 6,
    logo: "🎓",
    name: "EduPlatform",
    industry: "Educación",
    price: "$89.000 COP/mes",
    commission: "16%",
    description: "LMS para empresas y academias. Crea cursos, evalúa empleados y certifica competencias.",
    features: ["Creación de cursos", "Evaluaciones", "Certificaciones", "Gamificación"],
  },
];

const benefits = [
  { icon: RefreshCcw, label: "Comisión mensual recurrente" },
  { icon: Users, label: "Clientes que permanecen" },
  { icon: BarChart3, label: "Seguimiento en dashboard" },
];

export default function ServiciosSection() {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null);

  return (
    <section id="servicios" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/5">
            💼 Para vendedores
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Mensualista <span className="text-gradient-mensualista">Servicios</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comisiones recurrentes vendiendo suscripciones a empresas. 
            Cada cliente que mantengas te genera ingresos mes a mes.
          </p>
        </motion.div>

        {/* Benefits Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-6 mb-12"
        >
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full"
            >
              <benefit.icon className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{benefit.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-border hover:shadow-xl transition-shadow card-hover cursor-pointer"
              onClick={() => setSelectedService(service)}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-mensualista flex items-center justify-center text-2xl shadow-md">
                  {service.logo}
                </div>
                <div>
                  <h3 className="font-bold">{service.name}</h3>
                  <p className="text-sm text-muted-foreground">{service.industry}</p>
                </div>
              </div>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Precio</span>
                  <span className="font-medium">{service.price}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Comisión</span>
                  <Badge className="bg-primary/10 text-primary border-0">{service.commission}</Badge>
                </div>
              </div>
              <Button variant="outline" className="w-full" onClick={(e) => { e.stopPropagation(); setSelectedService(service); }}>
                Ver detalles
              </Button>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button
            size="lg"
            onClick={() => navigate("/servicios")}
            className="bg-gradient-mensualista hover:opacity-90 text-white gap-2 shadow-lg"
          >
            Entrar a Servicios
            <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>

        {/* Service Detail Modal */}
        <Dialog open={!!selectedService} onOpenChange={() => setSelectedService(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-mensualista flex items-center justify-center text-3xl shadow-lg">
                  {selectedService?.logo}
                </div>
                <div>
                  <DialogTitle className="text-xl">{selectedService?.name}</DialogTitle>
                  <DialogDescription>{selectedService?.industry}</DialogDescription>
                </div>
              </div>
            </DialogHeader>
            
            <p className="text-muted-foreground mb-6">
              {selectedService?.description}
            </p>

            <div className="space-y-3 mb-6">
              <h4 className="font-semibold">Características incluidas:</h4>
              <div className="grid grid-cols-2 gap-2">
                {selectedService?.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-secondary rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-muted-foreground">Precio mensual</span>
                <span className="font-bold text-lg">{selectedService?.price}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Tu comisión recurrente</span>
                <span className="font-bold text-xl text-primary">{selectedService?.commission}</span>
              </div>
            </div>

            <Button
              className="w-full bg-gradient-mensualista hover:opacity-90 text-white gap-2 shadow-lg"
              onClick={() => {
                setSelectedService(null);
                navigate("/servicios");
              }}
            >
              Elegir este servicio
              <ArrowRight className="w-4 h-4" />
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
