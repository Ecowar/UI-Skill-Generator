interface ProgressBarProps {
  progress: number
  onChange: (progress: number) => void
  label?: string
}

export function ProgressBar({
  progress,
  onChange,
  label,
}: ProgressBarProps) {
  return (
    <div>
      {label && (
        <label className="block text-xs text-gray-600 mb-1 flex justify-between">
          <span>{label}</span>
          <span className="text-gray-800">{progress}%</span>
        </label>
      )}
      <input
        type="range"
        value={progress}
        onChange={(e) => onChange(Number(e.target.value))}
        min={0}
        max={100}
        step={1}
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
