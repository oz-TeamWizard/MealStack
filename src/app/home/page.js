"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import Footer from "@/components/layout/Footer";
import Card from "@/components/common/Card";
import { useAuthStore } from "@/stores/authStore";
import { useUserStore } from "@/stores/userStore";

// 홈화면 - 개발자 A 담당
export default function HomePage() {
  const { isAuthenticated, checkAutoLogin } = useAuthStore();
  const { loadMockData } = useUserStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    checkAutoLogin();
    if (isAuthenticated) {
      loadMockData();
    }
  }, [checkAutoLogin, isAuthenticated, loadMockData]);

  // 도시락 플랜 소개 이미지 데이터
  const planImages = [
    {
      id: 1,
      title: "고단백 벌크업 도시락",
      subtitle: "단백질 40g, 650kcal",
      description: "운동 효과를 극대화하는 완벽한 영양 구성",
      image: "/images/plan-1.jpg",
      bgColor: "from-gray-800 to-gray-900"
    },
    {
      id: 2,
      title: "전문 영양사가 설계한",
      subtitle: "맞춤형 식단 관리",
      description: "개인별 목표에 맞는 최적화된 메뉴",
      image: "/images/plan-2.jpg",
      bgColor: "from-gray-700 to-gray-900"
    },
    {
      id: 3,
      title: "신선한 재료, 매일 배송",
      subtitle: "새벽 배송 시스템",
      description: "운동 후 바로 섭취하는 신선한 도시락",
      image: "/images/plan-3.jpg",
      bgColor: "from-gray-900 to-black"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % planImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + planImages.length) % planImages.length);
  };

  // 자동 슬라이드
  useEffect(() => {
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, []);

  // Mock 상품 데이터
  const products = [
    {
      id: 1,
      name: "벌크업 도시락 1개",
      price: 12000,
      image: "/images/lunchbox-1.jpg",
      description: "단백질 40g, 650kcal",
    },
    {
      id: 2,
      name: "벌크업 도시락 3개 세트",
      price: 33000,
      image: "/images/lunchbox-3.jpg",
      description: "3일치 세트",
      originalPrice: 36000,
    },
    {
      id: 3,
      name: "벌크업 도시락 7개 세트",
      price: 75000,
      image: "/images/lunchbox-7.jpg",
      description: "1주치 세트",
      originalPrice: 84000,
    },
  ];

  const subscriptions = [
    {
      id: "weekly",
      name: "주간 구독",
      price: 65000,
      period: "주",
      description: "매주 7개 도시락 배송\n배송비 무료\n언제든 해지 가능",
      isPopular: false,
    },
    {
      id: "monthly",
      name: "월간 프리미엄",
      price: 289000,
      period: "월",
      description:
        "월간 도시락 + 루틴 관리\n배송비 무료\n첫 달 20% 할인\n언제든 해지 가능",
      isPopular: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background-black pb-20">
      <Header />

      <main className="py-6">
        {/* 도시락 플랜 소개 이미지 캐러셀 */}
        <section className="mb-8 -mx-0">
          <div className="relative w-full h-80 overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out h-full"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {planImages.map((plan, index) => (
                <div
                  key={plan.id}
                  className={`w-full h-full flex-shrink-0 relative bg-gradient-to-br ${plan.bgColor}`}
                >
                  {/* 배경 이미지 영역 (실제 이미지가 있을 때 사용) */}
                  <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                  
                  {/* 콘텐츠 */}
                  <div className="relative z-10 h-full flex flex-col justify-center px-6 text-white">
                    <h2 className="text-2xl font-bold mb-2">{plan.title}</h2>
                    <p className="text-lg mb-3 text-gray-300">{plan.subtitle}</p>
                    <p className="text-sm opacity-90">{plan.description}</p>
                  </div>

                  {/* 가상 이미지 표시 영역 */}
                  <div className="absolute bottom-4 right-6 w-20 h-20 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <span className="text-xs text-white">이미지</span>
                  </div>
                </div>
              ))}
            </div>

            {/* 이전/다음 버튼 */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black bg-opacity-30 rounded-full flex items-center justify-center text-white hover:bg-opacity-50 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black bg-opacity-30 rounded-full flex items-center justify-center text-white hover:bg-opacity-50 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* 인디케이터 */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {planImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    currentSlide === index 
                      ? 'bg-white' 
                      : 'bg-white bg-opacity-50'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        <div className="px-4">

        {/* 상품 섹션 */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-text-white mb-4">
            벌크업 도시락 상품
          </h2>

          <div className="grid grid-cols-3 gap-3">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="block h-full"
              >
                <Card
                  variant="product"
                  hover
                  className="text-center h-full flex flex-col"
                >
                  <div className="w-full aspect-square bg-background-dark rounded mb-2 flex items-center justify-center">
                    <span className="text-xs text-text-gray">이미지</span>
                  </div>
                  <p className="text-xs text-text-white mb-1 min-h-[32px]">
                    {product.name}
                  </p>
                  <div className="text-xs mt-auto">
                    {product.originalPrice ? (
                      <p className="text-text-gray line-through">
                        ₩{product.originalPrice.toLocaleString()}
                      </p>
                    ) : (
                      <p className="text-text-gray line-through invisible">
                        placeholder
                      </p>
                    )}
                    <p className="text-text-white font-bold">
                      ₩{product.price.toLocaleString()}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* 구독 섹션 */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-primary-red mb-4">구독 플랜</h2>

          <div className="space-y-4">
            {subscriptions.map((sub) => (
              <Link
                key={sub.id}
                href={`/subscription?plan=${sub.id}`}
                className="block"
              >
                <Card
                  variant="default"
                  className={`bg-card-gray border border-card-gray cursor-pointer transition-colors duration-200 hover:bg-primary-red hover:border-primary-red`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-text-white mb-1">
                        {sub.name}
                        {sub.isPopular && (
                          <span className="ml-2 text-xs bg-white text-primary-red px-2 py-1 rounded">
                            BEST
                          </span>
                        )}
                      </h3>
                      <p className="text-sm font-bold text-text-white mb-2">
                        ₩{sub.price.toLocaleString()}/{sub.period}
                      </p>
                      <p className="text-xs text-text-white whitespace-pre-line">
                        {sub.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
        
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
