import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  CheckCircle2,
  XCircle,
  Calendar,
  MapPin,
  DollarSign,
  Trophy,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  History,
} from "lucide-react";
import { SellerInvitation } from "@/types/seller";
import { pendingInvitations as initialInvitations, invitationHistory } from "@/data/globalSellerPool";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const levelColors: Record<number, string> = {
  1: "bg-neon-blue/20 text-neon-blue border-neon-blue/30",
  2: "bg-neon-orange/20 text-neon-orange border-neon-orange/30",
  3: "bg-neon-pink/20 text-neon-pink border-neon-pink/30",
  4: "bg-gradient-party text-white",
};

function InvitationCard({
  invitation,
  onAccept,
  onDecline,
}: {
  invitation: SellerInvitation;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [declined, setDeclined] = useState(false);

  const handleAccept = async () => {
    setAccepting(true);
    await new Promise(r => setTimeout(r, 900));
    setAccepted(true);
    setAccepting(false);
    setTimeout(() => onAccept(invitation.id), 800);
  };

  const handleDecline = () => {
    setDeclined(true);
    setTimeout(() => onDecline(invitation.id), 500);
  };

  const sentDate = new Date(invitation.sentAt);
  const hoursAgo = Math.round((Date.now() - sentDate.getTime()) / 3600000);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: declined ? 0 : 1, y: 0, scale: declined ? 0.95 : 1 }}
      exit={{ opacity: 0, scale: 0.9, height: 0 }}
      transition={{ duration: 0.35 }}
    >
      <Card
        variant="glass"
        className="relative overflow-hidden border-yellow-400/40 shadow-[0_0_20px_hsl(48_96%_53%/0.12)]"
      >
        {/* Glow top bar */}
        <div className="h-1 bg-gradient-to-r from-yellow-400/80 via-yellow-300 to-yellow-400/80" />

        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 border border-yellow-400/40 flex items-center justify-center text-2xl">
                {invitation.promoterLogo}
              </div>
              <div>
                <h4 className="font-bold text-base">{invitation.promoterName}</h4>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Hace {hoursAgo < 1 ? "unos minutos" : `${hoursAgo}h`}
                </p>
              </div>
            </div>
            <Badge className="bg-yellow-400/20 text-yellow-300 border-yellow-400/40 shrink-0">
              🎉 Invitación
            </Badge>
          </div>

          {/* Event Info */}
          <div className="p-3 rounded-xl bg-card-elevated border border-border mb-4">
            <p className="font-semibold mb-2">{invitation.eventName}</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-primary" />
                {new Date(invitation.eventDate).toLocaleDateString("es-CO", { day: "numeric", month: "long" })}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-neon-pink" />
                {invitation.eventVenue}
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-success" />
                ${invitation.offeredCommission.toLocaleString()} / ticket
              </span>
              <span className="flex items-center gap-1">
                <Trophy className="w-3 h-3 text-warning" />
                <Badge
                  variant="outline"
                  className={cn("text-[10px] h-4 border", levelColors[invitation.offeredLevel])}
                >
                  {invitation.offeredLevelName}
                </Badge>
              </span>
            </div>
          </div>

          {/* Message toggle */}
          {invitation.message && (
            <div className="mb-4">
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                {expanded ? "Ocultar mensaje" : "Ver mensaje de la promotora"}
              </button>
              <AnimatePresence>
                {expanded && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 text-sm text-muted-foreground italic border-l-2 border-yellow-400/50 pl-3 overflow-hidden"
                  >
                    "{invitation.message}"
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 border-destructive/40 text-destructive hover:bg-destructive/10"
              onClick={handleDecline}
              disabled={accepting || accepted}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Declinar
            </Button>
            <Button
              variant="party"
              className="flex-1 min-w-[120px]"
              onClick={handleAccept}
              disabled={accepting || accepted}
            >
              <AnimatePresence mode="wait">
                {accepting ? (
                  <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <motion.div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Aceptando...
                  </motion.span>
                ) : accepted ? (
                  <motion.span key="done" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2 text-success">
                    <CheckCircle2 className="w-4 h-4" />
                    ¡Aceptado!
                  </motion.span>
                ) : (
                  <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Aceptar
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>

        {/* Celebration overlay */}
        <AnimatePresence>
          {accepted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-success/10 backdrop-blur-[2px] flex items-center justify-center rounded-xl"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="text-center"
              >
                <div className="text-5xl mb-2">🎉</div>
                <p className="font-bold text-success">¡Te uniste al equipo!</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

function HistoryCard({ invitation }: { invitation: SellerInvitation }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-card-elevated border border-border">
      <div className="text-2xl">{invitation.promoterLogo}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{invitation.promoterName}</p>
        <p className="text-xs text-muted-foreground truncate">{invitation.eventName}</p>
      </div>
      <div className="text-right shrink-0">
        <Badge
          variant="outline"
          className={cn(
            "text-xs border",
            invitation.status === "accepted"
              ? "border-success/40 text-success bg-success/10"
              : "border-destructive/40 text-destructive bg-destructive/10"
          )}
        >
          {invitation.status === "accepted" ? "✅ Aceptada" : "❌ Declinada"}
        </Badge>
        <p className="text-xs text-muted-foreground mt-1">
          {new Date(invitation.eventDate).toLocaleDateString("es-CO", { day: "numeric", month: "short" })}
        </p>
      </div>
    </div>
  );
}

export function InvitationsPanel() {
  const [invitations, setInvitations] = useState<SellerInvitation[]>(initialInvitations);
  const [showHistory, setShowHistory] = useState(false);

  const handleAccept = (id: string) => {
    const inv = invitations.find(i => i.id === id);
    if (inv) {
      toast.success(`🎉 ¡Bienvenido al equipo de ${inv.promoterName}!`, {
        description: `Ahora aparecerás en la alineación de ${inv.eventName}`,
      });
    }
    setInvitations(prev => prev.filter(i => i.id !== id));
  };

  const handleDecline = (id: string) => {
    const inv = invitations.find(i => i.id === id);
    if (inv) {
      toast.info(`Declinaste la invitación de ${inv.promoterName}`);
    }
    setInvitations(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 border border-yellow-400/40">
            <Bell className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-display">Invitaciones</h2>
            <p className="text-sm text-muted-foreground">Promotoras que quieren trabajar contigo</p>
          </div>
        </div>
        {invitations.length > 0 && (
          <Badge className="bg-yellow-400/20 text-yellow-300 border-yellow-400/40 px-3">
            {invitations.length} pendiente{invitations.length > 1 ? "s" : ""}
          </Badge>
        )}
      </div>

      {/* Pending Invitations */}
      <AnimatePresence mode="popLayout">
        {invitations.length > 0 ? (
          invitations.map(invitation => (
            <InvitationCard
              key={invitation.id}
              invitation={invitation}
              onAccept={handleAccept}
              onDecline={handleDecline}
            />
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Sparkles className="w-12 h-12 mx-auto mb-3 text-muted-foreground/40" />
            <p className="text-muted-foreground font-medium">No tienes invitaciones pendientes</p>
            <p className="text-sm text-muted-foreground/60 mt-1">
              Las promotoras te enviarán invitaciones cuando quieran que vendas en sus eventos
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History Toggle */}
      <div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full"
        >
          <History className="w-4 h-4" />
          {showHistory ? "Ocultar historial" : "Ver historial de invitaciones"}
          {showHistory ? <ChevronUp className="w-4 h-4 ml-auto" /> : <ChevronDown className="w-4 h-4 ml-auto" />}
        </button>

        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2 mt-3 overflow-hidden"
            >
              {invitationHistory.map(inv => (
                <HistoryCard key={inv.id} invitation={inv} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
