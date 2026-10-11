import { collection, getDocs, limit, query } from 'firebase/firestore'
import { db } from './firebase.config'

/** Loads registered users (capped) for the assignee dropdown. */
export async function fetchUsers(max = 100) {
  const snapshot = await getDocs(query(collection(db, 'users'), limit(max)))

  return snapshot.docs.map((userDoc) => {
    const data = userDoc.data()
    return {
      id: userDoc.id,
      name: data.name?.trim() || data.email?.split('@')[0] || 'Unnamed user',
      email: data.email ?? '',
      photoURL: data.photoURL ?? '',
    }
  })
}