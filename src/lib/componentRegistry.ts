import { ComponentType } from 'react';
import { SousModule, Evnmt } from '@/services/api';
import { ComponentConfig } from '@/types/componentConfig';

// Extension de l'événement avec la config typée
export interface EvnmtWithConfig extends Evnmt {
  config?: ComponentConfig;
  componentType?: 'form' | 'table' | 'list' | 'dashboard' | 'settings';
}

// Type pour les props des composants de module
export interface ModuleComponentProps {
  sousModule: SousModule;
  moduleCode: string;
  evnmt?: EvnmtWithConfig;
}

// Type pour le registre de composants
export type ComponentRegistry = Record<string, ComponentType<ModuleComponentProps>>;

// Registre des composants par code de sous-module
const componentRegistry: ComponentRegistry = {};

// Fonction pour enregistrer un composant
export function registerComponent(code: string, component: ComponentType<ModuleComponentProps>) {
  componentRegistry[code.toUpperCase()] = component;
}

// Fonction pour obtenir un composant par code
export function getComponentByCode(code: string): ComponentType<ModuleComponentProps> | null {
  return componentRegistry[code.toUpperCase()] || null;
}

// Fonction pour vérifier si un composant existe
export function hasComponent(code: string): boolean {
  return code.toUpperCase() in componentRegistry;
}

// Exporter le registre pour inspection
export { componentRegistry };
