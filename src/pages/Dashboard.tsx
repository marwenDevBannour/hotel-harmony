import { 
  BedDouble, 
  TrendingUp, 
  DollarSign,
  LogIn,
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import StatCard from '@/components/dashboard/StatCard';
import OccupancyChart from '@/components/dashboard/OccupancyChart';
import TodayActivity from '@/components/dashboard/TodayActivity';
import RoomOverview from '@/components/dashboard/RoomOverview';
import RecentReservations from '@/components/dashboard/RecentReservations';
import QuickActions from '@/components/dashboard/QuickActions';
import { useRooms, useRoomStats } from '@/hooks/useRooms';
import { useReservations, useTodayArrivals, useTodayDepartures } from '@/hooks/useReservations';
import { Skeleton } from '@/components/ui/skeleton';

const Dashboard = () => {
  const { data: rooms, isLoading: roomsLoading } = useRooms();
  const { data: roomStats, isLoading: statsLoading } = useRoomStats();
  const { data: reservations, isLoading: reservationsLoading } = useReservations();
  const { data: todayArrivals, isLoading: arrivalsLoading } = useTodayArrivals();
  const { data: todayDepartures, isLoading: departuresLoading } = useTodayDepartures();

  const isLoading = roomsLoading || statsLoading || reservationsLoading || arrivalsLoading || departuresLoading;

  // Calculate today's revenue (simplified)
  const todayRevenue = reservations
    ?.filter(r => r.status === 'checked_in')
    .reduce((acc, r) => acc + Number(r.total_amount), 0) || 0;

  const averageRate = reservations && reservations.length > 0
    ? Math.round(reservations.reduce((acc, r) => acc + Number(r.total_amount), 0) / reservations.length)
    : 0;

  return (
    <MainLayout 
      title="Tableau de Bord" 
      subtitle="Bienvenue au Grand Hôtel - Vue d'ensemble"
    >
      {/* Quick Actions */}
      <div className="mb-8 animate-fade-in">
        <QuickActions />
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="animate-slide-up delay-100">
          {statsLoading ? (
            <Skeleton className="h-32 w-full rounded-xl" />
          ) : (
            <StatCard
              title="Taux d'Occupation"
              value={`${roomStats?.occupancyRate || 0}%`}
              icon={TrendingUp}
              variant="gold"
              trend={{ value: 5, positive: true }}
            />
          )}
        </div>
        <div className="animate-slide-up delay-200">
          {statsLoading ? (
            <Skeleton className="h-32 w-full rounded-xl" />
          ) : (
            <StatCard
              title="Chambres Occupées"
              value={`${roomStats?.occupied || 0}/${roomStats?.total || 0}`}
              subtitle={`${roomStats?.available || 0} disponibles`}
              icon={BedDouble}
            />
          )}
        </div>
        <div className="animate-slide-up delay-300">
          {arrivalsLoading ? (
            <Skeleton className="h-32 w-full rounded-xl" />
          ) : (
            <StatCard
              title="Arrivées Aujourd'hui"
              value={todayArrivals?.length || 0}
              icon={LogIn}
              variant="success"
            />
          )}
        </div>
        <div className="animate-slide-up delay-400">
          {reservationsLoading ? (
            <Skeleton className="h-32 w-full rounded-xl" />
          ) : (
            <StatCard
              title="Revenu Actif"
              value={`${todayRevenue.toLocaleString('fr-FR')} €`}
              subtitle={`Moy. ${averageRate} €/rés.`}
              icon={DollarSign}
              trend={{ value: 12, positive: true }}
            />
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        {/* Occupancy Chart */}
        <div className="animate-slide-up delay-200">
          {statsLoading ? (
            <Skeleton className="h-80 w-full rounded-xl" />
          ) : (
            <OccupancyChart 
              rate={roomStats?.occupancyRate || 0}
              occupied={roomStats?.occupied || 0}
              total={roomStats?.total || 0}
            />
          )}
        </div>

        {/* Today Activity */}
        <div className="animate-slide-up delay-300 lg:col-span-2">
          {arrivalsLoading || departuresLoading ? (
            <Skeleton className="h-80 w-full rounded-xl" />
          ) : (
            <TodayActivity 
              arrivals={todayArrivals || []}
              departures={todayDepartures || []}
            />
          )}
        </div>
      </div>

      {/* Room Overview */}
      <div className="mb-8 animate-slide-up delay-400">
        {roomsLoading ? (
          <Skeleton className="h-64 w-full rounded-xl" />
        ) : (
          <RoomOverview rooms={rooms || []} />
        )}
      </div>

      {/* Recent Reservations */}
      <div className="animate-slide-up delay-400">
        {reservationsLoading ? (
          <Skeleton className="h-96 w-full rounded-xl" />
        ) : (
          <RecentReservations reservations={reservations || []} />
        )}
      </div>
    </MainLayout>
  );
};

export default Dashboard;
