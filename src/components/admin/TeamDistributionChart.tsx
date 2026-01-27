import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";

const distributionData = [
  { level: "Socios", count: 3, color: "hsl(270, 91%, 65%)" },
  { level: "Sub Socios", count: 12, color: "hsl(330, 85%, 60%)" },
  { level: "Cabezas", count: 22, color: "hsl(25, 95%, 53%)" },
  { level: "Comunes", count: 52, color: "hsl(217, 91%, 60%)" },
];

const totalUsers = distributionData.reduce((acc, item) => acc + item.count, 0);

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
      </div>
    );
  }
  return null;
};

export function TeamDistributionChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.45 }}
    >
      <Card variant="neon" className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            📊 Distribución por Nivel
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Stats Summary */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {distributionData.map((item) => (
              <div 
                key={item.level}
                className="text-center p-2 rounded-lg bg-card-elevated"
              >
                <p 
                  className="text-2xl font-bold font-display"
                  style={{ color: item.color }}
                >
                  {item.count}
                </p>
                <p className="text-xs text-muted-foreground truncate">{item.level}</p>
              </div>
            ))}
          </div>

          {/* Bar Chart */}
          <div className="h-[200px]">
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

          {/* Total */}
          <div className="mt-4 pt-4 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              Total: <span className="font-bold text-foreground">{totalUsers} usuarios</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
