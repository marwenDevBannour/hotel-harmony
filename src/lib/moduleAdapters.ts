// Adaptateurs pour normaliser les données Modules entre Supabase et Spring Boot
import type { Module as ApiModule, SousModule as ApiSousModule, Evnmt as ApiEvnmt } from '@/services/api';
import type { SupabaseModule, SupabaseSousModule, SupabaseEvnmt } from '@/services/supabase-api';
import type { UnifiedModule, UnifiedSousModule, UnifiedEvnmt } from '@/types/unified';

// =====================
// Module Adapters
// =====================
export const normalizeModule = (module: ApiModule | SupabaseModule): UnifiedModule => {
  if ('code_m' in module) {
    // Supabase module
    return {
      id: module.id,
      codeM: module.code_m,
      libelle: module.libelle,
      ddeb: module.ddeb,
      dfin: module.dfin,
    };
  } else {
    // Spring Boot module
    return {
      id: module.id,
      codeM: module.codeM,
      libelle: module.libelle,
      ddeb: module.ddeb,
      dfin: module.dfin,
    };
  }
};

export const normalizeModules = (modules: (ApiModule | SupabaseModule)[]): UnifiedModule[] => {
  return modules.map(normalizeModule);
};

// =====================
// SousModule Adapters
// =====================
export const normalizeSousModule = (sousModule: ApiSousModule | SupabaseSousModule): UnifiedSousModule => {
  if ('code_s' in sousModule) {
    // Supabase sous-module
    return {
      id: sousModule.id,
      codeS: sousModule.code_s,
      libelle: sousModule.libelle,
      ddeb: sousModule.ddeb,
      dfin: sousModule.dfin,
      moduleId: sousModule.module_id,
      module: sousModule.module ? normalizeModule(sousModule.module) : undefined,
    };
  } else {
    // Spring Boot sous-module
    return {
      id: sousModule.id,
      codeS: sousModule.codeS,
      libelle: sousModule.libelle,
      ddeb: sousModule.ddeb,
      dfin: sousModule.dfin,
      moduleId: sousModule.module?.id || 0,
      module: sousModule.module ? normalizeModule(sousModule.module) : undefined,
    };
  }
};

export const normalizeSousModules = (sousModules: (ApiSousModule | SupabaseSousModule)[]): UnifiedSousModule[] => {
  return sousModules.map(normalizeSousModule);
};

// =====================
// Evnmt Adapters
// =====================
export const normalizeEvnmt = (evnmt: ApiEvnmt | SupabaseEvnmt): UnifiedEvnmt => {
  if ('code_evnmt' in evnmt) {
    // Supabase evnmt
    return {
      id: evnmt.id,
      codeEvnmt: evnmt.code_evnmt,
      libelle: evnmt.libelle,
      ddeb: evnmt.ddeb,
      dfin: evnmt.dfin,
      bactif: evnmt.bactif,
      sousModuleId: evnmt.sous_module_id,
      sousModule: evnmt.sousModule ? normalizeSousModule(evnmt.sousModule) : undefined,
      componentType: (evnmt as any).component_type || 'form',
    };
  } else {
    // Spring Boot evnmt
    return {
      id: evnmt.id,
      codeEvnmt: evnmt.codeEvnmt,
      libelle: evnmt.libelle,
      ddeb: evnmt.ddeb,
      dfin: evnmt.dfin,
      bactif: evnmt.bactif,
      sousModuleId: evnmt.sousModule?.id || 0,
      sousModule: evnmt.sousModule ? normalizeSousModule(evnmt.sousModule) : undefined,
      componentType: (evnmt as any).componentType || 'form',
    };
  }
};

export const normalizeEvnmts = (evnmts: (ApiEvnmt | SupabaseEvnmt)[]): UnifiedEvnmt[] => {
  return evnmts.map(normalizeEvnmt);
};
