import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { menuItemsApi } from '@/services/api';
import { toast } from 'sonner';
import { MenuItem, MenuCategory } from '@/hooks/useRestaurant';

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
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const menuItemSchema = z.object({
  name: z.string().min(1, 'Nom requis'),
  category: z.enum(['entrée', 'plat', 'dessert', 'boisson', 'apéritif']),
  price: z.coerce.number().min(0, 'Prix invalide'),
  description: z.string().optional(),
  available: z.boolean(),
});

type MenuItemFormData = z.infer<typeof menuItemSchema>;

interface MenuItemFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  menuItem?: MenuItem | null;
}

const MenuItemFormModal = ({ open, onOpenChange, menuItem }: MenuItemFormModalProps) => {
  const queryClient = useQueryClient();
  const isEditing = !!menuItem;

  const form = useForm<MenuItemFormData>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      name: menuItem?.name || '',
      category: menuItem?.category || 'plat',
      price: menuItem?.price || 0,
      description: menuItem?.description || '',
      available: menuItem?.available ?? true,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: MenuItemFormData) => {
      if (isEditing) {
        return menuItemsApi.update(menuItem.id, {
          name: data.name,
          category: data.category,
          price: data.price,
          description: data.description || undefined,
          available: data.available,
        });
      } else {
        return menuItemsApi.create({
          name: data.name,
          category: data.category,
          price: data.price,
          description: data.description || undefined,
          available: data.available,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
      toast.success(isEditing ? 'Article modifié' : 'Article créé');
      onOpenChange(false);
      form.reset();
    },
    onError: () => {
      toast.error('Erreur lors de l\'enregistrement');
    },
  });

  const onSubmit = (data: MenuItemFormData) => {
    mutation.mutate(data);
  };

  const categoryOptions = [
    { value: 'entrée', label: 'Entrée' },
    { value: 'plat', label: 'Plat' },
    { value: 'dessert', label: 'Dessert' },
    { value: 'boisson', label: 'Boisson' },
    { value: 'apéritif', label: 'Apéritif' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Modifier l\'Article' : 'Nouvel Article'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom de l'article" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catégorie</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categoryOptions.map((opt) => (
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
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix (€) *</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min={0} {...field} />
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
                    <Textarea rows={2} placeholder="Description de l'article" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="available"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <FormLabel className="text-base">Disponible</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      L'article peut être commandé
                    </p>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
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

export default MenuItemFormModal;
