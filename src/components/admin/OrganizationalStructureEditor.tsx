import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ChevronDown, 
  ChevronRight, 
  X, 
  Users, 
  UserPlus,
  Save,
  Copy,
  Search,
  Settings,
  BarChart3,
  Headphones,
  Download,
  Upload,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

// Types for organizational structure
export interface OrgMember {
  id: string;
  name: string;
  avatar: string;
  level: number;
  levelName: string;
  position: 'socio' | 'subsocio' | 'cabeza' | 'promotor';
  assignedTo?: string;
  maxSubordinates?: number;
  commissionRate: number;
  status: 'active' | 'inactive';
}

export interface OrgTemplate {
  id: string;
  name: string;
  description?: string;
  isDefault: boolean;
  members: OrgMember[];
  createdAt: string;
}

// Level configuration
const levelConfig = {
  socio: {
    color: "from-gradient-party to-neon-purple/20",
    border: "border-primary/40 hover:border-primary/60",
    dot: "bg-gradient-party",
    label: "SOCIOS",
    icon: "👑",
    level: 4
  },
  subsocio: {
    color: "from-neon-pink/20 to-neon-purple/10",
    border: "border-neon-pink/30 hover:border-neon-pink/60",
    dot: "bg-neon-pink",
    label: "SUB SOCIOS",
    icon: "👔",
    level: 3
  },
  cabeza: {
    color: "from-neon-orange/20 to-neon-orange/10",
    border: "border-neon-orange/30 hover:border-neon-orange/60",
    dot: "bg-neon-orange",
    label: "CABEZAS DE EQUIPO",
    icon: "🎯",
    level: 2
  },
  promotor: {
    color: "from-neon-blue/20 to-cyan-500/10",
    border: "border-neon-blue/30 hover:border-neon-blue/60",
    dot: "bg-neon-blue",
    label: "PROMOTORES COMUNES",
    icon: "🎫",
    level: 1
  }
};

// Mock data for available members (would come from backend)
const availableMembers: OrgMember[] = [
  // Sub Socios
  { id: "new-ss-1", name: "Ricardo Mendoza", avatar: "RM", level: 3, levelName: "Sub Socio", position: 'subsocio', maxSubordinates: 5, commissionRate: 12000, status: 'active' },
  { id: "new-ss-2", name: "Laura Martínez", avatar: "LM", level: 3, levelName: "Sub Socio", position: 'subsocio', maxSubordinates: 4, commissionRate: 12000, status: 'active' },
  { id: "new-ss-3", name: "Fernando López", avatar: "FL", level: 3, levelName: "Sub Socio", position: 'subsocio', maxSubordinates: 3, commissionRate: 11000, status: 'active' },
  // Cabezas
  { id: "new-cb-1", name: "Juan Pérez", avatar: "JP", level: 2, levelName: "Cabeza", position: 'cabeza', maxSubordinates: 8, commissionRate: 10000, status: 'active' },
  { id: "new-cb-2", name: "María García", avatar: "MG", level: 2, levelName: "Cabeza", position: 'cabeza', maxSubordinates: 6, commissionRate: 10000, status: 'active' },
  { id: "new-cb-3", name: "Carlos Ruiz", avatar: "CR", level: 2, levelName: "Cabeza", position: 'cabeza', maxSubordinates: 5, commissionRate: 9500, status: 'active' },
  { id: "new-cb-4", name: "Ana Torres", avatar: "AT", level: 2, levelName: "Cabeza", position: 'cabeza', maxSubordinates: 7, commissionRate: 9000, status: 'active' },
  // Promotores
  { id: "new-pr-1", name: "Luis Gómez", avatar: "LG", level: 1, levelName: "Común", position: 'promotor', commissionRate: 7500, status: 'active' },
  { id: "new-pr-2", name: "Sofía Rodríguez", avatar: "SR", level: 1, levelName: "Común", position: 'promotor', commissionRate: 7500, status: 'active' },
  { id: "new-pr-3", name: "Pedro Sánchez", avatar: "PS", level: 1, levelName: "Común", position: 'promotor', commissionRate: 7000, status: 'active' },
  { id: "new-pr-4", name: "Valentina Díaz", avatar: "VD", level: 1, levelName: "Común", position: 'promotor', commissionRate: 7500, status: 'active' },
  { id: "new-pr-5", name: "Andrés Moreno", avatar: "AM", level: 1, levelName: "Común", position: 'promotor', commissionRate: 7000, status: 'active' },
  { id: "new-pr-6", name: "Camila Vargas", avatar: "CV", level: 1, levelName: "Común", position: 'promotor', commissionRate: 7500, status: 'active' },
];

// Member Card Component
interface MemberCardProps {
  member: OrgMember;
  onRemove: () => void;
  onAssign?: (parentId: string | undefined) => void;
  possibleParents?: OrgMember[];
  subordinates?: OrgMember[];
  expanded?: boolean;
  onToggleExpand?: () => void;
}

function MemberCard({ 
  member, 
  onRemove, 
  onAssign, 
  possibleParents,
  subordinates,
  expanded,
  onToggleExpand
}: MemberCardProps) {
  const config = levelConfig[member.position];
  const hasSubordinates = subordinates && subordinates.length > 0;

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

      <div className="flex items-center gap-3">
        {/* Expand toggle for parents */}
        {hasSubordinates && onToggleExpand && (
          <button 
            onClick={onToggleExpand}
            className="p-1 rounded hover:bg-background/50 transition-colors"
          >
            {expanded ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        )}

        {/* Avatar */}
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold",
          "bg-gradient-to-br from-background/80 to-background/40 border border-border/50"
        )}>
          {member.avatar}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm truncate">{member.name}</span>
            <Badge variant="outline" className="text-xs">
              {member.levelName}
            </Badge>
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
            <span>${member.commissionRate.toLocaleString()}/ticket</span>
            {member.maxSubordinates && (
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                máx {member.maxSubordinates}
              </span>
            )}
          </div>
        </div>

        {/* Parent assignment */}
        {possibleParents && possibleParents.length > 0 && onAssign && (
          <Select 
            value={member.assignedTo || ""} 
            onValueChange={(v) => onAssign(v || undefined)}
          >
            <SelectTrigger className="w-36 h-8 text-xs">
              <SelectValue placeholder="Asignar a..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Sin asignar</SelectItem>
              {possibleParents.map((parent) => (
                <SelectItem key={parent.id} value={parent.id}>
                  {parent.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Subordinates count */}
        {hasSubordinates && (
          <Badge variant="secondary" className="gap-1">
            <Users className="w-3 h-3" />
            {subordinates!.length}
          </Badge>
        )}
      </div>
    </Card>
  );
}

// Main Component
interface OrganizationalStructureEditorProps {
  onConfigureLevels?: () => void;
}

export function OrganizationalStructureEditor({ onConfigureLevels }: OrganizationalStructureEditorProps) {
  const [structure, setStructure] = useState<OrgMember[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [hasChanges, setHasChanges] = useState(false);

  // Filter members by position
  const subsocios = structure.filter(m => m.position === 'subsocio');
  const cabezas = structure.filter(m => m.position === 'cabeza');
  const promotores = structure.filter(m => m.position === 'promotor');

  // Available members not in structure
  const getAvailable = (position: OrgMember['position']) => {
    return availableMembers.filter(
      m => m.position === position && !structure.find(s => s.id === m.id)
    );
  };

  const toggleExpand = (memberId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(memberId)) {
      newExpanded.delete(memberId);
    } else {
      newExpanded.add(memberId);
    }
    setExpandedNodes(newExpanded);
  };

  const getSubordinates = (parentId: string): OrgMember[] => {
    return structure.filter(m => m.assignedTo === parentId);
  };

  const handleAddMember = (member: OrgMember) => {
    setStructure([...structure, member]);
    setExpandedNodes(new Set([...expandedNodes, member.id]));
    setHasChanges(true);
    toast({
      title: "Miembro añadido",
      description: `${member.name} fue añadido a la estructura`
    });
  };

  const handleRemoveMember = (memberId: string) => {
    // Also remove assignments to this member
    setStructure(structure
      .filter(m => m.id !== memberId)
      .map(m => m.assignedTo === memberId ? { ...m, assignedTo: undefined } : m)
    );
    setHasChanges(true);
    toast({
      title: "Miembro removido",
      description: "El miembro fue removido de la estructura"
    });
  };

  const handleAssign = (memberId: string, parentId: string | undefined) => {
    setStructure(structure.map(m => 
      m.id === memberId ? { ...m, assignedTo: parentId } : m
    ));
    setHasChanges(true);
  };

  const handleSaveStructure = () => {
    // In real app, save to backend
    setHasChanges(false);
    toast({
      title: "Estructura guardada",
      description: "Los cambios se guardaron correctamente"
    });
  };

  const handleSaveAsTemplate = () => {
    toast({
      title: "Plantilla guardada",
      description: "La estructura se guardó como plantilla reutilizable"
    });
  };

  // Count stats
  const totalMembers = structure.length;
  const assignedCount = structure.filter(m => m.assignedTo).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="flex items-center gap-2 text-xl">
            <BarChart3 className="w-5 h-5 text-primary" />
            Estructura Organizacional General
            <Badge variant="secondary" className="ml-2">
              Editable
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={onConfigureLevels}>
              <Settings className="w-4 h-4" />
              Configurar Niveles
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Headphones className="w-4 h-4" />
              Soporte
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Stats Bar */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-card-elevated mb-4">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold font-display text-primary">{totalMembers}</p>
                <p className="text-xs text-muted-foreground">Total Miembros</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold font-display text-neon-pink">{subsocios.length}</p>
                <p className="text-xs text-muted-foreground">Sub Socios</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold font-display text-neon-orange">{cabezas.length}</p>
                <p className="text-xs text-muted-foreground">Cabezas</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold font-display text-neon-blue">{promotores.length}</p>
                <p className="text-xs text-muted-foreground">Promotores</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={handleSaveAsTemplate}
                disabled={structure.length === 0}
              >
                <Copy className="w-4 h-4" />
                Guardar como Plantilla
              </Button>
              <Button 
                variant="party" 
                size="sm" 
                className="gap-2"
                onClick={handleSaveStructure}
                disabled={!hasChanges}
              >
                <Save className="w-4 h-4" />
                Guardar Cambios
              </Button>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar miembros..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Upload className="w-4 h-4" />
              Cargar Plantilla
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Exportar
            </Button>
          </div>

          {/* Hierarchical Structure */}
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
                  const subordinateCabezas = getSubordinates(subsocio.id);
                  const isExpanded = expandedNodes.has(subsocio.id);
                  
                  return (
                    <motion.div
                      key={subsocio.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3"
                    >
                      <MemberCard
                        member={subsocio}
                        onRemove={() => handleRemoveMember(subsocio.id)}
                        subordinates={subordinateCabezas}
                        expanded={isExpanded}
                        onToggleExpand={() => toggleExpand(subsocio.id)}
                      />
                      
                      {/* Nested Cabezas */}
                      <AnimatePresence>
                        {isExpanded && subordinateCabezas.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="ml-8 pl-4 border-l-2 border-neon-orange/20 space-y-3"
                          >
                            {subordinateCabezas.map((cabeza) => {
                              const subordinatePromotores = getSubordinates(cabeza.id);
                              const isCabezaExpanded = expandedNodes.has(cabeza.id);
                              
                              return (
                                <div key={cabeza.id} className="space-y-2">
                                  <MemberCard
                                    member={cabeza}
                                    onRemove={() => handleRemoveMember(cabeza.id)}
                                    onAssign={(parentId) => handleAssign(cabeza.id, parentId)}
                                    possibleParents={subsocios}
                                    subordinates={subordinatePromotores}
                                    expanded={isCabezaExpanded}
                                    onToggleExpand={() => toggleExpand(cabeza.id)}
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
                                          <MemberCard
                                            key={promotor.id}
                                            member={promotor}
                                            onRemove={() => handleRemoveMember(promotor.id)}
                                            onAssign={(parentId) => handleAssign(promotor.id, parentId)}
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
                {getAvailable('subsocio').length > 0 && (
                  <Select onValueChange={(v) => {
                    const member = getAvailable('subsocio').find(m => m.id === v);
                    if (member) handleAddMember(member);
                  }}>
                    <SelectTrigger className="border-2 border-dashed border-neon-pink/30 hover:border-neon-pink/50 bg-transparent">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <UserPlus className="w-4 h-4" />
                        Añadir Sub Socio
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailable('subsocio').map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{member.name}</span>
                            <span className="text-xs text-muted-foreground">
                              (máx {member.maxSubordinates})
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
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <div className={cn("w-2 h-2 rounded-full", levelConfig.cabeza.dot)} />
                {levelConfig.cabeza.icon} {levelConfig.cabeza.label}
                <Badge variant="outline" className="ml-auto">{cabezas.length}</Badge>
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {cabezas.filter(c => !c.assignedTo).map((cabeza) => {
                  const subordinatePromotores = getSubordinates(cabeza.id);
                  const isExpanded = expandedNodes.has(cabeza.id);
                  
                  return (
                    <div key={cabeza.id} className="space-y-2">
                      <MemberCard
                        member={cabeza}
                        onRemove={() => handleRemoveMember(cabeza.id)}
                        onAssign={(parentId) => handleAssign(cabeza.id, parentId)}
                        possibleParents={subsocios}
                        subordinates={subordinatePromotores}
                        expanded={isExpanded}
                        onToggleExpand={() => toggleExpand(cabeza.id)}
                      />
                      
                      <AnimatePresence>
                        {isExpanded && subordinatePromotores.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="ml-6 pl-4 border-l-2 border-neon-blue/20 space-y-2"
                          >
                            {subordinatePromotores.map((promotor) => (
                              <MemberCard
                                key={promotor.id}
                                member={promotor}
                                onRemove={() => handleRemoveMember(promotor.id)}
                                onAssign={(parentId) => handleAssign(promotor.id, parentId)}
                                possibleParents={cabezas}
                              />
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
                
                {/* Add Cabeza */}
                {getAvailable('cabeza').length > 0 && (
                  <Select onValueChange={(v) => {
                    const member = getAvailable('cabeza').find(m => m.id === v);
                    if (member) handleAddMember(member);
                  }}>
                    <SelectTrigger className="h-auto min-h-[80px] border-2 border-dashed border-neon-orange/30 hover:border-neon-orange/50 bg-transparent">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <UserPlus className="w-4 h-4" />
                        Añadir Cabeza de Equipo
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailable('cabeza').map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{member.name}</span>
                            <span className="text-xs text-muted-foreground">
                              (máx {member.maxSubordinates})
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            {/* Unassigned Promotores */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <div className={cn("w-2 h-2 rounded-full", levelConfig.promotor.dot)} />
                {levelConfig.promotor.icon} {levelConfig.promotor.label}
                <Badge variant="outline" className="ml-auto">{promotores.length}</Badge>
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {promotores.filter(p => !p.assignedTo).map((promotor) => (
                  <MemberCard
                    key={promotor.id}
                    member={promotor}
                    onRemove={() => handleRemoveMember(promotor.id)}
                    onAssign={(parentId) => handleAssign(promotor.id, parentId)}
                    possibleParents={cabezas}
                  />
                ))}
                
                {/* Add Promotor */}
                {getAvailable('promotor').length > 0 && (
                  <Select onValueChange={(v) => {
                    const member = getAvailable('promotor').find(m => m.id === v);
                    if (member) handleAddMember(member);
                  }}>
                    <SelectTrigger className="h-auto min-h-[80px] border-2 border-dashed border-neon-blue/30 hover:border-neon-blue/50 bg-transparent">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <UserPlus className="w-4 h-4" />
                        Añadir Promotor
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailable('promotor').map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{member.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </div>

          {/* Empty State */}
          {structure.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-2">Sin estructura definida</h3>
              <p className="text-muted-foreground mb-4">
                Empieza añadiendo Sub Socios, Cabezas y Promotores a tu estructura organizacional
              </p>
              <Button variant="outline" className="gap-2">
                <Upload className="w-4 h-4" />
                Cargar Plantilla Existente
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
