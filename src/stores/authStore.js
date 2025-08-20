import { create } from 'zustand';

// 인증 관련 상태 관리
export const useAuthStore = create((set, get) => ({
  // 상태
  isAuthenticated: false,
  user: null,
  isLoading: false,
  phoneNumber: '',
  verificationCode: '',
  isVerificationSent: false,
  verificationTimer: 0,
  
  // 액션
  setPhoneNumber: (phoneNumber) => set({ phoneNumber }),
  
  setVerificationCode: (code) => set({ verificationCode: code }),
  
  // SMS 인증번호 전송
  sendVerificationCode: async () => {
    set({ isLoading: true });
    try {
      const { phoneNumber } = get();
      
      const response = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'SMS 전송에 실패했습니다.');
      }
      
      // 3분 타이머 시작
      set({ 
        isVerificationSent: true, 
        verificationTimer: 180,
        isLoading: false 
      });
      
      // 개발 환경에서만 인증번호 콘솔 출력
      if (data.verificationCode) {
        console.log('개발용 인증번호:', data.verificationCode);
      }
      
      // 타이머 카운트다운
      const timer = setInterval(() => {
        const currentTimer = get().verificationTimer;
        if (currentTimer <= 1) {
          clearInterval(timer);
          set({ verificationTimer: 0, isVerificationSent: false });
        } else {
          set({ verificationTimer: currentTimer - 1 });
        }
      }, 1000);
      
      return { success: true, message: data.message };
    } catch (error) {
      console.error('SMS 전송 실패:', error);
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },
  
  // 인증번호 확인 및 로그인
  verifyAndLogin: async () => {
    set({ isLoading: true });
    try {
      const { phoneNumber, verificationCode } = get();
      
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, verificationCode }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '인증에 실패했습니다.');
      }
      
      const user = {
        id: data.user.id,
        phoneNumber: data.user.phoneNumber,
        createdAt: data.user.createdAt,
        lastLoginAt: data.user.lastLoginAt
      };
      
      set({
        isAuthenticated: true,
        user,
        isLoading: false,
        phoneNumber: '',
        verificationCode: '',
        isVerificationSent: false,
        verificationTimer: 0
      });
      
      // 로컬 스토리지에 로그인 상태 저장 (24시간 유지)
      localStorage.setItem('mealstack_auth', JSON.stringify({
        user,
        timestamp: Date.now()
      }));
      
      return { success: true, message: data.message };
    } catch (error) {
      console.error('인증 실패:', error);
      set({ isLoading: false });
      return { success: false, error: error.message };
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
  logout: () => {
    set({
      isAuthenticated: false,
      user: null,
      phoneNumber: '',
      verificationCode: '',
      isVerificationSent: false,
      verificationTimer: 0
    });
    localStorage.removeItem('mealstack_auth');
  },
  
  // 리셋 (컴포넌트 언마운트 시 사용)
  reset: () => set({
    phoneNumber: '',
    verificationCode: '',
    isVerificationSent: false,
    verificationTimer: 0,
    isLoading: false
  })
}));