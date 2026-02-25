import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PromotoraSelector } from "@/components/dashboard/PromotoraSelector";
import { AdvancedKPIPanel } from "@/components/dashboard/AdvancedKPIPanel";
import { EventSegmentedView } from "@/components/dashboard/EventSegmentedView";
import { TeamManagementPanel } from "@/components/dashboard/TeamManagementPanel";
import { KPICard } from "@/components/dashboard/KPICard";
import { LevelProgress } from "@/components/dashboard/LevelProgress";
import { MilestoneCard } from "@/components/dashboard/MilestoneCard";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { RecentSalesTable } from "@/components/dashboard/RecentSalesTable";
import { SalesDetailModal } from "@/components/modals/SalesDetailModal";
import { TeamDetailModal } from "@/components/modals/TeamDetailModal";
import { SalesPerformanceModal } from "@/components/modals/SalesPerformanceModal";
import { MemberEditModal } from "@/components/admin/MemberEditModal";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvitationsPanel } from "@/components/invitations/InvitationsPanel";
import { pendingInvitations } from "@/data/globalSellerPool";
import { 
  TicketIcon, 
  TrendingUp, 
  Wallet, 
  Calendar,
  Zap,
  Target,
  Users,
  Eye,
  Trophy,
  BarChart3,
  Sparkles,
  Building2,
  ChevronRight,
  LayoutDashboard,
  Flame,
  Bell,
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
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [selectedTeamMember, setSelectedTeamMember] = useState<TeamMember | null>(null);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeMainTab, setActiveMainTab] = useState<'dashboard' | 'events' | 'team' | 'invitations'>('dashboard');
  
  // Promotora selection state
  const [selectedPromotora, setSelectedPromotora] = useState<string | null>(null);
  const [showPromotoraSelector, setShowPromotoraSelector] = useState(true);
  
  // Get demo user level from sessionStorage
  const [userLevel, setUserLevel] = useState<1 | 2 | 3 | 4>(1);
  
  useEffect(() => {
    const storedLevel = sessionStorage.getItem("demoUserLevel");
    if (storedLevel) {
      setUserLevel(parseInt(storedLevel) as 1 | 2 | 3 | 4);
    }
    // Check if promotora was selected before
    const storedPromotora = sessionStorage.getItem("selectedPromotora");
    if (storedPromotora) {
      setSelectedPromotora(storedPromotora);
      setShowPromotoraSelector(false);
    }
  }, []);

  const handleSelectPromotora = (promotoraId: string) => {
    setSelectedPromotora(promotoraId);
    sessionStorage.setItem("selectedPromotora", promotoraId);
    setShowPromotoraSelector(false);
  };

  const user = demoUserData[userLevel] as typeof currentUsers.promotorComun;
  const hasTeam = userLevel >= 2;
  const teamMembers = hasTeam && 'children' in user ? (user as TeamMember).children : [];

  // Get data based on selected event
  const getEventData = () => {
    const ownSales = user.ownSales || { week: 0, month: 0, today: 0, total: 0 };
    const teamSales = 'teamSales' in user ? user.teamSales : { week: 0, month: 0, today: 0, total: 0 };
    
    // Use dynamic commission from event's commissionsByLevel based on user level
    const selectedEvt = selectedEventId !== 'all' ? events.find(e => e.id === selectedEventId) : null;
    const commission = selectedEvt 
      ? (selectedEvt.commissionsByLevel[userLevel] || user.commissionPerTicket)
      : user.commissionPerTicket;

    if (selectedEventId === 'all') {
      return {
        salesWeek: ownSales.week,
        salesMonth: ownSales.month,
        salesToday: ownSales.today || 0,
        salesTotal: ownSales.total || ownSales.month * 3,
        teamSalesWeek: teamSales.week,
        teamSalesMonth: teamSales.month,
        teamSalesToday: teamSales.today || 0,
        teamSalesTotal: teamSales.total || teamSales.month * 3,
        commissionWeek: ownSales.week * commission,
        commissionMonth: ownSales.month * commission,
        commission,
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
      salesToday: Math.floor(eventSalesData.ownSales * 0.1),
      salesTotal: eventSalesData.ownSales * 2,
      teamSalesWeek: Math.floor((teamSales.week || 0) * 0.3),
      teamSalesMonth: teamSales.month || 0,
      teamSalesToday: Math.floor((teamSales.month || 0) * 0.1),
      teamSalesTotal: (teamSales.month || 0) * 2,
      commissionWeek: Math.floor(eventSalesData.ownCommission * 0.3),
      commissionMonth: eventSalesData.ownCommission,
      commission,
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

  const handleEditMember = (member: TeamMember) => {
    setEditingMember(member);
    setShowEditModal(true);
  };

  const handleViewMember = (member: TeamMember) => {
    setSelectedTeamMember(member);
    setShowTeamModal(true);
  };

  // Show promotora selector first
  if (showPromotoraSelector) {
    return <PromotoraSelector onSelect={handleSelectPromotora} selectedId={selectedPromotora || undefined} />;
  }

  return (
    <DashboardLayout 
      title="Dashboard" 
      subtitle={`Bienvenido de vuelta, ${user.name.split(' ')[0]}`}
      selectedEventId={selectedEventId}
      onEventChange={setSelectedEventId}
      userLevel={userLevel}
    >
      <div className="space-y-6">
        {/* Promotora Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-primary/10 via-card to-neon-blue/10 border border-primary/20"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-party">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Vendiendo para</p>
              <p className="font-bold">NeonEvents Productions 🎉</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={() => setShowPromotoraSelector(true)}
          >
            Cambiar Promotora
            <ChevronRight className="w-4 h-4" />
          </Button>
        </motion.div>

        {/* Event Filter Banner */}
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-neon-orange/10 border border-neon-orange/30 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Flame className="w-5 h-5 text-neon-orange" />
              <span className="font-medium">Filtrando por: <span className="text-neon-orange">{selectedEvent.name}</span></span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {selectedEvent.soldTickets.toLocaleString()} tickets vendidos
              </span>
              <Button variant="ghost" size="sm" onClick={() => setSelectedEventId('all')}>
                Ver Todos
              </Button>
            </div>
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

        {/* Main Content Tabs */}
        <Tabs value={activeMainTab} onValueChange={(v) => setActiveMainTab(v as any)}>
          <TabsList className="w-full justify-start">
            <TabsTrigger value="dashboard" className="gap-2">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="events" className="gap-2">
              <Calendar className="w-4 h-4" />
              Mis Eventos
            </TabsTrigger>
            {hasTeam && (
              <TabsTrigger value="team" className="gap-2">
                <Users className="w-4 h-4" />
                Mi Equipo
              </TabsTrigger>
            )}
            <TabsTrigger value="invitations" className="gap-2 relative">
              <Bell className="w-4 h-4" />
              Invitaciones
              {pendingInvitations.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-yellow-400 text-[9px] font-bold text-black flex items-center justify-center">
                  {pendingInvitations.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="mt-6 space-y-6">
            {/* Advanced KPI Panel */}
            <AdvancedKPIPanel
              userLevel={userLevel}
              selectedEventId={selectedEventId}
              ownSales={{
                today: eventData.salesToday,
                week: eventData.salesWeek,
                month: eventData.salesMonth,
                total: eventData.salesTotal,
              }}
              teamSales={hasTeam ? {
                today: eventData.teamSalesToday,
                week: eventData.teamSalesWeek,
                month: eventData.teamSalesMonth,
                total: eventData.teamSalesTotal,
              } : undefined}
              commissionPerTicket={eventData.commission || user.commissionPerTicket}
              teamSize={teamMembers?.length || 0}
              onViewMore={() => setShowPerformanceModal(true)}
            />

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
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="mt-6">
            <EventSegmentedView
              userLevel={userLevel}
              onEventSelect={setSelectedEventId}
              selectedEventId={selectedEventId}
              onViewEventDetails={(eventId) => {
                setSelectedEventId(eventId);
                setActiveMainTab('dashboard');
              }}
            />
          </TabsContent>

          {/* Team Tab (Level 2+) */}
          {hasTeam && (
            <TabsContent value="team" className="mt-6">
              <TeamManagementPanel
                userLevel={userLevel as 2 | 3 | 4}
                teamMembers={teamMembers || []}
                onEditMember={handleEditMember}
                onViewMember={handleViewMember}
                onAddMember={() => console.log("Add member")}
                onManageStructure={() => console.log("Manage structure")}
              />
            </TabsContent>
          )}

          {/* Invitations Tab */}
          <TabsContent value="invitations" className="mt-6">
            <InvitationsPanel />
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <SalesDetailModal
        open={showSalesModal}
        onOpenChange={setShowSalesModal}
        title="Historial Completo de Ventas"
        filterEventId={selectedEventId}
      />

      {hasTeam && (
        <TeamDetailModal
          open={showTeamModal}
          onOpenChange={setShowTeamModal}
          member={selectedTeamMember || (user as TeamMember)}
          title={selectedTeamMember ? `Detalle de ${selectedTeamMember.name}` : "Detalle del Equipo"}
        />
      )}

      <SalesPerformanceModal
        open={showPerformanceModal}
        onOpenChange={setShowPerformanceModal}
        member={user as TeamMember}
        selectedEventId={selectedEventId}
      />

      {/* Member Edit Modal */}
      <MemberEditModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        member={editingMember}
        editorLevel={userLevel}
        availableSupervisors={teamMembers || []}
        onSave={(member) => console.log("Save member:", member)}
        onDelete={(id) => console.log("Delete member:", id)}
      />
    </DashboardLayout>
  );
}
