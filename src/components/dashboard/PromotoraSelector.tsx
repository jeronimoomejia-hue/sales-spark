import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Users, 
  Ticket, 
  TrendingUp, 
  Star,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Promotora {
  id: string;
  name: string;
  logo: string;
  activeEvents: number;
  totalSellers: number;
  totalSales: number;
  trend: number;
  isMain?: boolean;
}

const mockPromotoras: Promotora[] = [
  {
    id: "promo-1",
    name: "NeonEvents Productions",
    logo: "🎉",
    activeEvents: 3,
    totalSellers: 89,
    totalSales: 4520,
    trend: 15,
    isMain: true,
  },
  {
    id: "promo-2",
    name: "Festival Colombia",
    logo: "🎪",
    activeEvents: 2,
    totalSellers: 45,
    totalSales: 2180,
    trend: 8,
  },
  {
    id: "promo-3",
    name: "Rumba Nights",
    logo: "🌙",
    activeEvents: 1,
    totalSellers: 23,
    totalSales: 890,
    trend: -3,
  },
];

interface PromotoraSelectorProps {
  onSelect: (promotoraId: string) => void;
  selectedId?: string;
}

export function PromotoraSelector({ onSelect, selectedId }: PromotoraSelectorProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Panel de Vendedores</span>
          </div>
          <h1 className="text-4xl font-bold font-display bg-gradient-party bg-clip-text text-transparent">
            Selecciona tu Promotora
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Elige la productora para la que quieres vender y accede a tu dashboard personalizado
          </p>
        </motion.div>

        {/* Promotoras Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockPromotoras.map((promotora, index) => (
            <motion.div
              key={promotora.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card
                variant="neon"
                className={cn(
                  "p-6 cursor-pointer transition-all hover:scale-[1.02] relative overflow-hidden group",
                  selectedId === promotora.id && "ring-2 ring-primary",
                  promotora.isMain && "border-primary/50"
                )}
                onClick={() => onSelect(promotora.id)}
              >
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Main Badge */}
                {promotora.isMain && (
                  <Badge 
                    variant="secondary" 
                    className="absolute top-3 right-3 bg-primary/20 text-primary border-primary/30"
                  >
                    <Star className="w-3 h-3 mr-1 fill-primary" />
                    Principal
                  </Badge>
                )}

                {/* Logo & Name */}
                <div className="flex items-center gap-4 mb-6 relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-party flex items-center justify-center text-3xl shadow-lg shadow-primary/20">
                    {promotora.logo}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{promotora.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {promotora.activeEvents} eventos activos
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="p-3 rounded-lg bg-card-elevated">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-4 h-4 text-neon-blue" />
                      <span className="text-xs text-muted-foreground">Vendedores</span>
                    </div>
                    <p className="text-xl font-bold">{promotora.totalSellers}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-card-elevated">
                    <div className="flex items-center gap-2 mb-1">
                      <Ticket className="w-4 h-4 text-neon-pink" />
                      <span className="text-xs text-muted-foreground">Ventas</span>
                    </div>
                    <p className="text-xl font-bold">{promotora.totalSales.toLocaleString()}</p>
                  </div>
                </div>

                {/* Trend & CTA */}
                <div className="flex items-center justify-between">
                  <div className={cn(
                    "flex items-center gap-1 text-sm font-medium",
                    promotora.trend >= 0 ? "text-success" : "text-destructive"
                  )}>
                    <TrendingUp className={cn("w-4 h-4", promotora.trend < 0 && "rotate-180")} />
                    {promotora.trend >= 0 ? "+" : ""}{promotora.trend}% esta semana
                  </div>
                  <Button variant="ghost" size="sm" className="gap-1 text-primary">
                    Entrar
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <p className="text-sm text-muted-foreground">
            ¿No ves tu promotora? Solicita acceso a{" "}
            <span className="text-primary cursor-pointer hover:underline">soporte@neonevents.com</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
