import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  Plus, 
  Edit, 
  Trash2, 
  Users,
  Gift,
  Trophy,
  Clock,
  CheckCircle2
} from "lucide-react";

const milestonesData = [
  {
    id: 1,
    name: "TOP SELLER MARZO",
    description: "Vende 150 tickets durante el mes de Marzo",
    icon: "🔥",
    ticketsRequired: 150,
    levelMin: 1,
    rewardType: "bonus",
    rewardValue: 100000,
    rewardDescription: "$100,000 COP + 2 boletas VIP",
    status: "active",
    endDate: "2026-03-31",
    participants: 23,
    completed: 8
  },
  {
    id: 2,
    name: "SORTEO PREMIUM",
    description: "Vende 50 tickets para participar en el sorteo",
    icon: "🎟️",
    ticketsRequired: 50,
    levelMin: 1,
    rewardType: "raffle",
    rewardValue: 0,
    rewardDescription: "Entrada al sorteo iPhone 15",
    status: "active",
    endDate: "2026-02-15",
    participants: 45,
    completed: 12
  },
  {
    id: 3,
    name: "PROMOTOR ESTRELLA",
    description: "Mantén 10 ventas semanales por 4 semanas",
    icon: "⭐",
    ticketsRequired: 40,
    levelMin: 1,
    rewardType: "bonus",
    rewardValue: 50000,
    rewardDescription: "Bono de $50,000 COP",
    status: "active",
    endDate: "2026-02-28",
    participants: 18,
    completed: 5
  },
  {
    id: 4,
    name: "LÍDER DE EQUIPO",
    description: "Tu equipo alcanza 500 ventas en el mes",
    icon: "👑",
    ticketsRequired: 500,
    levelMin: 2,
    rewardType: "bonus",
    rewardValue: 200000,
    rewardDescription: "Bono de $200,000 COP",
    status: "active",
    endDate: "2026-02-28",
    participants: 8,
    completed: 2
  }
];

export default function AdminMilestones() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <DashboardLayout 
      title="Gestión de Hitos" 
      subtitle="Configura metas y recompensas para tu equipo"
      userLevel={4}
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card variant="glass" className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Hitos Activos</p>
                <p className="text-2xl font-bold font-display">{milestonesData.length}</p>
              </div>
            </div>
          </Card>
          <Card variant="glass" className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/20">
                <Users className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Participantes</p>
                <p className="text-2xl font-bold font-display">
                  {milestonesData.reduce((sum, m) => sum + m.participants, 0)}
                </p>
              </div>
            </div>
          </Card>
          <Card variant="glass" className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/20">
                <Trophy className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completados</p>
                <p className="text-2xl font-bold font-display">
                  {milestonesData.reduce((sum, m) => sum + m.completed, 0)}
                </p>
              </div>
            </div>
          </Card>
          <Card variant="glass" className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/20">
                <Gift className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Bonos Totales</p>
                <p className="text-2xl font-bold font-display">
                  ${(milestonesData.reduce((sum, m) => sum + m.rewardValue * m.completed, 0) / 1000).toFixed(0)}k
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-end">
          <Button variant="party" className="gap-2" onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4" />
            Crear Nuevo Hito
          </Button>
        </div>

        {/* Milestones List */}
        <div className="space-y-4">
          {milestonesData.map((milestone, index) => (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card variant="glass" className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{milestone.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold">{milestone.name}</h3>
                      <p className="text-muted-foreground">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="success">Activo</Badge>
                    <Button variant="ghost" size="icon">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-card-elevated">
                    <p className="text-xs text-muted-foreground mb-1">Tickets Requeridos</p>
                    <p className="font-bold text-lg">{milestone.ticketsRequired}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-card-elevated">
                    <p className="text-xs text-muted-foreground mb-1">Nivel Mínimo</p>
                    <p className="font-bold text-lg">
                      {milestone.levelMin === 1 ? "Común" : milestone.levelMin === 2 ? "Cabeza" : "Sub Socio"}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-card-elevated">
                    <p className="text-xs text-muted-foreground mb-1">Participantes</p>
                    <p className="font-bold text-lg">{milestone.participants}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-card-elevated">
                    <p className="text-xs text-muted-foreground mb-1">Completados</p>
                    <p className="font-bold text-lg text-success">{milestone.completed}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-card-elevated">
                    <p className="text-xs text-muted-foreground mb-1">Finaliza</p>
                    <p className="font-bold text-lg">{milestone.endDate}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="flex items-center gap-2">
                    <Gift className="w-5 h-5 text-primary" />
                    <span className="font-medium">{milestone.rewardDescription}</span>
                  </div>
                  <Button variant="outline" size="sm">Ver Participantes</Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <Card variant="glass" className="p-6">
                <h2 className="text-xl font-bold mb-6">Crear Nuevo Hito</h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">
                        Nombre del Hito
                      </label>
                      <Input placeholder="Ej: TOP SELLER MARZO" />
                    </div>
                    
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">
                        Descripción
                      </label>
                      <Input placeholder="Ej: Vende 150 tickets durante el mes" />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">
                        Emoji/Icon
                      </label>
                      <Input placeholder="🔥" />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">
                        Tickets Requeridos
                      </label>
                      <Input type="number" placeholder="150" />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">
                        Nivel Mínimo
                      </label>
                      <select className="w-full p-3 rounded-lg bg-card border border-border text-foreground">
                        <option value="1">Promotor Común</option>
                        <option value="2">Promotor Cabeza</option>
                        <option value="3">Sub Socio</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">
                        Fecha Límite
                      </label>
                      <Input type="date" />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">
                        Tipo de Recompensa
                      </label>
                      <select className="w-full p-3 rounded-lg bg-card border border-border text-foreground">
                        <option value="bonus">Bono Económico</option>
                        <option value="raffle">Entrada a Sorteo</option>
                        <option value="tickets">Boletas Gratis</option>
                        <option value="level_up">Subida de Nivel</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">
                        Valor del Bono (COP)
                      </label>
                      <Input type="number" placeholder="100000" />
                    </div>

                    <div className="col-span-2">
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">
                        Descripción de la Recompensa
                      </label>
                      <Input placeholder="Ej: $100,000 COP + 2 boletas VIP" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button variant="outline" className="flex-1" onClick={() => setShowCreateModal(false)}>
                    Cancelar
                  </Button>
                  <Button variant="party" className="flex-1" onClick={() => setShowCreateModal(false)}>
                    Crear Hito
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
