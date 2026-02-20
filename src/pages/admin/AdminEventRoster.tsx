import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { RosterInvitationModal } from "@/components/admin/RosterInvitationModal";
import { HierarchicalRosterView } from "@/components/admin/HierarchicalRosterView";
import { SellerPublicProfile } from "@/components/seller/SellerPublicProfile";
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
  Globe,
  Zap,
} from "lucide-react";
import { events } from "@/data/mockData";
import {
  registeredSellers,
  savedTemplates,
  getEventAssignment,
  SellerRoster,
  EventTemplate,
} from "@/data/eventTemplates";
import { globalSellerPool, getGlobalPoolForAdmin } from "@/data/globalSellerPool";
import { SellerRosterExtended, GlobalSellerEntry } from "@/types/seller";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Invitation states for sellers in this event's roster
type InvitationState = 'invited' | 'confirmed' | 'declined' | 'active';

interface RosterMemberState {
  seller: SellerRoster;
  invitationState: InvitationState;
  isFreelance?: boolean;
}

const invitationBadge: Record<InvitationState, { label: string; className: string }> = {
  invited: { label: "Invitación Enviada", className: "bg-yellow-400/20 text-yellow-300 border-yellow-400/40" },
  confirmed: { label: "Confirmado", className: "bg-success/20 text-success border-success/40" },
  declined: { label: "Declinó", className: "bg-destructive/20 text-destructive border-destructive/40" },
  active: { label: "Activo", className: "bg-primary/20 text-primary border-primary/40" },
};

export default function AdminEventRoster() {
  const { eventId } = useParams();
  const event = events.find(e => e.id === eventId) || events[0];
  const assignment = getEventAssignment(event.id);

  // Roster with invitation states
  const [rosterMembers, setRosterMembers] = useState<RosterMemberState[]>(
    (assignment?.roster || []).map(s => ({ seller: s, invitationState: 'active' as InvitationState }))
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [poolSearch, setPoolSearch] = useState("");
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showInvitationModal, setShowInvitationModal] = useState(false);
  const [showSellerProfile, setShowSellerProfile] = useState<string | null>(null);
  const [templateName, setTemplateName] = useState("");
  const [rosterActivated, setRosterActivated] = useState(assignment?.status === 'active');
  const [viewMode, setViewMode] = useState<'hierarchy' | 'grid'>('hierarchy');
  const [poolTab, setPoolTab] = useState<'own' | 'global'>('own');
  const [invitedExternals, setInvitedExternals] = useState<Set<string>>(new Set());

  const rosterSellerIds = new Set(rosterMembers.map(m => m.seller.sellerId));

  // Own sellers (have a relationship with this promotora)
  const ownSellersPool = registeredSellers.filter(
    s => s.status === 'active' && !rosterSellerIds.has(s.sellerId)
  );

  // Global seller pool (all CREWS sellers, showing anonymous global stats)
  const globalPool = getGlobalPoolForAdmin();
  const externalPool = globalPool.filter(
    g => g.isFreelance && !rosterSellerIds.has(g.id) && !invitedExternals.has(g.id)
  );

  const filteredOwn = ownSellersPool.filter(s =>
    s.name.toLowerCase().includes(poolSearch.toLowerCase())
  );
  const filteredExternal = externalPool.filter(g =>
    g.name.toLowerCase().includes(poolSearch.toLowerCase())
  );

  const roster = rosterMembers.map(m => m.seller);
  const subsocios = roster.filter(s => s.position === 'subsocio');
  const cabezas = roster.filter(s => s.position === 'cabeza');
  const promotores = roster.filter(s => s.position === 'promotor');

  const handleAddToRoster = (seller: SellerRoster) => {
    setRosterMembers(prev => [...prev, { seller, invitationState: 'active' }]);
    toast.success(`${seller.name} añadido a la alineación`);
  };

  const handleInviteExternal = (globalEntry: GlobalSellerEntry) => {
    // Create a synthetic roster entry for the external seller
    const globalData = globalSellerPool.find(s => s.id === globalEntry.id);
    if (!globalData) return;

    const syntheticSeller: SellerRoster = {
      id: `ext-${globalEntry.id}`,
      sellerId: globalEntry.id,
      name: globalData.name,
      avatar: globalData.avatar,
      level: 1,
      levelName: "Nivel 1",
      position: 'promotor',
      commissionRate: 8000,
      status: 'pending',
      invitationStatus: 'pending',
      stats: {
        totalSales: globalEntry.globalStats.totalTicketsSold,
        avgPerEvent: globalEntry.globalStats.avgTicketsPerEvent,
        eventsParticipated: globalEntry.globalStats.eventsParticipated,
        successRate: globalEntry.globalStats.successRate,
      },
    };

    setRosterMembers(prev => [...prev, { seller: syntheticSeller, invitationState: 'invited', isFreelance: true }]);
    setInvitedExternals(prev => new Set([...prev, globalEntry.id]));
    toast.success(`Invitación enviada a ${globalData.name}`, {
      description: "Recibirá una notificación para aceptar o rechazar",
    });
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

  // Simulate invitation state change
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
    // Set all 'active' members, invited ones stay as 'invited'
    setRosterMembers(prev =>
      prev.map(m => m.invitationState === 'active' ? { ...m, invitationState: 'active' } : m)
    );
    toast.success("Alineación activada — Vendedores notificados");
  };

  const inviteLink = `https://crews.app/join/${event.id}`;

  const profileSeller = showSellerProfile
    ? globalSellerPool.find(s => s.id === showSellerProfile)
    : null;

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
              {invitedCount > 0 && <span className="ml-2 text-yellow-400">• {invitedCount} pendientes</span>}
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
              <Share2 className="w-4 h-4 mr-2" /> Invitar Link
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowTemplateModal(true)}>
              <Copy className="w-4 h-4 mr-2" /> Plantilla
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowSaveTemplateModal(true)}>
              <Save className="w-4 h-4 mr-2" /> Guardar
            </Button>
            <Button variant="party" size="sm" onClick={handleActivateRoster} disabled={rosterActivated}>
              {rosterActivated ? (
                <><Check className="w-4 h-4 mr-2" /> Activa</>
              ) : (
                <><Bell className="w-4 h-4 mr-2" /> Activar y Notificar</>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pool Panel */}
          <Card variant="glass" className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Pool de Vendedores
              </h3>
            </div>

            {/* Pool Tabs */}
            <div className="flex gap-1 p-1 rounded-lg bg-card-elevated mb-4">
              <button
                onClick={() => setPoolTab('own')}
                className={cn(
                  "flex-1 text-xs font-medium py-1.5 rounded-md transition-all",
                  poolTab === 'own' ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Mis Vendedores
                <span className="ml-1 opacity-60">({ownSellersPool.length})</span>
              </button>
              <button
                onClick={() => setPoolTab('global')}
                className={cn(
                  "flex-1 text-xs font-medium py-1.5 rounded-md transition-all flex items-center justify-center gap-1",
                  poolTab === 'global' ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Globe className="w-3 h-3" />
                CREWS Global
                <span className="ml-0.5 opacity-60">({externalPool.length})</span>
              </button>
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

            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {poolTab === 'own' ? (
                <>
                  {filteredOwn.map((seller) => (
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
                        <UserPlus className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </motion.div>
                  ))}
                  {filteredOwn.length === 0 && (
                    <p className="text-center text-muted-foreground py-8 text-sm">
                      No hay más vendedores propios disponibles
                    </p>
                  )}
                </>
              ) : (
                <>
                  <div className="p-2 rounded-lg bg-neon-blue/10 border border-neon-blue/20 mb-2">
                    <p className="text-xs text-neon-blue flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      Pool global de CREWS — solo métricas anónimas
                    </p>
                  </div>
                  {filteredExternal.map((entry) => {
                    const globalData = globalSellerPool.find(s => s.id === entry.id);
                    if (!globalData) return null;
                    return (
                      <motion.div
                        key={entry.id}
                        layout
                        className="p-3 rounded-lg bg-card-elevated border border-border hover:border-neon-blue/30 transition-all group"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-blue/30 to-neon-purple/30 border border-neon-blue/40 flex items-center justify-center text-white font-bold text-sm">
                              {entry.avatar}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-neon-blue/20 border border-neon-blue/60 flex items-center justify-center">
                              <Zap className="w-2.5 h-2.5 text-neon-blue" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-sm">{entry.name}</p>
                              <Badge className="bg-neon-blue/10 text-neon-blue border-neon-blue/30 text-[10px] h-4">
                                Freelance
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>⭐ {entry.globalStats.successRate}%</span>
                              <span>• {entry.globalStats.eventsParticipated} eventos</span>
                            </div>
                          </div>
                          <button
                            onClick={() => setShowSellerProfile(entry.id)}
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded border border-border hover:border-primary/30"
                          >
                            Ver perfil
                          </button>
                        </div>
                        <div className="grid grid-cols-3 gap-1.5 text-center mb-2">
                          <div className="p-1.5 rounded bg-card border border-border text-xs">
                            <p className="font-bold">{entry.globalStats.totalTicketsSold}</p>
                            <p className="text-[10px] text-muted-foreground">Tickets</p>
                          </div>
                          <div className="p-1.5 rounded bg-card border border-border text-xs">
                            <p className="font-bold text-success">{entry.globalStats.successRate}%</p>
                            <p className="text-[10px] text-muted-foreground">Éxito</p>
                          </div>
                          <div className="p-1.5 rounded bg-card border border-border text-xs">
                            <p className="font-bold">{entry.globalStats.avgTicketsPerEvent}</p>
                            <p className="text-[10px] text-muted-foreground">Prom/evt</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-neon-blue/30 text-neon-blue hover:bg-neon-blue/10 gap-2"
                          onClick={() => handleInviteExternal(entry)}
                        >
                          <Bell className="w-3 h-3" />
                          Enviar Invitación
                        </Button>
                      </motion.div>
                    );
                  })}
                  {filteredExternal.length === 0 && (
                    <p className="text-center text-muted-foreground py-8 text-sm">
                      No hay más vendedores externos disponibles
                    </p>
                  )}
                </>
              )}
            </div>
          </Card>

          {/* Roster Panel */}
          <div className="lg:col-span-2">
            <Card variant="neon" className="p-6 min-h-[600px] relative overflow-hidden">
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

                {rosterMembers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                    <Users className="w-16 h-16 mb-4 opacity-30" />
                    <p className="text-lg font-medium">No hay vendedores en la alineación</p>
                    <p className="text-sm mt-1">Añade vendedores desde el panel izquierdo o carga una plantilla</p>
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
                            member.invitationState === 'invited' && "border-yellow-400/30 bg-yellow-400/5",
                            member.invitationState === 'confirmed' && "border-success/30 bg-success/5",
                            member.invitationState === 'declined' && "border-destructive/30 bg-destructive/5",
                            member.invitationState === 'active' && "border-border bg-card-elevated",
                          )}
                        >
                          <div className="relative">
                            <div className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm",
                              member.isFreelance
                                ? "bg-gradient-to-br from-neon-blue/40 to-neon-purple/40 border border-neon-blue/40"
                                : "bg-gradient-party"
                            )}>
                              {member.seller.avatar}
                            </div>
                            {member.isFreelance && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-neon-blue/20 border border-neon-blue/60 flex items-center justify-center">
                                <Zap className="w-2.5 h-2.5 text-neon-blue" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-medium text-sm">{member.seller.name}</p>
                              {member.isFreelance && (
                                <Badge className="bg-neon-blue/10 text-neon-blue border-neon-blue/30 text-[10px] h-4">Freelance</Badge>
                              )}
                              <Badge variant="outline" className={cn("text-[10px] h-4 border", badgeInfo.className)}>
                                {member.invitationState === 'invited' && <Clock className="w-2.5 h-2.5 mr-1" />}
                                {member.invitationState === 'confirmed' && <CheckCircle2 className="w-2.5 h-2.5 mr-1" />}
                                {member.invitationState === 'declined' && <XCircle className="w-2.5 h-2.5 mr-1" />}
                                {badgeInfo.label}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{member.seller.levelName}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {/* Simulate responses for demo */}
                            {member.invitationState === 'invited' && (
                              <div className="flex gap-1">
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
                              </div>
                            )}
                            {member.invitationState === 'declined' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs text-primary"
                                onClick={() => {
                                  setRosterMembers(prev =>
                                    prev.map(m => m.seller.sellerId === member.seller.sellerId ? { ...m, invitationState: 'invited' } : m)
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

                {/* Stats Summary */}
                {rosterMembers.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-border grid grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{rosterMembers.length}</p>
                      <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-yellow-400">{invitedCount}</p>
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

      {/* Seller Profile Modal */}
      <Dialog open={!!showSellerProfile} onOpenChange={() => setShowSellerProfile(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-neon-blue" />
              Perfil de Vendedor
            </DialogTitle>
            <DialogDescription>Información pública de CREWS — historial de promotoras privado</DialogDescription>
          </DialogHeader>
          {profileSeller && (
            <div className="mt-2">
              <SellerPublicProfile
                seller={profileSeller}
                isFreelance={true}
                onInvite={(id) => {
                  const entry = getGlobalPoolForAdmin().find(e => e.id === id);
                  if (entry) {
                    handleInviteExternal(entry);
                    setShowSellerProfile(null);
                  }
                }}
                alreadyInvited={invitedExternals.has(profileSeller.id)}
                alreadyInRoster={rosterSellerIds.has(profileSeller.id)}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

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

      {/* Share Modal */}
      <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enlace de Invitación</DialogTitle>
            <DialogDescription>Comparte este enlace para que nuevos vendedores se inscriban al evento</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="p-4 rounded-lg bg-card-elevated border border-border">
              <p className="text-sm font-mono break-all">{inviteLink}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => { navigator.clipboard.writeText(inviteLink); toast.success("Enlace copiado"); }}>
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
