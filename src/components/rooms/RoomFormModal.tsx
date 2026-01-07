import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { roomsApi } from '@/services/api';
import { RoomData, RoomStatus, RoomType } from '@/hooks/useRooms';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const roomSchema = z.object({
  number: z.string().min(1, 'Numéro requis'),
  floor: z.coerce.number().min(0, 'Étage invalide'),
  type: z.enum(['standard', 'superior', 'deluxe', 'suite', 'presidential']),
  status: z.enum(['available', 'occupied', 'cleaning', 'maintenance', 'reserved']),
  capacity: z.coerce.number().min(1, 'Capacité requise'),
  price_per_night: z.coerce.number().min(0, 'Prix invalide'),
  description: z.string().optional(),
  amenities: z.array(z.string()).optional(),
});

type RoomFormValues = z.infer<typeof roomSchema>;

const typeLabels: Record<RoomType, string> = {
  standard: 'Standard',
  superior: 'Supérieure',
  deluxe: 'Deluxe',
  suite: 'Suite',
  presidential: 'Présidentielle',
};

const statusLabels: Record<RoomStatus, string> = {
  available: 'Disponible',
  occupied: 'Occupée',
  cleaning: 'Nettoyage',
  maintenance: 'Maintenance',
  reserved: 'Réservée',
};

const amenitiesList = ['WiFi', 'TV', 'Mini-bar', 'Sea View', 'Jacuzzi', 'Balcon', 'Climatisation', 'Coffre-fort'];

interface RoomFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room?: RoomData | null;
}

export function RoomFormModal({ open, onOpenChange, room }: RoomFormModalProps) {
  const queryClient = useQueryClient();
  const isEditing = !!room;

  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      number: '',
      floor: 1,
      type: 'standard',
      status: 'available',
      capacity: 2,
      price_per_night: 100,
      description: '',
      amenities: [],
    },
  });

  useEffect(() => {
    if (room) {
      form.reset({
        number: room.number,
        floor: room.floor,
        type: room.type,
        status: room.status,
        capacity: room.capacity,
        price_per_night: room.price_per_night,
        description: room.description || '',
        amenities: room.amenities || [],
      });
    } else {
      form.reset({
        number: '',
        floor: 1,
        type: 'standard',
        status: 'available',
        capacity: 2,
        price_per_night: 100,
        description: '',
        amenities: [],
      });
    }
  }, [room, form]);

  const createMutation = useMutation({
    mutationFn: async (values: RoomFormValues) => {
      return roomsApi.create({
        number: values.number,
        floor: values.floor,
        type: values.type,
        status: values.status,
        capacity: values.capacity,
        pricePerNight: values.price_per_night,
        description: values.description || undefined,
        amenities: values.amenities || [],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      queryClient.invalidateQueries({ queryKey: ['room-stats'] });
      toast.success('Chambre créée avec succès');
      onOpenChange(false);
    },
    onError: () => {
      toast.error('Erreur lors de la création');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: RoomFormValues) => {
      return roomsApi.update(room!.id, {
        number: values.number,
        floor: values.floor,
        type: values.type,
        status: values.status,
        capacity: values.capacity,
        pricePerNight: values.price_per_night,
        description: values.description || undefined,
        amenities: values.amenities || [],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      queryClient.invalidateQueries({ queryKey: ['room-stats'] });
      toast.success('Chambre modifiée avec succès');
      onOpenChange(false);
    },
    onError: () => {
      toast.error('Erreur lors de la modification');
    },
  });

  const onSubmit = (values: RoomFormValues) => {
    if (isEditing) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Modifier la Chambre' : 'Nouvelle Chambre'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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
                name="floor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Étage</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                        {Object.entries(typeLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
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
                        {Object.entries(statusLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                name="price_per_night"
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

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Description de la chambre..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amenities"
              render={() => (
                <FormItem>
                  <FormLabel>Équipements</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {amenitiesList.map((amenity) => (
                      <FormField
                        key={amenity}
                        control={form.control}
                        name="amenities"
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(amenity)}
                                onCheckedChange={(checked) => {
                                  const current = field.value || [];
                                  if (checked) {
                                    field.onChange([...current, amenity]);
                                  } else {
                                    field.onChange(current.filter((a) => a !== amenity));
                                  }
                                }}
                              />
                            </FormControl>
                            <span className="text-sm">{amenity}</span>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
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
