import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reservationsApi, Reservation, ReservationInput } from '@/services/api';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const reservationSchema = z.object({
  guestId: z.coerce.number().min(1, 'Client requis'),
  roomId: z.coerce.number().min(1, 'Chambre requise'),
  checkInDate: z.string().min(1, "Date d'arrivée requise"),
  checkOutDate: z.string().min(1, 'Date de départ requise'),
});

type ReservationFormValues = z.infer<typeof reservationSchema>;

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
      guestId: 0,
      roomId: 0,
      checkInDate: '',
      checkOutDate: '',
    },
  });

  useEffect(() => {
    if (reservation) {
      form.reset({
        guestId: reservation.guest?.id || 0,
        roomId: reservation.room?.id || 0,
        checkInDate: reservation.checkInDate,
        checkOutDate: reservation.checkOutDate,
      });
    } else {
      form.reset({
        guestId: 0,
        roomId: 0,
        checkInDate: '',
        checkOutDate: '',
      });
    }
  }, [reservation, form]);

  const createMutation = useMutation({
    mutationFn: (values: ReservationFormValues) => reservationsApi.create(values),
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
    mutationFn: (values: ReservationFormValues) => 
      reservationsApi.update(reservation!.id, values),
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Modifier la Réservation' : 'Nouvelle Réservation'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="guestId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client</FormLabel>
                  <Select onValueChange={(v) => field.onChange(Number(v))} value={String(field.value || '')}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un client..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {guests?.map((guest) => (
                        <SelectItem key={guest.id} value={String(guest.id)}>
                          {guest.name}
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
              name="roomId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chambre</FormLabel>
                  <Select onValueChange={(v) => field.onChange(Number(v))} value={String(field.value || '')}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une chambre..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {rooms?.map((room) => (
                        <SelectItem key={room.id} value={String(room.id)}>
                          {room.number} - {room.type} ({room.price}€/nuit)
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
                name="checkInDate"
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
                name="checkOutDate"
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
