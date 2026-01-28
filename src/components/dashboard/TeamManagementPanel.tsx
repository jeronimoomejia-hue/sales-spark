import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Edit, 
  Eye, 
  TrendingUp, 
  Trophy,
  ChevronRight,
  ChevronDown,
  UserPlus,
  Settings,
  BarChart3,
  Ticket,
  DollarSign,
  Flame,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TeamMember } from "@/data/mockData";

interface TeamManagementPanelProps {
  userLevel: 2 | 3 | 4;
  teamMembers: TeamMember[];
  onEditMember: (member: TeamMember) => void;
  onViewMember: (member: TeamMember) => void;
  onAddMember?: () => void;
  onManageStructure?: () => void;
}

const levelColors: Record<number, string> = {
  1: "bg-neon-blue/20 text-neon-blue border-neon-blue/30",
  2: "bg-neon-orange/20 text-neon-orange border-neon-orange/30",
  3: "bg-neon-pink/20 text-neon-pink border-neon-pink/30",
  4: "bg-gradient-party text-white",
};

export function TeamManagementPanel({
  userLevel,
  teamMembers,
  onEditMember,
  onViewMember,
  onAddMember,
  onManageStructure,
}: TeamManagementPanelProps) {
  const [expandedMember, setExpandedMember] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');

  // Calculate team stats
  const totalTeamSales = teamMembers.reduce((sum, m) => sum + (m.ownSales?.month || 0), 0);
  const avgSalesPerMember = Math.round(totalTeamSales / (teamMembers.length || 1));
  const topPerformer = teamMembers.reduce((top, m) => 
    (m.ownSales?.month || 0) > (top?.ownSales?.month || 0) ? m : top, teamMembers[0]
  );
  
  // Sort by performance
  const sortedMembers = [...teamMembers].sort((a, b) => 
    (b.ownSales?.month || 0) - (a.ownSales?.month || 0)
  );

  const maxSales = Math.max(...teamMembers.map(m => m.ownSales?.month || 0), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <Card variant="neon" className="border-2 border-primary/20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-neon-blue/5" />
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-party shadow-lg shadow-primary/20">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-display">Gestión de Mi Equipo</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {teamMembers.length} miembros • {totalTeamSales} ventas totales
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {onManageStructure && (
                <Button variant="outline" className="gap-2" onClick={onManageStructure}>
                  <Settings className="w-4 h-4" />
                  Editar Estructura
                </Button>
              )}
              {onAddMember && (
                <Button variant="party" className="gap-2" onClick={onAddMember}>
                  <UserPlus className="w-4 h-4" />
                  Añadir
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative">
          {/* Team Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Ticket className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground">Ventas Totales</span>
              </div>
              <p className="text-2xl font-bold">{totalTeamSales}</p>
              <p className="text-xs text-success mt-1">+22% esta semana</p>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-neon-blue" />
                <span className="text-xs text-muted-foreground">Promedio/Miembro</span>
              </div>
              <p className="text-2xl font-bold">{avgSalesPerMember}</p>
              <p className="text-xs text-muted-foreground mt-1">tickets/período</p>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-4 h-4 text-warning" />
                <span className="text-xs text-muted-foreground">Top Performer</span>
              </div>
              <p className="text-lg font-bold truncate">{topPerformer?.name || '-'}</p>
              <p className="text-xs text-success mt-1">{topPerformer?.ownSales?.month || 0} ventas</p>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-success" />
                <span className="text-xs text-muted-foreground">Mi Comisión</span>
              </div>
              <p className="text-2xl font-bold">${(totalTeamSales * 1000 / 1000).toFixed(0)}K</p>
              <p className="text-xs text-muted-foreground mt-1">10% del equipo</p>
            </div>
          </div>

          {/* Team Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedMembers.map((member, index) => {
              const performancePercent = ((member.ownSales?.month || 0) / maxSales) * 100;
              const isTopPerformer = performancePercent > 80;
              const isExpanded = expandedMember === member.id;
              
              return (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card 
                    className={cn(
                      "p-4 transition-all hover:border-primary/30 cursor-pointer relative overflow-hidden",
                      isTopPerformer && "border-success/30 bg-success/5"
                    )}
                    onClick={() => setExpandedMember(isExpanded ? null : member.id)}
                  >
                    {/* Rank Badge */}
                    <div className="absolute top-2 right-2">
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          "text-xs",
                          index === 0 && "bg-warning/20 text-warning border-warning/30",
                          index === 1 && "bg-muted",
                          index === 2 && "bg-neon-orange/20 text-neon-orange border-neon-orange/30"
                        )}
                      >
                        #{index + 1}
                      </Badge>
                    </div>

                    {/* Member Header */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative">
                        <div className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold",
                          levelColors[member.level]
                        )}>
                          {member.avatar}
                        </div>
                        {isTopPerformer && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-success flex items-center justify-center">
                            <Flame className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{member.name}</p>
                        <Badge variant="outline" className={cn("text-xs mt-1", levelColors[member.level])}>
                          {member.levelName}
                        </Badge>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="p-2 rounded-lg bg-card-elevated text-center">
                        <p className="text-xs text-muted-foreground">Ventas</p>
                        <p className="text-lg font-bold text-primary">{member.ownSales?.month || 0}</p>
                      </div>
                      <div className="p-2 rounded-lg bg-card-elevated text-center">
                        <p className="text-xs text-muted-foreground">Comisión</p>
                        <p className="text-lg font-bold text-success">
                          ${((member.ownSales?.month || 0) * member.commissionPerTicket / 1000).toFixed(0)}K
                        </p>
                      </div>
                    </div>

                    {/* Performance Bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Rendimiento</span>
                        <span className="font-medium">{Math.round(performancePercent)}%</span>
                      </div>
                      <Progress 
                        value={performancePercent} 
                        className={cn(
                          "h-2",
                          isTopPerformer && "[&>div]:bg-success"
                        )}
                      />
                    </div>

                    {/* Expanded Actions */}
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="flex gap-2 pt-3 border-t border-border"
                      >
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewMember(member);
                          }}
                        >
                          <Eye className="w-3 h-3" />
                          Ver más
                        </Button>
                        {userLevel > member.level && (
                          <Button 
                            variant="party" 
                            size="sm" 
                            className="flex-1 gap-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditMember(member);
                            }}
                          >
                            <Edit className="w-3 h-3" />
                            Editar
                          </Button>
                        )}
                      </motion.div>
                    )}

                    {/* Expand Indicator */}
                    <div className="flex justify-center mt-2">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
