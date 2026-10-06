import * as storage from './storageService'

export const getCourses = async () => storage.getOffers().filter((o) => o.type === 'Course' || o.targetAudience === 'Student')
export const getAllOffers = async () => storage.getOffers()
export const getCourseById = async (id) => storage.getOfferById(id)
export const getCertificates = async (studentId) => studentId ? storage.getCertificatesForStudent(studentId) : storage.getCertificates()
export const registerForCourse = async (courseId, studentUser) => storage.registerForCourse(courseId, studentUser)
export const completeCourse = async (courseId, studentUser) => storage.completeCourseForStudent(courseId, studentUser)
