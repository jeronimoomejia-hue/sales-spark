import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, Trophy, Medal, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface Seller {
  id: string;
  name: string;
  avatar: string;
  level: string;
  tickets: number;
  commission: number;
  trend: number;
}

const topSellers: Seller[] = [
  { id: "1", name: "Carlos Ruiz", avatar: "CR", level: "Común", tickets: 285, commission: 2137500, trend: 15 },
  { id: "2", name: "Ana Torres", avatar: "AT", level: "Común", tickets: 248, commission: 1860000, trend: 12 },
  { id: "3", name: "Juan Pérez", avatar: "JP", level: "Cabeza", tickets: 1245, commission: 12450000, trend: 8 },
  { id: "4", name: "Sandra García", avatar: "SG", level: "Cabeza", tickets: 987, commission: 9870000, trend: 22 },
  { id: "5", name: "Luis Gómez", avatar: "LG", level: "Común", tickets: 198, commission: 1485000, trend: -3 },
  { id: "6", name: "María López", avatar: "ML", level: "Común", tickets: 186, commission: 1395000, trend: 5 },
  { id: "7", name: "Pedro Díaz", avatar: "PD", level: "Común", tickets: 175, commission: 1312500, trend: 18 },
  { id: "8", name: "Laura Martínez", avatar: "LM", level: "Sub Socio", tickets: 3458, commission: 51870000, trend: 25 },
  { id: "9", name: "Roberto Silva", avatar: "RS", level: "Cabeza", tickets: 782, commission: 7820000, trend: 10 },
  { id: "10", name: "Diana Castro", avatar: "DC", level: "Cabeza", tickets: 588, commission: 5880000, trend: 7 },
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
  return (
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
          <Button variant="ghost" size="sm" className="gap-1 text-primary">
            Ver ranking
            <ChevronRight className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {topSellers.map((seller, index) => (
            <motion.div
              key={seller.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-card-elevated transition-colors"
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

              {/* Trend */}
              <div className={cn(
                "text-xs font-medium",
                seller.trend >= 0 ? "text-success" : "text-destructive"
              )}>
                {seller.trend >= 0 ? "+" : ""}{seller.trend}%
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
