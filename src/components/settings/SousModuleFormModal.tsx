import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Module, SousModule } from '@/hooks/useModulesCrud';
import { SousModuleInput } from '@/services/api';
import {
  Dialog,
  DialogContent,
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
import { Button } from '@/components/ui/button';

const sousModuleSchema = z.object({
  codeS: z.string().min(1, 'Le code est requis').max(20, 'Le code ne peut pas dépasser 20 caractères'),
  libelle: z.string().min(1, 'Le libellé est requis').max(100, 'Le libellé ne peut pas dépasser 100 caractères'),
  ddeb: z.string().min(1, 'La date de début est requise'),
  dfin: z.string().min(1, 'La date de fin est requise'),
});

type SousModuleFormData = z.infer<typeof sousModuleSchema>;

interface SousModuleFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sousModule?: SousModule | null;
  selectedModule: Module | null;
  onSubmit: (data: SousModuleInput) => void;
  isLoading?: boolean;
}

export function SousModuleFormModal({
  open,
  onOpenChange,
  sousModule,
  selectedModule,
  onSubmit,
  isLoading,
}: SousModuleFormModalProps) {
  const isEditing = !!sousModule;

  const form = useForm<SousModuleFormData>({
    resolver: zodResolver(sousModuleSchema),
    defaultValues: {
      codeS: '',
      libelle: '',
      ddeb: new Date().toISOString().split('T')[0],
      dfin: '2099-12-31',
    },
  });

  useEffect(() => {
    if (sousModule) {
      form.reset({
        codeS: sousModule.codeS,
        libelle: sousModule.libelle,
        ddeb: sousModule.ddeb?.split('T')[0] || new Date().toISOString().split('T')[0],
        dfin: sousModule.dfin?.split('T')[0] || '2099-12-31',
      });
    } else {
      form.reset({
        codeS: '',
        libelle: '',
        ddeb: new Date().toISOString().split('T')[0],
        dfin: '2099-12-31',
      });
    }
  }, [sousModule, form]);

  const handleSubmit = (data: SousModuleFormData) => {
    if (!selectedModule) return;
    onSubmit({
      codeS: data.codeS,
      libelle: data.libelle,
      ddeb: data.ddeb,
      dfin: data.dfin,
      moduleId: selectedModule.id as number, // Type cast for API compatibility
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Modifier le sous-module' : 'Nouveau sous-module'}
          </DialogTitle>
          {selectedModule && (
            <p className="text-sm text-muted-foreground">
              Module parent: <span className="font-medium">{selectedModule.libelle}</span>
            </p>
          )}
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="codeS"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input placeholder="RESERVATION_LIST" {...field} />
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
                    <Input placeholder="Liste des réservations" {...field} />
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
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Enregistrement...' : isEditing ? 'Modifier' : 'Créer'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
