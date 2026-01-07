import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  useCreateTable, 
  useUpdateTable, 
  RestaurantTable, 
  TableStatus, 
  TableLocation 
} from '@/hooks/useRestaurant';
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

const tableSchema = z.object({
  number: z.string().min(1, 'Numéro requis'),
  capacity: z.coerce.number().min(1, 'Capacité minimale: 1'),
  location: z.enum(['intérieur', 'terrasse', 'privé'] as const),
  status: z.enum(['available', 'occupied', 'reserved', 'cleaning'] as const),
});

type TableFormData = z.infer<typeof tableSchema>;

interface TableFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  table?: RestaurantTable | null;
}

const TableFormModal = ({ open, onOpenChange, table }: TableFormModalProps) => {
  const createTable = useCreateTable();
  const updateTable = useUpdateTable();
  const isEditing = !!table;

  const form = useForm<TableFormData>({
    resolver: zodResolver(tableSchema),
    defaultValues: {
      number: '',
      capacity: 4,
      location: 'intérieur',
      status: 'available',
    },
  });

  useEffect(() => {
    if (table) {
      form.reset({
        number: table.number,
        capacity: table.capacity,
        location: table.location,
        status: table.status,
      });
    } else {
      form.reset({
        number: '',
        capacity: 4,
        location: 'intérieur',
        status: 'available',
      });
    }
  }, [table, form]);

  const onSubmit = async (data: TableFormData) => {
    try {
      if (isEditing) {
        await updateTable.mutateAsync({ id: table.id, ...data });
        toast.success('Table modifiée');
      } else {
        await createTable.mutateAsync(data as Omit<RestaurantTable, 'id'>);
        toast.success('Table créée');
      }
      onOpenChange(false);
    } catch {
      toast.error('Erreur lors de l\'enregistrement');
    }
  };

  const isPending = createTable.isPending || updateTable.isPending;

  const statusOptions: { value: TableStatus; label: string }[] = [
    { value: 'available', label: 'Disponible' },
    { value: 'occupied', label: 'Occupée' },
    { value: 'reserved', label: 'Réservée' },
    { value: 'cleaning', label: 'Nettoyage' },
  ];

  const locationOptions: { value: TableLocation; label: string }[] = [
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
              <Button type="submit" variant="gold" disabled={isPending}>
                {isPending ? 'Enregistrement...' : isEditing ? 'Modifier' : 'Créer'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TableFormModal;
