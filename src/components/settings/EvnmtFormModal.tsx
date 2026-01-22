import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Evnmt, SousModule } from '@/hooks/useModulesCrud';
import { EvnmtInput } from '@/services/api';
import { ComponentConfig } from '@/types/componentConfig';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Table, List, LayoutDashboard, Settings, Eye } from 'lucide-react';
import { ConfigEditor } from './ConfigEditor';
import { ComponentTypePreview } from './ComponentTypePreview';

const componentTypeOptions = [
  { value: 'form', label: 'Formulaire', icon: FileText, description: 'Saisie de données' },
  { value: 'table', label: 'Tableau', icon: Table, description: 'Affichage tabulaire' },
  { value: 'list', label: 'Liste', icon: List, description: 'Liste d\'éléments' },
  { value: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Tableau de bord' },
  { value: 'settings', label: 'Paramètres', icon: Settings, description: 'Configuration' },
] as const;

const evnmtSchema = z.object({
  codeEvnmt: z.string().min(1, 'Le code est requis').max(20, 'Max 20 caractères'),
  libelle: z.string().min(1, 'Le libellé est requis').max(100, 'Max 100 caractères'),
  ddeb: z.string().min(1, 'Date de début requise'),
  dfin: z.string().min(1, 'Date de fin requise'),
  bactif: z.boolean(),
  componentType: z.enum(['form', 'table', 'list', 'dashboard', 'settings']),
});

type EvnmtFormData = z.infer<typeof evnmtSchema>;

interface EvnmtFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  evnmt: Evnmt | null;
  selectedSousModule: SousModule | null;
  onSubmit: (data: EvnmtInput & { componentType?: string; config?: ComponentConfig }) => void;
  isLoading: boolean;
}

export function EvnmtFormModal({
  open,
  onOpenChange,
  evnmt,
  selectedSousModule,
  onSubmit,
  isLoading,
}: EvnmtFormModalProps) {
  const [activeTab, setActiveTab] = useState('general');
  const [config, setConfig] = useState<ComponentConfig>({});

  const form = useForm<EvnmtFormData>({
    resolver: zodResolver(evnmtSchema),
    defaultValues: {
      codeEvnmt: '',
      libelle: '',
      ddeb: new Date().toISOString().split('T')[0],
      dfin: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      bactif: true,
      componentType: 'form',
    },
  });

  const componentType = form.watch('componentType');

  useEffect(() => {
    if (evnmt) {
      form.reset({
        codeEvnmt: evnmt.codeEvnmt,
        libelle: evnmt.libelle,
        ddeb: evnmt.ddeb?.split('T')[0] || '',
        dfin: evnmt.dfin?.split('T')[0] || '',
        bactif: evnmt.bactif,
        componentType: evnmt.componentType || 'form',
      });
      setConfig((evnmt as any).config || {});
    } else {
      form.reset({
        codeEvnmt: '',
        libelle: '',
        ddeb: new Date().toISOString().split('T')[0],
        dfin: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        bactif: true,
        componentType: 'form',
      });
      setConfig({});
    }
    setActiveTab('general');
  }, [evnmt, form, open]);

  const handleSubmit = (data: EvnmtFormData) => {
    if (!selectedSousModule) return;
    const input: EvnmtInput & { componentType?: string; config?: ComponentConfig } = {
      codeEvnmt: data.codeEvnmt,
      libelle: data.libelle,
      ddeb: data.ddeb,
      dfin: data.dfin,
      bactif: data.bactif,
      sousModuleId: selectedSousModule.id as number,
      componentType: data.componentType,
      config,
    };
    onSubmit(input);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {evnmt ? 'Modifier l\'événement' : 'Nouvel événement'}
          </DialogTitle>
          <DialogDescription>
            {selectedSousModule ? (
              <>Sous-module parent: <span className="font-medium">{selectedSousModule.libelle}</span></>
            ) : (
              evnmt
                ? 'Modifiez les informations de l\'événement'
                : 'Créez un nouvel événement pour le sous-module sélectionné'
            )}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="config">Configuration</TabsTrigger>
            <TabsTrigger value="preview">
              <Eye className="h-4 w-4 mr-1" />
              Aperçu
            </TabsTrigger>
          </TabsList>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="flex-1 overflow-hidden flex flex-col">
              <div className="flex-1 overflow-y-auto py-4">
                <TabsContent value="general" className="mt-0 space-y-4">
                  <FormField
                    control={form.control}
                    name="codeEvnmt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Code événement</FormLabel>
                        <FormControl>
                          <Input placeholder="EVT_001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="libelle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Libellé</FormLabel>
                        <FormControl>
                          <Input placeholder="Nom de l'événement" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="componentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type de composant</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {componentTypeOptions.map((option) => {
                              const Icon = option.icon;
                              return (
                                <SelectItem key={option.value} value={option.value}>
                                  <div className="flex items-center gap-2">
                                    <Icon className="h-4 w-4 text-muted-foreground" />
                                    <span>{option.label}</span>
                                    <span className="text-xs text-muted-foreground">
                                      - {option.description}
                                    </span>
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="ddeb"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date début</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dfin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date fin</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="bactif"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Actif</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            L'événement sera visible et actif
                          </p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="config" className="mt-0">
                  <ConfigEditor
                    componentType={componentType}
                    config={config}
                    onChange={setConfig}
                  />
                </TabsContent>

                <TabsContent value="preview" className="mt-0">
                  <ComponentTypePreview
                    componentType={componentType}
                    config={config}
                  />
                </TabsContent>
              </div>

              <DialogFooter className="pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Annuler
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Enregistrement...' : evnmt ? 'Modifier' : 'Créer'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
