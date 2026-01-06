import { Plus, UserPlus, BedDouble, Receipt, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const QuickActions = () => {
  const actions = [
    { icon: Plus, label: 'Nouvelle Réservation', variant: 'gold' as const },
    { icon: UserPlus, label: 'Check-in Rapide', variant: 'default' as const },
    { icon: BedDouble, label: 'État Chambres', variant: 'outline' as const },
    { icon: Receipt, label: 'Nouvelle Facture', variant: 'outline' as const },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {actions.map((action) => (
        <Button
          key={action.label}
          variant={action.variant}
          className="gap-2"
        >
          <action.icon className="h-4 w-4" />
          {action.label}
        </Button>
      ))}
    </div>
  );
};

export default QuickActions;
