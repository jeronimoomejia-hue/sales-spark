import { motion } from "framer-motion";
import { Search, Bell, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  title: string;
  subtitle?: string;
  showEventSelector?: boolean;
}

export function Header({ title, subtitle, showEventSelector = true }: HeaderProps) {
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
        {showEventSelector && (
          <Button variant="outline" className="gap-2 hidden sm:flex">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span>Neon Festival</span>
            <ChevronDown className="w-4 h-4" />
          </Button>
        )}

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
            3
          </span>
        </Button>

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
