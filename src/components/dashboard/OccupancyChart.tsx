import { cn } from '@/lib/utils';

interface OccupancyChartProps {
  rate: number;
  occupied: number;
  total: number;
}

const OccupancyChart = ({ rate, occupied, total }: OccupancyChartProps) => {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (rate / 100) * circumference;

  return (
    <div className="card-elevated p-6">
      <h3 className="mb-6 font-display text-lg font-semibold">Taux d'Occupation</h3>
      
      <div className="flex items-center justify-center">
        <div className="relative">
          <svg className="h-40 w-40 -rotate-90 transform">
            {/* Background circle */}
            <circle
              cx="80"
              cy="80"
              r="45"
              stroke="hsl(var(--secondary))"
              strokeWidth="12"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="80"
              cy="80"
              r="45"
              stroke="url(#goldGradient)"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(38 92% 50%)" />
                <stop offset="100%" stopColor="hsl(28 85% 45%)" />
              </linearGradient>
            </defs>
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-4xl font-bold text-foreground">{rate}%</span>
            <span className="text-sm text-muted-foreground">Occupé</span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-emerald-50 p-3 text-center">
          <p className="text-2xl font-semibold text-emerald-600">{occupied}</p>
          <p className="text-xs text-emerald-600/70">Occupées</p>
        </div>
        <div className="rounded-lg bg-secondary p-3 text-center">
          <p className="text-2xl font-semibold text-foreground">{total - occupied}</p>
          <p className="text-xs text-muted-foreground">Disponibles</p>
        </div>
      </div>
    </div>
  );
};

export default OccupancyChart;
