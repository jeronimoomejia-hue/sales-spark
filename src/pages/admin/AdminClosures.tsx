import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Wallet, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Eye,
  Download,
  Filter,
  Search,
  TrendingUp
} from "lucide-react";

const closuresData = [
  {
    id: "CL-101",
    user: { name: "Carlos Ruiz", id: "PROMO-12358", avatar: "CR" },
    period: "1-15 Feb 2026",
    tickets: 85,
    totalSales: 3400000,
    commission: 637500,
    status: "pending",
    submittedAt: "Hace 2 horas"
  },
  {
    id: "CL-102",
    user: { name: "Ana María Torres", id: "PROMO-12359", avatar: "AT" },
    period: "1-15 Feb 2026",
    tickets: 72,
    totalSales: 2880000,
    commission: 540000,
    status: "pending",
    submittedAt: "Hace 5 horas"
  },
  {
    id: "CL-103",
    user: { name: "Luis Fernando Gómez", id: "PROMO-12360", avatar: "LG" },
    period: "1-15 Feb 2026",
    tickets: 68,
    totalSales: 2720000,
    commission: 510000,
    status: "pending",
    submittedAt: "Hace 1 día"
  },
  {
    id: "CL-104",
    user: { name: "María José López", id: "PROMO-12361", avatar: "ML" },
    period: "16-31 Ene 2026",
    tickets: 98,
    totalSales: 3920000,
    commission: 735000,
    status: "approved",
    submittedAt: "5 Feb 2026"
  },
  {
    id: "CL-105",
    user: { name: "Pedro Díaz", id: "PROMO-12362", avatar: "PD" },
    period: "16-31 Ene 2026",
    tickets: 112,
    totalSales: 4480000,
    commission: 840000,
    status: "paid",
    paidDate: "8 Feb 2026"
  },
  {
    id: "CL-106",
    user: { name: "Sandra Milena Castro", id: "PROMO-12363", avatar: "SC" },
    period: "16-31 Ene 2026",
    tickets: 45,
    totalSales: 1800000,
    commission: 337500,
    status: "disputed",
    submittedAt: "3 Feb 2026"
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "paid":
      return <Badge variant="success" className="gap-1"><CheckCircle2 className="w-3 h-3" /> Pagado</Badge>;
    case "approved":
      return <Badge variant="default" className="gap-1"><CheckCircle2 className="w-3 h-3" /> Aprobado</Badge>;
    case "pending":
      return <Badge variant="warning" className="gap-1"><Clock className="w-3 h-3" /> Pendiente</Badge>;
    case "disputed":
      return <Badge variant="destructive" className="gap-1"><AlertCircle className="w-3 h-3" /> Disputa</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export default function AdminClosures() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedClosure, setSelectedClosure] = useState<typeof closuresData[0] | null>(null);

  const filteredClosures = closuresData.filter(c => 
    statusFilter === "all" || c.status === statusFilter
  );

  const pendingTotal = closuresData.filter(c => c.status === "pending").reduce((sum, c) => sum + c.commission, 0);

  return (
    <DashboardLayout 
      title="Gestión de Cierres" 
      subtitle="Aprueba y gestiona los cierres de caja"
      userLevel={4}
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card variant="glass" className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/20">
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pendientes</p>
                <p className="text-2xl font-bold font-display">
                  {closuresData.filter(c => c.status === "pending").length}
                </p>
              </div>
            </div>
          </Card>
          <Card variant="glass" className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Wallet className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Por Pagar</p>
                <p className="text-2xl font-bold font-display">${(pendingTotal / 1000000).toFixed(1)}M</p>
              </div>
            </div>
          </Card>
          <Card variant="glass" className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/20">
                <CheckCircle2 className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Aprobados</p>
                <p className="text-2xl font-bold font-display">
                  {closuresData.filter(c => c.status === "approved").length}
                </p>
              </div>
            </div>
          </Card>
          <Card variant="glass" className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/20">
                <AlertCircle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">En Disputa</p>
                <p className="text-2xl font-bold font-display">
                  {closuresData.filter(c => c.status === "disputed").length}
                </p>
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
                <Input placeholder="Buscar por usuario..." className="pl-10" />
              </div>
            </div>
            <select 
              className="p-2.5 rounded-lg bg-card border border-border text-foreground min-w-[150px]"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendientes</option>
              <option value="approved">Aprobados</option>
              <option value="paid">Pagados</option>
              <option value="disputed">En Disputa</option>
            </select>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Exportar
            </Button>
          </div>
        </Card>

        {/* Closures List */}
        <div className="space-y-3">
          {filteredClosures.map((closure, index) => (
            <motion.div
              key={closure.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card variant="glass" className="p-4 hover:border-primary/30 transition-all">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-party flex items-center justify-center text-white font-bold">
                      {closure.user.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{closure.user.name}</h3>
                        <span className="text-xs font-mono text-muted-foreground">{closure.user.id}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Período: {closure.period} • {closure.tickets} tickets
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total Ventas</p>
                      <p className="font-bold">${(closure.totalSales / 1000000).toFixed(2)}M</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Comisión</p>
                      <p className="font-bold text-success">${closure.commission.toLocaleString()}</p>
                    </div>
                    <div className="text-right min-w-[100px]">
                      {getStatusBadge(closure.status)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setSelectedClosure(closure)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {closure.status === "pending" && (
                        <>
                          <Button variant="success" size="sm">Aprobar</Button>
                          <Button variant="outline" size="sm">Rechazar</Button>
                        </>
                      )}
                      {closure.status === "approved" && (
                        <Button variant="party" size="sm">Marcar Pagado</Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Detail Modal */}
        {selectedClosure && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-2xl"
            >
              <Card variant="glass" className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Detalle de Cierre</h2>
                  {getStatusBadge(selectedClosure.status)}
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="p-4 rounded-lg bg-card-elevated">
                    <p className="text-sm text-muted-foreground mb-2">Usuario</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-party flex items-center justify-center text-white font-bold">
                        {selectedClosure.user.avatar}
                      </div>
                      <div>
                        <p className="font-semibold">{selectedClosure.user.name}</p>
                        <p className="text-sm text-muted-foreground">{selectedClosure.user.id}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-card-elevated">
                    <p className="text-sm text-muted-foreground mb-2">Período</p>
                    <p className="font-semibold text-lg">{selectedClosure.period}</p>
                    <p className="text-sm text-muted-foreground">Enviado: {selectedClosure.submittedAt}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="p-4 rounded-lg bg-card-elevated text-center">
                    <p className="text-sm text-muted-foreground mb-1">Tickets</p>
                    <p className="text-2xl font-bold">{selectedClosure.tickets}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-card-elevated text-center">
                    <p className="text-sm text-muted-foreground mb-1">Total Ventas</p>
                    <p className="text-2xl font-bold">${(selectedClosure.totalSales / 1000000).toFixed(2)}M</p>
                  </div>
                  <div className="p-4 rounded-lg bg-card-elevated text-center">
                    <p className="text-sm text-muted-foreground mb-1">Comisión</p>
                    <p className="text-2xl font-bold text-success">${(selectedClosure.commission / 1000).toFixed(0)}k</p>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Notas (opcional)
                  </label>
                  <textarea 
                    className="w-full p-3 rounded-lg bg-card border border-border text-foreground resize-none" 
                    rows={3}
                    placeholder="Agregar comentarios sobre este cierre..."
                  />
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setSelectedClosure(null)}>
                    Cerrar
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Download className="w-4 h-4" />
                    Descargar PDF
                  </Button>
                  {selectedClosure.status === "pending" && (
                    <>
                      <Button variant="destructive">Rechazar</Button>
                      <Button variant="success" onClick={() => setSelectedClosure(null)}>Aprobar</Button>
                    </>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
