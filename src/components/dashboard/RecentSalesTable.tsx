import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TicketIcon, Download, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Sale {
  id: string;
  date: string;
  event: string;
  ticketType: "general" | "vip" | "palco";
  price: number;
  commission: number;
}

const ticketTypeBadgeStyles = {
  general: "bg-neon-blue/10 text-neon-blue border-neon-blue/30",
  vip: "bg-neon-purple/10 text-neon-purple border-neon-purple/30",
  palco: "bg-neon-yellow/10 text-neon-yellow border-neon-yellow/30",
};

const ticketTypeLabels = {
  general: "General",
  vip: "VIP",
  palco: "Palco",
};

interface RecentSalesTableProps {
  sales: Sale[];
  totalSales: number;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

export function RecentSalesTable({ sales, totalSales }: RecentSalesTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
    >
      <Card variant="neon">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TicketIcon className="w-5 h-5 text-primary" />
            Mis Ventas Recientes
          </CardTitle>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Descargar Cierre
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Fecha</TableHead>
                <TableHead className="text-muted-foreground">Evento</TableHead>
                <TableHead className="text-muted-foreground">Tipo</TableHead>
                <TableHead className="text-muted-foreground text-right">Precio</TableHead>
                <TableHead className="text-muted-foreground text-right">Comisión</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.map((sale, index) => (
                <motion.tr
                  key={sale.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 0.5 + index * 0.05 }}
                  className="border-border hover:bg-card-elevated transition-colors"
                >
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {sale.date}
                  </TableCell>
                  <TableCell className="font-medium">{sale.event}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "font-medium",
                        ticketTypeBadgeStyles[sale.ticketType]
                      )}
                    >
                      {ticketTypeLabels[sale.ticketType]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(sale.price)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-success font-medium">
                    {formatCurrency(sale.commission)}
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <span className="text-sm text-muted-foreground">
              Mostrando {sales.length} de {totalSales} ventas
            </span>
            <Button variant="ghost" size="sm" className="gap-1 text-primary hover:text-primary">
              Ver todas
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
