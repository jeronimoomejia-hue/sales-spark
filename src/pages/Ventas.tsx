import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { EventSelector } from "@/components/ui/event-selector";
import { SalesDetailModal } from "@/components/modals/SalesDetailModal";
import { 
  Search, 
  Filter, 
  Download, 
  Calendar,
  TicketIcon,
  TrendingUp,
  Eye
} from "lucide-react";
import { salesData, events, currentUsers } from "@/data/mockData";

const user = currentUsers.promotorComun;

const getTypeBadgeColor = (type: string) => {
  switch (type) {
    case "vip": return "warning";
    case "palco": return "default";
    default: return "secondary";
  }
};

const getStatusBadge = (status: string) => {
  return status === "confirmed" ? (
    <Badge variant="success">Confirmada</Badge>
  ) : (
    <Badge variant="warning">Pendiente</Badge>
  );
};

export default function Ventas() {
  const [selectedEventId, setSelectedEventId] = useState<string | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState("");
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Filter sales by event and search term
  const filteredSales = salesData.filter(sale => {
    const matchesEvent = selectedEventId === 'all' || sale.eventId === selectedEventId;
    const matchesSearch = sale.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sale.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sale.sellerName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesEvent && matchesSearch;
  });

  // Calculate stats for selected event
  const getStats = () => {
    if (selectedEventId === 'all') {
      return {
        total: user.ownSales.total,
        month: user.ownSales.month,
        week: user.ownSales.week,
        today: user.ownSales.today
      };
    }
    const eventSales = user.salesByEvent[selectedEventId];
    if (!eventSales) return { total: 0, month: 0, week: 0, today: 0 };
    return {
      total: eventSales.ownSales,
      month: eventSales.ownSales,
      week: Math.floor(eventSales.ownSales * 0.3),
      today: Math.floor(eventSales.ownSales * 0.05)
    };
  };

  const stats = getStats();
  const selectedEvent = selectedEventId === 'all' ? null : events.find(e => e.id === selectedEventId);

  return (
    <DashboardLayout 
      title="Mis Ventas" 
      subtitle="Historial completo de tus ventas"
      userLevel={1}
      selectedEventId={selectedEventId}
      onEventChange={setSelectedEventId}
    >
      <div className="space-y-6">
        {/* Event Filter Banner */}
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <TicketIcon className="w-5 h-5 text-primary" />
              <span className="font-medium">Filtrando por: <span className="text-primary">{selectedEvent.name}</span></span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSelectedEventId('all')}>
              Limpiar filtro
            </Button>
          </motion.div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card variant="glass" className="p-4 cursor-pointer hover:border-primary/30 transition-all" onClick={() => setShowDetailModal(true)}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <TicketIcon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Total Ventas</p>
                <p className="text-2xl font-bold font-display">{stats.total}</p>
              </div>
              <Eye className="w-4 h-4 text-muted-foreground" />
            </div>
          </Card>
          <Card variant="glass" className="p-4 cursor-pointer hover:border-primary/30 transition-all" onClick={() => setShowDetailModal(true)}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/20">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Este Período</p>
                <p className="text-2xl font-bold font-display">{stats.month}</p>
              </div>
              <Eye className="w-4 h-4 text-muted-foreground" />
            </div>
          </Card>
          <Card variant="glass" className="p-4 cursor-pointer hover:border-primary/30 transition-all" onClick={() => setShowDetailModal(true)}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/20">
                <Calendar className="w-5 h-5 text-warning" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Esta Semana</p>
                <p className="text-2xl font-bold font-display">{stats.week}</p>
              </div>
              <Eye className="w-4 h-4 text-muted-foreground" />
            </div>
          </Card>
          <Card variant="glass" className="p-4 cursor-pointer hover:border-primary/30 transition-all" onClick={() => setShowDetailModal(true)}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/20">
                <TicketIcon className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Hoy</p>
                <p className="text-2xl font-bold font-display">{stats.today}</p>
              </div>
              <Eye className="w-4 h-4 text-muted-foreground" />
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card variant="glass" className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar por evento, ID..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <EventSelector
              selectedEventId={selectedEventId}
              onEventChange={setSelectedEventId}
            />
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filtros
            </Button>
            <Button variant="party" className="gap-2">
              <Download className="w-4 h-4" />
              Exportar
            </Button>
          </div>
        </Card>

        {/* Sales Table */}
        <Card variant="glass" className="overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold">Historial de Ventas</h3>
            <Button variant="ghost" size="sm" className="gap-1" onClick={() => setShowDetailModal(true)}>
              <Eye className="w-4 h-4" />
              Ver más
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-card-elevated">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">ID</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Evento</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Tipo</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Precio</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Comisión</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Fecha</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Estado</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.slice(0, 10).map((sale, index) => (
                  <motion.tr
                    key={sale.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="border-b border-border/50 hover:bg-card-elevated/50 transition-colors cursor-pointer"
                    onClick={() => setShowDetailModal(true)}
                  >
                    <td className="p-4 font-mono text-sm text-primary">{sale.id}</td>
                    <td className="p-4 font-medium">{sale.eventName}</td>
                    <td className="p-4">
                      <Badge variant={getTypeBadgeColor(sale.ticketType)} className="capitalize">{sale.ticketType}</Badge>
                    </td>
                    <td className="p-4 font-medium">${sale.price.toLocaleString()}</td>
                    <td className="p-4 text-success font-medium">${sale.commission.toLocaleString()}</td>
                    <td className="p-4 text-muted-foreground text-sm">{sale.date}</td>
                    <td className="p-4">{getStatusBadge(sale.status)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-border flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Mostrando {Math.min(10, filteredSales.length)} de {filteredSales.length} ventas</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Anterior</Button>
              <Button variant="outline" size="sm">1</Button>
              <Button variant="party" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <Button variant="outline" size="sm">Siguiente</Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Sales Detail Modal */}
      <SalesDetailModal
        open={showDetailModal}
        onOpenChange={setShowDetailModal}
        title="Detalle Completo de Ventas"
        filterEventId={selectedEventId}
      />
    </DashboardLayout>
  );
}
