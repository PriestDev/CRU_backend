interface textBoxProps {
  id: string;
  label: string;
  placeholder: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  className?: string;
  disabled?: boolean;
  extraText?: string
}

const TextBox = ({
  id,
  label,
  placeholder,
  value,
  className,
  extraText,
}: textBoxProps) => {
  return (
    <div className="flex flex-col gap-1">
      <div className=" flex justify-between items-center">
        <label htmlFor={id} className="font-semibold">
          {label}
        </label>
        <p className=" text-(--lightText)">0/120</p>
      </div>
      <textarea
        id={id}
        placeholder={placeholder}
        rows={5}
        value={value}
        className={`bg-white border border-(--stroke) rounded-lg p-4.5 py-3 focus:outline-(--primary) disabled:opacity-50 disabled:cursor-not-allowed ${className || ""}`}
      />
      <p className=" text-(--lightText)">{extraText}</p>
    </div>
  );
};

export default TextBox;
