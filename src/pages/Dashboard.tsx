import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KPICard } from "@/components/dashboard/KPICard";
import { LevelProgress } from "@/components/dashboard/LevelProgress";
import { MilestoneCard } from "@/components/dashboard/MilestoneCard";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { RecentSalesTable } from "@/components/dashboard/RecentSalesTable";
import { SalesDetailModal } from "@/components/modals/SalesDetailModal";
import { 
  TicketIcon, 
  TrendingUp, 
  Wallet, 
  Calendar,
  Zap,
  Target
} from "lucide-react";
import { currentUsers, weeklyChartData, weeklyChartDataByEvent, events } from "@/data/mockData";

// Get user data - simulating Promotor Común
const user = currentUsers.promotorComun;

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

  // Get data based on selected event
  const getEventData = () => {
    if (selectedEventId === 'all') {
      return {
        salesWeek: user.ownSales.week,
        salesMonth: user.ownSales.month,
        commissionWeek: user.ownSales.week * user.commissionPerTicket,
        commissionMonth: user.ownSales.month * user.commissionPerTicket,
        chartData: weeklyChartData.map(d => ({
          name: d.week,
          ventas: d.ownSales,
          comision: d.ownCommission
        }))
      };
    }
    
    const eventSales = user.salesByEvent[selectedEventId] || { ownSales: 0, ownCommission: 0 };
    const eventChartData = weeklyChartDataByEvent[selectedEventId] || weeklyChartData;
    
    return {
      salesWeek: Math.floor(eventSales.ownSales * 0.3),
      salesMonth: eventSales.ownSales,
      commissionWeek: Math.floor(eventSales.ownCommission * 0.3),
      commissionMonth: eventSales.ownCommission,
      chartData: eventChartData.map(d => ({
        name: d.week,
        ventas: d.ownSales,
        comision: d.ownCommission
      }))
    };
  };

  const eventData = getEventData();
  const selectedEvent = selectedEventId === 'all' ? null : events.find(e => e.id === selectedEventId);

  return (
    <DashboardLayout 
      title="Dashboard" 
      subtitle={`Bienvenido de vuelta, ${user.name.split(' ')[0]}`}
      selectedEventId={selectedEventId}
      onEventChange={setSelectedEventId}
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
          currentLevel={user.level}
          currentLevelName={user.levelName}
          nextLevelName="Promotor Cabeza"
          currentTickets={user.ownSales.month}
          requiredTickets={120}
          currentCommission={user.commissionPerTicket}
          nextCommission={10000}
        />

        {/* KPI Cards - Weekly Focus */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <KPICard
            title="Ventas Hoy"
            value={user.ownSales.today}
            trend={{ value: 20, isPositive: true }}
            subtitle="vs ayer"
            icon={TicketIcon}
            iconColor="purple"
            delay={0}
          />
          <KPICard
            title="Ventas Semana"
            value={eventData.salesWeek}
            trend={{ value: 15, isPositive: true }}
            subtitle="ciclo actual"
            icon={TrendingUp}
            iconColor="pink"
            delay={0.05}
          />
          <KPICard
            title="Ventas Período"
            value={eventData.salesMonth}
            trend={{ value: 8, isPositive: true }}
            subtitle="últimos 15 días"
            icon={Zap}
            iconColor="blue"
            delay={0.1}
          />
          <KPICard
            title="Comisión Semana"
            value={`$${(eventData.commissionWeek / 1000).toFixed(0)}K`}
            trend={{ value: 25, isPositive: true }}
            subtitle="COP"
            icon={Wallet}
            iconColor="green"
            delay={0.15}
          />
          <KPICard
            title="Comisión Período"
            value={`$${(eventData.commissionMonth / 1000).toFixed(0)}K`}
            trend={{ value: 12, isPositive: true }}
            subtitle="COP"
            icon={Target}
            iconColor="yellow"
            delay={0.2}
          />
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
              title="Ventas por Semana"
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
          totalSales={user.ownSales.month} 
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
    </DashboardLayout>
  );
}
