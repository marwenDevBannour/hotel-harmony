import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Save, RotateCcw } from 'lucide-react';
import { ModuleComponentProps } from '@/lib/componentRegistry';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ComponentConfig, FieldConfig, defaultFormConfig, mergeWithDefaultConfig } from '@/types/componentConfig';

// Générer un schéma Zod dynamique basé sur la config des champs
function generateZodSchema(fields: FieldConfig[]) {
  const schemaFields: Record<string, z.ZodTypeAny> = {};

  fields.forEach((field) => {
    let fieldSchema: z.ZodTypeAny;

    switch (field.type) {
      case 'number':
        fieldSchema = z.coerce.number();
        if (field.min !== undefined) fieldSchema = (fieldSchema as z.ZodNumber).min(field.min);
        if (field.max !== undefined) fieldSchema = (fieldSchema as z.ZodNumber).max(field.max);
        break;
      case 'email':
        fieldSchema = z.string().email('Email invalide');
        break;
      case 'switch':
      case 'checkbox':
        fieldSchema = z.boolean();
        break;
      default:
        fieldSchema = z.string();
        if (field.minLength) fieldSchema = (fieldSchema as z.ZodString).min(field.minLength);
        if (field.maxLength) fieldSchema = (fieldSchema as z.ZodString).max(field.maxLength);
        if (field.pattern) fieldSchema = (fieldSchema as z.ZodString).regex(new RegExp(field.pattern));
    }

    if (!field.required && field.type !== 'switch' && field.type !== 'checkbox') {
      fieldSchema = fieldSchema.optional();
    }

    schemaFields[field.key] = fieldSchema;
  });

  return z.object(schemaFields);
}

// Générer les valeurs par défaut basées sur la config
function generateDefaultValues(fields: FieldConfig[]) {
  const defaults: Record<string, any> = {};

  fields.forEach((field) => {
    switch (field.type) {
      case 'switch':
      case 'checkbox':
        defaults[field.key] = false;
        break;
      case 'number':
        defaults[field.key] = field.min || 0;
        break;
      case 'date':
        defaults[field.key] = new Date().toISOString().split('T')[0];
        break;
      default:
        defaults[field.key] = '';
    }
  });

  return defaults;
}

export function FormComponent({ sousModule, evnmt }: ModuleComponentProps) {
  const { toast } = useToast();

  // Récupérer la config depuis l'événement ou utiliser la config par défaut
  const config: ComponentConfig = useMemo(() => {
    const evnmtConfig = evnmt?.config as ComponentConfig | undefined;
    return mergeWithDefaultConfig('form', evnmtConfig);
  }, [evnmt]);

  const fields = config.fields || defaultFormConfig.fields || [];

  // Générer le schéma et les valeurs par défaut dynamiquement
  const formSchema = useMemo(() => generateZodSchema(fields), [fields]);
  const defaultValues = useMemo(() => generateDefaultValues(fields), [fields]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = (data: any) => {
    console.log('Form submitted:', data);
    toast({
      title: 'Formulaire soumis',
      description: 'Les données ont été enregistrées avec succès.',
    });
    form.reset();
  };

  const renderField = (field: FieldConfig) => {
    return (
      <FormField
        key={field.key}
        control={form.control}
        name={field.key}
        render={({ field: formField }) => (
          <FormItem className={field.type === 'switch' ? 'flex flex-row items-center justify-between rounded-lg border p-4' : ''}>
            {field.type !== 'switch' && field.type !== 'checkbox' && (
              <FormLabel>{field.label}{field.required && <span className="text-destructive ml-1">*</span>}</FormLabel>
            )}
            <FormControl>
              {renderFieldControl(field, formField)}
            </FormControl>
            {field.type === 'switch' && (
              <div className="space-y-0.5">
                <FormLabel className="text-base">{field.label}</FormLabel>
              </div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  const renderFieldControl = (field: FieldConfig, formField: any) => {
    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            placeholder={field.placeholder}
            className="min-h-[100px]"
            {...formField}
          />
        );
      case 'select':
        return (
          <Select onValueChange={formField.onChange} value={formField.value}>
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || `Sélectionner ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'switch':
        return (
          <Switch
            checked={formField.value}
            onCheckedChange={formField.onChange}
          />
        );
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={formField.value}
              onCheckedChange={formField.onChange}
            />
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {field.label}
            </label>
          </div>
        );
      case 'number':
        return (
          <Input
            type="number"
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            {...formField}
          />
        );
      case 'date':
        return <Input type="date" {...formField} />;
      case 'email':
        return <Input type="email" placeholder={field.placeholder} {...formField} />;
      default:
        return <Input placeholder={field.placeholder} {...formField} />;
    }
  };

  const title = config.title || evnmt?.libelle || sousModule.libelle;
  const description = config.description || 'Remplissez le formulaire ci-dessous pour créer un nouvel élément.';

  // Grouper les champs pour un meilleur layout (2 colonnes pour les petits champs)
  const groupedFields = useMemo(() => {
    const small = ['text', 'number', 'email', 'date', 'select'];
    const large = ['textarea'];
    
    const result: { field: FieldConfig; span: 'half' | 'full' }[] = [];
    
    fields.forEach((field) => {
      if (large.includes(field.type) || field.type === 'switch') {
        result.push({ field, span: 'full' });
      } else {
        result.push({ field, span: 'half' });
      }
    });
    
    return result;
  }, [fields]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {groupedFields.map(({ field, span }) => (
                <div key={field.key} className={span === 'full' ? 'md:col-span-2' : ''}>
                  {renderField(field)}
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => form.reset()}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Réinitialiser
              </Button>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
