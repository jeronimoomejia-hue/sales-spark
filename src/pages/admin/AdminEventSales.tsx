import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  TicketIcon, 
  TrendingUp, 
  TrendingDown,
  Users, 
  Download,
  Filter,
  Search,
  DollarSign,
  Target,
  Trophy,
  Eye,
  Clock,
  Calendar,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Flame,
  Star,
  ChevronRight,
  ChevronDown,
  Headphones,
  Sparkles,
  Activity,
  Edit
} from "lucide-react";
import { events, organizationData, TeamMember, getTotalSales, getEventSales } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { SalesPerformanceModal } from "@/components/modals/SalesPerformanceModal";
import { MemberEditModal } from "@/components/admin/MemberEditModal";

// Level colors for hierarchy
const levelColors: Record<number, string> = {
  1: "bg-neon-blue/20 text-neon-blue border-neon-blue/30",
  2: "bg-neon-orange/20 text-neon-orange border-neon-orange/30",
  3: "bg-neon-pink/20 text-neon-pink border-neon-pink/30",
  4: "bg-gradient-party text-white",
};

const levelAvatarColors: Record<number, string> = {
  1: "from-neon-blue/40 to-neon-blue/10",
  2: "from-neon-orange/40 to-neon-orange/10",
  3: "from-neon-pink/40 to-neon-pink/10",
  4: "from-primary/40 to-neon-purple/10",
};

interface SalesTreeNodeProps {
  member: TeamMember;
  eventId: string;
  depth?: number;
  maxSales: number;
  onViewDetails: (member: TeamMember) => void;
  onEditMember: (member: TeamMember) => void;
  defaultExpanded?: boolean;
  editorLevel: number;
}

function SalesTreeNode({ member, eventId, depth = 0, maxSales, onViewDetails, onEditMember, defaultExpanded = true, editorLevel }: SalesTreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded && depth < 2);
  const hasChildren = member.children && member.children.length > 0;
  const canEdit = editorLevel > member.level;

  const eventSales = getEventSales(member, eventId);
  const performancePercentage = maxSales > 0 ? (eventSales.total / maxSales) * 100 : 0;
  const isTopPerformer = performancePercentage > 70;
  const isOnFire = performancePercentage > 90;

  return (
    <div className="relative">
      {/* Connector line with glow */}
      {depth > 0 && (
        <div 
          className="absolute left-0 top-0 w-0.5 h-full bg-gradient-to-b from-primary/50 to-transparent"
          style={{ left: -16 }}
        />
      )}

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: depth * 0.08 }}
        className={cn(
          "relative flex items-center gap-4 p-4 rounded-xl transition-all cursor-pointer group",
          depth > 0 && "ml-8",
          isOnFire 
            ? "bg-gradient-to-r from-warning/20 via-neon-orange/10 to-transparent border border-warning/40 shadow-[0_0_20px_rgba(251,191,36,0.2)]" 
            : isTopPerformer 
              ? "bg-gradient-to-r from-success/20 via-success/5 to-transparent border border-success/30"
              : "bg-card-elevated/50 border border-border/50 hover:border-primary/30 hover:bg-card-elevated"
        )}
      >
        {/* Expand/Collapse */}
        {hasChildren && (
          <button 
            className="absolute left-2 p-1 rounded-full hover:bg-muted transition-colors"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
          </button>
        )}

        {/* Avatar with level indicator */}
        <div className="relative ml-4">
          <div className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold bg-gradient-to-br",
            levelAvatarColors[member.level]
          )}>
            {member.avatar}
          </div>
          {isOnFire && (
            <motion.div 
              className="absolute -top-1 -right-1"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <Flame className="w-5 h-5 text-warning drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
            </motion.div>
          )}
          {isTopPerformer && !isOnFire && (
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-success flex items-center justify-center">
              <Trophy className="w-3 h-3 text-white" />
            </div>
          )}
          <div className={cn(
            "absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-semibold",
            levelColors[member.level]
          )}>
            Nv.{member.level}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold truncate">{member.name}</span>
            <Badge variant="outline" className={cn("text-xs border", levelColors[member.level])}>
              {member.levelName}
            </Badge>
            {isOnFire && (
              <Badge className="bg-gradient-to-r from-warning to-neon-orange text-white border-0 gap-1">
                <Flame className="w-3 h-3" /> En Fuego
              </Badge>
            )}
          </div>
          
          {/* Performance Bar with glow */}
          <div className="relative h-3 rounded-full bg-background/50 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${performancePercentage}%` }}
              transition={{ duration: 0.8, delay: depth * 0.1, ease: "easeOut" }}
              className={cn(
                "absolute inset-y-0 left-0 rounded-full",
                isOnFire 
                  ? "bg-gradient-to-r from-warning via-neon-orange to-neon-pink shadow-[0_0_10px_rgba(251,191,36,0.5)]"
                  : isTopPerformer 
                    ? "bg-gradient-to-r from-success to-neon-green shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                    : "bg-gradient-to-r from-primary to-neon-purple"
              )}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] font-bold text-white drop-shadow-md">
                {Math.round(performancePercentage)}%
              </span>
            </div>
          </div>
        </div>

        {/* Sales Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <TicketIcon className="w-4 h-4 text-primary" />
              <span className="text-xl font-bold">{eventSales.own}</span>
            </div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Propias</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Users className="w-4 h-4 text-success" />
              <span className="text-xl font-bold text-success">+{eventSales.team}</span>
            </div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Equipo</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <DollarSign className="w-4 h-4 text-warning" />
              <span className="text-xl font-bold text-warning">
                ${((eventSales.ownCommission + eventSales.teamCommission) / 1000000).toFixed(1)}M
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Comisión</p>
          </div>
        </div>

        {/* Trend */}
        <div className={cn(
          "flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold",
          isOnFire ? "bg-warning/20 text-warning" :
          isTopPerformer ? "bg-success/20 text-success" : 
          "bg-primary/20 text-primary"
        )}>
          {isOnFire ? (
            <>
              <Zap className="w-3 h-3" />
              +24%
            </>
          ) : isTopPerformer ? (
            <>
              <TrendingUp className="w-3 h-3" />
              +15%
            </>
          ) : (
            <>
              <TrendingUp className="w-3 h-3" />
              +8%
            </>
          )}
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

        {/* View Details Button */}
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1 border-primary/30 hover:bg-primary/10"
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
            transition={{ duration: 0.3 }}
            className="relative ml-8 pl-4"
          >
            {member.children!.map((child, index) => (
              <SalesTreeNode 
                key={child.id} 
                member={child} 
                eventId={eventId}
                depth={depth + 1}
                maxSales={maxSales}
                onViewDetails={onViewDetails}
                onEditMember={onEditMember}
                defaultExpanded={depth < 1}
                editorLevel={editorLevel}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Animated KPI Card Component
interface AnimatedKPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: number;
  color: "primary" | "success" | "warning" | "pink" | "purple" | "blue" | "orange";
  delay?: number;
  onClick?: () => void;
}

function AnimatedKPICard({ title, value, subtitle, icon, trend, color, delay = 0, onClick }: AnimatedKPICardProps) {
  const colorStyles = {
    primary: "from-primary/30 to-primary/5 border-primary/40 shadow-[0_0_30px_rgba(168,85,247,0.15)]",
    success: "from-success/30 to-success/5 border-success/40 shadow-[0_0_30px_rgba(16,185,129,0.15)]",
    warning: "from-warning/30 to-warning/5 border-warning/40 shadow-[0_0_30px_rgba(251,191,36,0.15)]",
    pink: "from-neon-pink/30 to-neon-pink/5 border-neon-pink/40 shadow-[0_0_30px_rgba(236,72,153,0.15)]",
    purple: "from-neon-purple/30 to-neon-purple/5 border-neon-purple/40 shadow-[0_0_30px_rgba(168,85,247,0.15)]",
    blue: "from-neon-blue/30 to-neon-blue/5 border-neon-blue/40 shadow-[0_0_30px_rgba(59,130,246,0.15)]",
    orange: "from-neon-orange/30 to-neon-orange/5 border-neon-orange/40 shadow-[0_0_30px_rgba(249,115,22,0.15)]",
  };

  const iconColors = {
    primary: "text-primary",
    success: "text-success",
    warning: "text-warning",
    pink: "text-neon-pink",
    purple: "text-neon-purple",
    blue: "text-neon-blue",
    orange: "text-neon-orange",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="h-full"
    >
      <Card 
        className={cn(
          "h-full bg-gradient-to-br border-2 cursor-pointer transition-all hover:shadow-xl",
          colorStyles[color]
        )}
        onClick={onClick}
      >
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className={cn("p-3 rounded-xl bg-background/30", iconColors[color])}>
              {icon}
            </div>
            {trend !== undefined && (
              <div className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold",
                trend >= 0 ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
              )}>
                {trend >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {Math.abs(trend)}%
              </div>
            )}
          </div>
          <p className="text-3xl font-bold font-display mb-1">{value}</p>
          <p className="text-sm font-medium text-foreground/80">{title}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
          <Button variant="ghost" size="sm" className="mt-2 gap-1 text-xs p-0 h-auto hover:bg-transparent">
            <Eye className="w-3 h-3" />
            Ver detalles
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Recent Sales Component
function RecentSalesPanel({ eventId, onViewAll }: { eventId: string; onViewAll: () => void }) {
  const mockRecentSales = [
    { id: 1, seller: "Carlos Ruiz", avatar: "CR", type: "VIP", quantity: 3, amount: 270000, time: "Hace 2 min", level: 1 },
    { id: 2, seller: "Ana Torres", avatar: "AT", type: "General", quantity: 5, amount: 200000, time: "Hace 8 min", level: 1 },
    { id: 3, seller: "Juan Pérez", avatar: "JP", type: "General", quantity: 2, amount: 80000, time: "Hace 15 min", level: 2 },
    { id: 4, seller: "Laura Martínez", avatar: "LM", type: "VIP", quantity: 4, amount: 360000, time: "Hace 22 min", level: 3 },
    { id: 5, seller: "Luis Gómez", avatar: "LG", type: "General", quantity: 6, amount: 240000, time: "Hace 35 min", level: 1 },
  ];

  return (
    <Card className="bg-card-elevated border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Activity className="w-5 h-5 text-primary" />
          Ventas en Tiempo Real
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-success"
          />
        </CardTitle>
        <Button variant="ghost" size="sm" className="gap-1" onClick={onViewAll}>
          Ver todas
          <ChevronRight className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockRecentSales.map((sale, index) => (
          <motion.div
            key={sale.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-center gap-3 p-3 rounded-lg bg-background/50 hover:bg-background transition-colors group"
          >
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold bg-gradient-to-br",
              levelAvatarColors[sale.level]
            )}>
              {sale.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{sale.seller}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {sale.time}
              </div>
            </div>
            <div className="text-right">
              <Badge variant={sale.type === 'VIP' ? 'default' : 'secondary'} className="mb-1">
                {sale.quantity}x {sale.type}
              </Badge>
              <p className="text-sm font-bold text-success">${sale.amount.toLocaleString()}</p>
            </div>
            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Eye className="w-4 h-4" />
            </Button>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}

// Top Performers Component
function TopPerformersPanel({ eventId, onViewDetails }: { eventId: string; onViewDetails: (member: TeamMember) => void }) {
  // Get top performers from organization data
  const flattenMembers = (member: TeamMember): TeamMember[] => {
    const children = member.children?.flatMap(c => flattenMembers(c)) || [];
    return [member, ...children];
  };
  
  const allMembers = flattenMembers(organizationData);
  const topPerformers = allMembers
    .map(m => ({ member: m, sales: getEventSales(m, eventId).total }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  return (
    <Card className="bg-gradient-to-br from-warning/10 to-neon-orange/5 border-warning/30">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Trophy className="w-5 h-5 text-warning" />
          Top Vendedores
          <Sparkles className="w-4 h-4 text-warning" />
        </CardTitle>
        <Button variant="ghost" size="sm" className="gap-1">
          Ver ranking
          <ChevronRight className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {topPerformers.map((item, index) => (
          <motion.div
            key={item.member.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-background/50 transition-colors cursor-pointer group"
            onClick={() => onViewDetails(item.member)}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
              index === 0 ? "bg-gradient-to-br from-warning to-neon-orange text-white" :
              index === 1 ? "bg-gradient-to-br from-gray-300 to-gray-400 text-gray-800" :
              index === 2 ? "bg-gradient-to-br from-amber-600 to-amber-700 text-white" :
              "bg-muted text-muted-foreground"
            )}>
              {index + 1}
            </div>
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold bg-gradient-to-br",
              levelAvatarColors[item.member.level]
            )}>
              {item.member.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{item.member.name}</p>
              <Badge variant="outline" className={cn("text-xs", levelColors[item.member.level])}>
                {item.member.levelName}
              </Badge>
            </div>
            <div className="text-right">
              <p className="font-bold">{item.sales} tk</p>
              {index === 0 && <Flame className="w-4 h-4 text-warning inline" />}
            </div>
            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
              <Eye className="w-4 h-4" />
            </Button>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function AdminEventSales() {
  const { eventId } = useParams();
  const event = events.find(e => e.id === eventId) || events[0];
  const [activeTab, setActiveTab] = useState("organigrama");
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAllSalesModal, setShowAllSalesModal] = useState(false);

  // Calculate max sales for performance comparison
  const calculateMaxSales = (member: TeamMember): number => {
    const ownTotal = getEventSales(member, event.id).total;
    const childMax = member.children 
      ? Math.max(...member.children.map(c => calculateMaxSales(c)), 0)
      : 0;
    return Math.max(ownTotal, childMax);
  };

  const maxSales = calculateMaxSales(organizationData);

  // Calculate event totals
  const flattenMembers = (member: TeamMember): TeamMember[] => {
    const children = member.children?.flatMap(c => flattenMembers(c)) || [];
    return [member, ...children];
  };
  
  const allMembers = flattenMembers(organizationData);
  const eventTotalSales = allMembers.reduce((sum, m) => sum + getEventSales(m, event.id).own, 0);
  const eventTotalCommission = allMembers.reduce((sum, m) => sum + getEventSales(m, event.id).ownCommission, 0);
  const activeVendors = allMembers.filter(m => getEventSales(m, event.id).own > 0).length;

  const editorLevel = 4; // Current user is Socio level
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

  const handleSaveMember = (member: TeamMember) => {
    console.log("Saving member:", member);
  };

  const handleDeleteMember = (memberId: string) => {
    console.log("Deleting member:", memberId);
  };

  return (
    <DashboardLayout
      title={`Ventas: ${event.name}`}
      subtitle="Panel de ventas en tiempo real con estructura organizacional"
      userLevel={4}
    >
      <div className="space-y-6">
        {/* Hero Stats Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/20 via-neon-purple/10 to-neon-pink/20 border border-primary/30 p-6"
        >
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ 
                x: [0, 100, 0],
                y: [0, -50, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-primary/10 blur-3xl"
            />
            <motion.div
              animate={{ 
                x: [0, -100, 0],
                y: [0, 50, 0],
                scale: [1, 1.3, 1]
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-neon-pink/10 blur-3xl"
            />
          </div>

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-gradient-party shadow-lg">
                <TicketIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold font-display text-gradient-party">
                  {event.soldTickets.toLocaleString()}
                </h2>
                <p className="text-muted-foreground">Tickets Vendidos</p>
              </div>
            </div>

            <div className="h-16 w-px bg-border/50" />

            <div className="text-center">
              <p className="text-2xl font-bold text-success">
                ${(event.soldTickets * event.ticketPrice / 1000000).toFixed(1)}M
              </p>
              <p className="text-sm text-muted-foreground">Recaudación Total</p>
            </div>

            <div className="h-16 w-px bg-border/50" />

            <div className="text-center">
              <p className="text-2xl font-bold text-warning">{activeVendors}</p>
              <p className="text-sm text-muted-foreground">Vendedores Activos</p>
            </div>

            <div className="h-16 w-px bg-border/50" />

            <div className="text-center">
              <Progress 
                value={(event.soldTickets / event.totalCapacity) * 100} 
                className="w-32 h-3 mb-2"
              />
              <p className="text-lg font-bold">
                {Math.round((event.soldTickets / event.totalCapacity) * 100)}%
              </p>
              <p className="text-sm text-muted-foreground">Capacidad</p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Headphones className="w-4 h-4" />
                Soporte
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Download className="w-4 h-4" />
                Exportar
              </Button>
            </div>
          </div>
        </motion.div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <AnimatedKPICard
            title="Hoy"
            value="124"
            subtitle="vs. 98 ayer"
            icon={<Calendar className="w-5 h-5" />}
            trend={26}
            color="primary"
            delay={0}
          />
          <AnimatedKPICard
            title="Esta Semana"
            value="856"
            subtitle="Meta: 1,000"
            icon={<BarChart3 className="w-5 h-5" />}
            trend={12}
            color="success"
            delay={0.1}
          />
          <AnimatedKPICard
            title="VIP Vendidos"
            value={Math.round(event.soldTickets * 0.25).toLocaleString()}
            subtitle="25% del total"
            icon={<Star className="w-5 h-5" />}
            trend={18}
            color="warning"
            delay={0.2}
          />
          <AnimatedKPICard
            title="Comisiones"
            value={`$${(eventTotalCommission / 1000000).toFixed(1)}M`}
            subtitle="Por vendedores"
            icon={<DollarSign className="w-5 h-5" />}
            trend={15}
            color="pink"
            delay={0.3}
          />
          <AnimatedKPICard
            title="Conversión"
            value="68%"
            subtitle="Links abiertos"
            icon={<Target className="w-5 h-5" />}
            trend={8}
            color="blue"
            delay={0.4}
          />
          <AnimatedKPICard
            title="Ticket Promedio"
            value={`$${(event.ticketPrice / 1000).toFixed(0)}K`}
            subtitle="Por venta"
            icon={<TicketIcon className="w-5 h-5" />}
            trend={5}
            color="orange"
            delay={0.5}
          />
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList className="bg-card-elevated">
              <TabsTrigger value="organigrama" className="gap-2">
                <Users className="w-4 h-4" />
                Organigrama de Ventas
              </TabsTrigger>
              <TabsTrigger value="historial" className="gap-2">
                <Clock className="w-4 h-4" />
                Historial
              </TabsTrigger>
              <TabsTrigger value="analisis" className="gap-2">
                <PieChart className="w-4 h-4" />
                Análisis
              </TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Buscar vendedor..." className="pl-10 w-64 bg-card-elevated" />
              </div>
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="w-4 h-4" />
                Filtrar
              </Button>
            </div>
          </div>

          <TabsContent value="organigrama" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Org Tree */}
              <div className="lg:col-span-2">
                <Card className="bg-card border-border/50">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-primary" />
                      Desempeño por Vendedor
                    </CardTitle>
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <Flame className="w-4 h-4 text-warning" />
                        <span>En Fuego (+90%)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="w-4 h-4 text-success" />
                        <span>Top (+70%)</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="max-h-[600px] overflow-y-auto">
                    {organizationData.children?.map((subSocio) => (
                      <SalesTreeNode
                        key={subSocio.id}
                        member={subSocio}
                        eventId={event.id}
                        maxSales={maxSales}
                        onViewDetails={handleViewDetails}
                        onEditMember={handleEditMember}
                        editorLevel={editorLevel}
                      />
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Side Panels */}
              <div className="space-y-6">
                <RecentSalesPanel eventId={event.id} onViewAll={() => setShowAllSalesModal(true)} />
                <TopPerformersPanel eventId={event.id} onViewDetails={handleViewDetails} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="historial" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Historial Completo de Ventas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-12">
                  Vista detallada del historial de ventas - Próximamente
                </p>
                <Button variant="outline" className="w-full gap-2">
                  <Headphones className="w-4 h-4" />
                  Contactar Soporte
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analisis" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Análisis Avanzado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-12">
                  Gráficos y análisis detallados - Próximamente
                </p>
                <Button variant="outline" className="w-full gap-2">
                  <Headphones className="w-4 h-4" />
                  Contactar Soporte
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Sales Performance Modal */}
      <SalesPerformanceModal
        open={showDetailModal}
        onOpenChange={setShowDetailModal}
        member={selectedMember || undefined}
        selectedEventId={event.id}
      />

      {/* All Sales Modal */}
      <Dialog open={showAllSalesModal} onOpenChange={setShowAllSalesModal}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Todas las Ventas - {event.name}
            </DialogTitle>
          </DialogHeader>
          <p className="text-center py-12 text-muted-foreground">
            Listado completo de ventas con filtros avanzados - Próximamente
          </p>
          <Button variant="outline" className="w-full gap-2">
            <Headphones className="w-4 h-4" />
            Contactar Soporte
          </Button>
        </DialogContent>
      </Dialog>

      {/* Member Edit Modal */}
      <MemberEditModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        member={editingMember}
        editorLevel={editorLevel}
        onSave={handleSaveMember}
        onDelete={handleDeleteMember}
      />
    </DashboardLayout>
  );
}
