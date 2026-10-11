import { useCallback, useEffect, useState } from 'react'
import { useAuth } from './useAuth'
import {
  subscribeToProjects,
  subscribeToProject,
  createProject,
  updateProject,
  deleteProject,
} from '../firebase/projects'
import { getFirestoreErrorMessage } from '../firebase/errors'

export function useProjects() {
  const { user } = useAuth()
  const uid = user?.uid
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    if (!uid) return

    const unsubscribe = subscribeToProjects(
      uid,
      (data) => {
        setProjects(data)
        setError('')
        setLoading(false)
      },
      (err) => {
        setError(getFirestoreErrorMessage(err))
        setLoading(false)
      }
    )
    return unsubscribe
  }, [uid, retryCount])

  const retry = useCallback(() => {
    setLoading(true)
    setError('')
    setRetryCount((count) => count + 1)
  }, [])

  const addProject = useCallback((values) => createProject(uid, values), [uid])
  const editProject = useCallback((projectId, values) => updateProject(projectId, values), [])
  const removeProject = useCallback((projectId) => deleteProject(projectId, uid), [uid])

  return { projects, loading, error, retry, addProject, editProject, removeProject }
}

const EMPTY_RESULT = { id: null, project: null, notFound: false, error: '' }

/** Loads one project in real time. */
export function useProject(projectId) {
  const [result, setResult] = useState(EMPTY_RESULT)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    if (!projectId) return

    const unsubscribe = subscribeToProject(
      projectId,
      (project) =>
        setResult({ id: projectId, project, notFound: project === null, error: '' }),
      (err) => {
        const denied = err?.code === 'permission-denied'
        setResult({
          id: projectId,
          project: null,
          notFound: denied,
          error: denied ? '' : getFirestoreErrorMessage(err),
        })
      }
    )
    return unsubscribe
  }, [projectId, retryCount])

  const retry = useCallback(() => {
    setResult(EMPTY_RESULT)
    setRetryCount((count) => count + 1)
  }, [])

  // Loading until the first result for the *current* projectId arrives.
  const loading = result.id !== projectId

  return {
    project: loading ? null : result.project,
    loading,
    notFound: !loading && result.notFound,
    error: loading ? '' : result.error,
    retry,
  }
}