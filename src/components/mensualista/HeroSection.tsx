import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Briefcase, 
  Ticket, 
  CheckCircle2,
  Users,
  Building2,
  Zap,
  CreditCard
} from "lucide-react";

type TabType = "servicios" | "crews";

export default function HeroSection() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("servicios");

  const socialProof = [
    { icon: Users, label: "+2,500 vendedores activos", value: "2,500+" },
    { icon: Building2, label: "+150 empresas / productoras", value: "150+" },
    { icon: CreditCard, label: "Pagos automáticos", value: "Auto" },
    { icon: Zap, label: "Sin experiencia requerida", value: "0 XP" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-24 pb-16 overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-secondary/30 to-white" />
      
      {/* Subtle glow accents */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-neon-purple/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="outline" className="mb-6 px-4 py-2 text-sm border-primary/30 bg-primary/5">
            <span className="text-primary font-medium">🚀 La plataforma #1 de ventas por comisión en Colombia</span>
          </Badge>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
        >
          Vende y gana{" "}
          <span className="text-gradient-mensualista">comisión.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto"
        >
          Servicios por suscripción o boletas para eventos.{" "}
          <span className="text-foreground font-medium">Todo en una sola plataforma.</span>
        </motion.p>

        {/* Product Selector Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-4xl mx-auto mb-8"
        >
          {/* Tab Headers */}
          <div className="flex rounded-2xl bg-secondary p-1.5 mb-6 max-w-md mx-auto">
            <button
              onClick={() => setActiveTab("servicios")}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                activeTab === "servicios"
                  ? "bg-white text-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Briefcase className="w-4 h-4 inline-block mr-2" />
              Servicios
            </button>
            <button
              onClick={() => setActiveTab("crews")}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                activeTab === "crews"
                  ? "bg-gradient-crews text-white shadow-lg glow-purple"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Ticket className="w-4 h-4 inline-block mr-2" />
              Crews
            </button>
          </div>

          {/* Tab Content */}
          <div className="relative">
            {activeTab === "servicios" ? (
              <motion.div
                key="servicios"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white rounded-3xl border border-border p-8 shadow-xl"
              >
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-mensualista flex items-center justify-center text-4xl shadow-lg">
                    💼
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-xl font-bold mb-2">Mensualista Servicios</h3>
                    <p className="text-muted-foreground mb-4">
                      Vende servicios digitales y gana <span className="text-primary font-semibold">comisión mensual recurrente</span>. 
                      Cada cliente que mantengas te genera ingresos mes a mes.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Button
                        onClick={() => navigate("/servicios")}
                        className="bg-gradient-mensualista hover:opacity-90 text-white gap-2 shadow-lg"
                      >
                        Quiero vender servicios
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => navigate("/empresas")}
                      >
                        Soy empresa
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="crews"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 shadow-xl border border-neon-purple/20 glow-purple"
              >
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-crews flex items-center justify-center text-4xl shadow-lg">
                    🎫
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-xl font-bold mb-2 text-white">Mensualista Crews</h3>
                    <p className="text-gray-300 mb-4">
                      Vende boletas de eventos y gana por comisión con <span className="text-neon-purple font-semibold">rankings y metas</span>. 
                      Sube de nivel, lidera equipos y desbloquea recompensas.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Button
                        onClick={() => navigate("/crews")}
                        className="bg-gradient-crews hover:opacity-90 text-white gap-2 shadow-lg glow-purple"
                      >
                        Quiero vender boletas
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => navigate("/crews/empresas")}
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        Soy tiquetera / productora
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-4 md:gap-8 text-sm text-muted-foreground"
        >
          {socialProof.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span>{item.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
