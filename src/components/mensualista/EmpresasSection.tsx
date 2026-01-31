import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Building2, 
  Ticket, 
  Upload, 
  CreditCard,
  Users,
  BarChart3,
  Target,
  Trophy
} from "lucide-react";

const empresasServicios = {
  title: "Soy empresa de servicios",
  subtitle: "B2B SaaS, software, plataformas",
  emoji: "🏢",
  bullets: [
    { icon: Upload, text: "Publica tu oferta en minutos" },
    { icon: CreditCard, text: "Pagas solo por ventas cerradas" },
    { icon: Users, text: "Accede a miles de vendedores activos" },
    { icon: BarChart3, text: "Dashboard con métricas en tiempo real" },
  ],
  cta: "/empresas",
  color: "mensualista",
};

const empresasCrews = {
  title: "Soy tiquetera / productora",
  subtitle: "Eventos, conciertos, festivales",
  emoji: "🎭",
  bullets: [
    { icon: Users, text: "Ordena tu red de promotores" },
    { icon: Target, text: "Seguimiento por evento" },
    { icon: Trophy, text: "Gamificación + rankings" },
    { icon: BarChart3, text: "Cierres y reportes automáticos" },
  ],
  cta: "/crews/empresas",
  color: "crews",
};

export default function EmpresasSection() {
  const navigate = useNavigate();

  return (
    <section id="empresas" className="py-24 px-4 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/5">
            🏢 Para empresas
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Impulsa tus ventas con{" "}
            <span className="text-gradient-mensualista">Mensualista</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Accede a nuestra red de vendedores y paga solo por resultados. 
            Sin costos fijos, sin riesgos.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Empresas de Servicios */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-8 shadow-xl border border-border hover:shadow-2xl transition-shadow"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-mensualista flex items-center justify-center text-3xl shadow-lg">
                {empresasServicios.emoji}
              </div>
              <div>
                <h3 className="text-xl font-bold">{empresasServicios.title}</h3>
                <p className="text-sm text-muted-foreground">{empresasServicios.subtitle}</p>
              </div>
            </div>
            <ul className="space-y-4 mb-8">
              {empresasServicios.bullets.map((bullet, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <bullet.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm">{bullet.text}</span>
                </li>
              ))}
            </ul>
            <Button
              className="w-full bg-gradient-mensualista hover:opacity-90 text-white gap-2 shadow-lg"
              onClick={() => navigate(empresasServicios.cta)}
            >
              Publicar mi servicio
              <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>

          {/* Tiqueteras / Productoras */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 shadow-xl border border-neon-purple/20 glow-purple"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-crews flex items-center justify-center text-3xl shadow-lg">
                {empresasCrews.emoji}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{empresasCrews.title}</h3>
                <p className="text-sm text-gray-400">{empresasCrews.subtitle}</p>
              </div>
            </div>
            <ul className="space-y-4 mb-8">
              {empresasCrews.bullets.map((bullet, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-neon-purple/20 flex items-center justify-center">
                    <bullet.icon className="w-4 h-4 text-neon-purple" />
                  </div>
                  <span className="text-sm text-gray-300">{bullet.text}</span>
                </li>
              ))}
            </ul>
            <Button
              className="w-full bg-gradient-crews hover:opacity-90 text-white gap-2 shadow-lg"
              onClick={() => navigate(empresasCrews.cta)}
            >
              Gestionar mis eventos
              <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
