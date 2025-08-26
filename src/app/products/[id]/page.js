'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';

// 개별 상품 상세 페이지
export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const productId = parseInt(params.id);
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [quantity, setQuantity] = useState(1);
  
  // Mock 상품 데이터
  const products = [
    {
      id: 1,
      name: '벌크업 도시락 (배송비 포함)',
      price: 12000,
      image: '/images/lunchbox-1.jpg',
      description: '• 단백질 40g 함유\n• 칼로리 650kcal\n• 신선한 재료 사용\n• 냉동 배송',
      nutrition: {
        protein: '40g',
        calories: '650kcal',
        carbs: '45g',
        fat: '15g'
      }
    },
    {
      id: 2,
      name: '3일 세트 도시락',
      price: 33000,
      image: '/images/lunchbox-2.jpg',
      description: '• 3일분 벌크업 도시락\n• 매일 다른 메뉴\n• 단백질 120g (총량)\n• 냉동 배송',
      nutrition: {
        protein: '120g',
        calories: '1950kcal',
        carbs: '135g',
        fat: '45g'
      }
    },
    {
      id: 3,
      name: '7일 세트 도시락',
      price: 75000,
      image: '/images/lunchbox-3.jpg',
      description: '• 7일분 벌크업 도시락\n• 매일 다른 메뉴\n• 단백질 280g (총량)\n• 냉동 배송',
      nutrition: {
        protein: '280g',
        calories: '4550kcal',
        carbs: '315g',
        fat: '105g'
      }
    }
  ];
  
  const product = products.find(p => p.id === productId);
  
  // 상품이 없으면 404 처리
  if (!product) {
    return (
      <div className="min-h-screen bg-background-black pb-20">
        <Header title="상품을 찾을 수 없습니다" showBack={true} />
        <div className="flex items-center justify-center h-64">
          <p className="text-text-gray">요청하신 상품을 찾을 수 없습니다.</p>
        </div>
        <BottomNav />
      </div>
    );
  }
  
  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity);
    }
  };
  
  // 인증 확인 후 로그인 페이지로 이동
  const checkAuthAndProceed = (action) => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    action();
  };

  const handleAddToCart = () => {
    checkAuthAndProceed(() => {
      addItem(product, quantity);
      alert('장바구니에 추가되었습니다!');
    });
  };

  const handleDirectOrder = () => {
    checkAuthAndProceed(() => {
      addItem(product, quantity);
      router.push('/checkout');
    });
  };
  
  return (
    <div className="min-h-screen bg-background-black pb-20">
      <Header title={product.name} showBack={true} />
      
      <main className="px-4 py-4">
        {/* 상품 이미지 */}
        <div className="w-full h-48 bg-black rounded-lg mb-4 flex items-center justify-center">
          <span className="text-text-gray">상품 이미지</span>
        </div>
        
        {/* 상품 정보 */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-text-white mb-2">
            {product.name}
          </h1>
          <p className="text-2xl font-bold text-primary-red mb-4">
            ₩{product.price.toLocaleString()}
          </p>
          <div className="text-sm text-text-gray whitespace-pre-line">
            {product.description}
          </div>
        </div>
        
        {/* 영양 정보 */}
        <Card variant="dark" className="mb-6">
          <h3 className="font-semibold text-text-white mb-3">영양 정보</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-text-gray">단백질</span>
              <span className="text-text-white font-semibold">{product.nutrition.protein}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-gray">칼로리</span>
              <span className="text-text-white font-semibold">{product.nutrition.calories}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-gray">탄수화물</span>
              <span className="text-text-white font-semibold">{product.nutrition.carbs}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-gray">지방</span>
              <span className="text-text-white font-semibold">{product.nutrition.fat}</span>
            </div>
          </div>
        </Card>
        
        {/* 수량 선택 */}
        <div className="mb-6">
          <h3 className="font-semibold text-text-white mb-3">수량 선택</h3>
          <div className="flex items-center">
            <div className="flex items-center bg-card-dark-gray rounded-lg">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="w-12 h-12 flex items-center justify-center text-text-white font-bold text-xl disabled:opacity-50"
              >
                −
              </button>
              <div className="w-16 h-12 flex items-center justify-center text-text-white font-bold">
                {quantity}
              </div>
              <button
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= 99}
                className="w-12 h-12 flex items-center justify-center text-text-white font-bold text-xl disabled:opacity-50"
              >
                +
              </button>
            </div>
            <div className="ml-4">
              <p className="text-sm text-text-gray">
                총 금액: <span className="text-text-white font-semibold">
                  ₩{(product.price * quantity).toLocaleString()}
                </span>
              </p>
            </div>
          </div>
        </div>
        
        {/* 장바구니 & 주문하기 버튼 */}
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 w-full max-w-md p-4 bg-background-black border-t border-border-gray">
          <div className="flex space-x-3">
            <Button
              onClick={handleAddToCart}
              variant="secondary"
              className="flex-1"
              size="lg"
            >
              장바구니 담기
            </Button>
            <Button
              onClick={handleDirectOrder}
              className="flex-1"
              size="lg"
            >
              ₩{(product.price * quantity).toLocaleString()} 주문하기
            </Button>
          </div>
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
}