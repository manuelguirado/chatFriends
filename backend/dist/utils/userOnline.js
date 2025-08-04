"use strict";
// Backend utility para manejo de usuarios online en el servidor
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearAllOnlineUsers = exports.getUsersOnlineStatus = exports.getOnlineUsers = exports.isUserOnline = exports.setUserOffline = exports.setUserOnline = void 0;
// Set para usuarios online en memoria (más eficiente que base de datos)
const onlineUsers = new Set();
/**
 * Marca un usuario como online
 */
const setUserOnline = (userEmail) => {
    if (!userEmail) {
        console.warn("❌ setUserOnline: email es requerido");
        return;
    }
    onlineUsers.add(userEmail);
    console.log(`✅ Usuario ${userEmail} marcado como online`);
    console.log(`👥 Usuarios online: ${onlineUsers.size}`);
};
exports.setUserOnline = setUserOnline;
/**
 * Marca un usuario como offline
 */
const setUserOffline = (userEmail) => {
    if (!userEmail) {
        console.warn("❌ setUserOffline: email es requerido");
        return;
    }
    onlineUsers.delete(userEmail);
    console.log(`❌ Usuario ${userEmail} marcado como offline`);
    console.log(`👥 Usuarios online: ${onlineUsers.size}`);
};
exports.setUserOffline = setUserOffline;
/**
 * Verifica si un usuario está online
 */
const isUserOnline = (userEmail) => {
    return onlineUsers.has(userEmail);
};
exports.isUserOnline = isUserOnline;
/**
 * Obtiene la lista de usuarios online
 */
const getOnlineUsers = () => {
    return Array.from(onlineUsers);
};
exports.getOnlineUsers = getOnlineUsers;
/**
 * Obtiene el estado online de múltiples usuarios
 */
const getUsersOnlineStatus = (userEmails) => {
    return userEmails.map(email => ({
        email,
        isOnline: onlineUsers.has(email)
    }));
};
exports.getUsersOnlineStatus = getUsersOnlineStatus;
/**
 * Limpia todos los usuarios online (útil para reiniciar el servidor)
 */
const clearAllOnlineUsers = () => {
    onlineUsers.clear();
    console.log("🧹 Todos los usuarios online han sido limpiados");
};
exports.clearAllOnlineUsers = clearAllOnlineUsers;
