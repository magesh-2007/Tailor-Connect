import * as storage from './storageService'

export const getCustomers = async () => storage.getCustomers()
export const getStudents = async () => storage.getStudents()
export const getAllTailors = async () => storage.getTailors()
export const getAllUsers = async () => storage.getUsers()
export const toggleUserStatus = async (id) => storage.toggleUserStatus(id)
export const verifyTailor = async (tailorId, verified) => storage.verifyTailor(tailorId, verified)
export const updateUser = async (id, fields) => storage.updateUser(id, fields)
