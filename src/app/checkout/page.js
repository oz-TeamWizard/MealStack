'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Card from '@/components/common/Card';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';

// 결제페이지 - 개발자 B 담당
function CheckoutPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, selectedSubscription, totalAmount, clearCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [deliveryInfo, setDeliveryInfo] = useState({
    name: user?.name || '',
    phone: user?.phoneNumber || '',
    address: '',
    detailAddress: '',
    memo: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  
  const orderType = searchParams.get('type') || 'product'; // product or subscription
  
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    if (orderType === 'product' && items.length === 0) {
      router.push('/products');
      return;
    }
    
    if (orderType === 'subscription' && !selectedSubscription) {
      router.push('/subscription');
      return;
    }
  }, [isAuthenticated, items, selectedSubscription, orderType, router]);
  
  // 총 결제 금액 계산
  const getOrderTotal = () => {
    if (orderType === 'subscription') {
      return selectedSubscription?.price || 0;
    }
    return totalAmount;
  };
  
  // 주문 항목 표시
  const getOrderItems = () => {
    if (orderType === 'subscription') {
      return [
        {
          name: selectedSubscription?.name || '구독 플랜',
          quantity: 1,
          price: selectedSubscription?.price || 0
        }
      ];
    }
    return items;
  };
  
  const handleInputChange = (field, value) => {
    setDeliveryInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const validateForm = () => {
    const { name, phone, address } = deliveryInfo;
    return name && phone && address;
  };
  
  const handlePayment = async () => {
    if (!validateForm()) {
      alert('필수 정보를 모두 입력해주세요.');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Mock 결제 처리 (3초 대기)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // TODO: 실제 토스페이먼츠 연동
      console.log('결제 요청:', {
        orderType,
        items: getOrderItems(),
        total: getOrderTotal(),
        paymentMethod,
        deliveryInfo,
        userId: user?.id
      });
      
      // 성공 시 주문 완료 페이지로 이동
      clearCart();
      router.push(`/order-complete?type=${orderType}&amount=${getOrderTotal()}`);
      
    } catch (error) {
      console.error('결제 실패:', error);
      alert('결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-background-black">
      <Header title="주문/결제" showBack={true} />
      
      <main className="px-4 py-4 pb-32">
        {/* 결제 총액 */}
        <Card variant="subscription" className="mb-6">
          <h2 className="text-lg font-bold text-text-white mb-4">결제 총액</h2>
          
          {getOrderItems().map((item, index) => (
            <div key={index} className="flex justify-between items-center mb-2">
              <div>
                <p className="text-text-white">{item.name}</p>
                {item.quantity > 1 && (
                  <p className="text-text-gray text-sm">수량: {item.quantity}개</p>
                )}
              </div>
              <p className="text-text-white font-semibold">
                ₩{(item.price * (item.quantity || 1)).toLocaleString()}
              </p>
            </div>
          ))}
          
          <div className="border-t border-border-gray pt-2 mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-text-gray">배송비</span>
              <span className="text-primary-red font-semibold">무료</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-white font-semibold">총 결제액</span>
              <span className="text-primary-red text-lg font-bold">
                ₩{getOrderTotal().toLocaleString()}원
              </span>
            </div>
          </div>
        </Card>
        
        {/* 결제 방법 선택 */}
        <Card variant="subscription" className="mb-6">
          <h3 className="text-lg font-bold text-text-white mb-4">결제 방법 선택</h3>
          
          <div className="space-y-3">
            {[
              { id: 'card', name: '💳 카드결제 (추천)', recommended: true },
              { id: 'bank', name: '🏦 계좌이체' },
              { id: 'simple', name: '📱 간편결제 (카카오페이, 토스페이)' }
            ].map((method) => (
              <div
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={`
                  p-3 rounded-lg border cursor-pointer transition-colors
                  ${paymentMethod === method.id
                    ? 'border-primary-red bg-primary-red bg-opacity-10'
                    : 'border-border-gray hover:border-text-gray'
                  }
                  ${method.recommended ? 'opacity-100' : 'opacity-60'}
                `}
              >
                <div className="flex items-center">
                  <div className={`
                    w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center
                    ${paymentMethod === method.id ? 'border-primary-red' : 'border-text-gray'}
                  `}>
                    {paymentMethod === method.id && (
                      <div className="w-2.5 h-2.5 rounded-full bg-primary-red"></div>
                    )}
                  </div>
                  <span className="text-text-white font-semibold">{method.name}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
        
        {/* 배송 정보 */}
        <Card variant="subscription" className="mb-6">
          <h3 className="text-lg font-bold text-text-white mb-4">배송 정보</h3>
          
          <div className="space-y-4">
            <Input
              label="받는분"
              placeholder="받는분 성함을 입력해주세요"
              value={deliveryInfo.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
            
            <Input
              label="전화번호"
              type="tel"
              placeholder="전화번호를 입력해주세요"
              value={deliveryInfo.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />
            
            <Input
              label="주소"
              placeholder="배송 받으실 주소를 입력해주세요"
              value={deliveryInfo.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
            />
            
            <Input
              label="상세주소"
              placeholder="상세주소를 입력해주세요"
              value={deliveryInfo.detailAddress}
              onChange={(e) => handleInputChange('detailAddress', e.target.value)}
            />
            
            <Input
              label="배송 메모 (선택)"
              placeholder="배송 시 요청사항"
              value={deliveryInfo.memo}
              onChange={(e) => handleInputChange('memo', e.target.value)}
            />
          </div>
        </Card>
        
        {/* 배송 안내 */}
        <Card variant="dark" className="mb-6">
          <h4 className="font-semibold text-text-white mb-2">배송 안내</h4>
          <div className="text-xs text-text-gray space-y-1">
            <p>• 주문 완료 후 1-2일 내 배송됩니다</p>
            <p>• 냉동 배송으로 신선하게 배달됩니다</p>
            <p>• 부재 시 안전한 장소에 보관 배송됩니다</p>
            <p>• 배송 관련 문의: 고객센터 1588-0000</p>
          </div>
        </Card>
      </main>
      
      {/* 결제 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background-black border-t border-border-gray">
        <Button
          onClick={handlePayment}
          loading={isProcessing}
          disabled={!validateForm() || isProcessing}
          className="w-full"
          size="lg"
        >
          {isProcessing ? '결제 처리중...' : `₩${getOrderTotal().toLocaleString()}원 결제하기`}
        </Button>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background-black flex items-center justify-center">
        <div className="w-12 h-12 loading-spinner"></div>
      </div>
    }>
      <CheckoutPageContent />
    </Suspense>
  );
}