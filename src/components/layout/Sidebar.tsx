import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BedDouble, 
  Calendar, 
  Users, 
  Receipt, 
  UserCog,
  UtensilsCrossed,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Hotel,
  LogOut,
  ChevronDown,
  Circle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useModules, SousModuleWithEvnmts } from '@/hooks/useModules';
import { getIconByCode } from '@/lib/iconMapping';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: number;
}

// Éléments de navigation fixes (menu hybride)
const fixedNavItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Tableau de Bord', href: '/' },
  { icon: BedDouble, label: 'Chambres', href: '/rooms' },
  { icon: Calendar, label: 'Réservations', href: '/reservations' },
  { icon: Users, label: 'Clients', href: '/guests' },
  { icon: Receipt, label: 'Facturation', href: '/billing' },
  { icon: UtensilsCrossed, label: 'Restauration', href: '/restaurant' },
];

const bottomNavItems: NavItem[] = [
  { icon: UserCog, label: 'Personnel', href: '/staff' },
  { icon: BarChart3, label: 'Rapports', href: '/reports' },
  { icon: Settings, label: 'Paramètres', href: '/settings' },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [openModules, setOpenModules] = useState<Record<number, boolean>>({});
  const [openSousModules, setOpenSousModules] = useState<Record<number, boolean>>({});
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { modules, isLoading: modulesLoading } = useModules();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const toggleModule = (moduleId: number) => {
    setOpenModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const toggleSousModule = (sousModuleId: number) => {
    setOpenSousModules(prev => ({
      ...prev,
      [sousModuleId]: !prev[sousModuleId]
    }));
  };

  const userInitials = user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || 'U';
  const userName = user?.firstName 
    ? `${user.firstName} ${user.lastName || ''}`
    : user?.email?.split('@')[0] || 'Utilisateur';

  const renderNavItem = (item: NavItem) => {
    const isActive = location.pathname === item.href;
    return (
      <Link
        key={item.href}
        to={item.href}
        className={cn(
          "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
          isActive 
            ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-gold" 
            : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
        )}
      >
        <item.icon className={cn(
          "h-5 w-5 shrink-0 transition-transform duration-200",
          !isActive && "group-hover:scale-110"
        )} />
        {!collapsed && (
          <span className="animate-fade-in truncate">{item.label}</span>
        )}
        {!collapsed && item.badge && (
          <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-xs font-semibold text-destructive-foreground">
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar text-sidebar-foreground transition-all duration-300 ease-out flex flex-col",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-20 items-center justify-between border-b border-sidebar-border px-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary">
            <Hotel className="h-6 w-6 text-sidebar-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <h1 className="font-display text-lg font-semibold tracking-wide">
                Grand Hôtel
              </h1>
              <p className="text-xs text-sidebar-foreground/60">Système PMS</p>
            </div>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-accent text-sidebar-accent-foreground transition-colors hover:bg-sidebar-accent/80"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Navigation principale */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col gap-1">
          {fixedNavItems.map(renderNavItem)}
        </div>

        {/* Modules dynamiques */}
        {!modulesLoading && modules.length > 0 && (
          <div className="mt-6">
            {!collapsed && (
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
                Modules
              </p>
            )}
            <div className="flex flex-col gap-1">
              {modules.map((module) => {
                const ModuleIcon = getIconByCode(module.codeM);
                const isOpen = openModules[module.id] || false;
                const hasSousModules = module.sousModules && module.sousModules.length > 0;

                if (!hasSousModules || collapsed) {
                  // Afficher comme un lien simple
                  return (
                    <Link
                      key={module.id}
                      to={`/module/${module.codeM.toLowerCase()}`}
                      className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all duration-200"
                    >
                      <ModuleIcon className="h-5 w-5 shrink-0 group-hover:scale-110 transition-transform duration-200" />
                      {!collapsed && (
                        <span className="animate-fade-in truncate">{module.libelle}</span>
                      )}
                    </Link>
                  );
                }

                // Afficher comme collapsible avec sous-modules
                return (
                  <Collapsible
                    key={module.id}
                    open={isOpen}
                    onOpenChange={() => toggleModule(module.id)}
                  >
                    <CollapsibleTrigger className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all duration-200">
                      <ModuleIcon className="h-5 w-5 shrink-0 group-hover:scale-110 transition-transform duration-200" />
                      <span className="flex-1 text-left truncate">{module.libelle}</span>
                      <ChevronDown className={cn(
                        "h-4 w-4 shrink-0 transition-transform duration-200",
                        isOpen && "rotate-180"
                      )} />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-4">
                      {module.sousModules.map((sousModule) => {
                        const SousModuleIcon = getIconByCode(sousModule.codeS);
                        const hasEvnmts = sousModule.evnmts && sousModule.evnmts.length > 1;
                        const isSousModuleOpen = openSousModules[sousModule.id] || false;

                        // Si le sous-module a plusieurs événements, afficher comme collapsible
                        if (hasEvnmts) {
                          return (
                            <Collapsible
                              key={sousModule.id}
                              open={isSousModuleOpen}
                              onOpenChange={() => toggleSousModule(sousModule.id)}
                            >
                              <CollapsibleTrigger className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all duration-200">
                                <SousModuleIcon className="h-4 w-4 shrink-0" />
                                <span className="flex-1 text-left truncate">{sousModule.libelle}</span>
                                <ChevronDown className={cn(
                                  "h-3 w-3 shrink-0 transition-transform duration-200",
                                  isSousModuleOpen && "rotate-180"
                                )} />
                              </CollapsibleTrigger>
                              <CollapsibleContent className="pl-4">
                                {sousModule.evnmts
                                  .filter(evnmt => evnmt.bactif)
                                  .map((evnmt) => (
                                    <Link
                                      key={evnmt.id}
                                      to={`/module/${module.codeM.toLowerCase()}/${sousModule.codeS.toLowerCase()}?evnmt=${evnmt.codeEvnmt?.toLowerCase()}`}
                                      className="group flex items-center gap-3 rounded-lg px-3 py-1.5 text-xs text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all duration-200"
                                    >
                                      <Circle className="h-2 w-2 shrink-0 fill-current" />
                                      <span className="truncate">{evnmt.libelle}</span>
                                    </Link>
                                  ))}
                              </CollapsibleContent>
                            </Collapsible>
                          );
                        }

                        // Sinon, afficher comme lien simple
                        return (
                          <Link
                            key={sousModule.id}
                            to={`/module/${module.codeM.toLowerCase()}/${sousModule.codeS.toLowerCase()}`}
                            className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all duration-200"
                          >
                            <SousModuleIcon className="h-4 w-4 shrink-0" />
                            <span className="truncate">{sousModule.libelle}</span>
                          </Link>
                        );
                      })}
                    </CollapsibleContent>
                  </Collapsible>
                );
              })}
            </div>
          </div>
        )}

        {/* Navigation inférieure */}
        <div className="mt-6 flex flex-col gap-1">
          {!collapsed && (
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
              Administration
            </p>
          )}
          {bottomNavItems.map(renderNavItem)}
        </div>
      </nav>

      {/* User */}
      <div className="border-t border-sidebar-border p-4">
        <div className={cn(
          "flex items-center gap-3",
          collapsed && "justify-center"
        )}>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-accent text-sm font-semibold">
            {userInitials}
          </div>
          {!collapsed && (
            <div className="flex-1 animate-fade-in">
              <p className="truncate text-sm font-medium">{userName}</p>
              <p className="truncate text-xs text-sidebar-foreground/60">{user?.email}</p>
            </div>
          )}
          {!collapsed && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
