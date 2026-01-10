import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Evnmt, EvnmtInput, SousModule } from '@/services/api';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

const evnmtSchema = z.object({
  codeEvnmt: z.string().min(1, 'Le code est requis').max(20, 'Max 20 caractères'),
  libelle: z.string().min(1, 'Le libellé est requis').max(100, 'Max 100 caractères'),
  ddeb: z.string().min(1, 'Date de début requise'),
  dfin: z.string().min(1, 'Date de fin requise'),
  bactif: z.boolean(),
  sousModuleId: z.string().min(1, 'Sous-module requis'),
});

type EvnmtFormData = z.infer<typeof evnmtSchema>;

interface EvnmtFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  evnmt: Evnmt | null;
  sousModules: SousModule[];
  onSubmit: (data: EvnmtInput) => void;
  isLoading: boolean;
  preselectedSousModuleId?: number;
}

export function EvnmtFormModal({
  open,
  onOpenChange,
  evnmt,
  sousModules,
  onSubmit,
  isLoading,
  preselectedSousModuleId,
}: EvnmtFormModalProps) {
  const form = useForm<EvnmtFormData>({
    resolver: zodResolver(evnmtSchema),
    defaultValues: {
      codeEvnmt: '',
      libelle: '',
      ddeb: new Date().toISOString().split('T')[0],
      dfin: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      bactif: true,
      sousModuleId: '',
    },
  });

  useEffect(() => {
    if (evnmt) {
      form.reset({
        codeEvnmt: evnmt.codeEvnmt,
        libelle: evnmt.libelle,
        ddeb: evnmt.ddeb?.split('T')[0] || '',
        dfin: evnmt.dfin?.split('T')[0] || '',
        bactif: evnmt.bactif,
        sousModuleId: evnmt.sousModule?.id?.toString() || '',
      });
    } else {
      form.reset({
        codeEvnmt: '',
        libelle: '',
        ddeb: new Date().toISOString().split('T')[0],
        dfin: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        bactif: true,
        sousModuleId: preselectedSousModuleId?.toString() || '',
      });
    }
  }, [evnmt, preselectedSousModuleId, form]);

  const handleSubmit = (data: EvnmtFormData) => {
    const input: EvnmtInput = {
      codeEvnmt: data.codeEvnmt,
      libelle: data.libelle,
      ddeb: data.ddeb,
      dfin: data.dfin,
      bactif: data.bactif,
      sousModuleId: parseInt(data.sousModuleId, 10),
    };
    onSubmit(input);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {evnmt ? 'Modifier l\'événement' : 'Nouvel événement'}
          </DialogTitle>
          <DialogDescription>
            {evnmt
              ? 'Modifiez les informations de l\'événement'
              : 'Créez un nouvel événement pour le sous-module sélectionné'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="sousModuleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sous-module parent</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un sous-module" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sousModules.map((sm) => (
                        <SelectItem key={sm.id} value={sm.id.toString()}>
                          {sm.libelle} ({sm.codeS})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Enregistrement...' : evnmt ? 'Modifier' : 'Créer'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
