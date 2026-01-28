import { useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Download, 
  TrendingUp,
  Users,
  TicketIcon,
  Calendar
} from "lucide-react";
import { events } from "@/data/mockData";

export default function AdminEventReports() {
  const { eventId } = useParams();
  const event = events.find(e => e.id === eventId) || events[0];

  return (
    <DashboardLayout
      title={`Reportes: ${event.name}`}
      subtitle="Análisis y estadísticas del evento"
      userLevel={4}
    >
      <div className="space-y-6">
        {/* Export Options */}
        <div className="flex items-center justify-between">
          <Badge variant={event.status === 'active' ? 'default' : 'secondary'}>
            {event.status === 'active' ? 'Activo' : event.status === 'upcoming' ? 'Próximo' : 'Cerrado'}
          </Badge>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar PDF
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar Excel
            </Button>
          </div>
        </div>

        {/* Report Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="w-5 h-5 text-primary" />
                Resumen de Ventas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Tickets Vendidos</span>
                <span className="font-semibold">{event.soldTickets.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Capacidad Total</span>
                <span className="font-semibold">{event.totalCapacity.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Porcentaje Vendido</span>
                <span className="font-semibold text-success">
                  {Math.round((event.soldTickets / event.totalCapacity) * 100)}%
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Recaudación Total</span>
                <span className="font-bold text-lg">
                  ${(event.soldTickets * event.ticketPrice).toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="w-5 h-5 text-primary" />
                Rendimiento del Equipo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Vendedores Activos</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Promedio por Vendedor</span>
                <span className="font-semibold">{Math.round(event.soldTickets / 12)} tickets</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Top Seller</span>
                <span className="font-semibold">Carlos Ruiz (245)</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Comisiones Pagadas</span>
                <span className="font-bold text-lg text-warning">$1,237,500</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="w-5 h-5 text-primary" />
                Información del Evento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Fecha</span>
                <span className="font-semibold">{event.date}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Venue</span>
                <span className="font-semibold">{event.venue}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Precio Ticket</span>
                <span className="font-semibold">${event.ticketPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Estado</span>
                <Badge variant={event.status === 'active' ? 'default' : 'secondary'}>
                  {event.status === 'active' ? 'Activo' : event.status === 'upcoming' ? 'Próximo' : 'Cerrado'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart3 className="w-5 h-5 text-primary" />
                Métricas de Conversión
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Tasa de Conversión</span>
                <span className="font-semibold text-success">78%</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Tiempo Promedio de Cierre</span>
                <span className="font-semibold">2.3 días</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Hitos Completados</span>
                <span className="font-semibold">24 / 60</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">NPS Score</span>
                <span className="font-bold text-lg text-success">+72</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
