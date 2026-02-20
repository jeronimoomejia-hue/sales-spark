import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Ticket,
  TrendingUp,
  Star,
  ChevronRight,
  MapPin,
  Calendar,
  DollarSign,
  Crown,
  PartyPopper,
  CheckCircle2,
  TicketIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Promotoras donde el vendedor ya tiene relación activa (ya vendió o fue aprobado)
interface ActivePromotora {
  id: string;
  name: string;
  logo: string;
  tagline: string;
  color: string;
  // Datos del vendedor en esta promotora
  myLevel: string;
  myCommission: string;
  myTicketsSold: number;
  myEarnings: string;
  // Info del evento activo
  activeEvents: ActiveEvent[];
}

interface ActiveEvent {
  id: string;
  name: string;
  date: string;
  venue: string;
  status: 'active' | 'upcoming';
}

// Solo las promotoras donde Carlos Ruiz (demo) tiene relación activa
const myPromotoras: ActivePromotora[] = [
  {
    id: "promo-neon",
    name: "NeonEvents Productions",
    logo: "🎉",
    tagline: "Los mejores eventos electrónicos de Colombia",
    color: "from-neon-purple to-neon-pink",
    myLevel: "Nivel 1",
    myCommission: "$7,500 / ticket",
    myTicketsSold: 285,
    myEarnings: "$2,137,500",
    activeEvents: [
      { id: "evt-1", name: "Neon Festival 2026", date: "15 Feb", venue: "Parque Simón Bolívar", status: "active" },
      { id: "evt-2", name: "Rock Night", date: "28 Feb", venue: "Movistar Arena", status: "active" },
      { id: "evt-3", name: "Electro Waves", date: "10 Mar", venue: "La 33", status: "upcoming" },
    ],
  },
  {
    id: "promo-urban",
    name: "Urban Music Co",
    logo: "🎤",
    tagline: "Reggaeton, trap y más",
    color: "from-neon-pink to-neon-orange",
    myLevel: "Nivel 1",
    myCommission: "$8,500 / ticket",
    myTicketsSold: 43,
    myEarnings: "$365,500",
    activeEvents: [
      { id: "urban-evt-1", name: "Urban Kings Vol. 3", date: "5 Feb", venue: "Movistar Arena", status: "active" },
    ],
  },
];

interface PromotoraSelectorProps {
  onSelect: (promotoraId: string) => void;
  selectedId?: string;
}

export function PromotoraSelector({ onSelect, selectedId }: PromotoraSelectorProps) {
  const totalTickets = myPromotoras.reduce((sum, p) => sum + p.myTicketsSold, 0);
  const totalEvents = myPromotoras.reduce((sum, p) => sum + p.activeEvents.length, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-neon-pink/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-10 w-64 h-64 bg-neon-blue/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative z-10 px-4 md:px-8 py-8 max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-party mb-6"
          >
            <PartyPopper className="w-5 h-5 text-white" />
            <span className="text-white font-semibold">¡Bienvenido de vuelta! 🎉</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold font-display mb-3">
            ¿Desde dónde{" "}
            <span className="text-gradient-party">vas a vender?</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Selecciona la promotora para ver tu dashboard de ese equipo
          </p>
        </motion.div>

        {/* Mi resumen global */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <Card variant="glass" className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-gradient-party">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold">Tu resumen como vendedor</p>
                <p className="text-sm text-muted-foreground">Acumulado en todas tus promotoras</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 rounded-xl bg-card-elevated border border-border">
                <p className="text-2xl font-bold text-gradient-party">{myPromotoras.length}</p>
                <p className="text-xs text-muted-foreground">Promotoras activas</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-card-elevated border border-border">
                <p className="text-2xl font-bold text-gradient-party">{totalEvents}</p>
                <p className="text-xs text-muted-foreground">Eventos en curso</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-card-elevated border border-border">
                <p className="text-2xl font-bold text-gradient-party">{totalTickets}</p>
                <p className="text-xs text-muted-foreground">Tickets vendidos (total)</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Lista de promotoras activas */}
        <div className="space-y-4">
          {myPromotoras.map((promotora, index) => (
            <motion.div
              key={promotora.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.2 + index * 0.1 }}
            >
              <Card
                variant="neon"
                className={cn(
                  "relative overflow-hidden cursor-pointer transition-all duration-300",
                  "hover:scale-[1.01] hover:shadow-2xl hover:shadow-primary/20",
                  selectedId === promotora.id && "ring-2 ring-primary shadow-lg shadow-primary/30"
                )}
                onClick={() => onSelect(promotora.id)}
              >
                {/* Top color bar */}
                <div className={`h-1.5 bg-gradient-to-r ${promotora.color}`} />

                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Logo */}
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${promotora.color} flex items-center justify-center text-3xl shadow-lg shrink-0`}>
                      {promotora.logo}
                    </div>

                    {/* Info principal */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-lg font-display">{promotora.name}</h3>
                        <Badge className="bg-success/20 text-success border-success/40 text-xs gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Activo
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{promotora.tagline}</p>

                      {/* Mis datos en esta promotora */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-card-elevated border border-border text-xs">
                          <Crown className="w-3 h-3 text-warning shrink-0" />
                          <span className="font-medium">{promotora.myLevel}</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-card-elevated border border-border text-xs">
                          <DollarSign className="w-3 h-3 text-success shrink-0" />
                          <span className="font-medium">{promotora.myCommission}</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-card-elevated border border-border text-xs">
                          <TicketIcon className="w-3 h-3 text-primary shrink-0" />
                          <span className="font-medium">{promotora.myTicketsSold} tickets</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-card-elevated border border-border text-xs">
                          <TrendingUp className="w-3 h-3 text-neon-pink shrink-0" />
                          <span className="font-medium">{promotora.myEarnings}</span>
                        </div>
                      </div>
                    </div>

                    {/* CTA */}
                    <Button variant="party" className="gap-2 shrink-0 self-center">
                      Ir al dashboard
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Eventos activos */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Eventos en los que estás
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {promotora.activeEvents.map(evt => (
                        <div
                          key={evt.id}
                          className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium",
                            evt.status === 'active'
                              ? "bg-primary/10 border-primary/30 text-primary"
                              : "bg-muted border-border text-muted-foreground"
                          )}
                        >
                          <Ticket className="w-3 h-3 shrink-0" />
                          {evt.name}
                          <span className="text-[10px] opacity-70">• {evt.date}</span>
                          {evt.status === 'upcoming' && (
                            <Badge className="text-[9px] h-3.5 px-1 bg-muted-foreground/20 text-muted-foreground border-0">
                              Próximo
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Nota informativa */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-success" />
            Solo ves las promotoras donde ya fuiste aprobado como vendedor
          </p>
        </motion.div>
      </div>
    </div>
  );
}
