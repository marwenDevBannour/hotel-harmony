import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GripVertical, Trash2 } from 'lucide-react';
import { ColumnConfig } from '@/types/componentConfig';

const columnTypes = [
  { value: 'text', label: 'Texte' },
  { value: 'number', label: 'Nombre' },
  { value: 'date', label: 'Date' },
  { value: 'badge', label: 'Badge' },
  { value: 'boolean', label: 'Booléen' },
];

interface SortableColumnItemProps {
  column: ColumnConfig;
  index: number;
  onUpdate: (index: number, updates: Partial<ColumnConfig>) => void;
  onRemove: (index: number) => void;
}

export function SortableColumnItem({ 
  column, 
  index, 
  onUpdate, 
  onRemove 
}: SortableColumnItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.key });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 'auto',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 p-2 border rounded-md bg-muted/30 ${
        isDragging ? 'shadow-lg ring-2 ring-primary/20' : ''
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="touch-none cursor-grab active:cursor-grabbing p-1 rounded hover:bg-muted"
        type="button"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </button>
      <Input
        value={column.key}
        onChange={(e) => onUpdate(index, { key: e.target.value })}
        placeholder="Clé"
        className="h-7 text-xs w-24"
      />
      <Input
        value={column.label}
        onChange={(e) => onUpdate(index, { label: e.target.value })}
        placeholder="Libellé"
        className="h-7 text-xs flex-1"
      />
      <Select
        value={column.type}
        onValueChange={(value) => onUpdate(index, { type: value as ColumnConfig['type'] })}
      >
        <SelectTrigger className="h-7 text-xs w-24">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {columnTypes.map((type) => (
            <SelectItem key={type.value} value={type.value} className="text-xs">
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex items-center gap-1">
        <Switch
          checked={column.sortable}
          onCheckedChange={(checked) => onUpdate(index, { sortable: checked })}
        />
        <span className="text-xs text-muted-foreground">Tri</span>
      </div>
      <Button
        size="icon"
        variant="ghost"
        className="h-7 w-7"
        onClick={() => onRemove(index)}
        type="button"
      >
        <Trash2 className="h-3 w-3 text-destructive" />
      </Button>
    </div>
  );
}
