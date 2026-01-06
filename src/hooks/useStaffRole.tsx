import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type StaffRole = 'admin' | 'receptionist' | 'housekeeping' | 'restaurant' | 'maintenance';

export const useStaffRole = () => {
  const { user } = useAuth();
  const [roles, setRoles] = useState<StaffRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [isStaff, setIsStaff] = useState(false);

  useEffect(() => {
    if (!user) {
      setRoles([]);
      setIsStaff(false);
      setLoading(false);
      return;
    }

    const fetchRoles = async () => {
      const { data, error } = await supabase
        .from('staff_roles')
        .select('role')
        .eq('user_id', user.id);

      if (!error && data) {
        const userRoles = data.map(r => r.role as StaffRole);
        setRoles(userRoles);
        setIsStaff(userRoles.length > 0);
      }
      setLoading(false);
    };

    fetchRoles();
  }, [user]);

  const hasRole = (role: StaffRole) => roles.includes(role);
  const isAdmin = hasRole('admin');
  const isReceptionist = hasRole('receptionist') || isAdmin;
  const canManageReservations = isReceptionist;
  const canManageRooms = isReceptionist;
  const canManageGuests = isReceptionist;

  return {
    roles,
    loading,
    isStaff,
    isAdmin,
    isReceptionist,
    hasRole,
    canManageReservations,
    canManageRooms,
    canManageGuests,
  };
};
