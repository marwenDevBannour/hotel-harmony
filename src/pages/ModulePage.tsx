import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Folder, AlertCircle, Component } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { useModules } from '@/hooks/useModules';
import { getIconByCode } from '@/lib/iconMapping';
import { getComponentByCode, hasComponent } from '@/lib/componentRegistry';
import '@/lib/initComponentRegistry'; // Initialise le registre
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
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
            // Chercher un événement actif avec un componentType défini
            const activeEvnmt = currentSousModule.evnmts?.find(e => e.bactif);
            
            // Déterminer quel composant charger:
            // 1. Par componentType de l'événement actif
            // 2. Par le code du sous-module
            let DynamicComponent = null;
            
            if (activeEvnmt?.componentType) {
              // Charger le composant basé sur le type de l'événement
              const typeCode = `TYPE_${activeEvnmt.componentType.toUpperCase()}`;
              DynamicComponent = getComponentByCode(typeCode);
            }
            
            // Fallback sur le code du sous-module
            if (!DynamicComponent) {
              DynamicComponent = getComponentByCode(currentSousModule.codeS);
            }
            
            if (DynamicComponent) {
              return (
                <DynamicComponent 
                  sousModule={currentSousModule} 
                  moduleCode={moduleCode || ''}
                  evnmt={activeEvnmt}
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
                      <CardTitle>{currentSousModule.libelle}</CardTitle>
                      <CardDescription>
                        Code: {currentSousModule.codeS}
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
                      Aucun composant n'est enregistré pour le code "{currentSousModule.codeS}".
                    </p>
                    <p className="text-xs mt-4">
                      Ajoutez un mapping dans <code className="bg-muted px-1 py-0.5 rounded">src/lib/initComponentRegistry.ts</code>
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
