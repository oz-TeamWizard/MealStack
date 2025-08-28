import { create } from 'zustand';
import { initKakao, performKakaoLogin, kakaoLogout } from '@/lib/kakao';
import { supabase } from '@/lib/supabase';

// Supabase users 테이블에 사용자 정보 저장 또는 업데이트
const saveUserToDatabase = async (user) => {
  try {
    // 카카오 ID로 기존 사용자 찾기
    const { data: existingUser, error: findError } = await supabase
      .from('users')
      .select('*')
      .eq('kakao_id', user.id)
      .single();

    if (findError && findError.code !== 'PGRST116') { // PGRST116은 데이터를 찾을 수 없음 에러
      console.error('기존 사용자 조회 오류:', findError);
      throw findError;
    }

    const userData = {
      kakao_id: user.id.toString(), // 문자열로 변환
      name: user.name,
      nickname: user.nickname,
      email: user.email,
      profile_image_url: user.profileImage, // 컬럼명 수정
      login_type: 'kakao', // provider 대신 login_type 사용
      last_login_at: new Date().toISOString()
    };

    if (existingUser) {
      // 기존 사용자 정보 업데이트 (마지막 로그인 시간 등)
      const { data, error } = await supabase
        .from('users')
        .update(userData)
        .eq('id', existingUser.id)
        .select()
        .single();

      if (error) {
        console.error('사용자 정보 업데이트 오류:', error);
        throw error;
      }

      console.log('기존 사용자 정보 업데이트 완료:', data);
      return data;
    } else {
      // 새 사용자 생성 - created_at은 기본값으로 자동 설정됨
      const { data, error } = await supabase
        .from('users')
        .insert(userData)
        .select()
        .single();

      if (error) {
        console.error('새 사용자 생성 오류:', error);
        throw error;
      }

      console.log('새 사용자 생성 완료:', data);
      return data;
    }
  } catch (error) {
    console.error('사용자 DB 저장 오류:', error);
    // DB 저장 실패해도 로그인은 계속 진행되도록 null 반환
    return null;
  }
};

// 인증 관련 상태 관리 - 카카오 로그인 방식
export const useAuthStore = create((set, get) => ({
  // 상태
  isAuthenticated: false,
  user: null,
  isLoading: false,
  usedAuthCodes: new Set(), // 사용된 인증코드 추적
  
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
        name: result.user.nickname, // 카카오 닉네임을 이름으로 사용
        nickname: result.user.nickname,
        profileImage: result.user.profileImage,
        email: result.user.email,
        provider: 'kakao',
        accessToken: result.accessToken,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };
      
      // Supabase에 사용자 정보 저장 또는 업데이트
      const dbUser = await saveUserToDatabase(user);
      
      set({
        isAuthenticated: true,
        user: { ...user, dbId: dbUser?.id }, // DB ID 추가
        isLoading: false
      });
      
      // 로컬 스토리지에 로그인 상태 저장 (24시간 유지)
      if (typeof window !== 'undefined') {
        localStorage.setItem('mealstack_auth', JSON.stringify({
          user: { ...user, dbId: dbUser?.id },
          timestamp: Date.now()
        }));
      }
      
      return { success: true, message: '카카오 로그인에 성공했습니다.', user: { ...user, dbId: dbUser?.id } };
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
    const { usedAuthCodes } = get();
    
    // 이미 사용된 코드인지 확인
    if (usedAuthCodes.has(code)) {
      console.log('이미 사용된 인증 코드:', code);
      return { 
        success: false, 
        error: '이미 처리된 인증 코드입니다.' 
      };
    }
    
    // 사용된 코드로 표시
    set({ 
      isLoading: true,
      usedAuthCodes: new Set([...usedAuthCodes, code])
    });
    
    try {
      console.log('카카오 인증 코드로 토큰 교환 시도:', code);
      
      // 카카오 토큰 API 호출
      const tokenParams = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.NEXT_PUBLIC_KAKAO_JS_KEY,
        redirect_uri: `${window.location.origin}/login`,
        code: code,
      });

      const tokenResponse = await fetch('https://kauth.kakao.com/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: tokenParams,
      });
      
      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error('카카오 토큰 교환 실패 상세:', {
          status: tokenResponse.status,
          statusText: tokenResponse.statusText,
          error: errorText
        });
        throw new Error(`토큰 교환에 실패했습니다. (${tokenResponse.status})`);
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
        name: userInfo.properties?.nickname || '카카오 사용자', // 카카오 닉네임을 이름으로 사용
        nickname: userInfo.properties?.nickname || '',
        profileImage: userInfo.properties?.profile_image || '',
        email: userInfo.kakao_account?.email || '',
        provider: 'kakao',
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };
      
      // Supabase에 사용자 정보 저장 또는 업데이트
      const dbUser = await saveUserToDatabase(user);
      
      set({
        isAuthenticated: true,
        user: { ...user, dbId: dbUser?.id }, // DB ID 추가
        isLoading: false
      });
      
      // 로컬 스토리지에 로그인 상태 저장 (24시간 유지)
      if (typeof window !== 'undefined') {
        localStorage.setItem('mealstack_auth', JSON.stringify({
          user: { ...user, dbId: dbUser?.id },
          timestamp: Date.now()
        }));
      }
      
      return { success: true, message: '카카오 로그인에 성공했습니다.', user: { ...user, dbId: dbUser?.id } };
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
    if (typeof window === 'undefined') return false;
    
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
      if (typeof window !== 'undefined') {
        localStorage.removeItem('mealstack_auth');
      }
    }
    return false;
  },
  
  // 로그아웃
  logout: async () => {
    console.log('로그아웃 시작');
    const { user } = get();
    
    try {
      // 카카오 로그아웃 (카카오 로그인 사용자인 경우)
      if (user?.login_type === 'kakao' || user?.provider === 'kakao') {
        console.log('카카오 로그아웃 시도');
        await kakaoLogout();
        console.log('카카오 로그아웃 완료');
      }
    } catch (error) {
      console.warn('카카오 서버 로그아웃 실패, 로컬 로그아웃 계속 진행:', error);
    }
    
    // 로컬 상태 초기화 (카카오 로그아웃 성공/실패 관계없이 실행)
    console.log('로컬 인증 상태 초기화');
    set({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      usedAuthCodes: new Set() // 사용된 코드도 초기화
    });
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mealstack_auth');
    }
    console.log('로그아웃 완료');
    return { success: true };
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