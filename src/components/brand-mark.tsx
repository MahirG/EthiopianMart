import { cn } from '@/lib/utils'

interface BrandMarkProps {
  compact?: boolean
  inverse?: boolean
  className?: string
}

export function BrandMark({ compact = false, inverse = false, className }: BrandMarkProps) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span
        className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-[14px] bg-[#0f5132] shadow-[0_8px_24px_-12px_rgba(15,81,50,0.9)]"
        aria-hidden="true"
      >
        <span className="absolute -left-2 top-2 h-2 w-14 -rotate-45 bg-[#f3c64d]" />
        <span className="absolute -left-1 bottom-2 h-1.5 w-14 -rotate-45 bg-[#c84a34]" />
        <svg viewBox="0 0 24 24" className="relative h-5 w-5 text-white" fill="none">
          <path d="M6 7.25 12 4l6 3.25v9.5L12 20l-6-3.25v-9.5Z" stroke="currentColor" strokeWidth="1.8" />
          <path d="m8.5 9 3.5 2 3.5-2M12 11v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </span>
      {!compact && (
        <span className="leading-none">
          <span className={cn('block text-[17px] font-extrabold tracking-[-0.045em]', inverse ? 'text-white' : 'text-foreground')}>
            Ethiopian<span className={inverse ? 'text-[#f3c64d]' : 'text-[#0f7a4b]'}>Mart</span>
          </span>
          <span className={cn('mt-1 block text-[9px] font-semibold tracking-[0.16em]', inverse ? 'text-white/65' : 'text-muted-foreground')}>
            FROM ETHIOPIA, WITH PRIDE
          </span>
        </span>
      )}
    </span>
  )
}
