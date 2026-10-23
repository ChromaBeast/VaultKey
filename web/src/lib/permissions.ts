export const isAdminRole = (role?: string): boolean => role === 'owner' || role === 'admin';
export const canWriteSecrets = (role?: string): boolean => isAdminRole(role) || role === 'write';
