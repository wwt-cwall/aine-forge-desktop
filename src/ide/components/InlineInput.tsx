import { useEffect, useRef } from "react";

interface InlineInputProps {
  initialValue?: string;
  onSubmit: (value: string) => void;
  onCancel: () => void;
}

export function InlineInput({ initialValue = "", onSubmit, onCancel }: InlineInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const settledRef = useRef(false);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    input.focus();
    const dotIndex = initialValue.lastIndexOf(".");
    if (dotIndex > 0) input.setSelectionRange(0, dotIndex);
    else input.select();
  }, [initialValue]);

  function settle(fn: () => void) {
    if (settledRef.current) return;
    settledRef.current = true;
    fn();
  }

  return (
    <input
      ref={inputRef}
      className="inline-input"
      defaultValue={initialValue}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        e.stopPropagation();
        if (e.key === "Enter") {
          settle(() => onSubmit(inputRef.current?.value ?? ""));
        } else if (e.key === "Escape") {
          settle(onCancel);
        }
      }}
      onBlur={() => {
        settle(() => onSubmit(inputRef.current?.value ?? ""));
      }}
    />
  );
}
