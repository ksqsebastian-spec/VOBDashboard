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
    <div className="flex gap-0.5 bg-slate-100 rounded-xl p-0.5">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3.5 py-1.5 text-xs rounded-lg transition-all duration-150 ${
            value === opt.value
              ? 'bg-white text-slate-800 shadow-sm font-semibold'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
