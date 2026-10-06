import * as storage from './storageService'

export const getTailors = async () => storage.getTailors()
export const getTailorById = async (id) => {
  const tailors = storage.getTailors()
  return tailors.find((t) => t.id === id || String(t.id) === String(id))
}
export const getTailorOffers = async (tailorId) => storage.getOffersForTailor(tailorId)
export const getTailorPortfolio = async (tailorId) => storage.getPortfolioForTailor(tailorId)
export const getTailorReviews = async (tailorId) => storage.getReviewsForTailor(tailorId)
export const getTailorRating = (tailorId) => storage.getTailorAverageRating(tailorId)
export const updateTailorProfile = async (id, fields) => storage.updateUser(id, fields)
