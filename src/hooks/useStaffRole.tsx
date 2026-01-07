import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';

export type StaffRole = 'admin' | 'receptionist' | 'housekeeping' | 'restaurant' | 'maintenance';

// API pour récupérer les rôles depuis Spring Boot
const fetchStaffRoles = async (userId: string): Promise<StaffRole[]> => {
  const token = localStorage.getItem('auth_token');
  if (!token) return [];

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/staff/roles/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) return [];

    const data = await response.json();
    return data as StaffRole[];
  } catch (error) {
    console.error('Error fetching staff roles:', error);
    return [];
  }
};

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

    const loadRoles = async () => {
      const userRoles = await fetchStaffRoles(String(user.id));
      setRoles(userRoles);
      setIsStaff(userRoles.length > 0);
      setLoading(false);
    };

    loadRoles();
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
