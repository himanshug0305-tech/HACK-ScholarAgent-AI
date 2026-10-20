/* ScholarAgent Companion — page reader, form filler, and dashboard bridge. */
;(function () {
  if (window.__scholaragentCompanionLoaded) return
  window.__scholaragentCompanionLoaded = true

  const Shared = self.ScholarAgentShared
  const EXTENSION_VERSION = '0.1.0'
  const HIGHLIGHT = '#0d9488'
  const HIGHLIGHT_SOFT = '#effbf7'

  const clean = (value, max = 220) =>
    String(value ?? '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, max)

  const isVisible = (element) => {
    if (!element || !(element instanceof HTMLElement)) return false
    if (element.hidden) return false
    const style = window.getComputedStyle(element)
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false
    return element.getClientRects().length > 0
  }

  const escapeAttribute = (value) => String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"')

  const uniqueSelector = (element) => {
    if (element.id) {
      const idSelector = `#${CSS.escape(element.id)}`
      if (document.querySelectorAll(idSelector).length === 1) return idSelector
    }

    const name = element.getAttribute('name')
    if (name) {
      const nameSelector = `${element.tagName.toLowerCase()}[name="${escapeAttribute(name)}"]`
      if (document.querySelectorAll(nameSelector).length === 1) return nameSelector
    }

    const testId = element.getAttribute('data-testid')
    if (testId) {
      const testSelector = `[data-testid="${escapeAttribute(testId)}"]`
      if (document.querySelectorAll(testSelector).length === 1) return testSelector
    }

    const path = []
    let current = element
    while (current && current.nodeType === Node.ELEMENT_NODE && current !== document.documentElement) {
      let part = current.tagName.toLowerCase()
      if (current.id) {
        part += `#${CSS.escape(current.id)}`
        path.unshift(part)
        break
      }
      const parent = current.parentElement
      if (parent) {
        const sameTag = Array.from(parent.children).filter((child) => child.tagName === current.tagName)
        if (sameTag.length > 1) part += `:nth-of-type(${sameTag.indexOf(current) + 1})`
      }
      path.unshift(part)
      current = current.parentElement
    }
    return path.join(' > ')
  }

  const labelFromLabelledBy = (element) => {
    const ids = element.getAttribute('aria-labelledby')
    if (!ids) return ''
    return ids
      .split(/\s+/)
      .map((id) => document.getElementById(id)?.innerText || '')
      .filter(Boolean)
      .join(' ')
  }

  const labelFor = (element) => {
    const pieces = []

    if (element.labels) {
      for (const label of element.labels) {
        const text = clean(label.innerText)
        if (text) pieces.push(text)
      }
    }

    const labelledBy = clean(labelFromLabelledBy(element))
    if (labelledBy) pieces.push(labelledBy)

    const ariaLabel = clean(element.getAttribute('aria-label'))
    if (ariaLabel) pieces.push(ariaLabel)

    const wrappedLabel = element.closest('label')
    if (wrappedLabel) {
      const text = clean(wrappedLabel.innerText)
      if (text) pieces.push(text)
    }

    if (!pieces.length) {
      let previous = element.previousElementSibling
      let hops = 0
      while (previous && hops < 3) {
        if (/^(LABEL|SPAN|P|DIV|STRONG|B)$/.test(previous.tagName)) {
          const text = clean(previous.innerText)
          if (text && text.length <= 120) {
            pieces.push(text)
            break
          }
        }
        previous = previous.previousElementSibling
        hops += 1
      }
    }

    if (!pieces.length) {
      const legend = element.closest('fieldset')?.querySelector('legend')
      if (legend) {
        const text = clean(legend.innerText)
        if (text) pieces.push(text)
      }
    }

    return clean([...new Set(pieces)].join(' '), 140)
  }

  const humanize = (value) =>
    clean(value)
      .replace(/[_-]+/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/\b\w/g, (char) => char.toUpperCase())

  const displayLabel = (element, label) =>
    label ||
    clean(element.getAttribute('placeholder')) ||
    clean(element.getAttribute('aria-label')) ||
    humanize(element.getAttribute('name') || element.id) ||
    'Untitled field'

  const collectField = (element) => {
    if (!element || element.disabled) return null
    const tag = element.tagName.toLowerCase()
    const type = (element.getAttribute('type') || (tag === 'select' ? 'select' : tag === 'textarea' ? 'textarea' : 'text')).toLowerCase()

    if (tag === 'input' && Shared.SKIPPED_INPUT_TYPES.has(type)) return null
    if (!isVisible(element)) return null

    const label = labelFor(element)
    return {
      tag,
      type,
      id: clean(element.id, 100),
      name: clean(element.getAttribute('name'), 120),
      label: displayLabel(element, label),
      placeholder: clean(element.getAttribute('placeholder'), 120),
      ariaLabel: clean(element.getAttribute('aria-label'), 140),
      required: Boolean(element.required || element.getAttribute('aria-required') === 'true'),
      readOnly: Boolean(element.readOnly),
      selector: uniqueSelector(element),
      options:
        tag === 'select'
          ? Array.from(element.options)
              .map((option) => clean(option.textContent, 80))
              .filter(Boolean)
              .slice(0, 30)
          : [],
    }
  }

  const collectUploadField = (element) => {
    if (!element || element.disabled) return null
    if (!isVisible(element)) return null
    return {
      label: displayLabel(element, labelFor(element)),
      name: clean(element.getAttribute('name'), 120),
      required: Boolean(element.required),
      selector: uniqueSelector(element),
    }
  }

  const collectPdfLinks = () => {
    const links = []
    const seen = new Set()
    for (const anchor of document.querySelectorAll('a[href]')) {
      let url
      try {
        url = new URL(anchor.getAttribute('href'), window.location.href)
      } catch {
        continue
      }
      if (!/^https?:$/.test(url.protocol)) continue
      const looksLikePdf = /\.pdf$/i.test(url.pathname) || /pdf/i.test(anchor.innerText)
      if (!looksLikePdf) continue
      const resolved = url.href
      if (seen.has(resolved)) continue
      seen.add(resolved)
      links.push({
        url: resolved,
        label: clean(anchor.innerText, 120) || 'Guidelines PDF',
      })
      if (links.length >= 8) break
    }
    return links
  }

  const scanPage = () => {
    const fields = []
    const uploadFields = []
    const elements = document.querySelectorAll('input, select, textarea')

    for (const element of elements) {
      const tag = element.tagName.toLowerCase()
      const type = (element.getAttribute('type') || '').toLowerCase()
      if (tag === 'input' && type === 'file') {
        const upload = collectUploadField(element)
        if (upload) uploadFields.push(upload)
        continue
      }
      const field = collectField(element)
      if (field) fields.push(field)
      if (fields.length >= 140) break
    }

    const visibleText = clean(document.body?.innerText || '', 16000)
    return {
      scannedAt: new Date().toISOString(),
      url: window.location.href,
      origin: window.location.origin,
      title: clean(document.title, 200) || 'Untitled page',
      fields,
      uploadFields,
      uploadFieldCount: uploadFields.length,
      pdfLinks: collectPdfLinks(),
      textSample: visibleText,
      formCount: document.forms.length,
      hasPasswordField: Boolean(document.querySelector('input[type="password"]')),
    }
  }

  const wait = (milliseconds) => new Promise((resolve) => window.setTimeout(resolve, milliseconds))

  const writeNativeValue = (element, value) => {
    if (element.tagName === 'SELECT') {
      const wanted = Shared.normalizeText(value)
      const options = Array.from(element.options)
      const exact = options.find(
        (option) => Shared.normalizeText(option.value) === wanted || Shared.normalizeText(option.textContent) === wanted,
      )
      const partial = options.find((option) => {
        const optionText = Shared.normalizeText(option.textContent)
        return optionText && (optionText.includes(wanted) || wanted.includes(optionText))
      })
      const chosen = exact || partial
      if (!chosen) return false
      const descriptor = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value')
      if (descriptor?.set) descriptor.set.call(element, chosen.value)
      else element.value = chosen.value
    } else if (element.tagName === 'TEXTAREA') {
      const descriptor = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')
      if (descriptor?.set) descriptor.set.call(element, value)
      else element.value = value
    } else if (element.tagName === 'INPUT') {
      const descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')
      if (descriptor?.set) descriptor.set.call(element, value)
      else element.value = value
    } else {
      return false
    }
    return true
  }

  const signalInput = (element) => {
    element.dispatchEvent(new Event('input', { bubbles: true }))
  }

  const finishValue = (element) => {
    element.dispatchEvent(new Event('change', { bubbles: true }))
    element.dispatchEvent(new Event('blur', { bubbles: true }))
  }

  const nativeSet = (element, value) => {
    if (!writeNativeValue(element, value)) return false
    signalInput(element)
    finishValue(element)
    return true
  }

  const canTypeValue = (element) => {
    if (element.tagName === 'TEXTAREA') return true
    if (element.tagName !== 'INPUT') return false
    const type = (element.getAttribute('type') || 'text').toLowerCase()
    return !['date', 'datetime-local', 'month', 'week', 'time', 'number', 'range', 'color'].includes(type)
  }

  const typeNativeValue = async (element, value) => {
    const text = String(value)
    if (!text) return nativeSet(element, text)
    const steps = Math.min(14, Math.max(2, text.length))
    const chunkSize = Math.max(1, Math.ceil(text.length / steps))

    for (let end = chunkSize; end < text.length; end += chunkSize) {
      if (!writeNativeValue(element, text.slice(0, end))) return false
      signalInput(element)
      await wait(13)
    }

    if (!writeNativeValue(element, text)) return false
    signalInput(element)
    await wait(22)
    finishValue(element)
    return true
  }

  const highlight = (element) => {
    element.style.setProperty('outline', `2px solid ${HIGHLIGHT}`, 'important')
    element.style.setProperty('outline-offset', '2px', 'important')
    element.style.setProperty('box-shadow', '0 0 0 5px rgba(13, 148, 136, 0.1)', 'important')
    element.style.setProperty('background-color', HIGHLIGHT_SOFT, 'important')
    element.dataset.scholaragentFilled = 'true'
    element.title = 'Filled by ScholarAgent. Review this field.'
  }

  const makeFillBadge = () => {
    const host = document.createElement('div')
    host.id = 'scholaragent-fill-progress'
    host.style.cssText =
      'all: initial; position: fixed; left: 50%; bottom: 22px; z-index: 2147483647; transform: translateX(-50%); pointer-events: none; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;'
    const shadow = host.attachShadow({ mode: 'open' })
    shadow.innerHTML = `<style>
      .badge { display: flex; align-items: center; gap: 9px; padding: 10px 14px; border: 1px solid rgba(255,255,255,.16); border-radius: 999px; background: #173b2f; color: #fffcf6; box-shadow: 0 12px 30px -14px rgba(15,43,34,.65); font-size: 12px; line-height: 1.2; white-space: nowrap; }
      .dot { width: 7px; height: 7px; flex: none; border-radius: 50%; background: #b8d8bd; box-shadow: 0 0 0 4px rgba(184,216,189,.13); }
      .count { color: #c9d7cb; font-variant-numeric: tabular-nums; }
      .done { background: #e1ede2; border-color: #b8ccb9; color: #173b2f; }
      .done .dot { background: #35634b; }
      .done .count { color: #4d5a52; }
    </style><div class="badge"><span class="dot"></span><span class="label">ScholarAgent is filling this form</span><span class="count"></span></div>`
    document.documentElement.appendChild(host)

    const badge = shadow.querySelector('.badge')
    const label = shadow.querySelector('.label')
    const count = shadow.querySelector('.count')

    return {
      update(index, total) {
        label.textContent = 'ScholarAgent is filling this form'
        count.textContent = `${index} of ${total}`
      },
      done(total) {
        badge.classList.add('done')
        label.textContent = total === 1 ? 'Filled 1 field' : `Filled ${total} fields`
        count.textContent = 'review before submit'
      },
      remove() {
        host.remove()
      },
    }
  }

  const fillPage = async (plan, animate) => {
    const filled = []
    const skipped = []
    const safePlan = Array.isArray(plan) ? plan.slice(0, 120) : []
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const animated = Boolean(animate) && !prefersReducedMotion
    const animatableCount = animated ? Math.min(safePlan.length, 24) : 0
    const badge = animated ? makeFillBadge() : null

    try {
      for (let index = 0; index < safePlan.length; index += 1) {
        const item = safePlan[index]
        if (!item || typeof item.selector !== 'string' || typeof item.value !== 'string') {
          skipped.push({ label: clean(item?.label) || 'A field', reason: 'Invalid field data' })
          continue
        }
        let element
        try {
          element = document.querySelector(item.selector)
        } catch {
          element = null
        }

        if (!element || !['INPUT', 'SELECT', 'TEXTAREA'].includes(element.tagName)) {
          skipped.push({ label: clean(item.label) || 'A field', reason: 'Field is no longer on the page' })
          continue
        }
        const type = (element.getAttribute('type') || '').toLowerCase()
        if (
          element.disabled ||
          element.readOnly ||
          ['file', 'password', 'hidden', 'submit', 'button', 'reset'].includes(type) ||
          !isVisible(element)
        ) {
          skipped.push({ label: clean(item.label) || 'A field', reason: 'Field cannot be filled' })
          continue
        }

        const animateField = animated && index < animatableCount
        if (animateField) {
          badge?.update(index + 1, safePlan.length)
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
          await wait(85)
          element.style.setProperty('outline', `2px solid ${HIGHLIGHT}`, 'important')
          element.style.setProperty('outline-offset', '2px', 'important')
          element.style.setProperty('box-shadow', '0 0 0 6px rgba(13, 148, 136, 0.13)', 'important')
          element.style.setProperty('background-color', HIGHLIGHT_SOFT, 'important')
          await wait(45)
        }

        const accepted =
          animateField && canTypeValue(element)
            ? await typeNativeValue(element, item.value)
            : nativeSet(element, item.value)

        if (accepted) {
          highlight(element)
          filled.push({ label: clean(item.label) || element.name || element.id || 'Field', value: item.value })
          if (animateField) await wait(75)
        } else {
          skipped.push({ label: clean(item.label) || 'A field', reason: 'No matching option' })
        }
      }
    } finally {
      if (badge) {
        badge.done(filled.length)
        await wait(1100)
        badge.remove()
      }
    }

    const submitCandidates = Array.from(
      document.querySelectorAll('button[type="submit"], input[type="submit"], button:not([type])'),
    ).filter((element) => isVisible(element))
    const submitText = submitCandidates.map((element) => clean(element.innerText || element.value, 80)).find(Boolean) || ''

    return {
      filled,
      skipped,
      filledCount: filled.length,
      submitFound: submitCandidates.length > 0,
      submitLabel: submitText,
    }
  }

  const highlightSubmit = () => {
    const candidates = Array.from(
      document.querySelectorAll(
        'button[type="submit"], input[type="submit"], button, input[type="button"], a[role="button"]',
      ),
    ).filter((element) => isVisible(element))
    const scored = candidates
      .map((element) => {
        const text = clean(element.innerText || element.value || element.getAttribute('aria-label'), 120)
        let score = 0
        if (element.matches('button[type="submit"], input[type="submit"]')) score += 5
        if (/\b(submit|apply|finish|complete|send application|register)\b/i.test(text)) score += 4
        if (/\b(verify|continue|next|review)\b/i.test(text)) score += 1
        return { element, text, score }
      })
      .sort((a, b) => b.score - a.score)

    const target = scored.find((item) => item.score >= 4) || scored[0]
    if (!target) return { found: false, label: '' }

    target.element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    target.element.style.setProperty('outline', '3px solid #bb5231', 'important')
    target.element.style.setProperty('outline-offset', '4px', 'important')
    target.element.style.setProperty('box-shadow', '0 0 0 6px rgba(187, 82, 49, 0.12)', 'important')
    return { found: true, label: target.text || 'Submit' }
  }

  if (!Shared) {
    console.warn('ScholarAgent shared helpers did not load on this page.')
    return
  }

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (!message || typeof message.type !== 'string') return false

    if (message.type === 'SCHOLARAGENT_PING') {
      sendResponse({ ok: true, version: EXTENSION_VERSION })
      return false
    }

    if (message.type === 'SCHOLARAGENT_SCAN') {
      try {
        sendResponse({ ok: true, scan: scanPage() })
      } catch (error) {
        sendResponse({ ok: false, error: error?.message || 'The page could not be read.' })
      }
      return false
    }

    if (message.type === 'SCHOLARAGENT_FILL') {
      ;(async () => {
        try {
          sendResponse({ ok: true, result: await fillPage(message.plan, message.animate) })
        } catch (error) {
          sendResponse({ ok: false, error: error?.message || 'The form could not be filled.' })
        }
      })()
      return true
    }

    if (message.type === 'SCHOLARAGENT_HIGHLIGHT_SUBMIT') {
      try {
        sendResponse({ ok: true, result: highlightSubmit() })
      } catch (error) {
        sendResponse({ ok: false, error: error?.message || 'Could not find the final button.' })
      }
      return false
    }

    return false
  })

  const isLocalDashboard = () => ['localhost', '127.0.0.1'].includes(window.location.hostname)

  const readDashboardSnapshot = () => {
    try {
      const session = JSON.parse(window.localStorage.getItem('scholaragent_session') || 'null')
      if (!session?.userId) return null
      return {
        session,
        profile: JSON.parse(window.localStorage.getItem('scholaragent_profile') || 'null'),
        documents: JSON.parse(window.localStorage.getItem('scholaragent_documents') || '[]'),
        dashboardUrl: window.location.origin,
      }
    } catch {
      return null
    }
  }

  const announceExtension = () => {
    window.postMessage(
      {
        source: 'scholaragent-extension',
        type: 'SCHOLARAGENT_EXTENSION_READY',
        version: EXTENSION_VERSION,
      },
      window.location.origin,
    )
  }

  if (isLocalDashboard()) {
    document.documentElement.dataset.scholaragentExtension = 'ready'
    let lastSnapshot = ''
    let initialised = false

    const syncSnapshot = () => {
      const snapshot = readDashboardSnapshot()
      if (!snapshot) return
      const fingerprint = JSON.stringify({
        userId: snapshot.session.userId,
        profile: snapshot.profile,
        documents: snapshot.documents,
        dashboardUrl: snapshot.dashboardUrl,
      })
      if (fingerprint === lastSnapshot && initialised) return
      lastSnapshot = fingerprint
      initialised = true
      try {
        chrome.runtime.sendMessage({ type: 'SCHOLARAGENT_DASHBOARD_SNAPSHOT', snapshot }, () => {
          void chrome.runtime.lastError
        })
      } catch {
        // The companion may have been reloaded while this tab stayed open.
      }
    }

    window.addEventListener('message', (event) => {
      if (event.source !== window) return
      const data = event.data
      if (data?.source === 'scholaragent-dashboard' && data?.type === 'SCHOLARAGENT_EXTENSION_PING') {
        announceExtension()
      }
    })

    announceExtension()
    window.setTimeout(syncSnapshot, 900)
    window.setInterval(syncSnapshot, 3500)
  }
})()
