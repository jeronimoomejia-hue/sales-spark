import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Download,
  BarChart3,
  LayoutGrid,
  List,
  Trophy,
  DollarSign,
  TicketIcon,
  ChevronRight,
  ChevronDown,
  Headphones,
  FileText,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { organizationData, TeamMember, getTotalSales, events, salesData } from "@/data/mockData";
import { SalesPerformanceModal } from "@/components/modals/SalesPerformanceModal";
import { SalesDetailModal } from "@/components/modals/SalesDetailModal";
import { LevelConfigurationModal } from "@/components/admin/LevelConfigurationModal";
import { TemplateManagementModal } from "@/components/admin/TemplateManagementModal";
import { MemberEditModal } from "@/components/admin/MemberEditModal";
import { OrganizationalStructureEditor } from "@/components/admin/OrganizationalStructureEditor";

const levelColors: Record<number, string> = {
  1: "bg-neon-blue/20 text-neon-blue border-neon-blue/30",
  2: "bg-neon-orange/20 text-neon-orange border-neon-orange/30",
  3: "bg-neon-pink/20 text-neon-pink border-neon-pink/30",
  4: "bg-gradient-party text-white",
};

interface GlobalTreeNodeProps {
  member: TeamMember;
  depth?: number;
  onViewDetails: (member: TeamMember) => void;
  onEditMember: (member: TeamMember) => void;
  maxSales: number;
  editorLevel: number;
}

function GlobalTreeNode({ member, depth = 0, onViewDetails, onEditMember, maxSales, editorLevel }: GlobalTreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(depth < 2);
  const hasChildren = member.children && member.children.length > 0;
  const canEdit = editorLevel > member.level;

  const totalSales = getTotalSales(member, 'total');
  const monthSales = getTotalSales(member, 'month');
  const commission = member.ownSales.total * member.commissionPerTicket;
  const performancePercentage = maxSales > 0 ? (totalSales / maxSales) * 100 : 0;
  const isTopPerformer = performancePercentage > 80;
  const isLowPerformer = performancePercentage < 30;

  return (
    <div className="relative">
      {depth > 0 && (
        <div 
          className="absolute left-0 top-0 w-px h-full bg-border"
          style={{ left: -12 }}
        />
      )}

      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, delay: depth * 0.05 }}
        className={cn(
          "flex items-center gap-3 p-3 rounded-lg hover:bg-card-elevated transition-colors cursor-pointer group border border-transparent",
          depth > 0 && "ml-6",
          isTopPerformer && "border-success/30 bg-success/5",
          isLowPerformer && "border-destructive/30 bg-destructive/5"
        )}
      >
        {hasChildren ? (
          <button 
            className="p-1 rounded hover:bg-muted transition-colors"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        ) : (
          <div className="w-6" />
        )}

        <div className="relative">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0",
            levelColors[member.level]
          )}>
            {member.avatar}
          </div>
          {isTopPerformer && (
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-success flex items-center justify-center">
              <Trophy className="w-2.5 h-2.5 text-white" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0" onClick={() => onViewDetails(member)}>
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm truncate">{member.name}</span>
            <Badge 
              variant="outline" 
              className={cn("text-xs shrink-0 border", levelColors[member.level])}
            >
              {member.levelName}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 mt-1.5">
            <Progress 
              value={performancePercentage} 
              className={cn(
                "h-1.5 flex-1",
                isTopPerformer && "[&>div]:bg-success",
                isLowPerformer && "[&>div]:bg-destructive"
              )} 
            />
            <span className="text-xs text-muted-foreground w-8">{Math.round(performancePercentage)}%</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-right">
          <div>
            <div className="flex items-center gap-1 justify-end">
              <TicketIcon className="w-3 h-3 text-primary" />
              <span className="text-sm font-bold">{totalSales.toLocaleString()}</span>
            </div>
            <p className="text-xs text-muted-foreground">histórico total</p>
          </div>
          <div>
            <div className="flex items-center gap-1 justify-end">
              <TrendingUp className="w-3 h-3 text-success" />
              <span className="text-sm font-bold text-success">{monthSales}</span>
            </div>
            <p className="text-xs text-muted-foreground">este mes</p>
          </div>
          <div>
            <div className="flex items-center gap-1 justify-end">
              <DollarSign className="w-3 h-3 text-warning" />
              <span className="text-sm font-bold text-warning">
                ${(commission / 1000000).toFixed(1)}M
              </span>
            </div>
            <p className="text-xs text-muted-foreground">comisión total</p>
          </div>
        </div>

        {/* Edit Button */}
        {canEdit && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-1 text-primary"
            onClick={(e) => {
              e.stopPropagation();
              onEditMember(member);
            }}
          >
            <Edit className="w-4 h-4" />
            Editar
          </Button>
        )}

        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1"
          onClick={() => onViewDetails(member)}
        >
          <Eye className="w-4 h-4" />
          Ver más
        </Button>
      </motion.div>

      {hasChildren && isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="relative ml-6 pl-4 border-l border-border"
        >
          {member.children!.map((child) => (
            <GlobalTreeNode 
              key={child.id} 
              member={child} 
              depth={depth + 1}
              onViewDetails={onViewDetails}
              onEditMember={onEditMember}
              maxSales={maxSales}
              editorLevel={editorLevel}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("estructura");
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showSalesModal, setShowSalesModal] = useState(false);
  const [showLevelConfigModal, setShowLevelConfigModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isEditingStructure, setIsEditingStructure] = useState(false);
  const editorLevel = 4; // Current user is Socio level
  const navigate = useNavigate();

  const handleViewDetails = (member: TeamMember) => {
    setSelectedMember(member);
    setShowDetailModal(true);
  };

  const handleEditMember = (member: TeamMember) => {
    setEditingMember(member);
    setShowEditModal(true);
  };

  const handleSaveMember = (member: TeamMember, newParentId?: string) => {
    console.log("Saving member:", member, "New parent:", newParentId);
    // In a real app, this would update the database and reorganize the hierarchy
  };

  const handleDeleteMember = (memberId: string) => {
    console.log("Deleting member:", memberId);
  };

  // Collect all members by level for supervisor assignment
  const collectMembersByLevel = (member: TeamMember, collection: TeamMember[] = []): TeamMember[] => {
    collection.push(member);
    member.children?.forEach(child => collectMembersByLevel(child, collection));
    return collection;
  };
  
  const allMembers = collectMembersByLevel(organizationData);
  const getAvailableSupervisors = (forLevel: number): TeamMember[] => {
    // Supervisors should be at the level above
    return allMembers.filter(m => m.level === forLevel + 1);
  };

  // Calculate max sales for performance comparison
  const calculateMaxSales = (member: TeamMember): number => {
    const ownTotal = getTotalSales(member, 'total');
    const childMax = member.children 
      ? Math.max(...member.children.map(c => calculateMaxSales(c)), 0)
      : 0;
    return Math.max(ownTotal, childMax);
  };

  const maxSales = calculateMaxSales(organizationData);

  // Calculate level counts
  const countByLevel = (member: TeamMember, counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 }): Record<number, number> => {
    counts[member.level] = (counts[member.level] || 0) + 1;
    member.children?.forEach(child => countByLevel(child, counts));
    return counts;
  };
  
  const levelCounts = countByLevel(organizationData);
  const totalUsers = Object.values(levelCounts).reduce((a, b) => a + b, 0);
  const totalSales = getTotalSales(organizationData, 'total') + organizationData.teamSales.total;
  const totalCommission = organizationData.ownSales.total * organizationData.commissionPerTicket;

  return (
    <DashboardLayout 
      title="Gestión de Vendedores" 
      subtitle="Vista global del equipo de ventas y su estructura organizacional"
      userLevel={4}
    >
      <div className="space-y-6">
        {/* Hero Stats */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-card via-card-elevated to-card border-2 border-primary/20 p-6">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-party opacity-10 blur-3xl" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-party">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold font-display">Equipo de Ventas Global</h2>
                  <p className="text-muted-foreground">Datos consolidados de todos los eventos</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={() => setShowLevelConfigModal(true)}
                >
                  <Settings className="w-4 h-4" />
                  Configurar Niveles
                </Button>
                <Button variant="outline" className="gap-2">
                  <Headphones className="w-4 h-4" />
                  Soporte
                </Button>
                <Button variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  Exportar
                </Button>
                <Button variant="party" className="gap-2">
                  <UserPlus className="w-4 h-4" />
                  Nuevo Vendedor
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-4">
              <div className="p-4 rounded-xl bg-gradient-party/10 border border-neon-purple/20 text-center">
                <p className="text-3xl font-bold font-display text-neon-purple">{levelCounts[4]}</p>
                <p className="text-sm text-muted-foreground">Socios</p>
              </div>
              <div className="p-4 rounded-xl bg-neon-pink/10 border border-neon-pink/20 text-center">
                <p className="text-3xl font-bold font-display text-neon-pink">{levelCounts[3]}</p>
                <p className="text-sm text-muted-foreground">Sub Socios</p>
              </div>
              <div className="p-4 rounded-xl bg-neon-orange/10 border border-neon-orange/20 text-center">
                <p className="text-3xl font-bold font-display text-neon-orange">{levelCounts[2]}</p>
                <p className="text-sm text-muted-foreground">Cabezas</p>
              </div>
              <div className="p-4 rounded-xl bg-neon-blue/10 border border-neon-blue/20 text-center">
                <p className="text-3xl font-bold font-display text-neon-blue">{levelCounts[1]}</p>
                <p className="text-sm text-muted-foreground">Comunes</p>
              </div>
              <div className="p-4 rounded-xl bg-success/10 border border-success/20 text-center">
                <p className="text-3xl font-bold font-display text-success">{totalSales.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Tickets Totales</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="estructura" className="gap-2">
                <Settings className="w-4 h-4" />
                Estructura
              </TabsTrigger>
              <TabsTrigger value="organigrama" className="gap-2">
                <LayoutGrid className="w-4 h-4" />
                Rendimiento
              </TabsTrigger>
              <TabsTrigger value="plantillas" className="gap-2">
                <FileText className="w-4 h-4" />
                Plantillas
              </TabsTrigger>
              <TabsTrigger value="lista" className="gap-2">
                <List className="w-4 h-4" />
                Lista
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar vendedor..." 
                  className="pl-10 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select 
                className="p-2.5 rounded-lg bg-card border border-border text-foreground"
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
              >
                <option value="all">Todos los niveles</option>
                <option value="1">Promotor Común</option>
                <option value="2">Promotor Cabeza</option>
                <option value="3">Sub Socio</option>
                <option value="4">Socio</option>
              </select>
            </div>
          </div>

          {/* Estructura Tab - Editable */}
          <TabsContent value="estructura">
            {isEditingStructure ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Edit className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold">Editando Estructura</h3>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditingStructure(false)}
                  >
                    Cerrar Editor
                  </Button>
                </div>
                <OrganizationalStructureEditor 
                  onConfigureLevels={() => setShowLevelConfigModal(true)}
                />
              </div>
            ) : (
              <Card variant="neon" className="border-2 border-primary/20">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Users className="w-5 h-5 text-primary" />
                    Estructura Organizacional
                    <Badge variant="secondary" className="ml-2">Vista General</Badge>
                  </CardTitle>
                  <Button 
                    variant="party" 
                    className="gap-2"
                    onClick={() => setIsEditingStructure(true)}
                  >
                    <Edit className="w-4 h-4" />
                    Editar Estructura
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border mb-4">
                    <p className="text-sm text-muted-foreground">
                      Esta es la estructura organizacional general de tu empresa. Haz clic en "Editar Estructura" para añadir, eliminar o reasignar miembros del equipo.
                    </p>
                  </div>
                  
                  {/* Read-only tree view */}
                  <div className="space-y-2">
                    <GlobalTreeNode
                      member={organizationData}
                      onViewDetails={handleViewDetails}
                      onEditMember={handleEditMember}
                      maxSales={maxSales}
                      editorLevel={editorLevel}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Rendimiento Tab - Read only with performance data */}
          <TabsContent value="organigrama">
            <Card variant="neon" className="border-2 border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Estructura Organizacional - Datos Globales
                  <Badge variant="secondary" className="ml-2">Histórico Total</Badge>
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2"
                  onClick={() => setShowSalesModal(true)}
                >
                  <Eye className="w-4 h-4" />
                  Ver todas las ventas
                </Button>
              </CardHeader>
              <CardContent>
                {/* Performance Legend */}
                <div className="flex items-center justify-between p-3 mb-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-muted-foreground">Leyenda:</span>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-success" />
                      <span>Top Performer (+80%)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      <span>Normal</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-destructive" />
                      <span>Bajo Rendimiento (-30%)</span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Total: <span className="font-bold text-foreground">{totalUsers} vendedores</span> | 
                    <span className="font-bold text-success ml-1">${(totalCommission / 1000000).toFixed(1)}M comisiones</span>
                  </div>
                </div>

                {/* Tree */}
                <div className="max-h-[500px] overflow-y-auto pr-2">
                  {organizationData.children?.map((subSocio) => (
                    <GlobalTreeNode 
                      key={subSocio.id} 
                      member={subSocio} 
                      onViewDetails={handleViewDetails}
                      onEditMember={handleEditMember}
                      maxSales={maxSales}
                      editorLevel={editorLevel}
                    />
                  ))}
                </div>

                {/* Footer */}
                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Mostrando datos consolidados de <span className="font-bold text-primary">{events.length} eventos</span>
                  </p>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Headphones className="w-4 h-4" />
                      Soporte
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1 text-primary" onClick={() => handleViewDetails(organizationData)}>
                      Ver mapa visual completo
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Plantillas Tab */}
          <TabsContent value="plantillas">
            <Card variant="glass">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Plantillas de Alineación
                </CardTitle>
                <Button 
                  variant="party" 
                  className="gap-2"
                  onClick={() => setShowTemplateModal(true)}
                >
                  <Settings className="w-4 h-4" />
                  Gestionar Plantillas
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { name: "Plantilla Conciertos Grandes", members: 45, events: 12, lastUsed: "Hace 2 días" },
                    { name: "Plantilla Festivales", members: 120, events: 5, lastUsed: "Hace 1 semana" },
                    { name: "Plantilla Eventos Pequeños", members: 15, events: 25, lastUsed: "Ayer" },
                    { name: "Plantilla VIP Only", members: 8, events: 8, lastUsed: "Hace 3 días" },
                  ].map((template, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <Card variant="glass" className="p-4 hover:border-primary/30 transition-colors cursor-pointer">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 rounded-lg bg-primary/20">
                            <Users className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{template.name}</h4>
                            <p className="text-xs text-muted-foreground">{template.lastUsed}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-center">
                          <div className="p-2 rounded bg-card-elevated">
                            <p className="text-lg font-bold">{template.members}</p>
                            <p className="text-xs text-muted-foreground">Vendedores</p>
                          </div>
                          <div className="p-2 rounded bg-card-elevated">
                            <p className="text-lg font-bold">{template.events}</p>
                            <p className="text-xs text-muted-foreground">Eventos usados</p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 gap-1"
                            onClick={() => setShowTemplateModal(true)}
                          >
                            <Eye className="w-3 h-3" />
                            Ver más
                          </Button>
                          <Button variant="party" size="sm" className="flex-1 gap-1">
                            <Edit className="w-3 h-3" />
                            Usar
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">4 plantillas guardadas</p>
                  <Button 
                    variant="outline" 
                    className="gap-2"
                    onClick={() => setShowTemplateModal(true)}
                  >
                    <UserPlus className="w-4 h-4" />
                    Crear Nueva Plantilla
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Lista Tab */}
          <TabsContent value="lista">
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
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Nivel</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Equipo</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                        <button className="flex items-center gap-1 hover:text-foreground">
                          Tickets Mes <ArrowUpDown className="w-3 h-3" />
                        </button>
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Tickets Total</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Comisión</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const flattenMembers = (member: TeamMember): TeamMember[] => {
                        return [member, ...(member.children?.flatMap(flattenMembers) || [])];
                      };
                      const allMembers = organizationData.children?.flatMap(flattenMembers) || [];
                      
                      return allMembers.map((member, index) => (
                        <motion.tr
                          key={member.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.02 }}
                          className="border-b border-border/50 hover:bg-card-elevated/50 transition-colors"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center font-semibold",
                                levelColors[member.level]
                              )}>
                                {member.avatar}
                              </div>
                              <div>
                                <p className="font-medium">{member.name}</p>
                                <p className="text-sm text-muted-foreground font-mono">{member.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant="outline" className={cn("border", levelColors[member.level])}>
                              {member.levelName}
                            </Badge>
                          </td>
                          <td className="p-4 text-sm">{member.teamSize || 0} personas</td>
                          <td className="p-4 font-medium">{member.ownSales.month + member.teamSales.month}</td>
                          <td className="p-4 font-bold text-primary">
                            {(member.ownSales.total + member.teamSales.total).toLocaleString()}
                          </td>
                          <td className="p-4 text-success font-medium">
                            ${((member.ownSales.total * member.commissionPerTicket) / 1000000).toFixed(1)}M
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="gap-1"
                                onClick={() => handleViewDetails(member)}
                              >
                                <Eye className="w-4 h-4" />
                                Ver más
                              </Button>
                            </div>
                          </td>
                        </motion.tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Sales Performance Modal - Global Data */}
      <SalesPerformanceModal
        open={showDetailModal}
        onOpenChange={setShowDetailModal}
        member={selectedMember || undefined}
        selectedEventId="all"
      />

      {/* All Sales Modal */}
      <SalesDetailModal
        open={showSalesModal}
        onOpenChange={setShowSalesModal}
        title="Todas las Ventas - Histórico Global"
      />

      {/* Level Configuration Modal */}
      <LevelConfigurationModal
        open={showLevelConfigModal}
        onOpenChange={setShowLevelConfigModal}
      />

      {/* Template Management Modal */}
      <TemplateManagementModal
        open={showTemplateModal}
        onOpenChange={setShowTemplateModal}
      />

      {/* Member Edit Modal */}
      <MemberEditModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        member={editingMember}
        editorLevel={editorLevel}
        availableSupervisors={editingMember ? getAvailableSupervisors(editingMember.level) : []}
        onSave={handleSaveMember}
        onDelete={handleDeleteMember}
      />
    </DashboardLayout>
  );
}