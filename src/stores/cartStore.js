import { create } from 'zustand';

// 장바구니 관련 상태 관리
export const useCartStore = create((set, get) => ({
  // 상태
  items: [],
  totalAmount: 0,
  selectedSubscription: null, // 선택된 구독 플랜
  
  // 액션
  // 개별 상품 추가
  addItem: (product, quantity = 1) => {
    const currentItems = get().items;
    const existingItemIndex = currentItems.findIndex(item => item.id === product.id);
    
    let newItems;
    if (existingItemIndex >= 0) {
      // 기존 아이템 수량 업데이트
      newItems = currentItems.map((item, index) => 
        index === existingItemIndex 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      // 새 아이템 추가
      newItems = [...currentItems, { 
        ...product, 
        quantity,
        addedAt: Date.now()
      }];
    }
    
    set({ items: newItems });
    get().calculateTotal();
  },
  
  // 아이템 수량 업데이트
  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    
    const newItems = get().items.map(item =>
      item.id === productId ? { ...item, quantity } : item
    );
    
    set({ items: newItems });
    get().calculateTotal();
  },
  
  // 아이템 제거
  removeItem: (productId) => {
    const newItems = get().items.filter(item => item.id !== productId);
    set({ items: newItems });
    get().calculateTotal();
  },
  
  // 장바구니 비우기
  clearCart: () => {
    set({ items: [], totalAmount: 0 });
  },
  
  // 총액 계산
  calculateTotal: () => {
    const items = get().items;
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    set({ totalAmount: total });
  },
  
  // 구독 플랜 선택
  selectSubscription: (plan) => {
    set({ selectedSubscription: plan });
  },
  
  // 구독 플랜 해제
  clearSubscription: () => {
    set({ selectedSubscription: null });
  },
  
  // 장바구니 아이템 수 반환
  getItemCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0);
  },
  
  // 특정 상품의 수량 반환
  getItemQuantity: (productId) => {
    const item = get().items.find(item => item.id === productId);
    return item ? item.quantity : 0;
  }
}));