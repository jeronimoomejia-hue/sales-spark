import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { RosterInvitationModal } from "@/components/admin/RosterInvitationModal";
import { HierarchicalRosterView } from "@/components/admin/HierarchicalRosterView";
import { 
  Users, 
  UserPlus,
  Save,
  Copy,
  Search,
  Star,
  Check,
  Link2,
  Share2,
  Bell,
  LayoutGrid,
  List
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { events } from "@/data/mockData";
import { 
  registeredSellers, 
  savedTemplates, 
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
  const [rosterActivated, setRosterActivated] = useState(assignment?.status === 'active');
  const [viewMode, setViewMode] = useState<'hierarchy' | 'grid'>('hierarchy');
  
  const availableSellers = registeredSellers.filter(
    s => s.status === 'active' && !roster.find(r => r.sellerId === s.sellerId)
  );

  const filteredAvailable = availableSellers.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const subsocios = roster.filter(s => s.position === 'subsocio');
  const cabezas = roster.filter(s => s.position === 'cabeza');
  const promotores = roster.filter(s => s.position === 'promotor');

  const handleAddToRoster = (seller: SellerRoster) => {
    setRoster([...roster, seller]);
    toast.success(`${seller.name} añadido a la alineación`);
  };

  const handleRemoveFromRoster = (sellerId: string) => {
    // Also remove assignments to this seller
    setRoster(roster.filter(s => s.sellerId !== sellerId).map(s => 
      s.assignedTo === sellerId ? { ...s, assignedTo: undefined } : s
    ));
    toast.info("Vendedor removido de la alineación");
  };

  const handleAssignToParent = (sellerId: string, parentId: string | undefined) => {
    setRoster(roster.map(s => 
      s.sellerId === sellerId ? { ...s, assignedTo: parentId } : s
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
          <div className="flex items-center gap-3">
            <Badge variant={rosterActivated ? 'default' : 'outline'} className="gap-1">
              {rosterActivated ? (
                <><Check className="w-3 h-3" /> Activa</>
              ) : (
                "Borrador"
              )}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {roster.length} vendedores • {subsocios.length} sub socios • {cabezas.length} cabezas • {promotores.length} promotores
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center border rounded-lg p-1">
              <Button 
                variant={viewMode === 'hierarchy' ? 'secondary' : 'ghost'} 
                size="sm"
                className="h-7 px-2"
                onClick={() => setViewMode('hierarchy')}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button 
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
                size="sm"
                className="h-7 px-2"
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
            </div>
            
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

          {/* Current Roster - Hierarchical View */}
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
                    <span>Formación: {subsocios.length}-{cabezas.length}-{promotores.length}</span>
                  </div>
                </div>

                {roster.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                    <Users className="w-16 h-16 mb-4 opacity-30" />
                    <p className="text-lg font-medium">No hay vendedores en la alineación</p>
                    <p className="text-sm mt-1">Añade vendedores desde el panel izquierdo o carga una plantilla</p>
                  </div>
                ) : (
                  <div className="max-h-[500px] overflow-y-auto pr-2">
                    <HierarchicalRosterView
                      roster={roster}
                      onRemove={handleRemoveFromRoster}
                      onAssign={handleAssignToParent}
                      availableSellers={availableSellers}
                      onAddSeller={handleAddToRoster}
                    />
                  </div>
                )}

                {/* Stats Summary */}
                {roster.length > 0 && (
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
                )}
              </div>
            </Card>
          </div>
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
