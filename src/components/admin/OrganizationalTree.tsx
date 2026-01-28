import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ChevronRight, 
  ChevronDown, 
  Users, 
  TicketIcon,
  Download,
  Expand,
  Minimize2,
  Eye,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Trophy,
  BarChart3,
  Headphones,
  Edit,
  UserPlus,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { organizationData, TeamMember, getTotalSales, getEventSales, events } from "@/data/mockData";
import { SalesPerformanceModal } from "@/components/modals/SalesPerformanceModal";
import { MemberEditModal } from "@/components/admin/MemberEditModal";

interface OrganizationalTreeProps {
  selectedEventId?: string | 'all';
  editorLevel?: number; // Level of the current user (for edit permissions)
  showEditControls?: boolean;
}

const levelColors: Record<number, string> = {
  1: "bg-neon-blue/20 text-neon-blue border-neon-blue/30",
  2: "bg-neon-orange/20 text-neon-orange border-neon-orange/30",
  3: "bg-neon-pink/20 text-neon-pink border-neon-pink/30",
  4: "bg-gradient-party text-white",
};

const levelAvatarColors: Record<number, string> = {
  1: "bg-neon-blue/20 text-neon-blue",
  2: "bg-neon-orange/20 text-neon-orange",
  3: "bg-neon-pink/20 text-neon-pink",
  4: "bg-gradient-party text-white",
};

interface TreeNodeProps {
  member: TeamMember;
  depth?: number;
  defaultExpanded?: boolean;
  selectedEventId: string | 'all';
  onViewDetails: (member: TeamMember) => void;
  onEditMember?: (member: TeamMember) => void;
  maxSales: number;
  editorLevel: number;
  showEditControls: boolean;
}

function TreeNode({ member, depth = 0, defaultExpanded = false, selectedEventId, onViewDetails, onEditMember, maxSales, editorLevel, showEditControls }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded || depth < 2);
  const hasChildren = member.children && member.children.length > 0;
  const canEdit = editorLevel > member.level;

  // Get sales based on event filter
  const getDisplaySales = () => {
    if (selectedEventId === 'all') {
      return {
        own: member.ownSales.month,
        team: member.teamSales.month,
        total: getTotalSales(member, 'month'),
        commission: member.ownSales.month * member.commissionPerTicket
      };
    }
    const eventSales = getEventSales(member, selectedEventId);
    return {
      own: eventSales.own,
      team: eventSales.team,
      total: eventSales.total,
      commission: eventSales.ownCommission
    };
  };

  const sales = getDisplaySales();
  const performancePercentage = maxSales > 0 ? (sales.total / maxSales) * 100 : 0;
  const isTopPerformer = performancePercentage > 80;
  const isLowPerformer = performancePercentage < 30;

  return (
    <div className="relative">
      {/* Connector line */}
      {depth > 0 && (
        <div 
          className="absolute left-0 top-0 w-px h-full bg-border"
          style={{ left: -12 }}
        />
      )}

      {/* Node */}
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
        {/* Expand/Collapse */}
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

        {/* Avatar with performance indicator */}
        <div className="relative">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0",
            levelAvatarColors[member.level]
          )}>
            {member.avatar}
          </div>
          {isTopPerformer && (
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-success flex items-center justify-center">
              <Trophy className="w-2.5 h-2.5 text-white" />
            </div>
          )}
        </div>

        {/* Info */}
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
          
          {/* Performance Bar */}
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

        {/* Sales Stats */}
        <div className="flex items-center gap-4 text-right">
          <div>
            <div className="flex items-center gap-1 justify-end">
              <TicketIcon className="w-3 h-3 text-primary" />
              <span className="text-sm font-bold">{sales.own}</span>
            </div>
            <p className="text-xs text-muted-foreground">propias</p>
          </div>
          {sales.team > 0 && (
            <div>
              <div className="flex items-center gap-1 justify-end">
                <Users className="w-3 h-3 text-success" />
                <span className="text-sm font-bold text-success">+{sales.team}</span>
              </div>
              <p className="text-xs text-muted-foreground">equipo</p>
            </div>
          )}
          <div>
            <div className="flex items-center gap-1 justify-end">
              <DollarSign className="w-3 h-3 text-warning" />
              <span className="text-sm font-bold text-warning">
                ${(sales.commission / 1000000).toFixed(1)}M
              </span>
            </div>
            <p className="text-xs text-muted-foreground">comisión</p>
          </div>
        </div>

        {/* Trend Indicator */}
        <div className={cn(
          "flex items-center gap-1 px-2 py-1 rounded text-xs",
          isTopPerformer ? "bg-success/20 text-success" : 
          isLowPerformer ? "bg-destructive/20 text-destructive" : 
          "bg-muted text-muted-foreground"
        )}>
          {isTopPerformer ? (
            <>
              <TrendingUp className="w-3 h-3" />
              +12%
            </>
          ) : isLowPerformer ? (
            <>
              <TrendingDown className="w-3 h-3" />
              -8%
            </>
          ) : (
            <>
              <TrendingUp className="w-3 h-3" />
              +5%
            </>
          )}
        </div>

        {/* Edit Button - only shown if user can edit this member */}
        {showEditControls && canEdit && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-1 text-primary"
            onClick={(e) => {
              e.stopPropagation();
              onEditMember?.(member);
            }}
          >
            <Edit className="w-4 h-4" />
            Editar
          </Button>
        )}

        {/* View Details Button */}
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

      {/* Children */}
      <AnimatePresence>
        {hasChildren && isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="relative ml-6 pl-4 border-l border-border"
          >
            {member.children!.map((child) => (
              <TreeNode 
                key={child.id} 
                member={child} 
                depth={depth + 1}
                selectedEventId={selectedEventId}
                onViewDetails={onViewDetails}
                onEditMember={onEditMember}
                maxSales={maxSales}
                editorLevel={editorLevel}
                showEditControls={showEditControls}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function OrganizationalTree({ selectedEventId = 'all', editorLevel = 4, showEditControls = true }: OrganizationalTreeProps) {
  const [allExpanded, setAllExpanded] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleViewDetails = (member: TeamMember) => {
    setSelectedMember(member);
    setShowDetailModal(true);
  };

  const handleEditMember = (member: TeamMember) => {
    setEditingMember(member);
    setShowEditModal(true);
  };

  const handleSaveMember = (member: TeamMember, newParentId?: string) => {
    // In a real app, this would update the database
    console.log("Saving member:", member, "New parent:", newParentId);
  };

  const handleDeleteMember = (memberId: string) => {
    // In a real app, this would delete from the database
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
    return allMembers.filter(m => m.level === forLevel + 1);
  };

  // Calculate max sales for performance comparison
  const calculateMaxSales = (member: TeamMember): number => {
    const ownTotal = selectedEventId === 'all' 
      ? getTotalSales(member, 'month')
      : getEventSales(member, selectedEventId).total;
    
    const childMax = member.children 
      ? Math.max(...member.children.map(c => calculateMaxSales(c)), 0)
      : 0;
    
    return Math.max(ownTotal, childMax);
  };

  const maxSales = calculateMaxSales(organizationData);

  // Calculate totals based on event filter
  const getTotalStats = () => {
    if (selectedEventId === 'all') {
      return {
        totalTickets: getTotalSales(organizationData, 'month') + organizationData.teamSales.month,
        teamOwnSales: organizationData.ownSales.month,
        teamSales: organizationData.teamSales.month
      };
    }
    const eventSales = getEventSales(organizationData, selectedEventId);
    return {
      totalTickets: eventSales.total,
      teamOwnSales: eventSales.own,
      teamSales: eventSales.team
    };
  };

  const stats = getTotalStats();

  // Calculate level counts
  const countByLevel = (member: TeamMember, counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 }): Record<number, number> => {
    counts[member.level] = (counts[member.level] || 0) + 1;
    member.children?.forEach(child => countByLevel(child, counts));
    return counts;
  };
  
  const levelCounts = countByLevel(organizationData);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card variant="neon" className="border-2 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center gap-2 text-xl">
              <BarChart3 className="w-5 h-5 text-primary" />
              Ventas por Estructura Organizacional
              <Badge variant="secondary" className="ml-2">
                {selectedEventId === 'all' ? 'Todos los eventos' : events.find(e => e.id === selectedEventId)?.name}
              </Badge>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Headphones className="w-4 h-4" />
                Soporte
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => setAllExpanded(!allExpanded)}
              >
                {allExpanded ? (
                  <>
                    <Minimize2 className="w-4 h-4" />
                    Colapsar
                  </>
                ) : (
                  <>
                    <Expand className="w-4 h-4" />
                    Expandir
                  </>
                )}
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Exportar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Summary stats by level */}
            <div className="grid grid-cols-4 gap-3 p-4 mb-4 rounded-lg bg-card-elevated">
              <div className="text-center p-2 rounded-lg bg-gradient-party/10 border border-neon-purple/20">
                <p className="text-2xl font-bold font-display text-neon-purple">{levelCounts[4]}</p>
                <p className="text-xs text-muted-foreground">Socios</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-neon-pink/10 border border-neon-pink/20">
                <p className="text-2xl font-bold font-display text-neon-pink">{levelCounts[3]}</p>
                <p className="text-xs text-muted-foreground">Sub Socios</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-neon-orange/10 border border-neon-orange/20">
                <p className="text-2xl font-bold font-display text-neon-orange">{levelCounts[2]}</p>
                <p className="text-xs text-muted-foreground">Cabezas</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-neon-blue/10 border border-neon-blue/20">
                <p className="text-2xl font-bold font-display text-neon-blue">{levelCounts[1]}</p>
                <p className="text-xs text-muted-foreground">Comunes</p>
              </div>
            </div>

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
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Meta máxima: <span className="font-bold text-foreground">{maxSales} tickets</span>
                </span>
              </div>
            </div>

            {/* Aggregated Sales Info */}
            <div className="p-4 mb-4 rounded-lg bg-gradient-to-r from-primary/10 to-success/10 border border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Ventas Totales Agregadas</p>
                    <p className="text-xs text-muted-foreground">Las ventas de subordinados se acumulan hacia arriba</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xl font-bold font-display text-primary">
                      {stats.teamOwnSales.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">ventas directas</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold font-display text-success">
                      +{stats.teamSales.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">ventas de equipo</p>
                  </div>
                  <div className="text-right border-l pl-4 border-border">
                    <p className="text-2xl font-bold font-display text-gradient-party">
                      {stats.totalTickets.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">tickets totales</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tree */}
            <div className="max-h-[500px] overflow-y-auto pr-2">
              {organizationData.children?.map((subSocio) => (
                <TreeNode 
                  key={subSocio.id} 
                  member={subSocio} 
                  defaultExpanded={allExpanded}
                  selectedEventId={selectedEventId}
                  onViewDetails={handleViewDetails}
                  onEditMember={handleEditMember}
                  maxSales={maxSales}
                  editorLevel={editorLevel}
                  showEditControls={showEditControls}
                />
              ))}
            </div>

            {/* Total */}
            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Total: <span className="font-bold text-foreground">{Object.values(levelCounts).reduce((a, b) => a + b, 0)} usuarios</span> | 
                <span className="font-bold text-success ml-1">{stats.totalTickets.toLocaleString()} tickets vendidos</span>
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
      </motion.div>

      {/* Sales Performance Modal */}
      <SalesPerformanceModal
        open={showDetailModal}
        onOpenChange={setShowDetailModal}
        member={selectedMember || undefined}
        selectedEventId={selectedEventId}
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
    </>
  );
}
