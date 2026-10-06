import * as storage from './storageService'

export const getNotifications = async (userId) => {
  if (!userId) return storage.getNotifications()
  return storage.getNotificationsForUser(userId)
}

export const markAsRead = async (id) => storage.markNotificationRead(id)
export const addNotification = async (payload) => storage.addNotification(payload)
