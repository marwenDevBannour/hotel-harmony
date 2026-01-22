import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateRoom, useUpdateRoom, Room } from '@/hooks/useRooms';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const roomSchema = z.object({
  number: z.string().min(1, 'Numéro requis'),
  type: z.string().min(1, 'Type requis'),
  capacity: z.coerce.number().min(1, 'Capacité requise'),
  price: z.coerce.number().min(0, 'Prix invalide'),
});

type RoomFormValues = z.infer<typeof roomSchema>;

const typeOptions = [
  { value: 'standard', label: 'Standard' },
  { value: 'superior', label: 'Supérieure' },
  { value: 'deluxe', label: 'Deluxe' },
  { value: 'suite', label: 'Suite' },
  { value: 'presidential', label: 'Présidentielle' },
];

interface RoomFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room?: Room | null;
}

export function RoomFormModal({ open, onOpenChange, room }: RoomFormModalProps) {
  const createMutation = useCreateRoom();
  const updateMutation = useUpdateRoom();
  const isEditing = !!room;

  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      number: '',
      type: 'standard',
      capacity: 2,
      price: 100,
    },
  });

  useEffect(() => {
    if (room) {
      form.reset({
        number: room.number,
        type: room.type,
        capacity: room.capacity,
        price: room.price,
      });
    } else {
      form.reset({
        number: '',
        type: 'standard',
        capacity: 2,
        price: 100,
      });
    }
  }, [room, form]);

  const onSubmit = (values: RoomFormValues) => {
    if (isEditing) {
      updateMutation.mutate(
        { id: room!.id, ...values },
        {
          onSuccess: () => {
            toast.success('Chambre modifiée avec succès');
            onOpenChange(false);
          },
          onError: () => {
            toast.error('Erreur lors de la modification');
          },
        }
      );
    } else {
      createMutation.mutate(values, {
        onSuccess: () => {
          toast.success('Chambre créée avec succès');
          onOpenChange(false);
        },
        onError: () => {
          toast.error('Erreur lors de la création');
        },
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Modifier la Chambre' : 'Nouvelle Chambre'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numéro</FormLabel>
                  <FormControl>
                    <Input placeholder="101" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {typeOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacité</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix / nuit (€)</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} step={0.01} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
