import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Wallet, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Send,
  Download,
  User,
  Calendar,
  DollarSign,
  TicketIcon,
  XCircle,
  Eye
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { events } from "@/data/mockData";

interface Closure {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  eventId: string;
  eventName: string;
  ticketsSold: number;
  revenue: number;
  commission: number;
  status: 'pending' | 'submitted' | 'approved' | 'paid' | 'disputed';
  submittedAt?: string;
  approvedAt?: string;
  paidAt?: string;
  notes?: string;
}

// Mock closures data
const mockClosures: Closure[] = [
  {
    id: 'closure-1',
    sellerId: 'promo-1',
    sellerName: 'Carlos Ruiz',
    sellerAvatar: 'CR',
    eventId: 'evt-1',
    eventName: 'Neon Festival 2026',
    ticketsSold: 85,
    revenue: 3400000,
    commission: 637500,
    status: 'submitted',
    submittedAt: '2026-01-28 14:30',
    notes: 'Cierre completo del período'
  },
  {
    id: 'closure-2',
    sellerId: 'promo-2',
    sellerName: 'Ana Torres',
    sellerAvatar: 'AT',
    eventId: 'evt-1',
    eventName: 'Neon Festival 2026',
    ticketsSold: 72,
    revenue: 2880000,
    commission: 540000,
    status: 'submitted',
    submittedAt: '2026-01-28 15:45'
  },
  {
    id: 'closure-3',
    sellerId: 'promo-3',
    sellerName: 'Luis Gómez',
    sellerAvatar: 'LG',
    eventId: 'evt-2',
    eventName: 'Rock Night',
    ticketsSold: 68,
    revenue: 3060000,
    commission: 510000,
    status: 'approved',
    submittedAt: '2026-01-27 10:00',
    approvedAt: '2026-01-27 16:30'
  },
  {
    id: 'closure-4',
    sellerId: 'promo-4',
    sellerName: 'María López',
    sellerAvatar: 'ML',
    eventId: 'evt-1',
    eventName: 'Neon Festival 2026',
    ticketsSold: 58,
    revenue: 2320000,
    commission: 435000,
    status: 'paid',
    submittedAt: '2026-01-26 09:00',
    approvedAt: '2026-01-26 14:00',
    paidAt: '2026-01-27 10:00'
  },
  {
    id: 'closure-5',
    sellerId: 'promo-5',
    sellerName: 'Pedro Díaz',
    sellerAvatar: 'PD',
    eventId: 'evt-2',
    eventName: 'Rock Night',
    ticketsSold: 52,
    revenue: 2340000,
    commission: 390000,
    status: 'disputed',
    submittedAt: '2026-01-27 11:00',
    notes: 'Discrepancia en conteo de tickets VIP'
  },
];

interface ClosureManagementPanelProps {
  selectedEventId?: string | 'all';
}

export function ClosureManagementPanel({ selectedEventId = 'all' }: ClosureManagementPanelProps) {
  const [selectedClosure, setSelectedClosure] = useState<Closure | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);

  const filteredClosures = selectedEventId === 'all' 
    ? mockClosures 
    : mockClosures.filter(c => c.eventId === selectedEventId);

  const pendingClosures = filteredClosures.filter(c => c.status === 'submitted');
  const totalPendingAmount = pendingClosures.reduce((sum, c) => sum + c.commission, 0);

  const getStatusBadge = (status: Closure['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-muted-foreground">Sin Enviar</Badge>;
      case 'submitted':
        return <Badge variant="outline" className="text-warning border-warning">Pendiente</Badge>;
      case 'approved':
        return <Badge className="bg-primary/20 text-primary">Aprobado</Badge>;
      case 'paid':
        return <Badge className="bg-success/20 text-success">Pagado</Badge>;
      case 'disputed':
        return <Badge variant="destructive">En Disputa</Badge>;
    }
  };

  const getStatusIcon = (status: Closure['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-muted-foreground" />;
      case 'submitted':
        return <FileText className="w-4 h-4 text-warning" />;
      case 'approved':
        return <CheckCircle2 className="w-4 h-4 text-primary" />;
      case 'paid':
        return <DollarSign className="w-4 h-4 text-success" />;
      case 'disputed':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <Card variant="neon">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" />
              Gestión de Cierres
            </CardTitle>
            <div className="flex items-center gap-2">
              {pendingClosures.length > 0 && (
                <Badge variant="destructive" className="gap-1">
                  <Clock className="w-3 h-3" />
                  {pendingClosures.length} pendientes
                </Badge>
              )}
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Summary Stats */}
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="p-3 rounded-lg bg-card-elevated text-center">
                <p className="text-xl font-bold text-primary">{filteredClosures.length}</p>
                <p className="text-xs text-muted-foreground">Total Cierres</p>
              </div>
              <div className="p-3 rounded-lg bg-warning/10 text-center">
                <p className="text-xl font-bold text-warning">{pendingClosures.length}</p>
                <p className="text-xs text-muted-foreground">Pendientes</p>
              </div>
              <div className="p-3 rounded-lg bg-success/10 text-center">
                <p className="text-xl font-bold text-success">
                  {filteredClosures.filter(c => c.status === 'paid').length}
                </p>
                <p className="text-xs text-muted-foreground">Pagados</p>
              </div>
              <div className="p-3 rounded-lg bg-destructive/10 text-center">
                <p className="text-xl font-bold text-destructive">
                  {filteredClosures.filter(c => c.status === 'disputed').length}
                </p>
                <p className="text-xs text-muted-foreground">En Disputa</p>
              </div>
            </div>

            {/* Pending Alert */}
            {pendingClosures.length > 0 && (
              <div className="mb-4 p-3 rounded-lg bg-warning/10 border border-warning/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-warning" />
                  <div>
                    <p className="font-medium text-warning">
                      {pendingClosures.length} cierres esperan aprobación
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Total: ${(totalPendingAmount / 1000000).toFixed(1)}M en comisiones
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-warning text-warning hover:bg-warning/10"
                  onClick={() => setShowApproveModal(true)}
                >
                  Aprobar Todos
                </Button>
              </div>
            )}

            {/* Closures List */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {filteredClosures.map((closure) => (
                <div
                  key={closure.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-card-elevated border border-border hover:border-primary/40 transition-all cursor-pointer"
                  onClick={() => setSelectedClosure(closure)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-party flex items-center justify-center text-white font-semibold text-sm">
                      {closure.sellerAvatar}
                    </div>
                    <div>
                      <p className="font-medium">{closure.sellerName}</p>
                      <p className="text-xs text-muted-foreground">{closure.eventName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold text-success">
                        ${(closure.commission / 1000).toFixed(0)}K
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {closure.ticketsSold} tickets
                      </p>
                    </div>
                    {getStatusBadge(closure.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Closure Detail Modal */}
      <Dialog open={!!selectedClosure} onOpenChange={() => setSelectedClosure(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" />
              Detalle de Cierre
            </DialogTitle>
            <DialogDescription>
              Documento de cierre automático
            </DialogDescription>
          </DialogHeader>

          {selectedClosure && (
            <div className="space-y-4 mt-4">
              {/* Seller Info */}
              <div className="flex items-center gap-4 p-4 rounded-lg bg-card-elevated">
                <div className="w-14 h-14 rounded-full bg-gradient-party flex items-center justify-center text-white font-bold text-lg">
                  {selectedClosure.sellerAvatar}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{selectedClosure.sellerName}</h3>
                  <p className="text-sm text-muted-foreground">{selectedClosure.eventName}</p>
                </div>
                {getStatusBadge(selectedClosure.status)}
              </div>

              {/* Closure Document */}
              <div className="p-4 rounded-lg border border-border bg-card">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
                  <FileText className="w-5 h-5 text-primary" />
                  <span className="font-semibold">Documento de Cierre</span>
                  <Badge variant="outline" className="ml-auto">
                    #{selectedClosure.id.slice(-4).toUpperCase()}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Tickets Vendidos</p>
                    <p className="text-xl font-bold flex items-center gap-2">
                      <TicketIcon className="w-5 h-5 text-primary" />
                      {selectedClosure.ticketsSold}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Recaudo Total</p>
                    <p className="text-xl font-bold text-success">
                      ${(selectedClosure.revenue / 1000000).toFixed(2)}M
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Comisión Generada</p>
                    <p className="text-xl font-bold text-warning">
                      ${(selectedClosure.commission / 1000).toFixed(0)}K
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Tasa Comisión</p>
                    <p className="text-xl font-bold">
                      {((selectedClosure.commission / selectedClosure.revenue) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>

                {selectedClosure.notes && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-1">Notas</p>
                    <p className="text-sm">{selectedClosure.notes}</p>
                  </div>
                )}

                {/* Timeline */}
                <div className="mt-4 pt-4 border-t border-border space-y-2">
                  {selectedClosure.submittedAt && (
                    <div className="flex items-center gap-2 text-sm">
                      <Send className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Enviado:</span>
                      <span>{selectedClosure.submittedAt}</span>
                    </div>
                  )}
                  {selectedClosure.approvedAt && (
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">Aprobado:</span>
                      <span>{selectedClosure.approvedAt}</span>
                    </div>
                  )}
                  {selectedClosure.paidAt && (
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-success" />
                      <span className="text-muted-foreground">Pagado:</span>
                      <span>{selectedClosure.paidAt}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Amount to Pay */}
              <div className="p-4 rounded-lg bg-success/10 border border-success/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Monto a Pagar</p>
                    <p className="text-3xl font-bold text-success">
                      ${(selectedClosure.commission).toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="w-10 h-10 text-success/50" />
                </div>
              </div>

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
                    <Button variant="party" className="gap-2">
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
                {selectedClosure.status === 'disputed' && (
                  <Button variant="outline" className="flex-1">
                    Resolver Disputa
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Approve All Modal */}
      <Dialog open={showApproveModal} onOpenChange={setShowApproveModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Aprobar Todos los Cierres</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de aprobar {pendingClosures.length} cierres pendientes?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="p-4 rounded-lg bg-card-elevated">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">{pendingClosures.length}</p>
                  <p className="text-xs text-muted-foreground">Cierres</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-success">
                    ${(totalPendingAmount / 1000000).toFixed(1)}M
                  </p>
                  <p className="text-xs text-muted-foreground">Total Comisiones</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {pendingClosures.map((closure) => (
                <div key={closure.id} className="flex items-center justify-between p-2 rounded bg-card">
                  <span className="font-medium">{closure.sellerName}</span>
                  <span className="text-success">${(closure.commission / 1000).toFixed(0)}K</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowApproveModal(false)}>
                Cancelar
              </Button>
              <Button 
                variant="party" 
                className="flex-1"
                onClick={() => setShowApproveModal(false)}
              >
                Confirmar Aprobación
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
