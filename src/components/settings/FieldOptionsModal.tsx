import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { FieldConfig } from '@/types/componentConfig';

interface FieldOptionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  field: FieldConfig | null;
  onSave: (field: FieldConfig) => void;
}

export function FieldOptionsModal({
  open,
  onOpenChange,
  field,
  onSave,
}: FieldOptionsModalProps) {
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
  const [placeholder, setPlaceholder] = useState('');
  const [minLength, setMinLength] = useState<number | undefined>();
  const [maxLength, setMaxLength] = useState<number | undefined>();
  const [min, setMin] = useState<number | undefined>();
  const [max, setMax] = useState<number | undefined>();
  const [pattern, setPattern] = useState('');

  useEffect(() => {
    if (field) {
      setOptions(field.options || []);
      setPlaceholder(field.placeholder || '');
      setMinLength(field.minLength);
      setMaxLength(field.maxLength);
      setMin(field.min);
      setMax(field.max);
      setPattern(field.pattern || '');
    }
  }, [field, open]);

  const handleAddOption = () => {
    setOptions([...options, { value: '', label: '' }]);
  };

  const handleUpdateOption = (index: number, updates: Partial<{ value: string; label: string }>) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], ...updates };
    setOptions(newOptions);
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  const handleSave = () => {
    if (!field) return;
    
    const updatedField: FieldConfig = {
      ...field,
      placeholder: placeholder || undefined,
      minLength: minLength,
      maxLength: maxLength,
      min: min,
      max: max,
      pattern: pattern || undefined,
      options: field.type === 'select' ? options.filter(o => o.value && o.label) : undefined,
    };
    
    onSave(updatedField);
    onOpenChange(false);
  };

  const isSelectField = field?.type === 'select';
  const isTextField = field?.type === 'text' || field?.type === 'email' || field?.type === 'textarea';
  const isNumberField = field?.type === 'number';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            Configurer le champ "{field?.label}"
          </DialogTitle>
          <DialogDescription>
            Définissez les options et la validation pour ce champ
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
          {/* Placeholder */}
          <div className="space-y-2">
            <Label>Placeholder</Label>
            <Input
              value={placeholder}
              onChange={(e) => setPlaceholder(e.target.value)}
              placeholder="Texte d'indication"
            />
          </div>

          {/* Text validation */}
          {isTextField && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Longueur min.</Label>
                <Input
                  type="number"
                  value={minLength ?? ''}
                  onChange={(e) => setMinLength(e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="0"
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label>Longueur max.</Label>
                <Input
                  type="number"
                  value={maxLength ?? ''}
                  onChange={(e) => setMaxLength(e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="255"
                  min={0}
                />
              </div>
            </div>
          )}

          {/* Number validation */}
          {isNumberField && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Valeur min.</Label>
                <Input
                  type="number"
                  value={min ?? ''}
                  onChange={(e) => setMin(e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Valeur max.</Label>
                <Input
                  type="number"
                  value={max ?? ''}
                  onChange={(e) => setMax(e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="100"
                />
              </div>
            </div>
          )}

          {/* Pattern for text */}
          {isTextField && (
            <div className="space-y-2">
              <Label>Pattern (regex)</Label>
              <Input
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="^[a-zA-Z]+$"
              />
              <p className="text-xs text-muted-foreground">
                Expression régulière pour valider le format
              </p>
            </div>
          )}

          {/* Select options */}
          {isSelectField && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Options de la liste</Label>
                <Button size="sm" variant="outline" onClick={handleAddOption} className="h-7 text-xs">
                  <Plus className="h-3 w-3 mr-1" />
                  Ajouter option
                </Button>
              </div>

              {options.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground text-sm border rounded-md bg-muted/30">
                  Aucune option configurée. Cliquez sur "Ajouter option" pour commencer.
                </div>
              ) : (
                <div className="space-y-2">
                  {options.map((option, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 border rounded-md bg-muted/30"
                    >
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                      <Input
                        value={option.value}
                        onChange={(e) => handleUpdateOption(index, { value: e.target.value })}
                        placeholder="Valeur"
                        className="h-8 text-sm flex-1"
                      />
                      <Input
                        value={option.label}
                        onChange={(e) => handleUpdateOption(index, { label: e.target.value })}
                        placeholder="Libellé"
                        className="h-8 text-sm flex-1"
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={() => handleRemoveOption(index)}
                      >
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSave}>
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
