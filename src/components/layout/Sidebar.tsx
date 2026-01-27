import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Users, 
  TicketIcon, 
  Target, 
  Wallet, 
  Settings, 
  ChevronLeft,
  LogOut,
  Bell
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard", adminPath: "/admin" },
  { icon: TicketIcon, label: "Mis Ventas", path: "/ventas", levelMax: 3 },
  { icon: Target, label: "Hitos", path: "/hitos", adminPath: "/admin/milestones" },
  { icon: Wallet, label: "Cierres", path: "/cierres", adminPath: "/admin/closures" },
  { icon: Users, label: "Mi Equipo", path: "/equipo", levelRequired: 2, adminPath: "/admin/users" },
  { icon: Settings, label: "Configuración", path: "/configuracion", adminPath: "/admin/settings" },
];

interface SidebarProps {
  userLevel?: number;
}

export function Sidebar({ userLevel = 1 }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const isAdmin = userLevel === 4;
  
  const filteredItems = menuItems.filter(
    (item) => {
      if (item.levelRequired && userLevel < item.levelRequired) return false;
      if (item.levelMax && userLevel > item.levelMax) return false;
      return true;
    }
  );

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 260 }}
      className="h-screen bg-sidebar border-r border-sidebar-border flex flex-col fixed left-0 top-0 z-50"
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-party flex items-center justify-center">
                <span className="text-white font-bold text-lg font-display">C</span>
              </div>
              <span className="text-xl font-bold font-display text-gradient-party">CREWS</span>
            </motion.div>
          )}
        </AnimatePresence>
        {collapsed && (
          <div className="w-9 h-9 rounded-xl bg-gradient-party flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-lg font-display">C</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "p-2 rounded-lg hover:bg-sidebar-accent transition-colors",
            collapsed && "hidden"
          )}
        >
          <ChevronLeft className="w-5 h-5 text-sidebar-foreground" />
        </button>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-sidebar-border">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <div className="relative">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold",
              isAdmin ? "bg-gradient-party" : "bg-gradient-party"
            )}>
              {isAdmin ? "NA" : "JP"}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-success rounded-full border-2 border-sidebar pulse-neon" />
          </div>
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="font-medium text-sm truncate text-foreground">
                  {isAdmin ? "NeonEvents Admin" : "Juan Pérez"}
                </p>
                <p className="text-xs text-sidebar-foreground">
                  {isAdmin ? "Socio (Nivel 4)" : "Promotor Común"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <AnimatePresence mode="wait">
          {!collapsed && !isAdmin && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-4 space-y-2"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="text-sidebar-foreground">Nivel 1 → 2</span>
                <span className="text-primary font-medium">38%</span>
              </div>
              <Progress value={38} size="sm" indicatorColor="party" />
            </motion.div>
          )}
          {!collapsed && isAdmin && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-4 p-2 rounded-lg bg-primary/10 border border-primary/20"
            >
              <p className="text-xs text-primary font-medium text-center">
                Panel de Administración
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {filteredItems.map((item) => {
          const itemPath = isAdmin && item.adminPath ? item.adminPath : item.path;
          const isActive = location.pathname === itemPath || 
            (itemPath === "/dashboard" && location.pathname === "/") ||
            (itemPath === "/admin" && location.pathname === "/admin/dashboard");
          
          return (
            <NavLink
              key={item.path}
              to={itemPath}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground",
                collapsed && "justify-center px-2"
              )}
            >
              <item.icon className={cn("w-5 h-5 shrink-0", isActive && "text-primary")} />
              <AnimatePresence mode="wait">
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm font-medium"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-sidebar-border space-y-1">
        <button
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-colors text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground",
            collapsed && "justify-center px-2"
          )}
        >
          <Bell className="w-5 h-5 shrink-0" />
          {!collapsed && (
            <>
              <span className="text-sm font-medium">Notificaciones</span>
              <span className="ml-auto bg-destructive text-destructive-foreground text-xs px-2 py-0.5 rounded-full">
                3
              </span>
            </>
          )}
        </button>
        <button
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-colors text-destructive hover:bg-destructive/10",
            collapsed && "justify-center px-2"
          )}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Cerrar Sesión</span>}
        </button>
      </div>

      {/* Collapse Toggle (visible when collapsed) */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="absolute -right-3 top-20 w-6 h-6 bg-sidebar border border-sidebar-border rounded-full flex items-center justify-center hover:bg-sidebar-accent transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-sidebar-foreground rotate-180" />
        </button>
      )}
    </motion.aside>
  );
}
