import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MilestoneDetailModal } from "@/components/modals/MilestoneDetailModal";
import { 
  Target, 
  Trophy, 
  Gift, 
  Clock, 
  CheckCircle2,
  Flame,
  Zap,
  Eye
} from "lucide-react";

const activeMilestones = [
  {
    id: 1,
    name: "TOP SELLER MARZO",
    description: "Vende 150 tickets durante el mes de Marzo",
    icon: "🔥",
    progress: 127,
    target: 150,
    reward: "$100,000 COP + 2 boletas VIP",
    rewardType: "bonus",
    daysLeft: 12,
    color: "from-orange-500 to-red-500"
  },
  {
    id: 2,
    name: "SORTEO PREMIUM",
    description: "Vende 50 tickets para participar en el sorteo",
    icon: "🎟️",
    progress: 45,
    target: 50,
    reward: "Entrada al sorteo iPhone 15",
    rewardType: "raffle",
    daysLeft: 5,
    color: "from-purple-500 to-pink-500"
  },
  {
    id: 3,
    name: "PROMOTOR ESTRELLA",
    description: "Mantén 10 ventas semanales por 4 semanas",
    icon: "⭐",
    progress: 3,
    target: 4,
    reward: "Bono de $50,000 COP",
    rewardType: "bonus",
    daysLeft: 21,
    color: "from-yellow-500 to-orange-500"
  },
  {
    id: 4,
    name: "ASCENSO A CABEZA",
    description: "Vende 120 tickets este mes para subir de nivel",
    icon: "🆙",
    progress: 45,
    target: 120,
    reward: "Promoción a Promotor Cabeza",
    rewardType: "level_up",
    daysLeft: 30,
    color: "from-blue-500 to-cyan-500"
  }
];

const completedMilestones = [
  {
    id: 5,
    name: "PRIMERA VENTA",
    description: "Completa tu primera venta en la plataforma",
    reward: "Bono de bienvenida $25,000 COP",
    completedDate: "2026-01-15",
    claimed: true
  },
  {
    id: 6,
    name: "DECENA DORADA",
    description: "Alcanza 10 ventas en una semana",
    reward: "2 boletas General gratis",
    completedDate: "2026-01-20",
    claimed: true
  },
  {
    id: 7,
    name: "RACHA DE FUEGO",
    description: "5 ventas en un solo día",
    reward: "Badge especial + $15,000 COP",
    completedDate: "2026-01-25",
    claimed: false
  }
];

export default function Hitos() {
  const [selectedMilestone, setSelectedMilestone] = useState<typeof activeMilestones[0] | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Get user level from sessionStorage
  const [userLevel, setUserLevel] = useState<number>(1);
  
  useEffect(() => {
    const storedLevel = sessionStorage.getItem("demoUserLevel");
    if (storedLevel) {
      setUserLevel(parseInt(storedLevel));
    }
  }, []);

  const handleViewMilestone = (milestone: typeof activeMilestones[0]) => {
    setSelectedMilestone(milestone);
    setShowDetailModal(true);
  };

  return (
    <DashboardLayout 
      title="Hitos y Recompensas" 
      subtitle="Tu progreso hacia las metas"
      userLevel={userLevel}
    >
      <div className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card variant="glass" className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Hitos Activos</p>
                <p className="text-2xl font-bold font-display">4</p>
              </div>
            </div>
          </Card>
          <Card variant="glass" className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/20">
                <Trophy className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completados</p>
                <p className="text-2xl font-bold font-display">7</p>
              </div>
            </div>
          </Card>
          <Card variant="glass" className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/20">
                <Gift className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Premios Ganados</p>
                <p className="text-2xl font-bold font-display">$190k</p>
              </div>
            </div>
          </Card>
          <Card variant="glass" className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/20">
                <Flame className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Por Reclamar</p>
                <p className="text-2xl font-bold font-display">1</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Active Milestones */}
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Hitos Activos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeMilestones.map((milestone, index) => (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card variant="glass" className="p-5 hover:border-primary/30 transition-all cursor-pointer" onClick={() => handleViewMilestone(milestone)}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{milestone.icon}</span>
                      <div>
                        <h3 className="font-bold text-lg">{milestone.name}</h3>
                        <p className="text-sm text-muted-foreground">{milestone.description}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="gap-1">
                      <Clock className="w-3 h-3" />
                      {milestone.daysLeft} días
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progreso</span>
                      <span className="font-medium text-primary">
                        {milestone.progress}/{milestone.target}
                      </span>
                    </div>
                    <Progress 
                      value={(milestone.progress / milestone.target) * 100} 
                      size="default"
                      indicatorColor="party"
                    />
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Gift className="w-4 h-4 text-warning" />
                        <span className="text-muted-foreground">{milestone.reward}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="gap-1" onClick={(e) => { e.stopPropagation(); handleViewMilestone(milestone); }}>
                          <Eye className="w-3 h-3" />
                          Ver más
                        </Button>
                        {milestone.progress >= milestone.target && (
                          <Button variant="party" size="sm" onClick={(e) => e.stopPropagation()}>Reclamar</Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Completed Milestones */}
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-success" />
            Hitos Completados
          </h2>
          <div className="space-y-3">
            {completedMilestones.map((milestone, index) => (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card variant="default" className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-full bg-success/20">
                        <CheckCircle2 className="w-5 h-5 text-success" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{milestone.name}</h3>
                        <p className="text-sm text-muted-foreground">{milestone.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{milestone.reward}</p>
                        <p className="text-xs text-muted-foreground">Completado: {milestone.completedDate}</p>
                      </div>
                      {milestone.claimed ? (
                        <Badge variant="success">Reclamado</Badge>
                      ) : (
                        <Button variant="party" size="sm">Reclamar</Button>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Milestone Detail Modal */}
      <MilestoneDetailModal
        open={showDetailModal}
        onOpenChange={setShowDetailModal}
        milestone={selectedMilestone ? {
          id: selectedMilestone.id,
          name: selectedMilestone.name,
          description: selectedMilestone.description,
          icon: selectedMilestone.icon,
          progress: selectedMilestone.progress,
          target: selectedMilestone.target,
          reward: selectedMilestone.reward,
          rewardType: selectedMilestone.rewardType,
          daysLeft: selectedMilestone.daysLeft,
          color: selectedMilestone.color
        } : undefined}
      />
    </DashboardLayout>
  );
}
