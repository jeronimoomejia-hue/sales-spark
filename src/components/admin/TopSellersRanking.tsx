import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  ChevronRight, 
  Trophy, 
  Medal, 
  Award,
  Eye,
  TrendingUp,
  TicketIcon,
  DollarSign,
  Star
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface Seller {
  id: string;
  name: string;
  avatar: string;
  level: string;
  tickets: number;
  commission: number;
  trend: number;
  eventsActive: number;
  milestones: number;
  avgPerDay: number;
}

const topSellers: Seller[] = [
  { id: "1", name: "Carlos Ruiz", avatar: "CR", level: "Común", tickets: 285, commission: 2137500, trend: 15, eventsActive: 3, milestones: 4, avgPerDay: 9.5 },
  { id: "2", name: "Ana Torres", avatar: "AT", level: "Común", tickets: 248, commission: 1860000, trend: 12, eventsActive: 3, milestones: 3, avgPerDay: 8.2 },
  { id: "3", name: "Juan Pérez", avatar: "JP", level: "Cabeza", tickets: 1245, commission: 12450000, trend: 8, eventsActive: 3, milestones: 8, avgPerDay: 41.5 },
  { id: "4", name: "Sandra García", avatar: "SG", level: "Cabeza", tickets: 987, commission: 9870000, trend: 22, eventsActive: 2, milestones: 6, avgPerDay: 32.9 },
  { id: "5", name: "Luis Gómez", avatar: "LG", level: "Común", tickets: 198, commission: 1485000, trend: -3, eventsActive: 2, milestones: 2, avgPerDay: 6.6 },
  { id: "6", name: "María López", avatar: "ML", level: "Común", tickets: 186, commission: 1395000, trend: 5, eventsActive: 3, milestones: 2, avgPerDay: 6.2 },
  { id: "7", name: "Pedro Díaz", avatar: "PD", level: "Común", tickets: 175, commission: 1312500, trend: 18, eventsActive: 2, milestones: 3, avgPerDay: 5.8 },
  { id: "8", name: "Laura Martínez", avatar: "LM", level: "Sub Socio", tickets: 3458, commission: 51870000, trend: 25, eventsActive: 3, milestones: 12, avgPerDay: 115.2 },
  { id: "9", name: "Roberto Silva", avatar: "RS", level: "Cabeza", tickets: 782, commission: 7820000, trend: 10, eventsActive: 3, milestones: 5, avgPerDay: 26.1 },
  { id: "10", name: "Diana Castro", avatar: "DC", level: "Cabeza", tickets: 588, commission: 5880000, trend: 7, eventsActive: 2, milestones: 4, avgPerDay: 19.6 },
];

const maxTickets = Math.max(...topSellers.map(s => s.tickets));

const getRankIcon = (index: number) => {
  switch (index) {
    case 0:
      return <Trophy className="w-5 h-5 text-neon-yellow" />;
    case 1:
      return <Medal className="w-5 h-5 text-muted-foreground" />;
    case 2:
      return <Award className="w-5 h-5 text-neon-orange" />;
    default:
      return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">{index + 1}</span>;
  }
};

const getLevelBadgeVariant = (level: string): "neon" | "warning" | "secondary" => {
  switch (level) {
    case "Sub Socio":
      return "neon";
    case "Cabeza":
      return "warning";
    default:
      return "secondary";
  }
};

export function TopSellersRanking() {
  const navigate = useNavigate();
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [showFullRanking, setShowFullRanking] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <Card variant="neon" className="h-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center gap-2">
              🏆 Top 10 Vendedores
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-1 text-primary"
              onClick={() => setShowFullRanking(true)}
            >
              Ver ranking
              <ChevronRight className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {topSellers.slice(0, 5).map((seller, index) => (
              <motion.div
                key={seller.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-card-elevated transition-colors cursor-pointer group"
                onClick={() => setSelectedSeller(seller)}
              >
                {/* Rank */}
                <div className="w-6 flex justify-center">
                  {getRankIcon(index)}
                </div>

                {/* Avatar */}
                <div className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold",
                  index === 0 ? "bg-gradient-party text-white" : 
                  index === 1 ? "bg-muted text-foreground" :
                  index === 2 ? "bg-neon-orange/20 text-neon-orange" :
                  "bg-card-elevated text-muted-foreground"
                )}>
                  {seller.avatar}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm truncate">{seller.name}</span>
                    <Badge variant={getLevelBadgeVariant(seller.level)} className="text-xs">
                      {seller.level}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress 
                      value={(seller.tickets / maxTickets) * 100} 
                      className="h-1.5 flex-1" 
                      indicatorColor={index < 3 ? "party" : "default"}
                    />
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {seller.tickets.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Trend + Actions */}
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "text-xs font-medium",
                    seller.trend >= 0 ? "text-success" : "text-destructive"
                  )}>
                    {seller.trend >= 0 ? "+" : ""}{seller.trend}%
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSeller(seller);
                    }}
                  >
                    <Eye className="w-3 h-3" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Seller Detail Modal */}
      <Dialog open={!!selectedSeller} onOpenChange={() => setSelectedSeller(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              Perfil del Vendedor
            </DialogTitle>
            <DialogDescription>
              Estadísticas detalladas
            </DialogDescription>
          </DialogHeader>

          {selectedSeller && (
            <div className="space-y-4 mt-4">
              {/* Seller Header */}
              <div className="flex items-center gap-4 p-4 rounded-lg bg-card-elevated">
                <div className="w-16 h-16 rounded-full bg-gradient-party flex items-center justify-center text-white font-bold text-xl">
                  {selectedSeller.avatar}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{selectedSeller.name}</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant={getLevelBadgeVariant(selectedSeller.level)}>
                      {selectedSeller.level}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Ranking #{topSellers.findIndex(s => s.id === selectedSeller.id) + 1}
                    </span>
                  </div>
                </div>
                <div className={cn(
                  "flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium",
                  selectedSeller.trend >= 0 ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                )}>
                  <TrendingUp className="w-4 h-4" />
                  {selectedSeller.trend >= 0 ? "+" : ""}{selectedSeller.trend}%
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 rounded-lg bg-card border border-border">
                  <TicketIcon className="w-5 h-5 mx-auto text-primary mb-1" />
                  <p className="text-xl font-bold">{selectedSeller.tickets.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Tickets Totales</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-card border border-border">
                  <DollarSign className="w-5 h-5 mx-auto text-success mb-1" />
                  <p className="text-xl font-bold">${(selectedSeller.commission / 1000000).toFixed(1)}M</p>
                  <p className="text-xs text-muted-foreground">Comisiones</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-card border border-border">
                  <Star className="w-5 h-5 mx-auto text-warning mb-1" />
                  <p className="text-xl font-bold">{selectedSeller.milestones}</p>
                  <p className="text-xs text-muted-foreground">Hitos</p>
                </div>
              </div>

              {/* Additional Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-card-elevated">
                  <p className="text-xs text-muted-foreground">Promedio Diario</p>
                  <p className="text-lg font-semibold">{selectedSeller.avgPerDay} tickets/día</p>
                </div>
                <div className="p-3 rounded-lg bg-card-elevated">
                  <p className="text-xs text-muted-foreground">Eventos Activos</p>
                  <p className="text-lg font-semibold">{selectedSeller.eventsActive} eventos</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setSelectedSeller(null)}>
                  Cerrar
                </Button>
                <Button variant="outline" className="flex-1">
                  Editar Nivel
                </Button>
                <Button 
                  variant="party" 
                  className="flex-1"
                  onClick={() => {
                    setSelectedSeller(null);
                    navigate('/admin/users');
                  }}
                >
                  Ver Perfil Completo
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Full Ranking Modal */}
      <Dialog open={showFullRanking} onOpenChange={setShowFullRanking}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              🏆 Ranking Completo de Vendedores
            </DialogTitle>
            <DialogDescription>
              Top 10 vendedores por tickets vendidos
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 mt-4">
            {topSellers.map((seller, index) => (
              <div
                key={seller.id}
                className="flex items-center justify-between p-3 rounded-lg bg-card-elevated border border-border hover:border-primary/40 transition-all cursor-pointer"
                onClick={() => {
                  setShowFullRanking(false);
                  setSelectedSeller(seller);
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 flex justify-center">
                    {getRankIcon(index)}
                  </div>
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-semibold",
                    index === 0 ? "bg-gradient-party text-white" : 
                    index === 1 ? "bg-muted text-foreground" :
                    index === 2 ? "bg-neon-orange/20 text-neon-orange" :
                    "bg-card text-muted-foreground"
                  )}>
                    {seller.avatar}
                  </div>
                  <div>
                    <p className="font-medium">{seller.name}</p>
                    <Badge variant={getLevelBadgeVariant(seller.level)} className="text-xs">
                      {seller.level}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-bold text-primary">{seller.tickets.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">tickets</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-success">${(seller.commission / 1000000).toFixed(1)}M</p>
                    <p className="text-xs text-muted-foreground">comisión</p>
                  </div>
                  <div className={cn(
                    "text-sm font-medium w-12 text-right",
                    seller.trend >= 0 ? "text-success" : "text-destructive"
                  )}>
                    {seller.trend >= 0 ? "+" : ""}{seller.trend}%
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => setShowFullRanking(false)}>
              Cerrar
            </Button>
            <Button 
              variant="party" 
              className="flex-1"
              onClick={() => {
                setShowFullRanking(false);
                navigate('/admin/users');
              }}
            >
              Ver Todos los Vendedores
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
