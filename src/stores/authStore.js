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
      // TODO: API 호출로 SMS 전송
      console.log('SMS 인증번호 전송:', get().phoneNumber);
      
      // Mock: 3분 타이머 시작
      set({ 
        isVerificationSent: true, 
        verificationTimer: 180,
        isLoading: false 
      });
      
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
      
    } catch (error) {
      console.error('SMS 전송 실패:', error);
      set({ isLoading: false });
    }
  },
  
  // 인증번호 확인 및 로그인
  verifyAndLogin: async () => {
    set({ isLoading: true });
    try {
      const { phoneNumber, verificationCode } = get();
      
      // TODO: API 호출로 인증번호 검증
      console.log('인증 시도:', { phoneNumber, verificationCode });
      
      // Mock: 성공적인 로그인
      const mockUser = {
        id: 1,
        name: '김벌크업',
        phoneNumber,
        email: 'user@example.com',
        subscriptionStatus: 'weekly' // weekly, monthly, none
      };
      
      set({
        isAuthenticated: true,
        user: mockUser,
        isLoading: false,
        phoneNumber: '',
        verificationCode: '',
        isVerificationSent: false,
        verificationTimer: 0
      });
      
      // 로컬 스토리지에 로그인 상태 저장 (24시간 유지)
      localStorage.setItem('mealstack_auth', JSON.stringify({
        user: mockUser,
        timestamp: Date.now()
      }));
      
      return true;
    } catch (error) {
      console.error('인증 실패:', error);
      set({ isLoading: false });
      return false;
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