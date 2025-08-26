'use client';

import Link from 'next/link';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { useAuthStore } from '@/stores/authStore';

export default function PromotionPage() {
  const { isAuthenticated } = useAuthStore();

  const promotionEvents = [
    {
      id: 1,
      title: "🔥 대박 런칭 이벤트",
      subtitle: "첫 구독 50% 할인",
      description: "벌크업 도시락 월간 프리미엄 구독\n첫 달 289,000원 → 144,500원",
      period: "2024.08.25 ~ 2024.09.30",
      image: "/images/promotion-launch.jpg",
      tag: "HOT",
      discount: "50%"
    },
    {
      id: 2,
      title: "🚚 무료배송 평생혜택",
      subtitle: "구독 고객 전원",
      description: "정기 구독 고객은 평생 무료배송\n추가 주문도 배송비 무료",
      period: "상시 진행",
      image: "/images/promotion-delivery.jpg",
      tag: "혜택",
      discount: "무료"
    },
    {
      id: 3,
      title: "📱 영양관리 앱 무료",
      subtitle: "프리미엄 기능 제공",
      description: "개인 맞춤 영양 분석\n운동 루틴 관리\n체중 변화 추적",
      period: "구독 고객 전용",
      image: "/images/promotion-app.jpg",
      tag: "신규",
      discount: "FREE"
    }
  ];

  const testimonials = [
    {
      name: "김헬창",
      age: 28,
      period: "3개월 이용",
      rating: 5,
      comment: "맛도 좋고 단백질도 충분해서 운동 후 완벽해요! 배송도 정말 빨라서 만족합니다.",
      image: "/images/user1.jpg"
    },
    {
      name: "박벌크",
      age: 32,
      period: "2개월 이용",
      rating: 5,
      comment: "직장인이라 요리할 시간이 없었는데 mealStack 덕분에 벌크업 성공했어요!",
      image: "/images/user2.jpg"
    },
    {
      name: "이머슬",
      age: 25,
      period: "4개월 이용",
      rating: 5,
      comment: "영양관리 앱까지 무료로 제공해줘서 체계적으로 관리할 수 있어서 좋아요.",
      image: "/images/user3.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-background-black pb-20">
      <Header title="프로모션" showBack={true} />

      <main className="px-4 py-6">
        
        {/* 메인 배너 */}
        <section className="mb-8">
          <Card variant="default" className="bg-gradient-to-r from-primary-red to-red-700 text-white text-center p-8 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-white/20 px-3 py-1 rounded-full text-xs font-bold">
              LIMITED
            </div>
            <h1 className="text-2xl font-bold mb-3">
              🔥 mealStack 런칭 기념
            </h1>
            <p className="text-xl mb-4">
              첫 달 구독료
              <br />
              <span className="text-3xl font-bold">50% 할인</span>
            </p>
            <div className="bg-white/10 rounded-lg p-3 mb-4">
              <p className="text-sm">
                📅 2024.08.25 ~ 2024.09.30 (한정기간)
              </p>
            </div>
            <div className="flex justify-center space-x-4 text-sm">
              <div className="text-center">
                <p className="line-through opacity-75">₩289,000</p>
                <p className="text-xs">기존 가격</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">₩144,500</p>
                <p className="text-xs">런칭 가격</p>
              </div>
            </div>
          </Card>
        </section>

        {/* 프로모션 이벤트 */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-text-white mb-4">
            🎉 진행중인 이벤트
          </h2>
          
          <div className="space-y-4">
            {promotionEvents.map((event) => (
              <Card key={event.id} variant="default" className="bg-card-gray relative">
                <div className="absolute top-3 right-3 flex space-x-2">
                  <span className="bg-primary-red text-white px-2 py-1 rounded text-xs font-bold">
                    {event.tag}
                  </span>
                  <span className="bg-white text-primary-red px-2 py-1 rounded text-xs font-bold">
                    {event.discount}
                  </span>
                </div>
                
                <div className="pr-20">
                  <h3 className="text-lg font-bold text-text-white mb-1">
                    {event.title}
                  </h3>
                  <p className="text-primary-red font-semibold mb-2">
                    {event.subtitle}
                  </p>
                  <p className="text-text-white text-sm mb-3 whitespace-pre-line">
                    {event.description}
                  </p>
                  <p className="text-text-gray text-xs">
                    📅 {event.period}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* 혜택 안내 */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-text-white mb-4">
            💎 mealStack만의 특별 혜택
          </h2>
          
          <Card variant="dark">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-red rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white text-xl">🎯</span>
                </div>
                <p className="text-text-white font-semibold text-sm mb-1">맞춤 영양</p>
                <p className="text-text-gray text-xs">개인별 목표에 맞는<br/>영양소 구성</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-red rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white text-xl">🚚</span>
                </div>
                <p className="text-text-white font-semibold text-sm mb-1">무료 배송</p>
                <p className="text-text-gray text-xs">구독 고객<br/>평생 무료배송</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-red rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white text-xl">📱</span>
                </div>
                <p className="text-text-white font-semibold text-sm mb-1">앱 무료</p>
                <p className="text-text-gray text-xs">프리미엄 영양관리<br/>앱 무료 제공</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-red rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white text-xl">🔄</span>
                </div>
                <p className="text-text-white font-semibold text-sm mb-1">자유 해지</p>
                <p className="text-text-gray text-xs">언제든지<br/>해지 가능</p>
              </div>
            </div>
          </Card>
        </section>

        {/* 고객 후기 */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-text-white mb-4">
            👥 실제 이용 고객 후기
          </h2>
          
          <div className="space-y-4">
            {testimonials.map((testimonial, index) => (
              <Card key={index} variant="default" className="bg-card-gray">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-primary-red rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-text-white font-semibold">
                        {testimonial.name}
                      </span>
                      <span className="text-text-gray text-sm">
                        ({testimonial.age}세, {testimonial.period})
                      </span>
                    </div>
                    <div className="flex items-center mb-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="text-primary-red text-sm">★</span>
                      ))}
                    </div>
                    <p className="text-text-white text-sm leading-relaxed">
                      "{testimonial.comment}"
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA 섹션 */}
        <section className="mb-8">
          <Card variant="default" className="bg-gradient-to-r from-primary-red/20 to-red-700/20 border border-primary-red text-center p-6">
            <h3 className="text-xl font-bold text-text-white mb-3">
              🎁 지금 시작하고 특별 혜택 받기
            </h3>
            <p className="text-text-gray mb-4">
              런칭 기념 할인은 한정 수량, 한정 기간입니다
            </p>
            
            <div className="space-y-3">
              {isAuthenticated ? (
                <>
                  <Link href="/subscription">
                    <Button className="w-full bg-primary-red hover:bg-red-700 text-lg py-4">
                      🔥 지금 구독하고 50% 할인받기
                    </Button>
                  </Link>
                  <Link href="/products">
                    <Button variant="outline" className="w-full">
                      단품 주문하기
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/promo-login">
                    <Button className="w-full bg-primary-red hover:bg-red-700 text-lg py-4">
                      🔥 로그인하고 50% 할인받기
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="outline" className="w-full">
                      기존 회원 로그인
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </Card>
        </section>

        {/* 주의사항 */}
        <section className="mb-8">
          <Card variant="dark" className="border border-card-gray">
            <h4 className="text-sm font-semibold text-text-white mb-3">
              📋 이벤트 주의사항
            </h4>
            <div className="text-text-gray text-xs space-y-1">
              <p>• 런칭 할인은 2024.09.30까지 한정 진행됩니다</p>
              <p>• 첫 달 할인 후 정상 요금으로 자동 갱신됩니다</p>
              <p>• 언제든지 해지 가능하며, 위약금은 없습니다</p>
              <p>• 중복 할인은 불가능합니다</p>
              <p>• 프로모션은 예고없이 종료될 수 있습니다</p>
            </div>
          </Card>
        </section>

      </main>

      <BottomNav />
    </div>
  );
}