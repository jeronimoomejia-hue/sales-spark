import { useState } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  TrendingUp, 
  TrendingDown,
  TicketIcon,
  Trophy,
  Eye,
  DollarSign,
  Target,
  Calendar,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Award,
  BarChart3,
  PieChart,
  Headphones
} from "lucide-react";
import { TeamMember, getTotalSales, getEventSales, events } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface SalesPerformanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member?: TeamMember;
  selectedEventId: string | 'all';
  showEventSpecificSales?: boolean; // When true, shows only this event's sales in detail
}

const levelColors: Record<number, string> = {
  1: "bg-neon-blue/20 text-neon-blue border-neon-blue/30",
  2: "bg-neon-orange/20 text-neon-orange border-neon-orange/30",
  3: "bg-neon-pink/20 text-neon-pink border-neon-pink/30",
  4: "bg-gradient-party text-white",
};

export function SalesPerformanceModal({ 
  open, 
  onOpenChange, 
  member,
  selectedEventId,
  showEventSpecificSales = false
}: SalesPerformanceModalProps) {
  const [activeTab, setActiveTab] = useState("resumen");
  
  if (!member) return null;

  // Get event-specific sales when viewing from event sales page
  const eventSalesData = selectedEventId !== 'all' ? getEventSales(member, selectedEventId) : null;
  
  const getDisplaySales = () => {
    if (selectedEventId === 'all') {
      return {
        own: member.ownSales.total,
        team: member.teamSales.total,
        total: getTotalSales(member, 'total'),
        commission: (member.ownSales.total * member.commissionPerTicket) + 
                   (member.teamSales.total * (member.commissionPerTicket * 0.1)),
        monthOwn: member.ownSales.month,
        monthTeam: member.teamSales.month
      };
    }
    const eventSales = getEventSales(member, selectedEventId);
    return {
      own: eventSales.own,
      team: eventSales.team,
      total: eventSales.total,
      commission: eventSales.ownCommission + eventSales.teamCommission,
      monthOwn: eventSales.own,
      monthTeam: eventSales.team
    };
  };

  const sales = getDisplaySales();
  const currentEvent = selectedEventId !== 'all' ? events.find(e => e.id === selectedEventId) : null;
  const eventName = selectedEventId === 'all' ? 'Todos los eventos (Histórico)' : currentEvent?.name;
  
  // Calculate performance metrics
  const dailyAverage = Math.round(sales.own / 30);
  const weeklyGrowth = 12.5; // Mock
  const targetProgress = Math.min((sales.own / 100) * 100, 100);
  const ranking = member.level === 1 ? 3 : member.level === 2 ? 1 : 2; // Mock

  // Mock recent sales - filtered by event if specific event selected
  const recentSales = selectedEventId !== 'all' ? [
    { id: 1, date: "Hoy 14:32", type: "VIP", quantity: 2, amount: 180000, event: currentEvent?.name },
    { id: 2, date: "Hoy 11:15", type: "General", quantity: 3, amount: 120000, event: currentEvent?.name },
    { id: 3, date: "Ayer 18:45", type: "General", quantity: 5, amount: 200000, event: currentEvent?.name },
    { id: 4, date: "Ayer 10:20", type: "VIP", quantity: 1, amount: 90000, event: currentEvent?.name },
  ] : [
    { id: 1, date: "Hoy 14:32", type: "VIP", quantity: 2, amount: 180000, event: "Festival Electrónico" },
    { id: 2, date: "Hoy 11:15", type: "General", quantity: 3, amount: 120000, event: "Concierto Rock" },
    { id: 3, date: "Ayer 18:45", type: "General", quantity: 5, amount: 200000, event: "Festival Electrónico" },
    { id: 4, date: "Ayer 10:20", type: "VIP", quantity: 1, amount: 90000, event: "Fiesta Reggaeton" },
    { id: 5, date: "26 Ene 16:30", type: "General", quantity: 4, amount: 160000, event: "Concierto Rock" },
  ];

  // Mock daily performance
  const dailyPerformance = [
    { day: "Lun", sales: 8 },
    { day: "Mar", sales: 12 },
    { day: "Mié", sales: 6 },
    { day: "Jue", sales: 15 },
    { day: "Vie", sales: 10 },
    { day: "Sáb", sales: 18 },
    { day: "Dom", sales: 5 },
  ];
  const maxDailySales = Math.max(...dailyPerformance.map(d => d.sales));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Desempeño de Ventas
          </DialogTitle>
        </DialogHeader>

        {/* Member Header */}
        <div className="flex items-center gap-4 p-4 rounded-lg bg-card-elevated">
          <div className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold",
            levelColors[member.level]
          )}>
            {member.avatar}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold">{member.name}</h3>
              <Badge variant="outline" className={cn("border", levelColors[member.level])}>
                {member.levelName}
              </Badge>
              {ranking <= 3 && (
                <Badge className="bg-warning/20 text-warning border-warning/30">
                  <Trophy className="w-3 h-3 mr-1" />
                  Top {ranking}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Filtrando: <span className="text-primary font-medium">{eventName}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold font-display text-gradient-party">
              {sales.total.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">tickets totales</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="resumen">Resumen</TabsTrigger>
            <TabsTrigger value="detalle">Detalle</TabsTrigger>
            <TabsTrigger value="historial">Historial</TabsTrigger>
            <TabsTrigger value="equipo">Equipo</TabsTrigger>
          </TabsList>

          <div className="mt-4 max-h-[400px] overflow-y-auto">
            {/* Resumen Tab */}
            <TabsContent value="resumen" className="space-y-4 mt-0">
              {/* KPI Cards */}
              <div className="grid grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <TicketIcon className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Ventas Propias</span>
                  </div>
                  <p className="text-2xl font-bold">{sales.own}</p>
                  <p className="text-xs text-success flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3" />
                    +{weeklyGrowth}% vs semana ant.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-success" />
                    <span className="text-xs text-muted-foreground">Ventas Equipo</span>
                  </div>
                  <p className="text-2xl font-bold">{sales.team}</p>
                  <p className="text-xs text-muted-foreground">
                    {member.teamSize || 0} personas
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-warning" />
                    <span className="text-xs text-muted-foreground">Comisión</span>
                  </div>
                  <p className="text-2xl font-bold">${(sales.commission / 1000000).toFixed(1)}M</p>
                  <p className="text-xs text-muted-foreground">
                    ${member.commissionPerTicket.toLocaleString()}/ticket
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-neon-purple/10 border border-neon-purple/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-neon-purple" />
                    <span className="text-xs text-muted-foreground">Meta</span>
                  </div>
                  <p className="text-2xl font-bold">{Math.round(targetProgress)}%</p>
                  <Progress value={targetProgress} className="h-1 mt-1" />
                </div>
              </div>

              {/* Daily Performance Chart */}
              <div className="p-4 rounded-lg bg-card-elevated">
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Rendimiento Diario (Última Semana)
                </h4>
                <div className="flex items-end gap-2 h-24">
                  {dailyPerformance.map((day, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-1">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${(day.sales / maxDailySales) * 80}px` }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={cn(
                          "w-full rounded-t-sm",
                          day.day === "Sáb" ? "bg-primary" : "bg-primary/40"
                        )}
                      />
                      <span className="text-xs text-muted-foreground">{day.day}</span>
                      <span className="text-xs font-medium">{day.sales}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Event Breakdown */}
              {selectedEventId === 'all' && (
                <div className="p-4 rounded-lg bg-card-elevated">
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <PieChart className="w-4 h-4" />
                    Desglose por Evento
                  </h4>
                  <div className="space-y-2">
                    {events.map(event => {
                      const eventSales = getEventSales(member, event.id);
                      const percentage = sales.total > 0 ? (eventSales.total / sales.total) * 100 : 0;
                      return (
                        <div key={event.id} className="flex items-center gap-3">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium">{event.name}</span>
                              <span className="text-sm">{eventSales.total} tickets</span>
                            </div>
                            <Progress value={percentage} className="h-2" />
                          </div>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Detalle Tab */}
            <TabsContent value="detalle" className="space-y-4 mt-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-card-elevated">
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">Ventas Propias</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Hoy</p>
                      <p className="text-xl font-bold">{member.ownSales.today}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Esta Semana</p>
                      <p className="text-xl font-bold">{member.ownSales.week}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Este Mes</p>
                      <p className="text-xl font-bold text-primary">{member.ownSales.month}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Histórico</p>
                      <p className="text-xl font-bold">{member.ownSales.total}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-card-elevated">
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">Ventas del Equipo</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Hoy</p>
                      <p className="text-xl font-bold">{member.teamSales.today}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Esta Semana</p>
                      <p className="text-xl font-bold">{member.teamSales.week}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Este Mes</p>
                      <p className="text-xl font-bold text-success">{member.teamSales.month}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Histórico</p>
                      <p className="text-xl font-bold">{member.teamSales.total}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ticket Type Breakdown */}
              <div className="p-4 rounded-lg bg-card-elevated">
                <h4 className="text-sm font-medium mb-3">Desglose por Tipo de Ticket</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 rounded-lg bg-background">
                    <p className="text-2xl font-bold">{Math.round(sales.own * 0.65)}</p>
                    <p className="text-xs text-muted-foreground">General</p>
                    <Badge variant="secondary" className="mt-1">65%</Badge>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-background">
                    <p className="text-2xl font-bold">{Math.round(sales.own * 0.25)}</p>
                    <p className="text-xs text-muted-foreground">VIP</p>
                    <Badge variant="secondary" className="mt-1">25%</Badge>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-background">
                    <p className="text-2xl font-bold">{Math.round(sales.own * 0.10)}</p>
                    <p className="text-xs text-muted-foreground">Palco</p>
                    <Badge variant="secondary" className="mt-1">10%</Badge>
                  </div>
                </div>
              </div>

              {/* Commission Details */}
              <div className="p-4 rounded-lg bg-gradient-to-r from-warning/10 to-warning/5 border border-warning/20">
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-warning" />
                  Desglose de Comisiones
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Por Ventas Propias</p>
                    <p className="text-xl font-bold text-warning">
                      ${((sales.own * member.commissionPerTicket) / 1000000).toFixed(2)}M
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Por Equipo (10%)</p>
                    <p className="text-xl font-bold text-warning">
                      ${((sales.team * member.commissionPerTicket * 0.1) / 1000000).toFixed(2)}M
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total Comisión</p>
                    <p className="text-xl font-bold text-gradient-party">
                      ${(sales.commission / 1000000).toFixed(2)}M
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Historial Tab */}
            <TabsContent value="historial" className="space-y-4 mt-0">
              {/* Event Context Banner when viewing specific event */}
              {selectedEventId !== 'all' && currentEvent && (
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-sm">
                    Mostrando ventas de <span className="font-bold text-primary">{currentEvent.name}</span>
                  </span>
                </div>
              )}
              
              <div className="p-4 rounded-lg bg-card-elevated">
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Últimas Ventas {selectedEventId !== 'all' && `- ${currentEvent?.name}`}
                </h4>
                <div className="space-y-2">
                  {recentSales.map((sale, index) => (
                    <motion.div
                      key={sale.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-background hover:bg-muted/50 transition-colors"
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        sale.type === 'VIP' ? "bg-warning/20" : "bg-primary/20"
                      )}>
                        <TicketIcon className={cn(
                          "w-4 h-4",
                          sale.type === 'VIP' ? "text-warning" : "text-primary"
                        )} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {sale.quantity} tickets {sale.type}
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-muted-foreground">{sale.date}</p>
                          {selectedEventId === 'all' && sale.event && (
                            <Badge variant="outline" className="text-xs">
                              {sale.event}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${sale.amount.toLocaleString()}</p>
                        <Badge variant="outline" className="text-xs">Confirmado</Badge>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-3 gap-2">
                  Ver historial completo
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </TabsContent>

            {/* Equipo Tab */}
            <TabsContent value="equipo" className="space-y-4 mt-0">
              {member.children && member.children.length > 0 ? (
                <div className="space-y-2">
                  {member.children.map((child, index) => {
                    const childSales = selectedEventId === 'all' 
                      ? getTotalSales(child, 'month')
                      : getEventSales(child, selectedEventId).total;
                    return (
                      <motion.div
                        key={child.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className="flex items-center gap-3 p-3 rounded-lg bg-card-elevated hover:border-primary/30 border border-transparent transition-all"
                      >
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold",
                          levelColors[child.level]
                        )}>
                          {child.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm truncate">{child.name}</p>
                            <Badge variant="outline" className={cn("text-xs border", levelColors[child.level])}>
                              {child.levelName}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Progress value={(childSales / 100) * 100} className="h-1 flex-1" />
                            <span className="text-xs text-muted-foreground w-12 text-right">
                              {childSales} tk
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold">{childSales}</p>
                          <p className="text-xs text-success flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            +8%
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">Este usuario no tiene equipo asignado</p>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>

        {/* Actions */}
        <div className="flex justify-between gap-3 pt-4 border-t border-border">
          <Button variant="outline" className="gap-2">
            <Headphones className="w-4 h-4" />
            Soporte
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Award className="w-4 h-4" />
              Ver Hitos
            </Button>
            <Button variant="party" className="gap-2">
              <Eye className="w-4 h-4" />
              Ver Perfil Completo
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
