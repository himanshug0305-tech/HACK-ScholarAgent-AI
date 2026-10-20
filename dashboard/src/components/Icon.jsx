const ICONS = {
  'arrow-right': <path d="M4 12h16m-6-6 6 6-6 6" />,
  'arrow-left': <path d="M20 12H4m6 6-6-6 6-6" />,
  'arrow-up-right': <path d="M7 17 17 7M8 7h9v9" />,
  'chevron-right': <path d="m9 18 6-6-6-6" />,
  'chevron-left': <path d="m15 18-6-6 6-6" />,
  'chevron-down': <path d="m6 9 6 6 6-6" />,
  'chevron-up': <path d="m18 15-6-6-6 6" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  x: <path d="M18 6 6 18M6 6l12 12" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
  sparkles: (
    <>
      <path d="m12 3-1.3 3.8a5.5 5.5 0 0 1-3.4 3.4L3.5 11.5l3.8 1.3a5.5 5.5 0 0 1 3.4 3.4L12 20l1.3-3.8a5.5 5.5 0 0 1 3.4-3.4l3.8-1.3-3.8-1.3a5.5 5.5 0 0 1-3.4-3.4L12 3Z" />
      <path d="M19 3v4M21 5h-4" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
    </>
  ),
  home: (
    <>
      <path d="m3 10 9-7 9 7v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9Z" />
      <path d="M9 21v-8h6v8" />
    </>
  ),
  file: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6M8 13h8M8 17h6" />
    </>
  ),
  'file-text': (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6M8 13h8M8 17h5" />
    </>
  ),
  folder: (
    <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
  'user-round': (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M5 21a7 7 0 0 1 14 0" />
    </>
  ),
  check: <path d="m4 12.5 5 5L20 6.5" />,
  'check-circle': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12.5 2.7 2.7L16.5 9" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </>
  ),
  upload: (
    <>
      <path d="M12 16V4m-4 4 4-4 4 4" />
      <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
    </>
  ),
  'upload-cloud': (
    <>
      <path d="M16 16l-4-4-4 4M12 12v9" />
      <path d="M20.4 17.5A5 5 0 0 0 18 8.2h-1.3A8 8 0 1 0 4 16.9" />
    </>
  ),
  trash: (
    <>
      <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 15H6L5 6" />
      <path d="M10 11v6M14 11v6" />
    </>
  ),
  logout: (
    <>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5M21 12H9" />
    </>
  ),
  shield: (
    <>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),
  alert: (
    <>
      <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4M12 17h.01" />
    </>
  ),
  star: <path d="m12 2.5 2.9 5.9 6.6.9-4.8 4.6 1.2 6.5L12 17.3l-5.9 3.1 1.2-6.5-4.8-4.6 6.6-.9L12 2.5Z" />,
  book: (
    <>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15Z" />
      <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5" />
    </>
  ),
  'map-pin': (
    <>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  puzzle: (
    <path d="M19 13h-2.2a2 2 0 0 1 0-4H19V5a1 1 0 0 0-1-1h-4v2.2a2 2 0 0 1-4 0V4H6a1 1 0 0 0-1 1v4h2.2a2 2 0 0 1 0 4H5v6a1 1 0 0 0 1 1h6v-2.2a2 2 0 0 1 4 0V20h3a1 1 0 0 0 1-1v-6Z" />
  ),
  browser: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <path d="M3 9h18M7 6.5h.01M10 6.5h.01" />
    </>
  ),
  spark: (
    <path d="M12 3v5m0 8v5M3 12h5m8 0h5M5.6 5.6l3.5 3.5m5.8 5.8 3.5 3.5m0-12.8-3.5 3.5m-5.8 5.8-3.5 3.5" />
  ),
  rupee: (
    <>
      <path d="M6 3h12M6 8h12M6 13h6a5 5 0 0 0 0-10M6 13l8 8" />
    </>
  ),
  graduation: (
    <>
      <path d="m22 9-10-5L2 9l10 5 10-5Z" />
      <path d="M6 11.5V17c0 1.7 2.7 3 6 3s6-1.3 6-3v-5.5" />
      <path d="M22 9v6" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  external: (
    <>
      <path d="M15 3h6v6M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </>
  ),
  download: (
    <>
      <path d="M12 3v12m-5-5 5 5 5-5" />
      <path d="M5 21h14" />
    </>
  ),
  eye: (
    <>
      <path d="M2.1 12a10.9 10.9 0 0 1 19.8 0 10.9 10.9 0 0 1-19.8 0Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  refresh: (
    <>
      <path d="M21 12a9 9 0 1 1-2.6-6.4L21 8" />
      <path d="M21 3v5h-5" />
    </>
  ),
  lock: (
    <>
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  phone: (
    <path d="M21 16.9v2.5a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 1.1 3.6 2 2 0 0 1 3.1 1.4h2.5a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L6.7 9.2a16 16 0 0 0 6 6l1.1-1.1a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z" />
  ),
  loader: (
    <>
      <path d="M21 12a9 9 0 1 1-6.2-8.6" />
    </>
  ),
  more: (
    <>
      <circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  paperclip: <path d="m21.4 11.05-9.2 9.2a6 6 0 0 1-8.5-8.5l9.2-9.2a4 4 0 1 1 5.7 5.7l-9.3 9.2a2 2 0 0 1-2.8-2.8l8.5-8.5" />,
  stop: <rect x="6" y="6" width="12" height="12" rx="2" />,
  send: (
    <>
      <path d="m22 2-7 20-4-9-9-4 20-7Z" />
      <path d="M22 2 11 13" />
    </>
  ),
  leaf: (
    <>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10Z" />
      <path d="M2 21c0-3 1.9-5.3 5.2-6" />
    </>
  ),
  'trending-up': <path d="m3 17 6-6 4 4 8-8m0 0h-6m6 0v6" />,
  'bookmark': <path d="M6 3h12a1 1 0 0 1 1 1v18l-7-4-7 4V4a1 1 0 0 1 1-1Z" />,
}

export function Icon({ name, size = 18, strokeWidth = 1.8, className = '', ...props }) {
  const content = ICONS[name]

  if (!content) return null

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {content}
    </svg>
  )
}
