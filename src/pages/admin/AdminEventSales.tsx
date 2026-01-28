import { useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TicketIcon, 
  TrendingUp, 
  Users, 
  Download,
  Filter,
  Search
} from "lucide-react";
import { events } from "@/data/mockData";
import { Input } from "@/components/ui/input";

export default function AdminEventSales() {
  const { eventId } = useParams();
  const event = events.find(e => e.id === eventId) || events[0];

  const mockSales = [
    { id: 1, seller: "Carlos Ruiz", type: "General", quantity: 5, total: 200000, date: "2026-01-28", status: "confirmed" },
    { id: 2, seller: "Ana Torres", type: "VIP", quantity: 2, total: 180000, date: "2026-01-28", status: "confirmed" },
    { id: 3, seller: "Luis Gómez", type: "General", quantity: 8, total: 320000, date: "2026-01-27", status: "confirmed" },
    { id: 4, seller: "María López", type: "General", quantity: 3, total: 120000, date: "2026-01-27", status: "pending" },
    { id: 5, seller: "Pedro Díaz", type: "VIP", quantity: 1, total: 90000, date: "2026-01-26", status: "confirmed" },
  ];

  return (
    <DashboardLayout
      title={`Ventas: ${event.name}`}
      subtitle="Seguimiento de ventas en tiempo real"
      userLevel={4}
    >
      <div className="space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <TicketIcon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{event.soldTickets.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Tickets Vendidos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <TrendingUp className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">${(event.soldTickets * event.ticketPrice / 1000000).toFixed(1)}M</p>
                  <p className="text-xs text-muted-foreground">Recaudación Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning/10">
                  <Users className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-xs text-muted-foreground">Vendedores Activos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-neon-purple/10">
                  <TicketIcon className="w-5 h-5 text-neon-purple" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{Math.round((event.soldTickets / event.totalCapacity) * 100)}%</p>
                  <p className="text-xs text-muted-foreground">Capacidad Vendida</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sales Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TicketIcon className="w-5 h-5" />
              Historial de Ventas
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Buscar..." className="pl-10 w-64" />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filtrar
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Vendedor</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Tipo</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Cantidad</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Total</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Fecha</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {mockSales.map((sale) => (
                    <tr key={sale.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{sale.seller}</td>
                      <td className="py-3 px-4">
                        <Badge variant={sale.type === 'VIP' ? 'default' : 'secondary'}>
                          {sale.type}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">{sale.quantity}</td>
                      <td className="py-3 px-4 font-semibold">${sale.total.toLocaleString()}</td>
                      <td className="py-3 px-4 text-muted-foreground">{sale.date}</td>
                      <td className="py-3 px-4">
                        <Badge variant={sale.status === 'confirmed' ? 'default' : 'outline'}>
                          {sale.status === 'confirmed' ? 'Confirmado' : 'Pendiente'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
