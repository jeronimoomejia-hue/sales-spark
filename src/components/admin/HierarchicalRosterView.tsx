import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ChevronDown, 
  ChevronRight, 
  X, 
  TrendingUp, 
  Users, 
  UserPlus,
  Star,
  Check,
  Clock,
  XCircle
} from "lucide-react";
import { SellerRoster } from "@/data/eventTemplates";
import { cn } from "@/lib/utils";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface HierarchicalRosterViewProps {
  roster: SellerRoster[];
  onRemove: (sellerId: string) => void;
  onAssign: (sellerId: string, parentId: string | undefined) => void;
  availableSellers: SellerRoster[];
  onAddSeller: (seller: SellerRoster) => void;
}

const levelConfig = {
  subsocio: {
    color: "from-neon-pink/20 to-neon-purple/10",
    border: "border-neon-pink/30 hover:border-neon-pink/60",
    dot: "bg-neon-pink",
    label: "SUB SOCIOS",
    icon: "👔"
  },
  cabeza: {
    color: "from-neon-purple/20 to-neon-blue/10",
    border: "border-neon-purple/30 hover:border-neon-purple/60",
    dot: "bg-neon-purple",
    label: "CABEZAS DE EQUIPO",
    icon: "🎯"
  },
  promotor: {
    color: "from-neon-blue/20 to-cyan-500/10",
    border: "border-neon-blue/30 hover:border-neon-blue/60",
    dot: "bg-neon-blue",
    label: "PROMOTORES COMUNES",
    icon: "🎫"
  }
};

const invitationStatusConfig = {
  pending: { icon: Clock, color: "text-warning", label: "Pendiente" },
  accepted: { icon: Check, color: "text-success", label: "Aceptó" },
  rejected: { icon: XCircle, color: "text-destructive", label: "Rechazó" }
};

interface SellerCardProps {
  seller: SellerRoster;
  onRemove: () => void;
  onAssign?: (parentId: string | undefined) => void;
  possibleParents?: SellerRoster[];
  subordinates?: SellerRoster[];
  expanded?: boolean;
  onToggleExpand?: () => void;
}

function SellerCard({ 
  seller, 
  onRemove, 
  onAssign, 
  possibleParents,
  subordinates,
  expanded,
  onToggleExpand
}: SellerCardProps) {
  const config = levelConfig[seller.position];
  const hasSubordinates = subordinates && subordinates.length > 0;
  const invStatus = seller.invitationStatus ? invitationStatusConfig[seller.invitationStatus] : null;

  return (
    <Card className={cn(
      "p-4 bg-gradient-to-br transition-all relative group",
      config.color,
      config.border
    )}>
      <button
        onClick={onRemove}
        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
      >
        <X className="w-3 h-3" />
      </button>

      <div className="flex items-start gap-3">
        {/* Expand toggle for hierarchy */}
        {hasSubordinates && (
          <button 
            onClick={onToggleExpand}
            className="mt-1 p-1 rounded hover:bg-background/50 transition-colors"
          >
            {expanded ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        )}

        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-party flex items-center justify-center text-white font-bold ring-2 ring-white/20">
              {seller.avatar}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold">{seller.name}</p>
                {seller.stats.successRate >= 90 && (
                  <Star className="w-3 h-3 text-warning fill-warning" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {seller.levelName}
                </Badge>
                {seller.maxSubordinates && (
                  <span className="text-xs text-muted-foreground">
                    Controla hasta {seller.maxSubordinates} personas
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded bg-background/30">
              <p className="text-sm font-bold text-success">{seller.stats.avgPerEvent}</p>
              <p className="text-[10px] text-muted-foreground">Prom/Evento</p>
            </div>
            <div className="p-2 rounded bg-background/30">
              <p className="text-sm font-bold text-primary">{seller.stats.successRate}%</p>
              <p className="text-[10px] text-muted-foreground">Éxito</p>
            </div>
            <div className="p-2 rounded bg-background/30">
              <p className="text-sm font-bold">{seller.stats.totalSales}</p>
              <p className="text-[10px] text-muted-foreground">Total</p>
            </div>
          </div>

          {/* Assignment selector */}
          {possibleParents && possibleParents.length > 0 && onAssign && (
            <div className="mt-3">
              <Select 
                value={seller.assignedTo || "unassigned"} 
                onValueChange={(v) => onAssign(v === "unassigned" ? undefined : v)}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Asignar a..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Sin asignar</SelectItem>
                  {possibleParents.map((parent) => (
                    <SelectItem key={parent.sellerId} value={parent.sellerId}>
                      {parent.name} ({parent.levelName})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Invitation status */}
          {invStatus && (
            <div className={cn("mt-2 flex items-center gap-1 text-xs", invStatus.color)}>
              <invStatus.icon className="w-3 h-3" />
              {invStatus.label}
            </div>
          )}

          {/* Subordinates count */}
          {hasSubordinates && (
            <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="w-3 h-3" />
              {subordinates.length} subordinados
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

export function HierarchicalRosterView({
  roster,
  onRemove,
  onAssign,
  availableSellers,
  onAddSeller
}: HierarchicalRosterViewProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(roster.map(r => r.sellerId)));

  const subsocios = roster.filter(s => s.position === 'subsocio');
  const cabezas = roster.filter(s => s.position === 'cabeza');
  const promotores = roster.filter(s => s.position === 'promotor');

  const toggleExpand = (sellerId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(sellerId)) {
      newExpanded.delete(sellerId);
    } else {
      newExpanded.add(sellerId);
    }
    setExpandedNodes(newExpanded);
  };

  const getSubordinates = (parentId: string): SellerRoster[] => {
    return roster.filter(s => s.assignedTo === parentId);
  };

  const availableSubsocios = availableSellers.filter(s => s.position === 'subsocio');
  const availableCabezas = availableSellers.filter(s => s.position === 'cabeza');
  const availablePromotores = availableSellers.filter(s => s.position === 'promotor');

  return (
    <div className="space-y-8">
      {/* Sub Socios Level */}
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
          <div className={cn("w-2 h-2 rounded-full", levelConfig.subsocio.dot)} />
          {levelConfig.subsocio.icon} {levelConfig.subsocio.label}
          <Badge variant="outline" className="ml-auto">{subsocios.length}</Badge>
        </h4>
        
        <div className="space-y-4">
          {subsocios.map((subsocio) => {
            const subordinateCabezas = getSubordinates(subsocio.sellerId);
            const isExpanded = expandedNodes.has(subsocio.sellerId);
            
            return (
              <motion.div
                key={subsocio.sellerId}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <SellerCard
                  seller={subsocio}
                  onRemove={() => onRemove(subsocio.sellerId)}
                  subordinates={subordinateCabezas}
                  expanded={isExpanded}
                  onToggleExpand={() => toggleExpand(subsocio.sellerId)}
                />
                
                {/* Nested Cabezas */}
                <AnimatePresence>
                  {isExpanded && subordinateCabezas.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="ml-8 pl-4 border-l-2 border-neon-purple/20 space-y-3"
                    >
                      {subordinateCabezas.map((cabeza) => {
                        const subordinatePromotores = getSubordinates(cabeza.sellerId);
                        const isCabezaExpanded = expandedNodes.has(cabeza.sellerId);
                        
                        return (
                          <div key={cabeza.sellerId} className="space-y-2">
                            <SellerCard
                              seller={cabeza}
                              onRemove={() => onRemove(cabeza.sellerId)}
                              onAssign={(parentId) => onAssign(cabeza.sellerId, parentId)}
                              possibleParents={subsocios}
                              subordinates={subordinatePromotores}
                              expanded={isCabezaExpanded}
                              onToggleExpand={() => toggleExpand(cabeza.sellerId)}
                            />
                            
                            {/* Nested Promotores */}
                            <AnimatePresence>
                              {isCabezaExpanded && subordinatePromotores.length > 0 && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="ml-6 pl-4 border-l-2 border-neon-blue/20 space-y-2"
                                >
                                  {subordinatePromotores.map((promotor) => (
                                    <SellerCard
                                      key={promotor.sellerId}
                                      seller={promotor}
                                      onRemove={() => onRemove(promotor.sellerId)}
                                      onAssign={(parentId) => onAssign(promotor.sellerId, parentId)}
                                      possibleParents={cabezas}
                                    />
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
          
          {/* Add Sub Socio */}
          {availableSubsocios.length > 0 && (
            <Select onValueChange={(v) => {
              const seller = availableSubsocios.find(s => s.sellerId === v);
              if (seller) onAddSeller(seller);
            }}>
              <SelectTrigger className="border-2 border-dashed border-neon-pink/30 hover:border-neon-pink/50 bg-transparent">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <UserPlus className="w-4 h-4" />
                  Añadir Sub Socio
                </div>
              </SelectTrigger>
              <SelectContent>
                {availableSubsocios.map((seller) => (
                  <SelectItem key={seller.sellerId} value={seller.sellerId}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{seller.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({seller.stats.avgPerEvent}/evento)
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Unassigned Cabezas */}
      {cabezas.filter(c => !c.assignedTo).length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", levelConfig.cabeza.dot)} />
            {levelConfig.cabeza.icon} CABEZAS SIN ASIGNAR
            <Badge variant="outline" className="ml-auto">
              {cabezas.filter(c => !c.assignedTo).length}
            </Badge>
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {cabezas.filter(c => !c.assignedTo).map((cabeza) => (
              <SellerCard
                key={cabeza.sellerId}
                seller={cabeza}
                onRemove={() => onRemove(cabeza.sellerId)}
                onAssign={(parentId) => onAssign(cabeza.sellerId, parentId)}
                possibleParents={subsocios}
                subordinates={getSubordinates(cabeza.sellerId)}
                expanded={expandedNodes.has(cabeza.sellerId)}
                onToggleExpand={() => toggleExpand(cabeza.sellerId)}
              />
            ))}
          </div>
          
          {/* Add Cabeza */}
          {availableCabezas.length > 0 && (
            <Select onValueChange={(v) => {
              const seller = availableCabezas.find(s => s.sellerId === v);
              if (seller) onAddSeller(seller);
            }}>
              <SelectTrigger className="mt-3 border-2 border-dashed border-neon-purple/30 hover:border-neon-purple/50 bg-transparent">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <UserPlus className="w-4 h-4" />
                  Añadir Cabeza
                </div>
              </SelectTrigger>
              <SelectContent>
                {availableCabezas.map((seller) => (
                  <SelectItem key={seller.sellerId} value={seller.sellerId}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{seller.name}</span>
                      <span className="text-xs text-muted-foreground">
                        (Controla hasta {seller.maxSubordinates})
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}

      {/* Unassigned Promotores */}
      {promotores.filter(p => !p.assignedTo).length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", levelConfig.promotor.dot)} />
            {levelConfig.promotor.icon} PROMOTORES SIN ASIGNAR
            <Badge variant="outline" className="ml-auto">
              {promotores.filter(p => !p.assignedTo).length}
            </Badge>
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {promotores.filter(p => !p.assignedTo).map((promotor) => (
              <SellerCard
                key={promotor.sellerId}
                seller={promotor}
                onRemove={() => onRemove(promotor.sellerId)}
                onAssign={(parentId) => onAssign(promotor.sellerId, parentId)}
                possibleParents={cabezas}
              />
            ))}
          </div>
          
          {/* Add Promotor */}
          {availablePromotores.length > 0 && (
            <Select onValueChange={(v) => {
              const seller = availablePromotores.find(s => s.sellerId === v);
              if (seller) onAddSeller(seller);
            }}>
              <SelectTrigger className="mt-3 border-2 border-dashed border-neon-blue/30 hover:border-neon-blue/50 bg-transparent">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <UserPlus className="w-4 h-4" />
                  Añadir Promotor
                </div>
              </SelectTrigger>
              <SelectContent>
                {availablePromotores.map((seller) => (
                  <SelectItem key={seller.sellerId} value={seller.sellerId}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{seller.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({seller.stats.avgPerEvent}/evento)
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}

      {/* Formation Summary */}
      <div className="p-4 rounded-lg bg-card-elevated border border-border">
        <h4 className="text-sm font-medium mb-3">📊 Resumen de Formación</h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-neon-pink">{subsocios.length}</p>
            <p className="text-xs text-muted-foreground">Sub Socios</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-neon-purple">{cabezas.length}</p>
            <p className="text-xs text-muted-foreground">Cabezas</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-neon-blue">{promotores.length}</p>
            <p className="text-xs text-muted-foreground">Promotores</p>
          </div>
        </div>
        
        {/* Hierarchy validation */}
        <div className="mt-4 space-y-1">
          {cabezas.filter(c => !c.assignedTo).length > 0 && (
            <p className="text-xs text-warning flex items-center gap-1">
              ⚠️ {cabezas.filter(c => !c.assignedTo).length} cabezas sin asignar a un Sub Socio
            </p>
          )}
          {promotores.filter(p => !p.assignedTo).length > 0 && (
            <p className="text-xs text-warning flex items-center gap-1">
              ⚠️ {promotores.filter(p => !p.assignedTo).length} promotores sin asignar a una Cabeza
            </p>
          )}
          {cabezas.filter(c => !c.assignedTo).length === 0 && promotores.filter(p => !p.assignedTo).length === 0 && roster.length > 0 && (
            <p className="text-xs text-success flex items-center gap-1">
              ✅ Todas las asignaciones completas
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
