import type { Lang } from '@/lib/i18n';

export default function LanguageToggle({
  value, onChange
}: { value: Lang; onChange: (v: Lang) => void }) {
  return (
    <select
      className="field w-[70px] text-sm"
      value={value}
      onChange={(e) => onChange(e.target.value as Lang)}
      title="Language"
    >
      <option value="EN">EN</option>
      <option value="TI">TI</option>
      <option value="AM">AM</option>
    </select>
  );
}