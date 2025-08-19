'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import Card from '@/components/common/Card';
import { useAuthStore } from '@/stores/authStore';

// 이용약관 페이지
export default function TermsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [activeSection, setActiveSection] = useState('service'); // service, subscription, payment, refund
  
  const sections = [
    { id: 'service', title: '서비스 이용약관' },
    { id: 'subscription', title: '구독 서비스 약관' },
    { id: 'payment', title: '결제 및 환불 약관' },
    { id: 'refund', title: '취소 및 환불 정책' }
  ];
  
  const termsContent = {
    service: {
      title: 'MealStack 서비스 이용약관',
      lastUpdated: '2024년 1월 1일',
      content: `제1조 (목적)
본 약관은 MealStack(이하 "회사")이 제공하는 벌크업 meal delivery 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.

제2조 (정의)
1. "서비스"란 회사가 제공하는 식단 배송 및 관련 서비스를 의미합니다.
2. "이용자"란 회사의 서비스에 접속하여 본 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.
3. "회원"이란 회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사의 서비스를 지속적으로 이용할 수 있는 자를 말합니다.

제3조 (약관의 효력 및 변경)
1. 본 약관은 서비스 화면에 게시하여 공시함으로써 효력을 발생합니다.
2. 회사는 필요한 경우 본 약관을 변경할 수 있으며, 변경된 약관은 공지사항을 통해 공시합니다.
3. 변경된 약관에 동의하지 않는 경우 서비스 이용을 중단할 수 있습니다.

제4조 (서비스의 제공)
1. 회사는 다음과 같은 서비스를 제공합니다:
   - 벌크업 맞춤 식단 배송
   - 영양 상담 서비스
   - 구독 기반 정기 배송
   - 기타 관련 서비스

제5조 (서비스 이용료)
1. 회사가 제공하는 서비스는 기본적으로 유료입니다.
2. 서비스 이용료는 서비스별로 차등 적용됩니다.
3. 결제 방법은 신용카드, 계좌이체 등을 지원합니다.

제6조 (이용자의 의무)
1. 이용자는 서비스 이용 시 다음 행위를 하여서는 안 됩니다:
   - 타인의 정보 도용
   - 허위 정보 제공
   - 서비스 운영 방해
   - 기타 관련 법령 위반 행위

제7조 (서비스의 중단)
회사는 시설의 보수점검, 교체, 고장, 통신두절 또는 운영상 상당한 이유가 있는 경우 서비스의 제공을 일시적으로 중단할 수 있습니다.

제8조 (면책조항)
1. 회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.
2. 회사는 이용자의 귀책사유로 인한 서비스 이용의 장애에 대하여는 책임을 지지 않습니다.`
    },
    subscription: {
      title: '구독 서비스 약관',
      lastUpdated: '2024년 1월 1일',
      content: `제1조 (구독 서비스 개요)
구독 서비스는 정기적으로 식단을 배송받을 수 있는 서비스로, 주간 구독과 월간 구독으로 구분됩니다.

제2조 (구독 요금 및 결제)
1. 구독 요금은 다음과 같습니다:
   - 주간 구독: 65,000원
   - 프리미엄 월 구독: 289,000원
2. 구독 요금은 매월 정기 결제됩니다.
3. 결제일은 최초 구독 시작일을 기준으로 합니다.

제3조 (구독 기간 및 갱신)
1. 구독 서비스는 자동 갱신됩니다.
2. 구독 해지를 원하는 경우 다음 결제일 3일 전까지 신청해야 합니다.
3. 구독 일시정지는 언제든지 가능합니다.

제4조 (배송 일정)
1. 주간 구독: 매주 화요일 배송
2. 월간 구독: 매주 화요일, 금요일 배송
3. 배송 지연 시 사전 안내를 드립니다.

제5조 (구독 변경 및 해지)
1. 구독 플랜 변경은 언제든지 가능합니다.
2. 해지 시 남은 기간에 대해서는 일할 계산하여 환불합니다.
3. 구독 해지는 고객센터 또는 앱에서 신청 가능합니다.

제6조 (구독 서비스 중단)
회사는 다음의 경우 구독 서비스를 중단할 수 있습니다:
1. 배송 불가 지역으로의 이사
2. 연속 3회 이상 배송 실패
3. 결제 수단 오류가 지속되는 경우

제7조 (품질 보장)
1. 신선도 보장: 배송일 기준 3일간 신선함 보장
2. 영양 성분 정확성 보장
3. 품질 문제 발생 시 무료 교체 또는 환불`
    },
    payment: {
      title: '결제 및 환불 약관',
      lastUpdated: '2024년 1월 1일',
      content: `제1조 (결제 방법)
1. 신용카드: 국내 주요 신용카드 및 체크카드
2. 계좌이체: 실시간 계좌이체
3. 간편결제: 카카오페이, 네이버페이, 토스페이
4. 기타 회사가 정한 결제 방법

제2조 (결제 시점)
1. 일반 주문: 주문 완료와 동시에 결제
2. 구독 서비스: 매월 결제일에 자동 결제
3. 결제 실패 시 3회까지 재시도

제3조 (결제 취소)
1. 주문 후 2시간 이내 무료 취소 가능
2. 배송 준비 중 취소 시 취소 수수료 발생
3. 배송 완료 후 취소는 환불 정책에 따름

제4조 (환불 기준)
1. 단순 변심: 상품 수령 후 1일 이내
2. 상품 불량: 상품 수령 후 3일 이내
3. 배송 오류: 즉시 환불 처리

제5조 (환불 방법)
1. 신용카드: 결제 승인 취소 (영업일 기준 3-5일)
2. 계좌이체: 지정 계좌로 환불 (영업일 기준 1-2일)
3. 간편결제: 각 서비스의 정책에 따름

제6조 (환불 불가 사항)
1. 고객 귀책으로 인한 상품 손상
2. 개봉된 냉장/냉동 식품
3. 주문 제작 상품

제7조 (부분 환불)
구독 서비스 중도 해지 시 미사용 기간에 대해 일할 계산하여 환불합니다.`
    },
    refund: {
      title: '취소 및 환불 정책',
      lastUpdated: '2024년 1월 1일',
      content: `제1조 (취소 정책)
1. 주문 취소 가능 시점:
   - 주문 완료 후 2시간 이내: 무료 취소
   - 배송 준비 중: 취소 수수료 2,000원
   - 배송 시작 후: 취소 불가 (환불 정책 적용)

제2조 (환불 사유별 처리)
1. 단순 변심
   - 신선식품 특성상 개봉 전에만 가능
   - 상품 수령 후 1일 이내 신청
   - 왕복 배송비 고객 부담

2. 상품 불량
   - 상품 수령 후 3일 이내 신청
   - 사진 증빙 자료 첨부 필요
   - 전액 환불 + 배송비 회사 부담

3. 배송 오류
   - 잘못된 상품 배송
   - 주문과 다른 수량 배송
   - 즉시 교체 또는 전액 환불

제3조 (환불 처리 절차)
1. 환불 신청 (고객센터 또는 앱)
2. 상품 회수 (상품 불량, 배송 오류의 경우)
3. 환불 승인
4. 환불 처리 (영업일 기준 3-7일)

제4조 (구독 서비스 환불)
1. 구독 해지 신청 시점에 따른 환불:
   - 배송 전 해지: 해당 주문분 전액 환불
   - 배송 후 해지: 다음 결제분부터 적용

2. 미사용 기간 계산:
   - 일할 계산 적용
   - 최소 결제 단위: 주 단위

제5조 (환불 제한 사항)
1. 다음의 경우 환불이 제한됩니다:
   - 상품을 섭취한 경우
   - 포장 훼손으로 재판매가 불가한 경우
   - 고객 요청으로 개별 제작한 상품

제6조 (환불 수수료)
1. 단순 변심으로 인한 환불:
   - 배송비 왕복 6,000원 고객 부담
2. 회사 귀책 사유:
   - 모든 비용 회사 부담

제7조 (특별 환불 정책)
1. 첫 구독 고객: 첫 배송분에 한해 100% 만족 보장
2. 알레르기 반응: 의사 진단서 제출 시 특별 환불 적용
3. 장기 구독 고객: 별도 혜택 적용

제8조 (분쟁 해결)
환불과 관련된 분쟁은 소비자분쟁조정위원회의 조정에 따라 해결합니다.`
    }
  };
  
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
  }, [isAuthenticated, router]);
  
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 loading-spinner"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background-black pb-20">
      <Header title="이용약관" showBackButton />
      
      <main className="px-4 py-6">
        {/* 섹션 탭 */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeSection === section.id
                  ? 'bg-primary-red text-white'
                  : 'bg-card-gray text-text-gray hover:text-text-white hover:bg-card-dark-gray'
              }`}
            >
              {section.title}
            </button>
          ))}
        </div>
        
        {/* 약관 내용 */}
        <Card variant="default">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-text-white mb-2">
              {termsContent[activeSection].title}
            </h2>
            <p className="text-text-gray text-sm">
              최종 업데이트: {termsContent[activeSection].lastUpdated}
            </p>
          </div>
          
          <div className="text-text-white text-sm leading-relaxed whitespace-pre-line">
            {termsContent[activeSection].content}
          </div>
        </Card>
        
        {/* 연락처 정보 */}
        <Card variant="default" className="mt-6">
          <div className="text-center">
            <h3 className="text-text-white font-bold mb-3">문의사항</h3>
            <div className="space-y-2 text-sm text-text-gray">
              <p>약관 관련 문의사항이 있으시면 언제든지 연락주세요.</p>
              <div className="flex justify-center items-center space-x-4">
                <div>
                  <p className="text-text-white font-medium">고객센터</p>
                  <p className="text-primary-red">1588-1234</p>
                </div>
                <div className="text-border-gray">|</div>
                <div>
                  <p className="text-text-white font-medium">이메일</p>
                  <p className="text-primary-red">support@mealstack.co.kr</p>
                </div>
              </div>
              <p className="text-text-light-gray text-xs">
                평일 09:00-18:00 (점심시간 12:00-13:00 제외)
              </p>
            </div>
          </div>
        </Card>
        
        {/* 관련 링크 */}
        <div className="mt-6 space-y-3">
          <button
            onClick={() => router.push('/mypage/privacy')}
            className="w-full p-4 bg-card-dark-gray rounded-lg flex items-center justify-between hover:bg-card-gray transition-colors"
          >
            <span className="text-text-white">개인정보처리방침</span>
            <span className="text-text-gray">→</span>
          </button>
          <button
            onClick={() => router.push('/mypage/support')}
            className="w-full p-4 bg-card-dark-gray rounded-lg flex items-center justify-between hover:bg-card-gray transition-colors"
          >
            <span className="text-text-white">고객센터 문의</span>
            <span className="text-text-gray">→</span>
          </button>
        </div>
        
        {/* 하단 정보 */}
        <div className="mt-8 text-center text-text-light-gray text-xs space-y-1">
          <p>주식회사 MealStack</p>
          <p>대표이사: 김밀스택 | 사업자등록번호: 123-45-67890</p>
          <p>주소: 서울특별시 강남구 테헤란로 123, 4층</p>
          <p>통신판매업신고번호: 2024-서울강남-0123</p>
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
}