import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KPICard } from "@/components/dashboard/KPICard";
import { LevelProgress } from "@/components/dashboard/LevelProgress";
import { MilestoneCard } from "@/components/dashboard/MilestoneCard";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { RecentSalesTable } from "@/components/dashboard/RecentSalesTable";
import { SalesDetailModal } from "@/components/modals/SalesDetailModal";
import { TeamDetailModal } from "@/components/modals/TeamDetailModal";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TicketIcon, 
  TrendingUp, 
  Wallet, 
  Calendar,
  Zap,
  Target,
  Users,
  Eye,
  Trophy
} from "lucide-react";
import { currentUsers, weeklyChartData, weeklyChartDataByEvent, events, organizationData, TeamMember } from "@/data/mockData";

// Demo user data by level
const demoUserData = {
  1: currentUsers.promotorComun,
  2: currentUsers.promotorCabeza,
  3: currentUsers.subSocio,
  4: organizationData,
};

const mockMilestones = [
  {
    id: "1",
    name: "HITO MARZO - TOP SELLER",
    description: "Vende 150 tickets en Marzo para ganar un bono especial",
    currentProgress: 127,
    target: 150,
    reward: "$100,000 COP bono + 2 boletas VIP",
    icon: "fire" as const,
    daysLeft: 12,
  },
  {
    id: "2",
    name: "INSCRIPCIÓN SORTEO PREMIUM",
    description: "Vende 50 tickets para entrar al sorteo",
    currentProgress: 45,
    target: 50,
    reward: "Entrada sorteo iPhone 15",
    icon: "ticket" as const,
    daysLeft: 5,
  },
  {
    id: "3",
    name: "SUBE DE NIVEL",
    description: "Alcanza los requisitos para ser Promotor Cabeza",
    currentProgress: 45,
    target: 120,
    reward: "Ascenso + comisión $10,000/ticket",
    icon: "rocket" as const,
  },
];

export default function Dashboard() {
  const [selectedEventId, setSelectedEventId] = useState<string | 'all'>('all');
  const [showSalesModal, setShowSalesModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [selectedTeamMember, setSelectedTeamMember] = useState<TeamMember | null>(null);
  
  // Get demo user level from sessionStorage
  const [userLevel, setUserLevel] = useState<1 | 2 | 3 | 4>(1);
  
  useEffect(() => {
    const storedLevel = sessionStorage.getItem("demoUserLevel");
    if (storedLevel) {
      setUserLevel(parseInt(storedLevel) as 1 | 2 | 3 | 4);
    }
  }, []);

  const user = demoUserData[userLevel] as typeof currentUsers.promotorComun;
  const hasTeam = userLevel >= 2;
  const teamMembers = hasTeam && 'children' in user ? (user as TeamMember).children : [];

  // Get data based on selected event
  const getEventData = () => {
    const ownSales = user.ownSales || { week: 0, month: 0, today: 0 };
    const teamSales = 'teamSales' in user ? user.teamSales : { week: 0, month: 0 };
    const commission = user.commissionPerTicket || 7500;

    if (selectedEventId === 'all') {
      return {
        salesWeek: ownSales.week,
        salesMonth: ownSales.month,
        teamSalesWeek: teamSales.week,
        teamSalesMonth: teamSales.month,
        commissionWeek: ownSales.week * commission,
        commissionMonth: ownSales.month * commission,
        chartData: weeklyChartData.map(d => ({
          name: d.week,
          ventas: d.ownSales + (hasTeam ? d.teamSales : 0),
          comision: d.ownCommission + (hasTeam ? d.teamCommission : 0)
        }))
      };
    }
    
    const eventSalesData = user.salesByEvent?.[selectedEventId] || { ownSales: 0, ownCommission: 0 };
    const eventChartData = weeklyChartDataByEvent[selectedEventId] || weeklyChartData;
    
    return {
      salesWeek: Math.floor(eventSalesData.ownSales * 0.3),
      salesMonth: eventSalesData.ownSales,
      teamSalesWeek: Math.floor((teamSales.week || 0) * 0.3),
      teamSalesMonth: teamSales.month || 0,
      commissionWeek: Math.floor(eventSalesData.ownCommission * 0.3),
      commissionMonth: eventSalesData.ownCommission,
      chartData: eventChartData.map(d => ({
        name: d.week,
        ventas: d.ownSales + (hasTeam ? d.teamSales : 0),
        comision: d.ownCommission + (hasTeam ? d.teamCommission : 0)
      }))
    };
  };

  const eventData = getEventData();
  const selectedEvent = selectedEventId === 'all' ? null : events.find(e => e.id === selectedEventId);

  const getLevelInfo = () => {
    switch (userLevel) {
      case 1: return { next: "Promotor Cabeza", nextCommission: 10000, required: 120 };
      case 2: return { next: "Sub Socio", nextCommission: 12000, required: 200 };
      case 3: return { next: "Socio", nextCommission: 15000, required: 500 };
      default: return { next: "Máximo", nextCommission: 15000, required: 1000 };
    }
  };

  const levelInfo = getLevelInfo();

  return (
    <DashboardLayout 
      title="Dashboard" 
      subtitle={`Bienvenido de vuelta, ${user.name.split(' ')[0]}`}
      selectedEventId={selectedEventId}
      onEventChange={setSelectedEventId}
      userLevel={userLevel}
    >
      <div className="space-y-6">
        {/* Event Filter Banner */}
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <TicketIcon className="w-5 h-5 text-primary" />
              <span className="font-medium">Filtrando por: <span className="text-primary">{selectedEvent.name}</span></span>
            </div>
            <span className="text-sm text-muted-foreground">
              {selectedEvent.soldTickets.toLocaleString()} tickets vendidos
            </span>
          </motion.div>
        )}

        {/* Level Progress - Full Width */}
        <LevelProgress
          currentLevel={userLevel}
          currentLevelName={user.levelName}
          nextLevelName={levelInfo.next}
          currentTickets={user.ownSales?.month || 0}
          requiredTickets={levelInfo.required}
          currentCommission={user.commissionPerTicket}
          nextCommission={levelInfo.nextCommission}
        />

        {/* Team Overview for Level 2+ */}
        {hasTeam && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card variant="neon" className="p-6 border-2 border-primary/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Mi Equipo</h3>
                    <p className="text-sm text-muted-foreground">
                      {teamMembers?.length || 0} miembros directos • {eventData.teamSalesMonth} tickets del equipo
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-success/20 text-success">
                  +{eventData.teamSalesWeek} esta semana
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {teamMembers?.slice(0, 4).map((member) => (
                  <div 
                    key={member.id}
                    className="p-3 rounded-lg bg-card-elevated border border-border hover:border-primary/30 transition-all cursor-pointer"
                    onClick={() => {
                      setSelectedTeamMember(member);
                      setShowTeamModal(true);
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-party flex items-center justify-center text-white text-sm font-medium">
                        {member.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.levelName}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Ventas</span>
                      <span className="font-semibold text-primary">{member.ownSales.month}</span>
                    </div>
                  </div>
                ))}
              </div>

              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={() => setShowTeamModal(true)}
              >
                <Eye className="w-4 h-4" />
                Ver Equipo Completo
              </Button>
            </Card>
          </motion.div>
        )}

        {/* KPI Cards - Weekly Focus */}
        <div className={`grid grid-cols-1 md:grid-cols-2 ${hasTeam ? 'lg:grid-cols-4' : 'lg:grid-cols-3 xl:grid-cols-6'} gap-4`}>
          <KPICard
            title="Mis Ventas Hoy"
            value={user.ownSales?.today || 0}
            trend={{ value: 20, isPositive: true }}
            subtitle="vs ayer"
            icon={TicketIcon}
            iconColor="purple"
            delay={0}
          />
          <KPICard
            title="Mis Ventas Semana"
            value={eventData.salesWeek}
            trend={{ value: 15, isPositive: true }}
            subtitle="ciclo actual"
            icon={TrendingUp}
            iconColor="pink"
            delay={0.05}
          />
          {hasTeam && (
            <KPICard
              title="Ventas Equipo"
              value={eventData.teamSalesMonth}
              trend={{ value: 22, isPositive: true }}
              subtitle="acumulado"
              icon={Users}
              iconColor="blue"
              delay={0.1}
            />
          )}
          <KPICard
            title="Ventas Período"
            value={eventData.salesMonth + (hasTeam ? eventData.teamSalesMonth : 0)}
            trend={{ value: 8, isPositive: true }}
            subtitle="últimos 15 días"
            icon={Zap}
            iconColor="blue"
            delay={0.1}
          />
          <KPICard
            title="Mi Comisión"
            value={`$${(eventData.commissionMonth / 1000).toFixed(0)}K`}
            trend={{ value: 25, isPositive: true }}
            subtitle="COP"
            icon={Wallet}
            iconColor="green"
            delay={0.15}
          />
          {hasTeam && (
            <KPICard
              title="Comisión Total"
              value={`$${((eventData.commissionMonth + eventData.teamSalesMonth * user.commissionPerTicket * 0.1) / 1000).toFixed(0)}K`}
              trend={{ value: 18, isPositive: true }}
              subtitle="propia + equipo"
              icon={Trophy}
              iconColor="yellow"
              delay={0.2}
            />
          )}
          <KPICard
            title="Próximo Cierre"
            value="5 días"
            subtitle="15 de Feb"
            icon={Calendar}
            iconColor="orange"
            delay={0.25}
          />
        </div>

        {/* Charts and Milestones Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SalesChart 
              data={eventData.chartData} 
              title={hasTeam ? "Ventas Totales (Propias + Equipo)" : "Ventas por Semana"}
              subtitle="Ciclos de 15 días"
              onSeeMore={() => setShowSalesModal(true)}
            />
          </div>
          <div>
            <MilestoneCard milestones={mockMilestones} />
          </div>
        </div>

        {/* Recent Sales */}
        <RecentSalesTable 
          totalSales={user.ownSales?.month || 0} 
          filterEventId={selectedEventId}
          onSeeMore={() => setShowSalesModal(true)}
        />
      </div>

      {/* Sales Detail Modal */}
      <SalesDetailModal
        open={showSalesModal}
        onOpenChange={setShowSalesModal}
        title="Historial Completo de Ventas"
        filterEventId={selectedEventId}
      />

      {/* Team Detail Modal */}
      {hasTeam && (
        <TeamDetailModal
          open={showTeamModal}
          onOpenChange={setShowTeamModal}
          member={selectedTeamMember || (user as TeamMember)}
          title={selectedTeamMember ? `Detalle de ${selectedTeamMember.name}` : "Detalle del Equipo"}
        />
      )}
    </DashboardLayout>
  );
}
