import { useState } from 'react';
import { Plus, Pencil, Trash2, Folder, FolderOpen } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { useModulesCrud } from '@/hooks/useModulesCrud';
import { Module, SousModule } from '@/services/api';
import { ModuleFormModal } from '@/components/settings/ModuleFormModal';
import { SousModuleFormModal } from '@/components/settings/SousModuleFormModal';
import { getIconByCode } from '@/lib/iconMapping';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

export default function Settings() {
  const {
    modules,
    sousModules,
    isLoading,
    createModule,
    updateModule,
    deleteModule,
    createSousModule,
    updateSousModule,
    deleteSousModule,
    isCreatingModule,
    isUpdatingModule,
    isCreatingSousModule,
    isUpdatingSousModule,
  } = useModulesCrud();

  // Module state
  const [moduleModalOpen, setModuleModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [deletingModule, setDeletingModule] = useState<Module | null>(null);

  // Sous-module state
  const [sousModuleModalOpen, setSousModuleModalOpen] = useState(false);
  const [editingSousModule, setEditingSousModule] = useState<SousModule | null>(null);
  const [deletingSousModule, setDeletingSousModule] = useState<SousModule | null>(null);

  const handleEditModule = (module: Module) => {
    setEditingModule(module);
    setModuleModalOpen(true);
  };

  const handleEditSousModule = (sousModule: SousModule) => {
    setEditingSousModule(sousModule);
    setSousModuleModalOpen(true);
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

  const handleDeleteModule = () => {
    if (deletingModule) {
      deleteModule(deletingModule.id);
      setDeletingModule(null);
    }
  };

  const handleDeleteSousModule = () => {
    if (deletingSousModule) {
      deleteSousModule(deletingSousModule.id);
      setDeletingSousModule(null);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('fr-FR');
  };

  const isActive = (ddeb: string, dfin: string) => {
    const now = new Date();
    const start = new Date(ddeb);
    const end = new Date(dfin);
    return now >= start && now <= end;
  };

  return (
    <MainLayout title="Paramètres" subtitle="Gestion des modules et configuration">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
          <p className="text-muted-foreground">
            Gérez les modules et sous-modules de l'application
          </p>
        </div>

        <Tabs defaultValue="modules" className="space-y-4">
          <TabsList>
            <TabsTrigger value="modules" className="gap-2">
              <Folder className="h-4 w-4" />
              Modules
            </TabsTrigger>
            <TabsTrigger value="sous-modules" className="gap-2">
              <FolderOpen className="h-4 w-4" />
              Sous-modules
            </TabsTrigger>
          </TabsList>

          {/* Modules Tab */}
          <TabsContent value="modules">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                  <CardTitle>Modules</CardTitle>
                  <CardDescription>
                    Liste des modules principaux de l'application
                  </CardDescription>
                </div>
                <Button onClick={() => { setEditingModule(null); setModuleModalOpen(true); }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouveau module
                </Button>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : modules.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Aucun module trouvé. Créez votre premier module.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Icône</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead>Libellé</TableHead>
                        <TableHead>Période</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {modules.map((module) => {
                        const ModuleIcon = getIconByCode(module.codeM);
                        const active = isActive(module.ddeb, module.dfin);
                        return (
                          <TableRow key={module.id}>
                            <TableCell>
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                                <ModuleIcon className="h-4 w-4 text-primary" />
                              </div>
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                              {module.codeM}
                            </TableCell>
                            <TableCell className="font-medium">
                              {module.libelle}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {formatDate(module.ddeb)} - {formatDate(module.dfin)}
                            </TableCell>
                            <TableCell>
                              <Badge variant={active ? 'default' : 'secondary'}>
                                {active ? 'Actif' : 'Inactif'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditModule(module)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => setDeletingModule(module)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sous-modules Tab */}
          <TabsContent value="sous-modules">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                  <CardTitle>Sous-modules</CardTitle>
                  <CardDescription>
                    Liste des sous-modules rattachés aux modules
                  </CardDescription>
                </div>
                <Button 
                  onClick={() => { setEditingSousModule(null); setSousModuleModalOpen(true); }}
                  disabled={modules.length === 0}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Nouveau sous-module
                </Button>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : sousModules.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {modules.length === 0 
                      ? 'Créez d\'abord un module pour ajouter des sous-modules.'
                      : 'Aucun sous-module trouvé. Créez votre premier sous-module.'}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Icône</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead>Libellé</TableHead>
                        <TableHead>Module parent</TableHead>
                        <TableHead>Période</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sousModules.map((sousModule) => {
                        const SousModuleIcon = getIconByCode(sousModule.codeS);
                        const active = isActive(sousModule.ddeb, sousModule.dfin);
                        return (
                          <TableRow key={sousModule.id}>
                            <TableCell>
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                                <SousModuleIcon className="h-4 w-4 text-secondary-foreground" />
                              </div>
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                              {sousModule.codeS}
                            </TableCell>
                            <TableCell className="font-medium">
                              {sousModule.libelle}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {sousModule.module?.libelle || '-'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {formatDate(sousModule.ddeb)} - {formatDate(sousModule.dfin)}
                            </TableCell>
                            <TableCell>
                              <Badge variant={active ? 'default' : 'secondary'}>
                                {active ? 'Actif' : 'Inactif'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditSousModule(sousModule)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => setDeletingSousModule(sousModule)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
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
        modules={modules}
        onSubmit={handleSousModuleSubmit}
        isLoading={isCreatingSousModule || isUpdatingSousModule}
      />

      {/* Delete Module Confirmation */}
      <AlertDialog open={!!deletingModule} onOpenChange={() => setDeletingModule(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le module ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le module "{deletingModule?.libelle}" et tous ses sous-modules seront supprimés.
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
              Cette action est irréversible. Le sous-module "{deletingSousModule?.libelle}" sera supprimé.
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
    </MainLayout>
  );
}
