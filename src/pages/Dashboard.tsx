import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KPICard } from "@/components/dashboard/KPICard";
import { LevelProgress } from "@/components/dashboard/LevelProgress";
import { MilestoneCard } from "@/components/dashboard/MilestoneCard";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { RecentSalesTable } from "@/components/dashboard/RecentSalesTable";
import { 
  TicketIcon, 
  TrendingUp, 
  Wallet, 
  Calendar,
  Zap,
  Target
} from "lucide-react";

// Mock data
const mockChartData = [
  { name: "1 Ene", ventas: 4, comision: 30000 },
  { name: "5 Ene", ventas: 6, comision: 45000 },
  { name: "10 Ene", ventas: 8, comision: 60000 },
  { name: "15 Ene", ventas: 5, comision: 37500 },
  { name: "20 Ene", ventas: 12, comision: 90000 },
  { name: "25 Ene", ventas: 9, comision: 67500 },
  { name: "27 Ene", ventas: 8, comision: 60000 },
];

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

const mockSales = [
  { id: "1", date: "27 Ene 18:45", event: "Neon Festival", ticketType: "general" as const, price: 40000, commission: 7500 },
  { id: "2", date: "27 Ene 16:20", event: "Neon Festival", ticketType: "vip" as const, price: 80000, commission: 7500 },
  { id: "3", date: "27 Ene 14:15", event: "Neon Festival", ticketType: "general" as const, price: 40000, commission: 7500 },
  { id: "4", date: "26 Ene 22:30", event: "Neon Festival", ticketType: "general" as const, price: 40000, commission: 7500 },
  { id: "5", date: "26 Ene 19:45", event: "Neon Festival", ticketType: "palco" as const, price: 120000, commission: 7500 },
];

export default function Dashboard() {
  return (
    <DashboardLayout title="Dashboard" subtitle="Bienvenido de vuelta, Juan">
      <div className="space-y-6">
        {/* Level Progress - Full Width */}
        <LevelProgress
          currentLevel={1}
          currentLevelName="Promotor Común"
          nextLevelName="Promotor Cabeza"
          currentTickets={45}
          requiredTickets={120}
          currentCommission={7500}
          nextCommission={10000}
        />

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <KPICard
            title="Ventas Hoy"
            value={8}
            trend={{ value: 20, isPositive: true }}
            subtitle="vs ayer"
            icon={TicketIcon}
            iconColor="purple"
            delay={0}
          />
          <KPICard
            title="Ventas Semana"
            value={45}
            trend={{ value: 15, isPositive: true }}
            subtitle="vs semana ant."
            icon={TrendingUp}
            iconColor="pink"
            delay={0.05}
          />
          <KPICard
            title="Ventas Mes"
            value={127}
            trend={{ value: 8, isPositive: true }}
            subtitle="vs mes ant."
            icon={Zap}
            iconColor="blue"
            delay={0.1}
          />
          <KPICard
            title="Comisión Hoy"
            value="$60K"
            trend={{ value: 25, isPositive: true }}
            subtitle="COP"
            icon={Wallet}
            iconColor="green"
            delay={0.15}
          />
          <KPICard
            title="Comisión Mes"
            value="$952K"
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
            <SalesChart data={mockChartData} />
          </div>
          <div>
            <MilestoneCard milestones={mockMilestones} />
          </div>
        </div>

        {/* Recent Sales */}
        <RecentSalesTable sales={mockSales} totalSales={127} />
      </div>
    </DashboardLayout>
  );
}
