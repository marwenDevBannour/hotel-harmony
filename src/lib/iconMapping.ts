import { 
  LayoutDashboard, 
  BedDouble, 
  Calendar, 
  Users, 
  Receipt, 
  UserCog,
  UtensilsCrossed,
  BarChart3,
  Settings,
  Hotel,
  Package,
  Folder,
  FileText,
  Cog,
  Building,
  CreditCard,
  ClipboardList,
  LucideIcon
} from 'lucide-react';

// Mapping des codes de module vers les icônes Lucide
// Les clés correspondent aux valeurs de codeM ou codeS dans la base de données
export const iconMapping: Record<string, LucideIcon> = {
  // Modules principaux
  'DASHBOARD': LayoutDashboard,
  'ROOMS': BedDouble,
  'CHAMBRES': BedDouble,
  'RESERVATIONS': Calendar,
  'GUESTS': Users,
  'CLIENTS': Users,
  'BILLING': Receipt,
  'FACTURATION': Receipt,
  'STAFF': UserCog,
  'PERSONNEL': UserCog,
  'RESTAURANT': UtensilsCrossed,
  'RESTAURATION': UtensilsCrossed,
  'REPORTS': BarChart3,
  'RAPPORTS': BarChart3,
  'SETTINGS': Settings,
  'PARAMETRES': Settings,
  'HOTEL': Hotel,
  'BUILDING': Building,
  'PAYMENT': CreditCard,
  'PAIEMENT': CreditCard,
  'INVENTORY': Package,
  'STOCK': Package,
  'DOCUMENTS': FileText,
  'CONFIG': Cog,
  'TASKS': ClipboardList,
  'TACHES': ClipboardList,
};

// Icône par défaut si le code n'est pas trouvé
export const defaultIcon: LucideIcon = Folder;

// Fonction pour obtenir l'icône à partir d'un code
export function getIconByCode(code: string): LucideIcon {
  const normalizedCode = code?.toUpperCase().trim() || '';
  return iconMapping[normalizedCode] || defaultIcon;
}
