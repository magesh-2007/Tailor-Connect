import api from './api'
import { withFallback } from './helpers'
import { complaints } from '../data/mockData'

export const getComplaints = () => withFallback(() => api.get('/admin/complaints'), complaints)
