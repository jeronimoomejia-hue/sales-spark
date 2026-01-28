import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Calendar,
  Users, 
  TicketIcon, 
  Target, 
  Wallet, 
  Settings, 
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  LogOut,
  Bell,
  FileStack,
  UserPlus,
  Link2,
  BarChart3,
  Layers
} from "lucide-react";
import { cn } from "@/lib/utils";
import { events } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface AdminSidebarProps {
  userLevel?: number;
}

const eventStatusColors = {
  active: "bg-success text-success-foreground",
  upcoming: "bg-warning text-warning-foreground", 
  closed: "bg-muted text-muted-foreground"
};

export function AdminSidebar({ userLevel = 4 }: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [eventsOpen, setEventsOpen] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Detect if we're on an event-specific page
  useEffect(() => {
    const match = location.pathname.match(/\/admin\/events\/([^/]+)/);
    if (match) {
      setSelectedEventId(match[1]);
      setEventsOpen(true);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    sessionStorage.removeItem("demoUserLevel");
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;
  const isEventActive = (eventId: string) => location.pathname.includes(`/admin/events/${eventId}`);

  // Event sub-menu items
  const eventSubMenu = [
    { icon: Users, label: "Alineación", path: "roster" },
    { icon: TicketIcon, label: "Ventas", path: "sales" },
    { icon: Target, label: "Hitos", path: "milestones" },
    { icon: Wallet, label: "Cierres", path: "closures" },
    { icon: BarChart3, label: "Reportes", path: "reports" },
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
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
              <Badge variant="secondary" className="text-[10px] ml-1">Admin</Badge>
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
            <div className="w-10 h-10 rounded-full bg-gradient-party flex items-center justify-center text-white font-semibold">
              NA
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
                  NeonEvents Admin
                </p>
                <p className="text-xs text-sidebar-foreground">
                  Productora
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {/* Inicio */}
        <NavLink
          to="/admin"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
            isActive("/admin") || isActive("/admin/dashboard")
              ? "bg-primary/10 text-primary border border-primary/30"
              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground",
            collapsed && "justify-center px-2"
          )}
        >
          <LayoutDashboard className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Inicio</span>}
        </NavLink>

        {/* Mis Eventos - Collapsible */}
        <Collapsible open={eventsOpen && !collapsed} onOpenChange={setEventsOpen}>
          <CollapsibleTrigger asChild>
            <button
              className={cn(
                "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-all duration-200",
                location.pathname.includes("/admin/events")
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground",
                collapsed && "justify-center px-2"
              )}
            >
              <Calendar className="w-5 h-5 shrink-0" />
              {!collapsed && (
                <>
                  <span className="text-sm font-medium flex-1 text-left">Mis Eventos</span>
                  <Badge variant="secondary" className="text-xs">{events.length}</Badge>
                  {eventsOpen ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </>
              )}
            </button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="mt-1 space-y-1">
            {events.map((event) => (
              <Collapsible 
                key={event.id} 
                open={selectedEventId === event.id}
                onOpenChange={(open) => setSelectedEventId(open ? event.id : null)}
              >
                <CollapsibleTrigger asChild>
                  <button
                    className={cn(
                      "flex items-center gap-2 w-full px-3 py-2 ml-4 rounded-lg transition-all text-sm",
                      isEventActive(event.id)
                        ? "bg-primary/5 text-primary"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground"
                    )}
                  >
                    <div className={cn(
                      "w-2 h-2 rounded-full shrink-0",
                      event.status === 'active' ? "bg-success" : 
                      event.status === 'upcoming' ? "bg-warning" : "bg-muted-foreground"
                    )} />
                    <span className="flex-1 text-left truncate">{event.name}</span>
                    {selectedEventId === event.id ? (
                      <ChevronDown className="w-3 h-3" />
                    ) : (
                      <ChevronRight className="w-3 h-3" />
                    )}
                  </button>
                </CollapsibleTrigger>
                
                <CollapsibleContent className="mt-1 space-y-0.5 ml-6 border-l border-border pl-2">
                  {eventSubMenu.map((item) => (
                    <NavLink
                      key={item.path}
                      to={`/admin/events/${event.id}/${item.path}`}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-xs",
                        location.pathname === `/admin/events/${event.id}/${item.path}`
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                      )}
                    >
                      <item.icon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                    </NavLink>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ))}
            
            {/* Add New Event */}
            <NavLink
              to="/admin/events"
              className={cn(
                "flex items-center gap-2 px-3 py-2 ml-4 rounded-lg transition-all text-sm",
                isActive("/admin/events")
                  ? "bg-primary/10 text-primary"
                  : "text-primary/70 hover:bg-primary/5 hover:text-primary"
              )}
            >
              <Calendar className="w-4 h-4" />
              <span>Ver todos / Agregar</span>
            </NavLink>
          </CollapsibleContent>
        </Collapsible>

        {/* Divider */}
        <div className="my-3 border-t border-sidebar-border" />

        {/* Plantillas */}
        <NavLink
          to="/admin/templates"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
            isActive("/admin/templates")
              ? "bg-primary/10 text-primary border border-primary/30"
              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground",
            collapsed && "justify-center px-2"
          )}
        >
          <Layers className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Plantillas</span>}
        </NavLink>

        {/* Solicitudes de Vendedores */}
        <NavLink
          to="/admin/registrations"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
            isActive("/admin/registrations")
              ? "bg-primary/10 text-primary border border-primary/30"
              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground",
            collapsed && "justify-center px-2"
          )}
        >
          <UserPlus className="w-5 h-5 shrink-0" />
          {!collapsed && (
            <>
              <span className="text-sm font-medium flex-1">Solicitudes</span>
              <Badge variant="destructive" className="text-xs">4</Badge>
            </>
          )}
        </NavLink>

        {/* Divider */}
        <div className="my-3 border-t border-sidebar-border" />

        {/* Vendedores Globales */}
        <NavLink
          to="/admin/users"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
            isActive("/admin/users")
              ? "bg-primary/10 text-primary border border-primary/30"
              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground",
            collapsed && "justify-center px-2"
          )}
        >
          <Users className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Vendedores</span>}
        </NavLink>

        {/* Integraciones */}
        <NavLink
          to="/admin/integrations"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
            isActive("/admin/integrations")
              ? "bg-primary/10 text-primary border border-primary/30"
              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground",
            collapsed && "justify-center px-2"
          )}
        >
          <Link2 className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Integraciones</span>}
        </NavLink>

        {/* Configuración */}
        <NavLink
          to="/admin/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
            isActive("/admin/settings")
              ? "bg-primary/10 text-primary border border-primary/30"
              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground",
            collapsed && "justify-center px-2"
          )}
        >
          <Settings className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Configuración</span>}
        </NavLink>
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
          onClick={handleLogout}
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
