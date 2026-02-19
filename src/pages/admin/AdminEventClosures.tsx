import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Wallet, Check, Clock, DollarSign, Users, Eye, Calendar, CheckCircle2, FileImage, Settings2
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { events } from "@/data/mockData";
import { mockAdminClosures } from "@/services/closureService";
import { VendorClosure } from "@/types/crews";
import { PaymentModal } from "@/components/admin/PaymentModal";
import { toast } from "sonner";
import { notifyClosureExecuted } from "@/services/whatsappService";

export default function AdminEventClosures() {
  const { eventId } = useParams();
  const event = events.find(e => e.id === eventId) || events[0];
  const [closures, setClosures] = useState<VendorClosure[]>(mockAdminClosures.filter(c => c.eventId === (eventId || "evt-1")));
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedClosure, setSelectedClosure] = useState<VendorClosure | null>(null);
  const [showProofViewer, setShowProofViewer] = useState(false);

  // Closure schedule state
  const [closureScheduledAt, setClosureScheduledAt] = useState<string>("2026-02-16T00:00");
  const [closureExecuted, setClosureExecuted] = useState(true);
  const [editingSchedule, setEditingSchedule] = useState(false);

  const pendingCount = closures.filter(c => c.status === "pending").length;
  const declaredCount = closures.filter(c => c.status === "payment_declared").length;
  const confirmedCount = closures.filter(c => c.status === "confirmed").length;
  const totalToPay = closures.reduce((sum, c) => sum + c.totalCommission, 0);

  const getStatusBadge = (status: VendorClosure["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="text-warning border-warning gap-1"><Clock className="w-3 h-3" />Pendiente</Badge>;
      case "payment_declared":
        return <Badge variant="outline" className="text-neon-blue border-neon-blue gap-1"><FileImage className="w-3 h-3" />Comprobante subido</Badge>;
      case "confirmed":
        return <Badge variant="outline" className="text-success border-success gap-1"><CheckCircle2 className="w-3 h-3" />Confirmado</Badge>;
    }
  };

  const handlePaymentDeclared = (closureId: string, proofBase64: string, amount: number) => {
    setClosures(closures.map(c =>
      c.id === closureId
        ? { ...c, status: "payment_declared" as const, paymentProofBase64: proofBase64, paymentDeclaredAt: new Date().toISOString(), paymentDeclaredAmount: amount }
        : c
    ));
  };

  const handleExecuteClosure = () => {
    setClosureExecuted(true);
    toast.success("Cierre ejecutado exitosamente");
    notifyClosureExecuted("+57 300 000 0000", event.name, closures.length.toString());
  };

  return (
    <DashboardLayout title={`Cierres: ${event.name}`} subtitle="Gestión de pagos por vendedor" userLevel={4}>
      <div className="space-y-6">
        {/* Closure Schedule Config */}
        <Card variant="glass" className="p-5 border-primary/20">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20"><Settings2 className="w-5 h-5 text-primary" /></div>
              <div>
                <h3 className="font-semibold">Configuración de Cierre</h3>
                {closureExecuted ? (
                  <p className="text-sm text-muted-foreground">Cierre ejecutado el {new Date(closureScheduledAt).toLocaleString()}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">Cierre programado para el {new Date(closureScheduledAt).toLocaleString()}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {closureExecuted ? (
                <Badge variant="outline" className="text-success border-success gap-1"><CheckCircle2 className="w-3 h-3" />Ejecutado</Badge>
              ) : (
                <>
                  {editingSchedule ? (
                    <div className="flex items-center gap-2">
                      <input type="datetime-local" value={closureScheduledAt}
                        onChange={e => setClosureScheduledAt(e.target.value)}
                        className="bg-card border border-border rounded-lg px-3 py-2 text-sm" />
                      <Button size="sm" onClick={() => { setEditingSchedule(false); toast.success("Hora de cierre actualizada"); }}>Guardar</Button>
                    </div>
                  ) : (
                    <>
                      <Badge variant="outline" className="text-warning border-warning gap-1"><Clock className="w-3 h-3" />Programado</Badge>
                      <Button variant="outline" size="sm" onClick={() => setEditingSchedule(true)}>Modificar</Button>
                      <Button variant="party" size="sm" onClick={handleExecuteClosure}>Ejecutar ahora</Button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </Card>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30">
            <CardContent className="p-4 flex items-center gap-3">
              <Users className="w-6 h-6 text-primary" />
              <div><p className="text-2xl font-bold">{closures.length}</p><p className="text-xs text-muted-foreground">Vendedores</p></div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-warning/20 to-warning/5 border-warning/30">
            <CardContent className="p-4 flex items-center gap-3">
              <DollarSign className="w-6 h-6 text-warning" />
              <div><p className="text-2xl font-bold">${(totalToPay / 1000000).toFixed(1)}M</p><p className="text-xs text-muted-foreground">Total a pagar</p></div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-neon-blue/20 to-neon-blue/5 border-neon-blue/30">
            <CardContent className="p-4 flex items-center gap-3">
              <Clock className="w-6 h-6 text-neon-blue" />
              <div><p className="text-2xl font-bold">{pendingCount}</p><p className="text-xs text-muted-foreground">Pendientes</p></div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-success/20 to-success/5 border-success/30">
            <CardContent className="p-4 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-success" />
              <div><p className="text-2xl font-bold">{confirmedCount}</p><p className="text-xs text-muted-foreground">Confirmados</p></div>
            </CardContent>
          </Card>
        </div>

        {/* Vendor Closures Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2"><Wallet className="w-5 h-5" />Tabla de Pagos</CardTitle>
            <Badge variant="secondary">{pendingCount} pendientes • {declaredCount} por confirmar</Badge>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Vendedor</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Tickets</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Comisión</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Estado</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {closures.map((closure) => (
                    <tr key={closure.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-party flex items-center justify-center text-white font-semibold text-sm">
                            {closure.vendorAvatar}
                          </div>
                          <div>
                            <p className="font-medium">{closure.vendorName}</p>
                            <p className="text-xs text-muted-foreground">{closure.vendorLevelName} • ${closure.commissionPerTicket.toLocaleString()}/ticket</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold">{closure.ticketsSold}</td>
                      <td className="py-3 px-4 font-semibold text-success">${closure.totalCommission.toLocaleString()}</td>
                      <td className="py-3 px-4">{getStatusBadge(closure.status)}</td>
                      <td className="py-3 px-4">
                        {closure.status === "pending" && (
                          <Button size="sm" variant="party" onClick={() => { setSelectedClosure(closure); setShowPaymentModal(true); }}>
                            <DollarSign className="w-4 h-4 mr-1" />Registrar pago
                          </Button>
                        )}
                        {closure.status === "payment_declared" && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Esperando confirmación</span>
                            <Button size="sm" variant="outline" onClick={() => { setSelectedClosure(closure); setShowProofViewer(true); }}>
                              <Eye className="w-4 h-4 mr-1" />Ver comprobante
                            </Button>
                          </div>
                        )}
                        {closure.status === "confirmed" && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-success">✅ {closure.confirmedAt ? new Date(closure.confirmedAt).toLocaleDateString() : ""}</span>
                            <Button size="sm" variant="ghost" onClick={() => { setSelectedClosure(closure); setShowProofViewer(true); }}>
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <PaymentModal open={showPaymentModal} onOpenChange={setShowPaymentModal}
        closure={selectedClosure} onPaymentDeclared={handlePaymentDeclared} />

      {/* Proof Viewer */}
      <Dialog open={showProofViewer} onOpenChange={setShowProofViewer}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Comprobante de Pago</DialogTitle>
            <DialogDescription>{selectedClosure?.vendorName} — ${selectedClosure?.totalCommission.toLocaleString()} COP</DialogDescription>
          </DialogHeader>
          <div className="p-6 border border-border rounded-lg text-center bg-card-elevated">
            <FileImage className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Comprobante subido</p>
            {selectedClosure?.paymentDeclaredAt && (
              <p className="text-xs text-muted-foreground mt-1">Declarado: {new Date(selectedClosure.paymentDeclaredAt).toLocaleString()}</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
