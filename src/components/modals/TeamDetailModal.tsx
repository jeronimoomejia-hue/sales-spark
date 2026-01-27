import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  TrendingUp, 
  TicketIcon,
  Trophy,
  Eye,
  UserPlus
} from "lucide-react";
import { TeamMember, getTotalSales } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface TeamDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member?: TeamMember;
  title?: string;
}

const levelColors: Record<number, string> = {
  1: "bg-neon-blue/20 text-neon-blue border-neon-blue/30",
  2: "bg-neon-orange/20 text-neon-orange border-neon-orange/30",
  3: "bg-neon-pink/20 text-neon-pink border-neon-pink/30",
  4: "bg-gradient-party text-white",
};

export function TeamDetailModal({ 
  open, 
  onOpenChange, 
  member,
  title = "Detalle del Equipo"
}: TeamDetailModalProps) {
  if (!member) return null;

  const totalSales = getTotalSales(member, 'month');
  const teamMembers = member.children || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            {title}
          </DialogTitle>
        </DialogHeader>

        {/* Member Header */}
        <div className="flex items-center gap-4 p-4 rounded-lg bg-card-elevated">
          <div className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold",
            levelColors[member.level]
          )}>
            {member.avatar}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold">{member.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className={cn("border", levelColors[member.level])}>
                {member.levelName}
              </Badge>
              {member.teamSize && (
                <span className="text-sm text-muted-foreground">
                  {member.teamSize} personas en equipo
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Ventas Totales (Mes)</p>
            <p className="text-3xl font-bold font-display text-gradient-party">{totalSales}</p>
          </div>
        </div>

        {/* Sales Breakdown */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-card-elevated">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Ventas Propias</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Hoy</p>
                <p className="text-xl font-bold">{member.ownSales.today}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Semana</p>
                <p className="text-xl font-bold">{member.ownSales.week}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Mes</p>
                <p className="text-xl font-bold text-primary">{member.ownSales.month}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-xl font-bold">{member.ownSales.total}</p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-card-elevated">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Ventas del Equipo</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Hoy</p>
                <p className="text-xl font-bold">{member.teamSales.today}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Semana</p>
                <p className="text-xl font-bold">{member.teamSales.week}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Mes</p>
                <p className="text-xl font-bold text-success">{member.teamSales.month}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-xl font-bold">{member.teamSales.total}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Members */}
        {teamMembers.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Miembros del Equipo ({teamMembers.length})
            </h4>
            <div className="max-h-[250px] overflow-y-auto space-y-2">
              {teamMembers.map((child, index) => (
                <motion.div
                  key={child.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-card-elevated hover:border-primary/30 border border-transparent transition-all"
                >
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold",
                    levelColors[child.level]
                  )}>
                    {child.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{child.name}</p>
                    <Badge variant="outline" className={cn("text-xs border", levelColors[child.level])}>
                      {child.levelName}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{getTotalSales(child, 'month')} ventas</p>
                    <p className="text-xs text-muted-foreground">este mes</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="outline" className="gap-2">
            <UserPlus className="w-4 h-4" />
            Agregar Miembro
          </Button>
          <Button variant="party" className="gap-2">
            <Eye className="w-4 h-4" />
            Ver Historial Completo
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
