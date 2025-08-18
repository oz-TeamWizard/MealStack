'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, ShopIcon, StarIcon, UserIcon } from '@/components/icons/NavigationIcons';

// MealStack 하단 네비게이션 바 (피그마 디자인 기준)
export default function BottomNav() {
  const pathname = usePathname();
  
  const navItems = [
    { 
      path: '/home', 
      label: '홈', 
      icon: HomeIcon 
    },
    { 
      path: '/products', 
      label: '상품구매', 
      icon: ShopIcon 
    },
    { 
      path: '/subscription', 
      label: '구독신청', 
      icon: StarIcon 
    },
    { 
      path: '/mypage', 
      label: '마이페이지', 
      icon: UserIcon 
    }
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card-dark-gray border-t border-border-gray">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const IconComponent = item.icon;
          
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`
                flex flex-col items-center py-2 px-2 min-w-[60px] transition-colors duration-200
                ${isActive 
                  ? 'text-primary-red' 
                  : 'text-text-gray hover:text-text-white'
                }
              `}
            >
              <div className="mb-1">
                <IconComponent active={isActive} />
              </div>
              <span className={`text-xs font-medium ${isActive ? 'text-primary-red' : 'text-text-gray'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}