'use client'

interface StatusFilterProps {
  value: string
  onChange: (value: string) => void
}

export function StatusFilter({ value, onChange }: StatusFilterProps) {
  const options = [
    { value: 'all', label: 'Alle' },
    { value: 'active', label: 'Aktiv' },
    { value: 'expired', label: 'Abgelaufen' },
  ]

  return (
    <div className="flex gap-1 bg-[#F1F5F9] rounded-lg p-0.5">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
            value === opt.value
              ? 'bg-white text-[#1E293B] shadow-sm font-medium'
              : 'text-[#64748B] hover:text-[#1E293B]'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
