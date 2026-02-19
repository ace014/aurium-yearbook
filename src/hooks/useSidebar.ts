import { useMemo } from "react";

export function useSidebar(user: any) {
  
  // kani na check kung admin ba ang ga login (case-insensitive para sure)
  const isAdmin = useMemo(() => {
    if (!user || !user.role) return false;
    const role = user.role.toLowerCase();
    return role === 'admin' || role === 'administrator';
  }, [user]);

  // fallback para dli ma blanko ang ubos kung wala silay gi set nga position
  const displayPosition = user?.position || (isAdmin ? "Administrator" : "Staff Member");

  // pwede kaayo nato i-derive diri daan ang initials sa avatar para limpyo sa UI
  const getInitials = (name: string) => {
    if (!name) return isAdmin ? 'AD' : 'ST';
    const parts = name.split(' ');
    if (parts.length > 1) {
        return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const userInitials = useMemo(() => getInitials(user?.name), [user?.name, isAdmin]);

  return {
    isAdmin,
    displayPosition,
    userInitials
  };
}