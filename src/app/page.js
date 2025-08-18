'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

// 루트 페이지 - 인증 상태에 따라 리다이렉트
export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated, checkAutoLogin } = useAuthStore();
  
  useEffect(() => {
    // 자동 로그인 체크
    const isLoggedIn = checkAutoLogin();
    
    if (isLoggedIn) {
      router.replace('/home');
    } else {
      router.replace('/home'); // 비로그인 상태에서도 홈으로 이동 (사전예약 가능)
    }
  }, [router, checkAutoLogin]);
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-4 loading-spinner"></div>
        <p className="text-text-gray">로딩 중...</p>
      </div>
    </div>
  );
}