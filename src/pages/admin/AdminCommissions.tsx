import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Wallet, 
  Save, 
  RotateCcw,
  AlertTriangle,
  ArrowUp,
  Users
} from "lucide-react";

const commissionConfig = {
  baseTicketPrice: 40000,
  serviceFee: 5000,
  levels: [
    { level: 1, name: "Promotor Común", commission: 7500, peopleControlled: 0 },
    { level: 2, name: "Promotor Cabeza", commission: 10000, peopleControlled: 15 },
    { level: 3, name: "Sub Socio", commission: 15000, peopleControlled: 5 },
    { level: 4, name: "Socio", commission: 17500, peopleControlled: 3 },
  ]
};

const levelRequirements = [
  {
    from: 1,
    to: 2,
    fromName: "Promotor Común",
    toName: "Promotor Cabeza",
    ticketsRequired: 120,
    periodDays: 30,
    additionalReqs: ["Completar capacitación de liderazgo"],
    newCommission: 10000
  },
  {
    from: 2,
    to: 3,
    fromName: "Promotor Cabeza",
    toName: "Sub Socio",
    ticketsRequired: 500,
    periodDays: 90,
    additionalReqs: [
      "Equipo de mín. 10 personas activas",
      "Ventas del equipo: mín. 800 tickets",
      "Aprobación de Socios"
    ],
    newCommission: 15000
  },
  {
    from: 3,
    to: 4,
    fromName: "Sub Socio",
    toName: "Socio",
    ticketsRequired: 0,
    periodDays: 0,
    additionalReqs: ["Solo por invitación de Socios actuales"],
    newCommission: 17500
  }
];

export default function AdminCommissions() {
  const [config, setConfig] = useState(commissionConfig);

  const totalDistributed = config.levels.reduce((sum, l) => sum + l.commission, 0);
  const percentage = ((totalDistributed / config.baseTicketPrice) * 100).toFixed(1);

  return (
    <DashboardLayout 
      title="Configuración de Comisiones" 
      subtitle="Gestiona las comisiones y requisitos de ascenso"
      userLevel={4}
    >
      <div className="space-y-6">
        {/* Commission Configuration */}
        <Card variant="glass" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" />
              Estructura de Comisiones
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Restaurar
              </Button>
              <Button variant="party" className="gap-2">
                <Save className="w-4 h-4" />
                Guardar Cambios
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-lg bg-card-elevated">
              <label className="text-sm text-muted-foreground mb-2 block">Precio Base Ticket</label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">$</span>
                <Input 
                  type="number" 
                  value={config.baseTicketPrice} 
                  onChange={(e) => setConfig({...config, baseTicketPrice: parseInt(e.target.value)})}
                  className="text-lg font-bold"
                />
                <span className="text-muted-foreground">COP</span>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-card-elevated">
              <label className="text-sm text-muted-foreground mb-2 block">Cargo por Servicio</label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">$</span>
                <Input 
                  type="number" 
                  value={config.serviceFee} 
                  onChange={(e) => setConfig({...config, serviceFee: parseInt(e.target.value)})}
                  className="text-lg font-bold"
                />
                <span className="text-muted-foreground">COP</span>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <label className="text-sm text-muted-foreground mb-2 block">Precio Total Cliente</label>
              <p className="text-2xl font-bold text-primary">
                ${(config.baseTicketPrice + config.serviceFee).toLocaleString()} COP
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {config.levels.map((level, index) => (
              <motion.div
                key={level.level}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-4 rounded-lg bg-card-elevated border border-border"
              >
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <Badge variant={index === 3 ? "destructive" : index === 2 ? "warning" : index === 1 ? "default" : "secondary"}>
                      Nivel {level.level}
                    </Badge>
                    <h3 className="font-semibold text-lg">{level.name}</h3>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Comisión/Ticket</label>
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground text-sm">$</span>
                        <Input 
                          type="number" 
                          value={level.commission}
                          className="w-24"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Personas Controladas</label>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <Input 
                          type="number" 
                          value={level.peopleControlled}
                          className="w-16"
                        />
                      </div>
                    </div>
                    <div className="text-right min-w-[80px]">
                      <label className="text-xs text-muted-foreground mb-1 block">% del Ticket</label>
                      <p className="font-bold text-primary">
                        {((level.commission / config.baseTicketPrice) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className={`mt-6 p-4 rounded-lg border ${
            parseFloat(percentage) > 100 
              ? 'bg-destructive/10 border-destructive/30' 
              : 'bg-success/10 border-success/30'
          }`}>
            <div className="flex items-center gap-2">
              {parseFloat(percentage) > 100 && <AlertTriangle className="w-5 h-5 text-destructive" />}
              <p className={parseFloat(percentage) > 100 ? 'text-destructive' : 'text-success'}>
                <strong>Total Distribuido:</strong> ${totalDistributed.toLocaleString()} COP ({percentage}% del precio base)
              </p>
            </div>
            {parseFloat(percentage) > 100 && (
              <p className="text-sm text-destructive mt-1">
                ⚠️ Las comisiones superan el precio base del ticket. Revisa la configuración.
              </p>
            )}
          </div>
        </Card>

        {/* Level Requirements */}
        <Card variant="glass" className="p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <ArrowUp className="w-5 h-5 text-primary" />
            Requisitos de Ascenso
          </h2>

          <div className="space-y-4">
            {levelRequirements.map((req, index) => (
              <motion.div
                key={`${req.from}-${req.to}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-5 rounded-lg bg-card-elevated border border-border"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="secondary">{req.fromName}</Badge>
                  <ArrowUp className="w-4 h-4 text-primary" />
                  <Badge variant="success">{req.toName}</Badge>
                </div>

                {req.ticketsRequired > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Tickets Requeridos</label>
                      <Input type="number" defaultValue={req.ticketsRequired} />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Período (días)</label>
                      <Input type="number" defaultValue={req.periodDays} />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Nueva Comisión</label>
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground text-sm">$</span>
                        <Input type="number" defaultValue={req.newCommission} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-warning/10 border border-warning/20 mb-4">
                    <p className="text-sm text-warning">⚠️ Este nivel solo es accesible por invitación</p>
                  </div>
                )}

                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">Requisitos Adicionales</label>
                  <ul className="space-y-1">
                    {req.additionalReqs.map((reqText, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span>{reqText}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-end mt-6">
            <Button variant="party" className="gap-2">
              <Save className="w-4 h-4" />
              Guardar Requisitos
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
