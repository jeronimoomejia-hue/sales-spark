import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Bell,
  Wallet,
  UserX,
  FileText,
  CheckCircle2,
  XCircle,
  Send
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface Alert {
  id: string;
  type: "error" | "warning" | "success" | "info";
  icon: React.ElementType;
  title: string;
  description: string;
  count?: number;
  amount?: string;
  action: string;
  actionRoute?: string;
  details?: {
    items: { name: string; value: string; status?: string }[];
  };
}

const alerts: Alert[] = [
  {
    id: "closures",
    type: "error",
    icon: Clock,
    title: "Cierres pendientes de aprobación",
    description: "8 cierres esperando revisión",
    count: 8,
    amount: "$12.5M",
    action: "Revisar cierres",
    actionRoute: "/admin/closures",
    details: {
      items: [
        { name: "Carlos Ruiz", value: "$2.1M", status: "pending" },
        { name: "Ana Torres", value: "$1.8M", status: "pending" },
        { name: "Luis Gómez", value: "$1.5M", status: "review" },
        { name: "María López", value: "$1.4M", status: "pending" },
        { name: "Pedro Díaz", value: "$1.3M", status: "pending" },
        { name: "Roberto M.", value: "$1.2M", status: "pending" },
        { name: "Carolina V.", value: "$1.1M", status: "pending" },
        { name: "Andrés C.", value: "$1.1M", status: "pending" },
      ]
    }
  },
  {
    id: "levels",
    type: "warning",
    icon: TrendingUp,
    title: "Usuarios cerca de subir de nivel",
    description: "3 promotores listos para ascender",
    count: 3,
    action: "Ver candidatos",
    actionRoute: "/admin/users",
    details: {
      items: [
        { name: "Carlos Ruiz", value: "Nivel 1 → 2", status: "ready" },
        { name: "Ana Torres", value: "Nivel 1 → 2", status: "ready" },
        { name: "Luis Gómez", value: "Nivel 2 → 3", status: "ready" },
      ]
    }
  },
  {
    id: "milestones",
    type: "success",
    icon: Gift,
    title: "Hitos completados pendientes",
    description: "12 premios por distribuir",
    count: 12,
    action: "Distribuir premios",
    actionRoute: "/admin/milestones",
    details: {
      items: [
        { name: "Sorteo VIP", value: "5 ganadores" },
        { name: "Bono $500K", value: "4 vendedores" },
        { name: "Tickets Gratis", value: "3 vendedores" },
      ]
    }
  },
  {
    id: "inactive",
    type: "warning",
    icon: UserX,
    title: "Vendedores inactivos",
    description: "2 vendedores sin ventas en 7 días",
    count: 2,
    action: "Ver detalles",
    actionRoute: "/admin/users",
    details: {
      items: [
        { name: "Felipe Arango", value: "Sin ventas 8 días", status: "warning" },
        { name: "Valentina Ríos", value: "Sin ventas 7 días", status: "warning" },
      ]
    }
  },
  {
    id: "invitations",
    type: "info",
    icon: Send,
    title: "Invitaciones pendientes",
    description: "5 vendedores sin responder",
    count: 5,
    action: "Reenviar",
    details: {
      items: [
        { name: "Nuevo Vendedor 1", value: "Neon Festival", status: "pending" },
        { name: "Nuevo Vendedor 2", value: "Rock Night", status: "pending" },
        { name: "Nuevo Vendedor 3", value: "Electro Waves", status: "pending" },
        { name: "Nuevo Vendedor 4", value: "Neon Festival", status: "pending" },
        { name: "Nuevo Vendedor 5", value: "Rock Night", status: "pending" },
      ]
    }
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
  info: {
    bg: "bg-primary/10",
    border: "border-primary/30",
    icon: "text-primary",
    badge: "bg-primary text-primary-foreground",
  },
};

export function EnhancedAlertsPanel() {
  const navigate = useNavigate();
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  return (
    <>
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
                    "p-3 rounded-lg border transition-all hover:scale-[1.02] cursor-pointer",
                    styles.bg,
                    styles.border
                  )}
                  onClick={() => setSelectedAlert(alert)}
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
                        onClick={(e) => {
                          e.stopPropagation();
                          if (alert.actionRoute) {
                            navigate(alert.actionRoute);
                          } else {
                            setSelectedAlert(alert);
                          }
                        }}
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

      {/* Alert Detail Modal */}
      <Dialog open={!!selectedAlert} onOpenChange={() => setSelectedAlert(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedAlert && (
                <selectedAlert.icon className={cn("w-5 h-5", typeStyles[selectedAlert.type].icon)} />
              )}
              {selectedAlert?.title}
            </DialogTitle>
            <DialogDescription>
              {selectedAlert?.description}
            </DialogDescription>
          </DialogHeader>

          {selectedAlert?.details && (
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                {selectedAlert.details.items.map((item, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg bg-card-elevated border border-border"
                  >
                    <span className="font-medium">{item.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{item.value}</span>
                      {item.status === 'pending' && (
                        <Badge variant="outline" className="text-warning">Pendiente</Badge>
                      )}
                      {item.status === 'review' && (
                        <Badge variant="outline" className="text-primary">En Revisión</Badge>
                      )}
                      {item.status === 'ready' && (
                        <Badge className="bg-success/20 text-success">Listo</Badge>
                      )}
                      {item.status === 'warning' && (
                        <Badge variant="outline" className="text-destructive">Atención</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setSelectedAlert(null)}>
                  Cerrar
                </Button>
                {selectedAlert.id === 'closures' && (
                  <>
                    <Button variant="outline" className="gap-2">
                      <XCircle className="w-4 h-4" />
                      Rechazar Todos
                    </Button>
                    <Button variant="party" className="gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Aprobar Todos
                    </Button>
                  </>
                )}
                {selectedAlert.id === 'levels' && (
                  <Button variant="party" className="flex-1">
                    Aprobar Ascensos
                  </Button>
                )}
                {selectedAlert.id === 'milestones' && (
                  <Button variant="party" className="flex-1">
                    Distribuir Premios
                  </Button>
                )}
                {selectedAlert.id === 'invitations' && (
                  <Button variant="party" className="flex-1">
                    Reenviar Invitaciones
                  </Button>
                )}
                {selectedAlert.actionRoute && !['closures', 'levels', 'milestones', 'invitations'].includes(selectedAlert.id) && (
                  <Button 
                    variant="party" 
                    className="flex-1"
                    onClick={() => {
                      setSelectedAlert(null);
                      navigate(selectedAlert.actionRoute!);
                    }}
                  >
                    Ver Todos
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
