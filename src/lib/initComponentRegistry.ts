// Fichier d'initialisation du registre de composants
// Importe et enregistre tous les composants de modules

import { registerComponent } from '@/lib/componentRegistry';
import { ListComponent } from '@/components/modules/ListComponent';
import { FormComponent } from '@/components/modules/FormComponent';
import { DashboardComponent } from '@/components/modules/DashboardComponent';
import { SettingsComponent } from '@/components/modules/SettingsComponent';

// Enregistrement des composants par code de sous-module
// Ajoutez vos mappings ici

// Composants de type Liste
registerComponent('LIST', ListComponent);
registerComponent('LISTE', ListComponent);
registerComponent('RESERVATION_LIST', ListComponent);
registerComponent('GUEST_LIST', ListComponent);
registerComponent('ROOM_LIST', ListComponent);
registerComponent('INVENTORY', ListComponent);
registerComponent('STOCK', ListComponent);

// Composants de type Formulaire
registerComponent('FORM', FormComponent);
registerComponent('FORMULAIRE', FormComponent);
registerComponent('CREATE', FormComponent);
registerComponent('NEW', FormComponent);
registerComponent('ADD', FormComponent);
registerComponent('AJOUTER', FormComponent);

// Composants de type Tableau de bord
registerComponent('DASHBOARD', DashboardComponent);
registerComponent('TABLEAU', DashboardComponent);
registerComponent('OVERVIEW', DashboardComponent);
registerComponent('STATS', DashboardComponent);
registerComponent('ANALYTICS', DashboardComponent);
registerComponent('RAPPORTS', DashboardComponent);

// Composants de type Paramètres
registerComponent('SETTINGS', SettingsComponent);
registerComponent('CONFIG', SettingsComponent);
registerComponent('CONFIGURATION', SettingsComponent);
registerComponent('PARAMETRES', SettingsComponent);
registerComponent('OPTIONS', SettingsComponent);

// Export pour s'assurer que le fichier est inclus
export const registryInitialized = true;
