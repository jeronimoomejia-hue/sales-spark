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
  Minimize2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  level: number;
  levelName: string;
  tickets: number;
  teamSize?: number;
  children?: TeamMember[];
}

const organizationData: TeamMember = {
  id: "admin-1",
  name: "NeonEvents Admin",
  avatar: "NA",
  level: 4,
  levelName: "Socio",
  tickets: 12458,
  teamSize: 89,
  children: [
    {
      id: "sub-1",
      name: "Laura Martínez",
      avatar: "LM",
      level: 3,
      levelName: "Sub Socio",
      tickets: 3458,
      teamSize: 35,
      children: [
        {
          id: "head-1",
          name: "Juan Pérez",
          avatar: "JP",
          level: 2,
          levelName: "Cabeza",
          tickets: 1245,
          teamSize: 15,
          children: [
            { id: "promo-1", name: "Carlos Ruiz", avatar: "CR", level: 1, levelName: "Común", tickets: 285 },
            { id: "promo-2", name: "Ana Torres", avatar: "AT", level: 1, levelName: "Común", tickets: 248 },
            { id: "promo-3", name: "Luis Gómez", avatar: "LG", level: 1, levelName: "Común", tickets: 198 },
            { id: "promo-4", name: "María López", avatar: "ML", level: 1, levelName: "Común", tickets: 186 },
            { id: "promo-5", name: "Pedro Díaz", avatar: "PD", level: 1, levelName: "Común", tickets: 175 },
          ],
        },
        {
          id: "head-2",
          name: "Sandra García",
          avatar: "SG",
          level: 2,
          levelName: "Cabeza",
          tickets: 987,
          teamSize: 12,
          children: [
            { id: "promo-6", name: "Roberto Méndez", avatar: "RM", level: 1, levelName: "Común", tickets: 156 },
            { id: "promo-7", name: "Carolina Vega", avatar: "CV", level: 1, levelName: "Común", tickets: 143 },
            { id: "promo-8", name: "Andrés Castro", avatar: "AC", level: 1, levelName: "Común", tickets: 132 },
          ],
        },
      ],
    },
    {
      id: "sub-2",
      name: "Miguel Ángel Rojas",
      avatar: "MA",
      level: 3,
      levelName: "Sub Socio",
      tickets: 2890,
      teamSize: 28,
      children: [
        {
          id: "head-3",
          name: "Roberto Silva",
          avatar: "RS",
          level: 2,
          levelName: "Cabeza",
          tickets: 782,
          teamSize: 10,
          children: [
            { id: "promo-9", name: "Diana Ospina", avatar: "DO", level: 1, levelName: "Común", tickets: 134 },
            { id: "promo-10", name: "Felipe Arango", avatar: "FA", level: 1, levelName: "Común", tickets: 128 },
          ],
        },
        {
          id: "head-4",
          name: "Diana Castro",
          avatar: "DC",
          level: 2,
          levelName: "Cabeza",
          tickets: 588,
          teamSize: 8,
          children: [
            { id: "promo-11", name: "Jorge Molina", avatar: "JM", level: 1, levelName: "Común", tickets: 112 },
            { id: "promo-12", name: "Valentina Ríos", avatar: "VR", level: 1, levelName: "Común", tickets: 98 },
          ],
        },
      ],
    },
  ],
};

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
}

function TreeNode({ member, depth = 0, defaultExpanded = false }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded || depth < 2);
  const hasChildren = member.children && member.children.length > 0;

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
        onClick={() => hasChildren && setIsExpanded(!isExpanded)}
      >
        {/* Expand/Collapse */}
        {hasChildren ? (
          <button className="p-1 rounded hover:bg-muted transition-colors">
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
        <div className="flex-1 min-w-0">
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
              {member.tickets.toLocaleString()} tickets
            </span>
            {member.teamSize && (
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {member.teamSize} personas
              </span>
            )}
          </div>
        </div>
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
              <TreeNode key={child.id} member={child} depth={depth + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function OrganizationalTree() {
  const [allExpanded, setAllExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
    >
      <Card variant="neon">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="flex items-center gap-2">
            🌐 Estructura Organizacional
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
          <div className="grid grid-cols-4 gap-3 p-3 mb-4 rounded-lg bg-card-elevated">
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

          {/* Tree */}
          <div className="max-h-[500px] overflow-y-auto pr-2">
            {organizationData.children?.map((subSocio) => (
              <TreeNode 
                key={subSocio.id} 
                member={subSocio} 
                defaultExpanded={allExpanded}
              />
            ))}
          </div>

          {/* Total */}
          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Total: <span className="font-bold text-foreground">89 usuarios</span> | 
              <span className="font-bold text-success ml-1">12,458 tickets vendidos</span>
            </p>
            <Button variant="ghost" size="sm" className="gap-1 text-primary">
              Ver mapa visual
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
