import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Link2, 
  Plus, 
  RefreshCw, 
  Copy,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Trash2,
  Eye
} from "lucide-react";

const integrations = [
  {
    id: 1,
    name: "Quentro",
    logo: "Q",
    status: "active",
    connectedAt: "15 Dic 2025",
    lastSync: "Hace 5 minutos",
    salesProcessed: 12458,
    webhookUrl: "https://api.crews.app/webhooks/quentro/org-12345"
  },
  {
    id: 2,
    name: "TuBoleta",
    logo: "T",
    status: "inactive",
    connectedAt: null,
    lastSync: null,
    salesProcessed: 0,
    webhookUrl: null
  },
  {
    id: 3,
    name: "Eventbrite",
    logo: "E",
    status: "inactive",
    connectedAt: null,
    lastSync: null,
    salesProcessed: 0,
    webhookUrl: null
  }
];

const webhookLogs = [
  { id: 1, source: "Quentro", timestamp: "2026-01-27 18:45:32", status: "success", payload: "sale_created", salesCount: 1 },
  { id: 2, source: "Quentro", timestamp: "2026-01-27 18:42:15", status: "success", payload: "sale_created", salesCount: 3 },
  { id: 3, source: "Quentro", timestamp: "2026-01-27 18:38:50", status: "success", payload: "sale_created", salesCount: 1 },
  { id: 4, source: "Quentro", timestamp: "2026-01-27 18:35:22", status: "error", payload: "invalid_seller_id", salesCount: 0 },
  { id: 5, source: "Quentro", timestamp: "2026-01-27 18:30:10", status: "success", payload: "sale_created", salesCount: 2 },
];

export default function AdminIntegrations() {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <DashboardLayout 
      title="Integraciones y Webhooks" 
      subtitle="Conecta con ticketeras externas"
      userLevel={4}
    >
      <div className="space-y-6">
        {/* Connected Integrations */}
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Link2 className="w-5 h-5 text-primary" />
            Ticketeras Conectadas
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {integrations.map((integration, index) => (
              <motion.div
                key={integration.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card variant="glass" className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl ${
                        integration.status === "active" ? "bg-gradient-party" : "bg-muted"
                      }`}>
                        {integration.logo}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{integration.name}</h3>
                        <Badge variant={integration.status === "active" ? "success" : "secondary"}>
                          {integration.status === "active" ? "Conectada" : "No conectada"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {integration.status === "active" ? (
                    <>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Conectada desde</span>
                          <span>{integration.connectedAt}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Última sincronización</span>
                          <span className="text-success">{integration.lastSync}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Ventas procesadas</span>
                          <span className="font-medium">{integration.salesProcessed.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-lg bg-card-elevated mb-4">
                        <label className="text-xs text-muted-foreground mb-1 block">Webhook URL</label>
                        <div className="flex items-center gap-2">
                          <code className="text-xs text-primary flex-1 truncate">{integration.webhookUrl}</code>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => copyToClipboard(integration.webhookUrl!)}
                          >
                            {copiedUrl === integration.webhookUrl ? (
                              <CheckCircle2 className="w-4 h-4 text-success" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 gap-1">
                          <Eye className="w-4 h-4" />
                          Ver Logs
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1">
                          <RefreshCw className="w-4 h-4" />
                          Regenerar
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Conecta {integration.name} para sincronizar automáticamente tus ventas.
                      </p>
                      <Button variant="party" className="w-full gap-2">
                        <Plus className="w-4 h-4" />
                        Conectar {integration.name}
                      </Button>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Webhook Logs */}
        <Card variant="glass" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Logs de Webhooks</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <RefreshCw className="w-4 h-4" />
                Actualizar
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Origen</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Timestamp</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Tipo</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Ventas</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Estado</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {webhookLogs.map((log) => (
                  <tr key={log.id} className="border-b border-border/50 hover:bg-card-elevated/50">
                    <td className="p-3">
                      <Badge variant="outline">{log.source}</Badge>
                    </td>
                    <td className="p-3 text-sm font-mono text-muted-foreground">{log.timestamp}</td>
                    <td className="p-3 text-sm">{log.payload}</td>
                    <td className="p-3 font-medium">{log.salesCount}</td>
                    <td className="p-3">
                      {log.status === "success" ? (
                        <Badge variant="success" className="gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Éxito
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Error
                        </Badge>
                      )}
                    </td>
                    <td className="p-3">
                      <Button variant="ghost" size="sm">Ver detalles</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center mt-4">
            <Button variant="outline">Ver más logs</Button>
          </div>
        </Card>

        {/* API Documentation */}
        <Card variant="glass" className="p-6">
          <h3 className="text-lg font-semibold mb-4">Documentación de la API</h3>
          <p className="text-muted-foreground mb-4">
            Configura tu tiquetera para enviar webhooks a CREWS cuando se registre una venta.
          </p>
          
          <div className="p-4 rounded-lg bg-card-elevated font-mono text-sm">
            <p className="text-muted-foreground mb-2">// Ejemplo de payload esperado</p>
            <pre className="text-primary">
{`{
  "event": "sale_created",
  "data": {
    "ticket_id": "TKT-123456",
    "seller_id": "PROMO-12345",
    "event_id": "EVT-001",
    "ticket_type": "general",
    "amount": 40000,
    "sale_date": "2026-01-27T18:45:00Z"
  }
}`}
            </pre>
          </div>

          <div className="flex gap-2 mt-4">
            <Button variant="outline" className="gap-2">
              <ExternalLink className="w-4 h-4" />
              Ver Documentación Completa
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
