import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TicketIcon, 
  TrendingUp, 
  Download,
  Calendar,
  User,
  DollarSign
} from "lucide-react";
import { salesData, Sale } from "@/data/mockData";

interface SalesDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  filterEventId?: string;
  filterSellerId?: string;
}

export function SalesDetailModal({ 
  open, 
  onOpenChange, 
  title = "Detalle de Ventas",
  filterEventId,
  filterSellerId 
}: SalesDetailModalProps) {
  const filteredSales = salesData.filter(sale => {
    if (filterEventId && filterEventId !== 'all' && sale.eventId !== filterEventId) return false;
    if (filterSellerId && sale.sellerId !== filterSellerId) return false;
    return true;
  });

  const totalTickets = filteredSales.length;
  const totalAmount = filteredSales.reduce((sum, s) => sum + s.price, 0);
  const totalCommission = filteredSales.reduce((sum, s) => sum + s.commission, 0);

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "vip": return "warning";
      case "palco": return "default";
      default: return "secondary";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TicketIcon className="w-5 h-5 text-primary" />
            {title}
          </DialogTitle>
        </DialogHeader>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-card-elevated">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Ventas</p>
            <p className="text-2xl font-bold font-display text-primary">{totalTickets}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Monto Total</p>
            <p className="text-2xl font-bold font-display">${(totalAmount / 1000).toFixed(0)}k</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Comisiones</p>
            <p className="text-2xl font-bold font-display text-success">${(totalCommission / 1000).toFixed(0)}k</p>
          </div>
        </div>

        {/* Sales Table */}
        <div className="overflow-auto max-h-[400px] rounded-lg border border-border">
          <table className="w-full">
            <thead className="sticky top-0 bg-card-elevated">
              <tr className="border-b border-border">
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">ID</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Evento</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Vendedor</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Tipo</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Precio</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Comisión</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Fecha</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale, index) => (
                <motion.tr
                  key={sale.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  className="border-b border-border/50 hover:bg-card-elevated/50 transition-colors"
                >
                  <td className="p-3 font-mono text-sm text-primary">{sale.id}</td>
                  <td className="p-3 text-sm">{sale.eventName}</td>
                  <td className="p-3 text-sm">{sale.sellerName}</td>
                  <td className="p-3">
                    <Badge variant={getTypeBadgeColor(sale.ticketType)} className="capitalize">
                      {sale.ticketType}
                    </Badge>
                  </td>
                  <td className="p-3 font-medium">${sale.price.toLocaleString()}</td>
                  <td className="p-3 text-success font-medium">${sale.commission.toLocaleString()}</td>
                  <td className="p-3 text-muted-foreground text-sm">{sale.date}</td>
                  <td className="p-3">
                    <Badge variant={sale.status === 'confirmed' ? 'success' : 'warning'}>
                      {sale.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
                    </Badge>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Exportar CSV
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
