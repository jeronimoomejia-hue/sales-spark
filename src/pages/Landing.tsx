import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  Users, 
  Target, 
  TrendingUp, 
  Zap,
  ArrowRight,
  TicketIcon,
  Trophy
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Gestión de Equipos",
    description: "Organiza vendedores en 4 niveles jerárquicos con control total",
    color: "text-neon-purple bg-neon-purple/10",
  },
  {
    icon: Target,
    title: "Hitos Gamificados",
    description: "Motiva a tu equipo con metas, bonos y recompensas",
    color: "text-neon-pink bg-neon-pink/10",
  },
  {
    icon: TrendingUp,
    title: "Analytics en Tiempo Real",
    description: "Visualiza ventas, comisiones y rendimiento al instante",
    color: "text-neon-blue bg-neon-blue/10",
  },
  {
    icon: Zap,
    title: "Webhooks Automáticos",
    description: "Integra ticketeras como Quentro para sincronizar ventas",
    color: "text-neon-green bg-neon-green/10",
  },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-neon-purple/5 via-transparent to-transparent" />
        </div>

        {/* Header */}
        <header className="absolute top-0 left-0 right-0 z-50 px-6 py-4">
          <nav className="max-w-7xl mx-auto flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-party flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold font-display text-gradient-party">CREWS</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <Button variant="ghost" onClick={() => navigate("/login")}>
                Iniciar Sesión
              </Button>
              <Button variant="party" onClick={() => navigate("/login")}>
                Comenzar
              </Button>
            </motion.div>
          </nav>
        </header>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-primary/30 mb-6">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-sm text-muted-foreground">
                Plataforma para promotoras de eventos
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold font-display mb-6 leading-tight"
          >
            Gestiona tu equipo de{" "}
            <span className="text-gradient-party">ventas de boletas</span>
            {" "}como nunca antes
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            CRM gamificado que transforma el caos de gestión de vendedores en un sistema 
            organizado, escalable y motivador.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button variant="party" size="xl" onClick={() => navigate("/dashboard")} className="gap-2">
              Ver Demo
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="xl" onClick={() => navigate("/login")}>
              Iniciar Sesión
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-3 gap-8 mt-16 max-w-lg mx-auto"
          >
            <div>
              <p className="text-3xl font-bold font-display text-gradient-party">12K+</p>
              <p className="text-sm text-muted-foreground">Ventas procesadas</p>
            </div>
            <div>
              <p className="text-3xl font-bold font-display text-gradient-party">89</p>
              <p className="text-sm text-muted-foreground">Promotores activos</p>
            </div>
            <div>
              <p className="text-3xl font-bold font-display text-gradient-party">$498M</p>
              <p className="text-sm text-muted-foreground">COP recaudados</p>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold font-display mb-4">
              Todo lo que necesitas para{" "}
              <span className="text-gradient-party">escalar tus ventas</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Una plataforma completa para gestionar, motivar y potenciar tu equipo de promotores
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 group"
              >
                <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold font-display mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <div className="p-8 rounded-3xl bg-card border border-primary/20 shadow-2xl shadow-primary/10">
            <Trophy className="w-16 h-16 mx-auto mb-6 text-neon-yellow" />
            <h2 className="text-3xl font-bold font-display mb-4">
              ¿Listo para gamificar tus ventas?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Únete a las promotoras que ya están transformando la gestión de sus equipos de venta
            </p>
            <Button variant="party" size="xl" onClick={() => navigate("/dashboard")} className="gap-2">
              Explorar Dashboard
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-party flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold font-display text-gradient-party">CREWS</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 CREWS. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
