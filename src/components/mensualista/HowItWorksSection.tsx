import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, 
  Ticket, 
  GraduationCap, 
  Link2, 
  DollarSign,
  Users,
  Trophy,
  TrendingUp,
  CheckCircle2
} from "lucide-react";

type TabType = "servicios" | "crews";

const serviciosSteps = [
  {
    step: 1,
    icon: Briefcase,
    title: "Elige un servicio",
    description: "Explora el catálogo y selecciona el servicio que quieras vender.",
  },
  {
    step: 2,
    icon: GraduationCap,
    title: "Capacítate en 10 min",
    description: "Accede al entrenamiento rápido para dominar el producto.",
  },
  {
    step: 3,
    icon: Link2,
    title: "Vende con tu link",
    description: "Comparte tu enlace único y cierra ventas desde cualquier lugar.",
  },
  {
    step: 4,
    icon: DollarSign,
    title: "Gana comisión mensual",
    description: "Recibe comisiones recurrentes mientras tu cliente permanezca activo.",
  },
];

const crewsSteps = [
  {
    step: 1,
    icon: Users,
    title: "Entra a un crew / productora",
    description: "Únete a una productora de eventos y accede a sus boletas.",
  },
  {
    step: 2,
    icon: Ticket,
    title: "Recibe eventos activos",
    description: "Visualiza los eventos disponibles con precios y comisiones.",
  },
  {
    step: 3,
    icon: Link2,
    title: "Comparte tu link",
    description: "Usa tu enlace de referido para vender boletas online.",
  },
  {
    step: 4,
    icon: Trophy,
    title: "Sube en el ranking",
    description: "Alcanza metas, sube de nivel y cobra comisiones mayores.",
  },
];

const serviciosMockCard = {
  logo: "🔧",
  name: "Briki CRM",
  industry: "Software",
  price: "$99.000 COP/mes",
  commission: "15%",
};

const crewsMockCard = {
  logo: "🎉",
  event: "Baum Festival 2026",
  ticketsSold: 47,
  commission: "$940.000 COP",
  badge: "Top 10",
};

export default function HowItWorksSection() {
  const [activeTab, setActiveTab] = useState<TabType>("servicios");

  const steps = activeTab === "servicios" ? serviciosSteps : crewsSteps;

  return (
    <section id="como-funciona" className="py-24 px-4 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/5">
            ⚡ Super fácil
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            ¿Cómo <span className="text-gradient-mensualista">funciona?</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            En 4 simples pasos estarás generando ingresos. Elige tu camino.
          </p>
        </motion.div>

        {/* Tab Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mb-12"
        >
          <div className="flex rounded-2xl bg-white p-1.5 shadow-lg border border-border">
            <button
              onClick={() => setActiveTab("servicios")}
              className={`py-3 px-6 rounded-xl text-sm font-medium transition-all ${
                activeTab === "servicios"
                  ? "bg-gradient-mensualista text-white shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Briefcase className="w-4 h-4 inline-block mr-2" />
              Ruta Servicios
            </button>
            <button
              onClick={() => setActiveTab("crews")}
              className={`py-3 px-6 rounded-xl text-sm font-medium transition-all ${
                activeTab === "crews"
                  ? "bg-gradient-crews text-white shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Ticket className="w-4 h-4 inline-block mr-2" />
              Ruta Crews
            </button>
          </div>
        </motion.div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Steps Timeline */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4"
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg ${
                      activeTab === "servicios"
                        ? "bg-gradient-mensualista"
                        : "bg-gradient-crews"
                    }`}
                  >
                    {step.step}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-0.5 h-16 mt-2 ${
                      activeTab === "servicios" ? "bg-primary/30" : "bg-neon-purple/30"
                    }`} />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <step.icon className={`w-5 h-5 ${
                      activeTab === "servicios" ? "text-primary" : "text-neon-purple"
                    }`} />
                    <h3 className="text-lg font-bold">{step.title}</h3>
                  </div>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Mock UI Card */}
          <motion.div
            key={`card-${activeTab}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex justify-center"
          >
            {activeTab === "servicios" ? (
              <div className="bg-white rounded-3xl p-8 shadow-2xl border border-border max-w-sm w-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-mensualista flex items-center justify-center text-3xl shadow-lg">
                    {serviciosMockCard.logo}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{serviciosMockCard.name}</h4>
                    <p className="text-sm text-muted-foreground">{serviciosMockCard.industry}</p>
                  </div>
                </div>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-muted-foreground">Precio mensual</span>
                    <span className="font-bold">{serviciosMockCard.price}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-muted-foreground">Tu comisión</span>
                    <span className="font-bold text-primary text-xl">{serviciosMockCard.commission}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-success mb-6">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Comisión recurrente cada mes</span>
                </div>
                <button className="w-full py-3 bg-gradient-mensualista text-white rounded-xl font-medium shadow-lg hover:opacity-90 transition-opacity">
                  Elegir este servicio
                </button>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 shadow-2xl border border-neon-purple/20 max-w-sm w-full glow-purple">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-crews flex items-center justify-center text-3xl shadow-lg">
                      {crewsMockCard.logo}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-white">{crewsMockCard.event}</h4>
                      <p className="text-sm text-gray-400">Evento activo</p>
                    </div>
                  </div>
                  <Badge className="bg-neon-purple/20 text-neon-purple border-neon-purple/30">
                    {crewsMockCard.badge}
                  </Badge>
                </div>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center py-3 border-b border-white/10">
                    <span className="text-gray-400">Tickets vendidos</span>
                    <span className="font-bold text-white">{crewsMockCard.ticketsSold}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-white/10">
                    <span className="text-gray-400">Comisión estimada</span>
                    <span className="font-bold text-neon-green text-xl">{crewsMockCard.commission}</span>
                  </div>
                </div>
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Progreso a meta</span>
                    <span className="text-neon-purple font-medium">47/100</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-[47%] bg-gradient-crews rounded-full" />
                  </div>
                </div>
                <button className="w-full py-3 bg-gradient-crews text-white rounded-xl font-medium shadow-lg hover:opacity-90 transition-opacity">
                  Ver detalles del evento
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
