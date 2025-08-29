"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import { useUserStore } from "@/stores/userStore";
import DeliveryScheduleModal from "@/components/subscription/DeliveryScheduleModal";
import MenuCustomizationModal from "@/components/subscription/MenuCustomizationModal";

// 구독 페이지 - 개발자 C 담당
function SubscriptionPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectSubscription, selectedSubscription } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { 
    subscription, 
    loadMockData, 
    changeSubscriptionPlan,
    pauseSubscriptionWithPeriod,
    skipWeeklyDelivery,
    updateDeliverySchedule,
    updateMenuPreferences
  } = useUserStore();
  
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showManagement, setShowManagement] = useState(false);
  const [showPlanChange, setShowPlanChange] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);

  // URL 파라미터에서 플랜 읽기 및 사용자 데이터 로드
  useEffect(() => {
    if (isAuthenticated) {
      loadMockData();
    }
    
    const planFromUrl = searchParams.get("plan");
    if (planFromUrl) {
      const plan = subscriptionPlans.find((p) => p.id === planFromUrl);
      if (plan) {
        setSelectedPlan(plan);
      }
    }
  }, [searchParams, isAuthenticated, loadMockData]);

  const subscriptionPlans = [
    {
      id: "weekly",
      name: "주간 구독",
      price: 65000,
      period: "주",
      description: "• 매주 7개 도시락 배송\n• 배송비 무료\n• 언제든 해지 가능",
      features: [
        "매주 7개 벌크업 도시락",
        "전국 무료배송",
        "구독 일시정지 가능",
        "언제든지 해지 가능",
        "고객센터 우선 지원",
      ],
      isPopular: false,
      savings: "주당 7,000원 절약",
    },
    {
      id: "monthly",
      name: "월간 프리미엄 구독",
      price: 289000,
      originalPrice: 340000,
      period: "월",
      description:
        "• 월간 도시락 + 루틴 관리\n• 배송비 무료\n• 첫 달 20% 할인\n• 언제든 해지 가능",
      features: [
        "매주 7개 벌크업 도시락 (월 28개)",
        "개인 맞춤 운동 루틴 제공",
        "영양사 1:1 상담 (월 2회)",
        "전용 모바일 앱 이용",
        "전국 무료배송",
        "첫 달 20% 할인",
        "구독 일시정지 가능",
        "언제든지 해지 가능",
      ],
      isPopular: true,
      savings: "월 51,000원 절약",
      badge: "BEST",
    },
  ];

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    selectSubscription(plan);
  };

  const handleSubscribe = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (selectedPlan) {
      selectSubscription(selectedPlan);
      router.push("/checkout?type=subscription");
    }
  };

  const handlePlanChange = (plan, applyImmediately) => {
    if (confirm(`${plan.name}로 변경하시겠습니까? ${applyImmediately ? '즉시 적용' : '다음 결제일부터 적용'}됩니다.`)) {
      changeSubscriptionPlan(plan, applyImmediately);
      setShowPlanChange(false);
      alert('플랜이 변경되었습니다.');
    }
  };

  const handlePauseSubscription = () => {
    const weeks = prompt('몇 주간 일시정지하시겠습니까? (1-4주)', '1');
    if (weeks && parseInt(weeks) > 0 && parseInt(weeks) <= 4) {
      pauseSubscriptionWithPeriod(parseInt(weeks));
      alert(`${weeks}주간 구독이 일시정지됩니다.`);
    }
  };

  const handleSkipWeek = () => {
    const skipDate = prompt('건너뛸 배송 날짜를 입력하세요 (YYYY-MM-DD)', '2024-08-22');
    if (skipDate) {
      skipWeeklyDelivery(skipDate);
      alert('해당 주 배송을 건너뛰도록 설정되었습니다.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDayName = (dayNumber) => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return days[dayNumber] || '미설정';
  };

  const calculateSavings = () => {
    if (!subscription) return 0;
    const regularPrice = subscription.deliveryCount * 12000; // 개별 구매 시 가격
    return regularPrice - subscription.totalPaid;
  };

  return (
    <div className="min-h-screen bg-background-black pb-20">
      <Header title="구독 플랜 선택" showBack={true} />

      <main className="px-4 py-6">
        {/* 현재 구독 상태 */}
        {subscription && subscription.status === 'active' && (
          <Card variant="default" className="mb-6 bg-gradient-to-r from-primary-red to-red-600">
            <div className="text-white">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold mb-1">{subscription.plan}</h3>
                  <p className="text-sm opacity-90">
                    다음 배송: {formatDate(subscription.nextDeliveryDate)}
                  </p>
                  <p className="text-sm opacity-90">
                    배송일: {getDayName(subscription.deliveryDay)}요일 {subscription.deliveryTime === 'morning' ? '오전' : '오후'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">₩{subscription.price.toLocaleString()}</p>
                  <p className="text-sm opacity-90">다음 결제: {formatDate(subscription.nextPaymentDate)}</p>
                </div>
              </div>
              
              {/* 구독 통계 */}
              <div className="grid grid-cols-3 gap-4 p-3 bg-black bg-opacity-20 rounded-lg mb-4">
                <div className="text-center">
                  <p className="text-xs opacity-75">총 이용기간</p>
                  <p className="font-semibold">{Math.ceil((Date.now() - new Date(subscription.startedAt)) / (1000 * 60 * 60 * 24 * 7))}주</p>
                </div>
                <div className="text-center">
                  <p className="text-xs opacity-75">배송 횟수</p>
                  <p className="font-semibold">{subscription.deliveryCount}회</p>
                </div>
                <div className="text-center">
                  <p className="text-xs opacity-75">총 절약</p>
                  <p className="font-semibold text-yellow-300">₩{calculateSavings().toLocaleString()}</p>
                </div>
              </div>
              
              {/* 구독 관리 버튼들 */}
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowPlanChange(true)}
                  className="border-white text-white hover:bg-white hover:text-primary-red"
                >
                  플랜 변경
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handlePauseSubscription}
                  className="border-white text-white hover:bg-white hover:text-primary-red"
                >
                  일시정지
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSkipWeek}
                  className="border-white text-white hover:bg-white hover:text-primary-red"
                >
                  주간 건너뛰기
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowManagement(true)}
                  className="border-white text-white hover:bg-white hover:text-primary-red"
                >
                  상세 관리
                </Button>
              </div>
            </div>
          </Card>
        )}

        <div className={`space-y-4 ${subscription?.status === 'active' ? 'opacity-70' : ''}`}>
          <h2 className="text-lg font-bold text-text-white mb-4">
            {subscription?.status === 'active' ? '다른 플랜 둘러보기' : '구독 플랜 선택'}
          </h2>
          {subscriptionPlans.map((plan) => (
            <Card
              key={plan.id}
              variant="default"
              className={`
                bg-card-gray border border-card-gray
                hover:bg-primary-red hover:border-primary-red
                ${selectedPlan?.id === plan.id ? "ring-2 ring-primary-red" : ""}
                cursor-pointer transition-colors duration-200
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
                      <span className="text-sm font-normal">
                        /{plan.period}
                      </span>
                    </p>
                    {plan.savings && (
                      <p className="text-xs text-yellow-400 font-semibold">
                        {plan.savings}
                      </p>
                    )}
                  </div>
                </div>

                <div className="ml-4">
                  <div
                    className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center
                    ${
                      selectedPlan?.id === plan.id
                        ? "border-white bg-white"
                        : "border-text-gray"
                    }
                  `}
                  >
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
                    💡 가장 많이 선택하는 플랜입니다. 영양 관리와 운동 루틴까지
                    한 번에!
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* 구독 신청 버튼 */}
        {selectedPlan && (
          <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 w-full max-w-md p-4 bg-background-black border-t border-border-gray">
            <div className="mb-2 text-center">
              <p className="text-sm text-text-gray">{selectedPlan.name} 선택</p>
              <p className="text-lg font-bold text-text-white">
                ₩{selectedPlan.price.toLocaleString()}/{selectedPlan.period}
              </p>
            </div>
            <Button onClick={handleSubscribe} className="w-full" size="lg">
              구독 신청하기
            </Button>
          </div>
        )}

        {/* 구독 이용약관 */}
        <div className="mt-8 p-4 bg-card-dark-gray rounded-lg">
          <h4 className="font-semibold text-text-white mb-2">
            구독 서비스 안내
          </h4>
          <div className="text-xs text-text-gray space-y-1">
            <p>• 첫 결제는 구독 신청 즉시 진행됩니다</p>
            <p>• 정기결제는 매주/매월 같은 요일에 자동으로 진행됩니다</p>
            <p>• 구독 일시정지 및 해지는 마이페이지에서 언제든 가능합니다</p>
            <p>• 배송일 변경은 배송 2일 전까지 가능합니다</p>
            <p>• 자세한 내용은 이용약관을 참고해주세요</p>
          </div>
        </div>

        {/* 플랜 변경 모달 */}
        {showPlanChange && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
            <div className="w-full max-w-md bg-background-black rounded-t-xl p-6 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-text-white">플랜 변경</h2>
                <button
                  onClick={() => setShowPlanChange(false)}
                  className="text-text-gray hover:text-text-white"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4 mb-6">
                {subscriptionPlans
                  .filter(plan => plan.id !== subscription?.planId)
                  .map((plan) => (
                    <Card key={plan.id} variant="default" className="bg-card-gray">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-text-white">{plan.name}</h3>
                          <p className="text-text-white font-bold">
                            ₩{plan.price.toLocaleString()}/{plan.period}
                          </p>
                        </div>
                        {plan.isPopular && (
                          <span className="px-2 py-1 bg-primary-red text-white text-xs rounded">
                            {plan.badge}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePlanChange(plan, false)}
                          className="flex-1"
                        >
                          다음 결제일부터
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handlePlanChange(plan, true)}
                          className="flex-1"
                        >
                          즉시 변경
                        </Button>
                      </div>
                    </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 상세 관리 모달 */}
        {showManagement && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
            <div className="w-full max-w-md bg-background-black rounded-t-xl p-6 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-text-white">구독 상세 관리</h2>
                <button
                  onClick={() => setShowManagement(false)}
                  className="text-text-gray hover:text-text-white"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                {/* 배송 정보 */}
                <Card variant="default" className="bg-card-gray">
                  <h3 className="font-semibold text-text-white mb-3">배송 정보</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-gray">배송 요일</span>
                      <span className="text-text-white">{getDayName(subscription?.deliveryDay)}요일</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-gray">배송 시간</span>
                      <span className="text-text-white">
                        {subscription?.deliveryTime === 'morning' ? '오전 (9-12시)' : '오후 (13-18시)'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-gray">다음 배송</span>
                      <span className="text-text-white">{formatDate(subscription?.nextDeliveryDate)}</span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-3"
                    onClick={() => {
                      setShowManagement(false);
                      setShowDeliveryModal(true);
                    }}
                  >
                    배송 일정 변경
                  </Button>
                </Card>

                {/* 메뉴 선호도 */}
                <Card variant="default" className="bg-card-gray">
                  <h3 className="font-semibold text-text-white mb-3">메뉴 선호도</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-text-gray">선호 메뉴: </span>
                      <span className="text-text-white">
                        {subscription?.menuPreferences?.preferences?.join(', ') || '설정 안됨'}
                      </span>
                    </div>
                    <div>
                      <span className="text-text-gray">제외 메뉴: </span>
                      <span className="text-text-white">
                        {subscription?.menuPreferences?.dislikes?.join(', ') || '없음'}
                      </span>
                    </div>
                    <div>
                      <span className="text-text-gray">알러지: </span>
                      <span className="text-text-white">
                        {subscription?.menuPreferences?.allergies?.join(', ') || '없음'}
                      </span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-3"
                    onClick={() => {
                      setShowManagement(false);
                      setShowMenuModal(true);
                    }}
                  >
                    선호도 수정
                  </Button>
                </Card>

                {/* 건너뛴 배송 */}
                {subscription?.skippedWeeks?.length > 0 && (
                  <Card variant="default" className="bg-card-gray">
                    <h3 className="font-semibold text-text-white mb-3">건너뛴 배송</h3>
                    <div className="space-y-1">
                      {subscription.skippedWeeks.map((date, index) => (
                        <div key={index} className="text-sm text-text-gray">
                          {formatDate(date)}
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* 구독 통계 */}
                <Card variant="default" className="bg-card-gray">
                  <h3 className="font-semibold text-text-white mb-3">구독 통계</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center p-3 bg-card-dark-gray rounded">
                      <p className="text-text-gray">시작일</p>
                      <p className="text-text-white font-semibold">{formatDate(subscription?.startedAt)}</p>
                    </div>
                    <div className="text-center p-3 bg-card-dark-gray rounded">
                      <p className="text-text-gray">총 결제금액</p>
                      <p className="text-text-white font-semibold">₩{subscription?.totalPaid?.toLocaleString()}</p>
                    </div>
                    <div className="text-center p-3 bg-card-dark-gray rounded">
                      <p className="text-text-gray">평균 도시락 가격</p>
                      <p className="text-primary-red font-semibold">
                        ₩{subscription ? Math.round(subscription.totalPaid / subscription.deliveryCount).toLocaleString() : 0}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-card-dark-gray rounded">
                      <p className="text-text-gray">총 절약금액</p>
                      <p className="text-green-500 font-semibold">₩{calculateSavings().toLocaleString()}</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* 배송 일정 변경 모달 */}
        <DeliveryScheduleModal
          isOpen={showDeliveryModal}
          onClose={() => setShowDeliveryModal(false)}
          currentSchedule={subscription}
          onUpdateSchedule={updateDeliverySchedule}
        />

        {/* 메뉴 커스터마이징 모달 */}
        <MenuCustomizationModal
          isOpen={showMenuModal}
          onClose={() => setShowMenuModal(false)}
          currentPreferences={subscription?.menuPreferences}
          onUpdatePreferences={updateMenuPreferences}
        />
      </main>

      <BottomNav />
    </div>
  );
}

export default function SubscriptionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background-black flex items-center justify-center">
          <div className="w-12 h-12 loading-spinner"></div>
        </div>
      }
    >
      <SubscriptionPageContent />
    </Suspense>
  );
}
