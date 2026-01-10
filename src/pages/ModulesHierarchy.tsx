import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useModules, ModuleWithSousModules, SousModuleWithEvnmts, EvnmtItem } from '@/hooks/useModules';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Layers, FolderOpen, Calendar, ChevronRight } from 'lucide-react';

export default function ModulesHierarchy() {
  const { modules, isLoading, error } = useModules();
  const [selectedModule, setSelectedModule] = useState<ModuleWithSousModules | null>(null);
  const [selectedSousModule, setSelectedSousModule] = useState<SousModuleWithEvnmts | null>(null);

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return '-';
    try {
      return format(new Date(dateStr), 'dd/MM/yyyy', { locale: fr });
    } catch {
      return dateStr;
    }
  };

  const isActive = (ddeb: string | null | undefined, dfin: string | null | undefined) => {
    const now = new Date();
    const start = ddeb ? new Date(ddeb) : null;
    const end = dfin ? new Date(dfin) : null;
    if (start && now < start) return false;
    if (end && now > end) return false;
    return true;
  };

  const handleModuleSelect = (module: ModuleWithSousModules) => {
    setSelectedModule(module);
    setSelectedSousModule(null);
  };

  const handleSousModuleSelect = (sousModule: SousModuleWithEvnmts) => {
    setSelectedSousModule(sousModule);
  };

  if (error) {
    return (
      <MainLayout title="Hiérarchie des Modules" subtitle="Gestion des modules, sous-modules et événements">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">Erreur: {error.message}</p>
          </CardContent>
        </Card>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Hiérarchie des Modules" subtitle="Sélectionnez un module pour voir ses sous-modules, puis un sous-module pour voir ses événements">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tableau des Modules */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Layers className="h-5 w-5 text-primary" />
              Modules
              <Badge variant="secondary" className="ml-auto">{modules.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : modules.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Aucun module trouvé</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Libellé</TableHead>
                    <TableHead className="text-center">Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {modules.map((module) => (
                    <TableRow
                      key={module.id}
                      className={`cursor-pointer transition-colors ${
                        selectedModule?.id === module.id 
                          ? 'bg-primary/10 border-l-2 border-l-primary' 
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => handleModuleSelect(module)}
                    >
                      <TableCell className="font-mono text-xs">{module.codeM}</TableCell>
                      <TableCell className="font-medium">{module.libelle}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={isActive(module.ddeb, module.dfin) ? 'default' : 'secondary'}>
                          {isActive(module.ddeb, module.dfin) ? 'Actif' : 'Inactif'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Tableau des Sous-Modules */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FolderOpen className="h-5 w-5 text-primary" />
              Sous-Modules
              {selectedModule && (
                <>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-normal text-muted-foreground truncate">
                    {selectedModule.libelle}
                  </span>
                  <Badge variant="secondary" className="ml-auto">
                    {selectedModule.sousModules.length}
                  </Badge>
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedModule ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Layers className="h-12 w-12 mb-3 opacity-20" />
                <p>Sélectionnez un module</p>
              </div>
            ) : selectedModule.sousModules.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Aucun sous-module</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Libellé</TableHead>
                    <TableHead className="text-center">Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedModule.sousModules.map((sm) => (
                    <TableRow
                      key={sm.id}
                      className={`cursor-pointer transition-colors ${
                        selectedSousModule?.id === sm.id 
                          ? 'bg-primary/10 border-l-2 border-l-primary' 
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => handleSousModuleSelect(sm)}
                    >
                      <TableCell className="font-mono text-xs">{sm.codeS}</TableCell>
                      <TableCell className="font-medium">{sm.libelle}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={isActive(sm.ddeb, sm.dfin) ? 'default' : 'secondary'}>
                          {isActive(sm.ddeb, sm.dfin) ? 'Actif' : 'Inactif'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Tableau des Événements */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-primary" />
              Événements
              {selectedSousModule && (
                <>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-normal text-muted-foreground truncate">
                    {selectedSousModule.libelle}
                  </span>
                  <Badge variant="secondary" className="ml-auto">
                    {selectedSousModule.evnmts.length}
                  </Badge>
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedSousModule ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <FolderOpen className="h-12 w-12 mb-3 opacity-20" />
                <p>Sélectionnez un sous-module</p>
              </div>
            ) : selectedSousModule.evnmts.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Aucun événement</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Libellé</TableHead>
                    <TableHead className="text-center">Actif</TableHead>
                    <TableHead>Début</TableHead>
                    <TableHead>Fin</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedSousModule.evnmts.map((evnmt) => (
                    <TableRow key={evnmt.id} className="hover:bg-muted/50">
                      <TableCell className="font-mono text-xs">{evnmt.codeEvnmt}</TableCell>
                      <TableCell className="font-medium">{evnmt.libelle}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={evnmt.bactif ? 'default' : 'outline'}>
                          {evnmt.bactif ? 'Oui' : 'Non'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(evnmt.ddeb)}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(evnmt.dfin)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
