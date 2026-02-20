import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TicketIcon,
  Target,
  Zap,
  Trophy,
  TrendingUp,
  Star,
  Shield,
} from "lucide-react";
import { SellerGlobalProfile } from "@/types/seller";
import { cn } from "@/lib/utils";

const levelColors: Record<number, string> = {
  1: "bg-neon-blue/20 text-neon-blue border-neon-blue/30",
  2: "bg-neon-orange/20 text-neon-orange border-neon-orange/30",
  3: "bg-neon-pink/20 text-neon-pink border-neon-pink/30",
  4: "bg-gradient-party text-white",
};

const levelLabels: Record<number, string> = {
  1: "Nivel 1",
  2: "Nivel 2",
  3: "Nivel 3",
  4: "Nivel 4",
};

interface SellerPublicProfileProps {
  seller: SellerGlobalProfile;
  isFreelance?: boolean;
  onInvite?: (sellerId: string) => void;
  alreadyInvited?: boolean;
  alreadyInRoster?: boolean;
  compact?: boolean; // para vista en hover/popover
}

export function SellerPublicProfile({
  seller,
  isFreelance = false,
  onInvite,
  alreadyInvited = false,
  alreadyInRoster = false,
  compact = false,
}: SellerPublicProfileProps) {
  const { globalStats, badges } = seller;

  const successColor =
    globalStats.successRate >= 90
      ? "text-success"
      : globalStats.successRate >= 75
      ? "text-warning"
      : "text-destructive";

  return (
    <motion.div
      initial={compact ? undefined : { opacity: 0, y: 10 }}
      animate={compact ? undefined : { opacity: 1, y: 0 }}
      className={cn("space-y-3", compact && "space-y-2")}
    >
      {/* Identity */}
      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <div
            className={cn(
              "rounded-full flex items-center justify-center font-bold bg-gradient-party text-white",
              compact ? "w-10 h-10 text-sm" : "w-14 h-14 text-lg"
            )}
          >
            {seller.avatar}
          </div>
          {isFreelance && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-neon-blue/20 border border-neon-blue/60 flex items-center justify-center">
              <Zap className="w-3 h-3 text-neon-blue" />
            </div>
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className={cn("font-bold", compact ? "text-sm" : "text-base")}>{seller.name}</p>
            {isFreelance && (
              <Badge className="bg-neon-blue/10 text-neon-blue border-neon-blue/30 text-[10px] h-4">
                Freelance
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] h-4 border",
                levelColors[globalStats.topLevelAchieved]
              )}
            >
              <Shield className="w-2.5 h-2.5 mr-0.5" />
              Máx. {levelLabels[globalStats.topLevelAchieved]}
            </Badge>
          </div>
        </div>
      </div>

      {/* Global Stats */}
      <div className={cn("grid gap-2", compact ? "grid-cols-2" : "grid-cols-2 md:grid-cols-4")}>
        <div className="p-2.5 rounded-xl bg-card-elevated border border-border text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TicketIcon className="w-3 h-3 text-primary" />
          </div>
          <p className="text-lg font-bold font-display">{globalStats.totalTicketsSold.toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground">Tickets totales</p>
        </div>
        <div className="p-2.5 rounded-xl bg-card-elevated border border-border text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Target className="w-3 h-3 text-neon-orange" />
          </div>
          <p className={cn("text-lg font-bold font-display", successColor)}>{globalStats.successRate}%</p>
          <p className="text-[10px] text-muted-foreground">Tasa de éxito</p>
        </div>
        <div className="p-2.5 rounded-xl bg-card-elevated border border-border text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingUp className="w-3 h-3 text-neon-blue" />
          </div>
          <p className="text-lg font-bold font-display">{globalStats.eventsParticipated}</p>
          <p className="text-[10px] text-muted-foreground">Eventos</p>
        </div>
        <div className="p-2.5 rounded-xl bg-card-elevated border border-border text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Star className="w-3 h-3 text-warning" />
          </div>
          <p className="text-lg font-bold font-display">{globalStats.avgTicketsPerEvent}</p>
          <p className="text-[10px] text-muted-foreground">Prom/evento</p>
        </div>
      </div>

      {/* Badges */}
      {badges.length > 0 && (
        <div>
          {!compact && <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1"><Trophy className="w-3 h-3" /> Logros portátiles</p>}
          <div className="flex flex-wrap gap-1.5">
            {badges.map((badge) => (
              <div
                key={badge.id}
                title={badge.description}
                className="flex items-center gap-1 px-2 py-1 rounded-full bg-card-elevated border border-border text-xs"
              >
                <span>{badge.icon}</span>
                <span className={cn("font-medium", badge.color)}>{badge.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Milestones */}
      {!compact && seller.completedMilestones > 0 && (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-warning/10 border border-warning/20 text-sm">
          <Trophy className="w-4 h-4 text-warning" />
          <span className="text-warning font-medium">{seller.completedMilestones} hitos completados</span>
          <span className="text-muted-foreground text-xs">en su historial</span>
        </div>
      )}

      {/* Privacy notice */}
      {!compact && (
        <p className="text-[10px] text-muted-foreground/50 italic text-center">
          Solo se muestran métricas globales anónimas. El historial de promotoras es privado.
        </p>
      )}

      {/* Invite Button */}
      {onInvite && (
        <Button
          variant={alreadyInvited || alreadyInRoster ? "outline" : "party"}
          size={compact ? "sm" : "default"}
          className="w-full"
          disabled={alreadyInvited || alreadyInRoster}
          onClick={() => onInvite(seller.id)}
        >
          {alreadyInRoster
            ? "✅ En la alineación"
            : alreadyInvited
            ? "⏳ Invitación enviada"
            : "📨 Invitar al evento"}
        </Button>
      )}
    </motion.div>
  );
}
