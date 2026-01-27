import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, Trophy, Gift, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

interface Milestone {
  id: string;
  name: string;
  description: string;
  currentProgress: number;
  target: number;
  reward: string;
  icon: "fire" | "ticket" | "star" | "rocket";
  daysLeft?: number;
}

const iconMap = {
  fire: Target,
  ticket: Gift,
  star: Trophy,
  rocket: Rocket,
};

const iconColors = {
  fire: "text-neon-orange bg-neon-orange/10",
  ticket: "text-neon-pink bg-neon-pink/10",
  star: "text-neon-yellow bg-neon-yellow/10",
  rocket: "text-neon-purple bg-neon-purple/10",
};

const progressColors: Record<string, "purple" | "pink" | "green" | "party"> = {
  fire: "party",
  ticket: "pink",
  star: "party",
  rocket: "purple",
};

interface MilestoneCardProps {
  milestones: Milestone[];
}

export function MilestoneCard({ milestones }: MilestoneCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <Card variant="neon" className="h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Hitos Activos
          </CardTitle>
          <button className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Ver todos →
          </button>
        </CardHeader>
        <CardContent className="space-y-4">
          {milestones.map((milestone, index) => {
            const Icon = iconMap[milestone.icon];
            const percentage = Math.round((milestone.currentProgress / milestone.target) * 100);
            
            return (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                className="p-4 rounded-xl bg-card-elevated border border-border hover:border-primary/30 transition-all duration-200 group"
              >
                <div className="flex items-start gap-3">
                  <div className={cn("p-2 rounded-lg", iconColors[milestone.icon])}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                        {milestone.name}
                      </h4>
                      {milestone.daysLeft && (
                        <span className="text-xs text-muted-foreground shrink-0 ml-2">
                          {milestone.daysLeft} días
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{milestone.description}</p>
                    <div className="space-y-2">
                      <Progress
                        value={percentage}
                        size="sm"
                        indicatorColor={progressColors[milestone.icon]}
                        className="bg-secondary/50"
                      />
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          {milestone.currentProgress}/{milestone.target} tickets
                        </span>
                        <span className="font-medium text-primary">{percentage}%</span>
                      </div>
                    </div>
                    <p className="text-xs text-success mt-2">🎁 {milestone.reward}</p>
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
