import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertCircle, 
  Clock, 
  TrendingUp, 
  Gift,
  ChevronRight,
  Bell
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Alert {
  id: string;
  type: "error" | "warning" | "success";
  icon: React.ElementType;
  title: string;
  description: string;
  count?: number;
  amount?: string;
  action: string;
}

const alerts: Alert[] = [
  {
    id: "1",
    type: "error",
    icon: Clock,
    title: "Cierres pendientes de aprobación",
    description: "8 cierres esperando revisión",
    count: 8,
    amount: "$12.5M",
    action: "Revisar cierres",
  },
  {
    id: "2",
    type: "warning",
    icon: TrendingUp,
    title: "Usuarios cerca de subir de nivel",
    description: "3 promotores listos para ascender",
    count: 3,
    action: "Ver candidatos",
  },
  {
    id: "3",
    type: "success",
    icon: Gift,
    title: "Hitos completados pendientes",
    description: "12 premios por distribuir",
    count: 12,
    action: "Distribuir premios",
  },
];

const typeStyles = {
  error: {
    bg: "bg-destructive/10",
    border: "border-destructive/30",
    icon: "text-destructive",
    badge: "bg-destructive text-destructive-foreground",
  },
  warning: {
    bg: "bg-warning/10",
    border: "border-warning/30",
    icon: "text-warning",
    badge: "bg-warning text-warning-foreground",
  },
  success: {
    bg: "bg-success/10",
    border: "border-success/30",
    icon: "text-success",
    badge: "bg-success text-success-foreground",
  },
};

export function AlertsPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35 }}
    >
      <Card variant="neon" className="h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Alertas y Pendientes
          </CardTitle>
          <Badge variant="destructive" className="text-xs">
            {alerts.reduce((acc, a) => acc + (a.count || 0), 0)}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          {alerts.map((alert, index) => {
            const styles = typeStyles[alert.type];
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={cn(
                  "p-3 rounded-lg border transition-all hover:scale-[1.02]",
                  styles.bg,
                  styles.border
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn("p-2 rounded-lg bg-card/50", styles.icon)}>
                    <alert.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm text-foreground">{alert.title}</p>
                      {alert.count && (
                        <Badge className={cn("text-xs", styles.badge)}>
                          {alert.count}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {alert.description}
                      {alert.amount && (
                        <span className="font-semibold text-foreground ml-1">
                          (Total: {alert.amount})
                        </span>
                      )}
                    </p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 px-2 text-xs gap-1 hover:bg-card"
                    >
                      {alert.action}
                      <ChevronRight className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>
    </motion.div>
  );
}
