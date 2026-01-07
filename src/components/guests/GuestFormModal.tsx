import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { guestsApi, Guest, GuestInput } from '@/services/api';
import { toast } from 'sonner';
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

const guestSchema = z.object({
  name: z.string().min(1, 'Nom requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().min(1, 'Téléphone requis'),
});

type GuestFormValues = z.infer<typeof guestSchema>;

interface GuestFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guest?: Guest | null;
}

export function GuestFormModal({ open, onOpenChange, guest }: GuestFormModalProps) {
  const queryClient = useQueryClient();
  const isEditing = !!guest;

  const form = useForm<GuestFormValues>({
    resolver: zodResolver(guestSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
  });

  useEffect(() => {
    if (guest) {
      form.reset({
        name: guest.name,
        email: guest.email,
        phone: guest.phone,
      });
    } else {
      form.reset({
        name: '',
        email: '',
        phone: '',
      });
    }
  }, [guest, form]);

  const createMutation = useMutation({
    mutationFn: (values: GuestFormValues) => guestsApi.create(values as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      toast.success('Client créé avec succès');
      onOpenChange(false);
    },
    onError: () => {
      toast.error('Erreur lors de la création');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (values: GuestFormValues) => guestsApi.update(guest!.id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      toast.success('Client modifié avec succès');
      onOpenChange(false);
    },
    onError: () => {
      toast.error('Erreur lors de la modification');
    },
  });

  const onSubmit = (values: GuestFormValues) => {
    if (isEditing) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Modifier le Client' : 'Nouveau Client'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom complet</FormLabel>
                  <FormControl>
                    <Input placeholder="Jean Dupont" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="jean@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone</FormLabel>
                  <FormControl>
                    <Input placeholder="+33 6 12 34 56 78" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit" variant="gold" disabled={isPending}>
                {isPending ? 'Enregistrement...' : isEditing ? 'Modifier' : 'Créer'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
