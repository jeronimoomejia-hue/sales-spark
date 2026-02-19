import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles, Users, ArrowRight, ArrowDown, Ticket, Trophy, DollarSign,
  ClipboardCheck, Banknote, BarChart3, Smartphone, Bell, Rocket,
  CheckCircle2, Star, Building2, Network, Gamepad2, Wallet,
  ChevronDown, ExternalLink, Shield, FileText, Link2
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Animated counter component
function AnimatedCounter({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

const testimonials = [
  {
    name: "Andrea Muñoz",
    role: "Promotora",
    avatar: "👩‍💼",
    quote: "Antes tenía que manejar todo en efectivo y con WhatsApp. Con CREWS cada vendedor tiene su acuerdo firmado y les pago con comprobante. Cero estrés.",
    type: "promotora",
  },
  {
    name: "Carlos Ruiz",
    role: "Vendedor — Nivel Cabeza",
    avatar: "👨‍🎤",
    quote: "Sé exactamente cuánto me van a pagar porque firmé mi acuerdo de comisiones. El pago me llega virtual, sin perseguir a nadie.",
    type: "vendedor",
  },
  {
    name: "Natalia Restrepo",
    role: "Productora de Eventos",
    avatar: "👩‍🎤",
    quote: "Mis vendedores ya no son informales. Con CREWS tengo un registro legal de cada persona y cada peso que se mueve. Es tranquilidad total.",
    type: "promotora",
  },
];

const faqData = [
  {
    category: "Promotoras",
    items: [
      { q: "¿Qué documentos firma el vendedor al registrarse?", a: "Al registrarse, cada vendedor acepta digitalmente los Términos y Condiciones, la Política de Tratamiento de Datos Personales y el Acuerdo de Comisiones. Estos documentos quedan vinculados a su perfil con fecha, hora e IP." },
      { q: "¿Cómo funciona el cierre de un evento?", a: "Tú defines la hora de cierre del evento. Cuando llega esa hora, los links de venta se desactivan automáticamente y se genera un resumen de comisiones por vendedor. Luego vas vendedor por vendedor subiendo el comprobante de pago." },
      { q: "¿Tengo que manejar efectivo?", a: "No. Las comisiones son 100% virtuales. Tú subes el comprobante de la transferencia o pago digital y el vendedor lo confirma desde la plataforma." },
    ],
  },
  {
    category: "Vendedores",
    items: [
      { q: "¿Necesito experiencia para vender?", a: "No. Solo necesitas registrarte, aceptar tu acuerdo de comisiones y empezar a compartir tu link de ventas. La plataforma te guía paso a paso." },
      { q: "¿Cómo me pagan?", a: "Tu promotora te paga de forma 100% virtual (transferencia, Nequi, Daviplata, etc.) después de cada evento. Suben el comprobante a CREWS y tú lo confirmas." },
      { q: "¿Cuándo cobro?", a: "Cobras después de cada evento, cuando la promotora ejecuta el cierre y procesa los pagos. Recibirás una notificación por WhatsApp cuando tu comprobante esté listo." },
      { q: "¿Qué pasa si un evento se cancela?", a: "Las políticas de cancelación dependen de cada promotora y están sujetas a los términos del evento. CREWS te notificará cualquier cambio." },
    ],
  },
  {
    category: "Pagos y Comisiones",
    items: [
      { q: "¿Cuánto gano por ticket?", a: "Depende de tu nivel: Promotor Común $7,500 COP, Cabeza $10,000 COP, Sub Socio $15,000 COP, Socio $17,500 COP por ticket vendido." },
      { q: "¿Mis ganancias están garantizadas?", a: "Sí. Al registrarte firmas un Acuerdo de Comisiones que establece el monto por ticket, el ciclo de pagos y el método de pago virtual. Tienes respaldo legal." },
    ],
  },
];

export default function Landing() {
  const navigate = useNavigate();
  const sellersRef = useRef<HTMLDivElement>(null);

  const scrollToSellers = () => {
    sellersRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden crews-mode">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-party flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold font-display text-gradient-party">CREWS</span>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#promotoras" className="hover:text-foreground transition-colors">Promotoras</a>
            <a href="#vendedores" className="hover:text-foreground transition-colors">Vendedores</a>
            <a href="#como-funciona" className="hover:text-foreground transition-colors">Cómo funciona</a>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>Iniciar sesión</Button>
            <Button variant="party" size="sm" onClick={() => navigate("/register")} className="gap-2">
              <Rocket className="w-4 h-4" />
              Registrarse
            </Button>
          </motion.div>
        </nav>
      </header>

      {/* SECTION 1 — HERO DUAL */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-neon-pink/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>

        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm bg-primary/20 border-primary/30">
              <Shield className="w-3.5 h-3.5 mr-2" /> Vendedores formalizados • Pagos 100% virtuales
            </Badge>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold font-display mb-6 leading-tight">
            Tu red de vendedores,{" "}
            <span className="text-gradient-party">formalizada y bajo control</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
            CREWS convierte el caos de vender boletas en un sistema organizado, legal y 100% virtual.
            Para promotoras que quieren control. Para vendedores que quieren crecer.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button variant="party" size="xl" onClick={() => navigate("/register?type=promotora")} className="gap-2 text-lg">
              <Building2 className="w-5 h-5" />
              Registrar mi red
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="xl" onClick={scrollToSellers} className="gap-2 text-lg border-primary/30 hover:bg-primary/10">
              <Ticket className="w-5 h-5" />
              Quiero ser vendedor
              <ArrowDown className="w-5 h-5" />
            </Button>
          </motion.div>

          {/* Hierarchy visual */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-12 max-w-2xl mx-auto">
            <Card variant="glass" className="p-6 glass-dark">
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-neon-pink/30 flex items-center justify-center text-sm font-bold border border-neon-pink/50">S</div>
                  <span className="text-sm text-muted-foreground">Socio — $17,500/ticket</span>
                </div>
                <div className="w-px h-4 bg-border" />
                <div className="flex items-center gap-6">
                  {["SS", "SS"].map((label, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-neon-orange/30 flex items-center justify-center text-xs font-bold border border-neon-orange/50">{label}</div>
                      <span className="text-xs text-muted-foreground">$15K</span>
                    </div>
                  ))}
                </div>
                <div className="w-px h-4 bg-border" />
                <div className="flex items-center gap-4 flex-wrap justify-center">
                  {["C", "C", "C", "C"].map((label, i) => (
                    <div key={i} className="w-7 h-7 rounded-full bg-neon-purple/30 flex items-center justify-center text-xs font-bold border border-neon-purple/50">{label}</div>
                  ))}
                </div>
                <div className="w-px h-4 bg-border" />
                <div className="flex items-center gap-3 flex-wrap justify-center">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="w-6 h-6 rounded-full bg-neon-blue/30 flex items-center justify-center text-[10px] font-bold border border-neon-blue/50">P</div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">Estructura jerárquica con comisiones por nivel</p>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2 — PARA PROMOTORAS */}
      <section id="promotoras" className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-purple/5 to-transparent" />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
            <Badge variant="secondary" className="mb-4 bg-neon-purple/20 text-neon-purple border-neon-purple/30">
              <Building2 className="w-3.5 h-3.5 mr-1" /> Para Promotoras
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
              Deja de lidiar con vendedores informales{" "}
              <span className="text-gradient-party">y efectivo sin control</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Con CREWS, cada vendedor firma digitalmente su acuerdo de comisiones antes de vender.
              Todo el dinero fluye de forma virtual. Tú solo pagas con comprobante.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: ClipboardCheck, title: "Personal formalizado", desc: "Cada vendedor acepta un acuerdo de comisiones digital antes de vender. Tienes respaldo legal desde el primer ticket.", color: "text-neon-green", bg: "bg-neon-green/10" },
              { icon: Banknote, title: "Cero efectivo", desc: "Las comisiones son 100% virtuales. Subes el comprobante de pago en la plataforma y listo. Sin plata en mano, sin desorden.", color: "text-neon-blue", bg: "bg-neon-blue/10" },
              { icon: BarChart3, title: "Trazabilidad total", desc: "Cada venta se atribuye automáticamente al vendedor que la generó, en tiempo real, vía integración con Quentro, TuBoleta y Eventbrite.", color: "text-neon-purple", bg: "bg-neon-purple/10" },
            ].map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Card variant="neon" className="p-6 h-full hover:scale-[1.02] transition-transform">
                  <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center mb-4`}>
                    <item.icon className={`w-7 h-7 ${item.color}`} />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Button variant="party" size="lg" onClick={() => navigate("/register?type=promotora")} className="gap-2">
              Empezar como Promotora <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* SECTION 3 — PARA VENDEDORES */}
      <section id="vendedores" ref={sellersRef} className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-pink/5 to-transparent" />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
            <Badge variant="secondary" className="mb-4 bg-neon-pink/20 text-neon-pink border-neon-pink/30">
              <Ticket className="w-3.5 h-3.5 mr-1" /> Para Vendedores
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
              Vende boletas, gana comisiones reales{" "}
              <span className="text-gradient-party">y crece en tu carrera</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Únete a una red formal, recibe tus pagos de forma virtual y compite por los mejores rankings. Sin efectivo, sin incertidumbre.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {[
              { icon: DollarSign, text: "Comisiones desde $7,500 COP por ticket", color: "text-neon-green" },
              { icon: Link2, text: "Tu link único de ventas listo en minutos", color: "text-neon-blue" },
              { icon: Trophy, text: "Rankings, hitos y recompensas en tiempo real", color: "text-neon-yellow" },
              { icon: FileText, text: "Acuerdo de comisiones firmado digitalmente — tus ganancias garantizadas", color: "text-neon-purple" },
              { icon: Bell, text: "Notificaciones por WhatsApp en cada momento clave", color: "text-neon-pink" },
              { icon: Rocket, text: "Crece de Promotor Común a Sub Socio con más comisiones", color: "text-neon-orange" },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <Card variant="glass" className="p-5 h-full flex items-start gap-4 glass-dark hover:border-primary/30 transition-all">
                  <item.icon className={`w-6 h-6 ${item.color} shrink-0 mt-0.5`} />
                  <p className="text-sm font-medium">{item.text}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Button variant="party" size="lg" onClick={() => navigate("/register?type=vendedor")} className="gap-2">
              Quiero ser Vendedor <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* SECTION 4 — CÓMO FUNCIONA */}
      <section id="como-funciona" className="py-24 px-4 relative bg-card/50">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-neon-blue/20 text-neon-blue border-neon-blue/30">
              🎯 Paso a paso
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold font-display">
              Así funciona <span className="text-gradient-party">CREWS</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Promotora steps */}
            <div>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-neon-purple" /> Para Promotoras
              </h3>
              <div className="space-y-4">
                {[
                  "Crea tu cuenta de promotora",
                  "Configura tu evento y define la hora de cierre",
                  "Recluta vendedores — ellos firman su acuerdo al registrarse",
                  "Monitorea ventas en tiempo real desde tu dashboard",
                  "Al cierre, paga cada vendedor con comprobante desde la plataforma",
                ].map((step, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-crews flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-sm text-muted-foreground pt-1">{step}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Vendor steps */}
            <div>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Ticket className="w-5 h-5 text-neon-pink" /> Para Vendedores
              </h3>
              <div className="space-y-4">
                {[
                  "Regístrate y acepta tu acuerdo de comisiones",
                  "Elige la promotora y el evento para el que quieres vender",
                  "Recibe tu link único de ventas",
                  "Vende y ve tus comisiones acumularse en tiempo real",
                  "Cuando se cierra el evento, recibe tu pago virtual con comprobante",
                ].map((step, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-party flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-sm text-muted-foreground pt-1">{step}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — PRUEBA SOCIAL */}
      <section className="py-24 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
              Números que <span className="text-gradient-party">hablan</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {[
              { value: 1200, suffix: "+", label: "Vendedores formalizados" },
              { value: 480, prefix: "$", suffix: "M COP", label: "Comisiones pagadas" },
              { value: 38, label: "Eventos gestionados" },
              { value: 100, suffix: "%", label: "Pagos virtuales" },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Card variant="glass" className="p-6 text-center glass-dark">
                  <p className="text-3xl md:text-4xl font-bold font-display text-gradient-party">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">{stat.label}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Card variant="neon" className="p-6 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-party flex items-center justify-center text-2xl">{t.avatar}</div>
                    <div>
                      <p className="font-bold text-sm">{t.name}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-muted-foreground">{t.role}</p>
                        <Badge variant={t.type === "promotora" ? "default" : "neon"} className="text-[10px] px-1.5 py-0">
                          {t.type === "promotora" ? "Promotora" : "Vendedor"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground italic">"{t.quote}"</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 — FAQ */}
      <section id="faq" className="py-24 px-4 relative bg-card/50">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-4xl font-bold font-display mb-4">Preguntas <span className="text-gradient-party">frecuentes</span></h2>
          </motion.div>

          {faqData.map((category) => (
            <div key={category.category} className="mb-8">
              <h3 className="text-lg font-semibold mb-3 text-primary">{category.category}</h3>
              <Accordion type="single" collapsible className="space-y-2">
                {category.items.map((item, i) => (
                  <AccordionItem key={i} value={`${category.category}-${i}`} className="border border-border rounded-lg px-4 bg-card/50">
                    <AccordionTrigger className="text-sm font-medium text-left">{item.q}</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">{item.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 7 — CTA FINAL */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-cta opacity-10" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl md:text-5xl font-bold font-display mb-6">
              ¿Listo para dejar{" "}
              <span className="text-gradient-party">el caos atrás?</span>
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Button variant="party" size="xl" onClick={() => navigate("/register?type=promotora")} className="gap-2 text-lg">
                <Building2 className="w-5 h-5" />
                Registrar mi red de vendedores
              </Button>
              <Button variant="outline" size="xl" onClick={() => navigate("/register?type=vendedor")} className="gap-2 text-lg border-primary/30 hover:bg-primary/10">
                <Ticket className="w-5 h-5" />
                Unirme como vendedor
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-party flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-gradient-party">CREWS</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Términos y Condiciones</a>
              <a href="#" className="hover:text-foreground transition-colors">Política de Privacidad</a>
              <a href="#" className="hover:text-foreground transition-colors">Contacto</a>
            </div>
            <p className="text-xs text-muted-foreground">© 2026 CREWS. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
