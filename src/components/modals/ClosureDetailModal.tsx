import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Wallet, 
  Download, 
  Calendar, 
  TicketIcon,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  User,
  Building
} from "lucide-react";

interface ClosureData {
  id: string;
  period: string;
  tickets: number;
  totalSales: number;
  commission: number;
  status: 'pending' | 'approved' | 'paid' | 'disputed';
  paidDate?: string;
  approvedBy?: string;
  breakdown?: {
    general: number;
    vip: number;
    palco: number;
  };
  byEvent?: {
    eventName: string;
    tickets: number;
    commission: number;
  }[];
}

interface ClosureDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  closure?: ClosureData;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "paid":
      return <Badge variant="success" className="gap-1"><CheckCircle2 className="w-3 h-3" /> Pagado</Badge>;
    case "approved":
      return <Badge variant="default" className="gap-1"><CheckCircle2 className="w-3 h-3" /> Aprobado</Badge>;
    case "pending":
      return <Badge variant="warning" className="gap-1"><Clock className="w-3 h-3" /> Pendiente</Badge>;
    case "disputed":
      return <Badge variant="destructive" className="gap-1"><AlertCircle className="w-3 h-3" /> Disputa</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export function ClosureDetailModal({ 
  open, 
  onOpenChange, 
  closure 
}: ClosureDetailModalProps) {
  if (!closure) return null;

  // Default breakdown
  const breakdown = closure.breakdown || { general: 85, vip: 10, palco: 3 };
  const byEvent = closure.byEvent || [
    { eventName: "Neon Festival 2026", tickets: 72, commission: 540000 },
    { eventName: "Rock Night", tickets: 18, commission: 135000 },
    { eventName: "Electro Waves", tickets: 8, commission: 60000 },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-primary" />
            Detalle del Cierre {closure.id}
          </DialogTitle>
        </DialogHeader>

        {/* Status and Period */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-card-elevated">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="font-medium">{closure.period}</p>
              <p className="text-sm text-muted-foreground">Período de cierre</p>
            </div>
          </div>
          {getStatusBadge(closure.status)}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-card-elevated text-center">
            <TicketIcon className="w-6 h-6 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold font-display">{closure.tickets}</p>
            <p className="text-sm text-muted-foreground">Tickets</p>
          </div>
          <div className="p-4 rounded-lg bg-card-elevated text-center">
            <Wallet className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
            <p className="text-2xl font-bold font-display">${(closure.totalSales / 1000000).toFixed(2)}M</p>
            <p className="text-sm text-muted-foreground">Total Ventas</p>
          </div>
          <div className="p-4 rounded-lg bg-card-elevated text-center">
            <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-success" />
            <p className="text-2xl font-bold font-display text-success">${(closure.commission / 1000).toFixed(0)}k</p>
            <p className="text-sm text-muted-foreground">Tu Comisión</p>
          </div>
        </div>

        {/* Breakdown by Ticket Type */}
        <div className="p-4 rounded-lg bg-card-elevated">
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <TicketIcon className="w-4 h-4" />
            Desglose por Tipo de Boleta
          </h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <Badge variant="secondary" className="mb-2">General</Badge>
              <p className="text-xl font-bold">{breakdown.general}</p>
            </div>
            <div className="text-center">
              <Badge variant="warning" className="mb-2">VIP</Badge>
              <p className="text-xl font-bold">{breakdown.vip}</p>
            </div>
            <div className="text-center">
              <Badge variant="default" className="mb-2">Palco</Badge>
              <p className="text-xl font-bold">{breakdown.palco}</p>
            </div>
          </div>
        </div>

        {/* Breakdown by Event */}
        <div className="p-4 rounded-lg bg-card-elevated">
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Desglose por Evento
          </h4>
          <div className="space-y-3">
            {byEvent.map((event, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-background">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="font-medium">{event.eventName}</span>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-medium">{event.tickets} tickets</p>
                  </div>
                  <div className="text-right min-w-[100px]">
                    <p className="font-medium text-success">${event.commission.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Info */}
        {closure.status === 'paid' && closure.paidDate && (
          <div className="p-4 rounded-lg bg-success/10 border border-success/20">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-success" />
              <div>
                <p className="font-medium">Pago realizado</p>
                <p className="text-sm text-muted-foreground">
                  Fecha de pago: {closure.paidDate}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="outline" className="gap-2">
            <FileText className="w-4 h-4" />
            Ver Ventas Detalladas
          </Button>
          <Button variant="party" className="gap-2">
            <Download className="w-4 h-4" />
            Descargar PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
