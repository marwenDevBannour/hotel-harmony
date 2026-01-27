import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, GripVertical, Settings2, Type, Hash, Mail, Calendar, List, AlignLeft, ToggleLeft, CheckSquare, Sparkles } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { ColumnConfig, FieldConfig, ComponentConfig } from '@/types/componentConfig';
import { FieldOptionsModal } from './FieldOptionsModal';

interface ConfigEditorProps {
  componentType: 'form' | 'table' | 'list' | 'dashboard' | 'settings';
  config: ComponentConfig;
  onChange: (config: ComponentConfig) => void;
}

const columnTypes = [
  { value: 'text', label: 'Texte' },
  { value: 'number', label: 'Nombre' },
  { value: 'date', label: 'Date' },
  { value: 'badge', label: 'Badge' },
  { value: 'boolean', label: 'Booléen' },
];

const fieldTypes = [
  { value: 'text', label: 'Texte', icon: 'Type', description: 'Champ texte simple' },
  { value: 'number', label: 'Nombre', icon: 'Hash', description: 'Valeur numérique' },
  { value: 'email', label: 'Email', icon: 'Mail', description: 'Adresse email' },
  { value: 'date', label: 'Date', icon: 'Calendar', description: 'Sélecteur de date' },
  { value: 'select', label: 'Liste déroulante', icon: 'List', description: 'Choix parmi options' },
  { value: 'textarea', label: 'Zone de texte', icon: 'AlignLeft', description: 'Texte multiligne' },
  { value: 'switch', label: 'Interrupteur', icon: 'ToggleLeft', description: 'Oui/Non' },
  { value: 'checkbox', label: 'Case à cocher', icon: 'CheckSquare', description: 'Cocher/Décocher' },
];

const fieldTypeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  text: Type,
  number: Hash,
  email: Mail,
  date: Calendar,
  select: List,
  textarea: AlignLeft,
  switch: ToggleLeft,
  checkbox: CheckSquare,
};

export function ConfigEditor({ componentType, config, onChange }: ConfigEditorProps) {
  const [editingFieldIndex, setEditingFieldIndex] = useState<number | null>(null);
  const [fieldOptionsOpen, setFieldOptionsOpen] = useState(false);

  const isTableOrList = componentType === 'table' || componentType === 'list';
  const isForm = componentType === 'form';

  const handleAddColumn = () => {
    const newColumn: ColumnConfig = {
      key: `col_${Date.now()}`,
      label: 'Nouvelle colonne',
      type: 'text',
      sortable: true,
      filterable: false,
    };
    onChange({
      ...config,
      columns: [...(config.columns || []), newColumn],
    });
  };

  const handleUpdateColumn = (index: number, updates: Partial<ColumnConfig>) => {
    const columns = [...(config.columns || [])];
    columns[index] = { ...columns[index], ...updates };
    onChange({ ...config, columns });
  };

  const handleRemoveColumn = (index: number) => {
    const columns = [...(config.columns || [])];
    columns.splice(index, 1);
    onChange({ ...config, columns });
  };

  const handleAddField = (fieldType: string = 'text') => {
    const fieldTypeInfo = fieldTypes.find(t => t.value === fieldType);
    const newField: FieldConfig = {
      key: `field_${Date.now()}`,
      label: fieldTypeInfo?.label || 'Nouveau champ',
      type: fieldType as FieldConfig['type'],
      required: false,
    };
    onChange({
      ...config,
      fields: [...(config.fields || []), newField],
    });
  };

  const handleUpdateField = (index: number, updates: Partial<FieldConfig>) => {
    const fields = [...(config.fields || [])];
    fields[index] = { ...fields[index], ...updates };
    onChange({ ...config, fields });
  };

  const handleRemoveField = (index: number) => {
    const fields = [...(config.fields || [])];
    fields.splice(index, 1);
    onChange({ ...config, fields });
  };

  const handleOpenFieldOptions = (index: number) => {
    setEditingFieldIndex(index);
    setFieldOptionsOpen(true);
  };

  const handleSaveFieldOptions = (updatedField: FieldConfig) => {
    if (editingFieldIndex !== null) {
      handleUpdateField(editingFieldIndex, updatedField);
    }
    setEditingFieldIndex(null);
  };

  const editingField = editingFieldIndex !== null ? (config.fields || [])[editingFieldIndex] : null;

  if (componentType === 'dashboard' || componentType === 'settings') {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground text-center py-4">
            La configuration pour ce type de composant n'est pas encore disponible.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* General settings */}
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm">Paramètres généraux</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Titre</Label>
              <Input
                value={config.title || ''}
                onChange={(e) => onChange({ ...config, title: e.target.value })}
                placeholder="Titre du composant"
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Éléments par page</Label>
              <Input
                type="number"
                value={config.pageSize || 10}
                onChange={(e) => onChange({ ...config, pageSize: parseInt(e.target.value) || 10 })}
                min={5}
                max={100}
                className="h-8 text-sm"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Description</Label>
            <Input
              value={config.description || ''}
              onChange={(e) => onChange({ ...config, description: e.target.value })}
              placeholder="Description optionnelle"
              className="h-8 text-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions settings */}
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm">Actions disponibles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {['create', 'edit', 'delete', 'view', 'export'].map((action) => (
              <div key={action} className="flex items-center gap-2">
                <Switch
                  id={`action-${action}`}
                  checked={config.actions?.[action as keyof typeof config.actions] ?? true}
                  onCheckedChange={(checked) =>
                    onChange({
                      ...config,
                      actions: { ...config.actions, [action]: checked },
                    })
                  }
                />
                <Label htmlFor={`action-${action}`} className="text-xs capitalize">
                  {action === 'create' ? 'Créer' :
                   action === 'edit' ? 'Modifier' :
                   action === 'delete' ? 'Supprimer' :
                   action === 'view' ? 'Voir' : 'Exporter'}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Columns for table/list */}
      {isTableOrList && (
        <Card>
          <CardHeader className="py-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Colonnes</CardTitle>
            <Button size="sm" variant="outline" onClick={handleAddColumn} className="h-7 text-xs">
              <Plus className="h-3 w-3 mr-1" />
              Ajouter
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {(config.columns || []).length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">
                Aucune colonne configurée. Cliquez sur "Ajouter" pour commencer.
              </p>
            ) : (
              (config.columns || []).map((column, index) => (
                <div
                  key={column.key}
                  className="flex items-center gap-2 p-2 border rounded-md bg-muted/30"
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                  <Input
                    value={column.key}
                    onChange={(e) => handleUpdateColumn(index, { key: e.target.value })}
                    placeholder="Clé"
                    className="h-7 text-xs w-24"
                  />
                  <Input
                    value={column.label}
                    onChange={(e) => handleUpdateColumn(index, { label: e.target.value })}
                    placeholder="Libellé"
                    className="h-7 text-xs flex-1"
                  />
                  <Select
                    value={column.type}
                    onValueChange={(value) => handleUpdateColumn(index, { type: value as ColumnConfig['type'] })}
                  >
                    <SelectTrigger className="h-7 text-xs w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {columnTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value} className="text-xs">
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-1">
                    <Switch
                      checked={column.sortable}
                      onCheckedChange={(checked) => handleUpdateColumn(index, { sortable: checked })}
                    />
                    <span className="text-xs text-muted-foreground">Tri</span>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={() => handleRemoveColumn(index)}
                  >
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}

      {/* Fields for form */}
      {isForm && (
        <Card>
          <CardHeader className="py-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Champs du formulaire</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline" className="h-7 text-xs">
                  <Plus className="h-3 w-3 mr-1" />
                  Ajouter un champ
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex items-center gap-2 text-xs">
                  <Sparkles className="h-3 w-3" />
                  Type de champ
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {fieldTypes.map((type) => {
                  const Icon = fieldTypeIcons[type.value] || Type;
                  return (
                    <DropdownMenuItem
                      key={type.value}
                      onClick={() => handleAddField(type.value)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <div className="flex flex-col">
                        <span className="text-sm">{type.label}</span>
                        <span className="text-xs text-muted-foreground">{type.description}</span>
                      </div>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent className="space-y-2">
            {(config.fields || []).length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">
                Aucun champ configuré. Cliquez sur "Ajouter" pour commencer.
              </p>
            ) : (
              (config.fields || []).map((field, index) => {
                const FieldIcon = fieldTypeIcons[field.type] || Type;
                return (
                  <div
                    key={field.key}
                    className="flex items-center gap-2 p-2 border rounded-md bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-move flex-shrink-0" />
                    <div className="flex items-center justify-center w-7 h-7 rounded bg-primary/10 flex-shrink-0">
                      <FieldIcon className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <Input
                      value={field.key}
                      onChange={(e) => handleUpdateField(index, { key: e.target.value })}
                      placeholder="Clé"
                      className="h-7 text-xs w-20"
                    />
                    <Input
                      value={field.label}
                      onChange={(e) => handleUpdateField(index, { label: e.target.value })}
                      placeholder="Libellé"
                      className="h-7 text-xs flex-1"
                    />
                    <Select
                      value={field.type}
                      onValueChange={(value) => handleUpdateField(index, { type: value as FieldConfig['type'] })}
                    >
                      <SelectTrigger className="h-7 text-xs w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fieldTypes.map((type) => {
                          const TypeIcon = fieldTypeIcons[type.value] || Type;
                          return (
                            <SelectItem key={type.value} value={type.value} className="text-xs">
                              <div className="flex items-center gap-2">
                                <TypeIcon className="h-3 w-3" />
                                {type.label}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Switch
                        checked={field.required}
                        onCheckedChange={(checked) => handleUpdateField(index, { required: checked })}
                      />
                      <span className="text-xs text-muted-foreground">Requis</span>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 flex-shrink-0"
                      onClick={() => handleOpenFieldOptions(index)}
                      title="Configurer les options avancées"
                    >
                      <Settings2 className="h-3 w-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 flex-shrink-0 hover:bg-destructive/10"
                      onClick={() => handleRemoveField(index)}
                      title="Supprimer ce champ"
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      )}

      {/* Field Options Modal */}
      <FieldOptionsModal
        open={fieldOptionsOpen}
        onOpenChange={setFieldOptionsOpen}
        field={editingField}
        onSave={handleSaveFieldOptions}
      />
    </div>
  );
}
