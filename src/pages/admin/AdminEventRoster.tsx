import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { RosterInvitationModal } from "@/components/admin/RosterInvitationModal";
import { 
  Users, 
  UserPlus,
  Save,
  RotateCcw,
  Copy,
  Trash2,
  Search,
  Star,
  TrendingUp,
  ChevronRight,
  GripVertical,
  Check,
  X,
  Link2,
  Share2,
  Bell
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { events } from "@/data/mockData";
import { 
  registeredSellers, 
  savedTemplates, 
  eventAssignments, 
  getEventAssignment,
  SellerRoster,
  EventTemplate
} from "@/data/eventTemplates";
import { toast } from "sonner";

export default function AdminEventRoster() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const event = events.find(e => e.id === eventId) || events[0];
  const assignment = getEventAssignment(event.id);
  
  const [roster, setRoster] = useState<SellerRoster[]>(assignment?.roster || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showInvitationModal, setShowInvitationModal] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [draggedSeller, setDraggedSeller] = useState<SellerRoster | null>(null);
  const [rosterActivated, setRosterActivated] = useState(assignment?.status === 'active');
  
  const availableSellers = registeredSellers.filter(
    s => s.status === 'active' && !roster.find(r => r.sellerId === s.sellerId)
  );

  const filteredAvailable = availableSellers.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const cabezas = roster.filter(s => s.position === 'cabeza');
  const promotores = roster.filter(s => s.position === 'promotor');

  const handleAddToRoster = (seller: SellerRoster) => {
    setRoster([...roster, seller]);
    toast.success(`${seller.name} añadido a la alineación`);
  };

  const handleRemoveFromRoster = (sellerId: string) => {
    setRoster(roster.filter(s => s.sellerId !== sellerId));
    toast.info("Vendedor removido de la alineación");
  };

  const handleAssignToCabeza = (promotorId: string, cabezaId: string) => {
    setRoster(roster.map(s => 
      s.sellerId === promotorId ? { ...s, assignedTo: cabezaId } : s
    ));
  };

  const handleLoadTemplate = (template: EventTemplate) => {
    setRoster(template.roster);
    setShowTemplateModal(false);
    toast.success(`Plantilla "${template.name}" cargada`);
  };

  const handleSaveTemplate = () => {
    if (!templateName.trim()) {
      toast.error("Ingresa un nombre para la plantilla");
      return;
    }
    // In real app, save to backend
    toast.success(`Plantilla "${templateName}" guardada`);
    setShowSaveTemplateModal(false);
    setTemplateName("");
  };

  const handleActivateRoster = () => {
    if (roster.length === 0) {
      toast.error("Añade vendedores a la alineación primero");
      return;
    }
    setShowInvitationModal(true);
  };

  const handleConfirmActivation = () => {
    setRosterActivated(true);
    toast.success("Alineación activada - Vendedores notificados");
  };

  const inviteLink = `https://crews.app/join/${event.id}`;

  return (
    <DashboardLayout
      title={`Alineación: ${event.name}`}
      subtitle="Gestiona tu equipo de vendedores para este evento"
      userLevel={4}
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant={rosterActivated ? 'default' : 'outline'} className="gap-1">
              {rosterActivated ? (
                <><Check className="w-3 h-3" /> Activa</>
              ) : (
                "Borrador"
              )}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {roster.length} vendedores • {cabezas.length} cabezas
            </span>
          </div>
            <span className="text-sm text-muted-foreground">
              {roster.length} vendedores • {cabezas.length} cabezas
            </span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowShareModal(true)}>
              <Share2 className="w-4 h-4 mr-2" />
              Invitar Vendedores
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowTemplateModal(true)}>
              <Copy className="w-4 h-4 mr-2" />
              Cargar Plantilla
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowSaveTemplateModal(true)}>
              <Save className="w-4 h-4 mr-2" />
              Guardar Plantilla
            </Button>
            <Button 
              variant="party" 
              size="sm" 
              onClick={handleActivateRoster}
              disabled={rosterActivated}
            >
              {rosterActivated ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Alineación Activa
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4 mr-2" />
                  Activar y Notificar
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Available Sellers Pool */}
          <Card variant="glass" className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Vendedores Disponibles
              </h3>
              <Badge variant="secondary">{availableSellers.length}</Badge>
            </div>
            
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar vendedor..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {filteredAvailable.map((seller) => (
                <motion.div
                  key={seller.id}
                  layout
                  className="p-3 rounded-lg bg-card-elevated border border-border hover:border-primary/30 transition-all cursor-pointer group"
                  onClick={() => handleAddToRoster(seller)}
                  draggable
                  onDragStart={() => setDraggedSeller(seller)}
                  onDragEnd={() => setDraggedSeller(null)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-party flex items-center justify-center text-white font-bold text-sm">
                      {seller.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{seller.name}</p>
                        {seller.stats.successRate >= 90 && (
                          <Star className="w-3 h-3 text-warning fill-warning" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{seller.levelName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Promedio</p>
                      <p className="text-sm font-semibold text-success">{seller.stats.avgPerEvent}/evento</p>
                    </div>
                    <UserPlus className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.div>
              ))}
              
              {filteredAvailable.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No hay más vendedores disponibles
                </p>
              )}
            </div>
          </Card>

          {/* Current Roster - Ultimate Team Style */}
          <div className="lg:col-span-2">
            <Card variant="neon" className="p-6 min-h-[600px] relative overflow-hidden">
              {/* Field Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full border-2 border-primary" />
                <div className="absolute top-1/2 left-0 right-0 h-px bg-primary" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-xl flex items-center gap-2">
                    🏟️ Alineación Actual
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Formación: {cabezas.length}-{promotores.length}</span>
                  </div>
                </div>

                {/* Cabezas Row */}
                <div className="mb-8">
                  <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-neon-purple" />
                    CABEZAS DE EQUIPO
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {cabezas.map((seller) => (
                      <motion.div
                        key={seller.sellerId}
                        layout
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative group"
                      >
                        <Card className="p-4 bg-gradient-to-br from-neon-purple/20 to-neon-pink/10 border-neon-purple/30 hover:border-neon-purple/60 transition-all">
                          <button
                            onClick={() => handleRemoveFromRoster(seller.sellerId)}
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <div className="text-center">
                            <div className="w-14 h-14 mx-auto rounded-full bg-gradient-party flex items-center justify-center text-white font-bold text-lg mb-2 ring-2 ring-neon-purple/50">
                              {seller.avatar}
                            </div>
                            <p className="font-semibold text-sm">{seller.name}</p>
                            <Badge variant="secondary" className="mt-1 text-xs">
                              {seller.levelName}
                            </Badge>
                            <div className="mt-2 flex items-center justify-center gap-1 text-xs text-success">
                              <TrendingUp className="w-3 h-3" />
                              {seller.stats.avgPerEvent}/evento
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                    
                    {/* Add Cabeza Slot */}
                    {cabezas.length < 4 && (
                      <div 
                        className="border-2 border-dashed border-border/50 rounded-xl p-4 flex items-center justify-center min-h-[140px] hover:border-primary/30 transition-colors cursor-pointer"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => {
                          if (draggedSeller && draggedSeller.position === 'cabeza') {
                            handleAddToRoster(draggedSeller);
                          }
                        }}
                      >
                        <div className="text-center text-muted-foreground">
                          <UserPlus className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-xs">Añadir Cabeza</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Promotores Row */}
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-neon-blue" />
                    PROMOTORES
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {promotores.map((seller) => (
                      <motion.div
                        key={seller.sellerId}
                        layout
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative group"
                      >
                        <Card className="p-3 bg-gradient-to-br from-neon-blue/20 to-cyan-500/10 border-neon-blue/30 hover:border-neon-blue/60 transition-all">
                          <button
                            onClick={() => handleRemoveFromRoster(seller.sellerId)}
                            className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <div className="text-center">
                            <div className="w-10 h-10 mx-auto rounded-full bg-gradient-party flex items-center justify-center text-white font-bold text-sm mb-1">
                              {seller.avatar}
                            </div>
                            <p className="font-medium text-xs truncate">{seller.name}</p>
                            {seller.assignedTo && (
                              <p className="text-[10px] text-muted-foreground truncate">
                                → {cabezas.find(c => c.sellerId === seller.assignedTo)?.name || 'Sin asignar'}
                              </p>
                            )}
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                    
                    {/* Add Promotor Slots */}
                    {Array.from({ length: Math.max(0, 5 - promotores.length) }).map((_, i) => (
                      <div 
                        key={i}
                        className="border-2 border-dashed border-border/30 rounded-lg p-3 flex items-center justify-center min-h-[90px] hover:border-primary/20 transition-colors cursor-pointer"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => {
                          if (draggedSeller && draggedSeller.position === 'promotor') {
                            handleAddToRoster(draggedSeller);
                          }
                        }}
                      >
                        <UserPlus className="w-5 h-5 text-muted-foreground/30" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats Summary */}
                <div className="mt-8 pt-6 border-t border-border grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{roster.length}</p>
                    <p className="text-xs text-muted-foreground">Total Vendedores</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-success">
                      {roster.reduce((sum, s) => sum + s.stats.avgPerEvent, 0)}
                    </p>
                    <p className="text-xs text-muted-foreground">Ventas Proyectadas</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-warning">
                      {Math.round(roster.reduce((sum, s) => sum + s.stats.successRate, 0) / (roster.length || 1))}%
                    </p>
                    <p className="text-xs text-muted-foreground">Tasa de Éxito Prom.</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

      {/* Load Template Modal */}
      <Dialog open={showTemplateModal} onOpenChange={setShowTemplateModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Cargar Plantilla Guardada</DialogTitle>
            <DialogDescription>Selecciona una alineación de eventos anteriores</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            {savedTemplates.map((template) => (
              <div
                key={template.id}
                className="p-4 rounded-lg border border-border hover:border-primary/30 cursor-pointer transition-all"
                onClick={() => handleLoadTemplate(template)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{template.name}</h4>
                      {template.isDefault && (
                        <Badge variant="secondary" className="text-xs">Predeterminada</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Usada {template.usageCount} veces • Última: {template.lastUsed}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{template.roster.length}</p>
                    <p className="text-xs text-muted-foreground">vendedores</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1">
                  {template.roster.slice(0, 6).map((s) => (
                    <div
                      key={s.sellerId}
                      className="w-8 h-8 rounded-full bg-gradient-party flex items-center justify-center text-white text-xs font-bold"
                    >
                      {s.avatar}
                    </div>
                  ))}
                  {template.roster.length > 6 && (
                    <div className="w-8 h-8 rounded-full bg-card-elevated flex items-center justify-center text-xs">
                      +{template.roster.length - 6}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Save Template Modal */}
      <Dialog open={showSaveTemplateModal} onOpenChange={setShowSaveTemplateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Guardar Plantilla</DialogTitle>
            <DialogDescription>Guarda esta alineación para reutilizarla en futuros eventos</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Input
              placeholder="Nombre de la plantilla..."
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
            />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{roster.length} vendedores</span>
              <span>{cabezas.length} cabezas, {promotores.length} promotores</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowSaveTemplateModal(false)}>
                Cancelar
              </Button>
              <Button variant="party" className="flex-1" onClick={handleSaveTemplate}>
                <Save className="w-4 h-4 mr-2" />
                Guardar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Share/Invite Modal */}
      <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invitar Vendedores</DialogTitle>
            <DialogDescription>Comparte este enlace para que nuevos vendedores se inscriban al evento</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="p-4 rounded-lg bg-card-elevated border border-border">
              <p className="text-sm font-mono break-all">{inviteLink}</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  navigator.clipboard.writeText(inviteLink);
                  toast.success("Enlace copiado al portapapeles");
                }}
              >
                <Link2 className="w-4 h-4 mr-2" />
                Copiar Enlace
              </Button>
              <Button variant="party" className="flex-1">
                <Share2 className="w-4 h-4 mr-2" />
                Compartir
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Roster Invitation Modal */}
      <RosterInvitationModal
        open={showInvitationModal}
        onOpenChange={setShowInvitationModal}
        event={event}
        roster={roster}
        onConfirmSend={handleConfirmActivation}
      />
    </DashboardLayout>
  );
}
