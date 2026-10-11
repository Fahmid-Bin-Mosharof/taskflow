import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore'
import { db } from './firebase.config'

const projectsRef = collection(db, 'projects')
const tasksRef = collection(db, 'tasks')

// Firestore allows at most 500 writes per batch; stay safely below it.
const BATCH_SIZE = 450

function normalizeProject(snapshot) {
  // 'estimate' fills in createdAt/updatedAt locally until the server confirms them.
  const data = snapshot.data({ serverTimestamps: 'estimate' })
  return {
    id: snapshot.id,
    name: data.name ?? '',
    description: data.description ?? '',
    ownerId: data.ownerId,
    createdAt: data.createdAt?.toDate() ?? null,
    updatedAt: data.updatedAt?.toDate() ?? null,
  }
}

/** Real-time listener. Returns the unsubscribe function. */
export function subscribeToProjects(userId, onData, onError) {
  const q = query(projectsRef, where('ownerId', '==', userId))
  return onSnapshot(
    q,
    (snapshot) => onData(snapshot.docs.map(normalizeProject)),
    onError
  )
}

export function createProject(userId, { name, description }) {
  return addDoc(projectsRef, {
    name,
    description,
    ownerId: userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export function updateProject(projectId, { name, description }) {
  return updateDoc(doc(db, 'projects', projectId), {
    name,
    description,
    updatedAt: serverTimestamp(),
  })
}

/**
 * Deletes a project and all of its tasks. Tasks go first and the project last,
 * so if something fails midway the project still exists and the delete can be retried.
 */
export async function deleteProject(projectId, userId) {
  const tasksQuery = query(
    tasksRef,
    where('projectId', '==', projectId),
    where('createdBy', '==', userId)
  )
  const taskDocs = (await getDocs(tasksQuery)).docs

  for (let i = 0; i < taskDocs.length; i += BATCH_SIZE) {
    const batch = writeBatch(db)
    taskDocs.slice(i, i + BATCH_SIZE).forEach((taskDoc) => batch.delete(taskDoc.ref))
    await batch.commit()
  }

  await deleteDoc(doc(db, 'projects', projectId))
}

/** Real-time listener for a single project. Calls onData(null) if it doesn't exist. */
export function subscribeToProject(projectId, onData, onError) {
  return onSnapshot(
    doc(db, 'projects', projectId),
    (snapshot) => onData(snapshot.exists() ? normalizeProject(snapshot) : null),
    onError
  )
}