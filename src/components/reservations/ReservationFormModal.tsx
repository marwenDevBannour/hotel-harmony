import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateReservation, useUpdateReservation, Reservation } from '@/hooks/useReservations';
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
  guestId: z.string().min(1, 'Client requis'),
  roomId: z.string().min(1, 'Chambre requise'),
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
  const createMutation = useCreateReservation();
  const updateMutation = useUpdateReservation();
  const { data: rooms } = useRooms();
  const { data: guests } = useGuests();
  const isEditing = !!reservation;

  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      guestId: '',
      roomId: '',
      checkInDate: '',
      checkOutDate: '',
    },
  });

  useEffect(() => {
    if (reservation) {
      form.reset({
        guestId: String(reservation.guest?.id || reservation.guestId || ''),
        roomId: String(reservation.room?.id || reservation.roomId || ''),
        checkInDate: reservation.checkInDate.split('T')[0],
        checkOutDate: reservation.checkOutDate.split('T')[0],
      });
    } else {
      form.reset({
        guestId: '',
        roomId: '',
        checkInDate: '',
        checkOutDate: '',
      });
    }
  }, [reservation, form]);

  const onSubmit = (values: ReservationFormValues) => {
    const data = {
      guestId: values.guestId,
      roomId: values.roomId,
      checkInDate: values.checkInDate,
      checkOutDate: values.checkOutDate,
    };

    if (isEditing) {
      updateMutation.mutate(
        { id: reservation!.id, ...data },
        {
          onSuccess: () => {
            toast.success('Réservation modifiée avec succès');
            onOpenChange(false);
          },
          onError: () => {
            toast.error('Erreur lors de la modification');
          },
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          toast.success('Réservation créée avec succès');
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
                  <Select onValueChange={field.onChange} value={field.value}>
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
                  <Select onValueChange={field.onChange} value={field.value}>
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
