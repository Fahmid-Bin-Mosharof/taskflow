import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  GoogleAuthProvider,
} from 'firebase/auth'

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore'

import { auth, db } from './firebase.config'
import { isHttpUrl } from '../utils/validators'

const googleProvider = new GoogleAuthProvider()

/**
 * Creates users/{uid} on first sign-in.
 * On later sign-ins, only updates the email.
 */
async function saveUserProfile(user, name) {
  const userRef = doc(db, 'users', user.uid)

  try {
    const snapshot = await getDoc(userRef)

    if (!snapshot.exists()) {
      await setDoc(userRef, {
        name: name || user.displayName || '',
        email: user.email,
        photoURL: user.photoURL || '',
        createdAt: serverTimestamp(),
      })
    } else {
      await setDoc(
        userRef,
        { email: user.email },
        { merge: true }
      )
    }
  } catch (error) {
    console.error('Failed to save user profile:', error)
  }
}

/**
 * Registers a new user with email and password.
 */
export async function registerUser({ name, email, password }) {
  const { user } = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  )

  await updateProfile(user, { displayName: name })
  await saveUserProfile(user, name)

  return user
}

/**
 * Signs in using email and password.
 */
export async function loginUser({ email, password }) {
  const { user } = await signInWithEmailAndPassword(
    auth,
    email,
    password
  )

  return user
}

/**
 * Signs in using Google.
 */
export async function loginWithGoogle() {
  const { user } = await signInWithPopup(auth, googleProvider)

  await saveUserProfile(user)

  return user
}

/**
 * Signs out the current user.
 */
export function logoutUser() {
  return signOut(auth)
}

/**
 * Maps Firebase authentication errors to user-friendly messages.
 */
export function getAuthErrorMessage(error) {
  switch (error?.code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.'

    case 'auth/invalid-email':
      return 'Enter a valid email address.'

    case 'auth/weak-password':
      return 'Password must be at least 6 characters.'

    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Incorrect email or password.'

    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again.'

    case 'auth/network-request-failed':
      return 'Network error. Check your connection and try again.'

    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'Sign-in was cancelled.'

    case 'auth/popup-blocked':
      return 'The sign-in popup was blocked. Allow popups and try again.'

    default:
      console.error('Unhandled auth error:', error)
      return 'Something went wrong. Please try again.'
  }
}

/**
 * Ensures a user is signed in before updating their profile.
 */
function requireCurrentUser() {
  const current = auth.currentUser

  if (!current) {
    const error = new Error('No signed-in user')
    error.code = 'auth/no-current-user'
    throw error
  }

  return current
}

/**
 * Updates the display name in Firebase Auth and Firestore.
 */
export async function updateUserProfile({ name }) {
  const current = requireCurrentUser()

  await updateProfile(current, {
    displayName: name,
  })

  await setDoc(
    doc(db, 'users', current.uid),
    {
      name,
      email: current.email,
    },
    { merge: true }
  )
}

/**
 * Saves or removes the user's profile picture.
 * Supports data URLs, HTTP(S) URLs, or an empty string.
 */
export async function updateUserPhoto(photoURL) {
  const current = requireCurrentUser()

  // Save the profile picture in Firestore.
  await setDoc(
    doc(db, 'users', current.uid),
    {
      photoURL,
      email: current.email,
    },
    { merge: true }
  )

  // Firebase Auth cannot use data URLs as profile pictures.
  try {
    await updateProfile(current, {
      photoURL: isHttpUrl(photoURL) ? photoURL : null,
    })
  } catch (error) {
    console.error('Failed to update the Auth photo:', error)
  }
}