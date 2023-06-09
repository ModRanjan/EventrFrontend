import React from 'react';

type InputProps = {
  customClasses?: string;
  error?: boolean;
  display?: string;
  inputRef?: any;
  label?: string;
  name?: string;
  onChange?: () => void;
  placeholder?: string;
  textProperties?: string;
  type: React.HTMLInputTypeAttribute;
  value?: string;
};

export const Input = ({
  customClasses,
  error,
  display,
  inputRef,
  label,
  name,
  onChange,
  placeholder,
  textProperties,
  type,
  value,
}: InputProps) => {
  const className = [
    'block',
    'border border-gray-300',
    display ? display : 'inline-flex items-center justify-center',
    'focus:ring-sky-500 focus:border-sky-500',
    'outline-0',
    'px-2 py-1',
    'rounded-md',
    'shadow-sm',
    textProperties ? textProperties : 'text-gray-600 text-sm font-normal',
    'w-full',
    error && 'border-red-500 outline-red-500',
  ].join(' ');

  return (
    <div className="flex flex-col space-y-1 font-semibold">
      {label && (
        <label htmlFor={name} className="font-medium text-gray-600">
          {label}
        </label>
      )}

      <input
        className={customClasses || className}
        type={type}
        id={name}
        placeholder={placeholder}
        value={value}
        name={name}
        onChange={onChange}
        ref={inputRef}
      />

      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};
