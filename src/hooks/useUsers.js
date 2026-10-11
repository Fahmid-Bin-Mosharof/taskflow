import { useEffect, useMemo, useState } from 'react'
import { useAuth } from './useAuth'
import { fetchUsers } from '../firebase/users'
import { getFirestoreErrorMessage } from '../firebase/errors'
import { getDisplayName } from '../utils/userUtils'

export function useUsers() {
  const { user } = useAuth()
  const uid = user?.uid
  const [state, setState] = useState({ uid: null, users: [], error: '' })

  useEffect(() => {
    if (!uid) return
    let cancelled = false

    fetchUsers()
      .then((users) => {
        if (!cancelled) setState({ uid, users, error: '' })
      })
      .catch((err) => {
        if (!cancelled) {
          setState({ uid, users: [], error: getFirestoreErrorMessage(err) })
        }
      })

    return () => {
      cancelled = true
    }
  }, [uid])

  const loading = state.uid !== uid

  const users = useMemo(() => {
    if (!uid) return []
    const self = {
      id: uid,
      name: getDisplayName(user),
      email: user.email ?? '',
      photoURL: user.photoURL ?? '',
    }
    const list = loading ? [] : state.users
    const merged = list.some((item) => item.id === uid)
      ? list.map((item) => (item.id === uid ? { ...item, ...self } : item))
      : [...list, self]
    return merged.sort((a, b) => a.name.localeCompare(b.name))
  }, [uid, user, loading, state.users])

  return { users, loading, error: loading ? '' : state.error }
}