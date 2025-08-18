'use client';

// MealStack 공통 카드 컴포넌트 (피그마 디자인 기준)
export default function Card({
  children,
  variant = 'default', // default, product, subscription
  className = '',
  onClick,
  hover = false,
  ...props
}) {
  const baseStyles = 'rounded-lg transition-all duration-200';
  
  const variants = {
    default: 'bg-card-gray p-6',
    product: 'bg-card-dark-gray p-4',
    subscription: 'bg-card-gray border border-primary-red p-6',
    dark: 'bg-background-dark p-6'
  };
  
  const hoverStyles = hover ? 'hover:transform hover:scale-105 cursor-pointer' : '';
  const clickableStyles = onClick ? 'cursor-pointer hover:opacity-80' : '';
  
  const cardClasses = `
    ${baseStyles}
    ${variants[variant]}
    ${hoverStyles}
    ${clickableStyles}
    ${className}
  `.trim();
  
  return (
    <div
      className={cardClasses}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}