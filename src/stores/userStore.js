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
      type: 'weekly',
      plan: '주간 구독',
      price: 65000,
      nextPaymentDate: '2024.08.18',
      status: 'active',
      startedAt: '2024.08.01'
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