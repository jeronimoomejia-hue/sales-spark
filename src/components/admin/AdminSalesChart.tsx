import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  BarChart,
  Bar
} from "recharts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Download, TrendingUp, Calendar, Filter, Eye } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const chartData = [
  { month: "Ago", tickets: 8540, recaudo: 341600000, comisiones: 64050000, meta: 400000000 },
  { month: "Sep", tickets: 9280, recaudo: 371200000, comisiones: 69600000, meta: 420000000 },
  { month: "Oct", tickets: 10150, recaudo: 406000000, comisiones: 76125000, meta: 450000000 },
  { month: "Nov", tickets: 9870, recaudo: 394800000, comisiones: 74025000, meta: 480000000 },
  { month: "Dic", tickets: 11430, recaudo: 457200000, comisiones: 85725000, meta: 500000000 },
  { month: "Ene", tickets: 12458, recaudo: 498320000, comisiones: 93435000, meta: 520000000 },
];

const dailyData = [
  { day: "Lun", tickets: 1820, recaudo: 72800000 },
  { day: "Mar", tickets: 1650, recaudo: 66000000 },
  { day: "Mié", tickets: 1980, recaudo: 79200000 },
  { day: "Jue", tickets: 1720, recaudo: 68800000 },
  { day: "Vie", tickets: 2340, recaudo: 93600000 },
  { day: "Sáb", tickets: 2890, recaudo: 115600000 },
  { day: "Dom", tickets: 1058, recaudo: 42320000 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card-elevated border border-border rounded-lg p-3 shadow-lg">
        <p className="font-medium text-foreground mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.name === "Tickets" 
              ? entry.value.toLocaleString() 
              : `$${(entry.value / 1000000).toFixed(1)}M`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function AdminSalesChart() {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [timeRange, setTimeRange] = useState("6m");
  const [showExportModal, setShowExportModal] = useState(false);

  // Calculate summary stats
  const totalTickets = chartData.reduce((sum, d) => sum + d.tickets, 0);
  const totalRecaudo = chartData.reduce((sum, d) => sum + d.recaudo, 0);
  const totalComisiones = chartData.reduce((sum, d) => sum + d.comisiones, 0);
  const avgMonthly = totalRecaudo / chartData.length;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Card variant="neon">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center gap-2">
              📈 Ventas y Recaudo
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[120px] h-8">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1m">Último Mes</SelectItem>
                  <SelectItem value="3m">3 Meses</SelectItem>
                  <SelectItem value="6m">6 Meses</SelectItem>
                  <SelectItem value="1y">1 Año</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={() => setShowExportModal(true)}
              >
                <Download className="w-4 h-4" />
                Exportar
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-1 text-primary"
                onClick={() => setShowDetailModal(true)}
              >
                <Eye className="w-4 h-4" />
                Detalle
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Summary Stats */}
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="p-3 rounded-lg bg-card-elevated text-center">
                <p className="text-xl font-bold text-primary">{totalTickets.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Tickets Totales</p>
              </div>
              <div className="p-3 rounded-lg bg-card-elevated text-center">
                <p className="text-xl font-bold text-success">${(totalRecaudo / 1000000000).toFixed(2)}B</p>
                <p className="text-xs text-muted-foreground">Recaudo Total</p>
              </div>
              <div className="p-3 rounded-lg bg-card-elevated text-center">
                <p className="text-xl font-bold text-warning">${(totalComisiones / 1000000).toFixed(0)}M</p>
                <p className="text-xs text-muted-foreground">Comisiones</p>
              </div>
              <div className="p-3 rounded-lg bg-card-elevated text-center">
                <p className="text-xl font-bold text-neon-pink">${(avgMonthly / 1000000).toFixed(0)}M</p>
                <p className="text-xs text-muted-foreground">Promedio Mensual</p>
              </div>
            </div>

            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorRecaudo" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorComisiones" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(25, 95%, 53%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(25, 95%, 53%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 8%, 18%)" />
                  <XAxis 
                    dataKey="month" 
                    stroke="hsl(240, 5%, 55%)"
                    tick={{ fill: 'hsl(240, 5%, 55%)', fontSize: 12 }}
                  />
                  <YAxis 
                    yAxisId="left"
                    stroke="hsl(240, 5%, 55%)"
                    tick={{ fill: 'hsl(240, 5%, 55%)', fontSize: 12 }}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    stroke="hsl(240, 5%, 55%)"
                    tick={{ fill: 'hsl(240, 5%, 55%)', fontSize: 12 }}
                    tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                    formatter={(value) => <span className="text-muted-foreground">{value}</span>}
                  />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="tickets"
                    name="Tickets"
                    stroke="hsl(217, 91%, 60%)"
                    strokeWidth={2}
                    fill="url(#colorTickets)"
                  />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="recaudo"
                    name="Recaudo"
                    stroke="hsl(160, 84%, 39%)"
                    strokeWidth={2}
                    fill="url(#colorRecaudo)"
                  />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="comisiones"
                    name="Comisiones"
                    stroke="hsl(25, 95%, 53%)"
                    strokeWidth={2}
                    fill="url(#colorComisiones)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Análisis Detallado de Ventas
            </DialogTitle>
            <DialogDescription>
              Métricas completas del período seleccionado
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Monthly Breakdown */}
            <div>
              <h4 className="font-semibold mb-3">Desglose Mensual</h4>
              <div className="space-y-2">
                {chartData.map((month) => (
                  <div 
                    key={month.month}
                    className="flex items-center justify-between p-3 rounded-lg bg-card-elevated border border-border"
                  >
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{month.month} 2026</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="font-semibold text-primary">{month.tickets.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">tickets</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-success">${(month.recaudo / 1000000).toFixed(0)}M</p>
                        <p className="text-xs text-muted-foreground">recaudo</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-warning">${(month.comisiones / 1000000).toFixed(0)}M</p>
                        <p className="text-xs text-muted-foreground">comisión</p>
                      </div>
                      <Badge 
                        variant={month.recaudo >= month.meta ? "default" : "outline"}
                        className={month.recaudo >= month.meta ? "bg-success/20 text-success" : "text-warning"}
                      >
                        {((month.recaudo / month.meta) * 100).toFixed(0)}% meta
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Trend */}
            <div>
              <h4 className="font-semibold mb-3">Tendencia Semanal (Última Semana)</h4>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 8%, 18%)" />
                    <XAxis 
                      dataKey="day" 
                      stroke="hsl(240, 5%, 55%)"
                      tick={{ fill: 'hsl(240, 5%, 55%)', fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="hsl(240, 5%, 55%)"
                      tick={{ fill: 'hsl(240, 5%, 55%)', fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="tickets" name="Tickets" fill="hsl(270, 91%, 65%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowDetailModal(false)}>
                Cerrar
              </Button>
              <Button variant="party" className="flex-1">
                Descargar Reporte Completo
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Export Modal */}
      <Dialog open={showExportModal} onOpenChange={setShowExportModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Exportar Datos</DialogTitle>
            <DialogDescription>
              Selecciona el formato de exportación
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-4">
            <Button 
              variant="outline" 
              className="w-full justify-start gap-3"
              onClick={() => setShowExportModal(false)}
            >
              <Download className="w-5 h-5 text-success" />
              <div className="text-left">
                <p className="font-medium">Exportar CSV</p>
                <p className="text-xs text-muted-foreground">Datos crudos para análisis</p>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start gap-3"
              onClick={() => setShowExportModal(false)}
            >
              <Download className="w-5 h-5 text-primary" />
              <div className="text-left">
                <p className="font-medium">Exportar Excel</p>
                <p className="text-xs text-muted-foreground">Con formato y gráficos</p>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start gap-3"
              onClick={() => setShowExportModal(false)}
            >
              <Download className="w-5 h-5 text-destructive" />
              <div className="text-left">
                <p className="font-medium">Exportar PDF</p>
                <p className="text-xs text-muted-foreground">Reporte visual listo para imprimir</p>
              </div>
            </Button>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => setShowExportModal(false)}>
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
