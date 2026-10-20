export const DEMO_USER_ID = 'student-ananya'

export const DOCUMENT_TYPES = [
  {
    id: 'income',
    label: 'Income certificate',
    shortLabel: 'Income',
    description: 'Family income proof for the current year',
    required: true,
    accent: 'clay',
  },
  {
    id: 'domicile',
    label: 'Domicile certificate',
    shortLabel: 'Domicile',
    description: 'Proof of your home state',
    required: true,
    accent: 'forest',
  },
  {
    id: 'marksheet',
    label: 'Latest marksheet',
    shortLabel: 'Marksheet',
    description: 'Your most recent semester or year',
    required: true,
    accent: 'blueink',
  },
  {
    id: 'id',
    label: 'Government ID',
    shortLabel: 'ID proof',
    description: 'Aadhaar, passport, or student ID',
    required: true,
    accent: 'honey',
  },
  {
    id: 'other',
    label: 'Other supporting paper',
    shortLabel: 'Other',
    description: 'Anything else a scheme asks for',
    required: false,
    accent: 'moss',
  },
]

export const SEED_PROFILE = {
  id: DEMO_USER_ID,
  fullName: 'Ananya Deshmukh',
  dateOfBirth: '2005-03-14',
  email: 'ananya.deshmukh@example.com',
  phone: '+91 98220 41178',
  academicYear: 'Third year',
  institution: 'Pune Institute of Technology',
  course: 'B.Tech · Computer Engineering',
  cgpa: '8.6',
  category: 'EWS',
  annualIncome: 185000,
  domicile: 'Maharashtra',
  hosteller: false,
  gender: 'Female',
  firstGeneration: true,
  updatedAt: '2026-10-12T09:15:00.000Z',
}

export const SEED_DOCUMENTS = [
  {
    id: 'doc-income-sample',
    userId: DEMO_USER_ID,
    type: 'income',
    name: 'Income certificate',
    fileName: 'income-certificate-2026.pdf',
    mimeType: 'application/pdf',
    size: 184320,
    status: 'verified',
    isSample: true,
    uploadedAt: '2026-10-04T10:30:00.000Z',
    verifiedAt: '2026-10-04T10:30:02.000Z',
    verificationNote: 'Demo copy — replace it with your own certificate.',
  },
  {
    id: 'doc-domicile-sample',
    userId: DEMO_USER_ID,
    type: 'domicile',
    name: 'Domicile certificate',
    fileName: 'domicile-certificate.pdf',
    mimeType: 'application/pdf',
    size: 156672,
    status: 'verified',
    isSample: true,
    uploadedAt: '2026-10-04T10:34:00.000Z',
    verifiedAt: '2026-10-04T10:34:02.000Z',
    verificationNote: 'Demo copy — replace it with your own certificate.',
  },
  {
    id: 'doc-marksheet-sample',
    userId: DEMO_USER_ID,
    type: 'marksheet',
    name: 'Latest marksheet',
    fileName: 'semester-5-marksheet.pdf',
    mimeType: 'application/pdf',
    size: 221184,
    status: 'verified',
    isSample: true,
    uploadedAt: '2026-10-06T17:20:00.000Z',
    verifiedAt: '2026-10-06T17:20:02.000Z',
    verificationNote: 'Demo copy — replace it with your own marksheet.',
  },
]

const sharedFormFields = [
  { portalLabel: 'Applicant full name', value: 'Ananya Deshmukh', profileKey: 'fullName' },
  { portalLabel: 'Date of birth', value: '14 March 2005', profileKey: 'dateOfBirth' },
  { portalLabel: 'Mobile number', value: '+91 98220 41178', profileKey: 'phone' },
  { portalLabel: 'Category', value: 'EWS', profileKey: 'category' },
  { portalLabel: 'Annual family income (₹)', value: '1,85,000', profileKey: 'annualIncome' },
  { portalLabel: 'Domicile state', value: 'Maharashtra', profileKey: 'domicile' },
  { portalLabel: 'Institution name', value: 'Pune Institute of Technology', profileKey: 'institution' },
  { portalLabel: 'Course', value: 'B.Tech — Computer Engineering', profileKey: 'course' },
  { portalLabel: 'Current CGPA', value: '8.6 / 10', profileKey: 'cgpa' },
  { portalLabel: 'Hosteller status', value: 'Day scholar', profileKey: 'hosteller' },
]

export const SEED_OPPORTUNITIES = [
  {
    id: 'maha-ews-tech-2026',
    userId: DEMO_USER_ID,
    title: 'State Merit & EWS Technical Education Grant',
    provider: 'Directorate of Technical Education, Maharashtra',
    providerMark: 'MH',
    kind: 'State scheme',
    amount: 75000,
    amountNote: 'per academic year',
    deadline: '2026-11-15',
    status: 'eligible',
    score: 98,
    summary:
      'Tuition support for first-generation engineering students from low-income households in Maharashtra.',
    sourceUrl: 'https://mahadbt.maharashtra.gov.in/',
    discoveredAt: '2026-10-11T08:40:00.000Z',
    nextStep:
      'Your income, domicile, and marksheet are already in the vault. You have what the form asks for.',
    matchRules: [
      {
        label: 'Family income is under the EWS ceiling',
        detail: 'Your ₹1,85,000 income sits below the ₹2,50,000 limit.',
        citation: 'Scheme guidelines · page 4, clause 2.3',
        quote:
          'Annual family income from all sources shall not exceed ₹2,50,000 for applicants under the EWS category.',
      },
      {
        label: 'You are a Maharashtra domicile',
        detail: 'Your profile lists Maharashtra as your home state.',
        citation: 'Scheme guidelines · page 2, clause 1.2',
        quote:
          'Applicants must hold a valid Maharashtra domicile certificate issued by the competent authority.',
      },
      {
        label: 'Your CGPA clears the academic bar',
        detail: 'An 8.6 CGPA is comfortably above the 7.5 minimum.',
        citation: 'Scheme guidelines · page 6, clause 4.1',
        quote:
          'A minimum cumulative grade point average of 7.5 on a 10-point scale is required at the time of application.',
      },
      {
        label: 'Your course and year qualify',
        detail: 'You are in the third year of a B.Tech programme.',
        citation: 'Scheme guidelines · page 3, clause 2.1',
        quote:
          'The grant is open to students enrolled in undergraduate technical programmes (B.E. or B.Tech) in recognised institutes.',
      },
    ],
    attention: [],
    formMap: sharedFormFields,
    requiredDocuments: ['income', 'domicile', 'marksheet'],
    note: 'The deadline is confirmed on the official portal. Keep a little room for portal downtime.',
  },
  {
    id: 'pragati-2026',
    userId: DEMO_USER_ID,
    title: 'AICTE Pragati Scholarship for Girls',
    provider: 'All India Council for Technical Education',
    providerMark: 'AI',
    kind: 'National scheme',
    amount: 50000,
    amountNote: 'per year, for two years',
    deadline: '2026-11-30',
    status: 'review',
    score: 84,
    summary:
      'A national support grant for girls in AICTE-approved technical programmes, covering tuition and study material.',
    sourceUrl: 'https://www.aicte-india.org/schemes/students-development-schemes',
    discoveredAt: '2026-10-09T13:20:00.000Z',
    nextStep:
      'Two small gaps stand between you and a complete application. Neither takes long to close.',
    matchRules: [
      {
        label: 'Family income is under the national ceiling',
        detail: 'Your income is well below the ₹8,00,000 limit.',
        citation: 'Scheme guidelines · page 3, clause 4.2',
        quote:
          'The annual family income of the applicant should not exceed ₹8,00,000 from all sources.',
      },
      {
        label: 'You meet the programme requirement',
        detail: 'You are enrolled in a technical degree at a recognised institute.',
        citation: 'Scheme guidelines · page 2, clause 3.1',
        quote:
          'The scholarship is available to girl students admitted to the first year or second year of an AICTE-approved technical course.',
      },
    ],
    attention: [
      {
        label: 'Upload this year’s income certificate',
        detail:
          'The copy in your vault is still a demo sample. A certificate dated this financial year is required.',
        citation: 'Scheme guidelines · page 5, clause 6.4',
      },
      {
        label: 'Add your institute’s AICTE ID',
        detail:
          'Your college office can share the permanent institute ID. It is printed on the application form.',
        citation: 'Scheme guidelines · page 7, clause 8.1',
      },
    ],
    formMap: sharedFormFields,
    requiredDocuments: ['income', 'marksheet', 'id'],
    note: 'The portal also asks for a short statement on why you chose your course. It is free to write closer to the deadline.',
  },
  {
    id: 'rotary-pune-2026',
    userId: DEMO_USER_ID,
    title: 'Rotary Community Merit Grant',
    provider: 'Rotary Club of Pune Central',
    providerMark: 'RC',
    kind: 'Community trust',
    amount: 30000,
    amountNote: 'one-time grant',
    deadline: '2026-12-08',
    status: 'eligible',
    score: 92,
    summary:
      'A local grant for students who show academic promise and a steady record of community work.',
    sourceUrl: 'https://www.rotary.org/en',
    discoveredAt: '2026-10-13T11:05:00.000Z',
    nextStep:
      'Almost everything is ready. The only blank field is a short note about the community work you care about.',
    matchRules: [
      {
        label: 'Local residency',
        detail: 'The grant is open to students studying in Pune.',
        citation: 'Trust application note · page 1',
        quote:
          'Applicants should currently be enrolled in a recognised institute in Pune district.',
      },
      {
        label: 'Academic standing',
        detail: 'A CGPA above 7.0 is expected. Yours is 8.6.',
        citation: 'Trust application note · page 2',
        quote: 'Applicants should maintain a cumulative grade point average of 7.0 or above.',
      },
      {
        label: 'Demonstrated community involvement',
        detail: 'Your profile notes a first-generation background and volunteer tutoring.',
        citation: 'Trust application note · page 2',
        quote:
          'Preference is given to students who can show consistent participation in community service.',
      },
    ],
    attention: [],
    formMap: [
      ...sharedFormFields.slice(0, 5),
      {
        portalLabel: 'Tell us about your community work',
        value: 'Your words — the portal asks for 150 words.',
        profileKey: null,
        needsYourInput: true,
      },
      ...sharedFormFields.slice(5, 8),
    ],
    requiredDocuments: ['marksheet', 'id'],
    note: 'The trust reviews applications in a single round. A short, honest note is better than a polished essay.',
  },
  {
    id: 'shahu-hostel-2026',
    userId: DEMO_USER_ID,
    title: 'Rajarshi Shahu Maharaj Hostel Grant',
    provider: 'Social Justice Department, Maharashtra',
    providerMark: 'SJ',
    kind: 'State scheme',
    amount: 60000,
    amountNote: 'per academic year',
    deadline: '2026-11-22',
    status: 'disqualified',
    score: 36,
    summary:
      'A hostel and mess grant for students from reserved categories living in government-recognised hostels.',
    sourceUrl: 'https://socialjustice.maharashtra.gov.in/',
    discoveredAt: '2026-10-08T07:50:00.000Z',
    nextStep: 'You can leave this one. Your living situation does not meet the scheme’s core condition.',
    matchRules: [
      {
        label: 'Domicile requirement',
        detail: 'Your Maharashtra domicile would otherwise fit.',
        citation: 'Scheme guidelines · page 2, clause 1.4',
        quote: 'The applicant must be a permanent resident of Maharashtra.',
      },
    ],
    attention: [],
    disqualifiers: [
      {
        label: 'This grant is only for hostellers',
        detail:
          'Your profile says you are a day scholar. The hostel certificate is a non-negotiable part of this scheme.',
        citation: 'Scheme guidelines · page 2, clause 3.2',
        quote:
          'The applicant must be residing in a government-recognised hostel and produce a hostel residency certificate.',
      },
    ],
    formMap: [],
    requiredDocuments: ['income', 'domicile', 'id'],
    note: 'We keep this on your desk so you can see why it does not fit, rather than wondering later.',
  },
]

export const DISCOVERED_OPPORTUNITY = {
  id: 'vidyasaarathi-merit-2026',
  userId: DEMO_USER_ID,
  title: 'Vidyasaarathi Merit Scholarship',
  provider: 'Vidyasaarathi Trust',
  providerMark: 'VS',
  kind: 'Private trust',
  amount: 40000,
  amountNote: 'per academic year',
  deadline: '2026-12-20',
  status: 'eligible',
  score: 89,
  summary:
    'A private merit scholarship for engineering students with strong grades and a household income under ₹6 lakh.',
  sourceUrl: 'https://www.vidyasaarathi.co.in/',
  discoveredAt: '2026-10-20T10:00:00.000Z',
  nextStep: 'This one surfaced in your latest search. Your profile covers every listed condition.',
  matchRules: [
    {
      label: 'Household income within the trust’s range',
      detail: 'Your ₹1,85,000 income is below the ₹6,00,000 ceiling.',
      citation: 'Trust guidelines · page 1, clause 2',
      quote: 'Household income from all sources should not exceed ₹6,00,000 per annum.',
    },
    {
      label: 'Engineering programme',
      detail: 'You are in a B.Tech programme, one of the eligible courses.',
      citation: 'Trust guidelines · page 2, clause 4',
      quote:
        'Scholarships are open to students pursuing engineering, technology, or selected science degrees.',
    },
    {
      label: 'Grades above the cut-off',
      detail: 'Your 8.6 CGPA clears the 7.0 requirement.',
      citation: 'Trust guidelines · page 3, clause 5',
      quote: 'Applicants must have secured at least 70% or a 7.0 CGPA in their most recent examination.',
    },
  ],
  attention: [],
  formMap: sharedFormFields,
  requiredDocuments: ['income', 'marksheet'],
  note: 'The trust asks for a bonafide letter from your institute. Your college office usually issues it the same day.',
  isNew: true,
}

export const sampleDocumentFor = (doc) => {
  const type = DOCUMENT_TYPES.find((item) => item.id === doc.type) ?? DOCUMENT_TYPES[4]
  return {
    ...doc,
    typeLabel: type.label,
  }
}
