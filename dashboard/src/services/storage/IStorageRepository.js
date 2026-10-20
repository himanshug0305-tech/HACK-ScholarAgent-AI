/**
 * Storage contract used by every hook in the dashboard.
 *
 * The local adapter is the default. A Supabase adapter can implement the same
 * methods later without touching a single React component.
 *
 * @typedef {Object} UserSession
 * @property {string} id
 * @property {string} userId
 * @property {string} username
 * @property {string} startedAt
 *
 * @typedef {Object} VaultDocument
 * @property {string} id
 * @property {string} userId
 * @property {string} type
 * @property {string} name
 * @property {string} fileName
 * @property {string} mimeType
 * @property {number} size
 * @property {'verified'|'review'} status
 * @property {boolean} [isSample]
 * @property {string} uploadedAt
 */

export class IStorageRepository {
  async loginDummyUser() {
    throw new Error('loginDummyUser() is not implemented')
  }

  async getSession() {
    throw new Error('getSession() is not implemented')
  }

  async logout() {
    throw new Error('logout() is not implemented')
  }

  async getProfile() {
    throw new Error('getProfile() is not implemented')
  }

  async saveProfile() {
    throw new Error('saveProfile() is not implemented')
  }

  async listDocuments() {
    throw new Error('listDocuments() is not implemented')
  }

  async uploadDocument() {
    throw new Error('uploadDocument() is not implemented')
  }

  async getDocumentBlob() {
    throw new Error('getDocumentBlob() is not implemented')
  }

  async deleteDocument() {
    throw new Error('deleteDocument() is not implemented')
  }

  async listOpportunities() {
    throw new Error('listOpportunities() is not implemented')
  }

  async getOpportunity() {
    throw new Error('getOpportunity() is not implemented')
  }

  async upsertOpportunity() {
    throw new Error('upsertOpportunity() is not implemented')
  }
}
