'use client';

import { forwardRef } from 'react';

// MealStack 공통 인풋 컴포넌트 (피그마 디자인 기준)
const Input = forwardRef(function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  className = '',
  ...props
}, ref) {
  const inputClasses = `
    w-full px-4 py-3 
    bg-card-dark-gray 
    border border-border-gray 
    text-text-white 
    placeholder-text-light-gray
    rounded-lg
    focus:outline-none 
    focus:border-primary-red 
    focus:ring-1 
    focus:ring-primary-red
    disabled:opacity-50 
    disabled:cursor-not-allowed
    ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
    ${className}
  `.trim();
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-text-white font-semibold mb-2">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={inputClasses}
        {...props}
      />
      {error && (
        <p className="mt-1 text-red-500 text-sm">
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;