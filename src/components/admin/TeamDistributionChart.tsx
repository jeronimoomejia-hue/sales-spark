import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from "recharts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Users, TrendingUp, Award, Eye } from "lucide-react";

interface LevelData {
  level: string;
  count: number;
  color: string;
  sales: number;
  commission: number;
  avgPerUser: number;
}

const distributionData: LevelData[] = [
  { level: "Socios", count: 3, color: "hsl(270, 91%, 65%)", sales: 0, commission: 0, avgPerUser: 0 },
  { level: "Sub Socios", count: 12, color: "hsl(330, 85%, 60%)", sales: 4580, commission: 68700000, avgPerUser: 381.7 },
  { level: "Cabezas", count: 22, color: "hsl(25, 95%, 53%)", sales: 8760, commission: 87600000, avgPerUser: 398.2 },
  { level: "Comunes", count: 52, color: "hsl(217, 91%, 60%)", sales: 12450, commission: 93375000, avgPerUser: 239.4 },
];

const totalUsers = distributionData.reduce((acc, item) => acc + item.count, 0);
const totalSales = distributionData.reduce((acc, item) => acc + item.sales, 0);
const totalCommission = distributionData.reduce((acc, item) => acc + item.commission, 0);

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const percentage = ((data.count / totalUsers) * 100).toFixed(1);
    return (
      <div className="bg-card-elevated border border-border rounded-lg p-3 shadow-lg">
        <p className="font-medium text-foreground">{data.level}</p>
        <p className="text-sm text-muted-foreground">
          {data.count} usuarios ({percentage}%)
        </p>
        <p className="text-sm text-success">
          {data.sales.toLocaleString()} ventas
        </p>
      </div>
    );
  }
  return null;
};

export function TeamDistributionChart() {
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState<LevelData | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.45 }}
      >
        <Card variant="neon">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center gap-2">
              📊 Distribución por Nivel
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-1 text-primary"
              onClick={() => setShowDetailModal(true)}
            >
              Ver detalle
              <Eye className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Stats Summary */}
              <div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {distributionData.map((item) => (
                    <div 
                      key={item.level}
                      className="p-3 rounded-lg bg-card-elevated hover:bg-card transition-colors cursor-pointer border border-transparent hover:border-primary/40"
                      onClick={() => setSelectedLevel(item)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p 
                          className="text-2xl font-bold font-display"
                          style={{ color: item.color }}
                        >
                          {item.count}
                        </p>
                        <Badge 
                          variant="outline" 
                          className="text-xs"
                          style={{ borderColor: item.color, color: item.color }}
                        >
                          {((item.count / totalUsers) * 100).toFixed(0)}%
                        </Badge>
                      </div>
                      <p className="text-sm font-medium">{item.level}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.sales.toLocaleString()} ventas
                      </p>
                    </div>
                  ))}
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-card-elevated">
                  <div className="text-center">
                    <p className="text-lg font-bold text-primary">{totalUsers}</p>
                    <p className="text-xs text-muted-foreground">Total Usuarios</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-success">{totalSales.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Total Ventas</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-warning">${(totalCommission / 1000000).toFixed(0)}M</p>
                    <p className="text-xs text-muted-foreground">Comisiones</p>
                  </div>
                </div>
              </div>

              {/* Bar Chart */}
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={distributionData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 8%, 18%)" horizontal={false} />
                    <XAxis 
                      type="number"
                      stroke="hsl(240, 5%, 55%)"
                      tick={{ fill: 'hsl(240, 5%, 55%)', fontSize: 12 }}
                    />
                    <YAxis 
                      type="category"
                      dataKey="level"
                      stroke="hsl(240, 5%, 55%)"
                      tick={{ fill: 'hsl(240, 5%, 55%)', fontSize: 12 }}
                      width={80}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(240, 8%, 14%)' }} />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={30}>
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Level Detail Modal */}
      <Dialog open={!!selectedLevel} onOpenChange={() => setSelectedLevel(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Nivel: {selectedLevel?.level}
            </DialogTitle>
            <DialogDescription>
              Estadísticas detalladas del nivel
            </DialogDescription>
          </DialogHeader>

          {selectedLevel && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-4 rounded-lg bg-card-elevated">
                  <p 
                    className="text-3xl font-bold"
                    style={{ color: selectedLevel.color }}
                  >
                    {selectedLevel.count}
                  </p>
                  <p className="text-sm text-muted-foreground">Usuarios</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-card-elevated">
                  <p className="text-3xl font-bold text-success">
                    {selectedLevel.sales.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Ventas Totales</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-card-elevated">
                  <p className="text-3xl font-bold text-warning">
                    ${(selectedLevel.commission / 1000000).toFixed(1)}M
                  </p>
                  <p className="text-sm text-muted-foreground">Comisiones</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-card-elevated">
                  <p className="text-3xl font-bold text-primary">
                    {selectedLevel.avgPerUser.toFixed(0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Promedio/Usuario</p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-card border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">% del Total de Usuarios</span>
                  <span className="font-semibold">{((selectedLevel.count / totalUsers) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">% de Ventas Totales</span>
                  <span className="font-semibold">{((selectedLevel.sales / totalSales) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">% de Comisiones</span>
                  <span className="font-semibold">{((selectedLevel.commission / totalCommission) * 100).toFixed(1)}%</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setSelectedLevel(null)}>
                  Cerrar
                </Button>
                <Button 
                  variant="party" 
                  className="flex-1"
                  onClick={() => {
                    setSelectedLevel(null);
                    navigate('/admin/users');
                  }}
                >
                  Ver Usuarios del Nivel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Full Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Análisis Completo por Nivel</DialogTitle>
            <DialogDescription>
              Comparativa de rendimiento entre niveles jerárquicos
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-4 gap-3">
              <div className="text-center p-3 rounded-lg bg-primary/10">
                <p className="text-2xl font-bold text-primary">{totalUsers}</p>
                <p className="text-xs text-muted-foreground">Total Usuarios</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-success/10">
                <p className="text-2xl font-bold text-success">{totalSales.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Ventas Totales</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-warning/10">
                <p className="text-2xl font-bold text-warning">${(totalCommission / 1000000).toFixed(0)}M</p>
                <p className="text-xs text-muted-foreground">Comisiones</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-neon-pink/10">
                <p className="text-2xl font-bold text-neon-pink">{(totalSales / totalUsers).toFixed(0)}</p>
                <p className="text-xs text-muted-foreground">Prom. Ventas</p>
              </div>
            </div>

            <div className="space-y-2">
              {distributionData.map((item) => (
                <div 
                  key={item.level}
                  className="flex items-center justify-between p-3 rounded-lg bg-card-elevated border border-border"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <div>
                      <p className="font-medium">{item.level}</p>
                      <p className="text-xs text-muted-foreground">{item.count} usuarios</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-right">
                      <p className="font-semibold">{item.sales.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">ventas</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-success">${(item.commission / 1000000).toFixed(1)}M</p>
                      <p className="text-xs text-muted-foreground">comisión</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">{item.avgPerUser.toFixed(0)}</p>
                      <p className="text-xs text-muted-foreground">prom/user</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowDetailModal(false)}>
                Cerrar
              </Button>
              <Button 
                variant="party" 
                className="flex-1"
                onClick={() => {
                  setShowDetailModal(false);
                  navigate('/admin/reports');
                }}
              >
                Ver Reporte Completo
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
