'use client';

import { useEffect } from 'react';

// 카카오 SDK 초기화를 담당하는 클라이언트 컴포넌트
export default function KakaoSDKProvider() {
  useEffect(() => {
    // 카카오 SDK 로드 확인 및 초기화
    const initKakaoSDK = async () => {
      // 카카오 SDK 로드 대기
      let attempts = 0;
      const maxAttempts = 50; // 200ms * 50 = 10초
      
      while (!window.Kakao && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 200));
        attempts++;
      }

      if (!window.Kakao) {
        console.error('카카오 SDK 로드 실패: 타임아웃');
        return;
      }

      // 카카오 SDK 초기화
      if (!window.Kakao.isInitialized()) {
        try {
          window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
          console.log('Kakao SDK 초기화 완료:', window.Kakao.isInitialized());
        } catch (error) {
          console.error('카카오 SDK 초기화 실패:', error);
        }
      } else {
        console.log('카카오 SDK는 이미 초기화되었습니다.');
      }
    };

    // 브라우저 환경에서만 실행
    if (typeof window !== 'undefined') {
      initKakaoSDK();
    }
  }, []);

  // 이 컴포넌트는 UI를 렌더링하지 않음
  return null;
}