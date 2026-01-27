import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AdminKPICards } from "@/components/admin/AdminKPICards";
import { AdminQuickActions } from "@/components/admin/AdminQuickActions";
import { AdminSalesChart } from "@/components/admin/AdminSalesChart";
import { TopSellersRanking } from "@/components/admin/TopSellersRanking";
import { TeamDistributionChart } from "@/components/admin/TeamDistributionChart";
import { AlertsPanel } from "@/components/admin/AlertsPanel";
import { OrganizationalTree } from "@/components/admin/OrganizationalTree";

export default function AdminDashboard() {
  return (
    <DashboardLayout 
      title="Panel de Administración" 
      subtitle="NeonEvents - Control Total"
      userLevel={4}
    >
      <div className="space-y-6">
        {/* KPI Cards - 4 columnas */}
        <AdminKPICards />

        {/* Quick Actions */}
        <AdminQuickActions />

        {/* Charts Row - 2/3 and 1/3 split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AdminSalesChart />
          </div>
          <div>
            <AlertsPanel />
          </div>
        </div>

        {/* Second Row - Top Sellers and Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopSellersRanking />
          <TeamDistributionChart />
        </div>

        {/* Organizational Tree */}
        <OrganizationalTree />
      </div>
    </DashboardLayout>
  );
}
