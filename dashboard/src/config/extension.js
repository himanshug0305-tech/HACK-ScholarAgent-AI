const fallbackUrl = `${import.meta.env.BASE_URL}downloads/scholaragent-companion.zip`

// Set VITE_EXTENSION_DOWNLOAD_URL to a GitHub Release asset or Chrome Web Store
// listing when you want the public site to fetch the companion from there.
export const EXTENSION_DOWNLOAD_URL = String(
  import.meta.env.VITE_EXTENSION_DOWNLOAD_URL || fallbackUrl,
).trim()

export const EXTENSION_DOWNLOAD_FILENAME = 'scholaragent-companion.zip'
