/** Maps Firestore error codes to messages that are safe to show users. */
export function getFirestoreErrorMessage(error) {
  switch (error?.code) {
    case 'permission-denied':
      return "You don't have permission to do that."
    case 'unauthenticated':
      return 'Your session has expired. Please log in again.'
    case 'unavailable':
    case 'deadline-exceeded':
      return 'Network error. Check your connection and try again.'
    case 'not-found':
      return 'That item no longer exists.'
    case 'resource-exhausted':
      return 'Too many requests. Please wait a moment and try again.'
    default:
      console.error('Unhandled Firestore error:', error)
      return 'Something went wrong. Please try again.'
  }
}