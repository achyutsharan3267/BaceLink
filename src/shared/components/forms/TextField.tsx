type TextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
};

const inputClass =
  "w-full rounded-2xl border border-amber-300/20 bg-[#06142b]/80 px-4 py-3 text-amber-50 outline-none transition focus:border-amber-300/70";
const labelClass = "mb-2 block text-sm font-bold text-amber-200/90";

function fieldId(label: string) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export function TextField({ label, value, onChange, multiline = false }: TextFieldProps) {
  const id = fieldId(label);

  return (
    <label htmlFor={id} className="block">
      <span className={labelClass}>{label}</span>
      {multiline ? (
        <textarea
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={4}
          className={inputClass}
        />
      ) : (
        <input
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={inputClass}
        />
      )}
    </label>
  );
}
