import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import { auth, db } from '../firebase/firebase.config'
import {
  registerUser,
  loginUser,
  loginWithGoogle,
  logoutUser,
  updateUserProfile,
  updateUserPhoto,
} from '../firebase/auth'

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null)

const toPlainUser = (firebaseUser) =>
  firebaseUser
    ? {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        createdAt: firebaseUser.metadata.creationTime,
      }
    : null

export function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState(null)
  const [loading, setLoading] = useState(true)
  // photoURL stays undefined until the Firestore profile says otherwise.
  const [profile, setProfile] = useState({ uid: null, photoURL: undefined })
  const uid = authUser?.uid

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setAuthUser(toPlainUser(firebaseUser))
      setLoading(false)
    })
    return unsubscribe
  }, [])

  // Keep the profile picture in sync with users/{uid}.
  useEffect(() => {
    if (!uid) return

    return onSnapshot(
      doc(db, 'users', uid),
      (snapshot) => {
        const photoURL = snapshot.data()?.photoURL
        setProfile({ uid, photoURL: typeof photoURL === 'string' ? photoURL : undefined })
      },
      (error) => console.error('Failed to load the user profile:', error)
    )
  }, [uid])

  const user = useMemo(() => {
    if (!authUser) return null
    const stored = profile.uid === authUser.uid ? profile.photoURL : undefined
    // '' means the user removed their picture on purpose.
    return stored === undefined ? authUser : { ...authUser, photoURL: stored || null }
  }, [authUser, profile])

  const register = useCallback(async (name, email, password) => {
    await registerUser({ name, email, password })
    // Pick up the display name that was set after the account was created.
    setAuthUser(toPlainUser(auth.currentUser))
  }, [])

  const login = useCallback((email, password) => loginUser({ email, password }), [])

  const googleLogin = useCallback(() => loginWithGoogle(), [])

  const logout = useCallback(() => logoutUser(), [])

  const updateProfileInfo = useCallback(async (values) => {
    await updateUserProfile(values)
    setAuthUser(toPlainUser(auth.currentUser))
  }, [])

  // Pass a data URL or http(s) link to set the picture, or '' to remove it.
  const updatePhoto = useCallback(async (photoURL) => {
    await updateUserPhoto(photoURL)
    setAuthUser(toPlainUser(auth.currentUser))
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      register,
      login,
      googleLogin,
      logout,
      updateProfileInfo,
      updatePhoto,
    }),
    [user, loading, register, login, googleLogin, logout, updateProfileInfo, updatePhoto]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}