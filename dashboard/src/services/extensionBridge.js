const EXTENSION_SOURCE = 'scholaragent-extension'

const extensionMarker = () =>
  document.documentElement.dataset.scholaragentExtension === 'ready' ||
  Boolean(window.__SCHOLARAGENT_EXTENSION__?.version)

/**
 * Sends a small hello to any installed companion and waits briefly for an
 * answer. The companion also leaves a DOM marker, so a page that finished
 * mounting just before the content script arrived can still detect it.
 */
export function checkForExtension(timeout = 1400) {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false)
      return
    }

    if (extensionMarker()) {
      resolve(true)
      return
    }

    let settled = false
    let interval
    let timer

    const finish = (connected) => {
      if (settled) return
      settled = true
      window.removeEventListener('message', handleMessage)
      window.clearTimeout(timer)
      window.clearInterval(interval)
      resolve(connected)
    }

    const ping = () => {
      window.postMessage(
        { source: 'scholaragent-dashboard', type: 'SCHOLARAGENT_EXTENSION_PING' },
        window.location.origin,
      )
    }

    const handleMessage = (event) => {
      if (event.source !== window) return
      const message = event.data
      if (
        message?.source === EXTENSION_SOURCE &&
        ['SCHOLARAGENT_EXTENSION_READY', 'SCHOLARAGENT_EXTENSION_SYNC'].includes(message?.type)
      ) {
        finish(true)
      }
    }

    timer = window.setTimeout(() => finish(extensionMarker()), timeout)
    interval = window.setInterval(() => {
      if (extensionMarker()) finish(true)
      else ping()
    }, 250)

    window.addEventListener('message', handleMessage)
    ping()
  })
}
