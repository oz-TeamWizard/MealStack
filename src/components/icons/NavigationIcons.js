// 하단 네비게이션 아이콘들 (피그마 디자인 기준)

export const HomeIcon = ({ active = false, className = "" }) => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" 
      stroke={active ? "#dc2626" : "#cccccc"}
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      fill={active ? "#dc2626" : "transparent"}
    />
    <path 
      d="M9 22V12H15V22" 
      stroke={active ? "#ffffff" : "#cccccc"}
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

export const ShopIcon = ({ active = false, className = "" }) => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect 
      x="4" 
      y="7" 
      width="16" 
      height="13" 
      rx="2" 
      stroke={active ? "#dc2626" : "#cccccc"}
      strokeWidth="2.5" 
      fill={active ? "#dc2626" : "transparent"}
    />
    <path 
      d="M8 7V5C8 4.46957 8.21071 3.96086 8.58579 3.58579C8.96086 3.21071 9.46957 3 10 3H14C14.5304 3 15.0391 3.21071 15.4142 3.58579C15.7893 3.96086 16 4.46957 16 5V7" 
      stroke={active ? "#ffffff" : "#cccccc"}
      strokeWidth="2" 
      fill="none"
    />
    <path 
      d="M4 7L6 4H18L20 7" 
      stroke={active ? "#ffffff" : "#cccccc"}
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

export const StarIcon = ({ active = false, className = "" }) => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect 
      x="3" 
      y="3" 
      width="18" 
      height="18" 
      rx="3" 
      stroke={active ? "#dc2626" : "#cccccc"}
      strokeWidth="2.5" 
      fill={active ? "#dc2626" : "transparent"}
    />
    <path 
      d="M12 7L13.545 10.09L17 10.545L14.727 12.727L15.364 16.182L12 14.545L8.636 16.182L9.273 12.727L7 10.545L10.455 10.09L12 7Z" 
      stroke={active ? "#ffffff" : "#cccccc"}
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      fill={active ? "#ffffff" : "none"}
    />
  </svg>
);

export const UserIcon = ({ active = false, className = "" }) => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle 
      cx="12" 
      cy="8" 
      r="3.5" 
      stroke={active ? "#dc2626" : "#cccccc"}
      strokeWidth="2.5" 
      fill={active ? "#dc2626" : "transparent"}
    />
    <path 
      d="M6 21C6 18.2386 8.68629 16 12 16C15.3137 16 18 18.2386 18 21" 
      stroke={active ? "#dc2626" : "#cccccc"}
      strokeWidth="2.5" 
      strokeLinecap="round"
      fill={active ? "#dc2626" : "transparent"}
    />
  </svg>
);