// Backend utility para manejo de usuarios online en el servidor

// Set para usuarios online en memoria (más eficiente que base de datos)
const onlineUsers = new Set<string>();

/**
 * Marca un usuario como online
 */
export const setUserOnline = (userEmail: string): void => {
  if (!userEmail) {
    console.warn("❌ setUserOnline: email es requerido");
    return;
  }
  
  onlineUsers.add(userEmail);
  console.log(`✅ Usuario ${userEmail} marcado como online`);
  console.log(`👥 Usuarios online: ${onlineUsers.size}`);
};

/**
 * Marca un usuario como offline
 */
export const setUserOffline = (userEmail: string): void => {
  if (!userEmail) {
    console.warn("❌ setUserOffline: email es requerido");
    return;
  }
  
  onlineUsers.delete(userEmail);
  console.log(`❌ Usuario ${userEmail} marcado como offline`);
  console.log(`👥 Usuarios online: ${onlineUsers.size}`);
};

/**
 * Verifica si un usuario está online
 */
export const isUserOnline = (userEmail: string): boolean => {
  return onlineUsers.has(userEmail);
};

/**
 * Obtiene la lista de usuarios online
 */
export const getOnlineUsers = (): string[] => {
  return Array.from(onlineUsers);
};

/**
 * Obtiene el estado online de múltiples usuarios
 */
export const getUsersOnlineStatus = (userEmails: string[]): Array<{email: string, isOnline: boolean}> => {
  return userEmails.map(email => ({
    email,
    isOnline: onlineUsers.has(email)
  }));
};

/**
 * Limpia todos los usuarios online (útil para reiniciar el servidor)
 */
export const clearAllOnlineUsers = (): void => {
  onlineUsers.clear();
  console.log("🧹 Todos los usuarios online han sido limpiados");
};
