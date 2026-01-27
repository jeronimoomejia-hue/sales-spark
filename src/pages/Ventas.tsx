import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  Download, 
  Calendar,
  TicketIcon,
  TrendingUp
} from "lucide-react";

const salesData = [
  { id: "TKT-001", event: "Neon Festival 2026", type: "VIP", price: 80000, commission: 7500, date: "2026-01-27 18:45", status: "confirmed" },
  { id: "TKT-002", event: "Neon Festival 2026", type: "General", price: 40000, commission: 7500, date: "2026-01-27 16:20", status: "confirmed" },
  { id: "TKT-003", event: "Neon Festival 2026", type: "General", price: 40000, commission: 7500, date: "2026-01-27 14:15", status: "confirmed" },
  { id: "TKT-004", event: "Rock Night", type: "Palco", price: 120000, commission: 7500, date: "2026-01-26 22:30", status: "confirmed" },
  { id: "TKT-005", event: "Rock Night", type: "VIP", price: 80000, commission: 7500, date: "2026-01-26 19:45", status: "confirmed" },
  { id: "TKT-006", event: "Neon Festival 2026", type: "General", price: 40000, commission: 7500, date: "2026-01-26 17:00", status: "pending" },
  { id: "TKT-007", event: "Neon Festival 2026", type: "General", price: 40000, commission: 7500, date: "2026-01-25 21:30", status: "confirmed" },
  { id: "TKT-008", event: "Rock Night", type: "General", price: 40000, commission: 7500, date: "2026-01-25 18:15", status: "confirmed" },
  { id: "TKT-009", event: "Neon Festival 2026", type: "VIP", price: 80000, commission: 7500, date: "2026-01-25 15:00", status: "confirmed" },
  { id: "TKT-010", event: "Electro Waves", type: "General", price: 45000, commission: 7500, date: "2026-01-24 20:45", status: "confirmed" },
];

const getTypeBadgeColor = (type: string) => {
  switch (type) {
    case "VIP": return "warning";
    case "Palco": return "default";
    default: return "secondary";
  }
};

const getStatusBadge = (status: string) => {
  return status === "confirmed" ? (
    <Badge variant="success">Confirmada</Badge>
  ) : (
    <Badge variant="warning">Pendiente</Badge>
  );
};

export default function Ventas() {
  return (
    <DashboardLayout 
      title="Mis Ventas" 
      subtitle="Historial completo de tus ventas"
      userLevel={1}
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card variant="glass" className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <TicketIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Ventas</p>
                <p className="text-2xl font-bold font-display">127</p>
              </div>
            </div>
          </Card>
          <Card variant="glass" className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/20">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Este Mes</p>
                <p className="text-2xl font-bold font-display">45</p>
              </div>
            </div>
          </Card>
          <Card variant="glass" className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/20">
                <Calendar className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Esta Semana</p>
                <p className="text-2xl font-bold font-display">12</p>
              </div>
            </div>
          </Card>
          <Card variant="glass" className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/20">
                <TicketIcon className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Hoy</p>
                <p className="text-2xl font-bold font-display">3</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card variant="glass" className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Buscar por evento, ID..." className="pl-10" />
              </div>
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filtros
            </Button>
            <Button variant="outline" className="gap-2">
              <Calendar className="w-4 h-4" />
              Período
            </Button>
            <Button variant="party" className="gap-2">
              <Download className="w-4 h-4" />
              Exportar
            </Button>
          </div>
        </Card>

        {/* Sales Table */}
        <Card variant="glass" className="overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold">Historial de Ventas</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-card-elevated">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">ID</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Evento</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Tipo</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Precio</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Comisión</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Fecha</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Estado</th>
                </tr>
              </thead>
              <tbody>
                {salesData.map((sale, index) => (
                  <motion.tr
                    key={sale.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="border-b border-border/50 hover:bg-card-elevated/50 transition-colors"
                  >
                    <td className="p-4 font-mono text-sm text-primary">{sale.id}</td>
                    <td className="p-4 font-medium">{sale.event}</td>
                    <td className="p-4">
                      <Badge variant={getTypeBadgeColor(sale.type)}>{sale.type}</Badge>
                    </td>
                    <td className="p-4 font-medium">${sale.price.toLocaleString()}</td>
                    <td className="p-4 text-success font-medium">${sale.commission.toLocaleString()}</td>
                    <td className="p-4 text-muted-foreground text-sm">{sale.date}</td>
                    <td className="p-4">{getStatusBadge(sale.status)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-border flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Mostrando 10 de 127 ventas</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Anterior</Button>
              <Button variant="outline" size="sm">1</Button>
              <Button variant="party" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <Button variant="outline" size="sm">Siguiente</Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
