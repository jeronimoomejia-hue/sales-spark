import { useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  Plus, 
  Trophy,
  Gift,
  Users
} from "lucide-react";
import { events } from "@/data/mockData";

export default function AdminEventMilestones() {
  const { eventId } = useParams();
  const event = events.find(e => e.id === eventId) || events[0];

  const milestones = [
    { id: 1, name: "Primera Venta", target: 1, current: 1, reward: "Badge Especial", status: "completed" },
    { id: 2, name: "10 Tickets", target: 10, current: 10, reward: "$15,000 bonus", status: "completed" },
    { id: 3, name: "25 Tickets", target: 25, current: 18, reward: "$40,000 bonus", status: "in_progress" },
    { id: 4, name: "50 Tickets", target: 50, current: 18, reward: "$100,000 bonus + VIP Pass", status: "locked" },
    { id: 5, name: "Top Seller", target: 100, current: 18, reward: "Viaje + Reconocimiento", status: "locked" },
  ];

  return (
    <DashboardLayout
      title={`Hitos: ${event.name}`}
      subtitle="Configura las metas y recompensas del evento"
      userLevel={4}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge variant={event.status === 'active' ? 'default' : 'secondary'}>
              {event.status === 'active' ? 'Activo' : event.status === 'upcoming' ? 'Próximo' : 'Cerrado'}
            </Badge>
            <span className="text-muted-foreground">{event.date}</span>
          </div>
          <Button variant="party">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Hito
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-success/10">
                <Trophy className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">2</p>
                <p className="text-sm text-muted-foreground">Hitos Completados</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-warning/10">
                <Target className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">1</p>
                <p className="text-sm text-muted-foreground">En Progreso</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Gift className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">$55,000</p>
                <p className="text-sm text-muted-foreground">Bonos Entregados</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Milestones List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Hitos del Evento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {milestones.map((milestone) => (
              <div 
                key={milestone.id} 
                className={`p-4 rounded-lg border ${
                  milestone.status === 'completed' 
                    ? 'bg-success/5 border-success/30' 
                    : milestone.status === 'in_progress'
                    ? 'bg-warning/5 border-warning/30'
                    : 'bg-muted/30 border-border'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      milestone.status === 'completed' 
                        ? 'bg-success text-success-foreground' 
                        : milestone.status === 'in_progress'
                        ? 'bg-warning text-warning-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {milestone.status === 'completed' ? '✓' : milestone.id}
                    </div>
                    <div>
                      <p className="font-semibold">{milestone.name}</p>
                      <p className="text-sm text-muted-foreground">Meta: {milestone.target} tickets</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={
                      milestone.status === 'completed' ? 'default' : 
                      milestone.status === 'in_progress' ? 'secondary' : 'outline'
                    }>
                      {milestone.status === 'completed' ? 'Completado' : 
                       milestone.status === 'in_progress' ? 'En Progreso' : 'Bloqueado'}
                    </Badge>
                    <p className="text-sm text-primary mt-1">{milestone.reward}</p>
                  </div>
                </div>
                {milestone.status !== 'locked' && (
                  <Progress 
                    value={(milestone.current / milestone.target) * 100} 
                    className="h-2" 
                  />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
