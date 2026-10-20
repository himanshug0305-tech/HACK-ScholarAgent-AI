export const STATUS_META = {
  eligible: {
    label: 'Ready to apply',
    shortLabel: 'Ready',
    tone: 'ok',
    description: 'Your profile clears the visible criteria.',
  },
  review: {
    label: 'Needs a look',
    shortLabel: 'Review',
    tone: 'review',
    description: 'A small detail still needs your attention.',
  },
  disqualified: {
    label: 'Not a fit',
    shortLabel: 'Not a fit',
    tone: 'danger',
    description: 'One or more core conditions do not match.',
  },
  filling: {
    label: 'Filling in progress',
    shortLabel: 'Filling',
    tone: 'info',
    description: 'An application is being prepared.',
  },
  submitted: {
    label: 'Submitted',
    shortLabel: 'Submitted',
    tone: 'info',
    description: 'Your application has been sent.',
  },
  closed: {
    label: 'Closed',
    shortLabel: 'Closed',
    tone: 'neutral',
    description: 'The deadline has passed.',
  },
}

export const statusMeta = (status) => STATUS_META[status] ?? STATUS_META.review

export const PROFILE_FIELD_WEIGHTS = [
  'fullName',
  'dateOfBirth',
  'email',
  'phone',
  'academicYear',
  'institution',
  'course',
  'cgpa',
  'category',
  'annualIncome',
  'domicile',
  'hosteller',
  'gender',
]

export const profileCompletion = (profile) => {
  if (!profile) return 0
  const filled = PROFILE_FIELD_WEIGHTS.filter((key) => {
    const value = profile[key]
    if (typeof value === 'boolean') return true
    return value !== undefined && value !== null && String(value).trim() !== ''
  }).length
  return Math.round((filled / PROFILE_FIELD_WEIGHTS.length) * 100)
}

export const PROFILE_CHECKS = [
  { key: 'fullName', label: 'Your name' },
  { key: 'institution', label: 'Institution' },
  { key: 'course', label: 'Course and year' },
  { key: 'cgpa', label: 'Academic score' },
  { key: 'annualIncome', label: 'Family income' },
  { key: 'domicile', label: 'Domicile' },
  { key: 'category', label: 'Category' },
]

export const CATEGORY_OPTIONS = ['EWS', 'OBC', 'SC', 'ST', 'General']
export const ACADEMIC_YEAR_OPTIONS = ['First year', 'Second year', 'Third year', 'Fourth year', 'Postgraduate']
export const DOMICILE_OPTIONS = [
  'Andhra Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Tamil Nadu',
  'Telangana',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
]
