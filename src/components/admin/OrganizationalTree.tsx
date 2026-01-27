import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronRight, 
  ChevronDown, 
  Users, 
  TicketIcon,
  Download,
  Expand,
  Minimize2,
  Eye,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { organizationData, TeamMember, getTotalSales, getEventSales, events } from "@/data/mockData";
import { TeamDetailModal } from "@/components/modals/TeamDetailModal";

interface OrganizationalTreeProps {
  selectedEventId?: string | 'all';
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
}

function TreeNode({ member, depth = 0, defaultExpanded = false, selectedEventId, onViewDetails }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded || depth < 2);
  const hasChildren = member.children && member.children.length > 0;

  // Get sales based on event filter
  const getDisplaySales = () => {
    if (selectedEventId === 'all') {
      return getTotalSales(member, 'month');
    }
    const eventSales = getEventSales(member, selectedEventId);
    return eventSales.total;
  };

  const displaySales = getDisplaySales();

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
          "flex items-center gap-3 p-3 rounded-lg hover:bg-card-elevated transition-colors cursor-pointer group",
          depth > 0 && "ml-6"
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

        {/* Avatar */}
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0",
          levelAvatarColors[member.level]
        )}>
          {member.avatar}
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
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <TicketIcon className="w-3 h-3" />
              {displaySales.toLocaleString()} tickets
              {member.teamSales.month > 0 && (
                <span className="text-success ml-1">
                  (+{(selectedEventId === 'all' ? member.teamSales.month : getEventSales(member, selectedEventId).team)} equipo)
                </span>
              )}
            </span>
            {member.teamSize && (
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {member.teamSize} personas
              </span>
            )}
          </div>
        </div>

        {/* View Details Button */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="opacity-0 group-hover:opacity-100 transition-opacity gap-1"
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
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function OrganizationalTree({ selectedEventId = 'all' }: OrganizationalTreeProps) {
  const [allExpanded, setAllExpanded] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const handleViewDetails = (member: TeamMember) => {
    setSelectedMember(member);
    setShowDetailModal(true);
  };

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
              🌐 Estructura Organizacional
              <Badge variant="secondary" className="ml-2">
                {selectedEventId === 'all' ? 'Todos los eventos' : events.find(e => e.id === selectedEventId)?.name}
              </Badge>
            </CardTitle>
            <div className="flex items-center gap-2">
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
            {/* Summary stats */}
            <div className="grid grid-cols-4 gap-3 p-4 mb-4 rounded-lg bg-card-elevated">
              <div className="text-center">
                <p className="text-2xl font-bold font-display text-neon-purple">3</p>
                <p className="text-xs text-muted-foreground">Socios</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold font-display text-neon-pink">12</p>
                <p className="text-xs text-muted-foreground">Sub Socios</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold font-display text-neon-orange">22</p>
                <p className="text-xs text-muted-foreground">Cabezas</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold font-display text-neon-blue">52</p>
                <p className="text-xs text-muted-foreground">Comunes</p>
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
                <div className="text-right">
                  <p className="text-2xl font-bold font-display text-gradient-party">
                    {stats.totalTickets.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">tickets totales</p>
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
                />
              ))}
            </div>

            {/* Total */}
            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Total: <span className="font-bold text-foreground">89 usuarios</span> | 
                <span className="font-bold text-success ml-1">{stats.totalTickets.toLocaleString()} tickets vendidos</span>
              </p>
              <Button variant="ghost" size="sm" className="gap-1 text-primary" onClick={() => handleViewDetails(organizationData)}>
                Ver mapa visual
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Team Detail Modal */}
      <TeamDetailModal
        open={showDetailModal}
        onOpenChange={setShowDetailModal}
        member={selectedMember || undefined}
        title={`Detalle de ${selectedMember?.name || 'Equipo'}`}
      />
    </>
  );
}
