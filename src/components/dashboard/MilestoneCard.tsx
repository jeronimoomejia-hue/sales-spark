import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, Trophy, Gift, Rocket, ChevronRight, Eye, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { MilestoneDetailModal } from "@/components/modals/MilestoneDetailModal";

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
  const [selectedMilestone, setSelectedMilestone] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const handleSeeMore = (milestone: Milestone) => {
    setSelectedMilestone({
      id: parseInt(milestone.id),
      name: milestone.name,
      description: milestone.description,
      icon: milestone.icon === 'fire' ? '🔥' : milestone.icon === 'ticket' ? '🎟️' : milestone.icon === 'star' ? '⭐' : '🚀',
      progress: milestone.currentProgress,
      target: milestone.target,
      reward: milestone.reward,
      rewardType: 'bonus',
      daysLeft: milestone.daysLeft || 30,
      color: 'from-purple-500 to-pink-500'
    });
    setShowModal(true);
  };

  return (
    <>
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
            <Button variant="ghost" size="sm" className="gap-1 text-primary" onClick={() => setShowModal(true)}>
              Ver todos
              <ChevronRight className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {milestones.map((milestone, index) => {
              const Icon = iconMap[milestone.icon];
              const percentage = Math.round((milestone.currentProgress / milestone.target) * 100);
              const isNearComplete = percentage >= 80;
              
              return (
                <motion.div
                  key={milestone.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                  className="p-4 rounded-xl bg-card-elevated border border-border hover:border-primary/30 transition-all duration-200 group cursor-pointer"
                  onClick={() => handleSeeMore(milestone)}
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
                          <Badge variant="outline" className="shrink-0 ml-2 gap-1">
                            <Clock className="w-3 h-3" />
                            {milestone.daysLeft}d
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">{milestone.description}</p>
                      <div className="space-y-2">
                        <Progress
                          value={percentage}
                          size="sm"
                          indicatorColor={isNearComplete ? "success" : progressColors[milestone.icon]}
                          className="bg-secondary/50"
                        />
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            {milestone.currentProgress}/{milestone.target} tickets
                          </span>
                          <span className={cn("font-medium", isNearComplete ? "text-success" : "text-primary")}>
                            {percentage}%
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-success">🎁 {milestone.reward}</p>
                        <Button variant="ghost" size="sm" className="h-6 text-xs gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Eye className="w-3 h-3" />
                          Ver más
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>

      <MilestoneDetailModal
        open={showModal}
        onOpenChange={setShowModal}
        milestone={selectedMilestone}
      />
    </>
  );
}
