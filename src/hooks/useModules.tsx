import { useQuery } from '@tanstack/react-query';
import { modulesApi, sousModulesApi, evnmtApi, Module, SousModule, Evnmt } from '@/services/api';
import { ComponentConfig } from '@/types/componentConfig';

export interface EvnmtItem extends Omit<Evnmt, 'sousModule'> {
  componentType?: 'form' | 'table' | 'list' | 'dashboard' | 'settings';
  config?: ComponentConfig;
  sousModule?: SousModule;
}

export interface SousModuleWithEvnmts extends SousModule {
  evnmts: EvnmtItem[];
}

export interface ModuleWithSousModules extends Module {
  sousModules: SousModuleWithEvnmts[];
}

export function useModules() {
  const { 
    data: modules = [], 
    isLoading: modulesLoading,
    error: modulesError 
  } = useQuery({
    queryKey: ['modules'],
    queryFn: modulesApi.getAll,
  });

  const { 
    data: sousModules = [], 
    isLoading: sousModulesLoading,
    error: sousModulesError 
  } = useQuery({
    queryKey: ['sousModules'],
    queryFn: sousModulesApi.getAll,
  });

  const { 
    data: evnmts = [], 
    isLoading: evnmtsLoading,
    error: evnmtsError 
  } = useQuery({
    queryKey: ['evnmts'],
    queryFn: evnmtApi.getAll,
  });

  // Normaliser les événements pour inclure componentType et config
  const normalizedEvnmts: EvnmtItem[] = evnmts.map((e: any) => ({
    ...e,
    // Gérer le format Supabase (snake_case) et Spring Boot (camelCase)
    componentType: e.componentType || e.component_type || 'form',
    config: e.config || {},
    sousModuleId: e.sousModuleId || e.sous_module_id,
  }));

  // Grouper les événements par sous-module
  const sousModulesWithEvnmts: SousModuleWithEvnmts[] = sousModules.map(sm => ({
    ...sm,
    evnmts: normalizedEvnmts.filter(e => {
      const evnmtSmId = e.sousModule?.id ?? (e as any).sousModuleId;
      return evnmtSmId === sm.id;
    }),
  }));

  // Grouper les sous-modules par module
  const modulesWithSousModules: ModuleWithSousModules[] = modules.map(module => ({
    ...module,
    sousModules: sousModulesWithEvnmts.filter(sm => {
      const smModuleId = sm.module?.id ?? (sm as any).moduleId;
      return smModuleId === module.id;
    }),
  }));

  return {
    modules: modulesWithSousModules,
    sousModules: sousModulesWithEvnmts,
    evnmts: normalizedEvnmts,
    isLoading: modulesLoading || sousModulesLoading || evnmtsLoading,
    error: modulesError || sousModulesError || evnmtsError,
  };
}
