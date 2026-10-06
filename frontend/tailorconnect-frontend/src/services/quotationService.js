import api from './api'
import { withFallback } from './helpers'
import { quotations } from '../data/mockData'

export const getQuotations = (orderId) =>
  withFallback(() => api.get(`/quotations?orderId=${orderId}`), quotations.filter((q) => !orderId || q.orderId === orderId))
export const submitQuotation = (payload) =>
  withFallback(() => api.post('/quotations', payload), { ...payload, id: `QT-${Math.floor(Math.random() * 900 + 100)}`, status: 'pending' })
