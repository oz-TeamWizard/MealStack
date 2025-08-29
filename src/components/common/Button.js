'use client';

// MealStack 공통 버튼 컴포넌트 (피그마 디자인 기준)
export default function Button({
  children,
  variant = 'primary', // primary, secondary, outline
  size = 'md', // sm, md, lg
  disabled = false,
  loading = false,
  onClick,
  className = '',
  ...props
}) {
  const baseStyles = 'font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center';
  
  const variants = {
    primary: 'bg-primary-red hover:bg-primary-red-hover text-white disabled:bg-gray-400',
    secondary: 'bg-card-gray hover:bg-gray-600 text-white disabled:bg-gray-500',
    outline: 'border-2 border-primary-red text-primary-red hover:bg-primary-red hover:text-white disabled:border-gray-400 disabled:text-gray-400'
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };
  
  const buttonClasses = `
    ${baseStyles}
    ${variants[variant] || ''}
    ${sizes[size]}
    ${disabled || loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
    ${className}
  `.trim();
  
  return (
    <button
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
          처리중...
        </div>
      ) : (
        children
      )}
    </button>
  );
}