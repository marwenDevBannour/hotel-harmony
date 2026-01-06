import MainLayout from '@/components/layout/MainLayout';
import { Construction } from 'lucide-react';

interface ComingSoonProps {
  title: string;
  description: string;
}

const ComingSoon = ({ title, description }: ComingSoonProps) => {
  return (
    <MainLayout title={title} subtitle={description}>
      <div className="flex h-[60vh] flex-col items-center justify-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gold/10">
          <Construction className="h-12 w-12 text-gold" />
        </div>
        <h2 className="mb-2 font-display text-2xl font-semibold">En Construction</h2>
        <p className="max-w-md text-center text-muted-foreground">
          Cette fonctionnalité sera bientôt disponible. Nous travaillons activement pour vous offrir la meilleure expérience possible.
        </p>
      </div>
    </MainLayout>
  );
};

export default ComingSoon;
