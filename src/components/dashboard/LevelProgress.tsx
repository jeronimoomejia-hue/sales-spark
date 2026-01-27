import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Rocket, Star, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface LevelProgressProps {
  currentLevel: number;
  currentLevelName: string;
  nextLevelName: string;
  currentTickets: number;
  requiredTickets: number;
  currentCommission: number;
  nextCommission: number;
}

const levelColors: Record<number, string> = {
  1: "from-neon-blue to-neon-purple",
  2: "from-neon-purple to-neon-pink",
  3: "from-neon-pink to-neon-orange",
  4: "from-neon-orange to-neon-yellow",
};

const levelIcons: Record<number, typeof Star> = {
  1: Users,
  2: TrendingUp,
  3: Rocket,
  4: Star,
};

export function LevelProgress({
  currentLevel,
  currentLevelName,
  nextLevelName,
  currentTickets,
  requiredTickets,
  currentCommission,
  nextCommission,
}: LevelProgressProps) {
  const percentage = Math.min(Math.round((currentTickets / requiredTickets) * 100), 100);
  const remaining = Math.max(requiredTickets - currentTickets, 0);
  const Icon = levelIcons[currentLevel] || Users;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Card variant="neon" className="overflow-hidden">
        <div className={cn("h-1 bg-gradient-to-r", levelColors[currentLevel])} />
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <div className={cn("p-2 rounded-lg bg-gradient-to-br", levelColors[currentLevel])}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg">{currentLevelName}</span>
                <span className="text-sm text-muted-foreground ml-2">Nivel {currentLevel}</span>
              </div>
            </CardTitle>
            <span className="text-sm text-muted-foreground">
              ${currentCommission.toLocaleString("es-CO")}/ticket
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progreso a {nextLevelName}</span>
              <span className="text-sm font-bold text-primary">{percentage}%</span>
            </div>
            <Progress value={percentage} indicatorColor="party" size="lg" className="h-4" />
            <div className="flex items-center justify-between mt-2 text-sm">
              <span className="text-muted-foreground">
                {currentTickets}/{requiredTickets} tickets
              </span>
              {remaining > 0 && (
                <span className="text-primary font-medium">
                  ¡Faltan {remaining} tickets!
                </span>
              )}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-card-elevated border border-primary/20">
            <div className="flex items-center gap-2 text-sm">
              <Rocket className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">Al subir de nivel:</span>
            </div>
            <p className="mt-1 text-success font-semibold">
              Nueva comisión: ${nextCommission.toLocaleString("es-CO")}/ticket
              <span className="text-sm font-normal text-muted-foreground ml-1">
                (+${(nextCommission - currentCommission).toLocaleString("es-CO")})
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
