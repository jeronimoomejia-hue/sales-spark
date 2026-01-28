import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Ticket, 
  TrendingUp, 
  TrendingDown,
  Users, 
  DollarSign, 
  Target,
  Zap,
  Trophy,
  Flame,
  Clock,
  Calendar,
  BarChart3,
  PieChart,
  Eye,
  ChevronRight,
  Sparkles,
  Star,
  Award,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdvancedKPIPanelProps {
  userLevel: 1 | 2 | 3 | 4;
  selectedEventId: string | 'all';
  ownSales: {
    today: number;
    week: number;
    month: number;
    total: number;
  };
  teamSales?: {
    today: number;
    week: number;
    month: number;
    total: number;
  };
  commissionPerTicket: number;
  teamSize?: number;
  onViewMore?: () => void;
}

export function AdvancedKPIPanel({
  userLevel,
  selectedEventId,
  ownSales,
  teamSales,
  commissionPerTicket,
  teamSize = 0,
  onViewMore,
}: AdvancedKPIPanelProps) {
  const hasTeam = userLevel >= 2 && teamSales;
  
  // Calculate metrics
  const totalSales = ownSales.month + (teamSales?.month || 0);
  const totalCommission = ownSales.month * commissionPerTicket;
  const teamCommission = (teamSales?.month || 0) * commissionPerTicket * 0.1;
  const conversionRate = 68; // Mock
  const avgPerDay = Math.round(ownSales.month / 15);
  const goal = userLevel === 1 ? 50 : userLevel === 2 ? 100 : userLevel === 3 ? 200 : 500;
  const goalProgress = Math.min((ownSales.month / goal) * 100, 100);
  
  // Rankings
  const personalRank = userLevel === 1 ? 12 : userLevel === 2 ? 5 : userLevel === 3 ? 2 : 1;
  const teamRank = hasTeam ? (userLevel === 2 ? 3 : userLevel === 3 ? 2 : 1) : null;

  return (
    <div className="space-y-6">
      {/* Hero Stats Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-card via-card-elevated to-card border-2 border-primary/30 p-6"
      >
        {/* Decorative Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-party opacity-10 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-neon-blue/20 blur-3xl" />
        
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-gradient-party shadow-lg shadow-primary/30">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold font-display">Resumen de Rendimiento</h2>
                  <Badge variant="secondary" className="bg-success/20 text-success border-success/30">
                    <Flame className="w-3 h-3 mr-1" />
                    En Racha
                  </Badge>
                </div>
                <p className="text-muted-foreground">
                  {selectedEventId === 'all' ? 'Todos los eventos' : 'Evento seleccionado'} • Últimos 15 días
                </p>
              </div>
            </div>
            <Button variant="outline" className="gap-2" onClick={onViewMore}>
              <Eye className="w-4 h-4" />
              Ver Análisis Completo
            </Button>
          </div>

          {/* Main Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {/* Own Sales Today */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-neon-purple/20 to-neon-purple/5 border border-neon-purple/30">
              <div className="flex items-center gap-2 mb-2">
                <Ticket className="w-4 h-4 text-neon-purple" />
                <span className="text-xs text-muted-foreground">Ventas Hoy</span>
              </div>
              <p className="text-3xl font-bold font-display text-neon-purple">{ownSales.today}</p>
              <div className="flex items-center gap-1 mt-1 text-xs text-success">
                <ArrowUpRight className="w-3 h-3" />
                +25% vs ayer
              </div>
            </div>

            {/* Own Sales Week */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-neon-pink/20 to-neon-pink/5 border border-neon-pink/30">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-neon-pink" />
                <span className="text-xs text-muted-foreground">Esta Semana</span>
              </div>
              <p className="text-3xl font-bold font-display text-neon-pink">{ownSales.week}</p>
              <div className="flex items-center gap-1 mt-1 text-xs text-success">
                <ArrowUpRight className="w-3 h-3" />
                +18% vs anterior
              </div>
            </div>

            {/* Own Sales Month/Period */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-neon-blue/20 to-neon-blue/5 border border-neon-blue/30">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-neon-blue" />
                <span className="text-xs text-muted-foreground">Período (15d)</span>
              </div>
              <p className="text-3xl font-bold font-display text-neon-blue">{ownSales.month}</p>
              <div className="flex items-center gap-1 mt-1 text-xs text-success">
                <ArrowUpRight className="w-3 h-3" />
                +12% vs anterior
              </div>
            </div>

            {/* Commission */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-success/20 to-success/5 border border-success/30">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-success" />
                <span className="text-xs text-muted-foreground">Mi Comisión</span>
              </div>
              <p className="text-3xl font-bold font-display text-success">
                ${(totalCommission / 1000000).toFixed(1)}M
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                ${commissionPerTicket.toLocaleString()}/ticket
              </p>
            </div>

            {/* Goal Progress */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-warning/20 to-warning/5 border border-warning/30">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-warning" />
                <span className="text-xs text-muted-foreground">Meta Período</span>
              </div>
              <p className="text-3xl font-bold font-display text-warning">{Math.round(goalProgress)}%</p>
              <Progress value={goalProgress} className="h-1.5 mt-2 [&>div]:bg-warning" />
              <p className="text-xs text-muted-foreground mt-1">{ownSales.month}/{goal} tickets</p>
            </div>

            {/* Ranking */}
            <div className="p-4 rounded-xl bg-gradient-party border border-primary/30">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-4 h-4 text-white" />
                <span className="text-xs text-white/80">Mi Ranking</span>
              </div>
              <p className="text-3xl font-bold font-display text-white">#{personalRank}</p>
              <p className="text-xs text-white/80 mt-1">
                Top {Math.round((personalRank / 50) * 100)}% vendedores
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Team Stats (Level 2+) */}
      {hasTeam && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-neon-blue/10 via-card to-neon-purple/10 border border-primary/20 p-6"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-neon-blue/10 via-transparent to-transparent" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-neon-blue/20 border border-neon-blue/30">
                  <Users className="w-6 h-6 text-neon-blue" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Rendimiento de Mi Equipo</h3>
                  <p className="text-sm text-muted-foreground">{teamSize} miembros activos</p>
                </div>
              </div>
              {teamRank && (
                <Badge variant="secondary" className="bg-neon-blue/20 text-neon-blue border-neon-blue/30">
                  <Award className="w-3 h-3 mr-1" />
                  Equipo #{teamRank}
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              <div className="p-4 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Ticket className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Ventas Hoy</span>
                </div>
                <p className="text-2xl font-bold">{teamSales?.today || 0}</p>
                <p className="text-xs text-success mt-1">+15 vs ayer</p>
              </div>

              <div className="p-4 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-success" />
                  <span className="text-xs text-muted-foreground">Esta Semana</span>
                </div>
                <p className="text-2xl font-bold">{teamSales?.week || 0}</p>
                <p className="text-xs text-success mt-1">+22% vs anterior</p>
              </div>

              <div className="p-4 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-4 h-4 text-neon-blue" />
                  <span className="text-xs text-muted-foreground">Período (15d)</span>
                </div>
                <p className="text-2xl font-bold">{teamSales?.month || 0}</p>
                <p className="text-xs text-success mt-1">+18% vs anterior</p>
              </div>

              <div className="p-4 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-success" />
                  <span className="text-xs text-muted-foreground">Mi Parte</span>
                </div>
                <p className="text-2xl font-bold">${(teamCommission / 1000).toFixed(0)}K</p>
                <p className="text-xs text-muted-foreground mt-1">10% de equipo</p>
              </div>

              <div className="p-4 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-warning" />
                  <span className="text-xs text-muted-foreground">Promedio/Persona</span>
                </div>
                <p className="text-2xl font-bold">{Math.round((teamSales?.month || 0) / (teamSize || 1))}</p>
                <p className="text-xs text-muted-foreground mt-1">tickets/período</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Additional Metrics Row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {/* Conversion Rate */}
        <Card variant="glass" className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-success/20">
                <PieChart className="w-4 h-4 text-success" />
              </div>
              <span className="text-sm font-medium">Conversión</span>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Eye className="w-3 h-3" />
            </Button>
          </div>
          <p className="text-3xl font-bold">{conversionRate}%</p>
          <Progress value={conversionRate} className="h-1.5 mt-2 [&>div]:bg-success" />
          <p className="text-xs text-muted-foreground mt-2">Links enviados → Compras</p>
        </Card>

        {/* Avg Per Day */}
        <Card variant="glass" className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-neon-orange/20">
                <Zap className="w-4 h-4 text-neon-orange" />
              </div>
              <span className="text-sm font-medium">Promedio/Día</span>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Eye className="w-3 h-3" />
            </Button>
          </div>
          <p className="text-3xl font-bold">{avgPerDay}</p>
          <div className="flex items-center gap-1 mt-2 text-xs text-success">
            <ArrowUpRight className="w-3 h-3" />
            +3 vs promedio general
          </div>
        </Card>

        {/* Days to Close */}
        <Card variant="glass" className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-warning/20">
                <Clock className="w-4 h-4 text-warning" />
              </div>
              <span className="text-sm font-medium">Próximo Cierre</span>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Eye className="w-3 h-3" />
            </Button>
          </div>
          <p className="text-3xl font-bold">5 días</p>
          <p className="text-xs text-muted-foreground mt-2">15 de Febrero, 2026</p>
        </Card>

        {/* Total Historical */}
        <Card variant="glass" className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/20">
                <Star className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm font-medium">Total Histórico</span>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Eye className="w-3 h-3" />
            </Button>
          </div>
          <p className="text-3xl font-bold">{ownSales.total.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-2">
            ${((ownSales.total * commissionPerTicket) / 1000000).toFixed(1)}M ganados
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
