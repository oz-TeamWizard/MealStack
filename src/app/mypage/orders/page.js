'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { useAuthStore } from '@/stores/authStore';

// 주문/구독 내역 페이지
export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState('orders'); // orders, subscriptions
  const [orders, setOrders] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    // 목 데이터 로드
    loadMockData();
  }, [isAuthenticated, router]);
  
  const loadMockData = () => {
    // TODO: API 연동 시 실제 데이터로 교체
    const mockOrders = [
      {
        id: 'ORD-2024-001',
        date: '2024-01-15',
        status: '배송완료',
        items: [
          { name: '단백질 도시락', quantity: 3, price: 12000 },
          { name: '벌크업 세트 (7일)', quantity: 1, price: 75000 }
        ],
        totalAmount: 111000,
        shippingFee: 0,
        paymentMethod: '신한카드 ****1234',
        deliveryAddress: '서울특별시 강남구 테헤란로 123',
        trackingNumber: '123456789012'
      },
      {
        id: 'ORD-2024-002',
        date: '2024-01-10',
        status: '배송중',
        items: [
          { name: '단백질 도시락', quantity: 5, price: 12000 }
        ],
        totalAmount: 60000,
        shippingFee: 0,
        paymentMethod: '신한카드 ****1234',
        deliveryAddress: '서울특별시 강남구 테헤란로 123',
        trackingNumber: '987654321098'
      },
      {
        id: 'ORD-2024-003',
        date: '2024-01-05',
        status: '주문완료',
        items: [
          { name: '벌크업 세트 (3일)', quantity: 2, price: 33000 }
        ],
        totalAmount: 66000,
        shippingFee: 0,
        paymentMethod: '국민은행 ***123',
        deliveryAddress: '서울특별시 강남구 테헤란로 123',
        trackingNumber: null
      }
    ];
    
    const mockSubscriptions = [
      {
        id: 'SUB-2024-001',
        plan: '프리미엄 월 구독',
        status: 'active',
        startDate: '2024-01-01',
        nextDeliveryDate: '2024-01-20',
        nextPaymentDate: '2024-02-01',
        monthlyPrice: 289000,
        totalPaid: 289000,
        deliveryCount: 4,
        totalDeliveries: 28,
        items: [
          { name: '단백질 도시락', quantity: 7 },
          { name: '영양 관리 상담', quantity: 1 }
        ]
      },
      {
        id: 'SUB-2023-005',
        plan: '주간 구독',
        status: 'completed',
        startDate: '2023-12-01',
        endDate: '2023-12-31',
        monthlyPrice: 65000,
        totalPaid: 260000,
        deliveryCount: 16,
        totalDeliveries: 16,
        items: [
          { name: '단백질 도시락', quantity: 7 }
        ]
      }
    ];
    
    setOrders(mockOrders);
    setSubscriptions(mockSubscriptions);
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case '배송완료':
        return 'bg-green-600 text-white';
      case '배송중':
        return 'bg-blue-600 text-white';
      case '주문완료':
        return 'bg-yellow-600 text-white';
      case 'active':
        return 'bg-green-600 text-white';
      case 'paused':
        return 'bg-yellow-600 text-white';
      case 'completed':
        return 'bg-gray-600 text-white';
      case 'cancelled':
        return 'bg-red-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };
  
  const getStatusText = (status) => {
    switch (status) {
      case 'active': return '활성';
      case 'paused': return '일시정지';
      case 'completed': return '완료';
      case 'cancelled': return '취소됨';
      default: return status;
    }
  };
  
  const handleOrderDetail = (order) => {
    setSelectedOrder(order);
  };
  
  const handleReorder = (order) => {
    // TODO: 장바구니에 동일한 상품 추가 로직
    alert('장바구니에 상품이 추가되었습니다.');
    router.push('/products');
  };
  
  const closeOrderDetail = () => {
    setSelectedOrder(null);
  };
  
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 loading-spinner"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background-black pb-20">
      <Header title="주문/구독 내역" showBackButton />
      
      <main className="px-4 py-6">
        {/* 탭 선택 */}
        <div className="flex mb-6 bg-card-gray rounded-lg p-1">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'orders' 
                ? 'bg-primary-red text-white' 
                : 'text-text-gray hover:text-text-white'
            }`}
          >
            주문 내역
          </button>
          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'subscriptions' 
                ? 'bg-primary-red text-white' 
                : 'text-text-gray hover:text-text-white'
            }`}
          >
            구독 내역
          </button>
        </div>
        
        {/* 주문 내역 */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length > 0 ? (
              orders.map((order) => (
                <Card key={order.id} variant="product">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-bold text-text-white">{order.id}</h3>
                        <span className={`text-xs px-2 py-1 rounded ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-text-gray text-sm">{order.date}</p>
                    </div>
                    <button
                      onClick={() => handleOrderDetail(order)}
                      className="text-primary-red hover:text-primary-red-hover text-sm"
                    >
                      상세보기
                    </button>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-text-white">{item.name} × {item.quantity}</span>
                        <span className="text-text-white">₩{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center pt-3 border-t border-border-gray">
                    <span className="text-text-white font-bold">
                      총 ₩{order.totalAmount.toLocaleString()}
                    </span>
                    <div className="flex space-x-2">
                      {order.status === '배송완료' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReorder(order)}
                        >
                          재주문
                        </Button>
                      )}
                      {order.trackingNumber && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => alert('배송 조회 기능은 준비중입니다.')}
                        >
                          배송조회
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card variant="default">
                <div className="text-center py-8">
                  <p className="text-text-gray mb-4">주문 내역이 없습니다</p>
                  <Button
                    onClick={() => router.push('/products')}
                    size="sm"
                  >
                    상품 둘러보기
                  </Button>
                </div>
              </Card>
            )}
          </div>
        )}
        
        {/* 구독 내역 */}
        {activeTab === 'subscriptions' && (
          <div className="space-y-4">
            {subscriptions.length > 0 ? (
              subscriptions.map((subscription) => (
                <Card key={subscription.id} variant="default">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-bold text-text-white">{subscription.plan}</h3>
                        <span className={`text-xs px-2 py-1 rounded ${getStatusColor(subscription.status)}`}>
                          {getStatusText(subscription.status)}
                        </span>
                      </div>
                      <p className="text-text-gray text-sm">시작일: {subscription.startDate}</p>
                      {subscription.status === 'active' && (
                        <p className="text-text-gray text-sm">다음 배송: {subscription.nextDeliveryDate}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-text-white font-bold">₩{subscription.monthlyPrice.toLocaleString()}/월</p>
                      <p className="text-text-gray text-sm">총 결제: ₩{subscription.totalPaid.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="bg-card-dark-gray rounded-lg p-3 mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-text-gray text-sm">배송 진행률</span>
                      <span className="text-text-white text-sm">
                        {subscription.deliveryCount}/{subscription.totalDeliveries}
                      </span>
                    </div>
                    <div className="w-full bg-border-gray rounded-full h-2">
                      <div 
                        className="bg-primary-red h-2 rounded-full" 
                        style={{ 
                          width: `${(subscription.deliveryCount / subscription.totalDeliveries) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-1 mb-3">
                    <p className="text-text-gray text-sm font-medium">포함 상품:</p>
                    {subscription.items.map((item, index) => (
                      <p key={index} className="text-text-white text-sm">
                        • {item.name} × {item.quantity}
                      </p>
                    ))}
                  </div>
                  
                  {subscription.status === 'active' && (
                    <div className="flex space-x-2 pt-3 border-t border-border-gray">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push('/mypage')}
                        className="flex-1"
                      >
                        구독 관리
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => alert('배송 일정 변경 기능은 준비중입니다.')}
                        className="flex-1"
                      >
                        일정 변경
                      </Button>
                    </div>
                  )}
                </Card>
              ))
            ) : (
              <Card variant="default">
                <div className="text-center py-8">
                  <p className="text-text-gray mb-4">구독 내역이 없습니다</p>
                  <Button
                    onClick={() => router.push('/subscription')}
                    size="sm"
                  >
                    구독 시작하기
                  </Button>
                </div>
              </Card>
            )}
          </div>
        )}
      </main>
      
      {/* 주문 상세 모달 */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className="w-full max-w-md bg-background-dark rounded-t-xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-text-white">
                주문 상세
              </h2>
              <button
                onClick={closeOrderDetail}
                className="text-text-gray hover:text-text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              {/* 주문 정보 */}
              <div>
                <h3 className="text-text-white font-medium mb-2">주문 정보</h3>
                <div className="bg-card-gray rounded-lg p-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-gray">주문번호</span>
                    <span className="text-text-white">{selectedOrder.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-gray">주문일시</span>
                    <span className="text-text-white">{selectedOrder.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-gray">주문상태</span>
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* 주문 상품 */}
              <div>
                <h3 className="text-text-white font-medium mb-2">주문 상품</h3>
                <div className="bg-card-gray rounded-lg p-3 space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <div>
                        <p className="text-text-white text-sm">{item.name}</p>
                        <p className="text-text-gray text-xs">수량: {item.quantity}개</p>
                      </div>
                      <p className="text-text-white text-sm">
                        ₩{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 결제 정보 */}
              <div>
                <h3 className="text-text-white font-medium mb-2">결제 정보</h3>
                <div className="bg-card-gray rounded-lg p-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-gray">상품금액</span>
                    <span className="text-text-white">
                      ₩{selectedOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-gray">배송비</span>
                    <span className="text-text-white">₩{selectedOrder.shippingFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t border-border-gray pt-2">
                    <span className="text-text-white">총 결제금액</span>
                    <span className="text-primary-red">₩{selectedOrder.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-gray">결제수단</span>
                    <span className="text-text-white">{selectedOrder.paymentMethod}</span>
                  </div>
                </div>
              </div>
              
              {/* 배송 정보 */}
              <div>
                <h3 className="text-text-white font-medium mb-2">배송 정보</h3>
                <div className="bg-card-gray rounded-lg p-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-gray">배송지</span>
                    <span className="text-text-white text-right">{selectedOrder.deliveryAddress}</span>
                  </div>
                  {selectedOrder.trackingNumber && (
                    <div className="flex justify-between">
                      <span className="text-text-gray">운송장번호</span>
                      <span className="text-text-white">{selectedOrder.trackingNumber}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* 액션 버튼 */}
              <div className="flex space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={closeOrderDetail}
                  className="flex-1"
                >
                  닫기
                </Button>
                {selectedOrder.status === '배송완료' && (
                  <Button
                    onClick={() => {
                      handleReorder(selectedOrder);
                      closeOrderDetail();
                    }}
                    className="flex-1"
                  >
                    재주문
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <BottomNav />
    </div>
  );
}