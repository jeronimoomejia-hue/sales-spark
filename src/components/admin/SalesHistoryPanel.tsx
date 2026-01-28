import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Clock,
  Search,
  Filter,
  Download,
  Calendar,
  TicketIcon,
  User,
  DollarSign,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SaleRecord {
  id: string;
  date: string;
  time: string;
  seller: string;
  sellerAvatar: string;
  sellerLevel: number;
  ticketType: "General" | "VIP" | "Backstage";
  quantity: number;
  unitPrice: number;
  total: number;
  commission: number;
  paymentMethod: string;
  status: "completed" | "pending" | "cancelled";
}

// Mock sales history data
const generateMockSales = (eventId: string): SaleRecord[] => {
  const sellers = [
    { name: "Carlos Ruiz", avatar: "CR", level: 1 },
    { name: "Ana Torres", avatar: "AT", level: 1 },
    { name: "Juan Pérez", avatar: "JP", level: 2 },
    { name: "Laura Martínez", avatar: "LM", level: 3 },
    { name: "Luis Gómez", avatar: "LG", level: 1 },
    { name: "María García", avatar: "MG", level: 2 },
    { name: "Roberto Silva", avatar: "RS", level: 1 },
    { name: "Sandra López", avatar: "SL", level: 2 },
  ];

  const ticketTypes: ("General" | "VIP" | "Backstage")[] = ["General", "VIP", "Backstage"];
  const paymentMethods = ["Tarjeta", "Efectivo", "Transferencia", "PSE"];
  const statuses: ("completed" | "pending" | "cancelled")[] = ["completed", "completed", "completed", "completed", "pending", "cancelled"];

  return Array.from({ length: 50 }, (_, i) => {
    const seller = sellers[Math.floor(Math.random() * sellers.length)];
    const ticketType = ticketTypes[Math.floor(Math.random() * ticketTypes.length)];
    const quantity = Math.floor(Math.random() * 8) + 1;
    const unitPrice = ticketType === "General" ? 40000 : ticketType === "VIP" ? 90000 : 150000;
    const total = quantity * unitPrice;
    const commissionRate = seller.level === 1 ? 0.075 : seller.level === 2 ? 0.10 : 0.15;

    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 15));
    date.setHours(Math.floor(Math.random() * 12) + 10);
    date.setMinutes(Math.floor(Math.random() * 60));

    return {
      id: `sale-${i + 1}`,
      date: date.toLocaleDateString("es-CO"),
      time: date.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }),
      seller: seller.name,
      sellerAvatar: seller.avatar,
      sellerLevel: seller.level,
      ticketType,
      quantity,
      unitPrice,
      total,
      commission: Math.round(total * commissionRate),
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
    };
  }).sort((a, b) => new Date(b.date + " " + b.time).getTime() - new Date(a.date + " " + a.time).getTime());
};

const levelColors: Record<number, string> = {
  1: "bg-neon-blue/20 text-neon-blue border-neon-blue/30",
  2: "bg-neon-orange/20 text-neon-orange border-neon-orange/30",
  3: "bg-neon-pink/20 text-neon-pink border-neon-pink/30",
  4: "bg-gradient-party text-white",
};

interface SalesHistoryPanelProps {
  eventId: string;
}

export function SalesHistoryPanel({ eventId }: SalesHistoryPanelProps) {
  const [sales] = useState<SaleRecord[]>(() => generateMockSales(eventId));
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<"date" | "total" | "quantity">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const itemsPerPage = 10;

  // Filter and sort sales
  const filteredSales = sales
    .filter((sale) => {
      const matchesSearch = sale.seller.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === "all" || sale.ticketType === filterType;
      const matchesStatus = filterStatus === "all" || sale.status === filterStatus;
      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortField === "date") {
        comparison = new Date(a.date + " " + a.time).getTime() - new Date(b.date + " " + b.time).getTime();
      } else if (sortField === "total") {
        comparison = a.total - b.total;
      } else if (sortField === "quantity") {
        comparison = a.quantity - b.quantity;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  const paginatedSales = filteredSales.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Summary stats
  const totalSalesValue = filteredSales.filter(s => s.status === "completed").reduce((sum, s) => sum + s.total, 0);
  const totalCommissions = filteredSales.filter(s => s.status === "completed").reduce((sum, s) => sum + s.commission, 0);
  const totalTickets = filteredSales.filter(s => s.status === "completed").reduce((sum, s) => sum + s.quantity, 0);

  const handleSort = (field: "date" | "total" | "quantity") => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const statusStyles = {
    completed: "bg-success/20 text-success border-success/30",
    pending: "bg-warning/20 text-warning border-warning/30",
    cancelled: "bg-destructive/20 text-destructive border-destructive/30",
  };

  const statusLabels = {
    completed: "Completada",
    pending: "Pendiente",
    cancelled: "Cancelada",
  };

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <TicketIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalTickets.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Tickets Vendidos</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-success/20 to-success/5 border-success/30">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/20">
              <DollarSign className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">${(totalSalesValue / 1000000).toFixed(1)}M</p>
              <p className="text-xs text-muted-foreground">Recaudo Total</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-warning/20 to-warning/5 border-warning/30">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/20">
              <DollarSign className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">${(totalCommissions / 1000000).toFixed(1)}M</p>
              <p className="text-xs text-muted-foreground">Comisiones</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-neon-pink/20 to-neon-pink/5 border-neon-pink/30">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-neon-pink/20">
              <Calendar className="w-5 h-5 text-neon-pink" />
            </div>
            <div>
              <p className="text-2xl font-bold">{filteredSales.length}</p>
              <p className="text-xs text-muted-foreground">Transacciones</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-card-elevated border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-3 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar vendedor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="General">General</SelectItem>
                  <SelectItem value="VIP">VIP</SelectItem>
                  <SelectItem value="Backstage">Backstage</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="completed">Completada</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="cancelled">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Exportar CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sales Table */}
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Historial de Transacciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead 
                    className="cursor-pointer hover:text-foreground"
                    onClick={() => handleSort("date")}
                  >
                    <div className="flex items-center gap-1">
                      Fecha/Hora
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </TableHead>
                  <TableHead>Vendedor</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:text-foreground"
                    onClick={() => handleSort("quantity")}
                  >
                    <div className="flex items-center gap-1">
                      Cantidad
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:text-foreground"
                    onClick={() => handleSort("total")}
                  >
                    <div className="flex items-center gap-1">
                      Total
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </TableHead>
                  <TableHead>Comisión</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedSales.map((sale, index) => (
                  <motion.tr
                    key={sale.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    className="border-border/50 hover:bg-muted/50"
                  >
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{sale.date}</span>
                        <span className="text-xs text-muted-foreground">{sale.time}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold",
                          levelColors[sale.sellerLevel]
                        )}>
                          {sale.sellerAvatar}
                        </div>
                        <span className="font-medium">{sale.seller}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={sale.ticketType === "VIP" ? "default" : sale.ticketType === "Backstage" ? "secondary" : "outline"}>
                        {sale.ticketType}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{sale.quantity}</TableCell>
                    <TableCell className="font-bold text-success">
                      ${sale.total.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-warning">
                      ${sale.commission.toLocaleString()}
                    </TableCell>
                    <TableCell>{sale.paymentMethod}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("border", statusStyles[sale.status])}>
                        {statusLabels[sale.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredSales.length)} de {filteredSales.length} transacciones
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                );
              })}
              {totalPages > 5 && <span className="text-muted-foreground">...</span>}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
