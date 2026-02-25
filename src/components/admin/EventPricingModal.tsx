import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DollarSign, Ticket, Users, Save, Bell, Calculator } from "lucide-react";
import { toast } from "sonner";
import { Event, TicketType } from "@/data/mockData";

interface EventPricingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: Event | null;
  onSave: (eventId: string, ticketTypes: TicketType[], commissions: Record<number, number>) => void;
}

const levelNames: Record<number, string> = {
  1: "Común",
  2: "Cabeza",
  3: "Sub Socio",
  4: "Socio",
};

export function EventPricingModal({ open, onOpenChange, event, onSave }: EventPricingModalProps) {
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [commissions, setCommissions] = useState<Record<number, number>>({});

  useEffect(() => {
    if (event) {
      setTicketTypes([...event.ticketTypes]);
      setCommissions({ ...event.commissionsByLevel });
    }
  }, [event]);

  if (!event) return null;

  const updateTicketPrice = (id: string, price: number) => {
    setTicketTypes(prev => prev.map(t => t.id === id ? { ...t, price } : t));
  };

  const updateTicketAvailable = (id: string, available: number) => {
    setTicketTypes(prev => prev.map(t => t.id === id ? { ...t, available } : t));
  };

  const updateCommission = (level: number, value: number) => {
    setCommissions(prev => ({ ...prev, [level]: value }));
  };

  const handleSave = () => {
    onSave(event.id, ticketTypes, commissions);
    toast.success("Precios y comisiones actualizados", {
      description: "Los vendedores verán los cambios en su dashboard inmediatamente.",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <DollarSign className="w-5 h-5 text-primary" />
            Precios y Comisiones — {event.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Ticket Types */}
          <div>
            <h3 className="font-semibold flex items-center gap-2 mb-3">
              <Ticket className="w-4 h-4 text-primary" />
              Tipos de Boleta
            </h3>
            <div className="space-y-3">
              {ticketTypes.map((ticket) => (
                <Card key={ticket.id} variant="glass" className="p-4">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: ticket.color }}
                    />
                    <span className="font-medium w-20">{ticket.name}</span>
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-muted-foreground">Precio (COP)</label>
                        <Input
                          type="number"
                          value={ticket.price}
                          onChange={(e) => updateTicketPrice(ticket.id, Number(e.target.value))}
                          className="h-9"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Disponibles</label>
                        <Input
                          type="number"
                          value={ticket.available}
                          onChange={(e) => updateTicketAvailable(ticket.id, Number(e.target.value))}
                          className="h-9"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          {/* Commissions by Level */}
          <div>
            <h3 className="font-semibold flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-primary" />
              Comisión por Nivel (por ticket vendido)
            </h3>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((level) => (
                <Card key={level} variant="glass" className="p-4">
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="w-24 justify-center">
                      Nv. {level}
                    </Badge>
                    <span className="text-sm text-muted-foreground w-20">{levelNames[level]}</span>
                    <div className="flex-1">
                      <Input
                        type="number"
                        value={commissions[level] || 0}
                        onChange={(e) => updateCommission(level, Number(e.target.value))}
                        className="h-9"
                      />
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1 w-44">
                      <Calculator className="w-3 h-3" />
                      10 tickets = ${((commissions[level] || 0) * 10).toLocaleString()} COP
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          {/* Payment Link Preview */}
          <div>
            <h3 className="font-semibold flex items-center gap-2 mb-3">
              <DollarSign className="w-4 h-4 text-success" />
              Preview del Link de Pago
            </h3>
            <Card variant="glass" className="p-4 space-y-2">
              <p className="text-xs text-muted-foreground">Los compradores verán estos precios:</p>
              {ticketTypes.map((t) => (
                <div key={t.id} className="flex items-center justify-between text-sm">
                  <span>{t.name}</span>
                  <span className="font-bold">${t.price.toLocaleString()} COP</span>
                </div>
              ))}
            </Card>
          </div>

          {/* Save Button */}
          <Button onClick={handleSave} className="w-full gap-2" variant="party">
            <Save className="w-4 h-4" />
            Guardar y Notificar Vendedores
            <Bell className="w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
