import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { modulesApi, sousModulesApi, Module, SousModule, ModuleInput, SousModuleInput } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

export function useModulesCrud() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Modules queries
  const { 
    data: modules = [], 
    isLoading: modulesLoading,
    error: modulesError 
  } = useQuery({
    queryKey: ['modules'],
    queryFn: modulesApi.getAll,
  });

  // Sous-modules queries
  const { 
    data: sousModules = [], 
    isLoading: sousModulesLoading,
    error: sousModulesError 
  } = useQuery({
    queryKey: ['sousModules'],
    queryFn: sousModulesApi.getAll,
  });

  // Module mutations
  const createModule = useMutation({
    mutationFn: (data: ModuleInput) => modulesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modules'] });
      toast({ title: 'Module créé', description: 'Le module a été créé avec succès.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    },
  });

  const updateModule = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ModuleInput> }) => modulesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modules'] });
      toast({ title: 'Module mis à jour', description: 'Le module a été modifié avec succès.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    },
  });

  const deleteModule = useMutation({
    mutationFn: (id: number) => modulesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modules'] });
      queryClient.invalidateQueries({ queryKey: ['sousModules'] });
      toast({ title: 'Module supprimé', description: 'Le module a été supprimé avec succès.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    },
  });

  // Sous-module mutations
  const createSousModule = useMutation({
    mutationFn: (data: SousModuleInput) => sousModulesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sousModules'] });
      toast({ title: 'Sous-module créé', description: 'Le sous-module a été créé avec succès.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    },
  });

  const updateSousModule = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<SousModuleInput> }) => sousModulesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sousModules'] });
      toast({ title: 'Sous-module mis à jour', description: 'Le sous-module a été modifié avec succès.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    },
  });

  const deleteSousModule = useMutation({
    mutationFn: (id: number) => sousModulesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sousModules'] });
      toast({ title: 'Sous-module supprimé', description: 'Le sous-module a été supprimé avec succès.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    },
  });

  return {
    // Data
    modules,
    sousModules,
    isLoading: modulesLoading || sousModulesLoading,
    error: modulesError || sousModulesError,
    
    // Module actions
    createModule: createModule.mutate,
    updateModule: updateModule.mutate,
    deleteModule: deleteModule.mutate,
    isCreatingModule: createModule.isPending,
    isUpdatingModule: updateModule.isPending,
    isDeletingModule: deleteModule.isPending,
    
    // Sous-module actions
    createSousModule: createSousModule.mutate,
    updateSousModule: updateSousModule.mutate,
    deleteSousModule: deleteSousModule.mutate,
    isCreatingSousModule: createSousModule.isPending,
    isUpdatingSousModule: updateSousModule.isPending,
    isDeletingSousModule: deleteSousModule.isPending,
  };
}
