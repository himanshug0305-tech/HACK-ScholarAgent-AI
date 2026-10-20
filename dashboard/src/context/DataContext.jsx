import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { storage } from '../services/storage'

const DataContext = createContext(null)

export function DataProvider({ userId, children }) {
  const [profile, setProfile] = useState(null)
  const [documents, setDocuments] = useState([])
  const [opportunities, setOpportunities] = useState([])
  const [lastDiscovery, setLastDiscovery] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadEverything = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const [nextProfile, nextDocuments, nextOpportunities, nextDiscovery] = await Promise.all([
        storage.getProfile(userId),
        storage.listDocuments(userId),
        storage.listOpportunities(userId),
        storage.getLastDiscovery(),
      ])

      setProfile(nextProfile)
      setDocuments(nextDocuments)
      setOpportunities(nextOpportunities)
      setLastDiscovery(nextDiscovery)
    } catch (loadError) {
      setError(loadError?.message ?? 'We could not open your file just now.')
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    loadEverything()
  }, [loadEverything])

  const saveProfile = useCallback(async (nextProfile) => {
    const saved = await storage.saveProfile(nextProfile)
    setProfile(saved)
    return saved
  }, [])

  const uploadDocument = useCallback(
    async (metadata, fileBlob) => {
      const document = await storage.uploadDocument(userId, metadata, fileBlob)
      setDocuments((current) => [document, ...current])
      return document
    },
    [userId],
  )

  const removeDocument = useCallback(async (documentId) => {
    await storage.deleteDocument(documentId)
    setDocuments((current) => current.filter((document) => document.id !== documentId))
  }, [])

  const getDocumentBlob = useCallback((documentId) => storage.getDocumentBlob(documentId), [])

  const saveOpportunity = useCallback(async (opportunity) => {
    const saved = await storage.upsertOpportunity({ ...opportunity, userId })
    setOpportunities((current) => {
      const exists = current.some((item) => item.id === saved.id)
      return exists ? current.map((item) => (item.id === saved.id ? saved : item)) : [saved, ...current]
    })
    return saved
  }, [userId])

  const discoverNewOpportunity = useCallback(async () => {
    const found = await storage.discoverNewOpportunity()
    if (found) {
      setOpportunities((current) => {
        if (current.some((item) => item.id === found.id)) return current
        return [found, ...current]
      })
    }

    const discoveryState = await storage.getLastDiscovery()
    setLastDiscovery(discoveryState)
    return found
  }, [])

  const value = useMemo(
    () => ({
      profile,
      documents,
      opportunities,
      lastDiscovery,
      loading,
      error,
      saveProfile,
      uploadDocument,
      removeDocument,
      getDocumentBlob,
      saveOpportunity,
      discoverNewOpportunity,
      refresh: loadEverything,
    }),
    [
      profile,
      documents,
      opportunities,
      lastDiscovery,
      loading,
      error,
      saveProfile,
      uploadDocument,
      removeDocument,
      getDocumentBlob,
      saveOpportunity,
      discoverNewOpportunity,
      loadEverything,
    ],
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

const useData = () => {
  const context = useContext(DataContext)
  if (!context) throw new Error('This hook must be used inside DataProvider')
  return context
}

export const useProfile = () => {
  const { profile, saveProfile, loading } = useData()
  return { profile, saveProfile, loading }
}

export const useVaultDocuments = () => {
  const { documents, uploadDocument, removeDocument, getDocumentBlob, loading } = useData()
  return { documents, uploadDocument, removeDocument, getDocumentBlob, loading }
}

export const useOpportunities = () => {
  const { opportunities, saveOpportunity, discoverNewOpportunity, lastDiscovery, loading } = useData()
  return { opportunities, saveOpportunity, discoverNewOpportunity, lastDiscovery, loading }
}

export const useWorkspace = () => useData()
