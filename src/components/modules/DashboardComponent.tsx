import { TrendingUp, TrendingDown, Users, Calendar, CreditCard, Activity } from 'lucide-react';
import { ModuleComponentProps } from '@/lib/componentRegistry';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const stats = [
  {
    title: 'Total',
    value: '1,234',
    change: '+12%',
    trend: 'up',
    icon: Activity,
  },
  {
    title: 'Utilisateurs',
    value: '567',
    change: '+5%',
    trend: 'up',
    icon: Users,
  },
  {
    title: 'Réservations',
    value: '89',
    change: '-3%',
    trend: 'down',
    icon: Calendar,
  },
  {
    title: 'Revenus',
    value: '45,678 €',
    change: '+18%',
    trend: 'up',
    icon: CreditCard,
  },
];

const progressItems = [
  { label: 'Objectif mensuel', value: 75, color: 'bg-primary' },
  { label: 'Tâches complétées', value: 60, color: 'bg-green-500' },
  { label: 'Satisfaction client', value: 92, color: 'bg-blue-500' },
];

export function DashboardComponent({ sousModule }: ModuleComponentProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>{sousModule.libelle}</CardTitle>
          <CardDescription>
            Vue d'ensemble et indicateurs clés de performance
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {stat.trend === 'up' ? (
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                )}
                <span className={stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                  {stat.change}
                </span>
                <span className="ml-1">vs mois dernier</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Progression</CardTitle>
            <CardDescription>Suivi des objectifs en cours</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {progressItems.map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{item.label}</span>
                  <span className="font-medium">{item.value}%</span>
                </div>
                <Progress value={item.value} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
            <CardDescription>Dernières actions enregistrées</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: 'Nouvelle réservation', time: 'Il y a 5 min' },
                { action: 'Paiement reçu', time: 'Il y a 15 min' },
                { action: 'Check-in effectué', time: 'Il y a 30 min' },
                { action: 'Modification chambre', time: 'Il y a 1h' },
                { action: 'Nouveau client', time: 'Il y a 2h' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <span className="text-sm">{activity.action}</span>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
