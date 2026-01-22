// Types de configuration pour les composants dynamiques

// Type de colonne pour les tables/listes
export interface ColumnConfig {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'badge' | 'boolean' | 'actions';
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  // Pour le type badge
  badgeVariants?: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'>;
}

// Type de champ pour les formulaires
export interface FieldConfig {
  key: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'date' | 'select' | 'textarea' | 'switch' | 'checkbox';
  placeholder?: string;
  required?: boolean;
  // Pour le type select
  options?: { value: string; label: string }[];
  // Validation
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

// Configuration globale d'un composant
export interface ComponentConfig {
  // Pour tables et listes
  columns?: ColumnConfig[];
  // Pour formulaires
  fields?: FieldConfig[];
  // Options générales
  title?: string;
  description?: string;
  // Pagination
  pageSize?: number;
  // Actions disponibles
  actions?: {
    create?: boolean;
    edit?: boolean;
    delete?: boolean;
    view?: boolean;
    export?: boolean;
  };
  // Source de données (pour future intégration)
  dataSource?: {
    type: 'static' | 'supabase' | 'api';
    table?: string;
    endpoint?: string;
  };
}

// Configurations par défaut selon le type de composant
export const defaultTableConfig: ComponentConfig = {
  columns: [
    { key: 'id', label: 'ID', type: 'text', sortable: true },
    { key: 'nom', label: 'Nom', type: 'text', sortable: true, filterable: true },
    { key: 'statut', label: 'Statut', type: 'badge', badgeVariants: { 'Actif': 'default', 'Inactif': 'secondary' } },
    { key: 'date', label: 'Date', type: 'date', sortable: true },
  ],
  pageSize: 10,
  actions: { create: true, edit: true, delete: true, view: true },
};

export const defaultFormConfig: ComponentConfig = {
  fields: [
    { key: 'nom', label: 'Nom', type: 'text', required: true, placeholder: 'Entrez le nom' },
    { key: 'email', label: 'Email', type: 'email', required: true, placeholder: 'email@exemple.com' },
    { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Description...' },
    { key: 'actif', label: 'Actif', type: 'switch' },
  ],
  actions: { create: true },
};

export const defaultListConfig: ComponentConfig = {
  columns: [
    { key: 'id', label: 'ID', type: 'text' },
    { key: 'nom', label: 'Nom', type: 'text', filterable: true },
    { key: 'statut', label: 'Statut', type: 'badge' },
    { key: 'date', label: 'Date', type: 'date' },
  ],
  pageSize: 10,
  actions: { create: true, edit: true, delete: true },
};

export const defaultDashboardConfig: ComponentConfig = {
  title: 'Tableau de bord',
  description: 'Vue d\'ensemble des données',
};

export const defaultSettingsConfig: ComponentConfig = {
  title: 'Paramètres',
  description: 'Configuration du module',
  fields: [
    { key: 'option1', label: 'Option 1', type: 'switch' },
    { key: 'option2', label: 'Option 2', type: 'text' },
  ],
};

// Helper pour obtenir la config par défaut selon le type
export function getDefaultConfig(componentType: string): ComponentConfig {
  switch (componentType) {
    case 'table': return { ...defaultTableConfig };
    case 'form': return { ...defaultFormConfig };
    case 'list': return { ...defaultListConfig };
    case 'dashboard': return { ...defaultDashboardConfig };
    case 'settings': return { ...defaultSettingsConfig };
    default: return {};
  }
}

// Helper pour merger une config custom avec la config par défaut
export function mergeWithDefaultConfig(componentType: string, customConfig?: ComponentConfig): ComponentConfig {
  const defaultConfig = getDefaultConfig(componentType);
  if (!customConfig) return defaultConfig;
  
  return {
    ...defaultConfig,
    ...customConfig,
    // Merger les actions si définies
    actions: {
      ...defaultConfig.actions,
      ...customConfig.actions,
    },
  };
}
