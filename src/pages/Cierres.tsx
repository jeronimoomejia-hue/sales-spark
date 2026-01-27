import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Wallet, 
  Download, 
  Calendar, 
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  TrendingUp
} from "lucide-react";

const currentPeriod = {
  start: "1 Feb 2026",
  end: "15 Feb 2026",
  tickets: 127,
  totalSales: 5080000,
  commission: 952500,
  daysLeft: 3,
  status: "in_progress"
};

const closureHistory = [
  {
    id: "CL-001",
    period: "16 Ene - 31 Ene 2026",
    tickets: 98,
    totalSales: 3920000,
    commission: 735000,
    status: "paid",
    paidDate: "5 Feb 2026"
  },
  {
    id: "CL-002",
    period: "1 Ene - 15 Ene 2026",
    tickets: 112,
    totalSales: 4480000,
    commission: 840000,
    status: "paid",
    paidDate: "20 Ene 2026"
  },
  {
    id: "CL-003",
    period: "16 Dic - 31 Dic 2025",
    tickets: 156,
    totalSales: 6240000,
    commission: 1170000,
    status: "paid",
    paidDate: "5 Ene 2026"
  },
  {
    id: "CL-004",
    period: "1 Dic - 15 Dic 2025",
    tickets: 89,
    totalSales: 3560000,
    commission: 667500,
    status: "paid",
    paidDate: "20 Dic 2025"
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

export default function Cierres() {
  const totalPaid = closureHistory.reduce((sum, c) => sum + c.commission, 0);

  return (
    <DashboardLayout 
      title="Cierres de Caja" 
      subtitle="Gestión de comisiones y pagos"
      userLevel={1}
    >
      <div className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card variant="glass" className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Wallet className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pendiente Actual</p>
                <p className="text-2xl font-bold font-display">${(currentPeriod.commission / 1000).toFixed(0)}k</p>
              </div>
            </div>
          </Card>
          <Card variant="glass" className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/20">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Pagado</p>
                <p className="text-2xl font-bold font-display">${(totalPaid / 1000000).toFixed(1)}M</p>
              </div>
            </div>
          </Card>
          <Card variant="glass" className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/20">
                <Calendar className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Próximo Cierre</p>
                <p className="text-2xl font-bold font-display">{currentPeriod.daysLeft} días</p>
              </div>
            </div>
          </Card>
          <Card variant="glass" className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/20">
                <FileText className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cierres Totales</p>
                <p className="text-2xl font-bold font-display">{closureHistory.length + 1}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Current Period */}
        <Card variant="glass" className="p-6 border-primary/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-party">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Período Actual</h2>
                <p className="text-muted-foreground">{currentPeriod.start} - {currentPeriod.end}</p>
              </div>
            </div>
            <Badge variant="warning" className="gap-1 px-3 py-1">
              <Clock className="w-4 h-4" />
              Cierra en {currentPeriod.daysLeft} días
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-4 rounded-lg bg-card-elevated">
              <p className="text-sm text-muted-foreground mb-1">Tickets Vendidos</p>
              <p className="text-3xl font-bold font-display text-gradient-party">{currentPeriod.tickets}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-card-elevated">
              <p className="text-sm text-muted-foreground mb-1">Total Ventas</p>
              <p className="text-3xl font-bold font-display">${(currentPeriod.totalSales / 1000000).toFixed(2)}M</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-card-elevated">
              <p className="text-sm text-muted-foreground mb-1">Tu Comisión</p>
              <p className="text-3xl font-bold font-display text-success">${(currentPeriod.commission / 1000).toFixed(0)}k</p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-warning/10 border border-warning/20 mb-4">
            <div className="flex items-center gap-2 text-warning">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm font-medium">
                Recuerda enviar tu cierre antes del 15 de Febrero a las 23:59
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="party" className="gap-2">
              <Download className="w-4 h-4" />
              Descargar Reporte PDF
            </Button>
            <Button variant="outline" className="gap-2">
              <FileText className="w-4 h-4" />
              Ver Detalle
            </Button>
          </div>
        </Card>

        {/* Closure History */}
        <div>
          <h2 className="text-xl font-bold mb-4">Historial de Cierres</h2>
          <div className="space-y-3">
            {closureHistory.map((closure, index) => (
              <motion.div
                key={closure.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card variant="default" className="p-4 hover:border-primary/30 transition-all">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-success/20">
                        <CheckCircle2 className="w-5 h-5 text-success" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{closure.period}</h3>
                        <p className="text-sm text-muted-foreground">
                          {closure.tickets} tickets • ${(closure.totalSales / 1000000).toFixed(2)}M en ventas
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Comisión</p>
                        <p className="font-bold text-success">${closure.commission.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Pagado</p>
                        <p className="text-sm">{closure.paidDate}</p>
                      </div>
                      {getStatusBadge(closure.status)}
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Download className="w-4 h-4" />
                        PDF
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
