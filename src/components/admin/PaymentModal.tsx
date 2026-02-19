import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Upload, FileImage, DollarSign, AlertCircle, CheckCircle2 } from "lucide-react";
import { VendorClosure } from "@/types/crews";
import { toast } from "sonner";
import { notifyPaymentPending } from "@/services/whatsappService";

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  closure: VendorClosure | null;
  onPaymentDeclared: (closureId: string, proofBase64: string, amount: number) => void;
}

export function PaymentModal({ open, onOpenChange, closure, onPaymentDeclared }: PaymentModalProps) {
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("El archivo no puede superar 5MB");
      return;
    }

    setProofFile(file);
    const reader = new FileReader();
    reader.onload = () => setProofPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!closure || !proofPreview) return;
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));

    onPaymentDeclared(closure.id, proofPreview, closure.totalCommission);
    notifyPaymentPending("+57 300 000 0000", "NeonEvents", closure.totalCommission.toLocaleString(), closure.eventName);

    toast.success(`Pago declarado para ${closure.vendorName}`);
    setProofFile(null);
    setProofPreview(null);
    setIsSubmitting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            Registrar Pago
          </DialogTitle>
          <DialogDescription>
            Sube el comprobante de pago para {closure?.vendorName}
          </DialogDescription>
        </DialogHeader>

        {closure && (
          <div className="space-y-4 mt-4">
            <div className="p-4 rounded-lg bg-card-elevated space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Vendedor</span>
                <span className="font-medium">{closure.vendorName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Nivel</span>
                <span>{closure.vendorLevelName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tickets vendidos</span>
                <span className="font-medium">{closure.ticketsSold}</span>
              </div>
              <div className="flex justify-between text-sm border-t border-border pt-2">
                <span className="text-muted-foreground font-semibold">Monto a pagar</span>
                <span className="font-bold text-lg text-success">${closure.totalCommission.toLocaleString()} COP</span>
              </div>
            </div>

            {/* File upload */}
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Comprobante de pago (JPG, PNG o PDF, máx 5MB)
              </label>
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,application/pdf"
                onChange={handleFileChange} className="hidden" />

              {proofPreview ? (
                <div className="border border-border rounded-lg overflow-hidden">
                  {proofFile?.type.startsWith("image/") ? (
                    <img src={proofPreview} alt="Comprobante" className="w-full max-h-48 object-contain bg-black/50" />
                  ) : (
                    <div className="p-6 text-center bg-card-elevated">
                      <FileImage className="w-10 h-10 mx-auto text-primary mb-2" />
                      <p className="text-sm">{proofFile?.name}</p>
                    </div>
                  )}
                  <Button variant="ghost" size="sm" className="w-full" onClick={() => fileInputRef.current?.click()}>
                    Cambiar archivo
                  </Button>
                </div>
              ) : (
                <button onClick={() => fileInputRef.current?.click()}
                  className="w-full p-8 border-2 border-dashed border-border rounded-lg hover:border-primary/50 transition-colors text-center">
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Click para subir comprobante</p>
                </button>
              )}
            </div>

            <Button variant="party" className="w-full gap-2" onClick={handleSubmit}
              disabled={!proofFile || isSubmitting}>
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><CheckCircle2 className="w-4 h-4" /> Declarar pago enviado</>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
