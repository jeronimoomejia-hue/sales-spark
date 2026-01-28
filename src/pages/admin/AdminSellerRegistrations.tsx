import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  UserPlus, 
  Check, 
  X, 
  Clock,
  Mail,
  Phone,
  Calendar,
  Search,
  Filter,
  MessageSquare,
  Eye
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { pendingRegistrations, SellerRegistration, getRegistrationsByEvent, getGlobalRegistrations } from "@/data/eventTemplates";
import { events } from "@/data/mockData";
import { toast } from "sonner";

export default function AdminSellerRegistrations() {
  const [registrations, setRegistrations] = useState<SellerRegistration[]>(pendingRegistrations);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [selectedRegistration, setSelectedRegistration] = useState<SellerRegistration | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [rejectionNote, setRejectionNote] = useState("");

  const filteredRegistrations = registrations.filter(r => {
    const matchesSearch = r.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.sellerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = r.status === selectedTab;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = registrations.filter(r => r.status === 'pending').length;
  const approvedCount = registrations.filter(r => r.status === 'approved').length;
  const rejectedCount = registrations.filter(r => r.status === 'rejected').length;

  const handleApprove = (registrationId: string) => {
    setRegistrations(registrations.map(r => 
      r.id === registrationId 
        ? { ...r, status: 'approved' as const, reviewedAt: new Date().toISOString() }
        : r
    ));
    toast.success("Vendedor aprobado exitosamente");
    setShowDetailModal(false);
  };

  const handleReject = (registrationId: string) => {
    setRegistrations(registrations.map(r => 
      r.id === registrationId 
        ? { ...r, status: 'rejected' as const, reviewedAt: new Date().toISOString(), notes: rejectionNote }
        : r
    ));
    toast.info("Solicitud rechazada");
    setShowDetailModal(false);
    setRejectionNote("");
  };

  const handleViewDetail = (registration: SellerRegistration) => {
    setSelectedRegistration(registration);
    setShowDetailModal(true);
  };

  const getEventName = (eventId?: string) => {
    if (!eventId) return null;
    return events.find(e => e.id === eventId)?.name;
  };

  return (
    <DashboardLayout
      title="Solicitudes de Vendedores"
      subtitle="Aprueba o rechaza las inscripciones de nuevos vendedores"
      userLevel={4}
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card variant="glass" className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/20">
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pendientes</p>
                <p className="text-2xl font-bold">{pendingCount}</p>
              </div>
            </div>
          </Card>
          <Card variant="glass" className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/20">
                <Check className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Aprobados</p>
                <p className="text-2xl font-bold">{approvedCount}</p>
              </div>
            </div>
          </Card>
          <Card variant="glass" className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/20">
                <X className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rechazados</p>
                <p className="text-2xl font-bold">{rejectedCount}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4 items-center">
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar por nombre o email..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as any)}>
          <TabsList>
            <TabsTrigger value="pending" className="gap-2">
              <Clock className="w-4 h-4" />
              Pendientes
              {pendingCount > 0 && (
                <Badge variant="secondary" className="ml-1">{pendingCount}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="approved" className="gap-2">
              <Check className="w-4 h-4" />
              Aprobados
            </TabsTrigger>
            <TabsTrigger value="rejected" className="gap-2">
              <X className="w-4 h-4" />
              Rechazados
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="mt-4">
            <div className="space-y-3">
              {filteredRegistrations.map((registration, index) => (
                <motion.div
                  key={registration.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <Card variant="default" className="p-4 hover:border-primary/30 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-party flex items-center justify-center text-white font-bold">
                          {registration.sellerAvatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{registration.sellerName}</h4>
                            <Badge variant={registration.requestedLevel === 2 ? 'default' : 'secondary'}>
                              {registration.requestedLevel === 2 ? 'Cabeza' : 'Promotor'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {registration.sellerEmail}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {registration.sellerPhone}
                            </span>
                          </div>
                          {registration.eventId && (
                            <Badge variant="outline" className="mt-2">
                              Para: {getEventName(registration.eventId)}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right text-sm text-muted-foreground">
                          <p className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(registration.requestedAt).toLocaleDateString()}
                          </p>
                          <p>{new Date(registration.requestedAt).toLocaleTimeString()}</p>
                        </div>

                        {registration.status === 'pending' ? (
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewDetail(registration)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Ver
                            </Button>
                            <Button 
                              variant="default" 
                              size="sm"
                              onClick={() => handleApprove(registration.id)}
                              className="bg-success hover:bg-success/90"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleViewDetail(registration)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <Badge 
                            variant={registration.status === 'approved' ? 'default' : 'destructive'}
                            className="capitalize"
                          >
                            {registration.status === 'approved' ? 'Aprobado' : 'Rechazado'}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {registration.notes && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          {registration.notes}
                        </p>
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))}

              {filteredRegistrations.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <UserPlus className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No hay solicitudes {selectedTab === 'pending' ? 'pendientes' : selectedTab === 'approved' ? 'aprobadas' : 'rechazadas'}</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Detail/Action Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalles de Solicitud</DialogTitle>
            <DialogDescription>Revisa la información del vendedor</DialogDescription>
          </DialogHeader>
          
          {selectedRegistration && (
            <div className="space-y-6 mt-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-party flex items-center justify-center text-white text-xl font-bold">
                  {selectedRegistration.sellerAvatar}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedRegistration.sellerName}</h3>
                  <Badge variant={selectedRegistration.requestedLevel === 2 ? 'default' : 'secondary'}>
                    Solicita: {selectedRegistration.requestedLevel === 2 ? 'Cabeza de Equipo' : 'Promotor'}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedRegistration.sellerEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Teléfono</p>
                  <p className="font-medium">{selectedRegistration.sellerPhone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fecha de Solicitud</p>
                  <p className="font-medium">
                    {new Date(selectedRegistration.requestedAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Evento/Promotora</p>
                  <p className="font-medium">
                    {selectedRegistration.eventId 
                      ? getEventName(selectedRegistration.eventId)
                      : 'Inscripción general'}
                  </p>
                </div>
              </div>

              {selectedRegistration.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Notas</p>
                  <p className="p-3 rounded-lg bg-card-elevated">{selectedRegistration.notes}</p>
                </div>
              )}

              {selectedRegistration.status === 'pending' && (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Nota de rechazo (opcional)</p>
                    <Textarea
                      placeholder="Escribe una razón para el rechazo..."
                      value={rejectionNote}
                      onChange={(e) => setRejectionNote(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setShowDetailModal(false)}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      variant="destructive" 
                      className="flex-1"
                      onClick={() => handleReject(selectedRegistration.id)}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Rechazar
                    </Button>
                    <Button 
                      variant="default" 
                      className="flex-1 bg-success hover:bg-success/90"
                      onClick={() => handleApprove(selectedRegistration.id)}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Aprobar
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
