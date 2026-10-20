/* Shared ScholarAgent helpers. Loaded by the content script, background worker, and side panel. */
;(function (root) {
  const DOCUMENTS = {
    income: { label: 'Income certificate', short: 'Income' },
    domicile: { label: 'Domicile certificate', short: 'Domicile' },
    marksheet: { label: 'Latest marksheet', short: 'Marksheet' },
    id: { label: 'Government ID', short: 'ID proof' },
    other: { label: 'Other supporting paper', short: 'Other' },
  }

  const REQUIRED_DOCUMENTS = ['income', 'domicile', 'marksheet', 'id']

  const DOCUMENT_PATTERNS = {
    income: [/income\s+certificate/i, /income\s+proof/i, /annual\s+income.{0,40}certificate/i],
    domicile: [/domicile\s+certificate/i, /domicile\s+proof/i, /residence\s+certificate/i],
    marksheet: [/marksheet/i, /mark\s+sheet/i, /grade\s+card/i, /last.{0,20}result/i],
    id: [/aadhaar/i, /aadhar/i, /government\s+id/i, /id\s+proof/i, /photo\s+id/i, /identity\s+proof/i],
  }

  const FIELD_RULES = [
    {
      key: 'firstName',
      test: /\b(first|given)\s+name\b/i,
      exclude: /\b(father|mother|parent|guardian|institute|college|bank|nominee)\b/i,
    },
    {
      key: 'lastName',
      test: /\b(last|surname|family)\s+name\b/i,
      exclude: /\b(father|mother|parent|guardian|institute|college|bank|nominee)\b/i,
    },
    {
      key: 'fullName',
      test: /\b(full\s+name|applicant\s+name|student\s+name|candidate\s+name|name\s+of\s+(the\s+)?applicant|^name$)\b/i,
      exclude: /\b(father|mother|parent|guardian|institute|college|university|bank|branch|course|scheme|portal|user\s*name)\b/i,
    },
    { key: 'email', test: /\b(e[-\s]?mail|email\s+address)\b/i },
    { key: 'phone', test: /\b(mobile(\s+number)?|phone(\s+number)?|contact\s+number|telephone)\b/i },
    { key: 'dateOfBirth', test: /\b(dob|date\s+of\s+birth|birth\s+date)\b/i },
    { key: 'gender', test: /\b(gender|sex)\b/i },
    { key: 'category', test: /\b(category|caste|social\s+group|reservation\s+category)\b/i, exclude: /\bsub[-\s]?category\b/i },
    {
      key: 'annualIncome',
      test: /\b(annual|yearly|family|gross|total|household)?\s*income\b/i,
      exclude: /\b(certificate|proof|document|upload|file|receipt)\b/i,
    },
    { key: 'domicile', test: /\b(domicile|home\s+state|state\s+of\s+residence|residential\s+state|resident\s+state)\b/i },
    { key: 'institution', test: /\b(institution|college|university|institute)\s*(name)?\b/i, exclude: /\b(id|code|address|email)\b/i },
    { key: 'course', test: /\b(course|programme|program|branch|stream|discipline)\b/i, exclude: /\b(course\s+code|course\s+duration)\b/i },
    { key: 'academicYear', test: /\b(academic\s+year|year\s+of\s+study|current\s+year|current\s+semester|semester)\b/i },
    { key: 'cgpa', test: /\b(cgpa|gpa|grade\s+point|percentage|aggregate\s+marks)\b/i, exclude: /\b(certificate|document|upload|marksheet)\b/i },
    { key: 'hosteller', test: /\b(hosteller|hostel\s+resident|day\s+scholar|residential\s+status)\b/i },
  ]

  const SKIPPED_INPUT_TYPES = new Set([
    'hidden',
    'submit',
    'button',
    'reset',
    'image',
    'password',
    'file',
    'range',
    'color',
  ])

  const normalizeText = (value) =>
    String(value ?? '')
      .toLowerCase()
      .replace(/[’']/g, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim()

  const compactText = (value) => String(value ?? '').replace(/\s+/g, ' ').trim()

  const formatDisplayDate = (value) => {
    if (!value) return ''
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return ''
    return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }).format(date)
  }

  const fieldSearchText = (field) =>
    compactText(
      [field.label, field.placeholder, field.name, field.id, field.ariaLabel]
        .filter(Boolean)
        .join(' '),
    )

  const matchProfileKey = (field) => {
    const text = fieldSearchText(field)
    if (!text) return null
    for (const rule of FIELD_RULES) {
      if (rule.exclude && rule.exclude.test(text)) continue
      if (rule.test.test(text)) return rule.key
    }
    return null
  }

  const splitName = (fullName) => {
    const parts = compactText(fullName).split(' ')
    return {
      firstName: parts[0] || '',
      lastName: parts.length > 1 ? parts[parts.length - 1] : '',
    }
  }

  const valueForProfileKey = (key, profile, field = {}) => {
    if (!profile) return ''
    const name = splitName(profile.fullName)
    switch (key) {
      case 'fullName':
        return profile.fullName || ''
      case 'firstName':
        return name.firstName
      case 'lastName':
        return name.lastName
      case 'email':
        return profile.email || ''
      case 'phone':
        return profile.phone || ''
      case 'dateOfBirth':
        return field.type === 'date' ? profile.dateOfBirth || '' : formatDisplayDate(profile.dateOfBirth)
      case 'gender':
        return profile.gender || ''
      case 'category':
        return profile.category || ''
      case 'annualIncome':
        return profile.annualIncome === undefined || profile.annualIncome === null ? '' : String(profile.annualIncome)
      case 'domicile':
        return profile.domicile || ''
      case 'institution':
        return profile.institution || ''
      case 'course':
        return profile.course || ''
      case 'academicYear':
        return profile.academicYear || ''
      case 'cgpa':
        return profile.cgpa === undefined || profile.cgpa === null ? '' : String(profile.cgpa)
      case 'hosteller':
        return profile.hosteller ? 'Hosteller' : 'Day scholar'
      case 'firstGeneration':
        return profile.firstGeneration ? 'Yes' : 'No'
      default:
        return ''
    }
  }

  const isFillableType = (field) => {
    if (field.tag === 'file' || field.readOnly) return false
    if (field.type === 'checkbox' || field.type === 'radio') return false
    if (field.tag === 'select' || field.tag === 'textarea') return true
    if (field.tag !== 'input') return false
    return !SKIPPED_INPUT_TYPES.has(field.type)
  }

  const enrichFields = (fields, profile) =>
    (fields || []).map((field) => {
      const profileKey = matchProfileKey(field)
      const value = profileKey ? valueForProfileKey(profileKey, profile, field) : ''
      return {
        ...field,
        profileKey,
        value,
        needsYourInput: Boolean(field.required) && !value,
        canFill: Boolean(value) && isFillableType(field),
      }
    })

  const detectRequiredDocuments = (scan) => {
    const haystack = `${scan.textSample || ''} ${(scan.fields || [])
      .map((field) => [field.label, field.placeholder, field.name].filter(Boolean).join(' '))
      .join(' ')}`

    const found = []
    for (const [docId, patterns] of Object.entries(DOCUMENT_PATTERNS)) {
      if (patterns.some((pattern) => pattern.test(haystack))) found.push(docId)
    }

    if (found.length === 0 && Number(scan.uploadFieldCount || 0) > 0) {
      return [...REQUIRED_DOCUMENTS]
    }

    return [...new Set(found)]
  }

  const verifiedDocumentIds = (documents) =>
    new Set(
      (documents || [])
        .filter((document) => document && document.status === 'verified' && document.type)
        .map((document) => document.type),
    )

  const parseIncomeCeiling = (text) => {
    const patterns = [
      /(?:annual|family|gross|household|total)?\s*income[^.\n]{0,100}?(?:not\s+exceed|below|under|less\s+than|up\s+to|maximum(?:\s+of)?)[^.\n\d]{0,35}(?:₹|rs\.?|inr)?\s*([\d,]{4,})/i,
      /(?:₹|rs\.?|inr)\s*([\d,]{4,})[^.\n]{0,80}?(?:annual|family)?\s*income/i,
    ]
    for (const pattern of patterns) {
      const match = text.match(pattern)
      if (match) {
        const value = Number(match[1].replace(/,/g, ''))
        if (Number.isFinite(value) && value > 0) return value
      }
    }
    return null
  }

  const parseCgpaFloor = (text) => {
    const patterns = [
      /(?:minimum|at\s+least|not\s+less\s+than|above)?[^.\n]{0,55}(?:cgpa|gpa)[^.\n]{0,45}?(?:of|is|at|:)?\s*([0-9]+(?:\.[0-9]+)?)/i,
      /(?:cgpa|gpa)[^.\n]{0,35}?([0-9]+(?:\.[0-9]+)?)\s*(?:out\s+of|\/)\s*10/i,
    ]
    for (const pattern of patterns) {
      const match = text.match(pattern)
      if (match) {
        const value = Number(match[1])
        if (Number.isFinite(value) && value > 0 && value <= 10) return value
      }
    }
    return null
  }

  const buildChecks = (scan, profile, documents) => {
    const text = `${scan.title || ''}. ${scan.textSample || ''}`
    const normalized = normalizeText(text)
    const checks = []

    const incomeCeiling = parseIncomeCeiling(text)
    if (incomeCeiling) {
      const studentIncome = Number(profile?.annualIncome)
      const pass = Number.isFinite(studentIncome) && studentIncome <= incomeCeiling
      checks.push({
        id: 'income',
        label: 'Family income',
        status: pass ? 'pass' : 'review',
        detail: pass
          ? `Your income is below the ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(incomeCeiling)} limit on this page.`
          : `This page shows a ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(incomeCeiling)} income limit. Check the rule against your file.`,
      })
    }

    const cgpaFloor = parseCgpaFloor(text)
    if (cgpaFloor) {
      const studentCgpa = Number(profile?.cgpa)
      const pass = Number.isFinite(studentCgpa) && studentCgpa >= cgpaFloor
      checks.push({
        id: 'cgpa',
        label: 'Academic score',
        status: pass ? 'pass' : 'review',
        detail: pass
          ? `Your ${studentCgpa} CGPA clears the ${cgpaFloor} minimum found on this page.`
          : `This page mentions a ${cgpaFloor} minimum. Your file shows ${Number.isFinite(studentCgpa) ? studentCgpa : 'no score'}.`,
      })
    }

    if (profile?.domicile) {
      const mentionsDomicile = /\b(domicile|resident|residence|home state)\b/.test(normalized)
      const stateAppears = normalized.includes(normalizeText(profile.domicile))
      if (mentionsDomicile || stateAppears) {
        checks.push({
          id: 'domicile',
          label: 'Domicile',
          status: stateAppears ? 'pass' : 'unknown',
          detail: stateAppears
            ? `${profile.domicile} appears in the page details.`
            : `The page mentions residency. Confirm that ${profile.domicile} is accepted before you apply.`,
        })
      }
    }

    if (profile?.category) {
      const categoryAppears = normalized.includes(normalizeText(profile.category))
      if (categoryAppears) {
        checks.push({
          id: 'category',
          label: 'Category',
          status: 'pass',
          detail: `${profile.category} is mentioned in the page's eligibility rules.`,
        })
      }
    }

    const requiredDocs = detectRequiredDocuments(scan)
    const verified = verifiedDocumentIds(documents)
    const missingDocs = requiredDocs.filter((docId) => !verified.has(docId))

    if (requiredDocs.length) {
      checks.push({
        id: 'documents',
        label: 'Your papers',
        status: missingDocs.length ? 'review' : 'pass',
        detail: missingDocs.length
          ? `${missingDocs.map((id) => DOCUMENTS[id]?.label || id).join(', ')} ${missingDocs.length === 1 ? 'is' : 'are'} missing from your vault.`
          : `Every paper this page asks for is verified in your vault.`,
      })
    }

    const fields = scan.fields || []
    if (!fields.length) {
      checks.push({
        id: 'form',
        label: 'Application fields',
        status: 'review',
        detail: 'No fillable form fields were visible. Open the actual application step before auto-filling.',
      })
    } else {
      checks.push({
        id: 'form',
        label: 'Application fields',
        status: 'pass',
        detail: `${fields.length} form ${fields.length === 1 ? 'field was' : 'fields were'} found on this page.`,
      })
    }

    const needsReview = missingDocs.length > 0 || checks.some((check) => check.status === 'review')
    const summary = missingDocs.length
      ? `Your details line up, but ${missingDocs.length} ${missingDocs.length === 1 ? 'paper needs' : 'papers need'} attention before the form can be filled.`
      : needsReview
        ? 'A couple of things on this page deserve your eyes before filling the form.'
        : 'Your profile lines up with the rules visible on this page.'

    return {
      checks,
      requiredDocs,
      missingDocs,
      verdict: needsReview ? 'review' : 'clear',
      summary,
      verifiedDocs: requiredDocs.filter((docId) => verified.has(docId)),
    }
  }

  const analyzeScan = (scan, profile, documents) => {
    const fields = enrichFields(scan.fields, profile)
    const eligibility = buildChecks(scan, profile, documents)
    const fillable = fields.filter((field) => field.canFill)
    const manual = fields.filter((field) => !field.canFill)
    const requiredMissingFields = manual.filter(
      (field) =>
        field.required &&
        field.profileKey &&
        !field.value &&
        !['checkbox', 'radio', 'file'].includes(field.type),
    )
    const manualQuestions = manual.filter(
      (field) =>
        field.required &&
        !field.profileKey &&
        !['checkbox', 'radio', 'file'].includes(field.type),
    )

    return {
      ...eligibility,
      fields,
      fillable,
      manual,
      requiredMissingFields,
      manualQuestions,
      fieldCount: fields.length,
      fillableCount: fillable.length,
      manualCount: manual.length,
      uploadFieldCount: Number(scan.uploadFieldCount || 0),
      canAutoFill:
        eligibility.missingDocs.length === 0 &&
        fillable.length > 0 &&
        requiredMissingFields.length === 0 &&
        Boolean(scan.fields?.length),
    }
  }

  const buildFillPlan = (analysis) =>
    (analysis?.fillable || []).map((field) => ({
      selector: field.selector,
      value: field.value,
      label: field.label || field.name || field.id || 'Field',
      type: field.type,
      tag: field.tag,
    }))

  const hostFromUrl = (url) => {
    try {
      return new URL(url).hostname.replace(/^www\./, '')
    } catch {
      return ''
    }
  }

  root.ScholarAgentShared = {
    DOCUMENTS,
    REQUIRED_DOCUMENTS,
    DOCUMENT_PATTERNS,
    SKIPPED_INPUT_TYPES,
    normalizeText,
    compactText,
    formatDisplayDate,
    matchProfileKey,
    valueForProfileKey,
    enrichFields,
    detectRequiredDocuments,
    analyzeScan,
    buildFillPlan,
    hostFromUrl,
  }
})(typeof self !== 'undefined' ? self : window)
