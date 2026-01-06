import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { useMenuItems, useRestaurantTables, useCreateOrder, RestaurantTable, MenuItem, MenuCategory } from "@/hooks/useRestaurant";
import { useRooms } from "@/hooks/useRooms";
import { useGuests } from "@/hooks/useGuests";
import { toast } from "@/hooks/use-toast";

const orderSchema = z.object({
  order_type: z.enum(["dine_in", "room_service", "takeaway"]),
  table_id: z.string().optional(),
  room_id: z.string().optional(),
  guest_id: z.string().optional(),
  notes: z.string().optional(),
});

type OrderFormData = z.infer<typeof orderSchema>;

interface SelectedItem {
  menu_item_id: string;
  quantity: number;
  unit_price: number;
  notes: string;
  menu_item: MenuItem;
}

interface OrderFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedTable?: RestaurantTable | null;
}

const ORDER_TYPES = [
  { value: "dine_in", label: "Sur place" },
  { value: "room_service", label: "Room Service" },
  { value: "takeaway", label: "À emporter" },
];

const CATEGORY_LABELS: Record<MenuCategory, string> = {
  "entrée": "Entrées",
  "plat": "Plats principaux",
  "dessert": "Desserts",
  "boisson": "Boissons",
  "apéritif": "Apéritifs",
};

export function OrderFormModal({ open, onOpenChange, preselectedTable }: OrderFormModalProps) {
  const { data: menuItems = [] } = useMenuItems();
  const { data: tables = [] } = useRestaurantTables();
  const { data: rooms = [] } = useRooms();
  const { data: guests = [] } = useGuests();
  const createOrder = useCreateOrder();

  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      order_type: "dine_in",
      table_id: "",
      room_id: "",
      guest_id: "",
      notes: "",
    },
  });

  const orderType = form.watch("order_type");

  // Reset and set preselected table when modal opens
  useEffect(() => {
    if (open) {
      setSelectedItems([]);
      if (preselectedTable) {
        form.reset({
          order_type: "dine_in",
          table_id: preselectedTable.id,
          room_id: "",
          guest_id: "",
          notes: "",
        });
      } else {
        form.reset({
          order_type: "dine_in",
          table_id: "",
          room_id: "",
          guest_id: "",
          notes: "",
        });
      }
    }
  }, [open, preselectedTable, form]);

  // Group menu items by category
  const menuByCategory = useMemo(() => {
    const available = menuItems.filter((item) => item.available);
    return available.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, MenuItem[]>);
  }, [menuItems]);

  // Available tables (not occupied)
  const availableTables = useMemo(() => {
    return tables.filter((t) => t.status === "available" || t.id === preselectedTable?.id);
  }, [tables, preselectedTable]);

  // Occupied rooms for room service
  const occupiedRooms = useMemo(() => {
    return rooms.filter((r) => r.status === "occupied");
  }, [rooms]);

  // Calculate totals
  const subtotal = useMemo(() => {
    return selectedItems.reduce((acc, item) => acc + item.quantity * item.unit_price, 0);
  }, [selectedItems]);

  const taxRate = 0.1;
  const taxAmount = subtotal * taxRate;
  const totalAmount = subtotal + taxAmount;

  const addItem = (menuItem: MenuItem) => {
    setSelectedItems((prev) => {
      const existing = prev.find((i) => i.menu_item_id === menuItem.id);
      if (existing) {
        return prev.map((i) =>
          i.menu_item_id === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          menu_item_id: menuItem.id,
          quantity: 1,
          unit_price: menuItem.price,
          notes: "",
          menu_item: menuItem,
        },
      ];
    });
  };

  const removeItem = (menuItemId: string) => {
    setSelectedItems((prev) => {
      const existing = prev.find((i) => i.menu_item_id === menuItemId);
      if (existing && existing.quantity > 1) {
        return prev.map((i) =>
          i.menu_item_id === menuItemId ? { ...i, quantity: i.quantity - 1 } : i
        );
      }
      return prev.filter((i) => i.menu_item_id !== menuItemId);
    });
  };

  const updateItemNotes = (menuItemId: string, notes: string) => {
    setSelectedItems((prev) =>
      prev.map((i) => (i.menu_item_id === menuItemId ? { ...i, notes } : i))
    );
  };

  const getItemQuantity = (menuItemId: string) => {
    return selectedItems.find((i) => i.menu_item_id === menuItemId)?.quantity || 0;
  };

  const onSubmit = async (data: OrderFormData) => {
    if (selectedItems.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner au moins un article",
        variant: "destructive",
      });
      return;
    }

    // Validate based on order type
    if (data.order_type === "dine_in" && !data.table_id) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une table",
        variant: "destructive",
      });
      return;
    }

    if (data.order_type === "room_service" && !data.room_id) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une chambre",
        variant: "destructive",
      });
      return;
    }

    try {
      await createOrder.mutateAsync({
        order: {
          order_type: data.order_type,
          table_id: data.order_type === "dine_in" ? data.table_id : null,
          room_id: data.order_type === "room_service" ? data.room_id : null,
          guest_id: data.guest_id || null,
          notes: data.notes || null,
          subtotal,
          tax_amount: taxAmount,
          total_amount: totalAmount,
        },
        items: selectedItems.map((item) => ({
          menu_item_id: item.menu_item_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.quantity * item.unit_price,
          notes: item.notes || null,
        })),
      });

      toast({
        title: "Succès",
        description: "Commande créée avec succès",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la commande",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {preselectedTable
              ? `Nouvelle Commande - Table ${preselectedTable.number}`
              : "Nouvelle Commande"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 overflow-hidden">
              {/* Left side - Order details and menu */}
              <div className="flex flex-col gap-4 overflow-hidden">
                {/* Order type and destination */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="order_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type de commande</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {ORDER_TYPES.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {orderType === "dine_in" && (
                    <FormField
                      control={form.control}
                      name="table_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Table</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner une table" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {availableTables.map((table) => (
                                <SelectItem key={table.id} value={table.id}>
                                  Table {table.number} ({table.capacity} places)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {orderType === "room_service" && (
                    <FormField
                      control={form.control}
                      name="room_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chambre</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner une chambre" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {occupiedRooms.map((room) => (
                                <SelectItem key={room.id} value={room.id}>
                                  Chambre {room.number} - {room.type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {orderType === "takeaway" && <div />}
                </div>

                <FormField
                  control={form.control}
                  name="guest_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client (optionnel)</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un client" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {guests.map((guest) => (
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

                {/* Menu items */}
                <div className="flex-1 overflow-hidden">
                  <h3 className="font-semibold mb-2">Menu</h3>
                  <ScrollArea className="h-[300px] border rounded-lg p-3">
                    {Object.entries(menuByCategory).map(([category, items]) => (
                      <div key={category} className="mb-4">
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">
                          {CATEGORY_LABELS[category] || category}
                        </h4>
                        <div className="space-y-2">
                          {items.map((item) => {
                            const quantity = getItemQuantity(item.id);
                            return (
                              <div
                                key={item.id}
                                className="flex items-center justify-between p-2 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                              >
                                <div className="flex-1">
                                  <p className="font-medium text-sm">{item.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {item.price.toLocaleString()} FCFA
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  {quantity > 0 && (
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => removeItem(item.id)}
                                    >
                                      <Minus className="h-4 w-4" />
                                    </Button>
                                  )}
                                  {quantity > 0 && (
                                    <Badge variant="secondary" className="min-w-[2rem] justify-center">
                                      {quantity}
                                    </Badge>
                                  )}
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => addItem(item)}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                </div>
              </div>

              {/* Right side - Order summary */}
              <div className="flex flex-col gap-4 overflow-hidden">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  <h3 className="font-semibold">Résumé de la commande</h3>
                  {selectedItems.length > 0 && (
                    <Badge>{selectedItems.reduce((acc, i) => acc + i.quantity, 0)} articles</Badge>
                  )}
                </div>

                <ScrollArea className="flex-1 border rounded-lg p-3">
                  {selectedItems.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      Aucun article sélectionné
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {selectedItems.map((item) => (
                        <div key={item.menu_item_id} className="space-y-2 p-2 rounded-lg border">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-sm">{item.menu_item.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {item.quantity} x {item.unit_price.toLocaleString()} FCFA
                              </p>
                            </div>
                            <p className="font-semibold">
                              {(item.quantity * item.unit_price).toLocaleString()} FCFA
                            </p>
                          </div>
                          <Input
                            placeholder="Notes pour cet article..."
                            value={item.notes}
                            onChange={(e) => updateItemNotes(item.menu_item_id, e.target.value)}
                            className="text-sm"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Sous-total</span>
                    <span>{subtotal.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Taxes (10%)</span>
                    <span>{taxAmount.toLocaleString()} FCFA</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total TTC</span>
                    <span>{totalAmount.toLocaleString()} FCFA</span>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes générales</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Instructions spéciales pour la commande..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={selectedItems.length === 0 || createOrder.isPending}
              >
                {createOrder.isPending ? "Création..." : "Créer la commande"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
