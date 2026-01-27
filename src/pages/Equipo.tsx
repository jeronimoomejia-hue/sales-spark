import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { TeamDetailModal } from "@/components/modals/TeamDetailModal";
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
import { currentUsers, organizationData, TeamMember } from "@/data/mockData";

// Get team data by user level
const getTeamData = (level: number): { members: TeamMember[], userInfo: any } => {
  switch (level) {
    case 2: // Promotor Cabeza - sees their direct team
      return {
        members: currentUsers.promotorCabeza.children || [],
        userInfo: currentUsers.promotorCabeza
      };
    case 3: // Sub Socio - sees cabezas and their teams
      return {
        members: currentUsers.subSocio.children || [],
        userInfo: currentUsers.subSocio
      };
    case 4: // Socio/Admin - sees everyone
      return {
        members: organizationData.children || [],
        userInfo: organizationData
      };
    default:
      return { members: [], userInfo: null };
  }
};

export default function Equipo() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Get user level from sessionStorage
  const [userLevel, setUserLevel] = useState<number>(2);
  
  useEffect(() => {
    const storedLevel = sessionStorage.getItem("demoUserLevel");
    if (storedLevel) {
      setUserLevel(parseInt(storedLevel));
    }
  }, []);

  const { members: teamMembers, userInfo } = getTeamData(userLevel);

  // Flatten all members for search (including nested children)
  const flattenMembers = (members: TeamMember[]): TeamMember[] => {
    return members.reduce((acc: TeamMember[], member) => {
      acc.push(member);
      if (member.children) {
        acc.push(...flattenMembers(member.children));
      }
      return acc;
    }, []);
  };

  const allMembers = flattenMembers(teamMembers);
  
  const filteredMembers = allMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalTickets = allMembers.reduce((sum, m) => sum + m.ownSales.month, 0);
  const totalCommission = allMembers.reduce((sum, m) => sum + (m.ownSales.month * m.commissionPerTicket), 0);
  const topSeller = allMembers.reduce((top, m) => m.ownSales.month > (top?.ownSales.month || 0) ? m : top, allMembers[0]);

  const handleViewMember = (member: TeamMember) => {
    setSelectedMember(member);
    setShowDetailModal(true);
  };

  const getLevelSubtitle = () => {
    switch (userLevel) {
      case 2: return "Tus promotores a cargo";
      case 3: return "Cabezas y promotores bajo tu gestión";
      case 4: return "Toda la estructura organizacional";
      default: return "Tu equipo";
    }
  };

  return (
    <DashboardLayout 
      title="Mi Equipo" 
      subtitle={getLevelSubtitle()}
      userLevel={userLevel}
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
                <p className="text-2xl font-bold font-display">{allMembers.length}</p>
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
                <p className="text-lg font-bold font-display">{topSeller?.name || "N/A"}</p>
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
            {userLevel >= 2 && (
              <Button variant="party" className="gap-2">
                <UserPlus className="w-4 h-4" />
                Agregar Promotor
              </Button>
            )}
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
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-card bg-success" />
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
                    <div className="flex items-center gap-1 text-sm text-success">
                      <TrendingUp className="w-3 h-3" />
                      +12%
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Ventas mes</span>
                      <span className="font-medium">{member.ownSales.month}/100</span>
                    </div>
                    <Progress 
                      value={(member.ownSales.month / 100) * 100} 
                      size="sm"
                      indicatorColor={member.ownSales.month >= 80 ? "success" : "party"}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">Comisión</p>
                      <p className="font-semibold text-success">${(member.ownSales.month * member.commissionPerTicket).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Última venta</p>
                      <p className="text-sm">Hace 2 horas</p>
                    </div>
                  </div>

                  {/* Team info for Cabezas */}
                  {member.children && member.children.length > 0 && (
                    <div className="pt-2 border-t border-border">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          Equipo: {member.children.length} personas
                        </span>
                        <span className="text-primary font-medium">
                          +{member.teamSales.month} ventas
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 gap-1"
                      onClick={() => handleViewMember(member)}
                    >
                      <Eye className="w-3 h-3" />
                      Ver más
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

      {/* Team Detail Modal */}
      <TeamDetailModal
        open={showDetailModal}
        onOpenChange={setShowDetailModal}
        member={selectedMember || undefined}
        title={`Detalle de ${selectedMember?.name || 'Miembro'}`}
      />
    </DashboardLayout>
  );
}
