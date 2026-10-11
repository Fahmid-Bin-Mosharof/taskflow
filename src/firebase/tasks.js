import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from './firebase.config'

const tasksRef = collection(db, 'tasks')

const toDate = (value) => value?.toDate?.() ?? null

function normalizeTask(snapshot) {
  // 'estimate' fills in server timestamps locally until the server confirms them.
  const data = snapshot.data({ serverTimestamps: 'estimate' })
  return {
    id: snapshot.id,
    projectId: data.projectId,
    title: data.title ?? '',
    description: data.description ?? '',
    status: data.status ?? 'todo',
    priority: data.priority ?? 'medium',
    dueDate: toDate(data.dueDate),
    assignedTo: data.assignedTo || null,
    createdBy: data.createdBy,
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  }
}

function subscribe(q, onData, onError) {
  return onSnapshot(q, (snapshot) => onData(snapshot.docs.map(normalizeTask)), onError)
}

/** Real-time listener for one project's tasks. Returns the unsubscribe function. */
export function subscribeToProjectTasks(projectId, userId, onData, onError) {
  return subscribe(
    query(tasksRef, where('projectId', '==', projectId), where('createdBy', '==', userId)),
    onData,
    onError
  )
}

/** Real-time listener for every task the user created, across all projects. */
export function subscribeToUserTasks(userId, onData, onError) {
  return subscribe(query(tasksRef, where('createdBy', '==', userId)), onData, onError)
}

/** values.dueDate is a Date or null; values.assignedTo is a uid or empty. */
function toTaskFields({ title, description, status, priority, dueDate, assignedTo }) {
  return {
    title,
    description,
    status,
    priority,
    dueDate: dueDate ? Timestamp.fromDate(dueDate) : null,
    assignedTo: assignedTo || null,
  }
}

export function createTask(userId, projectId, values) {
  return addDoc(tasksRef, {
    ...toTaskFields(values),
    projectId,
    createdBy: userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export function updateTask(taskId, values) {
  return updateDoc(doc(db, 'tasks', taskId), {
    ...toTaskFields(values),
    updatedAt: serverTimestamp(),
  })
}

export function deleteTask(taskId) {
  return deleteDoc(doc(db, 'tasks', taskId))
}

/** Changes only the status, so a drag can never overwrite other edits to the task. */
export function updateTaskStatus(taskId, status) {
  return updateDoc(doc(db, 'tasks', taskId), {
    status,
    updatedAt: serverTimestamp(),
  })
}