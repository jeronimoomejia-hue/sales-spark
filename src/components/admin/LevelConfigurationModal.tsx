import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { 
  Settings, 
  Edit, 
  Save, 
  Users, 
  DollarSign, 
  Palette,
  ChevronUp,
  ChevronDown,
  GripVertical,
  Eye,
  Check,
  Headphones
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface LevelConfig {
  id: number;
  name: string;
  shortName: string;
  color: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  commissionPerTicket: number;
  teamCapacity: number;
  canManageTeam: boolean;
  canApproveClosures: boolean;
  canCreateEvents: boolean;
}

const defaultLevels: LevelConfig[] = [
  {
    id: 1,
    name: "Promotor Común",
    shortName: "Común",
    color: "neon-blue",
    bgColor: "bg-neon-blue/20",
    textColor: "text-neon-blue",
    borderColor: "border-neon-blue/30",
    commissionPerTicket: 5000,
    teamCapacity: 0,
    canManageTeam: false,
    canApproveClosures: false,
    canCreateEvents: false,
  },
  {
    id: 2,
    name: "Promotor Cabeza",
    shortName: "Cabeza",
    color: "neon-orange",
    bgColor: "bg-neon-orange/20",
    textColor: "text-neon-orange",
    borderColor: "border-neon-orange/30",
    commissionPerTicket: 7500,
    teamCapacity: 15,
    canManageTeam: true,
    canApproveClosures: false,
    canCreateEvents: false,
  },
  {
    id: 3,
    name: "Sub Socio",
    shortName: "Sub Socio",
    color: "neon-pink",
    bgColor: "bg-neon-pink/20",
    textColor: "text-neon-pink",
    borderColor: "border-neon-pink/30",
    commissionPerTicket: 10000,
    teamCapacity: 50,
    canManageTeam: true,
    canApproveClosures: true,
    canCreateEvents: false,
  },
  {
    id: 4,
    name: "Socio",
    shortName: "Socio",
    color: "neon-purple",
    bgColor: "bg-gradient-party",
    textColor: "text-white",
    borderColor: "border-primary/30",
    commissionPerTicket: 15000,
    teamCapacity: 200,
    canManageTeam: true,
    canApproveClosures: true,
    canCreateEvents: true,
  },
];

const colorOptions = [
  { name: "Azul Neón", value: "neon-blue", preview: "bg-neon-blue" },
  { name: "Naranja Neón", value: "neon-orange", preview: "bg-neon-orange" },
  { name: "Rosa Neón", value: "neon-pink", preview: "bg-neon-pink" },
  { name: "Morado Neón", value: "neon-purple", preview: "bg-neon-purple" },
  { name: "Verde Neón", value: "neon-green", preview: "bg-success" },
  { name: "Amarillo Neón", value: "neon-yellow", preview: "bg-warning" },
  { name: "Gradiente Party", value: "gradient-party", preview: "bg-gradient-party" },
];

interface LevelConfigurationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LevelConfigurationModal({ open, onOpenChange }: LevelConfigurationModalProps) {
  const [levels, setLevels] = useState<LevelConfig[]>(defaultLevels);
  const [editingLevel, setEditingLevel] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<LevelConfig | null>(null);

  const handleEditLevel = (level: LevelConfig) => {
    setEditingLevel(level.id);
    setEditForm({ ...level });
  };

  const handleSaveLevel = () => {
    if (!editForm) return;
    
    setLevels(prev => prev.map(l => l.id === editForm.id ? editForm : l));
    setEditingLevel(null);
    setEditForm(null);
    toast({
      title: "Nivel actualizado",
      description: `${editForm.name} ha sido configurado correctamente.`,
    });
  };

  const handleCancelEdit = () => {
    setEditingLevel(null);
    setEditForm(null);
  };

  const handleSaveAll = () => {
    toast({
      title: "Configuración guardada",
      description: "La estructura organizacional ha sido actualizada.",
    });
    onOpenChange(false);
  };

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string; text: string; border: string }> = {
      "neon-blue": { bg: "bg-neon-blue/20", text: "text-neon-blue", border: "border-neon-blue/30" },
      "neon-orange": { bg: "bg-neon-orange/20", text: "text-neon-orange", border: "border-neon-orange/30" },
      "neon-pink": { bg: "bg-neon-pink/20", text: "text-neon-pink", border: "border-neon-pink/30" },
      "neon-purple": { bg: "bg-neon-purple/20", text: "text-neon-purple", border: "border-neon-purple/30" },
      "neon-green": { bg: "bg-success/20", text: "text-success", border: "border-success/30" },
      "neon-yellow": { bg: "bg-warning/20", text: "text-warning", border: "border-warning/30" },
      "gradient-party": { bg: "bg-gradient-party", text: "text-white", border: "border-primary/30" },
    };
    return colorMap[color] || colorMap["neon-blue"];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            Configuración de Niveles Jerárquicos
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto max-h-[60vh] pr-2">
          {/* Hierarchy Visualization */}
          <div className="p-4 rounded-lg bg-card-elevated">
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Estructura de la Organización
            </h4>
            <div className="flex items-center justify-center gap-2">
              {levels.slice().reverse().map((level, idx) => {
                const colors = getColorClasses(level.color);
                return (
                  <div key={level.id} className="flex items-center gap-2">
                    <div className={cn(
                      "px-3 py-2 rounded-lg border text-center min-w-[100px]",
                      colors.bg, colors.text, colors.border
                    )}>
                      <p className="font-semibold text-sm">{level.shortName}</p>
                      <p className="text-xs opacity-70">Nivel {level.id}</p>
                    </div>
                    {idx < levels.length - 1 && (
                      <ChevronDown className="w-4 h-4 text-muted-foreground rotate-[-90deg]" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Level Configuration List */}
          <div className="space-y-3">
            {levels.map((level) => {
              const colors = getColorClasses(level.color);
              const isEditing = editingLevel === level.id;

              return (
                <motion.div
                  key={level.id}
                  layout
                  className={cn(
                    "p-4 rounded-lg border transition-all",
                    isEditing 
                      ? "bg-primary/5 border-primary/30" 
                      : "bg-card-elevated border-border hover:border-primary/20"
                  )}
                >
                  {isEditing && editForm ? (
                    // Edit Mode
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold flex items-center gap-2">
                          <Edit className="w-4 h-4 text-primary" />
                          Editando: {level.name}
                        </h4>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                            Cancelar
                          </Button>
                          <Button variant="party" size="sm" className="gap-1" onClick={handleSaveLevel}>
                            <Save className="w-4 h-4" />
                            Guardar
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {/* Name */}
                        <div className="space-y-2">
                          <Label>Nombre Completo</Label>
                          <Input
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            placeholder="Ej: Promotor Cabeza"
                          />
                        </div>

                        {/* Short Name */}
                        <div className="space-y-2">
                          <Label>Nombre Corto</Label>
                          <Input
                            value={editForm.shortName}
                            onChange={(e) => setEditForm({ ...editForm, shortName: e.target.value })}
                            placeholder="Ej: Cabeza"
                          />
                        </div>

                        {/* Commission */}
                        <div className="space-y-2">
                          <Label className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            Comisión por Ticket (COP)
                          </Label>
                          <Input
                            type="number"
                            value={editForm.commissionPerTicket}
                            onChange={(e) => setEditForm({ ...editForm, commissionPerTicket: Number(e.target.value) })}
                          />
                        </div>

                        {/* Team Capacity */}
                        <div className="space-y-2">
                          <Label className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            Capacidad de Equipo
                          </Label>
                          <Input
                            type="number"
                            value={editForm.teamCapacity}
                            onChange={(e) => setEditForm({ ...editForm, teamCapacity: Number(e.target.value) })}
                            placeholder="0 = Sin equipo"
                          />
                        </div>
                      </div>

                      {/* Color Selection */}
                      <div className="space-y-2">
                        <Label className="flex items-center gap-1">
                          <Palette className="w-3 h-3" />
                          Color del Nivel
                        </Label>
                        <div className="flex flex-wrap gap-2">
                          {colorOptions.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => setEditForm({ ...editForm, color: option.value })}
                              className={cn(
                                "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all",
                                editForm.color === option.value
                                  ? "border-primary bg-primary/10"
                                  : "border-border hover:border-primary/50"
                              )}
                            >
                              <div className={cn("w-4 h-4 rounded-full", option.preview)} />
                              <span className="text-sm">{option.name}</span>
                              {editForm.color === option.value && (
                                <Check className="w-3 h-3 text-primary" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Permissions */}
                      <div className="space-y-2">
                        <Label>Permisos</Label>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => setEditForm({ ...editForm, canManageTeam: !editForm.canManageTeam })}
                            className={cn(
                              "px-3 py-1.5 rounded-lg border text-sm transition-all",
                              editForm.canManageTeam
                                ? "bg-success/20 border-success/30 text-success"
                                : "bg-muted border-border text-muted-foreground"
                            )}
                          >
                            Gestionar Equipo
                          </button>
                          <button
                            onClick={() => setEditForm({ ...editForm, canApproveClosures: !editForm.canApproveClosures })}
                            className={cn(
                              "px-3 py-1.5 rounded-lg border text-sm transition-all",
                              editForm.canApproveClosures
                                ? "bg-success/20 border-success/30 text-success"
                                : "bg-muted border-border text-muted-foreground"
                            )}
                          >
                            Aprobar Cierres
                          </button>
                          <button
                            onClick={() => setEditForm({ ...editForm, canCreateEvents: !editForm.canCreateEvents })}
                            className={cn(
                              "px-3 py-1.5 rounded-lg border text-sm transition-all",
                              editForm.canCreateEvents
                                ? "bg-success/20 border-success/30 text-success"
                                : "bg-muted border-border text-muted-foreground"
                            )}
                          >
                            Crear Eventos
                          </button>
                        </div>
                      </div>

                      {/* Preview */}
                      <div className="p-3 rounded-lg bg-background">
                        <p className="text-xs text-muted-foreground mb-2">Vista Previa:</p>
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold",
                            getColorClasses(editForm.color).bg,
                            getColorClasses(editForm.color).text
                          )}>
                            JP
                          </div>
                          <div>
                            <p className="font-medium">Juan Pérez</p>
                            <Badge 
                              variant="outline" 
                              className={cn(
                                "border",
                                getColorClasses(editForm.color).bg,
                                getColorClasses(editForm.color).text,
                                getColorClasses(editForm.color).border
                              )}
                            >
                              {editForm.name}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold",
                          colors.bg, colors.text
                        )}>
                          {level.id}
                        </div>
                        <div>
                          <h4 className="font-semibold">{level.name}</h4>
                          <p className="text-sm text-muted-foreground">Nivel {level.id}</p>
                        </div>
                      </div>

                      <div className="flex-1 grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-lg font-bold text-warning">
                            ${level.commissionPerTicket.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">Comisión/ticket</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold">
                            {level.teamCapacity === 0 ? "N/A" : level.teamCapacity}
                          </p>
                          <p className="text-xs text-muted-foreground">Capacidad equipo</p>
                        </div>
                        <div className="flex items-center justify-center gap-1">
                          {level.canManageTeam && (
                            <Badge variant="secondary" className="text-xs">Equipo</Badge>
                          )}
                          {level.canApproveClosures && (
                            <Badge variant="secondary" className="text-xs">Cierres</Badge>
                          )}
                          {level.canCreateEvents && (
                            <Badge variant="secondary" className="text-xs">Eventos</Badge>
                          )}
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => handleEditLevel(level)}
                      >
                        <Edit className="w-4 h-4" />
                        Editar
                      </Button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between border-t border-border pt-4">
          <Button variant="outline" className="gap-2">
            <Headphones className="w-4 h-4" />
            Soporte
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button variant="party" className="gap-2" onClick={handleSaveAll}>
              <Save className="w-4 h-4" />
              Guardar Configuración
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}