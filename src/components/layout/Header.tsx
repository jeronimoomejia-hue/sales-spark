import { motion } from "framer-motion";
import { Search, Bell, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EventSelector } from "@/components/ui/event-selector";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  title: string;
  subtitle?: string;
  showEventSelector?: boolean;
  selectedEventId?: string | 'all';
  onEventChange?: (eventId: string | 'all') => void;
}

const notifications = [
  { id: 1, title: "Nueva venta registrada", message: "Ticket VIP - Neon Festival", time: "Hace 5 min", read: false },
  { id: 2, title: "Hito casi completado", message: "Te faltan 5 tickets para el sorteo", time: "Hace 1 hora", read: false },
  { id: 3, title: "Cierre aprobado", message: "Tu cierre del período anterior fue aprobado", time: "Hace 2 horas", read: true },
];

export function Header({ 
  title, 
  subtitle, 
  showEventSelector = true,
  selectedEventId = 'all',
  onEventChange 
}: HeaderProps) {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-16 border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-40 flex items-center justify-between px-6"
    >
      <div>
        <h1 className="text-xl font-semibold font-display">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar..."
            className="w-64 pl-10 bg-card border-border"
          />
        </div>

        {/* Event Selector */}
        {showEventSelector && onEventChange && (
          <EventSelector
            selectedEventId={selectedEventId}
            onEventChange={onEventChange}
          />
        )}

        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0 bg-card border-border" align="end">
            <div className="p-3 border-b border-border flex items-center justify-between">
              <h4 className="font-semibold">Notificaciones</h4>
              <Badge variant="secondary">{unreadCount} nuevas</Badge>
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {notifications.map((notif) => (
                <div 
                  key={notif.id}
                  className={`p-3 border-b border-border/50 hover:bg-card-elevated transition-colors cursor-pointer ${
                    !notif.read ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {!notif.read && (
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{notif.title}</p>
                      <p className="text-sm text-muted-foreground truncate">{notif.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-2 border-t border-border">
              <Button variant="ghost" className="w-full" size="sm">
                Ver todas las notificaciones
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* User Avatar */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium">Juan Pérez</p>
            <p className="text-xs text-muted-foreground">PROMO-12345</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-party flex items-center justify-center text-white font-semibold text-sm">
            JP
          </div>
        </div>
      </div>
    </motion.header>
  );
}
