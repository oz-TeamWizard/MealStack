import { create } from 'zustand';

// 사용자 정보 및 구독 관리
export const useUserStore = create((set, get) => ({
  // 상태
  profile: null,
  orders: [],
  subscription: null,
  addresses: [],
  paymentMethods: [],
  
  // 액션
  // 프로필 업데이트
  updateProfile: (profileData) => {
    set({ profile: { ...get().profile, ...profileData } });
  },
  
  // 주문 내역 설정
  setOrders: (orders) => {
    set({ orders });
  },
  
  // 새 주문 추가
  addOrder: (order) => {
    const currentOrders = get().orders;
    set({ orders: [order, ...currentOrders] });
  },
  
  // 구독 정보 설정
  setSubscription: (subscriptionData) => {
    set({ subscription: subscriptionData });
  },
  
  // 구독 일시정지
  pauseSubscription: () => {
    const subscription = get().subscription;
    if (subscription) {
      set({ 
        subscription: { 
          ...subscription, 
          status: 'paused',
          pausedAt: new Date().toISOString()
        } 
      });
    }
  },
  
  // 구독 재개
  resumeSubscription: () => {
    const subscription = get().subscription;
    if (subscription) {
      set({ 
        subscription: { 
          ...subscription, 
          status: 'active',
          pausedAt: null,
          resumedAt: new Date().toISOString()
        } 
      });
    }
  },
  
  // 구독 해지
  cancelSubscription: () => {
    const subscription = get().subscription;
    if (subscription) {
      set({ 
        subscription: { 
          ...subscription, 
          status: 'cancelled',
          cancelledAt: new Date().toISOString()
        } 
      });
    }
  },

  // 구독 플랜 변경
  changeSubscriptionPlan: (newPlan, applyImmediately = false) => {
    const subscription = get().subscription;
    if (subscription) {
      const updateData = {
        ...subscription,
        planId: newPlan.id,
        plan: newPlan.name,
        price: newPlan.price,
        planChangeRequestedAt: new Date().toISOString(),
        planChangeApplyImmediately: applyImmediately
      };
      
      if (applyImmediately) {
        updateData.nextPaymentDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 1주 후
      }
      
      set({ subscription: updateData });
    }
  },

  // 구독 일시정지 (기간 설정)
  pauseSubscriptionWithPeriod: (weeks = 1) => {
    const subscription = get().subscription;
    if (subscription) {
      const resumeDate = new Date();
      resumeDate.setDate(resumeDate.getDate() + (weeks * 7));
      
      set({ 
        subscription: { 
          ...subscription, 
          status: 'paused',
          pausedAt: new Date().toISOString(),
          autoResumeDate: resumeDate.toISOString().split('T')[0],
          pauseDuration: weeks
        } 
      });
    }
  },

  // 특정 주 배송 건너뛰기
  skipWeeklyDelivery: (skipDate) => {
    const subscription = get().subscription;
    if (subscription) {
      const skippedWeeks = subscription.skippedWeeks || [];
      set({ 
        subscription: { 
          ...subscription, 
          skippedWeeks: [...skippedWeeks, skipDate]
        } 
      });
    }
  },

  // 배송 일정 설정
  updateDeliverySchedule: (schedule) => {
    const subscription = get().subscription;
    if (subscription) {
      set({ 
        subscription: { 
          ...subscription, 
          deliveryDay: schedule.day, // 0: 일요일, 1: 월요일, ...
          deliveryTime: schedule.time, // 'morning' | 'afternoon'
          deliveryAddress: schedule.address
        } 
      });
    }
  },

  // 메뉴 선호도 설정
  updateMenuPreferences: (preferences) => {
    const subscription = get().subscription;
    if (subscription) {
      set({ 
        subscription: { 
          ...subscription, 
          menuPreferences: {
            allergies: preferences.allergies || [],
            dislikes: preferences.dislikes || [],
            preferences: preferences.preferences || []
          }
        } 
      });
    }
  },
  
  // 배송지 추가
  addAddress: (address) => {
    const addresses = get().addresses;
    const newAddress = {
      ...address,
      id: Date.now(),
      isDefault: addresses.length === 0 // 첫 번째 주소는 기본 주소로 설정
    };
    set({ addresses: [...addresses, newAddress] });
  },
  
  // 배송지 업데이트
  updateAddress: (addressId, addressData) => {
    const addresses = get().addresses.map(addr =>
      addr.id === addressId ? { ...addr, ...addressData } : addr
    );
    set({ addresses });
  },
  
  // 배송지 삭제
  removeAddress: (addressId) => {
    const addresses = get().addresses.filter(addr => addr.id !== addressId);
    set({ addresses });
  },
  
  // 기본 배송지 설정
  setDefaultAddress: (addressId) => {
    const addresses = get().addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    }));
    set({ addresses });
  },
  
  // 결제수단 추가
  addPaymentMethod: (paymentMethod) => {
    const paymentMethods = get().paymentMethods;
    const newPaymentMethod = {
      ...paymentMethod,
      id: Date.now(),
      isDefault: paymentMethods.length === 0
    };
    set({ paymentMethods: [...paymentMethods, newPaymentMethod] });
  },
  
  // 결제수단 삭제
  removePaymentMethod: (paymentMethodId) => {
    const paymentMethods = get().paymentMethods.filter(pm => pm.id !== paymentMethodId);
    set({ paymentMethods });
  },
  
  // 기본 결제수단 설정
  setDefaultPaymentMethod: (paymentMethodId) => {
    const paymentMethods = get().paymentMethods.map(pm => ({
      ...pm,
      isDefault: pm.id === paymentMethodId
    }));
    set({ paymentMethods });
  },
  
  // 사용자 데이터 초기화 (로그아웃 시)
  reset: () => {
    set({
      profile: null,
      orders: [],
      subscription: null,
      addresses: [],
      paymentMethods: []
    });
  },
  
  // Mock 데이터 로딩
  loadMockData: (userId) => {
    // Mock 주문 내역
    const mockOrders = [
      {
        id: 1,
        date: '2024.08.08',
        items: [{ name: '벌크업 도시락', quantity: 7, price: 12000 }],
        totalAmount: 84000,
        status: '배송완료',
        trackingNumber: 'TN123456789'
      }
    ];
    
    // Mock 구독 정보
    const mockSubscription = {
      id: 1,
      planId: 'weekly',
      plan: '주간 구독',
      price: 65000,
      nextPaymentDate: '2024-08-18',
      nextDeliveryDate: '2024-08-15',
      status: 'active',
      startedAt: '2024-08-01',
      deliveryDay: 4, // 목요일
      deliveryTime: 'morning',
      totalPaid: 260000, // 4주간 결제 금액
      deliveryCount: 16,
      menuPreferences: {
        allergies: [],
        dislikes: ['매운맛'],
        preferences: ['단백질 위주', '저탄수화물']
      },
      skippedWeeks: []
    };
    
    // Mock 배송지
    const mockAddresses = [
      {
        id: 1,
        name: '김벌크업',
        phone: '010-1234-5678',
        address: '서울시 강남구 테헤란로 123',
        detailAddress: '456호',
        zipCode: '12345',
        isDefault: true
      }
    ];
    
    set({
      orders: mockOrders,
      subscription: mockSubscription,
      addresses: mockAddresses
    });
  }
}));