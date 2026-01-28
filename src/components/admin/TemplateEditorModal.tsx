import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Save, 
  Users, 
  X,
  Search,
  UserPlus,
  UserMinus,
  ChevronRight,
  Headphones
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { EventTemplate, SellerRoster, registeredSellers } from "@/data/eventTemplates";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TemplateEditorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: EventTemplate | null;
  onSave: (template: EventTemplate) => void;
}

const levelColors: Record<number, string> = {
  1: "bg-neon-blue/20 text-neon-blue border-neon-blue/30",
  2: "bg-neon-orange/20 text-neon-orange border-neon-orange/30",
  3: "bg-neon-pink/20 text-neon-pink border-neon-pink/30",
};

const positionLabels: Record<string, string> = {
  subsocio: "Sub Socio",
  cabeza: "Cabeza",
  promotor: "Promotor",
};

export function TemplateEditorModal({ 
  open, 
  onOpenChange, 
  template,
  onSave 
}: TemplateEditorModalProps) {
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    roster: [] as SellerRoster[],
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (template) {
      setEditForm({
        name: template.name,
        description: template.description || "",
        roster: [...template.roster],
      });
    }
  }, [template]);

  if (!template) return null;

  const availableSellers = registeredSellers.filter(
    seller => !editForm.roster.some(r => r.sellerId === seller.sellerId)
  );

  const filteredAvailable = availableSellers.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSeller = (seller: SellerRoster) => {
    setEditForm(prev => ({
      ...prev,
      roster: [...prev.roster, { ...seller, assignedTo: undefined }],
    }));
  };

  const handleRemoveSeller = (sellerId: string) => {
    setEditForm(prev => ({
      ...prev,
      roster: prev.roster.filter(r => r.sellerId !== sellerId),
    }));
  };

  const handleAssignSupervisor = (sellerId: string, supervisorId: string | undefined) => {
    setEditForm(prev => ({
      ...prev,
      roster: prev.roster.map(r =>
        r.sellerId === sellerId
          ? { ...r, assignedTo: supervisorId }
          : r
      ),
    }));
  };

  const handleSave = () => {
    if (!editForm.name.trim()) {
      toast.error("El nombre de la plantilla es requerido");
      return;
    }

    const subsocios = editForm.roster.filter(r => r.position === 'subsocio').length;
    const cabezas = editForm.roster.filter(r => r.position === 'cabeza').length;
    const promotores = editForm.roster.filter(r => r.position === 'promotor').length;

    const updatedTemplate: EventTemplate = {
      ...template,
      name: editForm.name,
      description: editForm.description,
      roster: editForm.roster,
      formation: { subsocios, cabezas, promotores },
    };

    onSave(updatedTemplate);
    toast.success("Plantilla actualizada correctamente");
    onOpenChange(false);
  };

  // Group roster by position
  const subsocios = editForm.roster.filter(r => r.position === 'subsocio');
  const cabezas = editForm.roster.filter(r => r.position === 'cabeza');
  const promotores = editForm.roster.filter(r => r.position === 'promotor');

  // Get possible supervisors for a seller based on position
  const getSupervisors = (position: string): SellerRoster[] => {
    if (position === 'cabeza') {
      return subsocios;
    } else if (position === 'promotor') {
      return cabezas;
    }
    return [];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Editar Plantilla: {template.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6">
          {/* Left: Template Info & Current Roster */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nombre de la plantilla"
                />
              </div>
              <div className="space-y-2">
                <Label>Descripción</Label>
                <Input
                  value={editForm.description}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descripción breve..."
                />
              </div>
            </div>

            {/* Current Roster */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Alineación Actual ({editForm.roster.length})</h4>
                <Badge variant="secondary">
                  {subsocios.length}-{cabezas.length}-{promotores.length}
                </Badge>
              </div>

              <ScrollArea className="h-[400px] border rounded-lg p-3">
                {/* Sub Socios */}
                {subsocios.length > 0 && (
                  <div className="mb-4">
                    <h5 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-neon-pink" />
                      SUB SOCIOS
                    </h5>
                    <div className="space-y-2">
                      {subsocios.map(seller => (
                        <RosterMemberCard
                          key={seller.sellerId}
                          seller={seller}
                          onRemove={() => handleRemoveSeller(seller.sellerId)}
                          supervisors={[]}
                          onAssign={() => {}}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Cabezas */}
                {cabezas.length > 0 && (
                  <div className="mb-4">
                    <h5 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-neon-orange" />
                      CABEZAS
                    </h5>
                    <div className="space-y-2">
                      {cabezas.map(seller => (
                        <RosterMemberCard
                          key={seller.sellerId}
                          seller={seller}
                          onRemove={() => handleRemoveSeller(seller.sellerId)}
                          supervisors={getSupervisors(seller.position)}
                          currentSupervisor={seller.assignedTo}
                          onAssign={(supId) => handleAssignSupervisor(seller.sellerId, supId)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Promotores */}
                {promotores.length > 0 && (
                  <div>
                    <h5 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-neon-blue" />
                      PROMOTORES
                    </h5>
                    <div className="space-y-2">
                      {promotores.map(seller => (
                        <RosterMemberCard
                          key={seller.sellerId}
                          seller={seller}
                          onRemove={() => handleRemoveSeller(seller.sellerId)}
                          supervisors={getSupervisors(seller.position)}
                          currentSupervisor={seller.assignedTo}
                          onAssign={(supId) => handleAssignSupervisor(seller.sellerId, supId)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {editForm.roster.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                    <Users className="w-8 h-8 mb-2 opacity-50" />
                    <p className="text-sm">No hay vendedores en esta plantilla</p>
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>

          {/* Right: Available Sellers */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Vendedores Disponibles</h4>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar vendedor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <ScrollArea className="h-[400px] border rounded-lg p-3">
              <div className="space-y-2">
                {filteredAvailable.map(seller => (
                  <motion.div
                    key={seller.sellerId}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border transition-all",
                      "bg-card-elevated border-border hover:border-primary/30"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold",
                      levelColors[seller.level]
                    )}>
                      {seller.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{seller.name}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {positionLabels[seller.position]}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {seller.stats.avgPerEvent}/evento
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 text-success hover:text-success hover:bg-success/10"
                      onClick={() => handleAddSeller(seller)}
                    >
                      <UserPlus className="w-4 h-4" />
                      Añadir
                    </Button>
                  </motion.div>
                ))}

                {filteredAvailable.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                    <p className="text-sm">
                      {searchTerm ? "No se encontraron vendedores" : "Todos los vendedores están asignados"}
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className="border-t border-border pt-4">
          <Button variant="outline" className="gap-2">
            <Headphones className="w-4 h-4" />
            Soporte
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button variant="party" className="gap-2" onClick={handleSave}>
              <Save className="w-4 h-4" />
              Guardar Cambios
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface RosterMemberCardProps {
  seller: SellerRoster;
  onRemove: () => void;
  supervisors: SellerRoster[];
  currentSupervisor?: string;
  onAssign: (supervisorId: string | undefined) => void;
}

function RosterMemberCard({ 
  seller, 
  onRemove, 
  supervisors, 
  currentSupervisor,
  onAssign 
}: RosterMemberCardProps) {
  return (
    <div className={cn(
      "flex items-center gap-3 p-2 rounded-lg border transition-all",
      "bg-card border-border"
    )}>
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
        levelColors[seller.level]
      )}>
        {seller.avatar}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{seller.name}</p>
        {supervisors.length > 0 && (
          <Select
            value={currentSupervisor || "unassigned"}
            onValueChange={(v) => onAssign(v === "unassigned" ? undefined : v)}
          >
            <SelectTrigger className="h-6 text-xs mt-1">
              <SelectValue placeholder="Asignar supervisor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unassigned">Sin asignar</SelectItem>
              {supervisors.map(sup => (
                <SelectItem key={sup.sellerId} value={sup.sellerId}>
                  {sup.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
        onClick={onRemove}
      >
        <UserMinus className="w-4 h-4" />
      </Button>
    </div>
  );
}
