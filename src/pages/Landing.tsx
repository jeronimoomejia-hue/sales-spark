import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Users, 
  Target, 
  TrendingUp, 
  Zap,
  ArrowRight,
  Ticket,
  Trophy,
  DollarSign,
  Clock,
  Star,
  CheckCircle2,
  Rocket,
  PartyPopper,
  Gift,
  Crown,
  Heart,
  Music,
  Mic2
} from "lucide-react";

const benefits = [
  {
    icon: DollarSign,
    title: "Gana Comisiones Atractivas",
    description: "Obtén hasta 15% de comisión por cada boleta vendida. Sin topes, sin límites.",
    emoji: "💰",
    color: "text-neon-green",
    bgColor: "bg-neon-green/10",
  },
  {
    icon: Clock,
    title: "Horarios 100% Flexibles",
    description: "Trabaja cuando quieras, desde donde quieras. Tú decides tu ritmo.",
    emoji: "⏰",
    color: "text-neon-blue",
    bgColor: "bg-neon-blue/10",
  },
  {
    icon: Trophy,
    title: "Bonos y Recompensas",
    description: "Alcanza hitos y desbloquea premios exclusivos, viajes y experiencias VIP.",
    emoji: "🏆",
    color: "text-neon-yellow",
    bgColor: "bg-neon-yellow/10",
  },
  {
    icon: Users,
    title: "Construye tu Equipo",
    description: "Crece como líder, recluta vendedores y gana comisiones de tu red.",
    emoji: "👥",
    color: "text-neon-purple",
    bgColor: "bg-neon-purple/10",
  },
  {
    icon: PartyPopper,
    title: "Acceso a Eventos",
    description: "Disfruta de entradas gratis y acceso backstage a los mejores eventos.",
    emoji: "🎉",
    color: "text-neon-pink",
    bgColor: "bg-neon-pink/10",
  },
  {
    icon: Rocket,
    title: "Crece sin Límites",
    description: "Sistema de niveles que te permite escalar y aumentar tus ganancias.",
    emoji: "🚀",
    color: "text-neon-orange",
    bgColor: "bg-neon-orange/10",
  },
];

const howItWorks = [
  {
    step: 1,
    title: "Regístrate Gratis",
    description: "Crea tu cuenta en minutos. Sin costos, sin compromisos.",
    emoji: "📝",
  },
  {
    step: 2,
    title: "Elige tu Promotora",
    description: "Selecciona las productoras con las que quieres trabajar.",
    emoji: "🎯",
  },
  {
    step: 3,
    title: "Obtén tu Link Único",
    description: "Recibe tu enlace personalizado para rastrear todas tus ventas.",
    emoji: "🔗",
  },
  {
    step: 4,
    title: "¡Empieza a Vender!",
    description: "Comparte, vende y gana. Así de simple.",
    emoji: "💸",
  },
];

const testimonials = [
  {
    name: "María González",
    role: "Top Seller - Nivel Socio",
    quote: "En 6 meses pasé de vender boletas a liderar un equipo de 15 personas. Ahora gano más que en mi trabajo anterior.",
    avatar: "👩‍💼",
    earnings: "$4.2M COP/mes",
    sales: "340 boletas/mes",
  },
  {
    name: "Carlos Mendoza",
    role: "Promotor Cabeza",
    quote: "La flexibilidad es increíble. Vendo mientras estudio y ya tengo ingresos estables cada mes.",
    avatar: "👨‍🎓",
    earnings: "$1.8M COP/mes",
    sales: "120 boletas/mes",
  },
  {
    name: "Laura Ramírez",
    role: "Sub Socio",
    quote: "Lo mejor son los bonos. El mes pasado gané un viaje a Cartagena por alcanzar mi meta.",
    avatar: "👩‍🎤",
    earnings: "$2.5M COP/mes",
    sales: "180 boletas/mes",
  },
];

const stats = [
  { value: "12,000+", label: "Vendedores Activos", emoji: "👥" },
  { value: "$2.8B", label: "COP Pagados en Comisiones", emoji: "💰" },
  { value: "89", label: "Eventos Este Mes", emoji: "🎉" },
  { value: "4.9★", label: "Satisfacción Vendedores", emoji: "⭐" },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-background/80 backdrop-blur-xl border-b border-border/50">
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
              Ya tengo cuenta
            </Button>
            <Button variant="party" onClick={() => navigate("/dashboard")} className="gap-2">
              <Rocket className="w-4 h-4" />
              ¡Quiero Vender!
            </Button>
          </motion.div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-neon-pink/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/5 via-transparent to-transparent" />
          {/* Floating emojis */}
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-32 left-20 text-5xl"
          >🎫</motion.div>
          <motion.div
            animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute top-40 right-32 text-4xl"
          >🎉</motion.div>
          <motion.div
            animate={{ y: [0, -15, 0], rotate: [0, 15, 0] }}
            transition={{ duration: 3.5, repeat: Infinity }}
            className="absolute bottom-40 left-32 text-4xl"
          >💸</motion.div>
          <motion.div
            animate={{ y: [0, 15, 0], rotate: [0, -15, 0] }}
            transition={{ duration: 4.5, repeat: Infinity }}
            className="absolute bottom-32 right-20 text-5xl"
          >🚀</motion.div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm bg-primary/20 border-primary/30">
              <span className="mr-2">🔥</span>
              +500 vendedores se unieron este mes
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold font-display mb-6 leading-tight"
          >
            Conviértete en{" "}
            <span className="text-gradient-party">Vendedor de Boletas</span>
            <br />
            y Gana Dinero Extra
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto"
          >
            Únete a la red de vendedores más grande de Colombia 🇨🇴
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            Vende boletas de los mejores eventos, gana comisiones atractivas y 
            construye tu propio equipo de ventas. <strong className="text-foreground">Sin inversión inicial.</strong>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
          >
            <Button variant="party" size="xl" onClick={() => navigate("/dashboard")} className="gap-2 text-lg">
              <Ticket className="w-5 h-5" />
              Empezar a Vender Ahora
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="xl" onClick={() => navigate("/login")} className="gap-2">
              <Users className="w-5 h-5" />
              Ya soy vendedor
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-muted-foreground flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-success" />
            Registro gratuito • Sin compromisos • Empieza hoy
          </motion.p>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <Card key={index} variant="glass" className="p-4 text-center">
                <span className="text-2xl mb-2 block">{stat.emoji}</span>
                <p className="text-2xl md:text-3xl font-bold font-display text-gradient-party">{stat.value}</p>
                <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
              </Card>
            ))}
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

      {/* Benefits Section */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4 bg-neon-green/20 text-neon-green border-neon-green/30">
              💎 Beneficios Exclusivos
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
              ¿Por qué ser{" "}
              <span className="text-gradient-party">Vendedor CREWS?</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Más que vender boletas, es una oportunidad de crecer profesionalmente y económicamente
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="neon" className="p-6 h-full hover:scale-[1.02] transition-transform group">
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-2xl ${benefit.bgColor} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                      {benefit.emoji}
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-lg font-bold font-display mb-2 ${benefit.color}`}>
                        {benefit.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-4 relative bg-card/50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4 bg-neon-blue/20 text-neon-blue border-neon-blue/30">
              🎯 Super Fácil
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
              ¿Cómo{" "}
              <span className="text-gradient-party">Funciona?</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              En 4 simples pasos estarás ganando dinero
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {howItWorks.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                <Card variant="glass" className="p-6 text-center h-full">
                  <div className="text-5xl mb-4">{step.emoji}</div>
                  <div className="w-10 h-10 rounded-full bg-gradient-party flex items-center justify-center text-white font-bold mx-auto mb-4">
                    {step.step}
                  </div>
                  <h3 className="font-bold font-display mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </Card>
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-primary" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4 bg-neon-pink/20 text-neon-pink border-neon-pink/30">
              ⭐ Historias de Éxito
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
              Vendedores{" "}
              <span className="text-gradient-party">Reales, Resultados Reales</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Conoce a quienes ya están transformando su vida vendiendo boletas
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="neon" className="p-6 h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-party flex items-center justify-center text-3xl">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold">{testimonial.name}</h4>
                      <p className="text-sm text-primary">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.quote}"</p>
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
                    <div className="text-center">
                      <p className="text-lg font-bold text-neon-green">{testimonial.earnings}</p>
                      <p className="text-xs text-muted-foreground">Ganancias</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-neon-blue">{testimonial.sales}</p>
                      <p className="text-xs text-muted-foreground">Ventas</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-transparent" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <Card variant="neon" className="p-8 md:p-12 bg-gradient-to-br from-card to-card-elevated border-primary/30">
            <div className="text-6xl mb-6">🎫💰🚀</div>
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
              ¿Listo para{" "}
              <span className="text-gradient-party">Empezar a Ganar?</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Únete hoy a miles de vendedores que ya están generando ingresos extra 
              vendiendo boletas de los mejores eventos
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="party" size="xl" onClick={() => navigate("/dashboard")} className="gap-2 text-lg">
                <PartyPopper className="w-5 h-5" />
                ¡Registrarme Gratis!
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-6 flex items-center justify-center gap-4">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-success" /> Sin costo
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-success" /> Sin inversión
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-success" /> Empieza hoy
              </span>
            </p>
          </Card>
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
            © 2026 CREWS. La plataforma #1 para vendedores de boletas en Colombia 🇨🇴
          </p>
        </div>
      </footer>
    </div>
  );
}
