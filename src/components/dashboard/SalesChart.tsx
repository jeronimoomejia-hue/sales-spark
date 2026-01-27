import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { BarChart3 } from "lucide-react";

interface DataPoint {
  name: string;
  ventas: number;
  comision: number;
}

interface SalesChartProps {
  data: DataPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-xl">
        <p className="text-sm font-medium text-foreground mb-2">{label}</p>
        <div className="space-y-1">
          <p className="text-sm text-neon-purple">
            Ventas: <span className="font-bold">{payload[0]?.value}</span>
          </p>
          <p className="text-sm text-success">
            Comisión: <span className="font-bold">${payload[1]?.value?.toLocaleString("es-CO")}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export function SalesChart({ data }: SalesChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Card variant="neon" className="h-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Ventas Últimos 30 Días
          </CardTitle>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm rounded-lg bg-primary/10 text-primary border border-primary/30">
              Diario
            </button>
            <button className="px-3 py-1 text-sm rounded-lg text-muted-foreground hover:bg-card-elevated transition-colors">
              Semanal
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(270, 91%, 65%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(270, 91%, 65%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorComision" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 8%, 18%)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(240, 5%, 55%)" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="hsl(240, 5%, 55%)" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="ventas"
                  stroke="hsl(270, 91%, 65%)"
                  strokeWidth={2}
                  fill="url(#colorVentas)"
                />
                <Area
                  type="monotone"
                  dataKey="comision"
                  stroke="hsl(160, 84%, 39%)"
                  strokeWidth={2}
                  fill="url(#colorComision)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
