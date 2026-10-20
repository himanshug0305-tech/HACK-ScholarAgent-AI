/* ScholarAgent Companion — side panel interface. */
;(function () {
  const S = window.ScholarAgentShared
  const app = document.getElementById('app')
  const toastNode = document.getElementById('toast')
  const toastIcon = document.getElementById('toast-icon')
  const toastMessage = document.getElementById('toast-message')
  const isPopupWindow = new URLSearchParams(window.location.search).get('popup') === '1'

  if (!S) {
    app.innerHTML = '<div class="boot-screen"><div class="boot-inner">The companion could not load its shared helpers.</div></div>'
    return
  }

  const ICONS = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4.2-4.2"/>',
    pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    settings:
      '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 1.56V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.56-1H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.34-1.88l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.56V3a2 2 0 1 1 4 0v.09A1.7 1.7 0 0 0 15 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c.06.22.22.42.44.56.24.14.5.22.78.22H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1.22Z"/>',
    sync: '<path d="M21 12a9 9 0 0 1-15.4 6.4"/><path d="M3 12a9 9 0 0 1 15.4-6.4"/><path d="M3 4v5h5"/><path d="M21 20v-5h-5"/>',
    check: '<path d="m4 12 5 5L20 6"/>',
    alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 8h.01"/>',
    lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M8 13h8"/><path d="M8 17h6"/>',
    folder: '<path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>',
    external: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    arrowRight: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
    sparkle: '<path d="m12 3 1.4 4.1L17.5 8.5l-4.1 1.4L12 14l-1.4-4.1-4.1-1.4 4.1-1.4Z"/><path d="m19 14 .8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8Z"/>',
    browser: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/><path d="M7 6.5h.01"/><path d="M10 6.5h.01"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m8.5 12 2.2 2.2 4.8-5"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    chevronRight: '<path d="m9 18 6-6-6-6"/>',
    plus: '<path d="M12 5v14"/><path d="M5 12h14"/>',
    power: '<path d="M18.4 6.6a9 9 0 1 1-12.8 0"/><path d="M12 2v10"/>',
    key: '<circle cx="7.5" cy="15.5" r="3.5"/><path d="m10 13 7-7"/><path d="m14 6 3 3"/><path d="m17 3 3 3"/>',
    message: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"/><path d="M8 9h8"/><path d="M8 13h5"/>',
    plug: '<path d="M9 2v5"/><path d="M15 2v5"/><path d="M6 7h12v4a6 6 0 0 1-12 0Z"/><path d="M12 17v5"/>',
    refresh: '<path d="M20 6v5h-5"/><path d="M4 18v-5h5"/><path d="M18.4 9A7 7 0 0 0 6.2 6.2L4 11"/><path d="M5.6 15A7 7 0 0 0 17.8 17.8L20 13"/>',
    popout: '<path d="M14 4h6v6"/><path d="M20 4 11 13"/><rect x="4" y="8" width="12" height="12" rx="2"/>',
    motion: '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
  }

  const icon = (name, size = 15) =>
    `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.info}</svg>`

  const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ESCAPES[character])

  const brandMark = () => `<span class="brand-mark"><img src="icons/icon48.png" alt="" /></span>`

  const blankCheck = () => ({
    status: 'idle',
    scan: null,
    analysis: null,
    tab: null,
    error: '',
    ai: { status: 'idle', provider: '', analysis: null, error: '' },
  })

  const blankFill = () => ({
    status: 'idle',
    scan: null,
    analysis: null,
    tab: null,
    error: '',
    result: null,
  })

  const state = {
    ready: false,
    fatal: '',
    connection: null,
    workspace: { profile: null, documents: [], syncedAt: null },
    settings: { openaiKey: '', geminiKey: '', tinyfishKey: '', customPrompt: '', reducedMotion: false },
    settingsDraft: { openaiKey: '', geminiKey: '', tinyfishKey: '', customPrompt: '', reducedMotion: false },
    activeTab: null,
    view: 'check',
    discovery: { status: 'searching' },
    connecting: false,
    connectError: '',
    syncing: false,
    savingSettings: '',
    savingMotion: false,
    disconnectConfirm: false,
    check: blankCheck(),
    fill: blankFill(),
  }

  let toastTimer = null

  const request = async (type, payload = {}) => {
    try {
      const response = await chrome.runtime.sendMessage({ type, ...payload })
      return response || { ok: false, error: 'The companion did not answer. Try again.' }
    } catch (error) {
      const message = String(error?.message || '')
      return {
        ok: false,
        error: message.includes('Receiving end')
          ? 'The companion was reloaded. Close and reopen it from the toolbar.'
          : message || 'The companion ran into a problem. Try again.',
      }
    }
  }

  const timeAgo = (value) => {
    if (!value) return 'Not synced yet'
    const time = new Date(value).getTime()
    if (!Number.isFinite(time)) return 'Not synced yet'
    const diff = Math.max(0, Date.now() - time)
    if (diff < 60_000) return 'Just now'
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} min ago`
    if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} hr ago`
    return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' }).format(new Date(time))
  }

  const hostOf = (url) => S.hostFromUrl(url)
  const stripHash = (url) => String(url || '').split('#')[0]
  const samePage = (first, second) => Boolean(first && second && stripHash(first) === stripHash(second))

  const initialFor = (name) => {
    const clean = String(name || '').trim()
    return clean ? clean.charAt(0).toUpperCase() : 'S'
  }

  const formatCurrency = (value) => {
    const amount = Number(value)
    if (!Number.isFinite(amount)) return String(value ?? '')
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const fieldValue = (field) => {
    if (!field) return ''
    if (field.profileKey === 'annualIncome') return formatCurrency(field.value)
    if (field.profileKey === 'dateOfBirth') return S.formatDisplayDate(field.value) || field.value
    return String(field.value ?? '')
  }

  const formatList = (items) => {
    const clean = items.filter(Boolean)
    if (!clean.length) return ''
    if (clean.length === 1) return clean[0]
    if (clean.length === 2) return `${clean[0]} and ${clean[1]}`
    return `${clean.slice(0, -1).join(', ')}, and ${clean[clean.length - 1]}`
  }

  const providerName = () => (state.settings.openaiKey ? 'OpenAI' : state.settings.geminiKey ? 'Gemini' : '')

  const verifiedDocumentTypes = () =>
    new Set(
      (state.workspace.documents || [])
        .filter((document) => document?.status === 'verified' && document?.type)
        .map((document) => document.type),
    )

  const requiredDocsReady = (ids = S.REQUIRED_DOCUMENTS) => {
    const verified = verifiedDocumentTypes()
    return ids.filter((id) => verified.has(id)).length
  }

  const recomputeAnalysis = () => {
    if (state.check.scan) {
      state.check.analysis = S.analyzeScan(state.check.scan, state.workspace.profile, state.workspace.documents)
    }
    if (state.fill.scan) {
      state.fill.analysis = S.analyzeScan(state.fill.scan, state.workspace.profile, state.workspace.documents)
    }
  }

  const applyWorkspacePayload = (payload) => {
    if (payload.connection) state.connection = payload.connection
    if (payload.workspace) {
      state.workspace = {
        profile: payload.workspace.profile || null,
        documents: Array.isArray(payload.workspace.documents) ? payload.workspace.documents : [],
        syncedAt: payload.workspace.syncedAt || null,
      }
    }
    recomputeAnalysis()
  }

  const showToast = (message, tone = 'ok') => {
    if (!toastNode) return
    window.clearTimeout(toastTimer)
    toastMessage.textContent = String(message || '')
    toastIcon.innerHTML = icon(tone === 'error' ? 'alert' : 'check', 12)
    toastNode.classList.toggle('is-error', tone === 'error')
    toastNode.classList.add('is-visible')
    toastTimer = window.setTimeout(() => toastNode.classList.remove('is-visible'), 3600)
  }

  const tabContext = (tab = state.activeTab) => {
    if (!tab?.url) {
      return `<div class="tab-context"><span class="tab-mark">?</span><div class="tab-copy"><p class="tab-title">No browser tab is visible</p><p class="tab-url">Open the scholarship page first.</p></div></div>`
    }
    const host = hostOf(tab.url) || 'browser tab'
    const title = tab.title || 'Current browser tab'
    const mark = (title.match(/[A-Za-z0-9]/)?.[0] || host.charAt(0) || 'W').toUpperCase()
    const current = samePage(tab.url, state.activeTab?.url)
    return `<div class="tab-context">
      <span class="tab-mark">${esc(mark)}</span>
      <div class="tab-copy">
        <p class="tab-title">${esc(title)}</p>
        <p class="tab-url">${esc(host)}</p>
      </div>
      <span class="tab-live">${current ? 'Current tab' : 'Scanned tab'}</span>
    </div>`
  }

  const renderCheckRows = (checks = []) => {
    if (!checks.length) return ''
    return `<div class="check-list">${checks
      .map((check) => {
        const status = ['pass', 'review', 'unknown'].includes(check.status) ? check.status : 'unknown'
        const symbol = status === 'pass' ? 'check' : status === 'review' ? 'alert' : 'info'
        return `<div class="check-row status-${status}">
          <span class="check-icon">${icon(symbol, 11)}</span>
          <div class="check-body">
            <strong>${esc(check.label)}</strong>
            <p>${esc(check.detail)}</p>
          </div>
        </div>`
      })
      .join('')}</div>`
  }

  const renderDocRows = (ids = S.REQUIRED_DOCUMENTS) => {
    const verified = verifiedDocumentTypes()
    return `<div class="doc-list">${ids
      .map((docId) => {
        const meta = S.DOCUMENTS[docId] || { label: docId }
        const ready = verified.has(docId)
        return `<div class="doc-row ${ready ? '' : 'is-missing'}">
          <span class="doc-mark">${icon(ready ? 'file' : 'alert', 11)}</span>
          <div class="doc-copy">
            <strong>${esc(meta.label)}</strong>
            <p>${ready ? 'Verified in your vault' : 'Not uploaded yet'}</p>
          </div>
          <span class="doc-state">${ready ? 'Ready' : 'Missing'}</span>
        </div>`
      })
      .join('')}</div>`
  }

  const renderVaultCard = ({ ids = S.REQUIRED_DOCUMENTS, heading, copy } = {}) => {
    if (!ids.length) return ''
    const ready = requiredDocsReady(ids)
    return `<section class="check-card">
      <div class="section-head">
        <div>
          <h2>${esc(heading || 'Your document vault')}</h2>
          <p>${esc(copy || 'Checked against the papers in your desk.')}</p>
        </div>
        <span class="pill ${ready === ids.length ? 'pill-ok' : ''}">${ready}/${ids.length} ready</span>
      </div>
      ${renderDocRows(ids)}
    </section>`
  }

  const renderMissingDocsCard = (analysis, fillMode = false) => {
    if (!analysis?.missingDocs?.length) return ''
    const labels = analysis.missingDocs.map((docId) => S.DOCUMENTS[docId]?.label || docId)
    const safeLabels = labels.map((label) => esc(label))
    return `<section class="attention-card">
      <div class="attention-top">
        <span class="attention-mark">${icon('alert', 14)}</span>
        <div>
          <p class="eyebrow">Before filling</p>
          <h2>${labels.length === 1 ? 'A paper needs you.' : 'A few papers need you.'}</h2>
        </div>
      </div>
      <p>This page mentions ${formatList(safeLabels)}. Add ${labels.length === 1 ? 'it' : 'them'} to your document vault, then ${fillMode ? 'check this page again' : 'scan the page again'}.</p>
      <div class="btn-row">
        <button type="button" class="btn btn-primary btn-sm" data-action="open-dashboard" data-path="/documents">Open document vault</button>
        <button type="button" class="btn btn-secondary btn-sm" data-action="open-dashboard" data-path="/profile">Update profile</button>
        <button type="button" class="btn btn-ghost btn-sm" data-action="${fillMode ? 'rescan-fill' : 'recheck-page'}">Check again</button>
      </div>
    </section>`
  }

  const renderMissingProfileCard = (analysis, fillMode = false) => {
    if (!analysis?.requiredMissingFields?.length) return ''
    const labels = analysis.requiredMissingFields.map((field) => field.label || 'Required detail')
    return `<section class="attention-card">
      <div class="attention-top">
        <span class="attention-mark">${icon('user', 14)}</span>
        <div>
          <p class="eyebrow">A blank in your file</p>
          <h2>One detail needs your words.</h2>
        </div>
      </div>
      <p>The form asks for ${formatList(labels.map((label) => esc(label)))} but your synced profile has no value for it. Add it in your profile, then try again.</p>
      <div class="btn-row">
        <button type="button" class="btn btn-primary btn-sm" data-action="open-dashboard" data-path="/profile">Open my profile</button>
        <button type="button" class="btn btn-ghost btn-sm" data-action="${fillMode ? 'rescan-fill' : 'recheck-page'}">Check again</button>
      </div>
    </section>`
  }

  const renderAiCard = () => {
    const provider = providerName()
    const ai = state.check.ai
    if (!provider) {
      return `<section class="ai-card">
        <div class="ai-head">
          <span class="ai-spark">${icon('sparkle', 12)}</span>
          <strong>A deeper fine-print read</strong>
        </div>
        <p class="panel-copy">Add an OpenAI or Gemini key in Settings to ask a second reader about this page. Your custom prompt will be included.</p>
        <button type="button" class="link-button section-gap" data-action="nav" data-view="settings">Open settings ${icon('chevronRight', 10)}</button>
      </section>`
    }

    const loading = ai.status === 'loading'
    const ready = ai.status === 'ready' && ai.analysis
    return `<section class="ai-card">
      <div class="ai-head">
        <span class="ai-spark">${icon('sparkle', 12)}</span>
        <strong>${ready ? `${esc(ai.provider || provider)} second read` : 'A deeper fine-print read'}</strong>
        ${ready ? '<span class="pill pill-blue">AI</span>' : ''}
      </div>
      ${ready
        ? `<p class="ai-summary">${esc(ai.analysis.summary || 'The page has been read. Review the notes below.')}</p>
           ${renderCheckRows(ai.analysis.checks)}`
        : `<p class="panel-copy">${loading ? `Reading the visible fine print with ${esc(provider)}…` : `Ask ${esc(provider)} to compare this page with your file. Your custom prompt is included.`}</p>
           ${ai.status === 'error' ? `<p class="ai-error">${esc(ai.error || 'The deeper read did not work. Try again.')}</p>` : ''}
           <div class="btn-row">
             <button type="button" class="btn btn-secondary btn-sm" data-action="ai-check" ${loading ? 'disabled' : ''}>
               ${loading ? '<span class="spinner"></span> Reading' : `Deep-read with ${esc(provider)}`}
             </button>
           </div>
           <p class="privacy-note">${icon('lock', 10)} Only when you ask. Sends this visible page and profile facts to ${esc(provider)}. A second opinion, not a final decision.</p>`}
    </section>`
  }

  const renderCheckView = () => {
    const check = state.check
    const scan = check.scan
    const analysis = check.analysis
    const contextTab = check.tab || state.activeTab
    let body = ''

    if (check.status === 'scanning') {
      body = `<section class="scanning-card">
        <span class="scanning-orbit"><span class="spinner spinner-lg"></span></span>
        <div class="scanning-copy">
          <strong>Reading the page.</strong>
          <p>Fields, fine print, and the papers this form asks for.</p>
        </div>
      </section>
      <div class="action-card"><span class="skeleton"></span><span class="skeleton short"></span></div>`
    } else if (check.status === 'error') {
      body = `<section class="action-card">
        <p class="eyebrow">Page check</p>
        <h2 class="panel-title">The page didn't open up.</h2>
        <p class="panel-copy">${esc(check.error || 'The companion could not read this tab. Open a normal application page and try again.')}</p>
        <div class="btn-row">
          <button type="button" class="btn btn-primary btn-sm" data-action="check-page">${icon('refresh', 12)} Try again</button>
          <button type="button" class="btn btn-ghost btn-sm" data-action="open-dashboard" data-path="/extension">Open companion setup</button>
        </div>
        <p class="quiet-note">${icon('info', 11)} Chrome blocks reading on some system pages. A regular website or form works best.</p>
      </section>`
    } else if (check.status === 'ready' && scan && analysis) {
      const docIds = analysis.requiredDocs.length ? analysis.requiredDocs : S.REQUIRED_DOCUMENTS
      const readyDocs = requiredDocsReady(docIds)
      const clear = analysis.verdict === 'clear'
      const heading = clear
        ? 'Looks promising.'
        : analysis.missingDocs.length
          ? 'A few papers first.'
          : 'A few things first.'
      const hiddenQuestionCount = analysis.manualQuestions?.length || 0
      const pdfCount = scan.pdfLinks?.length || 0

      let afterChecks = ''
      if (analysis.missingDocs.length || analysis.requiredMissingFields.length) {
        afterChecks = `${renderMissingDocsCard(analysis)}${renderMissingProfileCard(analysis)}`
      } else if (!scan.fields?.length) {
        afterChecks = `<section class="empty-card">
          <span class="empty-mark">${icon('search', 15)}</span>
          <h2>No form fields found.</h2>
          <p>This may be a guidelines page, or the application form has not loaded yet. Open the actual form step and scan again.</p>
          <button type="button" class="btn btn-primary btn-sm" data-action="check-page">${icon('refresh', 12)} Scan again</button>
        </section>`
      } else if (analysis.canAutoFill) {
        afterChecks = `<section class="next-card">
          <div class="next-top">
            <span class="next-mark">${icon('check', 14)}</span>
            <div>
              <p class="eyebrow">The next step</p>
              <h2>Your file fits this form.</h2>
            </div>
          </div>
          <p>We can fill ${analysis.fillableCount} ${analysis.fillableCount === 1 ? 'field' : 'fields'} from your synced file. Nothing is sent and the final button stays yours.</p>
          <div class="btn-row">
            <button type="button" class="btn btn-primary btn-sm" data-action="continue-fill">Review the auto-fill ${icon('arrowRight', 12)}</button>
          </div>
        </section>
        ${hiddenQuestionCount
          ? `<div class="manual-note">${icon('info', 12)}<div><strong>${hiddenQuestionCount} required ${hiddenQuestionCount === 1 ? 'question needs' : 'questions need'} your own answer.</strong> They will be left blank for you to complete on the page.</div></div>`
          : ''}`
      } else {
        afterChecks = `<section class="empty-card">
          <span class="empty-mark">${icon('info', 15)}</span>
          <h2>Nothing matched cleanly.</h2>
          <p>No visible field could be paired with your profile. You can open the form and fill it yourself, or update your file and try again.</p>
          <div class="btn-row is-centered">
            <button type="button" class="btn btn-secondary btn-sm" data-action="open-dashboard" data-path="/profile">Open my profile</button>
          </div>
        </section>`
      }

      body = `<section class="verdict tone-${clear ? 'clear' : 'review'}">
        <span class="verdict-mark">${icon(clear ? 'check' : 'alert', 16)}</span>
        <div class="verdict-copy">
          <p class="eyebrow">First look</p>
          <h2>${heading}</h2>
          <p>${esc(analysis.summary)}</p>
        </div>
      </section>

      <div class="meta-row">
        <span class="pill">${analysis.fieldCount} ${analysis.fieldCount === 1 ? 'field' : 'fields'}</span>
        <span class="pill ${readyDocs === docIds.length ? 'pill-ok' : ''}">${readyDocs}/${docIds.length} papers ready</span>
        ${pdfCount ? `<span class="pill pill-blue">${pdfCount} PDF${pdfCount === 1 ? '' : 's'} spotted</span>` : ''}
      </div>

      <section class="check-card">
        <div class="section-head">
          <div>
            <h2>What this page says</h2>
            <p>Read from the visible text and form fields.</p>
          </div>
          <span class="pill">Local read</span>
        </div>
        ${renderCheckRows(analysis.checks)}
      </section>

      ${renderVaultCard({
        ids: docIds,
        heading: analysis.requiredDocs.length ? 'Papers this page asks for' : 'Your document vault',
        copy: analysis.requiredDocs.length
          ? 'Matched with the papers in your desk.'
          : 'No upload requirement was visible. Here is what your desk holds.',
      })}

      ${afterChecks}
      ${renderAiCard()}
      <p class="quiet-note">${icon('lock', 11)} A first look, not the final word. Portal rules, OTPs, and the last review always stay with you.</p>`
    } else {
      body = `<section class="action-card">
        <p class="eyebrow">Check current page</p>
        <h2 class="panel-title">Start with the page in front of you.</h2>
        <p class="panel-copy">The companion will read the visible form, look for the fine print, and compare what it finds with your synced document vault.</p>
        <button type="button" class="btn btn-primary btn-block" data-action="check-page">${icon('search', 13)} Check this page</button>
        <p class="quiet-note">${icon('lock', 11)} Only the tab you scan is read. Nothing is clicked, uploaded, or sent.</p>
      </section>`
    }

    return `<div class="content">
      <section class="page-heading">
        <p class="eyebrow">Eligibility check · current page</p>
        <h1 class="page-title">Is this page <em>a fit?</em></h1>
        <p class="lede">Read the form, compare it with your file, and stop at anything that needs a human.</p>
      </section>
      ${tabContext(contextTab)}
      ${body}
    </div>`
  }

  const renderFillView = () => {
    const fill = state.fill
    const scan = fill.scan
    const analysis = fill.analysis
    const contextTab = fill.tab || state.activeTab
    let body = ''

    if (fill.status === 'scanning' || fill.status === 'filling') {
      const filling = fill.status === 'filling'
      body = `<section class="scanning-card">
        <span class="scanning-orbit"><span class="spinner spinner-lg"></span></span>
        <div class="scanning-copy">
          <strong>${filling ? 'Filling the matched fields.' : 'Reading the form.'}</strong>
          <p>${filling ? 'We stop before Submit. The final click stays yours.' : 'Finding every visible field and the papers it asks for.'}</p>
        </div>
      </section>
      <div class="action-card"><span class="skeleton"></span><span class="skeleton short"></span></div>`
    } else if (fill.status === 'error') {
      body = `<section class="action-card">
        <p class="eyebrow">Auto-fill</p>
        <h2 class="panel-title">Nothing to fill yet.</h2>
        <p class="panel-copy">${esc(fill.error || 'The companion could not read this tab. Open the application form and try again.')}</p>
        <div class="btn-row">
          <button type="button" class="btn btn-primary btn-sm" data-action="rescan-fill">${icon('refresh', 12)} Scan this page</button>
        </div>
      </section>`
    } else if (fill.status === 'done' && fill.result) {
      const filledCount = fill.result.filledCount || 0
      const skipped = fill.result.skipped || []
      body = `<section class="fill-success">
        <span class="success-mark">${icon('check', 18)}</span>
        <p class="eyebrow section-gap">Filled, not finished</p>
        <h2>The form is filled. The last word is still yours.</h2>
        <p>${filledCount} ${filledCount === 1 ? 'field now holds' : 'fields now hold'} your details. ${skipped.length ? `${skipped.length} ${skipped.length === 1 ? 'field was' : 'fields were'} left alone.` : 'Every matched field was filled.'} Review each answer on the page before moving on.</p>
        <div class="final-stop">
          ${icon('lock', 13)}
          <div>
            <strong>We stopped before Submit.</strong>
            <p>ScholarAgent did not click the final button, complete an OTP, or solve a CAPTCHA. Those steps are yours.</p>
          </div>
        </div>
        ${skipped.length
          ? `<div class="manual-note">${icon('info', 12)}<div><strong>Left for you:</strong> ${formatList(skipped.slice(0, 4).map((item) => esc(item.label)))}${skipped.length > 4 ? ` and ${skipped.length - 4} more` : ''}.</div></div>`
          : ''}
        <div class="btn-row">
          <button type="button" class="btn btn-primary btn-sm" data-action="show-submit">${icon('arrowRight', 12)} Show me the final button</button>
          <button type="button" class="btn btn-ghost btn-sm" data-action="rescan-fill">Scan another page</button>
        </div>
      </section>`
    } else if (fill.status === 'ready' && scan && analysis) {
      const docBlocked = analysis.missingDocs.length > 0
      const profileBlocked = analysis.requiredMissingFields.length > 0
      const smallError = fill.error
        ? `<div class="inline-error">${icon('alert', 12)}<span>${esc(fill.error)}</span></div>`
        : ''

      let readyBody = ''
      if (docBlocked || profileBlocked) {
        readyBody = `${smallError}${renderMissingDocsCard(analysis, true)}${renderMissingProfileCard(analysis, true)}`
      } else if (!scan.fields?.length) {
        readyBody = `${smallError}<section class="empty-card">
          <span class="empty-mark">${icon('search', 15)}</span>
          <h2>This tab has no form to fill.</h2>
          <p>Open the scholarship application step, then ask the companion to scan again.</p>
          <button type="button" class="btn btn-primary btn-sm" data-action="rescan-fill">Scan this page</button>
        </section>`
      } else if (analysis.canAutoFill) {
        const visibleFields = analysis.fillable.slice(0, 8)
        const manualCount = analysis.manualCount
        const hiddenQuestionCount = analysis.manualQuestions?.length || 0
        readyBody = `${smallError}
          <div class="fill-summary">
            <div class="summary-cell"><strong>${analysis.fieldCount}</strong><span>Fields found</span></div>
            <div class="summary-cell"><strong>${analysis.fillableCount}</strong><span>Matched</span></div>
            <div class="summary-cell"><strong>${manualCount}</strong><span>For you</span></div>
          </div>
          <div class="field-preview">
            <div class="field-preview-head">
              <h2>Mapped from your file</h2>
              <span>${analysis.fillableCount} ready</span>
            </div>
            ${visibleFields
              .map(
                (field) => `<div class="field-row">
                  <span class="field-tick">${icon('check', 9)}</span>
                  <div class="field-copy">
                    <strong>${esc(field.label)}</strong>
                    <span>${esc(fieldValue(field))}</span>
                  </div>
                </div>`,
              )
              .join('')}
            ${analysis.fillableCount > visibleFields.length
              ? `<div class="field-row"><span class="field-tick">${icon('plus', 9)}</span><div class="field-copy"><strong>${analysis.fillableCount - visibleFields.length} more matched fields</strong><span>Filled together with the list above</span></div></div>`
              : ''}
          </div>
          ${manualCount
            ? `<div class="manual-note">${icon('info', 12)}<div>${hiddenQuestionCount ? `<strong>${hiddenQuestionCount} required ${hiddenQuestionCount === 1 ? 'question needs' : 'questions need'} your own words.</strong> ` : ''}Other unmatched fields will be left alone for your review.</div></div>`
            : ''}
          <button type="button" class="btn btn-primary btn-block section-gap" data-action="fill-page">Fill ${analysis.fillableCount} ${analysis.fillableCount === 1 ? 'field' : 'fields'} on this page</button>
          <p class="quiet-note">${icon('lock', 11)} We will not touch file uploads, OTPs, CAPTCHAs, or the final Submit button.</p>`
      } else {
        readyBody = `${smallError}<section class="empty-card">
          <span class="empty-mark">${icon('info', 15)}</span>
          <h2>Nothing matched cleanly.</h2>
          <p>This form may use custom controls, or the details it asks for aren't in your profile yet. You can update your file and scan again.</p>
          <div class="btn-row is-centered">
            <button type="button" class="btn btn-secondary btn-sm" data-action="open-dashboard" data-path="/profile">Open my profile</button>
            <button type="button" class="btn btn-ghost btn-sm" data-action="rescan-fill">Scan again</button>
          </div>
        </section>`
      }
      body = readyBody
    } else {
      body = `<section class="action-card">
        <p class="eyebrow">Auto-fill</p>
        <h2 class="panel-title">Fill the form, keep the last word.</h2>
        <p class="panel-copy">Scan this tab to see what can be filled from your file. Nothing is changed until you approve the fields.</p>
        <button type="button" class="btn btn-primary btn-block" data-action="rescan-fill">${icon('pen', 13)} Scan this page</button>
        <p class="quiet-note">${icon('lock', 11)} The final Submit button is never clicked by the companion.</p>
      </section>`
    }

    return `<div class="content">
      <section class="page-heading">
        <p class="eyebrow">Auto-fill · with your review</p>
        <h1 class="page-title">Fill the form. <em>Keep the last word.</em></h1>
        <p class="lede">Your details go in, the page stays open, and the final click remains yours.</p>
      </section>
      ${tabContext(contextTab)}
      ${body}
    </div>`
  }

  const renderProfileView = () => {
    const profile = state.workspace.profile
    const docsReady = requiredDocsReady(S.REQUIRED_DOCUMENTS)
    let body = ''

    if (!profile) {
      body = `<section class="empty-card">
        <span class="empty-mark">${icon('user', 15)}</span>
        <h2>Your file hasn't arrived yet.</h2>
        <p>Open your signed-in dashboard once, then bring it across with a sync.</p>
        <button type="button" class="btn btn-primary btn-sm" data-action="sync">${icon('refresh', 12)} Sync from my desk</button>
      </section>`
    } else {
      body = `<section class="profile-card">
        <div class="profile-cover">
          <span class="avatar">${esc(initialFor(profile.fullName))}</span>
          <div class="profile-name">
            <h2>${esc(profile.fullName || 'Your profile')}</h2>
            <p>${esc(profile.course || 'Student')} · ${esc(profile.academicYear || '')}</p>
          </div>
          ${profile.category ? `<span class="pill">${esc(profile.category)}</span>` : ''}
        </div>
        <div class="profile-grid">
          <div class="profile-cell"><span>Institution</span><strong>${esc(profile.institution || 'Not added')}</strong></div>
          <div class="profile-cell"><span>CGPA</span><strong>${esc(profile.cgpa || 'Not added')}</strong></div>
          <div class="profile-cell"><span>Annual income</span><strong>${esc(formatCurrency(profile.annualIncome))}</strong></div>
          <div class="profile-cell"><span>Domicile</span><strong>${esc(profile.domicile || 'Not added')}</strong></div>
          <div class="profile-cell"><span>Category</span><strong>${esc(profile.category || 'Not added')}</strong></div>
          <div class="profile-cell"><span>Residence</span><strong>${profile.hosteller ? 'Hosteller' : 'Day scholar'}</strong></div>
          <div class="profile-cell"><span>Date of birth</span><strong>${esc(S.formatDisplayDate(profile.dateOfBirth) || 'Not added')}</strong></div>
          <div class="profile-cell"><span>Phone</span><strong>${esc(profile.phone || 'Not added')}</strong></div>
        </div>
        <div class="profile-foot">
          <p>Synced ${esc(timeAgo(state.workspace.syncedAt))}</p>
          <button type="button" class="link-button" data-action="open-dashboard" data-path="/profile">Edit in dashboard ${icon('external', 10)}</button>
        </div>
      </section>

      ${renderVaultCard({
        ids: S.REQUIRED_DOCUMENTS,
        heading: 'Your document vault',
        copy: `${docsReady} of ${S.REQUIRED_DOCUMENTS.length} required papers are ready.`,
      })}

      <div class="btn-row">
        <button type="button" class="btn btn-secondary btn-sm" data-action="sync" ${state.syncing ? 'disabled' : ''}>${icon('refresh', 12)} ${state.syncing ? 'Syncing…' : 'Sync from desk'}</button>
        <button type="button" class="btn btn-ghost btn-sm" data-action="open-dashboard" data-path="/documents">Open the vault ${icon('external', 10)}</button>
      </div>
      <p class="quiet-note">${icon('lock', 11)} Files themselves stay in your dashboard. The companion only reads their status.</p>`
    }

    return `<div class="content">
      <section class="page-heading">
        <p class="eyebrow">Profile · synced from your desk</p>
        <h1 class="page-title">The file behind <em>the form.</em></h1>
        <p class="lede">A small, read-only copy of the details your dashboard will use for matching and filling.</p>
      </section>
      ${body}
    </div>`
  }

  const renderSettingsView = () => {
    const profile = state.workspace.profile
    const savedKeys = state.settings
    const draft = state.settingsDraft
    const docsReady = requiredDocsReady(S.REQUIRED_DOCUMENTS)
    const provider = providerName()
    const savingKeys = state.savingSettings === 'keys'
    const savingPrompt = state.savingSettings === 'prompt'

    const keyField = (id, key, label, placeholder, note = '') => `
      <div class="field">
        <div class="field-label">
          <label for="${id}">${esc(label)}</label>
          <span>${savedKeys[key] ? 'Saved' : 'Optional'}</span>
        </div>
        <input
          id="${id}"
          class="input"
          type="password"
          data-setting="${key}"
          value="${esc(draft[key] || '')}"
          placeholder="${esc(placeholder)}"
          autocomplete="off"
          spellcheck="false"
        />
        ${note ? `<p class="privacy-note">${icon('info', 10)} ${esc(note)}</p>` : ''}
      </div>`

    return `<div class="content">
      <section class="page-heading">
        <p class="eyebrow">Settings · companion 0.1</p>
        <h1 class="page-title">A few small <em>preferences.</em></h1>
        <p class="lede">Your desk connection, the keys you choose to add, and the words you want the companion to watch for.</p>
      </section>

      <section class="settings-section">
        <div class="settings-head">
          <span class="settings-icon">${icon('user', 13)}</span>
          <div>
            <h2>Profile</h2>
            <p>Which ScholarAgent desk this companion follows.</p>
          </div>
        </div>
        <div class="settings-body">
          <div class="settings-identity">
            <span class="avatar">${esc(initialFor(profile?.fullName || state.connection?.username))}</span>
            <div>
              <strong>${esc(profile?.fullName || state.connection?.username || 'Connected student')}</strong>
              <p>${esc(profile?.email || 'Signed in through the dashboard')}</p>
            </div>
          </div>
          <div class="settings-meta">
            <div class="settings-meta-row"><span>Desk</span><strong>${esc(hostOf(state.connection?.dashboardUrl) || 'localhost')}</strong></div>
            <div class="settings-meta-row"><span>Last sync</span><strong>${esc(timeAgo(state.workspace.syncedAt))}</strong></div>
            <div class="settings-meta-row"><span>Document vault</span><strong>${docsReady}/${S.REQUIRED_DOCUMENTS.length} ready</strong></div>
            <div class="settings-meta-row"><span>Keys</span><strong>${provider ? `${esc(provider)} active` : 'None set'}</strong></div>
          </div>
          <div class="btn-row">
            <button type="button" class="btn btn-secondary btn-sm" data-action="sync" ${state.syncing ? 'disabled' : ''}>${icon('refresh', 11)} ${state.syncing ? 'Syncing…' : 'Sync now'}</button>
            <button type="button" class="btn btn-ghost btn-sm" data-action="open-dashboard" data-path="/dashboard">Open dashboard ${icon('external', 10)}</button>
          </div>
        </div>
      </section>

      <section class="settings-section">
        <div class="settings-head">
          <span class="settings-icon">${icon('motion', 13)}</span>
          <div>
            <h2>Motion</h2>
            <p>Choose how the agent fills the page.</p>
          </div>
        </div>
        <div class="settings-body">
          <div class="preference-row">
            <div class="preference-copy">
              <strong id="reduced-motion-title">Reduced motion</strong>
              <p>When on, fields appear instantly. When off, the companion highlights each field and types it in sequence.</p>
            </div>
            <button
              type="button"
              class="switch"
              role="switch"
              aria-labelledby="reduced-motion-title"
              aria-checked="${state.settings.reducedMotion ? 'true' : 'false'}"
              data-action="toggle-motion"
              ${state.savingMotion ? 'disabled' : ''}
            ><span></span></button>
          </div>
          <p class="privacy-note">${icon('info', 10)} Saved in this browser. Your system's reduced-motion setting is also respected.</p>
        </div>
      </section>

      <section class="settings-section">
        <div class="settings-head">
          <span class="settings-icon">${icon('popout', 13)}</span>
          <div>
            <h2>Window</h2>
            <p>Choose where the companion sits.</p>
          </div>
        </div>
        <div class="settings-body">
          <div class="window-row">
            <p>${isPopupWindow ? 'You are viewing the pop-up window. The side panel remains available from the toolbar.' : 'Detach the companion into a small standalone window when you want more room.'}</p>
            ${isPopupWindow
              ? ''
              : `<button type="button" class="btn btn-secondary btn-sm" data-action="open-popup">Open in a pop-up window ${icon('external', 10)}</button>`}
          </div>
        </div>
      </section>

      <section class="settings-section">
        <div class="settings-head">
          <span class="settings-icon">${icon('key', 13)}</span>
          <div>
            <h2>API keys</h2>
            <p>For the optional deeper fine-print reading.</p>
          </div>
        </div>
        <div class="settings-body">
          ${keyField('key-openai', 'openaiKey', 'OpenAI API key', 'sk-…')}
          ${keyField('key-gemini', 'geminiKey', 'Gemini API key', 'AIza…')}
          ${keyField('key-tinyfish', 'tinyfishKey', 'TinyFish API key', 'tf-…', 'Kept for the assisted browser runs we build next.')}
          <div class="settings-foot">
            <button type="button" class="btn btn-primary btn-sm" data-action="save-keys" ${savingKeys ? 'disabled' : ''}>
              ${savingKeys ? '<span class="spinner"></span> Saving' : 'Save keys'}
            </button>
            ${provider ? `<span class="keys-saved">${icon('check', 9)} ${esc(provider)} ready</span>` : ''}
          </div>
          <p class="privacy-note">${icon('lock', 10)} Keys stay in this Chrome profile. They are only used when you ask for a deeper read. OpenAI is used first when both keys are saved.</p>
        </div>
      </section>

      <section class="settings-section">
        <div class="settings-head">
          <span class="settings-icon">${icon('message', 13)}</span>
          <div>
            <h2>Custom prompt</h2>
            <p>A small note for the page-reading agent.</p>
          </div>
        </div>
        <div class="settings-body">
          <label class="field" for="custom-prompt">
            <span class="field-label">What should it watch for? <span>Optional</span></span>
            <textarea id="custom-prompt" class="textarea" data-setting="customPrompt" placeholder="e.g. Always flag hosteller rules and any deadline that falls before my exams.">${esc(draft.customPrompt || '')}</textarea>
          </label>
          <div class="settings-foot">
            <button type="button" class="btn btn-primary btn-sm" data-action="save-prompt" ${savingPrompt ? 'disabled' : ''}>
              ${savingPrompt ? '<span class="spinner"></span> Saving' : 'Save prompt'}
            </button>
            <p class="quiet-note">${icon('info', 10)} Sent only with a deeper read you start.</p>
          </div>
        </div>
      </section>

      <section class="settings-section danger-zone">
        <div class="settings-head">
          <span class="settings-icon">${icon('power', 13)}</span>
          <div>
            <h2>Disconnect extension</h2>
            <p>Unlink this browser from your ScholarAgent desk.</p>
          </div>
        </div>
        <div class="settings-body">
          <p class="danger-copy">Your synced profile and paper status will be removed from this browser. API keys and your custom prompt stay here. You can reconnect whenever your dashboard is open.</p>
          ${state.disconnectConfirm
            ? `<div class="confirm-box">
                <p>Disconnect now? You will need to connect to the desk again.</p>
                <div class="btn-row">
                  <button type="button" class="btn btn-danger-solid btn-sm" data-action="disconnect">Disconnect</button>
                  <button type="button" class="btn btn-ghost btn-sm" data-action="cancel-disconnect">Keep connected</button>
                </div>
              </div>`
            : `<div class="btn-row">
                <button type="button" class="btn btn-danger btn-sm" data-action="ask-disconnect">${icon('power', 11)} Disconnect extension</button>
              </div>`}
        </div>
      </section>

      <p class="settings-version">ScholarAgent companion · 0.1.0 · local-first</p>
    </div>`
  }

  const renderOnboarding = () => {
    const discovery = state.discovery || { status: 'searching' }
    let tone = ''
    let statusIcon = 'search'
    let statusTitle = 'Looking for your desk…'
    let statusCopy = 'Keep your signed-in dashboard open in another tab. We will find it.'

    if (discovery.status === 'found') {
      tone = 'tone-found'
      statusIcon = 'check'
      const firstName = String(discovery.profile?.fullName || '').trim().split(/\s+/)[0]
      statusTitle = firstName ? `${firstName}'s desk is open.` : 'Your desk is open.'
      statusCopy = `Found at ${discovery.dashboardUrl ? hostOf(discovery.dashboardUrl) : 'localhost'}. No extra login is needed here.`
    } else if (discovery.status === 'signed-out') {
      tone = 'tone-warn'
      statusIcon = 'alert'
      statusTitle = 'Your desk is open, but signed out.'
      statusCopy = 'Sign in on the dashboard once, then come back and connect. The companion has no login of its own.'
    } else if (discovery.status === 'none') {
      tone = 'tone-warn'
      statusIcon = 'browser'
      statusTitle = 'No ScholarAgent desk found yet.'
      statusCopy = 'Open your dashboard in a tab and sign in once. Then connect here, without a second password.'
    } else if (discovery.status === 'error') {
      tone = 'tone-warn'
      statusIcon = 'alert'
      statusTitle = 'The search got interrupted.'
      statusCopy = discovery.error || 'Open your dashboard once, then try again.'
    }

    return `<div class="connect-shell">
      <div class="connect-inner">
        <div class="connect-bar">
          <div class="brand-lockup">
            ${brandMark()}
            <div>
              <p class="brand-name">ScholarAgent</p>
              <p class="brand-sub">Companion</p>
            </div>
          </div>
          <span class="connect-version">Local-first · 0.1</span>
        </div>

        <div class="connect-copy">
          <p class="eyebrow">First meeting</p>
          <h1 class="page-title">Bring your desk <em>into the browser.</em></h1>
          <p class="lede">Connect to the ScholarAgent dashboard you already use. No second login, no new password.</p>
        </div>

        <div class="connect-visual" aria-hidden="true">
          <div class="mini-browser">
            <div class="mini-chrome">
              <span class="mini-dots"><span></span><span></span><span></span></span>
              <span class="mini-address">${icon('lock', 7)} scholarships.maharashtra.gov.in/apply</span>
            </div>
            <div class="mini-page">
              <p class="mini-kicker">Directorate of Technical Education</p>
              <p class="mini-title">Scholarship application</p>
              <div class="mini-field is-filled"></div>
              <div class="mini-field is-filled"></div>
              <div class="mini-field short"></div>
            </div>
          </div>
          <div class="companion-float">
            <div class="companion-float-head">
              ${brandMark()}
              <strong>ScholarAgent</strong>
              <span class="status-dot"></span>
            </div>
            <p>Companion · ready</p>
            <h3>This form looks familiar.</h3>
            <div class="float-row">${icon('check', 8)} Fields mapped from your file</div>
            <div class="float-row">${icon('lock', 8)} Stops before Submit</div>
            <div class="float-cta">You review every field</div>
          </div>
        </div>

        <div class="connect-status ${tone}">
          <span class="connect-status-icon">${icon(statusIcon, 13)}</span>
          <div>
            <strong>${esc(statusTitle)}</strong>
            <p>${esc(statusCopy)}</p>
          </div>
        </div>

        ${state.connectError ? `<div class="inline-error">${icon('alert', 12)}<span>${esc(state.connectError)}</span></div>` : ''}

        <div class="connect-actions">
          <button type="button" class="btn btn-primary" data-action="connect" ${state.connecting ? 'disabled' : ''}>
            ${state.connecting ? '<span class="spinner"></span> Connecting…' : `${icon('plug', 13)} Connect to my desk`}
          </button>
          <button type="button" class="btn btn-secondary" data-action="open-dashboard" data-path="/dashboard">
            ${icon('browser', 13)} Open my dashboard
          </button>
          ${discovery.status !== 'searching'
            ? `<button type="button" class="btn btn-ghost btn-sm" data-action="discover">${icon('refresh', 11)} Look for my desk again</button>`
            : ''}
        </div>

        <p class="connect-foot">${icon('shield', 11)} Reads only the pages you deliberately scan. Your papers stay in your dashboard. No submission without you.</p>
      </div>
    </div>`
  }

  const renderFatal = () => `<div class="connect-shell">
    <div class="connect-inner">
      <div class="connect-bar">
        <div class="brand-lockup">
          ${brandMark()}
          <div><p class="brand-name">ScholarAgent</p><p class="brand-sub">Companion</p></div>
        </div>
        <span class="connect-version">Local-first · 0.1</span>
      </div>
      <div class="connect-copy"><p class="eyebrow">A small hiccup</p><h1 class="page-title">The companion could not start.</h1></div>
      <div class="connect-status tone-warn">
        <span class="connect-status-icon">${icon('alert', 13)}</span>
        <div><strong>One more try.</strong><p>${esc(state.fatal || 'Reload the companion from the toolbar.')}</p></div>
      </div>
      <div class="connect-actions">
        <button type="button" class="btn btn-primary" data-action="reload">${icon('refresh', 13)} Reload companion</button>
      </div>
    </div>
  </div>`

  const NAV_ITEMS = [
    { view: 'check', label: 'Eligibility', icon: 'search' },
    { view: 'fill', label: 'Auto-fill', icon: 'pen' },
    { view: 'profile', label: 'Profile', icon: 'user' },
    { view: 'settings', label: 'Settings', icon: 'settings' },
  ]

  const renderBoot = () => `<div class="boot-screen">
    <div class="boot-inner">
      ${brandMark()}
      <span>Opening the companion</span>
      <span class="spinner"></span>
    </div>
  </div>`

  const renderApp = () => {
    let viewContent = ''
    if (state.view === 'fill') viewContent = renderFillView()
    else if (state.view === 'profile') viewContent = renderProfileView()
    else if (state.view === 'settings') viewContent = renderSettingsView()
    else viewContent = renderCheckView()

    return `<div class="app-shell">
      <header class="app-header">
        <div class="brand-lockup">
          ${brandMark()}
          <div>
            <p class="brand-name">ScholarAgent</p>
            <p class="brand-sub">Companion</p>
          </div>
        </div>
        <div class="header-actions">
          <span class="connection-badge" title="Connected to your ScholarAgent desk">
            <span class="status-dot"></span><span>Connected</span>
          </span>
          ${isPopupWindow
            ? ''
            : `<button type="button" class="icon-button" data-action="open-popup" title="Open in a pop-up window" aria-label="Open in a pop-up window">
            ${icon('popout', 14)}
          </button>`}
          <button type="button" class="icon-button ${state.syncing ? 'is-busy' : ''}" data-action="sync" title="Sync from my desk" aria-label="Sync from my desk" ${state.syncing ? 'disabled' : ''}>
            ${icon('sync', 14)}
          </button>
          <button type="button" class="icon-button" data-action="nav" data-view="settings" title="Settings" aria-label="Settings">
            ${icon('settings', 14)}
          </button>
        </div>
      </header>
      <main class="app-main">${viewContent}</main>
      <nav class="bottom-nav" aria-label="Companion sections">
        ${NAV_ITEMS.map(
          (item) => `<button type="button" class="nav-item ${state.view === item.view ? 'is-active' : ''}" data-action="nav" data-view="${item.view}" ${state.view === item.view ? 'aria-current="page"' : ''}>
            ${icon(item.icon, 16)}
            <span>${item.label}</span>
          </button>`,
        ).join('')}
      </nav>
    </div>`
  }

  const render = ({ preserveScroll = true } = {}) => {
    const oldMain = app.querySelector('.app-main')
    const oldScroll = oldMain?.scrollTop || 0
    document.documentElement.dataset.reducedMotion = state.settings.reducedMotion ? 'true' : 'false'

    if (!state.ready) app.innerHTML = renderBoot()
    else if (state.fatal) app.innerHTML = renderFatal()
    else if (!state.connection) app.innerHTML = renderOnboarding()
    else app.innerHTML = renderApp()

    if (preserveScroll && oldMain) {
      const newMain = app.querySelector('.app-main')
      if (newMain) newMain.scrollTop = oldScroll
    }
  }

  const readSettingsForm = () => {
    const next = { ...state.settingsDraft }
    document.querySelectorAll('[data-setting]').forEach((element) => {
      if (element?.dataset?.setting) next[element.dataset.setting] = element.value
    })
    return next
  }

  const resetPageData = () => {
    state.check = blankCheck()
    state.fill = blankFill()
  }

  const refreshActiveTab = async ({ resetOnChange = true } = {}) => {
    const response = await request('SCHOLARAGENT_GET_ACTIVE_TAB')
    if (!response.ok || !response.tab) return false
    const nextTab = response.tab
    const previousTab = state.activeTab
    const changed = Boolean(previousTab?.url && nextTab?.url && !samePage(previousTab.url, nextTab.url))
    state.activeTab = nextTab
    if (changed && resetOnChange) resetPageData()
    return changed
  }

  const pullWorkspace = async () => {
    const response = await request('SCHOLARAGENT_SYNC_DASHBOARD')
    if (response.ok) applyWorkspacePayload(response)
    return response
  }

  const discoverDashboard = async () => {
    if (state.connection) return
    state.discovery = { status: 'searching' }
    state.connectError = ''
    render()
    const response = await request('SCHOLARAGENT_DISCOVER_DASHBOARD')
    if (state.connection) return

    if (response.ok && response.signedIn) {
      state.discovery = {
        status: 'found',
        profile: response.profile || null,
        dashboardUrl: response.dashboardUrl || '',
      }
    } else if (response.reason === 'signed-out') {
      state.discovery = {
        status: 'signed-out',
        dashboardUrl: response.dashboardUrl || '',
      }
    } else if (response.reason === 'no-dashboard' || response.found === false) {
      state.discovery = { status: 'none' }
    } else {
      state.discovery = { status: 'error', error: response.error || 'The dashboard search did not finish.' }
    }
    render()
  }

  const connectToDesk = async () => {
    if (state.connecting) return
    state.connecting = true
    state.connectError = ''
    render()
    const response = await request('SCHOLARAGENT_CONNECT_DASHBOARD')
    state.connecting = false

    if (response.ok) {
      state.connection = response.connection
      applyWorkspacePayload(response)
      state.discovery = {
        status: 'found',
        profile: state.workspace.profile,
        dashboardUrl: state.connection?.dashboardUrl || '',
      }
      state.view = 'check'
      resetPageData()
      render({ preserveScroll: false })
      void refreshActiveTab().then((changed) => {
        if (changed) render()
      })
      const firstName = String(state.workspace.profile?.fullName || '').trim().split(/\s+/)[0]
      showToast(firstName ? `Connected to ${firstName}'s desk.` : 'Connected to your desk.')
    } else {
      state.connectError = response.error || 'The desk could not be connected. Try again.'
      if (response.reason === 'signed-out') {
        state.discovery = { status: 'signed-out', dashboardUrl: response.dashboardUrl || '' }
      } else if (response.reason === 'no-dashboard') {
        state.discovery = { status: 'none' }
      }
      render()
    }
  }

  const syncNow = async ({ silent = false } = {}) => {
    if (state.syncing) return false
    if (!silent) {
      state.syncing = true
      render()
    }

    const response = await request('SCHOLARAGENT_SYNC_DASHBOARD')
    state.syncing = false

    if (response.ok) {
      applyWorkspacePayload(response)
      render()
      if (!silent) showToast('Your desk is up to date.')
      return true
    }

    if (!silent) {
      render()
      showToast(response.error || 'The desk could not be reached. Open your dashboard and try again.', 'error')
    }
    return false
  }

  const openDashboard = async (path = '/dashboard') => {
    const response = await request('SCHOLARAGENT_OPEN_DASHBOARD', { path })
    if (!response.ok) showToast(response.error || 'The dashboard could not be opened.', 'error')
  }

  const openPopup = async () => {
    if (isPopupWindow) return
    try {
      await chrome.windows.create({
        url: chrome.runtime.getURL('sidepanel.html?popup=1'),
        type: 'popup',
        width: 440,
        height: 820,
        focused: true,
      })
      showToast('Opened the companion in a pop-up window.')
    } catch {
      showToast('Chrome could not open the pop-up window. Try the toolbar instead.', 'error')
    }
  }

  const toggleReducedMotion = async () => {
    if (state.savingMotion) return
    const nextValue = !Boolean(state.settings.reducedMotion)
    state.savingMotion = true
    state.settings = { ...state.settings, reducedMotion: nextValue }
    state.settingsDraft = { ...state.settingsDraft, reducedMotion: nextValue }
    render()

    const response = await request('SCHOLARAGENT_SET_REDUCED_MOTION', { reducedMotion: nextValue })
    state.savingMotion = false
    if (response.ok) {
      state.settings = { ...state.settings, ...response.settings }
      state.settingsDraft = {
        ...state.settingsDraft,
        reducedMotion: Boolean(state.settings.reducedMotion),
      }
      render()
      showToast(
        state.settings.reducedMotion
          ? 'Reduced motion on. Fields fill instantly.'
          : 'Reduced motion off. Fields fill with a visible typing effect.',
      )
    } else {
      state.settings = { ...state.settings, reducedMotion: !nextValue }
      state.settingsDraft = { ...state.settingsDraft, reducedMotion: !nextValue }
      render()
      showToast(response.error || 'The motion preference could not be saved.', 'error')
    }
  }

  const runCheck = async () => {
    if (state.check.status === 'scanning') return
    state.view = 'check'
    state.check = { ...blankCheck(), status: 'scanning' }
    render({ preserveScroll: false })
    await pullWorkspace()

    const response = await request('SCHOLARAGENT_SCAN_ACTIVE')
    if (!response.ok) {
      state.check = { ...blankCheck(), status: 'error', error: response.error || 'The page could not be read.' }
      render()
      return
    }

    const analysis = S.analyzeScan(response.scan, state.workspace.profile, state.workspace.documents)
    state.check = {
      status: 'ready',
      scan: response.scan,
      analysis,
      tab: response.tab || state.activeTab,
      error: '',
      ai: { status: 'idle', provider: '', analysis: null, error: '' },
    }
    state.activeTab = response.tab || state.activeTab
    render()
  }

  const loadScanForFill = async () => {
    if (state.fill.status === 'scanning' || state.fill.status === 'filling') return
    state.view = 'fill'
    state.fill = { ...blankFill(), status: 'scanning' }
    render({ preserveScroll: false })
    await pullWorkspace()

    const response = await request('SCHOLARAGENT_SCAN_ACTIVE')
    if (!response.ok) {
      state.fill = { ...blankFill(), status: 'error', error: response.error || 'The page could not be read.' }
      render()
      return
    }

    const analysis = S.analyzeScan(response.scan, state.workspace.profile, state.workspace.documents)
    state.fill = {
      status: 'ready',
      scan: response.scan,
      analysis,
      tab: response.tab || state.activeTab,
      error: '',
      result: null,
    }
    state.activeTab = response.tab || state.activeTab
    render()
  }

  const copyCheckToFill = () => {
    if (!state.check.scan || !state.check.analysis) return false
    state.view = 'fill'
    state.fill = {
      status: 'ready',
      scan: state.check.scan,
      analysis: S.analyzeScan(state.check.scan, state.workspace.profile, state.workspace.documents),
      tab: state.check.tab,
      error: '',
      result: null,
    }
    render({ preserveScroll: false })
    return true
  }

  const openFillView = async () => {
    if (state.fill.status === 'scanning' || state.fill.status === 'filling') {
      state.view = 'fill'
      render({ preserveScroll: false })
      return
    }

    state.view = 'fill'
    await refreshActiveTab()
    const activeUrl = state.activeTab?.url

    if (state.fill.scan && samePage(state.fill.scan.url, activeUrl)) {
      render({ preserveScroll: false })
      return
    }
    if (state.check.scan && samePage(state.check.scan.url, activeUrl)) {
      copyCheckToFill()
      return
    }
    await loadScanForFill()
  }

  const fillPageNow = async () => {
    const fill = state.fill
    if (fill.status !== 'ready' || !fill.scan || !fill.analysis) return
    if (!fill.analysis.canAutoFill) {
      showToast('Finish the missing paper or detail first, then try again.', 'error')
      return
    }

    const plan = S.buildFillPlan(fill.analysis)
    if (!plan.length) {
      showToast('There were no matched fields to fill. Scan the page again.', 'error')
      return
    }

    fill.status = 'filling'
    fill.error = ''
    render()
    const response = await request('SCHOLARAGENT_FILL_ACTIVE', {
      plan,
      expectedUrl: fill.scan.url,
    })

    if (!response.ok) {
      state.fill.status = response.code === 'page-changed' ? 'error' : 'ready'
      state.fill.error = response.error || 'The form could not be filled.'
      render()
      showToast(state.fill.error, 'error')
      return
    }

    if (!response.result?.filledCount) {
      state.fill.status = 'ready'
      state.fill.error = 'The page did not accept any of the matched values. Scan it again or fill it yourself.'
      render()
      showToast(state.fill.error, 'error')
      return
    }

    state.fill.status = 'done'
    state.fill.result = response.result
    state.fill.error = ''
    state.activeTab = response.tab || state.activeTab
    render()
    showToast(`Filled ${response.result.filledCount} ${response.result.filledCount === 1 ? 'field' : 'fields'}. Review them before submitting.`)
  }

  const showSubmitArea = async () => {
    const response = await request('SCHOLARAGENT_HIGHLIGHT_SUBMIT')
    if (response.ok && response.result?.found) {
      showToast(`Scrolled to “${response.result.label || 'the final button'}”. The final click is yours.`)
    } else {
      showToast(response.error || 'No final button was found on this page.', 'error')
    }
  }

  const runAiCheck = async () => {
    if (state.check.ai.status === 'loading') return
    if (!providerName()) {
      showToast('Add an OpenAI or Gemini key in Settings first.', 'error')
      return
    }
    const scan = state.check.scan
    if (!scan) return
    state.check.ai = { status: 'loading', provider: providerName(), analysis: null, error: '' }
    render()

    const response = await request('SCHOLARAGENT_AI_ANALYZE', { scan })
    if (state.check.scan !== scan) return
    if (response.ok) {
      state.check.ai = {
        status: 'ready',
        provider: response.provider || providerName(),
        analysis: response.analysis,
        error: '',
      }
    } else {
      state.check.ai = {
        status: 'error',
        provider: response.provider || providerName(),
        analysis: null,
        error: response.error || 'The deeper read did not work. Try again.',
      }
    }
    render()
  }

  const saveSettings = async (kind) => {
    if (state.savingSettings) return
    const next = readSettingsForm()
    state.settingsDraft = next
    state.savingSettings = kind
    render()
    const response = await request('SCHOLARAGENT_SAVE_SETTINGS', { settings: next })
    state.savingSettings = ''
    if (response.ok) {
      state.settings = { ...state.settings, ...response.settings }
      state.settingsDraft = { ...state.settings }
      render()
      showToast(kind === 'prompt' ? 'Custom prompt saved.' : 'API keys saved.')
    } else {
      render()
      showToast(response.error || 'Settings could not be saved.', 'error')
    }
  }

  const askDisconnect = () => {
    state.disconnectConfirm = true
    render()
  }

  const cancelDisconnect = () => {
    state.disconnectConfirm = false
    render()
  }

  const disconnectNow = async () => {
    state.disconnectConfirm = false
    const response = await request('SCHOLARAGENT_DISCONNECT')
    if (!response.ok) {
      render()
      showToast(response.error || 'The companion could not disconnect.', 'error')
      return
    }
    state.connection = null
    state.workspace = { profile: null, documents: [], syncedAt: null }
    resetPageData()
    state.view = 'check'
    state.discovery = { status: 'searching' }
    render({ preserveScroll: false })
    showToast('Disconnected. Your keys stayed in this browser.')
    void discoverDashboard()
  }

  const switchView = async (view) => {
    if (!['check', 'fill', 'profile', 'settings'].includes(view)) return
    if (view === 'fill') {
      await openFillView()
      return
    }
    state.view = view
    state.disconnectConfirm = false
    render({ preserveScroll: false })
  }

  document.addEventListener('input', (event) => {
    const setting = event.target?.dataset?.setting
    if (setting) state.settingsDraft[setting] = event.target.value
  })

  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target.closest('[data-action]') : null
    if (!target || !app.contains(target)) return
    if (target.disabled) return
    event.preventDefault()

    const action = target.dataset.action
    if (action === 'nav') {
      void switchView(target.dataset.view)
    } else if (action === 'connect') {
      void connectToDesk()
    } else if (action === 'discover') {
      void discoverDashboard()
    } else if (action === 'open-dashboard') {
      void openDashboard(target.dataset.path || '/dashboard')
    } else if (action === 'open-popup') {
      void openPopup()
    } else if (action === 'toggle-motion') {
      void toggleReducedMotion()
    } else if (action === 'sync') {
      void syncNow()
    } else if (action === 'check-page' || action === 'recheck-page') {
      void runCheck()
    } else if (action === 'continue-fill') {
      if (!copyCheckToFill()) void openFillView()
    } else if (action === 'rescan-fill') {
      void loadScanForFill()
    } else if (action === 'fill-page') {
      void fillPageNow()
    } else if (action === 'show-submit') {
      void showSubmitArea()
    } else if (action === 'ai-check') {
      void runAiCheck()
    } else if (action === 'save-keys' || action === 'save-prompt') {
      void saveSettings(action === 'save-keys' ? 'keys' : 'prompt')
    } else if (action === 'ask-disconnect') {
      askDisconnect()
    } else if (action === 'cancel-disconnect') {
      cancelDisconnect()
    } else if (action === 'disconnect') {
      void disconnectNow()
    } else if (action === 'reload') {
      window.location.reload()
    }
  })

  chrome.tabs.onActivated.addListener(() => {
    void refreshActiveTab().then((changed) => {
      if (changed) render()
    })
  })

  chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.status !== 'complete' && !changeInfo.url) return
    void refreshActiveTab().then((changed) => {
      const activeId = state.activeTab?.id
      if (changeInfo.status === 'complete' && tabId === activeId && (state.check.scan || state.fill.scan)) {
        resetPageData()
        render()
      } else if (changed) {
        render()
      }
    })
  })

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local' || !state.ready) return
    const relevant = ['scholaragent_connection', 'scholaragent_workspace', 'scholaragent_settings']
    if (!relevant.some((key) => changes[key])) return

    void (async () => {
      const focusedSetting = Boolean(document.activeElement?.dataset?.setting)
      const unsavedSettings = ['openaiKey', 'geminiKey', 'tinyfishKey', 'customPrompt'].some(
        (key) => String(state.settingsDraft[key] || '') !== String(state.settings[key] || ''),
      )
      const response = await request('SCHOLARAGENT_GET_STATE')
      if (!response.ok) return
      const hadConnection = Boolean(state.connection)
      const nextConnection = response.connection || null
      state.connection = nextConnection
      state.workspace = {
        profile: response.workspace?.profile || null,
        documents: Array.isArray(response.workspace?.documents) ? response.workspace.documents : [],
        syncedAt: response.workspace?.syncedAt || null,
      }
      state.settings = { ...state.settings, ...(response.settings || {}) }
      if (!focusedSetting && !unsavedSettings) state.settingsDraft = { ...state.settings }
      else state.settingsDraft = { ...state.settingsDraft, reducedMotion: Boolean(state.settings.reducedMotion) }
      recomputeAnalysis()

      if (!nextConnection && hadConnection) {
        state.view = 'check'
        state.discovery = { status: 'searching' }
        resetPageData()
        render({ preserveScroll: false })
        void discoverDashboard()
        return
      }
      if (focusedSetting) return
      render()
    })()
  })

  const init = async () => {
    state.ready = false
    render()
    const [stateResponse, tabResponse] = await Promise.all([
      request('SCHOLARAGENT_GET_STATE'),
      request('SCHOLARAGENT_GET_ACTIVE_TAB'),
    ])

    if (!stateResponse.ok) {
      state.ready = true
      state.fatal = stateResponse.error || 'The companion could not read its saved state.'
      render({ preserveScroll: false })
      return
    }

    state.connection = stateResponse.connection || null
    state.workspace = {
      profile: stateResponse.workspace?.profile || null,
      documents: Array.isArray(stateResponse.workspace?.documents) ? stateResponse.workspace.documents : [],
      syncedAt: stateResponse.workspace?.syncedAt || null,
    }
    state.settings = {
      openaiKey: '',
      geminiKey: '',
      tinyfishKey: '',
      customPrompt: '',
      reducedMotion: false,
      ...(stateResponse.settings || {}),
    }
    state.settingsDraft = { ...state.settings }
    if (isPopupWindow) document.title = 'ScholarAgent Companion · Pop-up'
    if (tabResponse.ok && tabResponse.tab) state.activeTab = tabResponse.tab
    state.ready = true

    render({ preserveScroll: false })
    if (state.connection) void syncNow({ silent: true })
    else void discoverDashboard()
  }

  init()
})()
