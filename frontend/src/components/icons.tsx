/** Small inline icons; inherit `currentColor` from parent. */

export function IconChevronRight({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M6 3l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Stacked lines — “summary / results”. */
export function IconResults({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect x="2" y="4" width="12" height="1.75" rx="0.5" opacity="0.85" />
      <rect x="2" y="7.5" width="8" height="1.75" rx="0.5" opacity="0.85" />
      <rect x="2" y="11" width="12" height="1.75" rx="0.5" opacity="0.85" />
    </svg>
  )
}

export function IconSun({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="9" cy="9" r="3.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M9 1.75v2M9 14.25v2M16.25 9h-2M3.75 9h-2M14.13 3.87l-1.42 1.42M5.29 12.71l-1.42 1.42M14.13 14.13l-1.42-1.42M5.29 5.29L3.87 3.87"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function IconMoon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M11.97 1.94a6.75 6.75 0 1 0 4.09 10.8A7.25 7.25 0 0 1 11.97 1.94Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}
