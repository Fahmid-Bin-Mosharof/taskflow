import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from './useAuth'
import {
  subscribeToProjectTasks,
  subscribeToUserTasks,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from '../firebase/tasks'
import { getFirestoreErrorMessage } from '../firebase/errors'

const EMPTY_RESULT = { scope: null, tasks: [], error: '' }
const NO_TASKS = []

export function useTasks(projectId) {
  const { user } = useAuth()
  const uid = user?.uid
  const scope = `${uid}:${projectId ?? 'all'}`
  const [result, setResult] = useState(EMPTY_RESULT)
  const [retryCount, setRetryCount] = useState(0)
  // { [taskId]: { status, token } } for moves that have not finished saving yet
  const [pendingMoves, setPendingMoves] = useState({})
  const moveCounter = useRef(0)

  useEffect(() => {
    if (!uid) return

    const handleData = (tasks) => setResult({ scope, tasks, error: '' })
    const handleError = (err) =>
      setResult({ scope, tasks: [], error: getFirestoreErrorMessage(err) })

    return projectId
      ? subscribeToProjectTasks(projectId, uid, handleData, handleError)
      : subscribeToUserTasks(uid, handleData, handleError)
  }, [uid, projectId, scope, retryCount])

  const retry = useCallback(() => {
    setResult(EMPTY_RESULT)
    setRetryCount((count) => count + 1)
  }, [])

  const addTask = useCallback(
    (values) => {
      if (!projectId) {
        return Promise.reject(new Error('A projectId is required to add a task'))
      }
      return createTask(uid, projectId, values)
    },
    [uid, projectId]
  )
  const editTask = useCallback((taskId, values) => updateTask(taskId, values), [])
  const removeTask = useCallback((taskId) => deleteTask(taskId), [])

  /**
   * Shows the new status immediately, then saves it. If saving fails the override
   * is removed (so the card returns to its column) and the error is rethrown.
   */
  const moveTask = useCallback(async (taskId, status) => {
    const token = ++moveCounter.current
    setPendingMoves((prev) => ({ ...prev, [taskId]: { status, token } }))

    try {
      await updateTaskStatus(taskId, status)
    } finally {
      setPendingMoves((prev) => {
        // A newer move of the same task owns the override now.
        if (prev[taskId]?.token !== token) return prev
        const next = { ...prev }
        delete next[taskId]
        return next
      })
    }
  }, [])

  // Loading until the first result for the *current* scope arrives.
  const loading = result.scope !== scope
  const baseTasks = loading ? NO_TASKS : result.tasks

  const tasks = useMemo(() => {
    if (Object.keys(pendingMoves).length === 0) return baseTasks
    return baseTasks.map((task) =>
      pendingMoves[task.id] ? { ...task, status: pendingMoves[task.id].status } : task
    )
  }, [baseTasks, pendingMoves])

  return {
    tasks,
    loading,
    error: loading ? '' : result.error,
    retry,
    addTask,
    editTask,
    removeTask,
    moveTask,
  }
}