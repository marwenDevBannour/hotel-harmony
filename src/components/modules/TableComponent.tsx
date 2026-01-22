import { useState, useMemo } from 'react';
import { Search, Filter, MoreHorizontal, Plus, ChevronUp, ChevronDown, Download, Eye, Pencil, Trash2 } from 'lucide-react';
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
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { ComponentConfig, ColumnConfig, defaultTableConfig, mergeWithDefaultConfig } from '@/types/componentConfig';

// Données de démonstration
const generateDemoData = (columns: ColumnConfig[]) => {
  const statuses = ['Actif', 'En attente', 'Inactif', 'Terminé'];
  return Array.from({ length: 25 }, (_, i) => {
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

export function TableComponent({ sousModule, evnmt }: ModuleComponentProps) {
  // Récupérer la config depuis l'événement ou utiliser la config par défaut
  const config: ComponentConfig = useMemo(() => {
    const evnmtConfig = evnmt?.config as ComponentConfig | undefined;
    return mergeWithDefaultConfig('table', evnmtConfig);
  }, [evnmt]);

  const columns = config.columns || defaultTableConfig.columns || [];
  const pageSize = config.pageSize || 10;
  const actions = config.actions || {};

  const [search, setSearch] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  // Générer des données de démo basées sur les colonnes configurées
  const demoData = useMemo(() => generateDemoData(columns), [columns]);

  // Filtrage
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

  // Tri
  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortColumn, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(paginatedData.map((item) => item.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedRows([...selectedRows, id]);
    } else {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    }
  };

  const getBadgeVariant = (value: string, column: ColumnConfig) => {
    if (column.badgeVariants && column.badgeVariants[value]) {
      return column.badgeVariants[value];
    }
    // Fallback basé sur le texte
    switch (value) {
      case 'Actif':
      case 'Terminé':
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
      case 'actions':
        return null; // Géré séparément
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
        <div className="flex items-center gap-2">
          {actions.export && (
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
          )}
          {actions.create && (
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter
            </Button>
          )}
        </div>
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

        {selectedRows.length > 0 && (
          <div className="flex items-center gap-2 mb-4 p-2 bg-muted rounded-md">
            <span className="text-sm text-muted-foreground">
              {selectedRows.length} élément(s) sélectionné(s)
            </span>
            <Button variant="ghost" size="sm" onClick={() => setSelectedRows([])}>
              Désélectionner
            </Button>
            {actions.delete && (
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </Button>
            )}
          </div>
        )}

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      paginatedData.length > 0 &&
                      paginatedData.every((item) => selectedRows.includes(item.id))
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                {columns.filter(c => c.type !== 'actions').map((column) => (
                  <TableHead
                    key={column.key}
                    className={column.sortable ? 'cursor-pointer select-none' : ''}
                    style={column.width ? { width: column.width } : undefined}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center gap-1">
                      {column.label}
                      {column.sortable && sortColumn === column.key && (
                        sortDirection === 'asc' ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )
                      )}
                    </div>
                  </TableHead>
                ))}
                {(actions.view || actions.edit || actions.delete) && (
                  <TableHead className="text-right w-20">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((item) => (
                <TableRow
                  key={item.id}
                  className={selectedRows.includes(item.id) ? 'bg-muted/50' : ''}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.includes(item.id)}
                      onCheckedChange={(checked) =>
                        handleSelectRow(item.id, checked as boolean)
                      }
                    />
                  </TableCell>
                  {columns.filter(c => c.type !== 'actions').map((column) => (
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
        </div>

        {sortedData.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Aucun résultat trouvé.
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Affichage {(currentPage - 1) * pageSize + 1} à{' '}
                {Math.min(currentPage * pageSize, sortedData.length)} sur{' '}
                {sortedData.length} résultats
              </span>
              <Select
                value={pageSize.toString()}
                onValueChange={() => {}}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        onClick={() => setCurrentPage(pageNum)}
                        isActive={currentPage === pageNum}
                        className="cursor-pointer"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
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
