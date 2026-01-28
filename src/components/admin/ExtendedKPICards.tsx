import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TicketIcon, 
  Users, 
  Banknote, 
  Wallet,
  TrendingUp,
  TrendingDown,
  Eye,
  Target,
  Clock,
  CheckCircle2,
  AlertCircle,
  Percent,
  BarChart3,
  Activity,
  DollarSign,
  UserCheck,
  UserX,
  Award,
  Zap
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { organizationData, getTotalSales, getEventSales, events } from "@/data/mockData";

interface KPIDetail {
  label: string;
  value: string;
  trend?: number;
  trendPositive?: boolean;
}

interface AdminKPI {
  id: string;
  title: string;
  value: string;
  subtitle: string;
  trend?: { value: number; isPositive: boolean };
  icon: React.ElementType;
  iconColor: string;
  accentColor: string;
  details: KPIDetail[];
}

interface ExtendedKPICardsProps {
  selectedEventId?: string | 'all';
}

export function ExtendedKPICards({ selectedEventId = 'all' }: ExtendedKPICardsProps) {
  const [selectedKPI, setSelectedKPI] = useState<AdminKPI | null>(null);
  
  const org = organizationData;
  
  // Calculate comprehensive KPI data
  const getKPIData = (): AdminKPI[] => {
    if (selectedEventId === 'all') {
      const totalSales = getTotalSales(org, 'month') + org.teamSales.month;
      const todaySales = org.ownSales.today + org.teamSales.today;
      const weekSales = org.ownSales.week + org.teamSales.week;
      
      return [
        {
          id: 'sales',
          title: "Ventas Totales",
          value: totalSales.toLocaleString(),
          subtitle: `Hoy: ${todaySales} | Semana: ${weekSales}`,
          trend: { value: 23, isPositive: true },
          icon: TicketIcon,
          iconColor: "text-neon-purple",
          accentColor: "from-neon-purple/20 to-neon-purple/5",
          details: [
            { label: "Ventas Hoy", value: todaySales.toString(), trend: 15, trendPositive: true },
            { label: "Ventas Semana", value: weekSales.toString(), trend: 8, trendPositive: true },
            { label: "Ventas Mes", value: totalSales.toString(), trend: 23, trendPositive: true },
            { label: "Promedio Diario", value: Math.round(totalSales / 30).toString() },
            { label: "Mejor Día", value: "285", trend: 45, trendPositive: true },
            { label: "Tickets VIP", value: "1,234", trend: 12, trendPositive: true },
          ]
        },
        {
          id: 'sellers',
          title: "Vendedores",
          value: "89",
          subtitle: "Activos: 87 | Nuevos: 8 | Inactivos: 2",
          icon: Users,
          iconColor: "text-neon-blue",
          accentColor: "from-neon-blue/20 to-neon-blue/5",
          details: [
            { label: "Vendedores Activos", value: "87" },
            { label: "Nuevos Esta Semana", value: "8", trend: 60, trendPositive: true },
            { label: "Inactivos", value: "2", trend: -50, trendPositive: true },
            { label: "Tasa Retención", value: "97.8%", trend: 2, trendPositive: true },
            { label: "Promedio Ventas/Vendedor", value: "14.2" },
            { label: "Top Performers (>50 ventas)", value: "12" },
          ]
        },
        {
          id: 'revenue',
          title: "Recaudo Total",
          value: "$498.3M",
          subtitle: "COP | Meta: $600M (83%)",
          trend: { value: 95, isPositive: true },
          icon: Banknote,
          iconColor: "text-neon-green",
          accentColor: "from-neon-green/20 to-neon-green/5",
          details: [
            { label: "Recaudo Hoy", value: "$12.8M", trend: 18, trendPositive: true },
            { label: "Recaudo Semana", value: "$87.5M", trend: 12, trendPositive: true },
            { label: "Recaudo Mes", value: "$498.3M", trend: 95, trendPositive: true },
            { label: "Meta Mensual", value: "$600M" },
            { label: "% Meta Alcanzada", value: "83%" },
            { label: "Proyección Cierre", value: "$578M" },
          ]
        },
        {
          id: 'commissions',
          title: "Comisiones",
          value: "$93.4M",
          subtitle: "Pendiente: $12.5M | Pagado: $80.9M",
          trend: { value: 18, isPositive: true },
          icon: Wallet,
          iconColor: "text-neon-yellow",
          accentColor: "from-neon-yellow/20 to-neon-yellow/5",
          details: [
            { label: "Comisiones Generadas", value: "$93.4M" },
            { label: "Comisiones Pagadas", value: "$80.9M" },
            { label: "Comisiones Pendientes", value: "$12.5M" },
            { label: "Promedio por Vendedor", value: "$1.05M" },
            { label: "Tasa Comisión Promedio", value: "18.7%" },
            { label: "Cierres Aprobados", value: "45/53" },
          ]
        },
        {
          id: 'conversion',
          title: "Tasa Conversión",
          value: "68.5%",
          subtitle: "Links visitados: 18,456",
          trend: { value: 5, isPositive: true },
          icon: Percent,
          iconColor: "text-neon-pink",
          accentColor: "from-neon-pink/20 to-neon-pink/5",
          details: [
            { label: "Visitas a Links", value: "18,456" },
            { label: "Conversiones", value: "12,638" },
            { label: "Tasa Conversión", value: "68.5%", trend: 5, trendPositive: true },
            { label: "Abandono Carrito", value: "23.2%", trend: -3, trendPositive: true },
            { label: "Tiempo Promedio Compra", value: "4.2 min" },
            { label: "Mejor Canal", value: "WhatsApp" },
          ]
        },
        {
          id: 'milestones',
          title: "Hitos Completados",
          value: "156",
          subtitle: "En progreso: 234 | Premios: $45M",
          trend: { value: 32, isPositive: true },
          icon: Target,
          iconColor: "text-neon-orange",
          accentColor: "from-neon-orange/20 to-neon-orange/5",
          details: [
            { label: "Hitos Completados", value: "156", trend: 32, trendPositive: true },
            { label: "En Progreso", value: "234" },
            { label: "Premios Distribuidos", value: "$45M" },
            { label: "Premios Pendientes", value: "$8.5M" },
            { label: "Tasa Completitud", value: "40%" },
            { label: "Nivel Ups Este Mes", value: "12" },
          ]
        },
        {
          id: 'closures',
          title: "Cierres del Período",
          value: "53",
          subtitle: "Aprobados: 45 | Pendientes: 8",
          icon: CheckCircle2,
          iconColor: "text-success",
          accentColor: "from-success/20 to-success/5",
          details: [
            { label: "Cierres Totales", value: "53" },
            { label: "Aprobados", value: "45" },
            { label: "Pendientes Revisión", value: "5" },
            { label: "En Disputa", value: "3" },
            { label: "Monto Total Cierres", value: "$93.4M" },
            { label: "Tiempo Promedio Aprobación", value: "2.3 días" },
          ]
        },
        {
          id: 'performance',
          title: "Performance Score",
          value: "87.5",
          subtitle: "Excelente | Top 10%",
          trend: { value: 8, isPositive: true },
          icon: Activity,
          iconColor: "text-primary",
          accentColor: "from-primary/20 to-primary/5",
          details: [
            { label: "Score Actual", value: "87.5/100" },
            { label: "Ranking Nacional", value: "#3 de 45" },
            { label: "Velocidad Ventas", value: "4.2/día" },
            { label: "Satisfacción Clientes", value: "4.8/5" },
            { label: "Retención Vendedores", value: "97.8%" },
            { label: "Crecimiento MoM", value: "+23%" },
          ]
        },
      ];
    }

    // Event-specific KPIs
    const eventSales = getEventSales(org, selectedEventId);
    const event = events.find(e => e.id === selectedEventId);
    const totalTickets = eventSales.total;
    const revenue = totalTickets * (event?.ticketPrice || 40000);
    const commission = eventSales.ownCommission + eventSales.teamCommission;
    const progress = event ? (event.soldTickets / event.totalCapacity) * 100 : 0;

    return [
      {
        id: 'event-sales',
        title: "Ventas Evento",
        value: event?.soldTickets.toLocaleString() || '0',
        subtitle: `Capacidad: ${event?.totalCapacity.toLocaleString()} (${progress.toFixed(0)}%)`,
        trend: { value: 15, isPositive: true },
        icon: TicketIcon,
        iconColor: "text-neon-purple",
        accentColor: "from-neon-purple/20 to-neon-purple/5",
        details: [
          { label: "Tickets Vendidos", value: event?.soldTickets.toLocaleString() || '0' },
          { label: "Capacidad Total", value: event?.totalCapacity.toLocaleString() || '0' },
          { label: "% Completado", value: `${progress.toFixed(1)}%` },
          { label: "Tickets Disponibles", value: ((event?.totalCapacity || 0) - (event?.soldTickets || 0)).toLocaleString() },
          { label: "Ventas Hoy", value: "234" },
          { label: "Proyección Final", value: `${Math.min(100, progress + 15).toFixed(0)}%` },
        ]
      },
      {
        id: 'event-sellers',
        title: "Vendedores Evento",
        value: "67",
        subtitle: "Activos: 65 | Sin ventas: 2",
        icon: Users,
        iconColor: "text-neon-blue",
        accentColor: "from-neon-blue/20 to-neon-blue/5",
        details: [
          { label: "Vendedores Asignados", value: "67" },
          { label: "Con Ventas Hoy", value: "54" },
          { label: "Sin Ventas", value: "2" },
          { label: "Promedio Ventas/Vendedor", value: "12.6" },
          { label: "Mejor Vendedor", value: "Carlos R. (85)" },
          { label: "Aceptaron Invitación", value: "67/70" },
        ]
      },
      {
        id: 'event-revenue',
        title: "Recaudo Evento",
        value: `$${(revenue / 1000000).toFixed(1)}M`,
        subtitle: `Precio Ticket: $${((event?.ticketPrice || 40000) / 1000).toFixed(0)}K`,
        trend: { value: 12, isPositive: true },
        icon: Banknote,
        iconColor: "text-neon-green",
        accentColor: "from-neon-green/20 to-neon-green/5",
        details: [
          { label: "Recaudo Total", value: `$${(revenue / 1000000).toFixed(1)}M` },
          { label: "Recaudo Hoy", value: "$9.4M" },
          { label: "Precio Promedio", value: `$${((event?.ticketPrice || 40000) / 1000).toFixed(0)}K` },
          { label: "Tickets VIP", value: "456 ($68.4M)" },
          { label: "Tickets General", value: `${(event?.soldTickets || 0) - 456}` },
          { label: "Proyección Total", value: `$${((event?.totalCapacity || 0) * (event?.ticketPrice || 40000) * 0.85 / 1000000).toFixed(0)}M` },
        ]
      },
      {
        id: 'event-commissions',
        title: "Comisiones Evento",
        value: `$${(commission / 1000000).toFixed(1)}M`,
        subtitle: "Pendiente cierre: $3.2M",
        trend: { value: 8, isPositive: true },
        icon: Wallet,
        iconColor: "text-neon-yellow",
        accentColor: "from-neon-yellow/20 to-neon-yellow/5",
        details: [
          { label: "Comisiones Totales", value: `$${(commission / 1000000).toFixed(1)}M` },
          { label: "Ya Pagadas", value: "$8.5M" },
          { label: "Pendientes Cierre", value: "$3.2M" },
          { label: "Comisión Promedio", value: "$175K/vendedor" },
          { label: "Mayor Comisión", value: "Carlos R. $1.2M" },
          { label: "% del Recaudo", value: "18.5%" },
        ]
      },
      {
        id: 'event-progress',
        title: "Progreso Evento",
        value: `${progress.toFixed(0)}%`,
        subtitle: `Faltan ${((event?.totalCapacity || 0) - (event?.soldTickets || 0)).toLocaleString()} tickets`,
        trend: { value: 5, isPositive: true },
        icon: Target,
        iconColor: "text-neon-pink",
        accentColor: "from-neon-pink/20 to-neon-pink/5",
        details: [
          { label: "% Completado", value: `${progress.toFixed(1)}%` },
          { label: "Ritmo Actual", value: "180 tickets/día" },
          { label: "Días para Evento", value: "18" },
          { label: "Tickets Necesarios/Día", value: Math.ceil(((event?.totalCapacity || 0) - (event?.soldTickets || 0)) / 18).toString() },
          { label: "Proyección Final", value: `${Math.min(100, progress + 25).toFixed(0)}%` },
          { label: "Estado", value: progress >= 80 ? "Excelente" : progress >= 50 ? "En Meta" : "Atención" },
        ]
      },
      {
        id: 'event-milestones',
        title: "Hitos Evento",
        value: "12",
        subtitle: "Activos: 8 | Completados: 4",
        icon: Award,
        iconColor: "text-neon-orange",
        accentColor: "from-neon-orange/20 to-neon-orange/5",
        details: [
          { label: "Hitos Totales", value: "12" },
          { label: "Completados", value: "4" },
          { label: "En Progreso", value: "8" },
          { label: "Premios Distribuidos", value: "$2.5M" },
          { label: "Premios Pendientes", value: "$1.8M" },
          { label: "Vendedores con Hitos", value: "45" },
        ]
      },
      {
        id: 'event-time',
        title: "Tiempo Restante",
        value: "18 días",
        subtitle: `Fecha: ${event?.date}`,
        icon: Clock,
        iconColor: "text-warning",
        accentColor: "from-warning/20 to-warning/5",
        details: [
          { label: "Días Restantes", value: "18" },
          { label: "Fecha Evento", value: event?.date || 'N/A' },
          { label: "Hora Inicio", value: "8:00 PM" },
          { label: "Apertura Puertas", value: "6:00 PM" },
          { label: "Cierre Ventas", value: event?.date || 'N/A' },
          { label: "Última Venta Online", value: "4:00 PM" },
        ]
      },
      {
        id: 'event-alerts',
        title: "Alertas Activas",
        value: "3",
        subtitle: "Urgentes: 1 | Pendientes: 2",
        icon: AlertCircle,
        iconColor: "text-destructive",
        accentColor: "from-destructive/20 to-destructive/5",
        details: [
          { label: "Alertas Totales", value: "3" },
          { label: "Urgentes", value: "1" },
          { label: "Pendientes", value: "2" },
          { label: "Cierres sin Aprobar", value: "5" },
          { label: "Vendedores Inactivos", value: "2" },
          { label: "Hitos por Vencer", value: "3" },
        ]
      },
    ];
  };

  const kpiData = getKPIData();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => (
          <motion.div
            key={kpi.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <Card 
              variant="neon" 
              className="relative overflow-hidden p-5 cursor-pointer hover:border-primary/40 transition-all group"
              onClick={() => setSelectedKPI(kpi)}
            >
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
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
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

      {/* KPI Detail Modal */}
      <Dialog open={!!selectedKPI} onOpenChange={() => setSelectedKPI(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedKPI && <selectedKPI.icon className={cn("w-5 h-5", selectedKPI.iconColor)} />}
              {selectedKPI?.title} - Detalle
            </DialogTitle>
            <DialogDescription>
              Métricas detalladas y desglose
            </DialogDescription>
          </DialogHeader>
          
          {selectedKPI && (
            <div className="space-y-4 mt-4">
              {/* Main Value */}
              <div className="text-center p-4 rounded-lg bg-card-elevated">
                <p className="text-4xl font-bold text-primary">{selectedKPI.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{selectedKPI.subtitle}</p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3">
                {selectedKPI.details.map((detail, idx) => (
                  <div 
                    key={idx}
                    className="p-3 rounded-lg bg-card border border-border"
                  >
                    <p className="text-xs text-muted-foreground mb-1">{detail.label}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-semibold">{detail.value}</p>
                      {detail.trend !== undefined && (
                        <div className={cn(
                          "flex items-center gap-1 text-xs",
                          detail.trendPositive ? "text-success" : "text-destructive"
                        )}>
                          {detail.trendPositive ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          {detail.trend > 0 ? '+' : ''}{detail.trend}%
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setSelectedKPI(null)}>
                  Cerrar
                </Button>
                <Button variant="party" className="flex-1">
                  Ver Reporte Completo
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
