import { 
  BedDouble, 
  Users, 
  TrendingUp, 
  DollarSign,
  LogIn,
  LogOut
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import StatCard from '@/components/dashboard/StatCard';
import OccupancyChart from '@/components/dashboard/OccupancyChart';
import TodayActivity from '@/components/dashboard/TodayActivity';
import RoomOverview from '@/components/dashboard/RoomOverview';
import RecentReservations from '@/components/dashboard/RecentReservations';
import QuickActions from '@/components/dashboard/QuickActions';
import { mockStats, mockRooms, mockReservations } from '@/data/mockData';

const Dashboard = () => {
  const todayArrivals = mockReservations.filter(r => 
    r.checkIn === '2026-01-06' && (r.status === 'confirmed' || r.status === 'pending')
  );
  const todayDepartures = mockReservations.filter(r => 
    r.checkOut === '2026-01-06' && r.status === 'checked-in'
  );

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
          <StatCard
            title="Taux d'Occupation"
            value={`${mockStats.occupancyRate}%`}
            icon={TrendingUp}
            variant="gold"
            trend={{ value: 5, positive: true }}
          />
        </div>
        <div className="animate-slide-up delay-200">
          <StatCard
            title="Chambres Occupées"
            value={`${mockStats.occupiedRooms}/${mockStats.totalRooms}`}
            subtitle={`${mockStats.availableRooms} disponibles`}
            icon={BedDouble}
          />
        </div>
        <div className="animate-slide-up delay-300">
          <StatCard
            title="Arrivées Aujourd'hui"
            value={todayArrivals.length}
            icon={LogIn}
            variant="success"
          />
        </div>
        <div className="animate-slide-up delay-400">
          <StatCard
            title="Revenu du Jour"
            value={`${mockStats.revenue.toLocaleString('fr-FR')} €`}
            subtitle={`Moy. ${mockStats.averageRate} €/nuit`}
            icon={DollarSign}
            trend={{ value: 12, positive: true }}
          />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        {/* Occupancy Chart */}
        <div className="animate-slide-up delay-200">
          <OccupancyChart 
            rate={mockStats.occupancyRate}
            occupied={mockStats.occupiedRooms}
            total={mockStats.totalRooms}
          />
        </div>

        {/* Today Activity */}
        <div className="animate-slide-up delay-300 lg:col-span-2">
          <TodayActivity 
            arrivals={todayArrivals}
            departures={todayDepartures}
          />
        </div>
      </div>

      {/* Room Overview */}
      <div className="mb-8 animate-slide-up delay-400">
        <RoomOverview rooms={mockRooms} />
      </div>

      {/* Recent Reservations */}
      <div className="animate-slide-up delay-400">
        <RecentReservations reservations={mockReservations} />
      </div>
    </MainLayout>
  );
};

export default Dashboard;
