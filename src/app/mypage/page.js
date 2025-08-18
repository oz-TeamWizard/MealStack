'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { useAuthStore } from '@/stores/authStore';
import { useUserStore } from '@/stores/userStore';

// 마이페이지 - 개발자 C 담당
export default function MyPage() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const {
    orders,
    subscription,
    addresses,
    loadMockData,
    pauseSubscription,
    resumeSubscription,
    cancelSubscription
  } = useUserStore();
  
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    loadMockData(user?.id);
  }, [isAuthenticated, user, router, loadMockData]);
  
  const handleSubscriptionAction = (action) => {
    switch (action) {
      case 'pause':
        pauseSubscription();
        alert('구독이 일시정지되었습니다.');
        break;
      case 'resume':
        resumeSubscription();
        alert('구독이 재개되었습니다.');
        break;
      case 'cancel':
        if (confirm('정말로 구독을 해지하시겠습니까?')) {
          cancelSubscription();
          alert('구독이 해지되었습니다.');
        }
        break;
    }
  };
  
  const handleLogout = () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      logout();
      router.push('/home');
    }
  };
  
  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 loading-spinner"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background-black pb-20">
      <Header title="마이페이지" />
      
      <main className="px-4 py-6">
        {/* 프로필 카드 */}
        <Card variant="default" className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-text-white mb-1">
                {user.name}님
              </h2>
              <p className="text-text-gray text-sm mb-1">{user.phoneNumber}</p>
              <p className="text-text-gray text-sm mb-2">{user.email}</p>
              {subscription && subscription.status === 'active' && (
                <span className="inline-block px-2 py-1 bg-primary-red text-white text-xs rounded">
                  {subscription.plan} 중
                </span>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="text-text-gray hover:text-text-white text-sm"
            >
              로그아웃
            </button>
          </div>
        </Card>
        
        {/* 주문 내역 */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-text-white">주문 내역</h2>
            <button className="text-text-gray hover:text-text-white text-sm">
              전체보기 →
            </button>
          </div>
          
          {orders.length > 0 ? (
            <div className="space-y-3">
              {orders.slice(0, 3).map((order) => (
                <Card key={order.id} variant="product">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-text-gray text-sm mb-1">{order.date}</p>
                      <p className="text-text-white font-semibold mb-1">
                        {order.items[0].name} {order.items[0].quantity}개
                      </p>
                      <p className="text-text-white font-bold">
                        ₩{order.totalAmount.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`
                        text-xs px-2 py-1 rounded
                        ${order.status === '배송완료' 
                          ? 'bg-green-600 text-white' 
                          : 'bg-yellow-600 text-white'
                        }
                      `}>
                        {order.status}
                      </span>
                      {order.trackingNumber && (
                        <p className="text-text-gray text-xs mt-1">
                          {order.trackingNumber}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card variant="product">
              <div className="text-center py-8">
                <p className="text-text-gray">주문 내역이 없습니다</p>
                <Button 
                  onClick={() => router.push('/products')}
                  className="mt-4"
                  size="sm"
                >
                  상품 둘러보기
                </Button>
              </div>
            </Card>
          )}
        </section>
        
        {/* 구독 관리 */}
        {subscription && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-primary-red mb-4">구독 관리</h2>
            
            <Card variant="default" className="mb-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-text-white mb-1">{subscription.plan}</h3>
                  <p className="text-text-gray text-sm mb-1">
                    다음 결제일: {subscription.nextPaymentDate}
                  </p>
                  <p className="text-text-white font-bold">
                    ₩{subscription.price.toLocaleString()}/월
                  </p>
                </div>
                <span className={`
                  text-xs px-2 py-1 rounded
                  ${subscription.status === 'active' 
                    ? 'bg-green-600 text-white' 
                    : subscription.status === 'paused'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-red-600 text-white'
                  }
                `}>
                  {subscription.status === 'active' ? '활성' : 
                   subscription.status === 'paused' ? '일시정지' : '해지됨'}
                </span>
              </div>
              
              <div className="flex space-x-2">
                {subscription.status === 'active' ? (
                  <>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleSubscriptionAction('pause')}
                      className="flex-1"
                    >
                      일시정지
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSubscriptionAction('cancel')}
                      className="flex-1 border-red-500 text-red-500 hover:bg-red-500"
                    >
                      구독 해지
                    </Button>
                  </>
                ) : subscription.status === 'paused' ? (
                  <>
                    <Button
                      size="sm"
                      onClick={() => handleSubscriptionAction('resume')}
                      className="flex-1"
                    >
                      구독 재개
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSubscriptionAction('cancel')}
                      className="flex-1 border-red-500 text-red-500 hover:bg-red-500"
                    >
                      구독 해지
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => router.push('/subscription')}
                    className="w-full"
                    size="sm"
                  >
                    새로운 구독 시작하기
                  </Button>
                )}
              </div>
            </Card>
          </section>
        )}
        
        {/* 메뉴 목록 */}
        <section>
          <div className="space-y-2">
            {[
              { label: '배송지 관리', path: '/mypage/addresses' },
              { label: '결제수단 관리', path: '/mypage/payments' },
              { label: '주문/구독 내역', path: '/mypage/orders' },
              { label: '고객센터 문의', path: '/mypage/support' },
              { label: '공지사항', path: '/mypage/notices' },
              { label: '이용약관', path: '/mypage/terms' },
              { label: '개인정보처리방침', path: '/mypage/privacy' }
            ].map((menu) => (
              <button
                key={menu.path}
                onClick={() => router.push(menu.path)}
                className="w-full p-4 bg-card-dark-gray rounded-lg flex items-center justify-between hover:bg-card-gray transition-colors"
              >
                <span className="text-text-white">{menu.label}</span>
                <span className="text-text-gray">→</span>
              </button>
            ))}
          </div>
        </section>
        
        {/* 앱 정보 */}
        <div className="mt-8 text-center text-text-light-gray text-xs">
          <p>MealStack v1.0.0</p>
          <p className="mt-1">© 2024 MealStack. All rights reserved.</p>
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
}