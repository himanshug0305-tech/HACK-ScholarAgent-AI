export const formatCurrency = (value, options = {}) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
    ...options,
  }).format(Number(value) || 0)

export const formatCompactCurrency = (value) => {
  const amount = Number(value) || 0
  if (amount >= 100000) {
    const lakhs = amount / 100000
    return `₹${Number.isInteger(lakhs) ? lakhs : lakhs.toFixed(1)}L`
  }
  if (amount >= 1000) {
    const thousands = amount / 1000
    return `₹${Number.isInteger(thousands) ? thousands : thousands.toFixed(1)}k`
  }
  return formatCurrency(amount)
}

export const parseDate = (value) => {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export const formatDate = (value, options = {}) => {
  const date = parseDate(value)
  if (!date) return '—'
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...options,
  }).format(date)
}

export const formatShortDate = (value) =>
  formatDate(value, { day: 'numeric', month: 'short' })

export const formatToday = (date = new Date()) =>
  new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date)

export const daysUntil = (value) => {
  const date = parseDate(value)
  if (!date) return null
  const today = new Date()
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  return Math.ceil((target - startOfToday) / 86400000)
}

export const deadlineLabel = (value) => {
  const days = daysUntil(value)
  if (days === null) return 'No deadline listed'
  if (days < 0) return 'Closed'
  if (days === 0) return 'Closes today'
  if (days === 1) return 'Closes tomorrow'
  if (days <= 30) return `Closes in ${days} days`
  return `Closes ${formatShortDate(value)}`
}

export const formatFileSize = (bytes) => {
  if (!bytes) return '—'
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export const initials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

export const firstName = (name = '') => name.split(' ')[0] || 'there'

export const greetingFor = (date = new Date()) => {
  const hour = date.getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export const truncate = (value = '', length = 120) =>
  value.length > length ? `${value.slice(0, length).trimEnd()}…` : value

export const timeAgo = (value) => {
  const date = parseDate(value)
  if (!date) return ''
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} ${days === 1 ? 'day' : 'days'} ago`
  return formatShortDate(value)
}

export const pluralize = (count, singular, plural = `${singular}s`) =>
  `${count} ${count === 1 ? singular : plural}`
