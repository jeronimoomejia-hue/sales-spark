import { useState, useEffect } from "react";
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
  User,
  Edit, 
  Save, 
  Users, 
  DollarSign, 
  Shield,
  Trash2,
  Check,
  Headphones,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { TeamMember } from "@/data/mockData";

interface MemberEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: TeamMember | null;
  editorLevel: number; // The level of the person editing (to determine permissions)
  availableSupervisors?: TeamMember[]; // List of potential supervisors this member can be assigned to
  onSave?: (member: TeamMember, newParentId?: string) => void;
  onDelete?: (memberId: string) => void;
}

const levelNames: Record<number, string> = {
  1: "Promotor Común",
  2: "Promotor Cabeza",
  3: "Sub Socio",
  4: "Socio",
};

const levelColors: Record<number, string> = {
  1: "bg-neon-blue/20 text-neon-blue border-neon-blue/30",
  2: "bg-neon-orange/20 text-neon-orange border-neon-orange/30",
  3: "bg-neon-pink/20 text-neon-pink border-neon-pink/30",
  4: "bg-gradient-party text-white border-primary/30",
};

export function MemberEditModal({ 
  open, 
  onOpenChange, 
  member,
  editorLevel,
  availableSupervisors = [],
  onSave,
  onDelete
}: MemberEditModalProps) {
  const [editForm, setEditForm] = useState({
    name: "",
    parentId: null as string | null,
    level: 1,
    commissionPerTicket: 5000,
    teamSize: 0,
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Update form when member changes
  useEffect(() => {
    if (member) {
      setEditForm({
        name: member.name,
        parentId: member.parentId,
        level: member.level,
        commissionPerTicket: member.commissionPerTicket,
        teamSize: member.teamSize || 0,
      });
      setShowDeleteConfirm(false);
    }
  }, [member]);

  if (!member) return null;

  // Can only edit members at lower levels
  const canEdit = editorLevel > member.level;
  // Can only change level to levels below editor
  const availableLevels = Array.from({ length: editorLevel - 1 }, (_, i) => i + 1);
  // Can promote up to one level below editor
  const canPromote = member.level < editorLevel - 1;
  
  // Filter supervisors that are at the level above the member
  const validSupervisors = availableSupervisors.filter(
    (sup) => sup.level === member.level + 1 && sup.id !== member.id
  );

  const handleSave = () => {
    if (!canEdit) {
      toast({
        title: "Sin permisos",
        description: "No tienes permisos para editar este usuario.",
        variant: "destructive",
      });
      return;
    }

    const updatedMember: TeamMember = {
      ...member,
      name: editForm.name,
      parentId: editForm.parentId,
      level: editForm.level,
      levelName: levelNames[editForm.level],
      commissionPerTicket: editForm.commissionPerTicket,
      teamSize: editForm.teamSize,
    };

    const parentChanged = editForm.parentId !== member.parentId;
    onSave?.(updatedMember, parentChanged ? editForm.parentId || undefined : undefined);
    
    toast({
      title: "Usuario actualizado",
      description: parentChanged 
        ? `${editForm.name} ha sido reasignado correctamente.`
        : `${editForm.name} ha sido actualizado correctamente.`,
    });
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (!canEdit) return;
    onDelete?.(member.id);
    toast({
      title: "Usuario eliminado",
      description: `${member.name} ha sido removido del equipo.`,
    });
    onOpenChange(false);
  };

  const handlePromote = () => {
    if (!canPromote) return;
    const newLevel = Math.min(member.level + 1, editorLevel - 1);
    setEditForm(prev => ({ ...prev, level: newLevel }));
    toast({
      title: "Promoción aplicada",
      description: `${member.name} será promovido a ${levelNames[newLevel]}.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5 text-primary" />
            {canEdit ? "Editar Miembro" : "Ver Miembro"}
          </DialogTitle>
        </DialogHeader>

        {/* Member Header */}
        <div className="flex items-center gap-4 p-4 rounded-lg bg-card-elevated">
          <div className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold",
            levelColors[member.level]
          )}>
            {member.avatar}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold">{member.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className={cn("border", levelColors[member.level])}>
                {member.levelName}
              </Badge>
              <span className="text-xs text-muted-foreground">ID: {member.id}</span>
            </div>
          </div>
          {canPromote && canEdit && (
            <Button variant="outline" size="sm" className="gap-1" onClick={handlePromote}>
              <Shield className="w-4 h-4" />
              Promover
            </Button>
          )}
        </div>

        {!canEdit ? (
          // View Only Mode
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center gap-2 text-muted-foreground mb-3">
              <Shield className="w-4 h-4" />
              <span className="text-sm">Solo puedes editar usuarios de nivel inferior al tuyo</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Nivel</p>
                <p className="font-medium">{member.levelName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Comisión/Ticket</p>
                <p className="font-medium">${member.commissionPerTicket.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Tamaño de Equipo</p>
                <p className="font-medium">{member.teamSize || 0} personas</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Ventas Totales</p>
                <p className="font-medium">{member.ownSales.total + member.teamSales.total}</p>
              </div>
            </div>
          </div>
        ) : (
          // Edit Mode
          <div className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <User className="w-3 h-3" />
                Nombre Completo
              </Label>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                placeholder="Nombre del vendedor"
              />
            </div>

            {/* Level Selection */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Nivel Jerárquico
              </Label>
              <div className="flex flex-wrap gap-2">
                {availableLevels.map((level) => (
                  <button
                    key={level}
                    onClick={() => setEditForm({ ...editForm, level })}
                    className={cn(
                      "px-3 py-2 rounded-lg border transition-all flex items-center gap-2",
                      editForm.level === level
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                      levelColors[level]
                    )}>
                      {level}
                    </div>
                    <span className="text-sm">{levelNames[level]}</span>
                    {editForm.level === level && (
                      <Check className="w-3 h-3 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Supervisor Assignment */}
            {validSupervisors.length > 0 && (
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  Reporta a (Supervisor)
                </Label>
                <div className="flex flex-wrap gap-2">
                  {validSupervisors.map((supervisor) => (
                    <button
                      key={supervisor.id}
                      onClick={() => setEditForm({ ...editForm, parentId: supervisor.id })}
                      className={cn(
                        "px-3 py-2 rounded-lg border transition-all flex items-center gap-2",
                        editForm.parentId === supervisor.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                        levelColors[supervisor.level]
                      )}>
                        {supervisor.avatar?.charAt(0) || supervisor.name.charAt(0)}
                      </div>
                      <span className="text-sm">{supervisor.name}</span>
                      {editForm.parentId === supervisor.id && (
                        <Check className="w-3 h-3 text-primary" />
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Actualmente reporta a: {
                    validSupervisors.find(s => s.id === member.parentId)?.name || "Sin asignar"
                  }
                </p>
              </div>
            )}

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

            {/* Team Capacity (only for levels that can manage) */}
            {editForm.level >= 2 && (
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  Capacidad de Equipo
                </Label>
                <Input
                  type="number"
                  value={editForm.teamSize}
                  onChange={(e) => setEditForm({ ...editForm, teamSize: Number(e.target.value) })}
                  placeholder="Máximo de personas a gestionar"
                />
              </div>
            )}

            {/* Subordinates Preview */}
            {member.children && member.children.length > 0 && (
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Subordinados Directos ({member.children.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {member.children.slice(0, 5).map((child) => (
                    <div key={child.id} className="flex items-center gap-1 px-2 py-1 rounded bg-background">
                      <div className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center text-xs",
                        levelColors[child.level]
                      )}>
                        {child.avatar.charAt(0)}
                      </div>
                      <span className="text-xs">{child.name}</span>
                    </div>
                  ))}
                  {member.children.length > 5 && (
                    <span className="text-xs text-muted-foreground px-2 py-1">
                      +{member.children.length - 5} más
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Delete Confirmation */}
            {showDeleteConfirm ? (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                  <span className="text-sm font-medium text-destructive">¿Eliminar este usuario?</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Esta acción es irreversible. Los subordinados serán reasignados.
                </p>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={handleDelete}
                  >
                    Confirmar Eliminación
                  </Button>
                </div>
              </div>
            ) : (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-destructive hover:bg-destructive/10 gap-1"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="w-4 h-4" />
                Eliminar Usuario
              </Button>
            )}
          </div>
        )}

        <DialogFooter className="border-t border-border pt-4">
          <Button variant="outline" className="gap-2">
            <Headphones className="w-4 h-4" />
            Soporte
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {canEdit ? "Cancelar" : "Cerrar"}
            </Button>
            {canEdit && (
              <Button variant="party" className="gap-2" onClick={handleSave}>
                <Save className="w-4 h-4" />
                Guardar Cambios
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}