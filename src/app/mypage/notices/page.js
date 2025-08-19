'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import Card from '@/components/common/Card';
import { useAuthStore } from '@/stores/authStore';

// 공지사항 페이지
export default function NoticesPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [notices, setNotices] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all'); // all, service, event, system
  
  const categories = [
    { id: 'all', label: '전체' },
    { id: 'service', label: '서비스' },
    { id: 'event', label: '이벤트' },
    { id: 'system', label: '시스템' }
  ];
  
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    // 공지사항 목 데이터 로드
    loadMockNotices();
  }, [isAuthenticated, router]);
  
  const loadMockNotices = () => {
    // TODO: API 연동 시 실제 데이터로 교체
    const mockNotices = [
      {
        id: 1,
        category: 'event',
        title: '🎉 MealStack 런칭 기념 할인 이벤트',
        content: `MealStack 정식 런칭을 기념하여 특별 할인 이벤트를 진행합니다!
        
📅 이벤트 기간: 2024년 1월 15일 ~ 2월 15일

🎯 혜택:
• 첫 구독 30% 할인
• 3일 세트 무료배송
• 추천인 적립금 10,000원

🔥 추가 혜택:
• 친구 추천 시 양쪽 모두 적립금 지급
• 후기 작성 시 다음 주문 5% 할인

많은 참여 부탁드립니다!`,
        author: 'MealStack 운영팀',
        createdAt: '2024-01-15',
        views: 1245,
        isImportant: true,
        isNew: true
      },
      {
        id: 2,
        category: 'service',
        title: '배송지역 확대 안내',
        content: `안녕하세요, MealStack입니다.

더 많은 고객님께 서비스를 제공하기 위해 배송지역을 확대합니다.

📦 신규 배송지역:
• 부산광역시 전체 (기존: 일부 지역)
• 대구광역시 전체 
• 대전광역시 전체
• 광주광역시 전체

⏰ 배송시간:
• 수도권: 주문 후 1-2일
• 광역시: 주문 후 2-3일

감사합니다.`,
        author: 'MealStack 운영팀',
        createdAt: '2024-01-12',
        views: 892,
        isImportant: false,
        isNew: true
      },
      {
        id: 3,
        category: 'system',
        title: '앱 업데이트 안내 (v1.1.0)',
        content: `MealStack 앱이 업데이트 되었습니다.

🆕 새로운 기능:
• 주문 상태 실시간 알림
• 배송 추적 기능 개선
• 구독 일시정지/재개 기능
• 영양 성분 상세 정보 추가

🔧 개선사항:
• 결제 프로세스 최적화
• 앱 성능 개선
• UI/UX 개선

⚠️ 안정적인 서비스 이용을 위해 최신 버전으로 업데이트해 주세요.`,
        author: 'MealStack 개발팀',
        createdAt: '2024-01-10',
        views: 567,
        isImportant: false,
        isNew: false
      },
      {
        id: 4,
        category: 'service',
        title: '설 연휴 배송 일정 안내',
        content: `설 연휴 기간 중 배송 일정을 안내드립니다.

🗓️ 연휴 기간: 2024년 2월 9일 ~ 2월 12일

📦 배송 일정:
• 2월 8일(목) 18시 이후 주문: 2월 13일(화) 순차 배송
• 신선식품 특성상 연휴 중 배송 중단
• 2월 13일부터 정상 배송

💡 추천사항:
• 연휴 전 미리 주문해 주세요
• 구독 고객님께는 별도 안내 예정

불편을 드려 죄송합니다.`,
        author: 'MealStack 운영팀',
        createdAt: '2024-01-08',
        views: 734,
        isImportant: true,
        isNew: false
      },
      {
        id: 5,
        category: 'event',
        title: '후기 이벤트 당첨자 발표',
        content: `12월 후기 작성 이벤트 당첨자를 발표합니다.

🏆 당첨자 (총 10명):
• 1등 (1명): 3개월 무료 구독 - 김**님
• 2등 (3명): 1개월 무료 구독 - 이**님, 박**님, 최**님  
• 3등 (6명): 적립금 50,000원 - 정**님 외 5분

📧 당첨자 안내:
• 개별 연락 예정 (SMS/이메일)
• 경품 지급: 1월 20일 예정

다음 이벤트도 많은 관심 부탁드립니다!`,
        author: 'MealStack 마케팅팀',
        createdAt: '2024-01-05',
        views: 456,
        isImportant: false,
        isNew: false
      }
    ];
    
    setNotices(mockNotices);
  };
  
  const getCategoryColor = (category) => {
    switch (category) {
      case 'event':
        return 'bg-pink-600 text-white';
      case 'service':
        return 'bg-blue-600 text-white';
      case 'system':
        return 'bg-green-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };
  
  const getCategoryLabel = (category) => {
    const found = categories.find(cat => cat.id === category);
    return found ? found.label : category;
  };
  
  const filteredNotices = activeCategory === 'all' 
    ? notices 
    : notices.filter(notice => notice.category === activeCategory);
  
  const handleNoticeClick = (notice) => {
    setSelectedNotice(notice);
    // 조회수 증가 (실제로는 API 호출)
    setNotices(prev => prev.map(n => 
      n.id === notice.id ? { ...n, views: n.views + 1 } : n
    ));
  };
  
  const closeNoticeDetail = () => {
    setSelectedNotice(null);
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
      <Header title="공지사항" showBackButton />
      
      <main className="px-4 py-6">
        {/* 카테고리 필터 */}
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === category.id
                  ? 'bg-primary-red text-white'
                  : 'bg-card-gray text-text-gray hover:text-text-white'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
        
        {/* 공지사항 목록 */}
        <div className="space-y-4">
          {filteredNotices.length > 0 ? (
            filteredNotices.map((notice) => (
              <Card 
                key={notice.id} 
                variant="default"
                className="cursor-pointer hover:bg-card-dark-gray transition-colors"
                onClick={() => handleNoticeClick(notice)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs ${getCategoryColor(notice.category)}`}>
                      {getCategoryLabel(notice.category)}
                    </span>
                    {notice.isImportant && (
                      <span className="px-2 py-1 bg-primary-red text-white text-xs rounded">
                        중요
                      </span>
                    )}
                    {notice.isNew && (
                      <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">
                        NEW
                      </span>
                    )}
                  </div>
                  <span className="text-text-gray text-xs">조회 {notice.views}</span>
                </div>
                
                <h3 className="font-bold text-text-white mb-2 line-clamp-2">
                  {notice.title}
                </h3>
                
                <div className="flex justify-between items-center">
                  <span className="text-text-gray text-sm">{notice.author}</span>
                  <span className="text-text-gray text-sm">{notice.createdAt}</span>
                </div>
              </Card>
            ))
          ) : (
            <Card variant="default">
              <div className="text-center py-8">
                <p className="text-text-gray">해당 카테고리의 공지사항이 없습니다.</p>
              </div>
            </Card>
          )}
        </div>
      </main>
      
      {/* 공지사항 상세 모달 */}
      {selectedNotice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className="w-full max-w-md bg-background-dark rounded-t-xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* 헤더 */}
            <div className="flex items-center justify-between p-6 border-b border-border-gray">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded text-xs ${getCategoryColor(selectedNotice.category)}`}>
                  {getCategoryLabel(selectedNotice.category)}
                </span>
                {selectedNotice.isImportant && (
                  <span className="px-2 py-1 bg-primary-red text-white text-xs rounded">
                    중요
                  </span>
                )}
              </div>
              <button
                onClick={closeNoticeDetail}
                className="text-text-gray hover:text-text-white"
              >
                ✕
              </button>
            </div>
            
            {/* 콘텐츠 */}
            <div className="flex-1 overflow-y-auto p-6">
              <h2 className="text-lg font-bold text-text-white mb-4">
                {selectedNotice.title}
              </h2>
              
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-border-gray">
                <div>
                  <p className="text-text-gray text-sm">{selectedNotice.author}</p>
                  <p className="text-text-gray text-sm">{selectedNotice.createdAt}</p>
                </div>
                <p className="text-text-gray text-sm">조회 {selectedNotice.views}</p>
              </div>
              
              <div className="text-text-white text-sm leading-relaxed whitespace-pre-line">
                {selectedNotice.content}
              </div>
            </div>
            
            {/* 하단 버튼 */}
            <div className="p-6 border-t border-border-gray">
              <button
                onClick={closeNoticeDetail}
                className="w-full py-3 bg-card-gray text-text-white rounded-lg hover:bg-card-dark-gray transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
      
      <BottomNav />
    </div>
  );
}