import api from './api'
import { withFallback } from './helpers'
import { appointments } from '../data/mockData'

export const getAppointments = () => withFallback(() => api.get('/appointments'), appointments)
export const createAppointment = (payload) =>
  withFallback(() => api.post('/appointments', payload), { ...payload, id: Date.now(), status: 'pending' })
