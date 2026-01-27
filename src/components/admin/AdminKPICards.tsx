import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  TicketIcon, 
  Users, 
  Banknote, 
  Wallet,
  TrendingUp,
  TrendingDown,
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";
import { organizationData, getTotalSales, getEventSales, events } from "@/data/mockData";

interface AdminKPI {
  title: string;
  value: string;
  subtitle: string;
  trend?: { value: number; isPositive: boolean };
  icon: React.ElementType;
  iconColor: string;
  accentColor: string;
}

interface AdminKPICardsProps {
  selectedEventId?: string | 'all';
}

export function AdminKPICards({ selectedEventId = 'all' }: AdminKPICardsProps) {
  // Calculate KPIs based on event filter with hierarchical aggregation
  const getKPIData = (): AdminKPI[] => {
    const org = organizationData;
    
    if (selectedEventId === 'all') {
      const totalSales = getTotalSales(org, 'month') + org.teamSales.month;
      const todaySales = org.ownSales.today + org.teamSales.today;
      
      return [
        {
          title: "Ventas Totales",
          value: totalSales.toLocaleString(),
          subtitle: `Hoy: ${todaySales} tickets`,
          trend: { value: 23, isPositive: true },
          icon: TicketIcon,
          iconColor: "text-neon-purple",
          accentColor: "from-neon-purple/20 to-neon-purple/5",
        },
        {
          title: "Vendedores",
          value: "89",
          subtitle: "Activos: 87 | Nuevos: 8",
          icon: Users,
          iconColor: "text-neon-blue",
          accentColor: "from-neon-blue/20 to-neon-blue/5",
        },
        {
          title: "Recaudo Total",
          value: "$498.3M",
          subtitle: "COP este período",
          trend: { value: 95, isPositive: true },
          icon: Banknote,
          iconColor: "text-neon-green",
          accentColor: "from-neon-green/20 to-neon-green/5",
        },
        {
          title: "Comisiones",
          value: "$93.4M",
          subtitle: "Pendiente: $12.5M",
          trend: { value: 18, isPositive: true },
          icon: Wallet,
          iconColor: "text-neon-yellow",
          accentColor: "from-neon-yellow/20 to-neon-yellow/5",
        },
      ];
    }

    // Event-specific data
    const eventSales = getEventSales(org, selectedEventId);
    const event = events.find(e => e.id === selectedEventId);
    const totalTickets = eventSales.total;
    const revenue = totalTickets * (event?.ticketPrice || 40000);
    const commission = eventSales.ownCommission + eventSales.teamCommission;

    return [
      {
        title: "Ventas Evento",
        value: totalTickets.toLocaleString(),
        subtitle: `${event?.name || 'Evento'}`,
        trend: { value: 15, isPositive: true },
        icon: TicketIcon,
        iconColor: "text-neon-purple",
        accentColor: "from-neon-purple/20 to-neon-purple/5",
      },
      {
        title: "Vendedores Activos",
        value: "67",
        subtitle: "En este evento",
        icon: Users,
        iconColor: "text-neon-blue",
        accentColor: "from-neon-blue/20 to-neon-blue/5",
      },
      {
        title: "Recaudo Evento",
        value: `$${(revenue / 1000000).toFixed(1)}M`,
        subtitle: "COP",
        trend: { value: 12, isPositive: true },
        icon: Banknote,
        iconColor: "text-neon-green",
        accentColor: "from-neon-green/20 to-neon-green/5",
      },
      {
        title: "Comisiones Evento",
        value: `$${(commission / 1000000).toFixed(1)}M`,
        subtitle: "Agregadas del equipo",
        trend: { value: 8, isPositive: true },
        icon: Wallet,
        iconColor: "text-neon-yellow",
        accentColor: "from-neon-yellow/20 to-neon-yellow/5",
      },
    ];
  };

  const kpiData = getKPIData();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpiData.map((kpi, index) => (
        <motion.div
          key={kpi.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
        >
          <Card variant="neon" className="relative overflow-hidden p-5 cursor-pointer hover:border-primary/40 transition-all group">
            {/* Gradient background accent */}
            <div className={cn(
              "absolute inset-0 bg-gradient-to-br opacity-50",
              kpi.accentColor
            )} />
            
            <div className="relative z-10">
              {/* Icon and trend */}
              <div className="flex items-start justify-between mb-3">
                <div className={cn(
                  "p-2.5 rounded-xl bg-card-elevated border border-border",
                  kpi.iconColor
                )}>
                  <kpi.icon className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-2">
                  {kpi.trend && (
                    <div className={cn(
                      "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                      kpi.trend.isPositive 
                        ? "text-success bg-success/10" 
                        : "text-destructive bg-destructive/10"
                    )}>
                      {kpi.trend.isPositive ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      <span>+{kpi.trend.value}%</span>
                    </div>
                  )}
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              {/* Value */}
              <div className="mb-1">
                <span className="text-3xl font-bold font-display text-foreground">
                  {kpi.value}
                </span>
              </div>

              {/* Title and subtitle */}
              <p className="text-sm font-medium text-foreground mb-0.5">{kpi.title}</p>
              <p className="text-xs text-muted-foreground">{kpi.subtitle}</p>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
