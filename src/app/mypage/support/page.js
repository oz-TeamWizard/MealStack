'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { useAuthStore } from '@/stores/authStore';

// 고객센터 문의 페이지
export default function SupportPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState('inquiry'); // inquiry, history, faq
  const [inquiryForm, setInquiryForm] = useState({
    category: '',
    title: '',
    content: '',
    attachments: []
  });
  const [inquiryHistory, setInquiryHistory] = useState([]);
  
  const faqData = [
    {
      id: 1,
      category: '배송',
      question: '배송은 얼마나 걸리나요?',
      answer: '서울/경기 지역은 주문 후 1-2일, 지방은 2-3일 소요됩니다. 신선식품 특성상 주말/공휴일 배송은 제한적입니다.',
      isOpen: false
    },
    {
      id: 2,
      category: '주문/결제',
      question: '주문 취소는 어떻게 하나요?',
      answer: '주문 완료 후 2시간 이내에는 마이페이지에서 직접 취소 가능합니다. 이후에는 고객센터로 문의해 주세요.',
      isOpen: false
    },
    {
      id: 3,
      category: '구독',
      question: '구독 일시정지가 가능한가요?',
      answer: '구독 서비스는 언제든지 일시정지가 가능합니다. 마이페이지 > 구독 관리에서 설정할 수 있습니다.',
      isOpen: false
    },
    {
      id: 4,
      category: '상품',
      question: '알레르기가 있는데 성분표를 볼 수 있나요?',
      answer: '각 상품 페이지에서 상세한 영양 성분표와 알레르기 유발 요소를 확인하실 수 있습니다.',
      isOpen: false
    },
    {
      id: 5,
      category: '회원',
      question: '회원 탈퇴는 어떻게 하나요?',
      answer: '고객센터로 탈퇴 요청을 주시면 처리해 드립니다. 구독 중인 경우 먼저 해지가 필요합니다.',
      isOpen: false
    }
  ];
  
  const [faqs, setFaqs] = useState(faqData);
  
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    // 문의 내역 로드
    loadInquiryHistory();
  }, [isAuthenticated, router]);
  
  const loadInquiryHistory = () => {
    // TODO: API 연동 시 실제 데이터로 교체
    const mockHistory = [
      {
        id: 'INQ-2024-001',
        category: '배송',
        title: '배송이 지연되고 있어요',
        content: '주문한 상품이 예정일보다 2일이나 늦어지고 있습니다.',
        status: '답변완료',
        createdAt: '2024-01-15',
        answeredAt: '2024-01-15',
        answer: '배송 지연에 대해 죄송합니다. 물류센터 확인 결과 내일 오전 배송 예정입니다.'
      },
      {
        id: 'INQ-2024-002',
        category: '상품',
        title: '영양 성분에 대해 궁금해요',
        content: '단백질 도시락의 정확한 칼로리와 단백질 함량이 궁금합니다.',
        status: '접수완료',
        createdAt: '2024-01-14',
        answeredAt: null,
        answer: null
      }
    ];
    setInquiryHistory(mockHistory);
  };
  
  const handleInputChange = (field, value) => {
    setInquiryForm(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!inquiryForm.category || !inquiryForm.title || !inquiryForm.content) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }
    
    // TODO: API 연동 시 실제 전송 로직 구현
    const newInquiry = {
      id: `INQ-${Date.now()}`,
      ...inquiryForm,
      status: '접수완료',
      createdAt: new Date().toISOString().split('T')[0],
      answeredAt: null,
      answer: null
    };
    
    setInquiryHistory(prev => [newInquiry, ...prev]);
    
    // 폼 초기화
    setInquiryForm({
      category: '',
      title: '',
      content: '',
      attachments: []
    });
    
    alert('문의가 접수되었습니다. 빠른 시일 내에 답변드리겠습니다.');
    setActiveTab('history');
  };
  
  const toggleFaq = (id) => {
    setFaqs(prev => prev.map(faq => 
      faq.id === id ? { ...faq, isOpen: !faq.isOpen } : faq
    ));
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case '답변완료':
        return 'bg-green-600 text-white';
      case '접수완료':
        return 'bg-yellow-600 text-white';
      case '처리중':
        return 'bg-blue-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
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
      <Header title="고객센터" showBackButton />
      
      <main className="px-4 py-6">
        {/* 연락처 정보 */}
        <Card variant="default" className="mb-6">
          <div className="text-center">
            <h2 className="text-lg font-bold text-text-white mb-2">📞 고객센터</h2>
            <p className="text-primary-red text-xl font-bold mb-1">1588-1234</p>
            <p className="text-text-gray text-sm">평일 09:00 - 18:00 (점심시간 12:00-13:00)</p>
            <p className="text-text-gray text-sm">주말/공휴일 휴무</p>
          </div>
        </Card>
        
        {/* 탭 선택 */}
        <div className="flex mb-6 bg-card-gray rounded-lg p-1">
          <button
            onClick={() => setActiveTab('faq')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'faq' 
                ? 'bg-primary-red text-white' 
                : 'text-text-gray hover:text-text-white'
            }`}
          >
            자주묻는질문
          </button>
          <button
            onClick={() => setActiveTab('inquiry')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'inquiry' 
                ? 'bg-primary-red text-white' 
                : 'text-text-gray hover:text-text-white'
            }`}
          >
            1:1 문의
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'history' 
                ? 'bg-primary-red text-white' 
                : 'text-text-gray hover:text-text-white'
            }`}
          >
            문의내역
          </button>
        </div>
        
        {/* 자주묻는질문 */}
        {activeTab === 'faq' && (
          <div className="space-y-4">
            {faqs.map((faq) => (
              <Card key={faq.id} variant="default">
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full text-left"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="px-2 py-1 bg-primary-red text-white text-xs rounded">
                          {faq.category}
                        </span>
                      </div>
                      <p className="text-text-white font-medium">{faq.question}</p>
                    </div>
                    <span className="text-text-gray ml-2">
                      {faq.isOpen ? '−' : '+'}
                    </span>
                  </div>
                </button>
                {faq.isOpen && (
                  <div className="mt-3 pt-3 border-t border-border-gray">
                    <p className="text-text-gray text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
        
        {/* 1:1 문의 */}
        {activeTab === 'inquiry' && (
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-text-white text-sm font-medium mb-2">
                  문의 유형 *
                </label>
                <select
                  value={inquiryForm.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-4 py-3 bg-card-gray border border-border-gray rounded-lg text-text-white focus:outline-none focus:border-primary-red"
                  required
                >
                  <option value="">문의 유형을 선택하세요</option>
                  <option value="주문/결제">주문/결제</option>
                  <option value="배송">배송</option>
                  <option value="상품">상품</option>
                  <option value="구독">구독</option>
                  <option value="회원">회원/계정</option>
                  <option value="기타">기타</option>
                </select>
              </div>
              
              <div>
                <label className="block text-text-white text-sm font-medium mb-2">
                  제목 *
                </label>
                <Input
                  type="text"
                  value={inquiryForm.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="문의 제목을 입력하세요"
                  required
                />
              </div>
              
              <div>
                <label className="block text-text-white text-sm font-medium mb-2">
                  내용 *
                </label>
                <textarea
                  value={inquiryForm.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  placeholder="문의 내용을 자세히 입력해주세요"
                  rows="6"
                  className="w-full px-4 py-3 bg-card-gray border border-border-gray rounded-lg text-text-white placeholder-text-light-gray focus:outline-none focus:border-primary-red resize-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-text-white text-sm font-medium mb-2">
                  첨부파일
                </label>
                <div className="border-2 border-dashed border-border-gray rounded-lg p-6 text-center">
                  <p className="text-text-gray text-sm mb-2">파일을 선택하거나 여기에 드래그하세요</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => alert('파일 업로드 기능은 준비중입니다.')}
                  >
                    파일 선택
                  </Button>
                  <p className="text-text-light-gray text-xs mt-2">
                    최대 5MB, JPG/PNG/PDF 파일만 가능합니다
                  </p>
                </div>
              </div>
              
              <div className="bg-card-dark-gray rounded-lg p-4">
                <h3 className="text-text-white font-medium mb-2">📋 문의 전 확인사항</h3>
                <ul className="text-text-gray text-sm space-y-1">
                  <li>• 자주묻는질문에서 답변을 먼저 확인해 주세요</li>
                  <li>• 주문 관련 문의 시 주문번호를 함께 기재해 주세요</li>
                  <li>• 답변은 영업일 기준 1-2일 소요됩니다</li>
                </ul>
              </div>
              
              <Button type="submit" className="w-full">
                문의하기
              </Button>
            </form>
          </div>
        )}
        
        {/* 문의 내역 */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            {inquiryHistory.length > 0 ? (
              inquiryHistory.map((inquiry) => (
                <Card key={inquiry.id} variant="default">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="px-2 py-1 bg-card-gray text-text-white text-xs rounded">
                          {inquiry.category}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(inquiry.status)}`}>
                          {inquiry.status}
                        </span>
                      </div>
                      <h3 className="font-bold text-text-white mb-1">{inquiry.title}</h3>
                      <p className="text-text-gray text-sm">{inquiry.createdAt}</p>
                    </div>
                    <p className="text-text-gray text-sm">{inquiry.id}</p>
                  </div>
                  
                  <p className="text-text-gray text-sm mb-3 leading-relaxed">
                    {inquiry.content}
                  </p>
                  
                  {inquiry.answer && (
                    <div className="bg-card-dark-gray rounded-lg p-3 border-l-2 border-primary-red">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-primary-red font-medium text-sm">📝 답변</span>
                        <span className="text-text-gray text-xs">{inquiry.answeredAt}</span>
                      </div>
                      <p className="text-text-white text-sm leading-relaxed">{inquiry.answer}</p>
                    </div>
                  )}
                </Card>
              ))
            ) : (
              <Card variant="default">
                <div className="text-center py-8">
                  <p className="text-text-gray mb-4">문의 내역이 없습니다</p>
                  <Button
                    onClick={() => setActiveTab('inquiry')}
                    size="sm"
                  >
                    문의하기
                  </Button>
                </div>
              </Card>
            )}
          </div>
        )}
      </main>
      
      <BottomNav />
    </div>
  );
}