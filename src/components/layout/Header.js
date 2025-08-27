'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

// MealStack 공통 헤더 컴포넌트
export default function Header({ title, showBack = false, showMenu = true }) {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuthStore();
  
  return (
    <header className="bg-background-black px-4 py-3 flex items-center justify-between">
      {/* 좌측: 뒤로가기 또는 로고 */}
      <div className="flex items-center">
        {showBack ? (
          <Link href="/home" className="text-text-white hover:text-text-gray">
            ← 뒤로
          </Link>
        ) : (
          <Link href="/home" className="text-primary-red text-2xl font-bold">
            mealStack
          </Link>
        )}
      </div>
      
      {/* 중앙: 페이지 제목 */}
      {title && (
        <h1 className="text-text-white text-lg font-semibold absolute left-1/2 transform -translate-x-1/2">
          {title}
        </h1>
      )}
      
      {/* 우측: 메뉴 또는 인증 상태 */}
      <div className="flex items-center">
        {isAuthenticated ? (
          <div className="flex items-center space-x-4">
            <span className="text-text-gray text-sm">
              {user?.name}님
            </span>
            {showMenu && (
              <button className="text-text-white text-3xl">
                ≡
              </button>
            )}
          </div>
        ) : (
          <Link href="/login" className="text-text-gray text-sm hover:text-text-white">
            로그인
          </Link>
        )}
      </div>
    </header>
  );
}