import { Reveal } from '@/components/site/Reveal'

export function GoldDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex justify-center ${className}`}>
      <Reveal variant="line" as="span" className="block h-px bg-gold" />
    </div>
  )
}
