import * as storage from './storageService'

export const getReviews = async (tailorIdOrName) => {
  if (!tailorIdOrName) return storage.getReviews()
  return storage.getReviewsForTailor(tailorIdOrName)
}

export const submitReview = async (payload) => storage.addReview(payload)
