// Frontend utility para manejo de estado online de usuarios

export interface OnlineUserStatus {
  email: string;
  isOnline: boolean;
  lastSeen?: Date;
}

/**
 * Verifica el estado online de un usuario específico
 */
export const checkUserOnlineStatus = async (userEmail: string): Promise<boolean> => {
  try {
    const response = await fetch('/api/user/online-status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: userEmail }),
    });
    
    if (!response.ok) {
      console.warn(`❌ Error checking online status for ${userEmail}`);
      return false;
    }
    
    const data = await response.json();
    return data.isOnline || false;
  } catch (error) {
    console.error('Error checking user online status:', error);
    return false;
  }
};

/**
 * Obtiene el estado online de múltiples usuarios
 */
export const checkMultipleUsersOnlineStatus = async (userEmails: string[]): Promise<OnlineUserStatus[]> => {
  try {
    const response = await fetch('/api/user/multiple-online-status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ emails: userEmails }),
    });
    
    if (!response.ok) {
      console.warn('❌ Error checking multiple users online status');
      return userEmails.map(email => ({ email, isOnline: false }));
    }
    
    const data = await response.json();
    return data.users || userEmails.map(email => ({ email, isOnline: false }));
  } catch (error) {
    console.error('Error checking multiple users online status:', error);
    return userEmails.map(email => ({ email, isOnline: false }));
  }
};

/**
 * Marca al usuario actual como online (llamada al backend)
 */
export const setCurrentUserOnline = async (): Promise<void> => {
  try {
    await fetch('/api/user/set-online', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error setting user online:', error);
  }
};

/**
 * Marca al usuario actual como offline (llamada al backend)
 */
export const setCurrentUserOffline = async (): Promise<void> => {
  try {
    await fetch('/api/user/set-offline', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error setting user offline:', error);
  }
};
