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
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FileText, 
  Plus, 
  Edit, 
  Copy, 
  Trash2, 
  Save, 
  Users, 
  Calendar,
  Check,
  X,
  Search,
  Eye,
  ChevronRight,
  Headphones,
  LayoutGrid
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { organizationData, TeamMember, events } from "@/data/mockData";

interface RosterTemplate {
  id: string;
  name: string;
  description: string;
  members: string[]; // Member IDs
  createdAt: string;
  lastUsed: string;
  eventsUsed: number;
}

const mockTemplates: RosterTemplate[] = [
  {
    id: "tpl-1",
    name: "Plantilla Conciertos Grandes",
    description: "Para eventos con más de 5,000 asistentes",
    members: ["sub-1", "sub-2", "head-1", "head-2", "head-3", "promo-1", "promo-2", "promo-3"],
    createdAt: "2025-01-15",
    lastUsed: "2025-01-26",
    eventsUsed: 12,
  },
  {
    id: "tpl-2",
    name: "Plantilla Festivales",
    description: "Equipo completo para festivales de varios días",
    members: ["sub-1", "sub-2", "sub-3", "head-1", "head-2", "head-3", "head-4", "promo-1", "promo-2"],
    createdAt: "2025-01-10",
    lastUsed: "2025-01-20",
    eventsUsed: 5,
  },
  {
    id: "tpl-3",
    name: "Plantilla Eventos Pequeños",
    description: "Para eventos íntimos de menos de 500 personas",
    members: ["head-1", "promo-1", "promo-2"],
    createdAt: "2025-01-05",
    lastUsed: "2025-01-27",
    eventsUsed: 25,
  },
  {
    id: "tpl-4",
    name: "Plantilla VIP Only",
    description: "Solo vendedores especializados en ventas VIP",
    members: ["head-2", "promo-3", "promo-4"],
    createdAt: "2025-01-08",
    lastUsed: "2025-01-24",
    eventsUsed: 8,
  },
];

interface TemplateManagementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TemplateManagementModal({ open, onOpenChange }: TemplateManagementModalProps) {
  const [templates, setTemplates] = useState<RosterTemplate[]>(mockTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<RosterTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    members: [] as string[],
  });

  // Flatten organization for member selection
  const flattenMembers = (member: TeamMember): TeamMember[] => {
    return [member, ...(member.children?.flatMap(flattenMembers) || [])];
  };
  const allMembers = organizationData.children?.flatMap(flattenMembers) || [];

  const handleCreateNew = () => {
    setIsCreating(true);
    setIsEditing(true);
    setSelectedTemplate(null);
    setEditForm({
      name: "",
      description: "",
      members: [],
    });
  };

  const handleDuplicate = (template: RosterTemplate) => {
    const newTemplate: RosterTemplate = {
      ...template,
      id: `tpl-${Date.now()}`,
      name: `${template.name} (Copia)`,
      createdAt: new Date().toISOString().split('T')[0],
      lastUsed: "-",
      eventsUsed: 0,
    };
    setTemplates(prev => [...prev, newTemplate]);
    toast({
      title: "Plantilla duplicada",
      description: `Se ha creado "${newTemplate.name}"`,
    });
  };

  const handleEdit = (template: RosterTemplate) => {
    setSelectedTemplate(template);
    setIsEditing(true);
    setIsCreating(false);
    setEditForm({
      name: template.name,
      description: template.description,
      members: [...template.members],
    });
  };

  const handleDelete = (template: RosterTemplate) => {
    setTemplates(prev => prev.filter(t => t.id !== template.id));
    toast({
      title: "Plantilla eliminada",
      description: `"${template.name}" ha sido eliminada.`,
    });
  };

  const handleSave = () => {
    if (!editForm.name.trim()) {
      toast({
        title: "Error",
        description: "El nombre de la plantilla es requerido.",
        variant: "destructive",
      });
      return;
    }

    if (isCreating) {
      const newTemplate: RosterTemplate = {
        id: `tpl-${Date.now()}`,
        name: editForm.name,
        description: editForm.description,
        members: editForm.members,
        createdAt: new Date().toISOString().split('T')[0],
        lastUsed: "-",
        eventsUsed: 0,
      };
      setTemplates(prev => [...prev, newTemplate]);
      toast({
        title: "Plantilla creada",
        description: `"${newTemplate.name}" ha sido creada exitosamente.`,
      });
    } else if (selectedTemplate) {
      setTemplates(prev => prev.map(t => 
        t.id === selectedTemplate.id 
          ? { ...t, name: editForm.name, description: editForm.description, members: editForm.members }
          : t
      ));
      toast({
        title: "Plantilla actualizada",
        description: `"${editForm.name}" ha sido actualizada.`,
      });
    }

    setIsEditing(false);
    setIsCreating(false);
    setSelectedTemplate(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsCreating(false);
    setSelectedTemplate(null);
  };

  const toggleMember = (memberId: string) => {
    setEditForm(prev => ({
      ...prev,
      members: prev.members.includes(memberId)
        ? prev.members.filter(id => id !== memberId)
        : [...prev.members, memberId],
    }));
  };

  const handleAssignToEvent = (template: RosterTemplate) => {
    setSelectedTemplate(template);
    setShowAssignModal(true);
  };

  const levelColors: Record<number, string> = {
    1: "bg-neon-blue/20 text-neon-blue",
    2: "bg-neon-orange/20 text-neon-orange",
    3: "bg-neon-pink/20 text-neon-pink",
    4: "bg-gradient-party text-white",
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Gestión de Plantillas de Alineación
            </DialogTitle>
          </DialogHeader>

          <div className="flex gap-4 h-[60vh]">
            {/* Templates List */}
            <div className="w-1/3 border-r border-border pr-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold">Plantillas</h4>
                <Button variant="party" size="sm" className="gap-1" onClick={handleCreateNew}>
                  <Plus className="w-4 h-4" />
                  Nueva
                </Button>
              </div>

              <ScrollArea className="h-[calc(100%-60px)]">
                <div className="space-y-2">
                  {templates.map((template) => (
                    <motion.div
                      key={template.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={cn(
                        "p-3 rounded-lg border cursor-pointer transition-all",
                        selectedTemplate?.id === template.id && !isEditing
                          ? "bg-primary/10 border-primary/30"
                          : "bg-card-elevated border-border hover:border-primary/20"
                      )}
                      onClick={() => !isEditing && setSelectedTemplate(template)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h5 className="font-medium text-sm truncate">{template.name}</h5>
                        <Badge variant="secondary" className="text-xs">
                          {template.members.length}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {template.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{template.eventsUsed} eventos</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Template Details / Edit Form */}
            <div className="flex-1 pl-4">
              {isEditing ? (
                // Edit / Create Mode
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">
                      {isCreating ? "Nueva Plantilla" : `Editando: ${selectedTemplate?.name}`}
                    </h4>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={handleCancel}>
                        <X className="w-4 h-4 mr-1" />
                        Cancelar
                      </Button>
                      <Button variant="party" size="sm" onClick={handleSave}>
                        <Save className="w-4 h-4 mr-1" />
                        Guardar
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nombre de la Plantilla</Label>
                      <Input
                        value={editForm.name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Ej: Equipo Festival"
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

                  {/* Member Selection */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Seleccionar Vendedores ({editForm.members.length} seleccionados)</Label>
                      <div className="relative w-48">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Buscar..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-8 h-8"
                        />
                      </div>
                    </div>
                    
                    <ScrollArea className="h-[300px] border rounded-lg p-2">
                      <div className="space-y-1">
                        {allMembers
                          .filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()))
                          .map((member) => (
                            <div
                              key={member.id}
                              className={cn(
                                "flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors",
                                editForm.members.includes(member.id)
                                  ? "bg-primary/10"
                                  : "hover:bg-muted"
                              )}
                              onClick={() => toggleMember(member.id)}
                            >
                              <Checkbox
                                checked={editForm.members.includes(member.id)}
                                onCheckedChange={() => toggleMember(member.id)}
                              />
                              <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold",
                                levelColors[member.level]
                              )}>
                                {member.avatar}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium">{member.name}</p>
                                <p className="text-xs text-muted-foreground">{member.levelName}</p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              ) : selectedTemplate ? (
                // View Mode
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xl font-bold">{selectedTemplate.name}</h4>
                      <p className="text-sm text-muted-foreground">{selectedTemplate.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-1" onClick={() => handleDuplicate(selectedTemplate)}>
                        <Copy className="w-4 h-4" />
                        Duplicar
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1" onClick={() => handleEdit(selectedTemplate)}>
                        <Edit className="w-4 h-4" />
                        Editar
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="gap-1"
                        onClick={() => handleDelete(selectedTemplate)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg bg-card-elevated text-center">
                      <p className="text-2xl font-bold text-primary">{selectedTemplate.members.length}</p>
                      <p className="text-xs text-muted-foreground">Vendedores</p>
                    </div>
                    <div className="p-3 rounded-lg bg-card-elevated text-center">
                      <p className="text-2xl font-bold text-success">{selectedTemplate.eventsUsed}</p>
                      <p className="text-xs text-muted-foreground">Eventos usados</p>
                    </div>
                    <div className="p-3 rounded-lg bg-card-elevated text-center">
                      <p className="text-lg font-bold">{selectedTemplate.lastUsed}</p>
                      <p className="text-xs text-muted-foreground">Último uso</p>
                    </div>
                  </div>

                  {/* Members Preview */}
                  <div className="space-y-2">
                    <h5 className="font-medium flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Vendedores en esta plantilla
                    </h5>
                    <ScrollArea className="h-[250px] border rounded-lg p-2">
                      <div className="grid grid-cols-2 gap-2">
                        {allMembers
                          .filter(m => selectedTemplate.members.includes(m.id))
                          .map((member) => (
                            <div
                              key={member.id}
                              className="flex items-center gap-2 p-2 rounded-lg bg-card-elevated"
                            >
                              <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold",
                                levelColors[member.level]
                              )}>
                                {member.avatar}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{member.name}</p>
                                <Badge variant="outline" className="text-xs">
                                  {member.levelName}
                                </Badge>
                              </div>
                            </div>
                          ))}
                      </div>
                    </ScrollArea>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-border">
                    <Button 
                      variant="party" 
                      className="w-full gap-2"
                      onClick={() => handleAssignToEvent(selectedTemplate)}
                    >
                      <LayoutGrid className="w-4 h-4" />
                      Asignar a un Evento
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                // Empty State
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <FileText className="w-12 h-12 text-muted-foreground mb-4" />
                  <h4 className="font-semibold mb-2">Selecciona una plantilla</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    O crea una nueva para empezar
                  </p>
                  <Button variant="party" className="gap-2" onClick={handleCreateNew}>
                    <Plus className="w-4 h-4" />
                    Crear Plantilla
                  </Button>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="border-t border-border pt-4">
            <Button variant="outline" className="gap-2">
              <Headphones className="w-4 h-4" />
              Soporte
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign to Event Modal */}
      <Dialog open={showAssignModal} onOpenChange={setShowAssignModal}>
        <DialogContent className="max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Asignar Plantilla a Evento
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Selecciona el evento donde quieres usar la plantilla "{selectedTemplate?.name}"
            </p>

            <ScrollArea className="h-[250px]">
              <div className="space-y-2">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/30 cursor-pointer transition-colors"
                    onClick={() => {
                      toast({
                        title: "Plantilla asignada",
                        description: `"${selectedTemplate?.name}" ha sido asignada a ${event.name}`,
                      });
                      setShowAssignModal(false);
                    }}
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-party flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{event.name}</p>
                      <p className="text-xs text-muted-foreground">{event.date}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignModal(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}