'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import Button from '@/components/common/Button';
import { useAuthStore } from '@/stores/authStore';

// 카카오 로그인 - 개발자 A 담당
export default function LoginPage() {
  const router = useRouter();
  const {
    isLoading,
    isAuthenticated,
    kakaoLogin,
    processKakaoCallback,
    initializeKakao,
    reset
  } = useAuthStore();
  
  const [error, setError] = useState('');
  
  // 카카오 콜백 처리
  const handleKakaoCallback = useCallback(async (code) => {
    setError('');
    try {
      const result = await processKakaoCallback(code);
      if (result.success) {
        console.log('카카오 로그인 성공, 홈으로 이동');
        router.push('/home');
      } else {
        setError(result.error);
        // URL에서 code 파라미터 제거
        router.replace('/login');
      }
    } catch (err) {
      console.error('카카오 콜백 처리 오류:', err);
      setError('로그인 처리 중 오류가 발생했습니다.');
      router.replace('/login');
    }
  }, [processKakaoCallback, router]);

  useEffect(() => {
    // 이미 로그인된 경우 홈으로 리다이렉트
    if (isAuthenticated) {
      router.replace('/home');
      return;
    }
    
    // URL에 code 파라미터가 있으면 카카오 콜백 처리 (클라이언트 사이드에서만)
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      if (code) {
        console.log('카카오 인증 코드 발견:', code);
        handleKakaoCallback(code);
      } else {
        // 카카오 SDK 초기화 (일반 로그인 페이지 접근 시)
        initializeKakao();
      }
    }
    
    // 컴포넌트 언마운트 시 상태 리셋
    return () => reset();
  }, [isAuthenticated, router, reset, initializeKakao, handleKakaoCallback]);
  
  // 카카오 로그인 처리
  const handleKakaoLogin = async () => {
    setError('');
    const result = await kakaoLogin();
    if (result.success) {
      router.push('/home');
    } else {
      setError(result.error);
    }
  };
  
  return (
    <div className="min-h-screen bg-background-black">
      <Header title="로그인" showBack={true} />
      
      <main className="px-4 py-6">
        <div className="max-w-md mx-auto">
          {/* 안내 메시지 */}
          <div className="mb-12">
            <h1 className="text-lg font-semibold text-text-white mb-2">
              간편하게 로그인하고
              <br />
              맛있는 벌크업 도시락을 만나보세요
            </h1>
            <p className="text-text-gray text-sm mt-4">
              카카오 로그인으로 빠르고 안전하게 시작하세요
            </p>
          </div>
          
          {/* 카카오 로그인 버튼 */}
          <div className="mb-6">
            <Button
              onClick={handleKakaoLogin}
              loading={isLoading}
              disabled={isLoading}
              className="w-full bg-yellow-400 text-gray-900 font-semibold py-4 rounded-lg hover:bg-yellow-500 disabled:bg-yellow-600"
            >
              {isLoading ? '로그인 중...' : '카카오로 시작하기'}
            </Button>
          </div>
          
          {/* 에러 메시지 */}
          {error && (
            <div className="mb-6">
              <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            </div>
          )}
          
          {/* 카카오 로그인 아이콘 추가 */}
          <div className="text-center mb-8">
            <div className="inline-block w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">💬</span>
            </div>
            <p className="text-text-light-gray text-xs">
              카카오 계정으로 간편 로그인
            </p>
          </div>
          
          {/* 서비스 안내 */}
          <div className="text-text-light-gray text-xs space-y-1 text-center">
            <p>• 개인정보는 안전하게 보호됩니다</p>
            <p>• 닉네임과 프로필 이미지만 수집합니다</p>
            <p>• 언제든지 연결 해제가 가능합니다</p>
          </div>
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
}