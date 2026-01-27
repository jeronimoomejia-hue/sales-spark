import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  UserPlus, 
  Search, 
  TrendingUp, 
  Trophy,
  MoreVertical,
  Eye,
  Edit,
  BarChart3
} from "lucide-react";

const teamMembers = [
  {
    id: "PROMO-12358",
    name: "Carlos Ruiz",
    avatar: "CR",
    level: 1,
    levelName: "Promotor Común",
    tickets: 85,
    target: 100,
    commission: 637500,
    lastSale: "Hace 2 horas",
    trend: 15,
    status: "active"
  },
  {
    id: "PROMO-12359",
    name: "Ana María Torres",
    avatar: "AT",
    level: 1,
    levelName: "Promotor Común",
    tickets: 72,
    target: 100,
    commission: 540000,
    lastSale: "Hace 5 horas",
    trend: 8,
    status: "active"
  },
  {
    id: "PROMO-12360",
    name: "Luis Fernando Gómez",
    avatar: "LG",
    level: 1,
    levelName: "Promotor Común",
    tickets: 68,
    target: 100,
    commission: 510000,
    lastSale: "Hace 1 día",
    trend: -5,
    status: "active"
  },
  {
    id: "PROMO-12361",
    name: "María José López",
    avatar: "ML",
    level: 1,
    levelName: "Promotor Común",
    tickets: 58,
    target: 100,
    commission: 435000,
    lastSale: "Hace 3 horas",
    trend: 12,
    status: "active"
  },
  {
    id: "PROMO-12362",
    name: "Pedro Díaz",
    avatar: "PD",
    level: 1,
    levelName: "Promotor Común",
    tickets: 52,
    target: 100,
    commission: 390000,
    lastSale: "Hace 8 horas",
    trend: 3,
    status: "active"
  },
  {
    id: "PROMO-12363",
    name: "Sandra Milena Castro",
    avatar: "SC",
    level: 1,
    levelName: "Promotor Común",
    tickets: 45,
    target: 100,
    commission: 337500,
    lastSale: "Hace 2 días",
    trend: -10,
    status: "inactive"
  }
];

export default function Equipo() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalTickets = teamMembers.reduce((sum, m) => sum + m.tickets, 0);
  const totalCommission = teamMembers.reduce((sum, m) => sum + m.commission, 0);

  return (
    <DashboardLayout 
      title="Mi Equipo" 
      subtitle="Gestión de promotores a tu cargo"
      userLevel={2}
    >
      <div className="space-y-6">
        {/* Team Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card variant="glass" className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Miembros</p>
                <p className="text-2xl font-bold font-display">{teamMembers.length}</p>
              </div>
            </div>
          </Card>
          <Card variant="glass" className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/20">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ventas Equipo</p>
                <p className="text-2xl font-bold font-display">{totalTickets}</p>
              </div>
            </div>
          </Card>
          <Card variant="glass" className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/20">
                <Trophy className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Top Seller</p>
                <p className="text-lg font-bold font-display">Carlos Ruiz</p>
              </div>
            </div>
          </Card>
          <Card variant="glass" className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/20">
                <BarChart3 className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Comisiones</p>
                <p className="text-2xl font-bold font-display">${(totalCommission / 1000000).toFixed(1)}M</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Search and Actions */}
        <Card variant="glass" className="p-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex-1 min-w-[200px] max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar por nombre o ID..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Button variant="party" className="gap-2">
              <UserPlus className="w-4 h-4" />
              Agregar Promotor
            </Button>
          </div>
        </Card>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card variant="glass" className="p-5 hover:border-primary/30 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-party flex items-center justify-center text-white font-bold">
                        {member.avatar}
                      </div>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-card ${
                        member.status === 'active' ? 'bg-success' : 'bg-muted'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{member.name}</h3>
                      <p className="text-xs text-muted-foreground font-mono">{member.id}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{member.levelName}</Badge>
                    <div className={`flex items-center gap-1 text-sm ${
                      member.trend >= 0 ? 'text-success' : 'text-destructive'
                    }`}>
                      <TrendingUp className={`w-3 h-3 ${member.trend < 0 ? 'rotate-180' : ''}`} />
                      {Math.abs(member.trend)}%
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Ventas mes</span>
                      <span className="font-medium">{member.tickets}/{member.target}</span>
                    </div>
                    <Progress 
                      value={(member.tickets / member.target) * 100} 
                      size="sm"
                      indicatorColor={member.tickets >= member.target * 0.8 ? "success" : "party"}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">Comisión</p>
                      <p className="font-semibold text-success">${member.commission.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Última venta</p>
                      <p className="text-sm">{member.lastSale}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1 gap-1">
                      <Eye className="w-3 h-3" />
                      Ver
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 gap-1">
                      <Edit className="w-3 h-3" />
                      Editar
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
