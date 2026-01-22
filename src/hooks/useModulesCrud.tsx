import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { isProduction } from '@/lib/environment';
import { modulesApi, sousModulesApi, evnmtApi, ModuleInput, SousModuleInput, EvnmtInput } from '@/services/api';
import { supabaseModulesApi, supabaseSousModulesApi, supabaseEvnmtsApi } from '@/services/supabase-api';
import { normalizeModule, normalizeModules, normalizeSousModule, normalizeSousModules, normalizeEvnmt, normalizeEvnmts } from '@/lib/moduleAdapters';
import type { UnifiedModule, UnifiedSousModule, UnifiedEvnmt } from '@/types/unified';
import { useToast } from '@/hooks/use-toast';

// Export des types unifiés
export type Module = UnifiedModule;
export type SousModule = UnifiedSousModule;
export type Evnmt = UnifiedEvnmt;

export function useModulesCrud() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // =====================
  // Modules queries
  // =====================
  const { 
    data: modules = [], 
    isLoading: modulesLoading,
    error: modulesError 
  } = useQuery({
    queryKey: ['modules'],
    queryFn: async (): Promise<Module[]> => {
      if (isProduction()) {
        const data = await supabaseModulesApi.getAll();
        return normalizeModules(data);
      }
      const data = await modulesApi.getAll();
      return normalizeModules(data);
    },
  });

  // =====================
  // Sous-modules queries
  // =====================
  const { 
    data: sousModules = [], 
    isLoading: sousModulesLoading,
    error: sousModulesError 
  } = useQuery({
    queryKey: ['sousModules'],
    queryFn: async (): Promise<SousModule[]> => {
      if (isProduction()) {
        const data = await supabaseSousModulesApi.getAll();
        return normalizeSousModules(data);
      }
      const data = await sousModulesApi.getAll();
      return normalizeSousModules(data);
    },
  });

  // =====================
  // Evnmts queries
  // =====================
  const { 
    data: evnmts = [], 
    isLoading: evnmtsLoading,
    error: evnmtsError 
  } = useQuery({
    queryKey: ['evnmts'],
    queryFn: async (): Promise<Evnmt[]> => {
      if (isProduction()) {
        const data = await supabaseEvnmtsApi.getAll();
        return normalizeEvnmts(data);
      }
      const data = await evnmtApi.getAll();
      return normalizeEvnmts(data);
    },
  });

  // =====================
  // Module mutations
  // =====================
  const createModule = useMutation({
    mutationFn: async (data: ModuleInput): Promise<Module> => {
      if (isProduction()) {
        const result = await supabaseModulesApi.create({
          code_m: data.codeM,
          libelle: data.libelle,
          ddeb: data.ddeb,
          dfin: data.dfin,
        });
        return normalizeModule(result);
      }
      const result = await modulesApi.create(data);
      return normalizeModule(result);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modules'] });
      toast({ title: 'Module créé', description: 'Le module a été créé avec succès.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    },
  });

  const updateModule = useMutation({
    mutationFn: async ({ id, data }: { id: string | number; data: Partial<ModuleInput> }): Promise<Module> => {
      if (isProduction()) {
        const updateData: any = {};
        if (data.codeM) updateData.code_m = data.codeM;
        if (data.libelle) updateData.libelle = data.libelle;
        if (data.ddeb) updateData.ddeb = data.ddeb;
        if (data.dfin !== undefined) updateData.dfin = data.dfin;
        
        const result = await supabaseModulesApi.update(String(id), updateData);
        return normalizeModule(result);
      }
      const result = await modulesApi.update(Number(id), data);
      return normalizeModule(result);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modules'] });
      toast({ title: 'Module mis à jour', description: 'Le module a été modifié avec succès.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    },
  });

  const deleteModule = useMutation({
    mutationFn: async (id: string | number): Promise<void> => {
      if (isProduction()) {
        await supabaseModulesApi.delete(String(id));
      } else {
        await modulesApi.delete(Number(id));
      }
    },
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

  // =====================
  // Sous-module mutations
  // =====================
  const createSousModule = useMutation({
    mutationFn: async (data: SousModuleInput): Promise<SousModule> => {
      if (isProduction()) {
        const result = await supabaseSousModulesApi.create({
          code_s: data.codeS,
          libelle: data.libelle,
          ddeb: data.ddeb,
          dfin: data.dfin,
          module_id: String(data.moduleId),
        });
        return normalizeSousModule(result);
      }
      const result = await sousModulesApi.create(data);
      return normalizeSousModule(result);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sousModules'] });
      toast({ title: 'Sous-module créé', description: 'Le sous-module a été créé avec succès.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    },
  });

  const updateSousModule = useMutation({
    mutationFn: async ({ id, data }: { id: string | number; data: Partial<SousModuleInput> }): Promise<SousModule> => {
      if (isProduction()) {
        const updateData: any = {};
        if (data.codeS) updateData.code_s = data.codeS;
        if (data.libelle) updateData.libelle = data.libelle;
        if (data.ddeb) updateData.ddeb = data.ddeb;
        if (data.dfin !== undefined) updateData.dfin = data.dfin;
        if (data.moduleId) updateData.module_id = String(data.moduleId);
        
        const result = await supabaseSousModulesApi.update(String(id), updateData);
        return normalizeSousModule(result);
      }
      const result = await sousModulesApi.update(Number(id), data);
      return normalizeSousModule(result);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sousModules'] });
      toast({ title: 'Sous-module mis à jour', description: 'Le sous-module a été modifié avec succès.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    },
  });

  const deleteSousModule = useMutation({
    mutationFn: async (id: string | number): Promise<void> => {
      if (isProduction()) {
        await supabaseSousModulesApi.delete(String(id));
      } else {
        await sousModulesApi.delete(Number(id));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sousModules'] });
      queryClient.invalidateQueries({ queryKey: ['evnmts'] });
      toast({ title: 'Sous-module supprimé', description: 'Le sous-module et ses événements ont été supprimés.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    },
  });

  // =====================
  // Evnmt mutations
  // =====================
  const createEvnmt = useMutation({
    mutationFn: async (data: EvnmtInput & { componentType?: string }): Promise<Evnmt> => {
      if (isProduction()) {
        const result = await supabaseEvnmtsApi.create({
          code_evnmt: data.codeEvnmt,
          libelle: data.libelle,
          ddeb: data.ddeb,
          dfin: data.dfin,
          bactif: data.bactif,
          sous_module_id: String(data.sousModuleId),
          component_type: (data.componentType || 'form') as any,
        });
        return normalizeEvnmt(result);
      }
      const result = await evnmtApi.create(data);
      return normalizeEvnmt(result);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evnmts'] });
      toast({ title: 'Événement créé', description: 'L\'événement a été créé avec succès.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    },
  });

  const updateEvnmt = useMutation({
    mutationFn: async ({ id, data }: { id: string | number; data: Partial<EvnmtInput & { componentType?: string }> }): Promise<Evnmt> => {
      if (isProduction()) {
        const updateData: any = {};
        if (data.codeEvnmt) updateData.code_evnmt = data.codeEvnmt;
        if (data.libelle) updateData.libelle = data.libelle;
        if (data.ddeb) updateData.ddeb = data.ddeb;
        if (data.dfin !== undefined) updateData.dfin = data.dfin;
        if (data.bactif !== undefined) updateData.bactif = data.bactif;
        if (data.sousModuleId) updateData.sous_module_id = String(data.sousModuleId);
        if (data.componentType) updateData.component_type = data.componentType;
        
        const result = await supabaseEvnmtsApi.update(String(id), updateData);
        return normalizeEvnmt(result);
      }
      const result = await evnmtApi.update(Number(id), data);
      return normalizeEvnmt(result);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evnmts'] });
      toast({ title: 'Événement mis à jour', description: 'L\'événement a été modifié avec succès.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    },
  });

  const deleteEvnmt = useMutation({
    mutationFn: async (id: string | number): Promise<void> => {
      if (isProduction()) {
        await supabaseEvnmtsApi.delete(String(id));
      } else {
        await evnmtApi.delete(Number(id));
      }
    },
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
