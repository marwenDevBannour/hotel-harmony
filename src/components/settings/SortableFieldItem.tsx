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
import { GripVertical, Settings2, Trash2, Type, Hash, Mail, Calendar, List, AlignLeft, ToggleLeft, CheckSquare } from 'lucide-react';
import { FieldConfig } from '@/types/componentConfig';

const fieldTypes = [
  { value: 'text', label: 'Texte' },
  { value: 'number', label: 'Nombre' },
  { value: 'email', label: 'Email' },
  { value: 'date', label: 'Date' },
  { value: 'select', label: 'Liste déroulante' },
  { value: 'textarea', label: 'Zone de texte' },
  { value: 'switch', label: 'Interrupteur' },
  { value: 'checkbox', label: 'Case à cocher' },
];

const fieldTypeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  text: Type,
  number: Hash,
  email: Mail,
  date: Calendar,
  select: List,
  textarea: AlignLeft,
  switch: ToggleLeft,
  checkbox: CheckSquare,
};

interface SortableFieldItemProps {
  field: FieldConfig;
  index: number;
  onUpdate: (index: number, updates: Partial<FieldConfig>) => void;
  onRemove: (index: number) => void;
  onOpenOptions: (index: number) => void;
}

export function SortableFieldItem({ 
  field, 
  index, 
  onUpdate, 
  onRemove, 
  onOpenOptions 
}: SortableFieldItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.key });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 'auto',
  };

  const FieldIcon = fieldTypeIcons[field.type] || Type;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 p-2 border rounded-md bg-muted/30 hover:bg-muted/50 transition-colors ${
        isDragging ? 'shadow-lg ring-2 ring-primary/20' : ''
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="touch-none cursor-grab active:cursor-grabbing p-1 rounded hover:bg-muted"
        type="button"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      </button>
      <div className="flex items-center justify-center w-7 h-7 rounded bg-primary/10 flex-shrink-0">
        <FieldIcon className="h-3.5 w-3.5 text-primary" />
      </div>
      <Input
        value={field.key}
        onChange={(e) => onUpdate(index, { key: e.target.value })}
        placeholder="Clé"
        className="h-7 text-xs w-20"
      />
      <Input
        value={field.label}
        onChange={(e) => onUpdate(index, { label: e.target.value })}
        placeholder="Libellé"
        className="h-7 text-xs flex-1"
      />
      <Select
        value={field.type}
        onValueChange={(value) => onUpdate(index, { type: value as FieldConfig['type'] })}
      >
        <SelectTrigger className="h-7 text-xs w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {fieldTypes.map((type) => {
            const TypeIcon = fieldTypeIcons[type.value] || Type;
            return (
              <SelectItem key={type.value} value={type.value} className="text-xs">
                <div className="flex items-center gap-2">
                  <TypeIcon className="h-3 w-3" />
                  {type.label}
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      <div className="flex items-center gap-1 flex-shrink-0">
        <Switch
          checked={field.required}
          onCheckedChange={(checked) => onUpdate(index, { required: checked })}
        />
        <span className="text-xs text-muted-foreground">Requis</span>
      </div>
      <Button
        size="icon"
        variant="ghost"
        className="h-7 w-7 flex-shrink-0"
        onClick={() => onOpenOptions(index)}
        title="Configurer les options avancées"
        type="button"
      >
        <Settings2 className="h-3 w-3" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="h-7 w-7 flex-shrink-0 hover:bg-destructive/10"
        onClick={() => onRemove(index)}
        title="Supprimer ce champ"
        type="button"
      >
        <Trash2 className="h-3 w-3 text-destructive" />
      </Button>
    </div>
  );
}
