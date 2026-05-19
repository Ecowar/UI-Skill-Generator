interface SliderProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  label?: string
  unit?: string
}

export function Slider({ value, onChange, min = 0, max = 100, step = 1, label, unit = '' }: SliderProps) {
  return (
    <div>
      {label && (
        <label className="block text-xs text-gray-600 mb-1 flex justify-between">
          <span>{label}</span>
          <span className="text-gray-800">{value}{unit}</span>
        </label>
      )}
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
      />
      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: #3b82f6;
          border-radius: 50%;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: #3b82f6;
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  )
}
