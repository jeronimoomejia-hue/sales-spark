import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { RosterInvitationModal } from "@/components/admin/RosterInvitationModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
  List,
  LayoutGrid,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { events } from "@/data/mockData";
import {
  registeredSellers,
  savedTemplates,
  getEventAssignment,
  SellerRoster,
  EventTemplate,
} from "@/data/eventTemplates";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type InvitationState = 'invited' | 'confirmed' | 'declined' | 'active';

interface RosterMemberState {
  seller: SellerRoster;
  invitationState: InvitationState;
}

const invitationBadge: Record<InvitationState, { label: string; className: string }> = {
  invited: { label: "Invitación Enviada", className: "bg-warning/20 text-warning border-warning/40" },
  confirmed: { label: "Confirmado", className: "bg-success/20 text-success border-success/40" },
  declined: { label: "Declinó", className: "bg-destructive/20 text-destructive border-destructive/40" },
  active: { label: "Activo", className: "bg-primary/20 text-primary border-primary/40" },
};

export default function AdminEventRoster() {
  const { eventId } = useParams();
  const event = events.find(e => e.id === eventId) || events[0];
  const assignment = getEventAssignment(event.id);

  const [rosterMembers, setRosterMembers] = useState<RosterMemberState[]>(
    (assignment?.roster || []).map(s => ({ seller: s, invitationState: 'active' as InvitationState }))
  );
  const [poolSearch, setPoolSearch] = useState("");
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showInvitationModal, setShowInvitationModal] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [rosterActivated, setRosterActivated] = useState(assignment?.status === 'active');
  const [viewMode, setViewMode] = useState<'hierarchy' | 'grid'>('hierarchy');

  const rosterSellerIds = new Set(rosterMembers.map(m => m.seller.sellerId));

  // Solo vendedores propios de esta promotora
  const availableSellers = registeredSellers.filter(
    s => s.status === 'active' && !rosterSellerIds.has(s.sellerId)
  );

  const filteredAvailable = availableSellers.filter(s =>
    s.name.toLowerCase().includes(poolSearch.toLowerCase())
  );

  const roster = rosterMembers.map(m => m.seller);
  const subsocios = roster.filter(s => s.position === 'subsocio');
  const cabezas = roster.filter(s => s.position === 'cabeza');
  const promotores = roster.filter(s => s.position === 'promotor');

  const handleAddToRoster = (seller: SellerRoster) => {
    setRosterMembers(prev => [...prev, { seller, invitationState: 'active' }]);
    toast.success(`${seller.name} añadido a la alineación`);
  };

  const handleRemoveFromRoster = (sellerId: string) => {
    setRosterMembers(prev =>
      prev.filter(m => m.seller.sellerId !== sellerId).map(m =>
        m.seller.assignedTo === sellerId ? { ...m, seller: { ...m.seller, assignedTo: undefined } } : m
      )
    );
    toast.info("Vendedor removido de la alineación");
  };

  const handleAssignToParent = (sellerId: string, parentId: string | undefined) => {
    setRosterMembers(prev =>
      prev.map(m =>
        m.seller.sellerId === sellerId ? { ...m, seller: { ...m.seller, assignedTo: parentId } } : m
      )
    );
  };

  const handleSimulateResponse = (sellerId: string, response: 'confirmed' | 'declined') => {
    setRosterMembers(prev =>
      prev.map(m =>
        m.seller.sellerId === sellerId ? { ...m, invitationState: response } : m
      )
    );
    const member = rosterMembers.find(m => m.seller.sellerId === sellerId);
    if (member) {
      if (response === 'confirmed') {
        toast.success(`✅ ${member.seller.name} aceptó la invitación`);
      } else {
        toast.error(`❌ ${member.seller.name} declinó la invitación`);
      }
    }
  };

  const handleLoadTemplate = (template: EventTemplate) => {
    setRosterMembers(template.roster.map(s => ({ seller: s, invitationState: 'active' as InvitationState })));
    setShowTemplateModal(false);
    toast.success(`Plantilla "${template.name}" cargada`);
  };

  const handleSaveTemplate = () => {
    if (!templateName.trim()) {
      toast.error("Ingresa un nombre para la plantilla");
      return;
    }
    toast.success(`Plantilla "${templateName}" guardada`);
    setShowSaveTemplateModal(false);
    setTemplateName("");
  };

  const handleActivateRoster = () => {
    if (rosterMembers.length === 0) {
      toast.error("Añade vendedores a la alineación primero");
      return;
    }
    setShowInvitationModal(true);
  };

  const handleConfirmActivation = () => {
    setRosterActivated(true);
    toast.success("Alineación activada — Vendedores notificados");
  };

  const inviteLink = `https://crews.app/join/${event.id}`;
  const invitedCount = rosterMembers.filter(m => m.invitationState === 'invited').length;
  const confirmedCount = rosterMembers.filter(m => m.invitationState === 'confirmed').length;

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
              {rosterActivated ? <><Check className="w-3 h-3" /> Activa</> : "Borrador"}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {rosterMembers.length} vendedores
              {invitedCount > 0 && <span className="ml-2 text-warning">• {invitedCount} pendientes</span>}
              {confirmedCount > 0 && <span className="ml-2 text-success">• {confirmedCount} confirmados</span>}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center border rounded-lg p-1">
              <Button variant={viewMode === 'hierarchy' ? 'secondary' : 'ghost'} size="sm" className="h-7 px-2" onClick={() => setViewMode('hierarchy')}>
                <List className="w-4 h-4" />
              </Button>
              <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="sm" className="h-7 px-2" onClick={() => setViewMode('grid')}>
                <LayoutGrid className="w-4 h-4" />
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowShareModal(true)}>
              <Share2 className="w-4 h-4 mr-2" /> Enlace de Invitación
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowTemplateModal(true)}>
              <Copy className="w-4 h-4 mr-2" /> Cargar Plantilla
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowSaveTemplateModal(true)}>
              <Save className="w-4 h-4 mr-2" /> Guardar Plantilla
            </Button>
            <Button variant="party" size="sm" onClick={handleActivateRoster} disabled={rosterActivated}>
              {rosterActivated
                ? <><Check className="w-4 h-4 mr-2" /> Alineación Activa</>
                : <><Bell className="w-4 h-4 mr-2" /> Activar y Notificar</>
              }
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pool de vendedores de la promotora */}
          <Card variant="glass" className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Mis Vendedores
              </h3>
              <Badge variant="secondary">{availableSellers.length}</Badge>
            </div>

            {/* Enlace de invitación highlight */}
            <div className="mb-4 p-3 rounded-xl bg-primary/10 border border-primary/20 text-center">
              <p className="text-xs text-muted-foreground mb-2">¿Quieres añadir vendedores nuevos?</p>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 w-full border-primary/30 text-primary hover:bg-primary/10"
                onClick={() => setShowShareModal(true)}
              >
                <Link2 className="w-3.5 h-3.5" />
                Copiar enlace de invitación
              </Button>
            </div>

            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar vendedor..."
                className="pl-10"
                value={poolSearch}
                onChange={(e) => setPoolSearch(e.target.value)}
              />
            </div>

            <div className="space-y-2 max-h-[460px] overflow-y-auto">
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
                      <p className="text-xs text-muted-foreground">Prom.</p>
                      <p className="text-sm font-semibold text-success">{seller.stats.avgPerEvent}/evento</p>
                    </div>
                    <UserPlus className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </div>
                </motion.div>
              ))}

              {filteredAvailable.length === 0 && (
                <div className="text-center py-10">
                  <Users className="w-10 h-10 mx-auto mb-2 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">No hay vendedores disponibles</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">Comparte el enlace para añadir más</p>
                </div>
              )}
            </div>
          </Card>

          {/* Alineación actual */}
          <div className="lg:col-span-2">
            <Card variant="neon" className="p-6 min-h-[600px] relative overflow-hidden">
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full border-2 border-primary" />
                <div className="absolute top-1/2 left-0 right-0 h-px bg-primary" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-xl">🏟️ Alineación Actual</h3>
                  <span className="text-sm text-muted-foreground">
                    Formación: {subsocios.length}-{cabezas.length}-{promotores.length}
                  </span>
                </div>

                {rosterMembers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                    <Users className="w-16 h-16 mb-4 opacity-30" />
                    <p className="text-lg font-medium">No hay vendedores en la alineación</p>
                    <p className="text-sm mt-1">Añade desde el panel izquierdo o carga una plantilla</p>
                  </div>
                ) : (
                  <div className="max-h-[440px] overflow-y-auto pr-2 space-y-2">
                    {rosterMembers.map((member) => {
                      const badgeInfo = invitationBadge[member.invitationState];
                      return (
                        <div
                          key={member.seller.sellerId}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-lg border transition-all",
                            member.invitationState === 'invited' && "border-warning/30 bg-warning/5",
                            member.invitationState === 'confirmed' && "border-success/30 bg-success/5",
                            member.invitationState === 'declined' && "border-destructive/30 bg-destructive/5",
                            member.invitationState === 'active' && "border-border bg-card-elevated",
                          )}
                        >
                          <div className="w-10 h-10 rounded-full bg-gradient-party flex items-center justify-center text-white font-bold text-sm shrink-0">
                            {member.seller.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-medium text-sm">{member.seller.name}</p>
                              <Badge variant="outline" className={cn("text-[10px] h-4 border", badgeInfo.className)}>
                                {member.invitationState === 'invited' && <Clock className="w-2.5 h-2.5 mr-1" />}
                                {member.invitationState === 'confirmed' && <CheckCircle2 className="w-2.5 h-2.5 mr-1" />}
                                {member.invitationState === 'declined' && <XCircle className="w-2.5 h-2.5 mr-1" />}
                                {badgeInfo.label}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{member.seller.levelName}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            {member.invitationState === 'invited' && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 text-success hover:bg-success/10"
                                  title="Simular: Aceptó"
                                  onClick={() => handleSimulateResponse(member.seller.sellerId, 'confirmed')}
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10"
                                  title="Simular: Declinó"
                                  onClick={() => handleSimulateResponse(member.seller.sellerId, 'declined')}
                                >
                                  <XCircle className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                            {member.invitationState === 'declined' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs text-primary"
                                onClick={() => {
                                  setRosterMembers(prev =>
                                    prev.map(m => m.seller.sellerId === member.seller.sellerId
                                      ? { ...m, invitationState: 'invited' }
                                      : m
                                    )
                                  );
                                  toast.info(`Re-invitación enviada a ${member.seller.name}`);
                                }}
                              >
                                Re-invitar
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                              onClick={() => handleRemoveFromRoster(member.seller.sellerId)}
                            >
                              ✕
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {rosterMembers.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-border grid grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{rosterMembers.length}</p>
                      <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-warning">{invitedCount}</p>
                      <p className="text-xs text-muted-foreground">Pendientes</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-success">{confirmedCount}</p>
                      <p className="text-xs text-muted-foreground">Confirmados</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-warning">
                        {Math.round(roster.reduce((s, r) => s + r.stats.successRate, 0) / (roster.length || 1))}%
                      </p>
                      <p className="text-xs text-muted-foreground">Éxito Prom.</p>
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
                      {template.isDefault && <Badge variant="secondary" className="text-xs">Predeterminada</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">Usada {template.usageCount} veces • Última: {template.lastUsed}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{template.roster.length}</p>
                    <p className="text-xs text-muted-foreground">vendedores</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1">
                  {template.roster.slice(0, 6).map((s) => (
                    <div key={s.sellerId} className="w-8 h-8 rounded-full bg-gradient-party flex items-center justify-center text-white text-xs font-bold">
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
            <Input placeholder="Nombre de la plantilla..." value={templateName} onChange={(e) => setTemplateName(e.target.value)} />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{rosterMembers.length} vendedores</span>
              <span>{cabezas.length} cabezas, {promotores.length} promotores</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowSaveTemplateModal(false)}>Cancelar</Button>
              <Button variant="party" className="flex-1" onClick={handleSaveTemplate}>
                <Save className="w-4 h-4 mr-2" /> Guardar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Share/Invite Modal */}
      <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Link2 className="w-5 h-5 text-primary" />
              Enlace de Invitación
            </DialogTitle>
            <DialogDescription>
              Comparte este enlace. Quien lo abra podrá registrarse como vendedor de este evento.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="p-4 rounded-lg bg-card-elevated border border-border">
              <p className="text-sm font-mono break-all text-primary">{inviteLink}</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Al acceder al enlace, el vendedor se registra y queda pendiente de aprobación. Una vez aprobado, aparece en tu lista de vendedores.
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  navigator.clipboard.writeText(inviteLink);
                  toast.success("Enlace copiado al portapapeles");
                }}
              >
                <Link2 className="w-4 h-4 mr-2" /> Copiar Enlace
              </Button>
              <Button variant="party" className="flex-1">
                <Share2 className="w-4 h-4 mr-2" /> Compartir
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
