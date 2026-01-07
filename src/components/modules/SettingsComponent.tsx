import { useState } from 'react';
import { Save, RotateCcw } from 'lucide-react';
import { ModuleComponentProps } from '@/lib/componentRegistry';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface SettingItem {
  id: string;
  label: string;
  description: string;
  type: 'toggle' | 'text' | 'number';
  value: boolean | string | number;
}

const defaultSettings: SettingItem[] = [
  {
    id: 'notifications',
    label: 'Notifications',
    description: 'Activer les notifications par email',
    type: 'toggle',
    value: true,
  },
  {
    id: 'autoSave',
    label: 'Sauvegarde automatique',
    description: 'Sauvegarder automatiquement les modifications',
    type: 'toggle',
    value: true,
  },
  {
    id: 'maxItems',
    label: 'Nombre maximum d\'éléments',
    description: 'Limite d\'éléments affichés par page',
    type: 'number',
    value: 50,
  },
  {
    id: 'defaultPrefix',
    label: 'Préfixe par défaut',
    description: 'Préfixe utilisé pour les nouveaux éléments',
    type: 'text',
    value: 'NEW-',
  },
  {
    id: 'darkMode',
    label: 'Mode sombre',
    description: 'Activer le thème sombre',
    type: 'toggle',
    value: false,
  },
];

export function SettingsComponent({ sousModule }: ModuleComponentProps) {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SettingItem[]>(defaultSettings);

  const handleSettingChange = (id: string, newValue: boolean | string | number) => {
    setSettings((prev) =>
      prev.map((setting) =>
        setting.id === id ? { ...setting, value: newValue } : setting
      )
    );
  };

  const handleSave = () => {
    toast({
      title: 'Paramètres sauvegardés',
      description: 'Vos modifications ont été enregistrées.',
    });
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    toast({
      title: 'Paramètres réinitialisés',
      description: 'Les paramètres ont été remis à leurs valeurs par défaut.',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{sousModule.libelle}</CardTitle>
        <CardDescription>
          Configurez les paramètres de ce module
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {settings.map((setting, index) => (
          <div key={setting.id}>
            {index > 0 && <Separator className="my-4" />}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor={setting.id} className="text-base">
                  {setting.label}
                </Label>
                <p className="text-sm text-muted-foreground">{setting.description}</p>
              </div>
              {setting.type === 'toggle' && (
                <Switch
                  id={setting.id}
                  checked={setting.value as boolean}
                  onCheckedChange={(checked) => handleSettingChange(setting.id, checked)}
                />
              )}
              {setting.type === 'text' && (
                <Input
                  id={setting.id}
                  value={setting.value as string}
                  onChange={(e) => handleSettingChange(setting.id, e.target.value)}
                  className="w-40"
                />
              )}
              {setting.type === 'number' && (
                <Input
                  id={setting.id}
                  type="number"
                  value={setting.value as number}
                  onChange={(e) => handleSettingChange(setting.id, parseInt(e.target.value, 10))}
                  className="w-24"
                />
              )}
            </div>
          </div>
        ))}

        <Separator className="my-6" />

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Réinitialiser
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Sauvegarder
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
