import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link2, Copy, Check, Ticket } from "lucide-react";
import { toast } from "sonner";
import { Event } from "@/data/mockData";

interface PaymentLinkPreviewProps {
  event: Event;
  sellerId: string;
}

export function PaymentLinkPreview({ event, sellerId }: PaymentLinkPreviewProps) {
  const [copied, setCopied] = useState(false);
  const link = `crews.app/pay/${event.id}/${sellerId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://${link}`);
    setCopied(true);
    toast.success("Link copiado al portapapeles");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card variant="glass" className="p-4 space-y-3 mt-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold flex items-center gap-2">
          <Link2 className="w-4 h-4 text-primary" />
          Mi Link de Pago
        </h4>
        <Button variant="outline" size="sm" className="gap-1 h-7 text-xs" onClick={handleCopy}>
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? "Copiado" : "Copiar"}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground font-mono bg-card-elevated rounded px-2 py-1 truncate">
        {link}
      </p>

      <div className="space-y-1.5">
        {event.ticketTypes.map((t) => {
          const hasDiscount = event.emptySeatsAlert?.isActive;
          const finalPrice = hasDiscount
            ? Math.round(t.price * (1 - (event.emptySeatsAlert!.discountPercent / 100)))
            : t.price;

          return (
            <div key={t.id} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }} />
                <span>{t.name}</span>
              </div>
              <div className="flex items-center gap-2">
                {hasDiscount && (
                  <span className="line-through text-muted-foreground">${t.price.toLocaleString()}</span>
                )}
                <span className="font-bold">${finalPrice.toLocaleString()}</span>
                {hasDiscount && (
                  <Badge className="text-[10px] h-4 bg-destructive/20 text-destructive border-destructive/30">
                    -{event.emptySeatsAlert!.discountPercent}%
                  </Badge>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
