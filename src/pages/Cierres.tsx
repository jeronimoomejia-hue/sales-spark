import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  Wallet, Calendar, Clock, CheckCircle2, AlertCircle, Eye, Ticket, FileImage, Download
} from "lucide-react";
import { mockVendorClosures } from "@/services/closureService";
import { VendorClosure } from "@/types/crews";
import { toast } from "sonner";
import { notifyPaymentConfirmed } from "@/services/whatsappService";

const getStatusConfig = (status: VendorClosure["status"]) => {
  switch (status) {
    case "pending":
      return { label: "Pendiente de pago", color: "bg-warning/20 text-warning border-warning/30", icon: Clock };
    case "payment_declared":
      return { label: "Pago declarado", color: "bg-neon-blue/20 text-neon-blue border-neon-blue/30", icon: FileImage };
    case "confirmed":
      return { label: "Pagado y confirmado", color: "bg-success/20 text-success border-success/30", icon: CheckCircle2 };
  }
};

export default function Cierres() {
  const [userLevel, setUserLevel] = useState<number>(1);
  const [closures] = useState<VendorClosure[]>(mockVendorClosures);
  const [selectedClosure, setSelectedClosure] = useState<VendorClosure | null>(null);
  const [showProofModal, setShowProofModal] = useState(false);

  useEffect(() => {
    const storedLevel = sessionStorage.getItem("demoUserLevel");
    if (storedLevel) setUserLevel(parseInt(storedLevel));
  }, []);

  const handleConfirmPayment = (closure: VendorClosure) => {
    toast.success("¡Pago confirmado exitosamente!");
    notifyPaymentConfirmed("+57 300 000 0000", closure.vendorName, closure.totalCommission.toLocaleString(), closure.eventName);
    setShowProofModal(false);
  };

  const totalEarned = closures
    .filter(c => c.status === "confirmed")
    .reduce((sum, c) => sum + c.totalCommission, 0);

  const pendingAmount = closures
    .filter(c => c.status !== "confirmed")
    .reduce((sum, c) => sum + c.totalCommission, 0);

  return (
    <DashboardLayout title="Mis Cierres" subtitle="Aquí puedes ver el resumen de los pagos de cada evento en el que participaste" userLevel={userLevel}>
      <div className="space-y-6">
        {/* Summary KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card variant="glass" className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/20"><CheckCircle2 className="w-5 h-5 text-success" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Total confirmado</p>
                <p className="text-2xl font-bold font-display">${(totalEarned / 1000).toFixed(0)}K</p>
              </div>
            </div>
          </Card>
          <Card variant="glass" className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/20"><Clock className="w-5 h-5 text-warning" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Pendiente</p>
                <p className="text-2xl font-bold font-display">${(pendingAmount / 1000).toFixed(0)}K</p>
              </div>
            </div>
          </Card>
          <Card variant="glass" className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20"><Ticket className="w-5 h-5 text-primary" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Eventos cerrados</p>
                <p className="text-2xl font-bold font-display">{closures.length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Closure list */}
        {closures.length === 0 ? (
          <Card variant="glass" className="p-12 text-center">
            <Wallet className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">Aún no tienes cierres. Cuando termine un evento en el que hayas participado, verás aquí el resumen de tus comisiones.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {closures.map((closure, index) => {
              const config = getStatusConfig(closure.status);
              const StatusIcon = config.icon;

              return (
                <motion.div key={closure.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.08 }}>
                  <Card variant="default" className="p-5 hover:border-primary/30 transition-all">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-gradient-party shrink-0">
                          <Ticket className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{closure.eventName}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(closure.eventDate).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Cierre: {new Date(closure.closureExecutedAt).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 flex-wrap">
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Tickets</p>
                          <p className="font-bold text-lg">{closure.ticketsSold}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Comisión</p>
                          <p className="font-bold text-lg text-success">${closure.totalCommission.toLocaleString()}</p>
                        </div>
                        <Badge variant="outline" className={`gap-1 ${config.color}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {config.label}
                        </Badge>

                        {closure.status === "payment_declared" && (
                          <Button variant="party" size="sm" className="gap-1" onClick={() => { setSelectedClosure(closure); setShowProofModal(true); }}>
                            <Eye className="w-4 h-4" />
                            Ver comprobante y confirmar
                          </Button>
                        )}
                        {closure.status === "confirmed" && closure.confirmedAt && (
                          <span className="text-xs text-muted-foreground">Confirmado: {new Date(closure.confirmedAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Payment Proof Modal */}
      <Dialog open={showProofModal} onOpenChange={setShowProofModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><FileImage className="w-5 h-5 text-primary" /> Comprobante de Pago</DialogTitle>
            <DialogDescription>{selectedClosure?.eventName}</DialogDescription>
          </DialogHeader>
          {selectedClosure && (
            <div className="space-y-4 mt-4">
              <div className="p-4 rounded-lg bg-card-elevated">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Monto declarado</span>
                  <span className="font-bold text-success">${selectedClosure.paymentDeclaredAmount?.toLocaleString()} COP</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Fecha de pago</span>
                  <span>{selectedClosure.paymentDeclaredAt ? new Date(selectedClosure.paymentDeclaredAt).toLocaleString() : "-"}</span>
                </div>
              </div>

              {/* Simulated proof preview */}
              <div className="border border-border rounded-lg p-8 text-center bg-card-elevated">
                <FileImage className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Comprobante de transferencia</p>
                <p className="text-xs text-muted-foreground mt-1">(Vista previa simulada)</p>
              </div>

              <Button variant="party" className="w-full gap-2" onClick={() => handleConfirmPayment(selectedClosure)}>
                <CheckCircle2 className="w-4 h-4" />
                Confirmar que recibí este pago
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
