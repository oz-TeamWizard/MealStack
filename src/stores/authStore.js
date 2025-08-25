import { create } from 'zustand';
import { initKakao, performKakaoLogin, kakaoLogout } from '@/lib/kakao';

// 인증 관련 상태 관리 - 카카오 로그인 방식
export const useAuthStore = create((set, get) => ({
  // 상태
  isAuthenticated: false,
  user: null,
  isLoading: false,
  
  // 카카오 로그인
  kakaoLogin: async () => {
    set({ isLoading: true });
    try {
      // 카카오 SDK 초기화
      initKakao();
      
      // 카카오 로그인 실행
      const result = await performKakaoLogin();
      
      const user = {
        id: result.user.id,
        nickname: result.user.nickname,
        profileImage: result.user.profileImage,
        email: result.user.email,
        provider: 'kakao',
        accessToken: result.accessToken,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };
      
      set({
        isAuthenticated: true,
        user,
        isLoading: false
      });
      
      // 로컬 스토리지에 로그인 상태 저장 (24시간 유지)
      localStorage.setItem('mealstack_auth', JSON.stringify({
        user,
        timestamp: Date.now()
      }));
      
      return { success: true, message: '카카오 로그인에 성공했습니다.', user };
    } catch (error) {
      console.error('카카오 로그인 실패:', error);
      set({ isLoading: false });
      return { 
        success: false, 
        error: error.message || '카카오 로그인에 실패했습니다.' 
      };
    }
  },
  
  // 카카오 콜백 처리 (인증 코드를 받아 토큰 교환)
  processKakaoCallback: async (code) => {
    set({ isLoading: true });
    try {
      console.log('카카오 인증 코드로 토큰 교환 시도:', code);
      
      // 카카오 토큰 API 호출
      const tokenResponse = await fetch('https://kauth.kakao.com/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: process.env.NEXT_PUBLIC_KAKAO_JS_KEY,
          redirect_uri: `${window.location.origin}/login`,
          code: code,
        }),
      });
      
      if (!tokenResponse.ok) {
        throw new Error('토큰 교환에 실패했습니다.');
      }
      
      const tokenData = await tokenResponse.json();
      console.log('토큰 교환 성공:', tokenData);
      
      // 사용자 정보 가져오기
      const userResponse = await fetch('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      });
      
      if (!userResponse.ok) {
        throw new Error('사용자 정보 조회에 실패했습니다.');
      }
      
      const userInfo = await userResponse.json();
      console.log('사용자 정보 조회 성공:', userInfo);
      
      const user = {
        id: userInfo.id,
        nickname: userInfo.properties?.nickname || '',
        profileImage: userInfo.properties?.profile_image || '',
        email: userInfo.kakao_account?.email || '',
        provider: 'kakao',
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };
      
      set({
        isAuthenticated: true,
        user,
        isLoading: false
      });
      
      // 로컬 스토리지에 로그인 상태 저장 (24시간 유지)
      localStorage.setItem('mealstack_auth', JSON.stringify({
        user,
        timestamp: Date.now()
      }));
      
      return { success: true, message: '카카오 로그인에 성공했습니다.', user };
    } catch (error) {
      console.error('카카오 콜백 처리 실패:', error);
      set({ isLoading: false });
      return { 
        success: false, 
        error: error.message || '카카오 로그인 처리에 실패했습니다.' 
      };
    }
  },
  
  // 자동 로그인 체크
  checkAutoLogin: () => {
    try {
      const stored = localStorage.getItem('mealstack_auth');
      if (stored) {
        const { user, timestamp } = JSON.parse(stored);
        const now = Date.now();
        const twentyFourHours = 24 * 60 * 60 * 1000;
        
        if (now - timestamp < twentyFourHours) {
          set({ isAuthenticated: true, user });
          return true;
        } else {
          localStorage.removeItem('mealstack_auth');
        }
      }
    } catch (error) {
      console.error('자동 로그인 체크 실패:', error);
      localStorage.removeItem('mealstack_auth');
    }
    return false;
  },
  
  // 로그아웃
  logout: async () => {
    try {
      const { user } = get();
      
      // 카카오 로그아웃 (카카오 로그인 사용자인 경우)
      if (user?.provider === 'kakao') {
        await kakaoLogout();
      }
      
      set({
        isAuthenticated: false,
        user: null,
        isLoading: false
      });
      
      localStorage.removeItem('mealstack_auth');
      return { success: true };
    } catch (error) {
      console.error('로그아웃 실패:', error);
      // 로그아웃 실패해도 로컬 상태는 초기화
      set({
        isAuthenticated: false,
        user: null,
        isLoading: false
      });
      localStorage.removeItem('mealstack_auth');
      return { success: false, error: error.message };
    }
  },
  
  // 카카오 SDK 초기화
  initializeKakao: () => {
    if (typeof window !== 'undefined') {
      initKakao();
    }
  },
  
  // 리셋 (컴포넌트 언마운트 시 사용)
  reset: () => set({
    isLoading: false
  })
}));