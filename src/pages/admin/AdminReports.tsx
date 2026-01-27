import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Download, 
  Calendar,
  TrendingUp,
  Users,
  Wallet,
  TicketIcon,
  Filter
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

const monthlyData = [
  { month: "Ago", tickets: 8500, revenue: 340000000, commissions: 63750000 },
  { month: "Sep", tickets: 9200, revenue: 368000000, commissions: 69000000 },
  { month: "Oct", tickets: 10800, revenue: 432000000, commissions: 81000000 },
  { month: "Nov", tickets: 11500, revenue: 460000000, commissions: 86250000 },
  { month: "Dic", tickets: 15200, revenue: 608000000, commissions: 114000000 },
  { month: "Ene", tickets: 12458, revenue: 498320000, commissions: 93435000 },
];

const eventData = [
  { name: "Neon Festival", tickets: 5200, revenue: 208000000 },
  { name: "Rock Night", tickets: 3100, revenue: 124000000 },
  { name: "Electro Waves", tickets: 2400, revenue: 108000000 },
  { name: "Urban Beats", tickets: 1758, revenue: 58320000 },
];

const levelDistribution = [
  { name: "Promotores Comunes", value: 52, color: "#a855f7" },
  { name: "Promotores Cabeza", value: 22, color: "#ec4899" },
  { name: "Sub Socios", value: 12, color: "#f97316" },
  { name: "Socios", value: 3, color: "#fbbf24" },
];

export default function AdminReports() {
  const [period, setPeriod] = useState("6m");

  return (
    <DashboardLayout 
      title="Reportes y Análisis" 
      subtitle="Métricas detalladas de la operación"
      userLevel={4}
    >
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card variant="glass" className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <TicketIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tickets Totales</p>
                <p className="text-2xl font-bold font-display">67,658</p>
                <p className="text-xs text-success">+18% vs período anterior</p>
              </div>
            </div>
          </Card>
          <Card variant="glass" className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/20">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Recaudo Total</p>
                <p className="text-2xl font-bold font-display">$2.7B</p>
                <p className="text-xs text-success">+23% vs período anterior</p>
              </div>
            </div>
          </Card>
          <Card variant="glass" className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/20">
                <Wallet className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Comisiones</p>
                <p className="text-2xl font-bold font-display">$507M</p>
                <p className="text-xs text-success">+15% vs período anterior</p>
              </div>
            </div>
          </Card>
          <Card variant="glass" className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/20">
                <Users className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ticket Promedio</p>
                <p className="text-2xl font-bold font-display">757/persona</p>
                <p className="text-xs text-success">+8% vs período anterior</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card variant="glass" className="p-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2">
              {["1m", "3m", "6m", "1y", "all"].map((p) => (
                <Button
                  key={p}
                  variant={period === p ? "party" : "outline"}
                  size="sm"
                  onClick={() => setPeriod(p)}
                >
                  {p === "all" ? "Todo" : p.toUpperCase()}
                </Button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Calendar className="w-4 h-4" />
                Rango Personalizado
              </Button>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Filtros
              </Button>
              <Button variant="party" className="gap-2">
                <Download className="w-4 h-4" />
                Exportar Reporte
              </Button>
            </div>
          </div>
        </Card>

        {/* Main Chart */}
        <Card variant="glass" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Evolución de Ventas y Comisiones</h3>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-muted-foreground">Tickets</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-success" />
                <span className="text-muted-foreground">Recaudo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-warning" />
                <span className="text-muted-foreground">Comisiones</span>
              </div>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1c1c2e', 
                    border: '1px solid #333',
                    borderRadius: '8px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="tickets"
                  stroke="#a855f7"
                  fill="url(#colorTickets)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Two Column Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Event Performance */}
          <Card variant="glass" className="p-6">
            <h3 className="text-lg font-semibold mb-6">Ventas por Evento</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={eventData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis type="number" stroke="#666" />
                  <YAxis dataKey="name" type="category" stroke="#666" width={100} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1c1c2e', 
                      border: '1px solid #333',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="tickets" fill="#a855f7" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Team Distribution */}
          <Card variant="glass" className="p-6">
            <h3 className="text-lg font-semibold mb-6">Distribución del Equipo</h3>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={levelDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {levelDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1c1c2e', 
                      border: '1px solid #333',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {levelDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Top Performers Table */}
        <Card variant="glass" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Top 10 Vendedores del Período</h3>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Exportar
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">#</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Vendedor</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Nivel</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Tickets</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Comisión</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Tendencia</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { rank: 1, name: "Carlos Ruiz", level: "Cabeza", tickets: 1245, commission: 12450000, trend: 18 },
                  { rank: 2, name: "Laura Martínez", level: "Sub Socio", tickets: 987, commission: 14805000, trend: 12 },
                  { rank: 3, name: "Ana Torres", level: "Común", tickets: 856, commission: 6420000, trend: 25 },
                  { rank: 4, name: "Roberto Silva", level: "Sub Socio", tickets: 782, commission: 11730000, trend: 8 },
                  { rank: 5, name: "Sandra García", level: "Cabeza", tickets: 698, commission: 6980000, trend: -3 },
                ].map((seller, index) => (
                  <tr key={seller.rank} className="border-b border-border/50 hover:bg-card-elevated/50">
                    <td className="p-3">
                      <span className={`font-bold ${
                        seller.rank === 1 ? 'text-yellow-500' : 
                        seller.rank === 2 ? 'text-gray-400' : 
                        seller.rank === 3 ? 'text-orange-500' : ''
                      }`}>
                        {seller.rank === 1 ? '🥇' : seller.rank === 2 ? '🥈' : seller.rank === 3 ? '🥉' : seller.rank}
                      </span>
                    </td>
                    <td className="p-3 font-medium">{seller.name}</td>
                    <td className="p-3">
                      <Badge variant="secondary">{seller.level}</Badge>
                    </td>
                    <td className="p-3 font-medium">{seller.tickets.toLocaleString()}</td>
                    <td className="p-3 text-success font-medium">
                      ${(seller.commission / 1000000).toFixed(1)}M
                    </td>
                    <td className="p-3">
                      <span className={`flex items-center gap-1 ${
                        seller.trend >= 0 ? 'text-success' : 'text-destructive'
                      }`}>
                        <TrendingUp className={`w-4 h-4 ${seller.trend < 0 ? 'rotate-180' : ''}`} />
                        {Math.abs(seller.trend)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
