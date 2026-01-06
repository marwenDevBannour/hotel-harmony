import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Reservation, ReservationStatus, ReservationSource } from '@/hooks/useReservations';
import { useRooms } from '@/hooks/useRooms';
import { useGuests } from '@/hooks/useGuests';
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

const reservationSchema = z.object({
  guest_id: z.string().min(1, 'Client requis'),
  room_id: z.string().min(1, 'Chambre requise'),
  check_in: z.string().min(1, "Date d'arrivée requise"),
  check_out: z.string().min(1, 'Date de départ requise'),
  adults: z.coerce.number().min(1, 'Au moins 1 adulte'),
  children: z.coerce.number().min(0),
  status: z.enum(['confirmed', 'pending', 'checked_in', 'checked_out', 'cancelled']),
  source: z.enum(['direct', 'website', 'booking', 'expedia', 'phone']),
  total_amount: z.coerce.number().min(0),
  paid_amount: z.coerce.number().min(0),
  special_requests: z.string().optional(),
});

type ReservationFormValues = z.infer<typeof reservationSchema>;

const statusLabels: Record<ReservationStatus, string> = {
  confirmed: 'Confirmée',
  pending: 'En attente',
  checked_in: 'Enregistré',
  checked_out: 'Parti',
  cancelled: 'Annulée',
};

const sourceLabels: Record<ReservationSource, string> = {
  direct: 'Direct',
  website: 'Site Web',
  booking: 'Booking.com',
  expedia: 'Expedia',
  phone: 'Téléphone',
};

interface ReservationFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reservation?: Reservation | null;
}

export function ReservationFormModal({ open, onOpenChange, reservation }: ReservationFormModalProps) {
  const queryClient = useQueryClient();
  const { data: rooms } = useRooms();
  const { data: guests } = useGuests();
  const isEditing = !!reservation;

  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      guest_id: '',
      room_id: '',
      check_in: '',
      check_out: '',
      adults: 1,
      children: 0,
      status: 'pending',
      source: 'direct',
      total_amount: 0,
      paid_amount: 0,
      special_requests: '',
    },
  });

  useEffect(() => {
    if (reservation) {
      form.reset({
        guest_id: reservation.guest_id,
        room_id: reservation.room_id,
        check_in: reservation.check_in,
        check_out: reservation.check_out,
        adults: reservation.adults,
        children: reservation.children,
        status: reservation.status,
        source: reservation.source,
        total_amount: Number(reservation.total_amount),
        paid_amount: Number(reservation.paid_amount),
        special_requests: reservation.special_requests || '',
      });
    } else {
      form.reset({
        guest_id: '',
        room_id: '',
        check_in: '',
        check_out: '',
        adults: 1,
        children: 0,
        status: 'pending',
        source: 'direct',
        total_amount: 0,
        paid_amount: 0,
        special_requests: '',
      });
    }
  }, [reservation, form]);

  const createMutation = useMutation({
    mutationFn: async (values: ReservationFormValues) => {
      const insertData = {
        guest_id: values.guest_id,
        room_id: values.room_id,
        check_in: values.check_in,
        check_out: values.check_out,
        adults: values.adults,
        children: values.children,
        status: values.status,
        source: values.source,
        total_amount: values.total_amount,
        paid_amount: values.paid_amount,
        special_requests: values.special_requests || null,
        reservation_number: '',
      };
      const { data, error } = await supabase
        .from('reservations')
        .insert([insertData])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      toast.success('Réservation créée avec succès');
      onOpenChange(false);
    },
    onError: () => {
      toast.error('Erreur lors de la création');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: ReservationFormValues) => {
      const { data, error } = await supabase
        .from('reservations')
        .update(values)
        .eq('id', reservation!.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      toast.success('Réservation modifiée avec succès');
      onOpenChange(false);
    },
    onError: () => {
      toast.error('Erreur lors de la modification');
    },
  });

  const onSubmit = (values: ReservationFormValues) => {
    if (isEditing) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  const availableRooms = rooms?.filter(r => r.status === 'available' || r.id === reservation?.room_id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Modifier la Réservation' : 'Nouvelle Réservation'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="guest_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un client..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {guests?.map((guest) => (
                        <SelectItem key={guest.id} value={guest.id}>
                          {guest.first_name} {guest.last_name}
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
              name="room_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chambre</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une chambre..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableRooms?.map((room) => (
                        <SelectItem key={room.id} value={room.id}>
                          {room.number} - {room.type} ({room.price_per_night}€/nuit)
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
                name="check_in"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date d'arrivée</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="check_out"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de départ</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="adults"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adultes</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="children"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enfants</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(sourceLabels).map(([value, label]) => (
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
                name="total_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Montant total (€)</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} step={0.01} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="paid_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Montant payé (€)</FormLabel>
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
              name="special_requests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Demandes spéciales</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Préférences, demandes spéciales..." {...field} />
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
