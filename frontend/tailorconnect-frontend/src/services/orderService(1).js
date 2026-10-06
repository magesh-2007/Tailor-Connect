import * as storage from './storageService'

export const getOrders = async () => storage.getOrders()
export const getOrderById = async (id) => storage.getOrderById(id)
export const getOrdersForCustomer = async (customerId) => storage.getOrdersForCustomer(customerId)
export const getOrdersForTailor = async (tailorId) => storage.getOrdersForTailor(tailorId)
export const createOrder = async (payload) => storage.createOrder(payload)
export const updateOrderStatus = async (id, status) => storage.updateOrderStatus(id, status)
export const updateOrderProgress = async (id, progress) => storage.updateOrderProgress(id, progress)
