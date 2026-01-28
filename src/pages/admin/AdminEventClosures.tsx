import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Wallet, 
  Check, 
  Clock, 
  AlertCircle,
  Download,
  DollarSign,
  Users,
  FileText,
  Send,
  CheckCircle2,
  XCircle,
  Eye,
  Calendar,
  TicketIcon,
  Timer,
  Bell
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { events } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface Closure {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  sellerLevel: string;
  ticketsSold: number;
  ticketsGeneral: number;
  ticketsVIP: number;
  revenue: number;
  commission: number;
  commissionRate: number;
  status: 'pending' | 'submitted' | 'approved' | 'paid' | 'disputed';
  submittedAt?: string;
  approvedAt?: string;
  paidAt?: string;
  notes?: string;
  paymentMethod?: string;
  bankAccount?: string;
}

export default function AdminEventClosures() {
  const { eventId } = useParams();
  const event = events.find(e => e.id === eventId) || events[0];
  const [selectedClosure, setSelectedClosure] = useState<Closure | null>(null);
  const [showPaymentTable, setShowPaymentTable] = useState(false);
  const [showApproveAllModal, setShowApproveAllModal] = useState(false);

  // Check if event has started (closures enabled)
  const eventDate = new Date(event.date);
  const now = new Date();
  const eventStarted = now >= eventDate;
  const hoursUntilEvent = Math.max(0, Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60)));

  const closures: Closure[] = [
    { 
      id: 'c1', 
      sellerId: 'p1',
      sellerName: "Carlos Ruiz", 
      sellerAvatar: "CR",
      sellerLevel: "Común",
      ticketsSold: 85,
      ticketsGeneral: 65,
      ticketsVIP: 20,
      revenue: 4100000,
      commission: 637500,
      commissionRate: 7500,
      status: "submitted", 
      submittedAt: "2026-01-28 14:30",
      notes: "Cierre completo del período",
      paymentMethod: "Transferencia",
      bankAccount: "****4521"
    },
    { 
      id: 'c2', 
      sellerId: 'p2',
      sellerName: "Ana Torres", 
      sellerAvatar: "AT",
      sellerLevel: "Común",
      ticketsSold: 72,
      ticketsGeneral: 58,
      ticketsVIP: 14,
      revenue: 3380000,
      commission: 540000,
      commissionRate: 7500,
      status: "submitted", 
      submittedAt: "2026-01-28 15:45",
      paymentMethod: "Nequi",
      bankAccount: "****8876"
    },
    { 
      id: 'c3', 
      sellerId: 'p3',
      sellerName: "Luis Gómez", 
      sellerAvatar: "LG",
      sellerLevel: "Común",
      ticketsSold: 68,
      ticketsGeneral: 52,
      ticketsVIP: 16,
      revenue: 3240000,
      commission: 510000,
      commissionRate: 7500,
      status: "approved", 
      submittedAt: "2026-01-27 10:00",
      approvedAt: "2026-01-27 16:30",
      paymentMethod: "Daviplata",
      bankAccount: "****2234"
    },
    { 
      id: 'c4', 
      sellerId: 'p4',
      sellerName: "María López", 
      sellerAvatar: "ML",
      sellerLevel: "Común",
      ticketsSold: 58,
      ticketsGeneral: 45,
      ticketsVIP: 13,
      revenue: 2770000,
      commission: 435000,
      commissionRate: 7500,
      status: "paid", 
      submittedAt: "2026-01-26 09:00",
      approvedAt: "2026-01-26 14:00",
      paidAt: "2026-01-27 10:00",
      paymentMethod: "Transferencia",
      bankAccount: "****6789"
    },
    { 
      id: 'c5', 
      sellerId: 'p5',
      sellerName: "Pedro Díaz", 
      sellerAvatar: "PD",
      sellerLevel: "Común",
      ticketsSold: 52,
      ticketsGeneral: 40,
      ticketsVIP: 12,
      revenue: 2480000,
      commission: 390000,
      commissionRate: 7500,
      status: "disputed", 
      submittedAt: "2026-01-27 11:00",
      notes: "Discrepancia en conteo de tickets VIP - Revisar con tiquetera",
      paymentMethod: "Transferencia",
      bankAccount: "****1122"
    },
    { 
      id: 'c6', 
      sellerId: 'p6',
      sellerName: "Roberto Méndez", 
      sellerAvatar: "RM",
      sellerLevel: "Común",
      ticketsSold: 45,
      ticketsGeneral: 35,
      ticketsVIP: 10,
      revenue: 2150000,
      commission: 337500,
      commissionRate: 7500,
      status: "pending",
      paymentMethod: "Nequi",
      bankAccount: "****3344"
    },
  ];

  const pendingClosures = closures.filter(c => c.status === 'submitted');
  const totalCommissions = closures.reduce((sum, c) => sum + c.commission, 0);
  const approvedCommissions = closures.filter(c => c.status === 'approved' || c.status === 'paid')
    .reduce((sum, c) => sum + c.commission, 0);
  const pendingAmount = pendingClosures.reduce((sum, c) => sum + c.commission, 0);

  const getStatusBadge = (status: Closure['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-muted-foreground">Sin Enviar</Badge>;
      case 'submitted':
        return <Badge variant="outline" className="text-warning border-warning">Pendiente Revisión</Badge>;
      case 'approved':
        return <Badge className="bg-primary/20 text-primary">Aprobado</Badge>;
      case 'paid':
        return <Badge className="bg-success/20 text-success">Pagado</Badge>;
      case 'disputed':
        return <Badge variant="destructive">En Disputa</Badge>;
    }
  };

  return (
    <DashboardLayout
      title={`Cierres: ${event.name}`}
      subtitle="Gestión de liquidaciones y comisiones"
      userLevel={4}
    >
      <div className="space-y-6">
        {/* Event Status Banner */}
        {!eventStarted && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-warning/10 border border-warning/30 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/20">
                <Timer className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="font-medium text-warning">Cierres no habilitados aún</p>
                <p className="text-sm text-muted-foreground">
                  Los vendedores podrán enviar su cierre cuando inicie el evento ({event.date})
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-warning border-warning">
              <Clock className="w-3 h-3 mr-1" />
              Faltan {hoursUntilEvent} horas
            </Badge>
          </motion.div>
        )}

        {eventStarted && pendingClosures.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20 animate-pulse">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">¡Cierres listos para revisión!</p>
                <p className="text-sm text-muted-foreground">
                  {pendingClosures.length} vendedores han enviado su cierre. Total pendiente: ${(pendingAmount / 1000000).toFixed(1)}M
                </p>
              </div>
            </div>
            <Button variant="party" onClick={() => setShowApproveAllModal(true)}>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Revisar Todos
            </Button>
          </motion.div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/20">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">${(totalCommissions / 1000000).toFixed(1)}M</p>
                <p className="text-sm text-muted-foreground">Total Comisiones</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-success/20 to-success/5 border-success/30">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-success/20">
                <Check className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">${(approvedCommissions / 1000000).toFixed(1)}M</p>
                <p className="text-sm text-muted-foreground">Aprobadas/Pagadas</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-warning/20 to-warning/5 border-warning/30">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-warning/20">
                <Clock className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingClosures.length}</p>
                <p className="text-sm text-muted-foreground">Pendientes</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-destructive/20 to-destructive/5 border-destructive/30">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-destructive/20">
                <AlertCircle className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{closures.filter(c => c.status === 'disputed').length}</p>
                <p className="text-sm text-muted-foreground">En Disputa</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-neon-blue/20 to-neon-blue/5 border-neon-blue/30">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-neon-blue/20">
                <Users className="w-6 h-6 text-neon-blue" />
              </div>
              <div>
                <p className="text-2xl font-bold">{closures.length}</p>
                <p className="text-sm text-muted-foreground">Total Vendedores</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Table Button */}
        <div className="flex gap-3">
          <Button 
            variant="party" 
            className="gap-2"
            onClick={() => setShowPaymentTable(true)}
          >
            <Wallet className="w-4 h-4" />
            Ver Tabla de Pagos Completa
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Exportar Reporte de Pagos
          </Button>
        </div>

        {/* Closures Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Documentos de Cierre
            </CardTitle>
            <Badge variant="secondary">
              {closures.filter(c => c.status === 'submitted').length} por revisar
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Vendedor</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Tickets</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Recaudo</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Comisión</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Estado</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Enviado</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {closures.map((closure) => (
                    <tr key={closure.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-party flex items-center justify-center text-white font-semibold text-sm">
                            {closure.sellerAvatar}
                          </div>
                          <div>
                            <p className="font-medium">{closure.sellerName}</p>
                            <p className="text-xs text-muted-foreground">{closure.sellerLevel}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-semibold">{closure.ticketsSold}</p>
                          <p className="text-xs text-muted-foreground">
                            {closure.ticketsGeneral} Gen + {closure.ticketsVIP} VIP
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold">${(closure.revenue / 1000000).toFixed(2)}M</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-success">${(closure.commission / 1000).toFixed(0)}K</p>
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(closure.status)}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground text-sm">
                        {closure.submittedAt || '-'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setSelectedClosure(closure)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Ver
                          </Button>
                          {closure.status === 'submitted' && (
                            <Button size="sm" variant="party">
                              Aprobar
                            </Button>
                          )}
                          {closure.status === 'approved' && (
                            <Button size="sm" variant="default" className="bg-success hover:bg-success/80">
                              <DollarSign className="w-4 h-4 mr-1" />
                              Pagar
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Closure Detail Modal - Documento Automático */}
      <Dialog open={!!selectedClosure} onOpenChange={() => setSelectedClosure(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Documento de Cierre #{selectedClosure?.id.toUpperCase()}
            </DialogTitle>
            <DialogDescription>
              Cierre automático generado al iniciar el evento
            </DialogDescription>
          </DialogHeader>

          {selectedClosure && (
            <div className="space-y-6 mt-4">
              {/* Header del documento */}
              <div className="p-4 rounded-lg bg-card-elevated border-2 border-primary/30">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-party flex items-center justify-center text-white font-bold text-xl">
                      {selectedClosure.sellerAvatar}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{selectedClosure.sellerName}</h3>
                      <p className="text-muted-foreground">Nivel: {selectedClosure.sellerLevel}</p>
                    </div>
                  </div>
                  {getStatusBadge(selectedClosure.status)}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Evento</p>
                    <p className="font-medium">{event.name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Fecha del Evento</p>
                    <p className="font-medium">{event.date}</p>
                  </div>
                </div>
              </div>

              {/* Detalle de Ventas */}
              <div className="p-4 rounded-lg border border-border">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <TicketIcon className="w-4 h-4 text-primary" />
                  Detalle de Ventas
                </h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded bg-card-elevated">
                    <span>Tickets General</span>
                    <div className="text-right">
                      <span className="font-semibold">{selectedClosure.ticketsGeneral}</span>
                      <span className="text-muted-foreground ml-2">× ${(event.ticketPrice / 1000).toFixed(0)}K</span>
                      <span className="font-semibold ml-3">${(selectedClosure.ticketsGeneral * event.ticketPrice / 1000000).toFixed(2)}M</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded bg-card-elevated">
                    <span>Tickets VIP</span>
                    <div className="text-right">
                      <span className="font-semibold">{selectedClosure.ticketsVIP}</span>
                      <span className="text-muted-foreground ml-2">× ${((event.ticketPrice * 1.5) / 1000).toFixed(0)}K</span>
                      <span className="font-semibold ml-3">${(selectedClosure.ticketsVIP * event.ticketPrice * 1.5 / 1000000).toFixed(2)}M</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded bg-primary/10 border border-primary/30">
                    <span className="font-semibold">Total Tickets</span>
                    <span className="font-bold text-lg text-primary">{selectedClosure.ticketsSold}</span>
                  </div>
                </div>
              </div>

              {/* Cálculo de Comisión */}
              <div className="p-4 rounded-lg border border-border">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-success" />
                  Cálculo de Comisión
                </h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Recaudo Total</span>
                    <span className="font-semibold">${(selectedClosure.revenue / 1000000).toFixed(2)}M</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Tasa de Comisión</span>
                    <span className="font-semibold">${(selectedClosure.commissionRate / 1000).toFixed(1)}K por ticket</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Tickets × Tasa</span>
                    <span className="font-semibold">{selectedClosure.ticketsSold} × ${(selectedClosure.commissionRate / 1000).toFixed(1)}K</span>
                  </div>
                  <div className="border-t border-border pt-3 flex items-center justify-between">
                    <span className="font-semibold text-lg">Comisión a Pagar</span>
                    <span className="font-bold text-2xl text-success">${selectedClosure.commission.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Información de Pago */}
              <div className="p-4 rounded-lg border border-border">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-warning" />
                  Información de Pago
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Método de Pago</p>
                    <p className="font-medium">{selectedClosure.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Cuenta/Número</p>
                    <p className="font-medium">{selectedClosure.bankAccount}</p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="p-4 rounded-lg border border-border">
                <h4 className="font-semibold mb-4">Historial</h4>
                <div className="space-y-3">
                  {selectedClosure.submittedAt && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-warning/10">
                        <Send className="w-4 h-4 text-warning" />
                      </div>
                      <div>
                        <p className="font-medium">Cierre Enviado</p>
                        <p className="text-sm text-muted-foreground">{selectedClosure.submittedAt}</p>
                      </div>
                    </div>
                  )}
                  {selectedClosure.approvedAt && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Aprobado por Admin</p>
                        <p className="text-sm text-muted-foreground">{selectedClosure.approvedAt}</p>
                      </div>
                    </div>
                  )}
                  {selectedClosure.paidAt && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-success/10">
                        <DollarSign className="w-4 h-4 text-success" />
                      </div>
                      <div>
                        <p className="font-medium">Pago Realizado</p>
                        <p className="text-sm text-muted-foreground">{selectedClosure.paidAt}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {selectedClosure.notes && (
                <div className="p-4 rounded-lg bg-warning/10 border border-warning/30">
                  <p className="font-medium text-warning mb-1">Notas</p>
                  <p className="text-sm">{selectedClosure.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setSelectedClosure(null)}>
                  Cerrar
                </Button>
                {selectedClosure.status === 'submitted' && (
                  <>
                    <Button variant="outline" className="gap-2 text-destructive hover:text-destructive">
                      <XCircle className="w-4 h-4" />
                      Rechazar
                    </Button>
                    <Button variant="party" className="flex-1 gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Aprobar Cierre
                    </Button>
                  </>
                )}
                {selectedClosure.status === 'approved' && (
                  <Button variant="party" className="flex-1 gap-2">
                    <DollarSign className="w-4 h-4" />
                    Marcar como Pagado
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Payment Table Modal */}
      <Dialog open={showPaymentTable} onOpenChange={setShowPaymentTable}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" />
              Tabla de Pagos - {event.name}
            </DialogTitle>
            <DialogDescription>
              Resumen de montos a pagar a cada vendedor
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Summary */}
            <div className="grid grid-cols-4 gap-3">
              <div className="text-center p-3 rounded-lg bg-card-elevated">
                <p className="text-2xl font-bold">{closures.length}</p>
                <p className="text-xs text-muted-foreground">Vendedores</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-success/10">
                <p className="text-2xl font-bold text-success">${(totalCommissions / 1000000).toFixed(1)}M</p>
                <p className="text-xs text-muted-foreground">Total a Pagar</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-primary/10">
                <p className="text-2xl font-bold text-primary">${(approvedCommissions / 1000000).toFixed(1)}M</p>
                <p className="text-xs text-muted-foreground">Ya Aprobado</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-warning/10">
                <p className="text-2xl font-bold text-warning">${(pendingAmount / 1000000).toFixed(1)}M</p>
                <p className="text-xs text-muted-foreground">Pendiente</p>
              </div>
            </div>

            {/* Full Table */}
            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full">
                <thead className="bg-card-elevated">
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-semibold">#</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Vendedor</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold">Tickets</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold">Recaudo</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold">Comisión</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold">Método</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold">Cuenta</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {closures.map((closure, idx) => (
                    <tr key={closure.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 text-muted-foreground">{idx + 1}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-party flex items-center justify-center text-white font-semibold text-xs">
                            {closure.sellerAvatar}
                          </div>
                          <span className="font-medium">{closure.sellerName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center font-semibold">{closure.ticketsSold}</td>
                      <td className="py-3 px-4 text-right">${(closure.revenue / 1000000).toFixed(2)}M</td>
                      <td className="py-3 px-4 text-right font-bold text-success">
                        ${closure.commission.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center text-sm">{closure.paymentMethod}</td>
                      <td className="py-3 px-4 text-center text-sm text-muted-foreground">{closure.bankAccount}</td>
                      <td className="py-3 px-4 text-center">{getStatusBadge(closure.status)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-card-elevated font-semibold">
                  <tr>
                    <td colSpan={2} className="py-3 px-4">TOTAL</td>
                    <td className="py-3 px-4 text-center">{closures.reduce((s, c) => s + c.ticketsSold, 0)}</td>
                    <td className="py-3 px-4 text-right">${(closures.reduce((s, c) => s + c.revenue, 0) / 1000000).toFixed(2)}M</td>
                    <td className="py-3 px-4 text-right text-success">${totalCommissions.toLocaleString()}</td>
                    <td colSpan={3}></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowPaymentTable(false)}>
                Cerrar
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Exportar Excel
              </Button>
              <Button variant="party" className="gap-2">
                <DollarSign className="w-4 h-4" />
                Procesar Pagos Masivos
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Approve All Modal */}
      <Dialog open={showApproveAllModal} onOpenChange={setShowApproveAllModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Aprobar Cierres Pendientes</DialogTitle>
            <DialogDescription>
              Revisa y aprueba {pendingClosures.length} cierres pendientes
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="p-4 rounded-lg bg-card-elevated text-center">
              <p className="text-3xl font-bold text-success">${(pendingAmount / 1000000).toFixed(1)}M</p>
              <p className="text-sm text-muted-foreground">Total a aprobar</p>
            </div>

            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {pendingClosures.map((closure) => (
                <div key={closure.id} className="flex items-center justify-between p-2 rounded bg-card">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-party flex items-center justify-center text-white text-xs font-semibold">
                      {closure.sellerAvatar}
                    </div>
                    <span className="font-medium">{closure.sellerName}</span>
                  </div>
                  <span className="text-success font-semibold">${(closure.commission / 1000).toFixed(0)}K</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowApproveAllModal(false)}>
                Cancelar
              </Button>
              <Button variant="party" className="flex-1" onClick={() => setShowApproveAllModal(false)}>
                Aprobar Todos
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
