import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { restaurantTablesApi } from '@/services/api';
import { toast } from 'sonner';
import { RestaurantTable, TableStatus, TableLocation } from '@/hooks/useRestaurant';

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

const tableSchema = z.object({
  number: z.string().min(1, 'Numéro requis'),
  capacity: z.coerce.number().min(1, 'Capacité minimale: 1'),
  location: z.enum(['intérieur', 'terrasse', 'privé']),
  status: z.enum(['available', 'occupied', 'reserved', 'cleaning']),
});

type TableFormData = z.infer<typeof tableSchema>;

interface TableFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  table?: RestaurantTable | null;
}

const TableFormModal = ({ open, onOpenChange, table }: TableFormModalProps) => {
  const queryClient = useQueryClient();
  const isEditing = !!table;

  const form = useForm<TableFormData>({
    resolver: zodResolver(tableSchema),
    defaultValues: {
      number: table?.number || '',
      capacity: table?.capacity || 4,
      location: table?.location || 'intérieur',
      status: table?.status || 'available',
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: TableFormData) => {
      if (isEditing) {
        return restaurantTablesApi.update(table.id, {
          number: data.number,
          capacity: data.capacity,
          location: data.location,
          status: data.status,
        });
      } else {
        return restaurantTablesApi.create({
          number: data.number,
          capacity: data.capacity,
          location: data.location,
          status: data.status,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-tables'] });
      queryClient.invalidateQueries({ queryKey: ['restaurant-stats'] });
      toast.success(isEditing ? 'Table modifiée' : 'Table créée');
      onOpenChange(false);
      form.reset();
    },
    onError: () => {
      toast.error('Erreur lors de l\'enregistrement');
    },
  });

  const onSubmit = (data: TableFormData) => {
    mutation.mutate(data);
  };

  const statusOptions = [
    { value: 'available', label: 'Disponible' },
    { value: 'occupied', label: 'Occupée' },
    { value: 'reserved', label: 'Réservée' },
    { value: 'cleaning', label: 'Nettoyage' },
  ];

  const locationOptions = [
    { value: 'intérieur', label: 'Intérieur' },
    { value: 'terrasse', label: 'Terrasse' },
    { value: 'privé', label: 'Salon Privé' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Modifier la Table' : 'Nouvelle Table'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numéro *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: T1, 01..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacité (personnes) *</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Emplacement</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {locationOptions.map((opt) => (
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

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statut</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statusOptions.map((opt) => (
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

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit" variant="gold" disabled={mutation.isPending}>
                {mutation.isPending ? 'Enregistrement...' : isEditing ? 'Modifier' : 'Créer'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TableFormModal;
