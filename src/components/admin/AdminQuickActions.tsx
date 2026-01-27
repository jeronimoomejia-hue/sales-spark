import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Target, 
  Wallet, 
  BarChart3, 
  Link2, 
  Settings 
} from "lucide-react";

const actions = [
  { icon: Users, label: "Gestionar Usuarios", href: "/admin/users" },
  { icon: Target, label: "Hitos", href: "/admin/milestones" },
  { icon: Wallet, label: "Comisiones", href: "/admin/commissions" },
  { icon: BarChart3, label: "Reportes", href: "/admin/reports" },
  { icon: Link2, label: "Webhooks", href: "/admin/integrations" },
  { icon: Settings, label: "Configuración", href: "/admin/settings" },
];

export function AdminQuickActions() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="flex flex-wrap gap-3"
    >
      {actions.map((action) => (
        <Button
          key={action.label}
          variant="outline"
          className="gap-2 bg-card hover:bg-card-elevated border-border hover:border-primary/40 transition-all"
          onClick={() => navigate(action.href)}
        >
          <action.icon className="w-4 h-4 text-primary" />
          <span>{action.label}</span>
        </Button>
      ))}
    </motion.div>
  );
}
