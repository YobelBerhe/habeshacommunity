export default function LanguageToggle({
  value, onChange
}: { value: string; onChange: (v:string)=>void }) {
  return (
    <select
      className="field w-[92px]"
      value={value}
      onChange={(e)=>onChange(e.target.value)}
      title="Language"
    >
      <option value="EN">EN</option>
      <option value="TI">ትግ</option>
    </select>
  );
}