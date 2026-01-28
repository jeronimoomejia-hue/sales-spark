import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Plus,
  Star,
  Clock,
  Copy,
  Trash2,
  Edit,
  Eye,
  Search,
  LayoutGrid,
  List
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { savedTemplates, EventTemplate } from "@/data/eventTemplates";
import { toast } from "sonner";
import { TemplateEditorModal } from "@/components/admin/TemplateEditorModal";

export default function AdminTemplates() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<EventTemplate[]>(savedTemplates);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedTemplate, setSelectedTemplate] = useState<EventTemplate | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showEditorModal, setShowEditorModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EventTemplate | null>(null);

  const filteredTemplates = templates.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDuplicate = (template: EventTemplate) => {
    const newTemplate: EventTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      name: `${template.name} (copia)`,
      isDefault: false,
      usageCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setTemplates([newTemplate, ...templates]);
    toast.success("Plantilla duplicada");
  };

  const handleDelete = (templateId: string) => {
    setTemplates(templates.filter(t => t.id !== templateId));
    toast.success("Plantilla eliminada");
  };

  const handleSetDefault = (templateId: string) => {
    setTemplates(templates.map(t => ({
      ...t,
      isDefault: t.id === templateId
    })));
    toast.success("Plantilla establecida como predeterminada");
  };

  const handlePreview = (template: EventTemplate) => {
    setSelectedTemplate(template);
    setShowPreviewModal(true);
  };

  const handleEdit = (template: EventTemplate) => {
    setEditingTemplate(template);
    setShowEditorModal(true);
  };

  const handleSaveTemplate = (updatedTemplate: EventTemplate) => {
    setTemplates(templates.map(t =>
      t.id === updatedTemplate.id ? updatedTemplate : t
    ));
  };

  return (
    <DashboardLayout
      title="Plantillas de Vendedores"
      subtitle="Gestiona tus alineaciones reutilizables"
      userLevel={4}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar plantilla..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex border border-border rounded-lg overflow-hidden">
              <Button 
                variant={viewMode === 'grid' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
            <Button variant="party">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Plantilla
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card variant="glass" className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Plantillas</p>
                <p className="text-2xl font-bold">{templates.length}</p>
              </div>
            </div>
          </Card>
          <Card variant="glass" className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/20">
                <Star className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Vendedores Únicos</p>
                <p className="text-2xl font-bold">
                  {new Set(templates.flatMap(t => t.roster.map(r => r.sellerId))).size}
                </p>
              </div>
            </div>
          </Card>
          <Card variant="glass" className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/20">
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Usos Totales</p>
                <p className="text-2xl font-bold">
                  {templates.reduce((sum, t) => sum + t.usageCount, 0)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Templates Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card variant="glass" className="p-5 hover:border-primary/30 transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{template.name}</h3>
                        {template.isDefault && (
                          <Star className="w-4 h-4 text-warning fill-warning" />
                        )}
                      </div>
                      {template.description && (
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                      )}
                    </div>
                    <Badge variant="secondary">{template.formation.cabezas}-{template.formation.promotores}</Badge>
                  </div>

                  {/* Roster Preview */}
                  <div className="flex items-center gap-1 mb-4">
                    {template.roster.slice(0, 5).map((seller) => (
                      <div
                        key={seller.sellerId}
                        className="w-8 h-8 rounded-full bg-gradient-party flex items-center justify-center text-white text-xs font-bold"
                        title={seller.name}
                      >
                        {seller.avatar}
                      </div>
                    ))}
                    {template.roster.length > 5 && (
                      <div className="w-8 h-8 rounded-full bg-card-elevated flex items-center justify-center text-xs font-medium">
                        +{template.roster.length - 5}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <span>Usada {template.usageCount} veces</span>
                    <span>Última: {template.lastUsed || 'Nunca'}</span>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handlePreview(template)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Ver
                    </Button>
                    <Button 
                      variant="party" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleEdit(template)}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Editar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDuplicate(template)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    {!template.isDefault && (
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDelete(template.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card variant="glass" className="overflow-hidden">
            <div className="divide-y divide-border">
              {filteredTemplates.map((template) => (
                <div key={template.id} className="p-4 hover:bg-card-elevated transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-2">
                        {template.roster.slice(0, 3).map((seller) => (
                          <div
                            key={seller.sellerId}
                            className="w-8 h-8 rounded-full bg-gradient-party flex items-center justify-center text-white text-xs font-bold ring-2 ring-card"
                          >
                            {seller.avatar}
                          </div>
                        ))}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{template.name}</h4>
                          {template.isDefault && (
                            <Badge variant="secondary" className="text-xs">Predeterminada</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {template.roster.length} vendedores • Formación {template.formation.cabezas}-{template.formation.promotores}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handlePreview(template)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="party" size="sm" className="gap-1" onClick={() => handleEdit(template)}>
                        <Edit className="w-4 h-4" />
                        Editar
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDuplicate(template)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleSetDefault(template.id)}>
                        <Star className={`w-4 h-4 ${template.isDefault ? 'fill-warning text-warning' : ''}`} />
                      </Button>
                      {!template.isDefault && (
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(template.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Template Preview Modal */}
      <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedTemplate?.name}
              {selectedTemplate?.isDefault && <Star className="w-4 h-4 text-warning fill-warning" />}
            </DialogTitle>
            <DialogDescription>{selectedTemplate?.description}</DialogDescription>
          </DialogHeader>
          
          {selectedTemplate && (
            <div className="space-y-6 mt-4">
              {/* Cabezas */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-neon-purple" />
                  CABEZAS ({selectedTemplate.roster.filter(s => s.position === 'cabeza').length})
                </h4>
                <div className="grid grid-cols-4 gap-3">
                  {selectedTemplate.roster.filter(s => s.position === 'cabeza').map((seller) => (
                    <Card key={seller.sellerId} className="p-3 text-center bg-neon-purple/10 border-neon-purple/30">
                      <div className="w-12 h-12 mx-auto rounded-full bg-gradient-party flex items-center justify-center text-white font-bold mb-2">
                        {seller.avatar}
                      </div>
                      <p className="font-medium text-sm">{seller.name}</p>
                      <p className="text-xs text-muted-foreground">{seller.stats.avgPerEvent}/evento</p>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Promotores */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-neon-blue" />
                  PROMOTORES ({selectedTemplate.roster.filter(s => s.position === 'promotor').length})
                </h4>
                <div className="grid grid-cols-5 gap-2">
                  {selectedTemplate.roster.filter(s => s.position === 'promotor').map((seller) => (
                    <Card key={seller.sellerId} className="p-2 text-center bg-neon-blue/10 border-neon-blue/30">
                      <div className="w-10 h-10 mx-auto rounded-full bg-gradient-party flex items-center justify-center text-white text-sm font-bold mb-1">
                        {seller.avatar}
                      </div>
                      <p className="font-medium text-xs truncate">{seller.name}</p>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{selectedTemplate.roster.length}</p>
                  <p className="text-xs text-muted-foreground">Vendedores</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-success">
                    {selectedTemplate.roster.reduce((sum, s) => sum + s.stats.avgPerEvent, 0)}
                  </p>
                  <p className="text-xs text-muted-foreground">Ventas Proyectadas</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-warning">{selectedTemplate.usageCount}</p>
                  <p className="text-xs text-muted-foreground">Veces Usada</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Template Editor Modal */}
      <TemplateEditorModal
        open={showEditorModal}
        onOpenChange={setShowEditorModal}
        template={editingTemplate}
        onSave={handleSaveTemplate}
      />
    </DashboardLayout>
  );
}
