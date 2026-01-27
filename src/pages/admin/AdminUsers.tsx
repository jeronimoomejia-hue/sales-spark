import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  ArrowUpDown,
  Shield,
  TrendingUp,
  Download
} from "lucide-react";

const usersData = [
  {
    id: "PROMO-12345",
    name: "Juan Pérez",
    avatar: "JP",
    email: "juan.perez@email.com",
    phone: "+57 300 123 4567",
    level: 1,
    levelName: "Promotor Común",
    supervisor: "Carlos Ruiz",
    supervisorId: "HEAD-045",
    tickets: 127,
    commission: 952500,
    status: "active",
    joinDate: "2025-10-15"
  },
  {
    id: "HEAD-045",
    name: "Carlos Ruiz",
    avatar: "CR",
    email: "carlos.ruiz@email.com",
    phone: "+57 301 234 5678",
    level: 2,
    levelName: "Promotor Cabeza",
    supervisor: "Laura Martínez",
    supervisorId: "SUB-008",
    tickets: 1245,
    commission: 12450000,
    teamSize: 15,
    status: "active",
    joinDate: "2025-06-20"
  },
  {
    id: "HEAD-046",
    name: "Sandra García",
    avatar: "SG",
    email: "sandra.garcia@email.com",
    phone: "+57 302 345 6789",
    level: 2,
    levelName: "Promotor Cabeza",
    supervisor: "Laura Martínez",
    supervisorId: "SUB-008",
    tickets: 987,
    commission: 9870000,
    teamSize: 12,
    status: "active",
    joinDate: "2025-07-01"
  },
  {
    id: "SUB-008",
    name: "Laura Martínez",
    avatar: "LM",
    email: "laura.martinez@email.com",
    phone: "+57 303 456 7890",
    level: 3,
    levelName: "Sub Socio",
    supervisor: "Admin",
    supervisorId: "ADM-001",
    tickets: 3458,
    commission: 51870000,
    teamSize: 5,
    status: "active",
    joinDate: "2025-01-10"
  },
  {
    id: "PROMO-12346",
    name: "Ana María Torres",
    avatar: "AT",
    email: "ana.torres@email.com",
    phone: "+57 304 567 8901",
    level: 1,
    levelName: "Promotor Común",
    supervisor: "Carlos Ruiz",
    supervisorId: "HEAD-045",
    tickets: 72,
    commission: 540000,
    status: "active",
    joinDate: "2025-11-01"
  },
  {
    id: "PROMO-12347",
    name: "Luis Fernando Gómez",
    avatar: "LG",
    email: "luis.gomez@email.com",
    phone: "+57 305 678 9012",
    level: 1,
    levelName: "Promotor Común",
    supervisor: "Sandra García",
    supervisorId: "HEAD-046",
    tickets: 68,
    commission: 510000,
    status: "inactive",
    joinDate: "2025-09-15"
  },
  {
    id: "SUB-009",
    name: "Roberto Silva",
    avatar: "RS",
    email: "roberto.silva@email.com",
    phone: "+57 306 789 0123",
    level: 3,
    levelName: "Sub Socio",
    supervisor: "Admin",
    supervisorId: "ADM-001",
    tickets: 2890,
    commission: 43350000,
    teamSize: 4,
    status: "active",
    joinDate: "2025-02-28"
  }
];

const levelColors: Record<number, string> = {
  1: "secondary",
  2: "default",
  3: "warning",
  4: "destructive"
};

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<typeof usersData[0] | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const navigate = useNavigate();

  const filteredUsers = usersData.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === "all" || user.level.toString() === levelFilter;
    return matchesSearch && matchesLevel;
  });

  const totalUsers = usersData.length;
  const activeUsers = usersData.filter(u => u.status === "active").length;

  return (
    <DashboardLayout 
      title="Gestión de Usuarios" 
      subtitle="Administra todos los usuarios de la plataforma"
      userLevel={4}
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card variant="glass" className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Usuarios</p>
                <p className="text-2xl font-bold font-display">{totalUsers}</p>
              </div>
            </div>
          </Card>
          <Card variant="glass" className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/20">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Activos</p>
                <p className="text-2xl font-bold font-display">{activeUsers}</p>
              </div>
            </div>
          </Card>
          <Card variant="glass" className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/20">
                <Shield className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sub Socios</p>
                <p className="text-2xl font-bold font-display">{usersData.filter(u => u.level === 3).length}</p>
              </div>
            </div>
          </Card>
          <Card variant="glass" className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/20">
                <Users className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cabezas</p>
                <p className="text-2xl font-bold font-display">{usersData.filter(u => u.level === 2).length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card variant="glass" className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar por nombre, ID, email..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <select 
              className="p-2.5 rounded-lg bg-card border border-border text-foreground min-w-[150px]"
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
            >
              <option value="all">Todos los niveles</option>
              <option value="1">Promotor Común</option>
              <option value="2">Promotor Cabeza</option>
              <option value="3">Sub Socio</option>
              <option value="4">Socio</option>
            </select>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Más Filtros
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Exportar
            </Button>
            <Button variant="party" className="gap-2">
              <UserPlus className="w-4 h-4" />
              Crear Usuario
            </Button>
          </div>
        </Card>

        {/* Users Table */}
        <Card variant="glass" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-card-elevated">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    <button className="flex items-center gap-1 hover:text-foreground">
                      Usuario <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">ID</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Nivel</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Supervisor</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    <button className="flex items-center gap-1 hover:text-foreground">
                      Tickets <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Comisión</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Estado</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    className="border-b border-border/50 hover:bg-card-elevated/50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-party flex items-center justify-center text-white font-semibold">
                          {user.avatar}
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-sm text-primary">{user.id}</td>
                    <td className="p-4">
                      <Badge variant={levelColors[user.level] as any}>{user.levelName}</Badge>
                    </td>
                    <td className="p-4 text-sm">{user.supervisor}</td>
                    <td className="p-4 font-medium">{user.tickets.toLocaleString()}</td>
                    <td className="p-4 text-success font-medium">
                      ${(user.commission / 1000000).toFixed(1)}M
                    </td>
                    <td className="p-4">
                      <Badge variant={user.status === "active" ? "success" : "secondary"}>
                        {user.status === "active" ? "Activo" : "Inactivo"}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" title="Ver detalles">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          title="Editar usuario"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowRoleModal(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          title="Cambiar rol"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowRoleModal(true);
                          }}
                        >
                          <Shield className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-border flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Mostrando {filteredUsers.length} de {totalUsers} usuarios
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Anterior</Button>
              <Button variant="party" size="sm">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">Siguiente</Button>
            </div>
          </div>
        </Card>

        {/* Role Change Modal */}
        {showRoleModal && selectedUser && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-lg"
            >
              <Card variant="glass" className="p-6">
                <h2 className="text-xl font-bold mb-4">Cambiar Rol - {selectedUser.name}</h2>
                
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-card-elevated">
                    <p className="text-sm text-muted-foreground mb-1">Nivel Actual</p>
                    <div className="flex items-center gap-2">
                      <Badge variant={levelColors[selectedUser.level] as any}>{selectedUser.levelName}</Badge>
                      <span className="text-sm text-muted-foreground">• Supervisor: {selectedUser.supervisor}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">
                      Nuevo Nivel
                    </label>
                    <select className="w-full p-3 rounded-lg bg-card border border-border text-foreground">
                      <option value="1">Promotor Común</option>
                      <option value="2">Promotor Cabeza</option>
                      <option value="3">Sub Socio</option>
                      <option value="4">Socio</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">
                      Nuevo Supervisor
                    </label>
                    <select className="w-full p-3 rounded-lg bg-card border border-border text-foreground">
                      <option value="HEAD-045">Carlos Ruiz (Promotor Cabeza)</option>
                      <option value="HEAD-046">Sandra García (Promotor Cabeza)</option>
                      <option value="SUB-008">Laura Martínez (Sub Socio)</option>
                      <option value="SUB-009">Roberto Silva (Sub Socio)</option>
                      <option value="ADM-001">Admin (Socio)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">
                      Nueva Comisión por Ticket (COP)
                    </label>
                    <Input type="number" defaultValue="7500" />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">
                      Razón del Cambio (opcional)
                    </label>
                    <Input placeholder="Ej: Promoción por desempeño" />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button variant="outline" className="flex-1" onClick={() => setShowRoleModal(false)}>
                    Cancelar
                  </Button>
                  <Button variant="party" className="flex-1" onClick={() => setShowRoleModal(false)}>
                    Confirmar Cambio
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
