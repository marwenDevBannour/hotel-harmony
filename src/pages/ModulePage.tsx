import { useParams, Link, useSearchParams } from 'react-router-dom';
import { ChevronRight, Folder, AlertCircle, Component } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { useModules, EvnmtItem } from '@/hooks/useModules';
import { getIconByCode } from '@/lib/iconMapping';
import { getComponentByCode, hasComponent } from '@/lib/componentRegistry';
import '@/lib/initComponentRegistry'; // Initialise le registre
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export default function ModulePage() {
  const { moduleCode, sousModuleCode } = useParams<{ moduleCode: string; sousModuleCode?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const evnmtCode = searchParams.get('evnmt');
  const { modules, isLoading } = useModules();

  // Trouver le module correspondant
  const currentModule = modules.find(
    (m) => m.codeM.toLowerCase() === moduleCode?.toLowerCase()
  );

  // Trouver le sous-module si spécifié
  const currentSousModule = sousModuleCode
    ? currentModule?.sousModules.find(
        (sm) => sm.codeS.toLowerCase() === sousModuleCode.toLowerCase()
      )
    : null;

  const ModuleIcon = currentModule ? getIconByCode(currentModule.codeM) : Folder;
  const SousModuleIcon = currentSousModule ? getIconByCode(currentSousModule.codeS) : Folder;

  const title = currentSousModule?.libelle || currentModule?.libelle || 'Module';
  const subtitle = currentSousModule 
    ? `${currentModule?.libelle} > ${currentSousModule.libelle}`
    : currentModule?.libelle || '';

  if (isLoading) {
    return (
      <MainLayout title="Chargement..." subtitle="">
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!currentModule) {
    return (
      <MainLayout title="Module introuvable" subtitle="">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Module introuvable</AlertTitle>
          <AlertDescription>
            Le module "{moduleCode}" n'existe pas ou n'est pas accessible.
          </AlertDescription>
        </Alert>
      </MainLayout>
    );
  }

  if (sousModuleCode && !currentSousModule) {
    return (
      <MainLayout title="Sous-module introuvable" subtitle="">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Sous-module introuvable</AlertTitle>
          <AlertDescription>
            Le sous-module "{sousModuleCode}" n'existe pas dans le module "{currentModule.libelle}".
          </AlertDescription>
        </Alert>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={title} subtitle={subtitle}>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Accueil</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            {currentSousModule ? (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to={`/module/${moduleCode}`}>{currentModule.libelle}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage>{currentSousModule.libelle}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            ) : (
              <BreadcrumbItem>
                <BreadcrumbPage>{currentModule.libelle}</BreadcrumbPage>
              </BreadcrumbItem>
            )}
          </BreadcrumbList>
        </Breadcrumb>

        {/* Content */}
        {currentSousModule ? (
          // Afficher le composant correspondant au code du sous-module
          (() => {
            // Récupérer les événements actifs
            const activeEvnmts = currentSousModule.evnmts?.filter(e => e.bactif) || [];
            
            // Trouver l'événement sélectionné via l'URL ou prendre le premier actif
            let selectedEvnmt: EvnmtItem | undefined;
            if (evnmtCode) {
              selectedEvnmt = activeEvnmts.find(
                e => e.codeEvnmt?.toLowerCase() === evnmtCode.toLowerCase()
              );
            }
            if (!selectedEvnmt && activeEvnmts.length > 0) {
              selectedEvnmt = activeEvnmts[0];
            }

            // Fonction pour changer d'événement
            const handleEvnmtChange = (newEvnmtCode: string) => {
              setSearchParams({ evnmt: newEvnmtCode.toLowerCase() });
            };

            // Fonction pour rendre un composant d'événement
            const renderEvnmtComponent = (evnmt: EvnmtItem) => {
              let DynamicComponent = null;
              
              if (evnmt.componentType) {
                const typeCode = `TYPE_${evnmt.componentType.toUpperCase()}`;
                DynamicComponent = getComponentByCode(typeCode);
              }
              
              if (!DynamicComponent) {
                DynamicComponent = getComponentByCode(currentSousModule.codeS);
              }
              
              if (DynamicComponent) {
                return (
                  <DynamicComponent 
                    sousModule={currentSousModule} 
                    moduleCode={moduleCode || ''}
                    evnmt={evnmt}
                  />
                );
              }

              // Fallback si aucun composant n'est enregistré
              return (
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <SousModuleIcon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle>{evnmt.libelle}</CardTitle>
                        <CardDescription>
                          Code: {evnmt.codeEvnmt}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="gap-1">
                        <Component className="h-3 w-3" />
                        Composant non défini
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                      <SousModuleIcon className="mx-auto h-12 w-12 mb-4 opacity-50" />
                      <p className="text-lg font-medium">Composant non configuré</p>
                      <p className="text-sm mt-2">
                        Aucun composant n'est enregistré pour le type "{evnmt.componentType || 'non défini'}".
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            };

            // Si plusieurs événements actifs, afficher des onglets
            if (activeEvnmts.length > 1) {
              return (
                <Tabs 
                  value={selectedEvnmt?.codeEvnmt?.toLowerCase() || activeEvnmts[0]?.codeEvnmt?.toLowerCase()} 
                  onValueChange={handleEvnmtChange}
                  className="space-y-4"
                >
                  <TabsList className="flex-wrap h-auto gap-1">
                    {activeEvnmts.map((evnmt) => (
                      <TabsTrigger 
                        key={evnmt.id} 
                        value={evnmt.codeEvnmt?.toLowerCase() || ''}
                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                      >
                        {evnmt.libelle}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {activeEvnmts.map((evnmt) => (
                    <TabsContent key={evnmt.id} value={evnmt.codeEvnmt?.toLowerCase() || ''}>
                      {renderEvnmtComponent(evnmt)}
                    </TabsContent>
                  ))}
                </Tabs>
              );
            }

            // Si un seul événement ou aucun, afficher directement
            if (selectedEvnmt) {
              return renderEvnmtComponent(selectedEvnmt);
            }

            // Fallback si aucun événement
            return (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <SousModuleIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle>{currentSousModule.libelle}</CardTitle>
                      <CardDescription>
                        Code: {currentSousModule.codeS}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                    <SousModuleIcon className="mx-auto h-12 w-12 mb-4 opacity-50" />
                    <p className="text-lg font-medium">Aucun événement actif</p>
                    <p className="text-sm mt-2">
                      Ce sous-module n'a pas d'événement actif configuré.
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })()
        ) : (
          // Afficher la liste des sous-modules du module
          <>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <ModuleIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>{currentModule.libelle}</CardTitle>
                    <CardDescription>
                      Code: {currentModule.codeM} • {currentModule.sousModules.length} sous-module(s)
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {currentModule.sousModules.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {currentModule.sousModules.map((sousModule) => {
                  const SousIcon = getIconByCode(sousModule.codeS);
                  return (
                    <Link
                      key={sousModule.id}
                      to={`/module/${moduleCode}/${sousModule.codeS.toLowerCase()}`}
                    >
                      <Card className="h-full transition-all hover:shadow-md hover:border-primary/50 cursor-pointer">
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                              <SousIcon className="h-5 w-5 text-secondary-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-base truncate">
                                {sousModule.libelle}
                              </CardTitle>
                              <CardDescription className="text-xs">
                                {sousModule.codeS}
                              </CardDescription>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                          </div>
                        </CardHeader>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  <Folder className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>Aucun sous-module configuré pour ce module.</p>
                  <p className="text-sm mt-2">
                    Ajoutez des sous-modules depuis les <Link to="/settings" className="text-primary hover:underline">Paramètres</Link>.
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}
