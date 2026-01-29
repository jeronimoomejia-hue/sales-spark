import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Ticket, 
  TrendingUp, 
  Star,
  ChevronRight,
  Sparkles,
  MapPin,
  Calendar,
  DollarSign,
  Zap,
  Crown,
  Gift,
  Trophy,
  PartyPopper,
  Music,
  Mic2,
  Heart,
  CheckCircle2,
  Clock,
  Target
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Promotora {
  id: string;
  name: string;
  logo: string;
  tagline: string;
  activeEvents: number;
  totalSellers: number;
  totalSales: number;
  trend: number;
  commission: string;
  avgTicketPrice: string;
  location: string;
  nextEvent: string;
  rating: number;
  isHot?: boolean;
  isNew?: boolean;
  isPremium?: boolean;
  genre: string;
  color: string;
}

const mockPromotoras: Promotora[] = [
  {
    id: "promo-1",
    name: "NeonEvents Productions",
    logo: "🎉",
    tagline: "Los mejores eventos electrónicos de Colombia",
    activeEvents: 3,
    totalSellers: 89,
    totalSales: 4520,
    trend: 15,
    commission: "12%",
    avgTicketPrice: "$85,000",
    location: "Medellín, Bogotá",
    nextEvent: "Neon Fest 2026 - 15 Feb",
    rating: 4.9,
    isHot: true,
    isPremium: true,
    genre: "Electrónica",
    color: "from-neon-purple to-neon-pink",
  },
  {
    id: "promo-2",
    name: "Festival Colombia",
    logo: "🎪",
    tagline: "Cultura y música para todos",
    activeEvents: 2,
    totalSellers: 45,
    totalSales: 2180,
    trend: 8,
    commission: "10%",
    avgTicketPrice: "$120,000",
    location: "Nacional",
    nextEvent: "Carnaval Fest - 28 Feb",
    rating: 4.7,
    isNew: true,
    genre: "Variado",
    color: "from-neon-orange to-neon-yellow",
  },
  {
    id: "promo-3",
    name: "Rumba Nights",
    logo: "🌙",
    tagline: "Las noches más épicas de la ciudad",
    activeEvents: 1,
    totalSellers: 23,
    totalSales: 890,
    trend: 22,
    commission: "15%",
    avgTicketPrice: "$45,000",
    location: "Cali",
    nextEvent: "Noche Latina - 8 Feb",
    rating: 4.5,
    genre: "Latina",
    color: "from-neon-blue to-neon-green",
  },
  {
    id: "promo-4",
    name: "Rock en Vivo",
    logo: "🎸",
    tagline: "El rock nunca muere",
    activeEvents: 2,
    totalSellers: 34,
    totalSales: 1560,
    trend: 5,
    commission: "11%",
    avgTicketPrice: "$95,000",
    location: "Bogotá",
    nextEvent: "Metal Fest - 22 Feb",
    rating: 4.8,
    isPremium: true,
    genre: "Rock/Metal",
    color: "from-red-500 to-orange-500",
  },
  {
    id: "promo-5",
    name: "Urban Music Co",
    logo: "🎤",
    tagline: "Reggaeton, trap y más",
    activeEvents: 4,
    totalSellers: 156,
    totalSales: 8920,
    trend: 35,
    commission: "14%",
    avgTicketPrice: "$75,000",
    location: "Nacional",
    nextEvent: "Urban Kings - 5 Feb",
    rating: 4.9,
    isHot: true,
    genre: "Urbano",
    color: "from-neon-pink to-neon-purple",
  },
  {
    id: "promo-6",
    name: "Techno Underground",
    logo: "🔊",
    tagline: "Para los verdaderos amantes del techno",
    activeEvents: 1,
    totalSellers: 18,
    totalSales: 420,
    trend: 12,
    commission: "13%",
    avgTicketPrice: "$65,000",
    location: "Medellín",
    nextEvent: "Dark Warehouse - 14 Feb",
    rating: 4.6,
    isNew: true,
    genre: "Techno",
    color: "from-gray-600 to-gray-800",
  },
];

const highlights = [
  { icon: DollarSign, text: "Comisiones del 10% al 15%", color: "text-neon-green" },
  { icon: Zap, text: "Pagos semanales", color: "text-neon-yellow" },
  { icon: Gift, text: "Bonos por metas", color: "text-neon-pink" },
  { icon: Trophy, text: "Ranking de vendedores", color: "text-neon-purple" },
];

interface PromotoraSelectorProps {
  onSelect: (promotoraId: string) => void;
  selectedId?: string;
}

export function PromotoraSelector({ onSelect, selectedId }: PromotoraSelectorProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-neon-pink/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-10 w-64 h-64 bg-neon-blue/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative z-10 px-4 md:px-8 py-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          {/* Welcome Badge */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-party mb-6"
          >
            <PartyPopper className="w-5 h-5 text-white" />
            <span className="text-white font-semibold">¡Bienvenido, Vendedor! 🎉</span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-bold font-display mb-4">
            Elige tu{" "}
            <span className="text-gradient-party">Promotora</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            Selecciona para qué productora quieres vender boletas y comienza a generar ingresos 💰
          </p>

          {/* Highlights Bar */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {highlights.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border"
              >
                <item.icon className={`w-4 h-4 ${item.color}`} />
                <span className="text-sm font-medium">{item.text}</span>
              </motion.div>
            ))}
          </div>

          {/* Stats Summary */}
          <Card variant="glass" className="inline-flex items-center gap-6 md:gap-10 px-6 py-4">
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-gradient-party">6</p>
              <p className="text-xs text-muted-foreground">Promotoras</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-gradient-party">13</p>
              <p className="text-xs text-muted-foreground">Eventos Activos</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-gradient-party">365+</p>
              <p className="text-xs text-muted-foreground">Vendedores</p>
            </div>
          </Card>
        </motion.div>

        {/* Featured Section Title */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-party flex items-center justify-center">
            <Crown className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display">Promotoras Disponibles</h2>
            <p className="text-sm text-muted-foreground">Elige una o varias para comenzar</p>
          </div>
        </motion.div>

        {/* Promotoras Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {mockPromotoras.map((promotora, index) => (
            <motion.div
              key={promotora.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card
                variant="neon"
                className={cn(
                  "relative overflow-hidden cursor-pointer transition-all duration-300",
                  "hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/20",
                  selectedId === promotora.id && "ring-2 ring-primary shadow-lg shadow-primary/30"
                )}
                onClick={() => onSelect(promotora.id)}
              >
                {/* Top Gradient Bar */}
                <div className={`h-2 bg-gradient-to-r ${promotora.color}`} />
                
                {/* Badges */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  {promotora.isHot && (
                    <Badge className="bg-neon-orange/20 text-neon-orange border-neon-orange/30">
                      🔥 Hot
                    </Badge>
                  )}
                  {promotora.isNew && (
                    <Badge className="bg-neon-green/20 text-neon-green border-neon-green/30">
                      ✨ Nueva
                    </Badge>
                  )}
                  {promotora.isPremium && (
                    <Badge className="bg-neon-yellow/20 text-neon-yellow border-neon-yellow/30">
                      <Crown className="w-3 h-3 mr-1" /> Premium
                    </Badge>
                  )}
                </div>

                <div className="p-6">
                  {/* Logo & Info */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${promotora.color} flex items-center justify-center text-4xl shadow-lg`}>
                      {promotora.logo}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg font-display truncate">{promotora.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{promotora.tagline}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 text-neon-yellow fill-neon-yellow" />
                        <span className="text-sm font-medium">{promotora.rating}</span>
                        <span className="text-xs text-muted-foreground">• {promotora.genre}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="p-3 rounded-xl bg-card-elevated text-center">
                      <Ticket className="w-4 h-4 mx-auto mb-1 text-neon-pink" />
                      <p className="text-lg font-bold">{promotora.activeEvents}</p>
                      <p className="text-[10px] text-muted-foreground">Eventos</p>
                    </div>
                    <div className="p-3 rounded-xl bg-card-elevated text-center">
                      <Users className="w-4 h-4 mx-auto mb-1 text-neon-blue" />
                      <p className="text-lg font-bold">{promotora.totalSellers}</p>
                      <p className="text-[10px] text-muted-foreground">Vendedores</p>
                    </div>
                    <div className="p-3 rounded-xl bg-card-elevated text-center">
                      <DollarSign className="w-4 h-4 mx-auto mb-1 text-neon-green" />
                      <p className="text-lg font-bold">{promotora.commission}</p>
                      <p className="text-[10px] text-muted-foreground">Comisión</p>
                    </div>
                  </div>

                  {/* Info Pills */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-card-elevated text-xs">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      <span>{promotora.location}</span>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-card-elevated text-xs">
                      <Ticket className="w-3 h-3 text-muted-foreground" />
                      <span>{promotora.avgTicketPrice}</span>
                    </div>
                  </div>

                  {/* Next Event */}
                  <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="text-xs text-muted-foreground">Próximo evento:</span>
                    </div>
                    <p className="text-sm font-semibold mt-1">{promotora.nextEvent}</p>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className={cn(
                      "flex items-center gap-1 text-sm font-semibold",
                      promotora.trend >= 0 ? "text-success" : "text-destructive"
                    )}>
                      <TrendingUp className={cn("w-4 h-4", promotora.trend < 0 && "rotate-180")} />
                      {promotora.trend >= 0 ? "+" : ""}{promotora.trend}% ventas
                    </div>
                    <Button variant="party" size="sm" className="gap-1">
                      Vender Aquí
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card variant="glass" className="p-6 md:p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="text-4xl">🤔</div>
              <h3 className="text-xl font-bold font-display">¿No encuentras tu promotora?</h3>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Si la productora con la que quieres trabajar no está en la lista, 
              podemos ayudarte a conectarla o invitarla a CREWS
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" className="gap-2">
                <Target className="w-4 h-4" />
                Solicitar Promotora
              </Button>
              <Button variant="ghost" className="gap-2">
                <Heart className="w-4 h-4" />
                Contactar Soporte
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-success" />
            Puedes vender para múltiples promotoras simultáneamente
          </p>
        </motion.div>
      </div>
    </div>
  );
}
