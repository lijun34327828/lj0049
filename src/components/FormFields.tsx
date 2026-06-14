import React from 'react';

interface FieldProps {
  label: string;
  children: React.ReactNode;
  hint?: string;
}

export const Field: React.FC<FieldProps> = ({ label, children, hint }) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-medium text-slate-700">{label}</label>
    {children}
    {hint && <p className="text-[11px] text-slate-400">{hint}</p>}
  </div>
);

interface NumberInputProps {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  placeholder?: string;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  min = 0,
  max = 1000,
  step = 1,
  unit,
  placeholder,
}) => (
  <div className="relative">
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      min={min}
      max={max}
      step={step}
      placeholder={placeholder}
      className="w-full h-8 px-3 pr-8 text-sm border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
    />
    {unit && (
      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none">
        {unit}
      </span>
    )}
  </div>
);

interface ColorInputProps {
  value: string;
  onChange: (v: string) => void;
  allowTransparent?: boolean;
}

export const ColorInput: React.FC<ColorInputProps> = ({ value, onChange, allowTransparent = true }) => (
  <div className="relative flex items-center gap-2">
    <div className="relative">
      <input
        type="color"
        value={value === 'transparent' || !value.startsWith('#') ? '#000000' : value}
        onChange={(e) => onChange(e.target.value)}
        className="w-8 h-8 rounded-md border border-slate-200 cursor-pointer bg-white overflow-hidden"
      />
    </div>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex-1 h-8 px-2.5 text-xs font-mono border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
    />
    {allowTransparent && (
      <button
        onClick={() => onChange('transparent')}
        className={`h-8 px-2 text-[11px] rounded-md border transition-colors ${
          value === 'transparent'
            ? 'bg-blue-50 border-blue-200 text-blue-700'
            : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
        }`}
      >
        透明
      </button>
    )}
  </div>
);

interface TextInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: 'text' | 'textarea';
}

export const TextInput: React.FC<TextInputProps> = ({ value, onChange, placeholder, type = 'text' }) =>
  type === 'textarea' ? (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={3}
      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md bg-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
    />
  ) : (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full h-8 px-3 text-sm border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
    />
  );

interface SelectInputProps<T extends string> {
  value: T;
  onChange: (v: T) => void;
  options: { label: string; value: T }[];
}

export const SelectInput = <T extends string>({ value, onChange, options }: SelectInputProps<T>) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value as T)}
    className="w-full h-8 px-3 text-sm border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
  >
    {options.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
);

interface SliderInputProps {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
}

export const SliderInput: React.FC<SliderInputProps> = ({
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
}) => (
  <div className="flex items-center gap-3">
    <input
      type="range"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      min={min}
      max={max}
      step={step}
      className="flex-1 h-1.5 accent-blue-600 cursor-pointer"
    />
    <div className="w-16 h-7 flex items-center justify-center text-xs font-medium text-slate-600 bg-slate-50 rounded-md border border-slate-200">
      {value}
      {unit && <span className="text-slate-400 ml-0.5">{unit}</span>}
    </div>
  </div>
);

interface SectionProps {
  title: string;
  children: React.ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
}

export const Section: React.FC<SectionProps> = ({ title, children, collapsible = false, defaultOpen = true }) => {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div className="border-b border-slate-100 last:border-b-0">
      <button
        onClick={() => collapsible && setOpen(!open)}
        className={`w-full px-4 py-3 flex items-center justify-between text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors ${
          collapsible ? 'cursor-pointer' : 'cursor-default'
        }`}
      >
        <span>{title}</span>
        {collapsible && (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`text-slate-400 transition-transform ${open ? 'rotate-90' : ''}`}
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        )}
      </button>
      {open && <div className="px-4 pb-4 space-y-4">{children}</div>}
    </div>
  );
};
