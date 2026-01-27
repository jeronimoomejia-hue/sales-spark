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
  Target, 
  Gift, 
  Clock,
  Trophy,
  Users,
  TrendingUp,
  Calendar
} from "lucide-react";

interface Milestone {
  id: number;
  name: string;
  description: string;
  icon: string;
  progress: number;
  target: number;
  reward: string;
  rewardType: string;
  daysLeft: number;
  color: string;
  participants?: number;
  completedBy?: number;
}

interface MilestoneDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  milestone?: Milestone;
}

// Top participants mock data
const topParticipants = [
  { id: 1, name: "Carlos Ruiz", avatar: "CR", progress: 142, rank: 1 },
  { id: 2, name: "Ana Torres", avatar: "AT", progress: 128, rank: 2 },
  { id: 3, name: "Luis Gómez", avatar: "LG", progress: 115, rank: 3 },
  { id: 4, name: "María López", avatar: "ML", progress: 98, rank: 4 },
  { id: 5, name: "Pedro Díaz", avatar: "PD", progress: 87, rank: 5 },
];

export function MilestoneDetailModal({ 
  open, 
  onOpenChange, 
  milestone 
}: MilestoneDetailModalProps) {
  if (!milestone) return null;

  const progressPercent = (milestone.progress / milestone.target) * 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Detalle del Hito
          </DialogTitle>
        </DialogHeader>

        {/* Milestone Header */}
        <div className="p-6 rounded-xl bg-gradient-to-br from-card-elevated to-card border border-border">
          <div className="flex items-start gap-4">
            <span className="text-5xl">{milestone.icon}</span>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">{milestone.name}</h3>
              <p className="text-muted-foreground">{milestone.description}</p>
              <div className="flex items-center gap-4 mt-3">
                <Badge variant="outline" className="gap-1">
                  <Clock className="w-3 h-3" />
                  {milestone.daysLeft} días restantes
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <Users className="w-3 h-3" />
                  45 participantes
                </Badge>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Tu progreso</span>
              <span className="font-bold text-primary">
                {milestone.progress} / {milestone.target}
              </span>
            </div>
            <Progress 
              value={progressPercent} 
              size="lg"
              indicatorColor="party"
            />
          </div>

          {/* Reward */}
          <div className="mt-6 p-4 rounded-lg bg-success/10 border border-success/20">
            <div className="flex items-center gap-3">
              <Gift className="w-6 h-6 text-success" />
              <div>
                <p className="text-sm font-medium text-success">Recompensa</p>
                <p className="text-lg font-bold">{milestone.reward}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-warning" />
            Top Participantes
          </h4>
          <div className="space-y-2">
            {topParticipants.map((participant, index) => (
              <motion.div
                key={participant.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-card-elevated"
              >
                <div className="w-8 h-8 flex items-center justify-center font-bold">
                  {participant.rank === 1 && "🥇"}
                  {participant.rank === 2 && "🥈"}
                  {participant.rank === 3 && "🥉"}
                  {participant.rank > 3 && (
                    <span className="text-muted-foreground">{participant.rank}</span>
                  )}
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-party flex items-center justify-center text-white text-sm font-bold">
                  {participant.avatar}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{participant.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{participant.progress}</p>
                  <p className="text-xs text-muted-foreground">tickets</p>
                </div>
                <Progress 
                  value={(participant.progress / milestone.target) * 100} 
                  className="w-24"
                  size="sm"
                  indicatorColor={participant.progress >= milestone.target ? "success" : "party"}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="p-4 rounded-lg bg-card-elevated">
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Cronograma
          </h4>
          <div className="flex items-center justify-between text-sm">
            <div>
              <p className="text-muted-foreground">Inicio</p>
              <p className="font-medium">1 Marzo 2026</p>
            </div>
            <div className="flex-1 mx-4 h-1 bg-border rounded-full relative">
              <div 
                className="absolute left-0 top-0 h-full bg-gradient-party rounded-full"
                style={{ width: `${Math.min(100 - (milestone.daysLeft / 30) * 100, 100)}%` }}
              />
            </div>
            <div className="text-right">
              <p className="text-muted-foreground">Fin</p>
              <p className="font-medium">31 Marzo 2026</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          {progressPercent >= 100 ? (
            <Button variant="party" className="gap-2">
              <Gift className="w-4 h-4" />
              Reclamar Recompensa
            </Button>
          ) : (
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cerrar
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
