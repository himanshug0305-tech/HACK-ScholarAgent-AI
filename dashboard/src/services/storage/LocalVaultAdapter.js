import { IStorageRepository } from './IStorageRepository'
import {
  DEMO_USER_ID,
  DISCOVERED_OPPORTUNITY,
  SEED_DOCUMENTS,
  SEED_OPPORTUNITIES,
  SEED_PROFILE,
} from './seed'

const KEYS = {
  session: 'scholaragent_session',
  profile: 'scholaragent_profile',
  documents: 'scholaragent_documents',
  opportunities: 'scholaragent_opportunities',
  seeded: 'scholaragent_seeded',
  discovery: 'scholaragent_last_discovery',
}

const BLOB_DB = 'ScholarAgentBlobDB'
const BLOB_STORE = 'files'

const clone = (value) => JSON.parse(JSON.stringify(value))

const readJson = (key, fallback) => {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const writeJson = (key, value) => {
  window.localStorage.setItem(key, JSON.stringify(value))
}

const makeId = (prefix) => {
  const suffix =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`
  return `${prefix}-${suffix}`
}

const openBlobDatabase = () =>
  new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('This browser cannot store document files locally.'))
      return
    }

    const request = window.indexedDB.open(BLOB_DB, 1)

    request.onupgradeneeded = () => {
      const database = request.result
      if (!database.objectStoreNames.contains(BLOB_STORE)) {
        database.createObjectStore(BLOB_STORE)
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('Could not open the document store.'))
  })

const withBlobStore = async (mode, operation) => {
  const database = await openBlobDatabase()
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(BLOB_STORE, mode)
    const store = transaction.objectStore(BLOB_STORE)
    let request

    try {
      request = operation(store)
    } catch (error) {
      database.close()
      reject(error)
      return
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('The document store did not respond.'))

    transaction.oncomplete = () => database.close()
    transaction.onerror = () => {
      database.close()
      reject(transaction.error ?? new Error('The document store ran into a problem.'))
    }
    transaction.onabort = () => database.close()
  })
}

export class LocalVaultAdapter extends IStorageRepository {
  async loginDummyUser(username, password) {
    if (!username?.trim() || !password?.trim()) {
      throw new Error('Enter a name and password to step inside.')
    }

    await this.seedDemoData()

    const session = {
      id: makeId('session'),
      userId: DEMO_USER_ID,
      username: username.trim(),
      startedAt: new Date().toISOString(),
    }

    writeJson(KEYS.session, session)
    return session
  }

  async getSession() {
    const session = readJson(KEYS.session, null)
    if (!session?.userId) return null
    return session
  }

  async logout() {
    window.localStorage.removeItem(KEYS.session)
  }

  async seedDemoData() {
    if (window.localStorage.getItem(KEYS.seeded) === 'true') {
      return
    }

    writeJson(KEYS.profile, clone(SEED_PROFILE))
    writeJson(KEYS.documents, clone(SEED_DOCUMENTS))
    writeJson(KEYS.opportunities, clone(SEED_OPPORTUNITIES))
    window.localStorage.setItem(KEYS.seeded, 'true')
  }

  async getProfile(userId = DEMO_USER_ID) {
    await this.seedDemoData()
    const profile = readJson(KEYS.profile, null)
    if (!profile) {
      const fallback = { ...clone(SEED_PROFILE), id: userId }
      writeJson(KEYS.profile, fallback)
      return fallback
    }
    return profile
  }

  async saveProfile(profile) {
    const next = {
      ...profile,
      id: profile.id ?? DEMO_USER_ID,
      updatedAt: new Date().toISOString(),
    }
    writeJson(KEYS.profile, next)
    return next
  }

  async listDocuments(userId = DEMO_USER_ID) {
    await this.seedDemoData()
    return readJson(KEYS.documents, []).filter((document) => document.userId === userId)
  }

  async uploadDocument(userId, metadata, fileBlob) {
    const id = makeId('doc')
    const document = {
      id,
      userId,
      type: metadata.type ?? 'other',
      name: metadata.name,
      fileName: metadata.fileName,
      mimeType: metadata.mimeType,
      size: metadata.size,
      status: 'verified',
      isSample: false,
      uploadedAt: new Date().toISOString(),
      verifiedAt: new Date().toISOString(),
      verificationNote: metadata.verificationNote ?? 'Looks clear — the name matches your profile.',
    }

    if (fileBlob) {
      await withBlobStore('readwrite', (store) => store.put(fileBlob, id))
    }

    const documents = readJson(KEYS.documents, [])
    writeJson(KEYS.documents, [document, ...documents])
    return document
  }

  async getDocumentBlob(documentId) {
    try {
      return await withBlobStore('readonly', (store) => store.get(documentId))
    } catch {
      return null
    }
  }

  async deleteDocument(documentId) {
    const documents = readJson(KEYS.documents, [])
    writeJson(
      KEYS.documents,
      documents.filter((document) => document.id !== documentId),
    )

    try {
      await withBlobStore('readwrite', (store) => store.delete(documentId))
    } catch {
      // Metadata is already gone. A stale blob must never block the UI.
    }
  }

  async listOpportunities(userId = DEMO_USER_ID) {
    await this.seedDemoData()
    return readJson(KEYS.opportunities, []).filter((opportunity) => opportunity.userId === userId)
  }

  async getOpportunity(opportunityId) {
    return readJson(KEYS.opportunities, []).find((opportunity) => opportunity.id === opportunityId) ?? null
  }

  async upsertOpportunity(opportunity) {
    const opportunities = readJson(KEYS.opportunities, [])
    const index = opportunities.findIndex((item) => item.id === opportunity.id)
    const next = { ...opportunity, userId: opportunity.userId ?? DEMO_USER_ID }

    if (index >= 0) {
      opportunities[index] = next
    } else {
      opportunities.unshift(next)
    }

    writeJson(KEYS.opportunities, opportunities)
    return next
  }

  async discoverNewOpportunity() {
    await this.seedDemoData()
    const opportunities = readJson(KEYS.opportunities, [])
    const checkedAt = new Date().toISOString()

    if (opportunities.some((item) => item.id === DISCOVERED_OPPORTUNITY.id)) {
      writeJson(KEYS.discovery, { lastCheckedAt: checkedAt, found: 0 })
      return null
    }

    const opportunity = { ...clone(DISCOVERED_OPPORTUNITY), discoveredAt: checkedAt }
    opportunities.unshift(opportunity)
    writeJson(KEYS.opportunities, opportunities)
    writeJson(KEYS.discovery, { lastCheckedAt: checkedAt, found: 1 })
    return opportunity
  }

  async getLastDiscovery() {
    return readJson(KEYS.discovery, null)
  }
}
