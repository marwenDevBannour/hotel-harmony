import { useQuery } from '@tanstack/react-query';
import { modulesApi, sousModulesApi, Module, SousModule } from '@/services/api';

export interface ModuleWithSousModules extends Module {
  sousModules: SousModule[];
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

  // Grouper les sous-modules par module
  const modulesWithSousModules: ModuleWithSousModules[] = modules.map(module => ({
    ...module,
    sousModules: sousModules.filter(sm => {
      // Vérifier à la fois l'objet module imbriqué et moduleId direct
      const smModuleId = sm.module?.id ?? (sm as any).moduleId;
      return smModuleId === module.id;
    }),
  }));

  return {
    modules: modulesWithSousModules,
    isLoading: modulesLoading || sousModulesLoading,
    error: modulesError || sousModulesError,
  };
}
