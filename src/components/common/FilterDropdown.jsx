import Select from './Select'

/** A labeled dropdown that reports the new value (not the DOM event). */
export default function FilterDropdown({ label, value, onChange, options, className = '' }) {
  return (
    <Select
      label={label}
      options={options}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={className}
    />
  )
}