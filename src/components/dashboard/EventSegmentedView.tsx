import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Ticket, 
  TrendingUp, 
  Users, 
  Eye,
  ChevronRight,
  Calendar,
  MapPin,
  Clock,
  Target,
  Flame,
  Trophy,
  DollarSign,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";
import { events as mockEvents } from "@/data/mockData";
import { PaymentLinkPreview } from "@/components/dashboard/PaymentLinkPreview";

interface EventSegmentedViewProps {
  userLevel: 1 | 2 | 3 | 4;
  onEventSelect: (eventId: string) => void;
  selectedEventId: string | 'all';
  onViewEventDetails: (eventId: string) => void;
}

interface EventCardData {
  id: string;
  name: string;
  date: string;
  venue: string;
  ownSales: number;
  teamSales: number;
  goal: number;
  commission: number;
  status: 'active' | 'upcoming' | 'closed';
  daysLeft: number;
  ranking: number;
  isHot?: boolean;
}

const getEventData = (userLevel: number): EventCardData[] => {
  return mockEvents.map((event, index) => ({
    id: event.id,
    name: event.name,
    date: event.date,
    venue: event.venue,
    ownSales: Math.floor(Math.random() * 50) + 10,
    teamSales: userLevel >= 2 ? Math.floor(Math.random() * 150) + 50 : 0,
    goal: userLevel === 1 ? 30 : userLevel === 2 ? 80 : userLevel === 3 ? 150 : 300,
    commission: (Math.floor(Math.random() * 50) + 10) * (event.commissionsByLevel[userLevel] || 7500),
    status: index === 0 ? 'active' : index === 1 ? 'active' : 'upcoming',
    daysLeft: Math.floor(Math.random() * 15) + 1,
    ranking: Math.floor(Math.random() * 20) + 1,
    isHot: index === 0,
  }));
};

export function EventSegmentedView({
  userLevel,
  onEventSelect,
  selectedEventId,
  onViewEventDetails,
}: EventSegmentedViewProps) {
  const [activeTab, setActiveTab] = useState<'active' | 'upcoming' | 'all'>('active');
  const eventData = getEventData(userLevel);
  const hasTeam = userLevel >= 2;

  const filteredEvents = eventData.filter(e => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return e.status === 'active';
    return e.status === 'upcoming';
  });

  // Calculate totals
  const totalOwnSales = eventData.reduce((sum, e) => sum + e.ownSales, 0);
  const totalTeamSales = eventData.reduce((sum, e) => sum + e.teamSales, 0);
  const totalCommission = eventData.reduce((sum, e) => sum + e.commission, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-party">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display">Mis Eventos</h2>
            <p className="text-sm text-muted-foreground">
              {eventData.filter(e => e.status === 'active').length} activos • {totalOwnSales} ventas propias
              {hasTeam && ` • ${totalTeamSales} ventas equipo`}
            </p>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card variant="glass" className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Ticket className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Mis Ventas (Todos)</span>
          </div>
          <p className="text-2xl font-bold">{totalOwnSales}</p>
        </Card>
        {hasTeam && (
          <Card variant="glass" className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-neon-blue" />
              <span className="text-xs text-muted-foreground">Equipo (Todos)</span>
            </div>
            <p className="text-2xl font-bold">{totalTeamSales}</p>
          </Card>
        )}
        <Card variant="glass" className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-success" />
            <span className="text-xs text-muted-foreground">Comisión Total</span>
          </div>
          <p className="text-2xl font-bold">${(totalCommission / 1000000).toFixed(1)}M</p>
        </Card>
        <Card variant="glass" className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-warning" />
            <span className="text-xs text-muted-foreground">Eventos Activos</span>
          </div>
          <p className="text-2xl font-bold">{eventData.filter(e => e.status === 'active').length}</p>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList>
          <TabsTrigger value="active" className="gap-2">
            <Flame className="w-4 h-4" />
            Activos ({eventData.filter(e => e.status === 'active').length})
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="gap-2">
            <Clock className="w-4 h-4" />
            Próximos ({eventData.filter(e => e.status === 'upcoming').length})
          </TabsTrigger>
          <TabsTrigger value="all" className="gap-2">
            <Calendar className="w-4 h-4" />
            Todos ({eventData.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card 
                  variant="neon" 
                  className={cn(
                    "p-5 cursor-pointer transition-all hover:scale-[1.02] relative overflow-hidden group",
                    selectedEventId === event.id && "ring-2 ring-primary",
                    event.isHot && "border-neon-orange/50"
                  )}
                  onClick={() => onEventSelect(event.id)}
                >
                  {/* Hot Badge */}
                  {event.isHot && (
                    <Badge 
                      variant="secondary" 
                      className="absolute top-3 right-3 bg-neon-orange/20 text-neon-orange border-neon-orange/30"
                    >
                      <Flame className="w-3 h-3 mr-1" />
                      Hot
                    </Badge>
                  )}

                  {/* Event Info */}
                  <div className="mb-4">
                    <h3 className="font-bold text-lg mb-1">{event.name}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {event.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {event.venue}
                      </span>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-card-elevated">
                      <p className="text-xs text-muted-foreground">Mis Ventas</p>
                      <p className="text-xl font-bold text-primary">{event.ownSales}</p>
                    </div>
                    {hasTeam && (
                      <div className="p-2 rounded-lg bg-card-elevated">
                        <p className="text-xs text-muted-foreground">Mi Equipo</p>
                        <p className="text-xl font-bold text-neon-blue">{event.teamSales}</p>
                      </div>
                    )}
                    {!hasTeam && (
                      <div className="p-2 rounded-lg bg-card-elevated">
                        <p className="text-xs text-muted-foreground">Comisión</p>
                        <p className="text-xl font-bold text-success">${(event.commission / 1000).toFixed(0)}K</p>
                      </div>
                    )}
                  </div>

                  {/* Goal Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Meta del evento</span>
                      <span className="font-medium">{event.ownSales}/{event.goal}</span>
                    </div>
                    <Progress 
                      value={(event.ownSales / event.goal) * 100} 
                      className="h-2"
                    />
                  </div>

                  {/* Ticket Types Mini Table */}
                  <div className="mb-3 space-y-1">
                    <p className="text-xs text-muted-foreground font-medium mb-1">Precios de boleta:</p>
                    {mockEvents.find(e => e.id === event.id)?.ticketTypes.map((t) => (
                      <div key={t.id} className="flex items-center justify-between text-xs px-2 py-1 rounded bg-card-elevated">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }} />
                          <span>{t.name}</span>
                        </div>
                        <span className="font-semibold">${t.price.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex items-center gap-1 text-xs text-primary mt-1">
                      <DollarSign className="w-3 h-3" />
                      <span>Mi comisión: ${(mockEvents.find(e => e.id === event.id)?.commissionsByLevel[userLevel] || 0).toLocaleString()}/ticket</span>
                    </div>
                  </div>

                  {/* Payment Link Preview */}
                  <PaymentLinkPreview
                    event={mockEvents.find(e => e.id === event.id)!}
                    sellerId="promo-1"
                  />

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        <Trophy className="w-3 h-3 mr-1" />
                        #{event.ranking}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {event.daysLeft} días restantes
                      </span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="gap-1 text-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewEventDetails(event.id);
                      }}
                    >
                      <Eye className="w-3 h-3" />
                      Ver más
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
