"use client";

import { useEffect } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import { useAuthStore } from "@/stores/authStore";
import { useUserStore } from "@/stores/userStore";

// 홈화면 - 개발자 A 담당
export default function HomePage() {
  const { isAuthenticated, checkAutoLogin } = useAuthStore();
  const { loadMockData } = useUserStore();

  useEffect(() => {
    checkAutoLogin();
    if (isAuthenticated) {
      loadMockData();
    }
  }, [checkAutoLogin, isAuthenticated, loadMockData]);

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

      <main className="px-4 py-6">
        {/* 히어로 섹션 */}
        <section className="mb-8">
          <h1 className="text-xl font-bold text-text-white mb-4">
            벌크업 도시락, 이제 간편하게
            <br />
            정기 구독으로 받아보세요
          </h1>

          {/* 히어로 이미지 */}
          <div className="w-full h-45 bg-card-dark-gray rounded-lg mb-4 flex items-center justify-center">
            <span className="text-text-gray">도시락 이미지</span>
          </div>
        </section>

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
                    {product.name.split(" ").slice(0, 2).join(" ")}
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

        {/* 사전예약 섹션 (비로그인 사용자) */}
        {!isAuthenticated && (
          <section className="mb-8">
            <Card variant="dark" className="text-center">
              <h3 className="font-bold text-text-white mb-2">
                🎉 사전예약 진행중!
              </h3>
              <p className="text-sm text-text-gray mb-4">
                출시 알림을 받아보시고 특별 혜택을 누려보세요
              </p>
              <Link href="/login">
                <Button className="w-full">사전예약 신청하기</Button>
              </Link>
            </Card>
          </section>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
