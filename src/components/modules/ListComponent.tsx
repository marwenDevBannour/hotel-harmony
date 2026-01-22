import { useState, useMemo } from 'react';
import { Search, Filter, MoreHorizontal, Plus, Eye, Pencil, Trash2 } from 'lucide-react';
import { ModuleComponentProps } from '@/lib/componentRegistry';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { ComponentConfig, ColumnConfig, defaultListConfig, mergeWithDefaultConfig } from '@/types/componentConfig';

// Générer des données de démonstration basées sur les colonnes
const generateDemoData = (columns: ColumnConfig[]) => {
  const statuses = ['Actif', 'En attente', 'Inactif'];
  return Array.from({ length: 15 }, (_, i) => {
    const row: Record<string, any> = { id: i + 1 };
    columns.forEach(col => {
      if (col.key === 'id') return;
      switch (col.type) {
        case 'text':
          row[col.key] = `${col.label} ${i + 1}`;
          break;
        case 'number':
          row[col.key] = Math.floor(Math.random() * 1000);
          break;
        case 'date':
          row[col.key] = new Date(2026, 0, i + 1).toISOString().split('T')[0];
          break;
        case 'badge':
          row[col.key] = statuses[i % statuses.length];
          break;
        case 'boolean':
          row[col.key] = i % 2 === 0;
          break;
        default:
          row[col.key] = `Valeur ${i + 1}`;
      }
    });
    return row;
  });
};

export function ListComponent({ sousModule, evnmt }: ModuleComponentProps) {
  // Récupérer la config depuis l'événement ou utiliser la config par défaut
  const config: ComponentConfig = useMemo(() => {
    const evnmtConfig = evnmt?.config as ComponentConfig | undefined;
    return mergeWithDefaultConfig('list', evnmtConfig);
  }, [evnmt]);

  const columns = config.columns || defaultListConfig.columns || [];
  const pageSize = config.pageSize || 10;
  const actions = config.actions || {};

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Générer des données de démo basées sur les colonnes configurées
  const demoData = useMemo(() => generateDemoData(columns), [columns]);

  const filteredData = useMemo(() => {
    if (!search) return demoData;
    return demoData.filter((item) =>
      Object.values(item).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [demoData, search]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const getBadgeVariant = (value: string, column: ColumnConfig) => {
    if (column.badgeVariants && column.badgeVariants[value]) {
      return column.badgeVariants[value];
    }
    switch (value) {
      case 'Actif':
        return 'default';
      case 'En attente':
        return 'secondary';
      case 'Inactif':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const renderCellValue = (item: any, column: ColumnConfig) => {
    const value = item[column.key];
    
    switch (column.type) {
      case 'badge':
        return <Badge variant={getBadgeVariant(value, column)}>{value}</Badge>;
      case 'date':
        return new Date(value).toLocaleDateString('fr-FR');
      case 'boolean':
        return value ? '✓' : '✗';
      case 'number':
        return value?.toLocaleString('fr-FR');
      default:
        return value;
    }
  };

  const title = config.title || evnmt?.libelle || sousModule.libelle;
  const description = config.description;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {actions.create && (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} style={column.width ? { width: column.width } : undefined}>
                  {column.label}
                </TableHead>
              ))}
              {(actions.view || actions.edit || actions.delete) && (
                <TableHead className="text-right">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item) => (
              <TableRow key={item.id}>
                {columns.map((column) => (
                  <TableCell key={column.key}>
                    {renderCellValue(item, column)}
                  </TableCell>
                ))}
                {(actions.view || actions.edit || actions.delete) && (
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {actions.view && (
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Voir
                          </DropdownMenuItem>
                        )}
                        {actions.edit && (
                          <DropdownMenuItem>
                            <Pencil className="mr-2 h-4 w-4" />
                            Modifier
                          </DropdownMenuItem>
                        )}
                        {actions.delete && (
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredData.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Aucun résultat trouvé.
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-muted-foreground">
              Page {currentPage} sur {totalPages}
            </span>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((pageNum) => (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      onClick={() => setCurrentPage(pageNum)}
                      isActive={currentPage === pageNum}
                      className="cursor-pointer"
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
