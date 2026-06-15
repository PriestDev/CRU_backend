interface InputProps {
  id: string;
  label: string;
  type: string;
  placeholder?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
  className?: string;
  required?: boolean;
}

const Input = ({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  className,
  disabled,
  required
}: InputProps) => {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="font-semibold">
        {label}
      </label>

      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`bg-white border border-(--stroke) rounded-lg p-4.5 py-3 focus:outline-(--primary) disabled:opacity-50 disabled:cursor-not-allowed ${className || ""}`}
      />
    </div>
  );
};

export default Input;
