import { useState, useMemo } from 'react';
import { Plus, Pencil, Trash2, Folder, FolderOpen, Calendar, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { useModulesCrud } from '@/hooks/useModulesCrud';
import { Module, SousModule, Evnmt } from '@/services/api';
import { ModuleFormModal } from '@/components/settings/ModuleFormModal';
import { SousModuleFormModal } from '@/components/settings/SousModuleFormModal';
import { EvnmtFormModal } from '@/components/settings/EvnmtFormModal';
import { getIconByCode } from '@/lib/iconMapping';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ITEMS_PER_PAGE = 10;

export default function Settings() {
  const {
    modules,
    sousModules,
    evnmts,
    isLoading,
    createModule,
    updateModule,
    deleteModule,
    createSousModule,
    updateSousModule,
    deleteSousModule,
    createEvnmt,
    updateEvnmt,
    deleteEvnmt,
    isCreatingModule,
    isUpdatingModule,
    isCreatingSousModule,
    isUpdatingSousModule,
    isCreatingEvnmt,
    isUpdatingEvnmt,
  } = useModulesCrud();

  // Selection state for cascading
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const [selectedSousModuleId, setSelectedSousModuleId] = useState<number | null>(null);

  // Search state
  const [moduleSearch, setModuleSearch] = useState('');
  const [sousModuleSearch, setSousModuleSearch] = useState('');
  const [evnmtSearch, setEvnmtSearch] = useState('');

  // Pagination state
  const [modulePage, setModulePage] = useState(1);
  const [sousModulePage, setSousModulePage] = useState(1);
  const [evnmtPage, setEvnmtPage] = useState(1);

  // Module modal state
  const [moduleModalOpen, setModuleModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [deletingModule, setDeletingModule] = useState<Module | null>(null);

  // Sous-module modal state
  const [sousModuleModalOpen, setSousModuleModalOpen] = useState(false);
  const [editingSousModule, setEditingSousModule] = useState<SousModule | null>(null);
  const [deletingSousModule, setDeletingSousModule] = useState<SousModule | null>(null);

  // Evnmt modal state
  const [evnmtModalOpen, setEvnmtModalOpen] = useState(false);
  const [editingEvnmt, setEditingEvnmt] = useState<Evnmt | null>(null);
  const [deletingEvnmt, setDeletingEvnmt] = useState<Evnmt | null>(null);

  // Filter sous-modules by selected module
  const filteredSousModules = useMemo(() => {
    let result = sousModules;
    if (selectedModuleId) {
      result = result.filter(sm => {
        const moduleId = sm.module?.id ?? (sm as any).moduleId;
        return moduleId === selectedModuleId;
      });
    }
    if (sousModuleSearch.trim()) {
      const search = sousModuleSearch.toLowerCase();
      result = result.filter(sm => 
        sm.codeS?.toLowerCase().includes(search) ||
        sm.libelle?.toLowerCase().includes(search)
      );
    }
    return result;
  }, [sousModules, selectedModuleId, sousModuleSearch]);

  // Filter evnmts by selected sous-module
  const filteredEvnmts = useMemo(() => {
    let result = evnmts;
    if (selectedSousModuleId) {
      result = result.filter(e => {
        const smId = e.sousModule?.id ?? (e as any).sousModuleId;
        return smId === selectedSousModuleId;
      });
    }
    if (evnmtSearch.trim()) {
      const search = evnmtSearch.toLowerCase();
      result = result.filter(e => 
        e.codeEvnmt?.toLowerCase().includes(search) ||
        e.libelle?.toLowerCase().includes(search)
      );
    }
    return result;
  }, [evnmts, selectedSousModuleId, evnmtSearch]);

  // Filter modules by search
  const filteredModules = useMemo(() => {
    if (!moduleSearch.trim()) return modules;
    const search = moduleSearch.toLowerCase();
    return modules.filter(m => 
      m.codeM?.toLowerCase().includes(search) ||
      m.libelle?.toLowerCase().includes(search)
    );
  }, [modules, moduleSearch]);

  // Pagination helpers
  const paginatedModules = filteredModules.slice((modulePage - 1) * ITEMS_PER_PAGE, modulePage * ITEMS_PER_PAGE);
  const paginatedSousModules = filteredSousModules.slice((sousModulePage - 1) * ITEMS_PER_PAGE, sousModulePage * ITEMS_PER_PAGE);
  const paginatedEvnmts = filteredEvnmts.slice((evnmtPage - 1) * ITEMS_PER_PAGE, evnmtPage * ITEMS_PER_PAGE);

  const totalModulePages = Math.ceil(filteredModules.length / ITEMS_PER_PAGE);
  const totalSousModulePages = Math.ceil(filteredSousModules.length / ITEMS_PER_PAGE);
  const totalEvnmtPages = Math.ceil(filteredEvnmts.length / ITEMS_PER_PAGE);

  // Handlers
  const handleSelectModule = (moduleId: number) => {
    setSelectedModuleId(moduleId === selectedModuleId ? null : moduleId);
    setSelectedSousModuleId(null);
    setSousModulePage(1);
    setEvnmtPage(1);
  };

  const handleSelectSousModule = (sousModuleId: number) => {
    setSelectedSousModuleId(sousModuleId === selectedSousModuleId ? null : sousModuleId);
    setEvnmtPage(1);
  };

  const handleEditModule = (module: Module) => {
    setEditingModule(module);
    setModuleModalOpen(true);
  };

  const handleEditSousModule = (sousModule: SousModule) => {
    setEditingSousModule(sousModule);
    setSousModuleModalOpen(true);
  };

  const handleEditEvnmt = (evnmt: Evnmt) => {
    setEditingEvnmt(evnmt);
    setEvnmtModalOpen(true);
  };

  const handleModuleSubmit = (data: any) => {
    if (editingModule) {
      updateModule({ id: editingModule.id, data });
    } else {
      createModule(data);
    }
    setEditingModule(null);
  };

  const handleSousModuleSubmit = (data: any) => {
    if (editingSousModule) {
      updateSousModule({ id: editingSousModule.id, data });
    } else {
      createSousModule(data);
    }
    setEditingSousModule(null);
  };

  const handleEvnmtSubmit = (data: any) => {
    if (editingEvnmt) {
      updateEvnmt({ id: editingEvnmt.id, data });
    } else {
      createEvnmt(data);
    }
    setEditingEvnmt(null);
  };

  const handleDeleteModule = () => {
    if (deletingModule) {
      deleteModule(deletingModule.id);
      if (selectedModuleId === deletingModule.id) {
        setSelectedModuleId(null);
        setSelectedSousModuleId(null);
      }
      setDeletingModule(null);
    }
  };

  const handleDeleteSousModule = () => {
    if (deletingSousModule) {
      deleteSousModule(deletingSousModule.id);
      if (selectedSousModuleId === deletingSousModule.id) {
        setSelectedSousModuleId(null);
      }
      setDeletingSousModule(null);
    }
  };

  const handleDeleteEvnmt = () => {
    if (deletingEvnmt) {
      deleteEvnmt(deletingEvnmt.id);
      setDeletingEvnmt(null);
    }
  };

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('fr-FR');
  };

  const isActive = (ddeb: string | null | undefined, dfin: string | null | undefined) => {
    if (!ddeb || !dfin) return false;
    const now = new Date();
    const start = new Date(ddeb);
    const end = new Date(dfin);
    return now >= start && now <= end;
  };

  const selectedModule = modules.find(m => m.id === selectedModuleId);
  const selectedSousModule = sousModules.find(sm => sm.id === selectedSousModuleId);

  return (
    <MainLayout title="Paramètres" subtitle="Gestion des modules et configuration">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
          <p className="text-muted-foreground">
            Gérez les modules, sous-modules et événements de l'application
          </p>
        </div>

        {/* Three-column cascading layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Modules Column */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Folder className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Modules</CardTitle>
                </div>
                <Button size="sm" onClick={() => { setEditingModule(null); setModuleModalOpen(true); }}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>
                {filteredModules.length} module{filteredModules.length > 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  value={moduleSearch}
                  onChange={(e) => { setModuleSearch(e.target.value); setModulePage(1); }}
                  className="pl-8 h-9"
                />
              </div>

              {/* Table */}
              {isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => <Skeleton key={i} className="h-10 w-full" />)}
                </div>
              ) : paginatedModules.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground text-sm">
                  Aucun module trouvé
                </div>
              ) : (
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[40px]"></TableHead>
                        <TableHead>Libellé</TableHead>
                        <TableHead className="w-[80px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedModules.map((module) => {
                        const ModuleIcon = getIconByCode(module.codeM);
                        const active = isActive(module.ddeb, module.dfin);
                        const isSelected = selectedModuleId === module.id;
                        return (
                          <TableRow 
                            key={module.id} 
                            className={`cursor-pointer transition-colors ${isSelected ? 'bg-primary/10' : 'hover:bg-muted/50'}`}
                            onClick={() => handleSelectModule(module.id)}
                          >
                            <TableCell>
                              <div className={`flex h-7 w-7 items-center justify-center rounded ${isSelected ? 'bg-primary' : 'bg-primary/10'}`}>
                                <ModuleIcon className={`h-3.5 w-3.5 ${isSelected ? 'text-primary-foreground' : 'text-primary'}`} />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-medium text-sm">{module.libelle}</span>
                                <span className="text-xs text-muted-foreground">{module.codeM}</span>
                              </div>
                            </TableCell>
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditModule(module)}>
                                  <Pencil className="h-3.5 w-3.5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => setDeletingModule(module)}>
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Pagination */}
              {totalModulePages > 1 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Page {modulePage}/{totalModulePages}
                  </span>
                  <div className="flex gap-1">
                    <Button variant="outline" size="icon" className="h-7 w-7" disabled={modulePage === 1} onClick={() => setModulePage(p => p - 1)}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-7 w-7" disabled={modulePage === totalModulePages} onClick={() => setModulePage(p => p + 1)}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sous-Modules Column */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Sous-modules</CardTitle>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => { setEditingSousModule(null); setSousModuleModalOpen(true); }}
                  disabled={!selectedModuleId}
                  title={!selectedModuleId ? 'Sélectionnez d\'abord un module' : ''}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>
                {selectedModule ? (
                  <span className="flex items-center gap-1">
                    <Badge variant="outline" className="text-xs">{selectedModule.libelle}</Badge>
                    → {filteredSousModules.length} sous-module{filteredSousModules.length > 1 ? 's' : ''}
                  </span>
                ) : (
                  <span>{sousModules.length} total • Sélectionnez un module</span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  value={sousModuleSearch}
                  onChange={(e) => { setSousModuleSearch(e.target.value); setSousModulePage(1); }}
                  className="pl-8 h-9"
                />
              </div>

              {/* Table */}
              {isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => <Skeleton key={i} className="h-10 w-full" />)}
                </div>
              ) : paginatedSousModules.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground text-sm">
                  {selectedModuleId ? 'Aucun sous-module pour ce module' : 'Sélectionnez un module'}
                </div>
              ) : (
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[40px]"></TableHead>
                        <TableHead>Libellé</TableHead>
                        <TableHead className="w-[80px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedSousModules.map((sousModule) => {
                        const SousModuleIcon = getIconByCode(sousModule.codeS);
                        const isSelected = selectedSousModuleId === sousModule.id;
                        return (
                          <TableRow 
                            key={sousModule.id}
                            className={`cursor-pointer transition-colors ${isSelected ? 'bg-primary/10' : 'hover:bg-muted/50'}`}
                            onClick={() => handleSelectSousModule(sousModule.id)}
                          >
                            <TableCell>
                              <div className={`flex h-7 w-7 items-center justify-center rounded ${isSelected ? 'bg-secondary' : 'bg-secondary/50'}`}>
                                <SousModuleIcon className="h-3.5 w-3.5 text-secondary-foreground" />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <span className="font-medium text-sm">{sousModule.libelle}</span>
                                <span className="text-xs text-muted-foreground">{sousModule.codeS}</span>
                                {!selectedModuleId && sousModule.module && (
                                  <Badge variant="outline" className="text-xs w-fit">
                                    {sousModule.module.libelle}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditSousModule(sousModule)}>
                                  <Pencil className="h-3.5 w-3.5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => setDeletingSousModule(sousModule)}>
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Pagination */}
              {totalSousModulePages > 1 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Page {sousModulePage}/{totalSousModulePages}
                  </span>
                  <div className="flex gap-1">
                    <Button variant="outline" size="icon" className="h-7 w-7" disabled={sousModulePage === 1} onClick={() => setSousModulePage(p => p - 1)}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-7 w-7" disabled={sousModulePage === totalSousModulePages} onClick={() => setSousModulePage(p => p + 1)}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Événements Column */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Événements</CardTitle>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => { setEditingEvnmt(null); setEvnmtModalOpen(true); }}
                  disabled={!selectedSousModuleId}
                  title={!selectedSousModuleId ? 'Sélectionnez d\'abord un sous-module' : ''}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>
                {selectedSousModule ? (
                  <span className="flex items-center gap-1">
                    <Badge variant="outline" className="text-xs">{selectedSousModule.libelle}</Badge>
                    → {filteredEvnmts.length} événement{filteredEvnmts.length > 1 ? 's' : ''}
                  </span>
                ) : (
                  <span>{evnmts.length} total • Sélectionnez un sous-module</span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  value={evnmtSearch}
                  onChange={(e) => { setEvnmtSearch(e.target.value); setEvnmtPage(1); }}
                  className="pl-8 h-9"
                />
              </div>

              {/* Table */}
              {isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => <Skeleton key={i} className="h-10 w-full" />)}
                </div>
              ) : paginatedEvnmts.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground text-sm">
                  {selectedSousModuleId ? 'Aucun événement pour ce sous-module' : 'Sélectionnez un sous-module'}
                </div>
              ) : (
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Libellé</TableHead>
                        <TableHead className="w-[60px]">Statut</TableHead>
                        <TableHead className="w-[80px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedEvnmts.map((evnmt) => {
                        const active = isActive(evnmt.ddeb, evnmt.dfin) && evnmt.bactif;
                        return (
                          <TableRow key={evnmt.id} className="hover:bg-muted/50">
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <span className="font-medium text-sm">{evnmt.libelle}</span>
                                <span className="text-xs text-muted-foreground">{evnmt.codeEvnmt}</span>
                                {!selectedSousModuleId && evnmt.sousModule && (
                                  <Badge variant="outline" className="text-xs w-fit">
                                    {evnmt.sousModule.libelle}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={active ? 'default' : 'secondary'} className="text-xs">
                                {active ? 'Actif' : 'Inactif'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditEvnmt(evnmt)}>
                                  <Pencil className="h-3.5 w-3.5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => setDeletingEvnmt(evnmt)}>
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Pagination */}
              {totalEvnmtPages > 1 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Page {evnmtPage}/{totalEvnmtPages}
                  </span>
                  <div className="flex gap-1">
                    <Button variant="outline" size="icon" className="h-7 w-7" disabled={evnmtPage === 1} onClick={() => setEvnmtPage(p => p - 1)}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-7 w-7" disabled={evnmtPage === totalEvnmtPages} onClick={() => setEvnmtPage(p => p + 1)}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Module Form Modal */}
      <ModuleFormModal
        open={moduleModalOpen}
        onOpenChange={(open) => {
          setModuleModalOpen(open);
          if (!open) setEditingModule(null);
        }}
        module={editingModule}
        onSubmit={handleModuleSubmit}
        isLoading={isCreatingModule || isUpdatingModule}
      />

      {/* Sous-module Form Modal */}
      <SousModuleFormModal
        open={sousModuleModalOpen}
        onOpenChange={(open) => {
          setSousModuleModalOpen(open);
          if (!open) setEditingSousModule(null);
        }}
        sousModule={editingSousModule}
        selectedModule={selectedModule ?? null}
        onSubmit={handleSousModuleSubmit}
        isLoading={isCreatingSousModule || isUpdatingSousModule}
      />

      {/* Evnmt Form Modal */}
      <EvnmtFormModal
        open={evnmtModalOpen}
        onOpenChange={(open) => {
          setEvnmtModalOpen(open);
          if (!open) setEditingEvnmt(null);
        }}
        evnmt={editingEvnmt}
        selectedSousModule={selectedSousModule ?? null}
        onSubmit={handleEvnmtSubmit}
        isLoading={isCreatingEvnmt || isUpdatingEvnmt}
      />

      {/* Delete Module Confirmation */}
      <AlertDialog open={!!deletingModule} onOpenChange={() => setDeletingModule(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le module ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le module "{deletingModule?.libelle}" et tous ses sous-modules et événements seront supprimés.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteModule} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Sous-module Confirmation */}
      <AlertDialog open={!!deletingSousModule} onOpenChange={() => setDeletingSousModule(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le sous-module ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le sous-module "{deletingSousModule?.libelle}" et tous ses événements seront supprimés.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSousModule} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Evnmt Confirmation */}
      <AlertDialog open={!!deletingEvnmt} onOpenChange={() => setDeletingEvnmt(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer l'événement ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. L'événement "{deletingEvnmt?.libelle}" sera supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteEvnmt} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
