import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { modulesApi, sousModulesApi, evnmtApi, Module, SousModule, Evnmt, ModuleInput, SousModuleInput, EvnmtInput } from '@/services/api';
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

  // Evnmts queries
  const { 
    data: evnmts = [], 
    isLoading: evnmtsLoading,
    error: evnmtsError 
  } = useQuery({
    queryKey: ['evnmts'],
    queryFn: evnmtApi.getAll,
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
      queryClient.invalidateQueries({ queryKey: ['evnmts'] });
      toast({ title: 'Module supprimé', description: 'Le module et ses sous-modules ont été supprimés.' });
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
      queryClient.invalidateQueries({ queryKey: ['evnmts'] });
      toast({ title: 'Sous-module supprimé', description: 'Le sous-module et ses événements ont été supprimés.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    },
  });

  // Evnmt mutations
  const createEvnmt = useMutation({
    mutationFn: (data: EvnmtInput) => evnmtApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evnmts'] });
      toast({ title: 'Événement créé', description: 'L\'événement a été créé avec succès.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    },
  });

  const updateEvnmt = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<EvnmtInput> }) => evnmtApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evnmts'] });
      toast({ title: 'Événement mis à jour', description: 'L\'événement a été modifié avec succès.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    },
  });

  const deleteEvnmt = useMutation({
    mutationFn: (id: number) => evnmtApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evnmts'] });
      toast({ title: 'Événement supprimé', description: 'L\'événement a été supprimé avec succès.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    },
  });

  return {
    // Data
    modules,
    sousModules,
    evnmts,
    isLoading: modulesLoading || sousModulesLoading || evnmtsLoading,
    error: modulesError || sousModulesError || evnmtsError,
    
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
    
    // Evnmt actions
    createEvnmt: createEvnmt.mutate,
    updateEvnmt: updateEvnmt.mutate,
    deleteEvnmt: deleteEvnmt.mutate,
    isCreatingEvnmt: createEvnmt.isPending,
    isUpdatingEvnmt: updateEvnmt.isPending,
    isDeletingEvnmt: deleteEvnmt.isPending,
  };
}
