"use strict";
// Backend utility para manejo de usuarios online en el servidor
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearAllOnlineUsers = exports.getUsersOnlineStatus = exports.getOnlineUsers = exports.isUserOnline = exports.setUserOffline = exports.setUserOnline = void 0;
// Set para usuarios online en memoria (más eficiente que base de datos)
var onlineUsers = new Set();
/**
 * Marca un usuario como online
 */
var setUserOnline = function (userEmail) {
    if (!userEmail) {
        console.warn("❌ setUserOnline: email es requerido");
        return;
    }
    onlineUsers.add(userEmail);
    console.log("\u2705 Usuario ".concat(userEmail, " marcado como online"));
    console.log("\uD83D\uDC65 Usuarios online: ".concat(onlineUsers.size));
};
exports.setUserOnline = setUserOnline;
/**
 * Marca un usuario como offline
 */
var setUserOffline = function (userEmail) {
    if (!userEmail) {
        console.warn("❌ setUserOffline: email es requerido");
        return;
    }
    onlineUsers.delete(userEmail);
    console.log("\u274C Usuario ".concat(userEmail, " marcado como offline"));
    console.log("\uD83D\uDC65 Usuarios online: ".concat(onlineUsers.size));
};
exports.setUserOffline = setUserOffline;
/**
 * Verifica si un usuario está online
 */
var isUserOnline = function (userEmail) {
    return onlineUsers.has(userEmail);
};
exports.isUserOnline = isUserOnline;
/**
 * Obtiene la lista de usuarios online
 */
var getOnlineUsers = function () {
    return Array.from(onlineUsers);
};
exports.getOnlineUsers = getOnlineUsers;
/**
 * Obtiene el estado online de múltiples usuarios
 */
var getUsersOnlineStatus = function (userEmails) {
    return userEmails.map(function (email) { return ({
        email: email,
        isOnline: onlineUsers.has(email)
    }); });
};
exports.getUsersOnlineStatus = getUsersOnlineStatus;
/**
 * Limpia todos los usuarios online (útil para reiniciar el servidor)
 */
var clearAllOnlineUsers = function () {
    onlineUsers.clear();
    console.log("🧹 Todos los usuarios online han sido limpiados");
};
exports.clearAllOnlineUsers = clearAllOnlineUsers;
