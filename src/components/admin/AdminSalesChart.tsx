import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { Download } from "lucide-react";

const chartData = [
  { month: "Ago", tickets: 8540, recaudo: 341600000, comisiones: 64050000 },
  { month: "Sep", tickets: 9280, recaudo: 371200000, comisiones: 69600000 },
  { month: "Oct", tickets: 10150, recaudo: 406000000, comisiones: 76125000 },
  { month: "Nov", tickets: 9870, recaudo: 394800000, comisiones: 74025000 },
  { month: "Dic", tickets: 11430, recaudo: 457200000, comisiones: 85725000 },
  { month: "Ene", tickets: 12458, recaudo: 498320000, comisiones: 93435000 },
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <Card variant="neon">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="flex items-center gap-2">
            📈 Ventas y Recaudo - Últimos 6 Meses
          </CardTitle>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Exportar CSV
          </Button>
        </CardHeader>
        <CardContent>
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
  );
}
