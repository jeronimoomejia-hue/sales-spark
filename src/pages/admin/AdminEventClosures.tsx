import { useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Wallet, 
  Check, 
  Clock, 
  AlertCircle,
  Download,
  DollarSign,
  Users
} from "lucide-react";
import { events } from "@/data/mockData";

export default function AdminEventClosures() {
  const { eventId } = useParams();
  const event = events.find(e => e.id === eventId) || events[0];

  const closures = [
    { id: 1, seller: "Carlos Ruiz", sales: 45, commission: 337500, status: "approved", date: "2026-01-27" },
    { id: 2, seller: "Ana Torres", sales: 38, commission: 285000, status: "approved", date: "2026-01-27" },
    { id: 3, seller: "Luis Gómez", sales: 32, commission: 240000, status: "pending", date: "2026-01-28" },
    { id: 4, seller: "María López", sales: 28, commission: 210000, status: "pending", date: "2026-01-28" },
    { id: 5, seller: "Pedro Díaz", sales: 22, commission: 165000, status: "review", date: "2026-01-28" },
  ];

  const totalCommissions = closures.reduce((sum, c) => sum + c.commission, 0);
  const approvedCommissions = closures.filter(c => c.status === 'approved').reduce((sum, c) => sum + c.commission, 0);

  return (
    <DashboardLayout
      title={`Cierres: ${event.name}`}
      subtitle="Gestión de liquidaciones y comisiones"
      userLevel={4}
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">${(totalCommissions / 1000).toFixed(0)}K</p>
                <p className="text-sm text-muted-foreground">Total Comisiones</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-success/10">
                <Check className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">${(approvedCommissions / 1000).toFixed(0)}K</p>
                <p className="text-sm text-muted-foreground">Aprobadas</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-warning/10">
                <Clock className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{closures.filter(c => c.status === 'pending').length}</p>
                <p className="text-sm text-muted-foreground">Pendientes</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-destructive/10">
                <AlertCircle className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{closures.filter(c => c.status === 'review').length}</p>
                <p className="text-sm text-muted-foreground">En Revisión</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Closures Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Liquidaciones por Vendedor
            </CardTitle>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exportar Reporte
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Vendedor</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Ventas</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Comisión</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Fecha</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Estado</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {closures.map((closure) => (
                    <tr key={closure.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{closure.seller}</td>
                      <td className="py-3 px-4">{closure.sales} tickets</td>
                      <td className="py-3 px-4 font-semibold text-success">${closure.commission.toLocaleString()}</td>
                      <td className="py-3 px-4 text-muted-foreground">{closure.date}</td>
                      <td className="py-3 px-4">
                        <Badge variant={
                          closure.status === 'approved' ? 'default' : 
                          closure.status === 'pending' ? 'secondary' : 'destructive'
                        }>
                          {closure.status === 'approved' ? 'Aprobado' : 
                           closure.status === 'pending' ? 'Pendiente' : 'En Revisión'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        {closure.status !== 'approved' && (
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">Revisar</Button>
                            <Button size="sm" variant="default">Aprobar</Button>
                          </div>
                        )}
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
