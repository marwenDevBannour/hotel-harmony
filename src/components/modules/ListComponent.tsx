import { useState } from 'react';
import { Search, Filter, MoreHorizontal, Plus } from 'lucide-react';
import { ModuleComponentProps } from '@/lib/componentRegistry';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

// Données de démonstration
const demoData = [
  { id: 1, nom: 'Élément 1', statut: 'Actif', date: '2026-01-01' },
  { id: 2, nom: 'Élément 2', statut: 'En attente', date: '2026-01-02' },
  { id: 3, nom: 'Élément 3', statut: 'Actif', date: '2026-01-03' },
  { id: 4, nom: 'Élément 4', statut: 'Inactif', date: '2026-01-04' },
  { id: 5, nom: 'Élément 5', statut: 'Actif', date: '2026-01-05' },
];

export function ListComponent({ sousModule }: ModuleComponentProps) {
  const [search, setSearch] = useState('');

  const filteredData = demoData.filter((item) =>
    item.nom.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusVariant = (statut: string) => {
    switch (statut) {
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>{sousModule.libelle}</CardTitle>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
              <TableHead>ID</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-mono text-sm">{item.id}</TableCell>
                <TableCell className="font-medium">{item.nom}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(item.statut)}>{item.statut}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(item.date).toLocaleDateString('fr-FR')}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Voir</DropdownMenuItem>
                      <DropdownMenuItem>Modifier</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredData.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Aucun résultat trouvé.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
