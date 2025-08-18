'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';

// 구독 페이지 - 개발자 C 담당
function SubscriptionPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectSubscription, selectedSubscription } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [selectedPlan, setSelectedPlan] = useState(null);
  
  // URL 파라미터에서 플랜 읽기
  useEffect(() => {
    const planFromUrl = searchParams.get('plan');
    if (planFromUrl) {
      const plan = subscriptionPlans.find(p => p.id === planFromUrl);
      if (plan) {
        setSelectedPlan(plan);
      }
    }
  }, [searchParams]);
  
  const subscriptionPlans = [
    {
      id: 'weekly',
      name: '주간 구독',
      price: 65000,
      period: '주',
      description: '• 매주 7개 도시락 배송\n• 배송비 무료\n• 언제든 해지 가능',
      features: [
        '매주 7개 벌크업 도시락',
        '전국 무료배송',
        '구독 일시정지 가능',
        '언제든지 해지 가능',
        '고객센터 우선 지원'
      ],
      isPopular: false,
      savings: '주당 7,000원 절약'
    },
    {
      id: 'monthly',
      name: '월간 프리미엄 구독',
      price: 289000,
      originalPrice: 340000,
      period: '월',
      description: '• 월간 도시락 + 루틴 관리\n• 배송비 무료\n• 첫 달 20% 할인\n• 언제든 해지 가능',
      features: [
        '매주 7개 벌크업 도시락 (월 28개)',
        '개인 맞춤 운동 루틴 제공',
        '영양사 1:1 상담 (월 2회)',
        '전용 모바일 앱 이용',
        '전국 무료배송',
        '첫 달 20% 할인',
        '구독 일시정지 가능',
        '언제든지 해지 가능'
      ],
      isPopular: true,
      savings: '월 51,000원 절약',
      badge: 'BEST'
    }
  ];
  
  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    selectSubscription(plan);
  };
  
  const handleSubscribe = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    if (selectedPlan) {
      selectSubscription(selectedPlan);
      router.push('/checkout?type=subscription');
    }
  };
  
  return (
    <div className="min-h-screen bg-background-black pb-20">
      <Header title="구독 플랜 선택" showBack={true} />
      
      <main className="px-4 py-6">
        <div className="space-y-6">
          {subscriptionPlans.map((plan) => (
            <Card
              key={plan.id}
              variant={plan.isPopular ? "subscription" : "default"}
              className={`
                ${plan.isPopular ? 'bg-primary-red border-2 border-primary-red' : 'border border-card-gray'}
                ${selectedPlan?.id === plan.id ? 'ring-2 ring-primary-red' : ''}
                cursor-pointer transition-all duration-200
              `}
              onClick={() => handleSelectPlan(plan)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="text-lg font-bold text-text-white">
                      {plan.name}
                    </h3>
                    {plan.isPopular && (
                      <span className="ml-2 px-2 py-1 bg-white text-primary-red text-xs font-bold rounded">
                        {plan.badge}
                      </span>
                    )}
                  </div>
                  
                  <div className="mb-3">
                    {plan.originalPrice && (
                      <p className="text-sm text-text-gray line-through">
                        ₩{plan.originalPrice.toLocaleString()}/{plan.period}
                      </p>
                    )}
                    <p className="text-xl font-bold text-text-white">
                      ₩{plan.price.toLocaleString()}
                      <span className="text-sm font-normal">/{plan.period}</span>
                    </p>
                    {plan.savings && (
                      <p className="text-xs text-yellow-400 font-semibold">
                        {plan.savings}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="ml-4">
                  <div className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center
                    ${selectedPlan?.id === plan.id 
                      ? 'border-white bg-white' 
                      : 'border-text-gray'
                    }
                  `}>
                    {selectedPlan?.id === plan.id && (
                      <div className="w-3 h-3 rounded-full bg-primary-red"></div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <span className="text-primary-red mr-2 mt-0.5">✓</span>
                    <span className="text-sm text-text-white">{feature}</span>
                  </div>
                ))}
              </div>
              
              {plan.isPopular && (
                <div className="mt-4 p-3 bg-white bg-opacity-10 rounded-lg">
                  <p className="text-xs text-text-white">
                    💡 가장 많이 선택하는 플랜입니다. 영양 관리와 운동 루틴까지 한 번에!
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>
        
        {/* 구독 신청 버튼 */}
        {selectedPlan && (
          <div className="fixed bottom-20 left-0 right-0 p-4 bg-background-black border-t border-border-gray">
            <div className="mb-2 text-center">
              <p className="text-sm text-text-gray">
                {selectedPlan.name} 선택
              </p>
              <p className="text-lg font-bold text-text-white">
                ₩{selectedPlan.price.toLocaleString()}/{selectedPlan.period}
              </p>
            </div>
            <Button
              onClick={handleSubscribe}
              className="w-full"
              size="lg"
            >
              구독 신청하기
            </Button>
          </div>
        )}
        
        {/* 구독 이용약관 */}
        <div className="mt-8 p-4 bg-card-dark-gray rounded-lg">
          <h4 className="font-semibold text-text-white mb-2">구독 서비스 안내</h4>
          <div className="text-xs text-text-gray space-y-1">
            <p>• 첫 결제는 구독 신청 즉시 진행됩니다</p>
            <p>• 정기결제는 매주/매월 같은 요일에 자동으로 진행됩니다</p>
            <p>• 구독 일시정지 및 해지는 마이페이지에서 언제든 가능합니다</p>
            <p>• 배송일 변경은 배송 2일 전까지 가능합니다</p>
            <p>• 자세한 내용은 이용약관을 참고해주세요</p>
          </div>
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
}

export default function SubscriptionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background-black flex items-center justify-center">
        <div className="w-12 h-12 loading-spinner"></div>
      </div>
    }>
      <SubscriptionPageContent />
    </Suspense>
  );
}