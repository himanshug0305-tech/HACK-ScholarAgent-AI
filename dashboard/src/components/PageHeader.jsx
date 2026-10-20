export function PageHeader({ eyebrow, title, description, actions, className = '' }) {
  return (
    <header className={`flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between ${className}`}>
      <div className="max-w-[730px]">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h1 className="font-display text-[38px] font-normal leading-[1.02] tracking-[-0.035em] text-ink sm:text-[46px] lg:text-[52px]">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-[560px] text-[14.5px] leading-[1.75] text-ink-soft">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </header>
  )
}
