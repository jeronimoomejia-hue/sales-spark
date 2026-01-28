import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  PieChart as PieChartIcon,
  TrendingUp,
  Users,
  TicketIcon,
  Calendar,
  Download,
  Target,
  Clock,
  DollarSign,
  ArrowUpRight,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SalesAnalyticsPanelProps {
  eventId: string;
}

// Mock data generators
const generateDailySalesData = () => {
  const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
  return days.map((day, i) => ({
    day,
    ventas: Math.floor(Math.random() * 200) + 50 + (i >= 5 ? 100 : 0),
    meta: 150,
    ingresos: Math.floor(Math.random() * 15000000) + 5000000,
  }));
};

const generateHourlySalesData = () => {
  return Array.from({ length: 24 }, (_, hour) => {
    const isPeakHour = hour >= 18 && hour <= 22;
    return {
      hour: `${hour}:00`,
      ventas: Math.floor(Math.random() * (isPeakHour ? 30 : 10)) + (isPeakHour ? 15 : 2),
    };
  });
};

const generateTicketTypeData = () => [
  { name: "General", value: 4200, color: "#a855f7", percentage: 60 },
  { name: "VIP", value: 2100, color: "#ec4899", percentage: 30 },
  { name: "Backstage", value: 700, color: "#f97316", percentage: 10 },
];

const generateSellerLevelData = () => [
  { name: "Promotores Comunes", value: 52, ventas: 3500, color: "#3b82f6" },
  { name: "Promotores Cabeza", value: 22, ventas: 2100, color: "#f97316" },
  { name: "Sub Socios", value: 12, ventas: 1100, color: "#ec4899" },
  { name: "Socios", value: 3, ventas: 300, color: "#fbbf24" },
];

const generateWeeklyTrendData = () => [
  { week: "Sem 1", ventas: 1200, ingresos: 48000000 },
  { week: "Sem 2", ventas: 1850, ingresos: 74000000 },
  { week: "Sem 3", ventas: 2400, ingresos: 96000000 },
  { week: "Sem 4", ventas: 3100, ingresos: 124000000 },
];

const generateConversionData = () => [
  { stage: "Links Enviados", value: 15000, color: "#a855f7" },
  { stage: "Links Abiertos", value: 10200, color: "#3b82f6" },
  { stage: "Checkout", value: 8500, color: "#f97316" },
  { stage: "Compra", value: 7000, color: "#10b981" },
];

export function SalesAnalyticsPanel({ eventId }: SalesAnalyticsPanelProps) {
  const [period, setPeriod] = useState("7d");
  
  const dailySalesData = generateDailySalesData();
  const hourlySalesData = generateHourlySalesData();
  const ticketTypeData = generateTicketTypeData();
  const sellerLevelData = generateSellerLevelData();
  const weeklyTrendData = generateWeeklyTrendData();
  const conversionData = generateConversionData();

  // Calculate totals
  const totalSales = ticketTypeData.reduce((sum, t) => sum + t.value, 0);
  const avgDailySales = Math.round(dailySalesData.reduce((sum, d) => sum + d.ventas, 0) / dailySalesData.length);
  const peakHour = hourlySalesData.reduce((max, h) => h.ventas > max.ventas ? h : max, hourlySalesData[0]);

  return (
    <div className="space-y-6">
      {/* Period Selector & Export */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {["24h", "7d", "15d", "30d"].map((p) => (
            <Button
              key={p}
              variant={period === p ? "default" : "outline"}
              size="sm"
              onClick={() => setPeriod(p)}
            >
              {p.toUpperCase()}
            </Button>
          ))}
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Exportar Reporte
        </Button>
      </div>

      {/* Key Insights Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-primary/20">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <Badge className="bg-success/20 text-success border-0">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  +18%
                </Badge>
              </div>
              <p className="text-2xl font-bold">{avgDailySales}</p>
              <p className="text-xs text-muted-foreground">Promedio Diario</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-success/20 to-success/5 border-success/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-success/20">
                  <Target className="w-5 h-5 text-success" />
                </div>
                <Badge className="bg-success/20 text-success border-0">68%</Badge>
              </div>
              <p className="text-2xl font-bold">68%</p>
              <p className="text-xs text-muted-foreground">Tasa Conversión</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-warning/20 to-warning/5 border-warning/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-warning/20">
                  <Clock className="w-5 h-5 text-warning" />
                </div>
              </div>
              <p className="text-2xl font-bold">{peakHour.hour}</p>
              <p className="text-xs text-muted-foreground">Hora Pico ({peakHour.ventas} ventas)</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-neon-pink/20 to-neon-pink/5 border-neon-pink/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-neon-pink/20">
                  <DollarSign className="w-5 h-5 text-neon-pink" />
                </div>
              </div>
              <p className="text-2xl font-bold">$65K</p>
              <p className="text-xs text-muted-foreground">Ticket Promedio</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Sales Trend */}
        <Card className="bg-card border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="w-5 h-5 text-primary" />
              Ventas Diarias vs Meta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailySalesData}>
                  <defs>
                    <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="day" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1c1c2e",
                      border: "1px solid #333",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="ventas"
                    stroke="#a855f7"
                    fill="url(#colorVentas)"
                    strokeWidth={2}
                    name="Ventas"
                  />
                  <Area
                    type="monotone"
                    dataKey="meta"
                    stroke="#10b981"
                    strokeDasharray="5 5"
                    fill="transparent"
                    strokeWidth={2}
                    name="Meta"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Ticket Type Distribution */}
        <Card className="bg-card border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <PieChartIcon className="w-5 h-5 text-primary" />
              Distribución por Tipo de Ticket
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center">
              <ResponsiveContainer width="60%" height="100%">
                <PieChart>
                  <Pie
                    data={ticketTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {ticketTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1c1c2e",
                      border: "1px solid #333",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [`${value.toLocaleString()} tickets`, ""]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-3">
                {ticketTypeData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{item.value.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{item.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Distribution */}
        <Card className="bg-card border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="w-5 h-5 text-warning" />
              Ventas por Hora del Día
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlySalesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis 
                    dataKey="hour" 
                    stroke="#666" 
                    interval={3}
                    fontSize={10}
                  />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1c1c2e",
                      border: "1px solid #333",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="ventas" fill="#f97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Sales by Seller Level */}
        <Card className="bg-card border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="w-5 h-5 text-success" />
              Ventas por Nivel de Vendedor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sellerLevelData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis type="number" stroke="#666" />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="#666"
                    width={120}
                    fontSize={11}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1c1c2e",
                      border: "1px solid #333",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [`${value.toLocaleString()} tickets`, "Ventas"]}
                  />
                  <Bar dataKey="ventas" radius={[0, 4, 4, 0]}>
                    {sellerLevelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Funnel & Weekly Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Funnel */}
        <Card className="bg-card border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="w-5 h-5 text-neon-pink" />
              Embudo de Conversión
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {conversionData.map((stage, index) => {
              const percentage = index === 0 ? 100 : Math.round((stage.value / conversionData[0].value) * 100);
              return (
                <motion.div
                  key={stage.stage}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{stage.stage}</span>
                    <span className="text-sm text-muted-foreground">
                      {stage.value.toLocaleString()} ({percentage}%)
                    </span>
                  </div>
                  <div className="h-8 rounded-lg bg-muted/30 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, delay: index * 0.15 }}
                      className="h-full rounded-lg"
                      style={{ backgroundColor: stage.color }}
                    />
                  </div>
                </motion.div>
              );
            })}
            <div className="mt-4 p-3 rounded-lg bg-success/10 border border-success/30">
              <p className="text-sm font-medium text-success">
                Tasa de conversión final: {Math.round((conversionData[3].value / conversionData[0].value) * 100)}%
              </p>
              <p className="text-xs text-muted-foreground">
                Por encima del promedio de la industria (45%)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Trend */}
        <Card className="bg-card border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="w-5 h-5 text-primary" />
              Tendencia Semanal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyTrendData}>
                  <defs>
                    <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="week" stroke="#666" />
                  <YAxis 
                    yAxisId="left"
                    stroke="#666" 
                    tickFormatter={(v) => v.toLocaleString()}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    stroke="#666" 
                    tickFormatter={(v) => `$${(v / 1000000).toFixed(0)}M`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1c1c2e",
                      border: "1px solid #333",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number, name: string) => {
                      if (name === "ingresos") return [`$${(value / 1000000).toFixed(1)}M`, "Ingresos"];
                      return [value.toLocaleString(), "Ventas"];
                    }}
                  />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="ventas"
                    stroke="#a855f7"
                    fill="url(#colorVentas)"
                    strokeWidth={2}
                    name="ventas"
                  />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="ingresos"
                    stroke="#10b981"
                    fill="url(#colorIngresos)"
                    strokeWidth={2}
                    name="ingresos"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
