import { ComponentConfig, ColumnConfig, FieldConfig } from '@/types/componentConfig';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileText, Table as TableIcon, List, LayoutDashboard, Settings, Plus, Search } from 'lucide-react';

interface ComponentTypePreviewProps {
  componentType: 'form' | 'table' | 'list' | 'dashboard' | 'settings';
  config: ComponentConfig;
}

// Generate demo data based on columns
const generateDemoRow = (columns: ColumnConfig[], index: number) => {
  const row: Record<string, any> = { id: index + 1 };
  columns.forEach((col) => {
    switch (col.type) {
      case 'text':
        row[col.key] = `${col.label} ${index + 1}`;
        break;
      case 'number':
        row[col.key] = Math.floor(Math.random() * 1000);
        break;
      case 'date':
        row[col.key] = new Date().toLocaleDateString('fr-FR');
        break;
      case 'badge':
        row[col.key] = ['Actif', 'Inactif', 'En attente'][index % 3];
        break;
      case 'boolean':
        row[col.key] = index % 2 === 0;
        break;
      default:
        row[col.key] = `Valeur ${index + 1}`;
    }
  });
  return row;
};

export function ComponentTypePreview({ componentType, config }: ComponentTypePreviewProps) {
  const title = config.title || 'Aperçu du composant';
  const description = config.description || '';

  // Form preview
  if (componentType === 'form') {
    const fields = config.fields || [];
    
    return (
      <Card className="border-dashed">
        <CardHeader className="py-3">
          <CardTitle className="text-sm">{title}</CardTitle>
          {description && <CardDescription className="text-xs">{description}</CardDescription>}
        </CardHeader>
        <CardContent className="space-y-3">
          {fields.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs">Ajoutez des champs pour voir l'aperçu</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {fields.map((field) => (
                <div key={field.key} className="space-y-1">
                  <Label className="text-xs">
                    {field.label}
                    {field.required && <span className="text-destructive ml-1">*</span>}
                  </Label>
                  {field.type === 'textarea' ? (
                    <Textarea placeholder={field.placeholder} className="h-16 text-xs" disabled />
                  ) : field.type === 'select' ? (
                    <Select disabled>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder={field.placeholder || 'Sélectionner...'} />
                      </SelectTrigger>
                    </Select>
                  ) : field.type === 'switch' ? (
                    <div className="pt-1">
                      <Switch disabled />
                    </div>
                  ) : field.type === 'checkbox' ? (
                    <div className="flex items-center gap-2 pt-1">
                      <Checkbox disabled />
                      <span className="text-xs text-muted-foreground">Option</span>
                    </div>
                  ) : (
                    <Input
                      type={field.type === 'email' ? 'email' : field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                      placeholder={field.placeholder}
                      className="h-8 text-xs"
                      disabled
                    />
                  )}
                </div>
              ))}
            </div>
          )}
          {fields.length > 0 && (
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" className="h-7 text-xs" disabled>
                Annuler
              </Button>
              <Button size="sm" className="h-7 text-xs" disabled>
                Enregistrer
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Table preview
  if (componentType === 'table') {
    const columns = config.columns || [];
    const demoData = columns.length > 0 ? [0, 1, 2].map((i) => generateDemoRow(columns, i)) : [];

    return (
      <Card className="border-dashed">
        <CardHeader className="py-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm">{title}</CardTitle>
            {description && <CardDescription className="text-xs">{description}</CardDescription>}
          </div>
          {config.actions?.create && (
            <Button size="sm" className="h-7 text-xs" disabled>
              <Plus className="h-3 w-3 mr-1" />
              Ajouter
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input placeholder="Rechercher..." className="h-8 text-xs" disabled />
          </div>
          {columns.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <TableIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs">Ajoutez des colonnes pour voir l'aperçu</p>
            </div>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.map((col) => (
                      <TableHead key={col.key} className="text-xs h-8">
                        {col.label}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {demoData.map((row, i) => (
                    <TableRow key={i}>
                      {columns.map((col) => (
                        <TableCell key={col.key} className="text-xs py-2">
                          {col.type === 'badge' ? (
                            <Badge variant="secondary" className="text-xs">
                              {row[col.key]}
                            </Badge>
                          ) : col.type === 'boolean' ? (
                            row[col.key] ? '✓' : '✗'
                          ) : (
                            row[col.key]
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // List preview
  if (componentType === 'list') {
    const columns = config.columns || [];
    const demoData = columns.length > 0 ? [0, 1, 2].map((i) => generateDemoRow(columns, i)) : [];

    return (
      <Card className="border-dashed">
        <CardHeader className="py-3">
          <CardTitle className="text-sm">{title}</CardTitle>
          {description && <CardDescription className="text-xs">{description}</CardDescription>}
        </CardHeader>
        <CardContent className="space-y-2">
          {columns.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <List className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs">Ajoutez des colonnes pour voir l'aperçu</p>
            </div>
          ) : (
            demoData.map((row, i) => (
              <div key={i} className="p-2 border rounded-md bg-muted/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">{row[columns[0]?.key] || `Élément ${i + 1}`}</span>
                  {columns.find((c) => c.type === 'badge') && (
                    <Badge variant="secondary" className="text-xs">
                      {row[columns.find((c) => c.type === 'badge')!.key]}
                    </Badge>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    );
  }

  // Dashboard preview
  if (componentType === 'dashboard') {
    return (
      <Card className="border-dashed">
        <CardHeader className="py-3">
          <CardTitle className="text-sm">{title}</CardTitle>
          {description && <CardDescription className="text-xs">{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <LayoutDashboard className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">Aperçu Dashboard (configuration à venir)</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Settings preview
  return (
    <Card className="border-dashed">
      <CardHeader className="py-3">
        <CardTitle className="text-sm">{title}</CardTitle>
        {description && <CardDescription className="text-xs">{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-xs">Aperçu Paramètres (configuration à venir)</p>
        </div>
      </CardContent>
    </Card>
  );
}
