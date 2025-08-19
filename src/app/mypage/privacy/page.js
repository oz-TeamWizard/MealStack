'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import Card from '@/components/common/Card';
import { useAuthStore } from '@/stores/authStore';

// 개인정보처리방침 페이지
export default function PrivacyPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [activeSection, setActiveSection] = useState('overview'); // overview, collection, usage, sharing, security, rights
  
  const sections = [
    { id: 'overview', title: '개요' },
    { id: 'collection', title: '수집 항목' },
    { id: 'usage', title: '이용 목적' },
    { id: 'sharing', title: '제공 및 위탁' },
    { id: 'security', title: '보안 조치' },
    { id: 'rights', title: '정보주체 권리' }
  ];
  
  const privacyContent = {
    overview: {
      title: '개인정보처리방침 개요',
      content: `MealStack(이하 "회사")은 개인정보보호법에 따라 이용자의 개인정보 보호 및 권익을 보호하고 개인정보와 관련한 이용자의 고충을 원활하게 처리할 수 있도록 다음과 같은 처리방침을 두고 있습니다.

개인정보처리방침의 주요 내용:
• 개인정보의 처리 목적, 항목, 보유기간
• 개인정보의 제3자 제공 및 위탁에 관한 사항
• 개인정보 처리업무를 위탁하는 경우
• 이용자의 권리·의무 및 그 행사방법
• 개인정보의 파기절차 및 파기방법
• 개인정보의 안전성 확보조치

개인정보처리방침 시행일자: 2024년 1월 1일
최종 개정일자: 2024년 1월 1일

본 방침은 회사가 운영하는 MealStack 서비스에 적용됩니다.`
    },
    collection: {
      title: '개인정보 수집 항목 및 방법',
      content: `1. 개인정보 수집 항목

가. 필수 수집 항목
• 회원가입 시: 이름, 휴대전화번호, 이메일 주소
• 주문 시: 배송지 주소, 결제 정보
• 고객상담 시: 상담 내용, 처리 결과

나. 선택 수집 항목
• 성별, 생년월일
• 식품 알레르기 정보
• 운동 목표, 체중 정보

다. 자동 수집 항목
• IP 주소, 쿠키, 서비스 이용 기록
• 접속 로그, 방문 페이지
• 앱 사용 패턴, 기기 정보

2. 개인정보 수집 방법

가. 직접 수집
• 회원가입, 주문 과정
• 고객상담, 이벤트 참여
• 설문조사 응답

나. 자동 수집
• 서비스 이용 과정에서 자동 생성
• 앱 및 웹사이트 접속 시
• 결제 과정에서의 거래 정보

3. 개인정보 수집 근거
• 서비스 제공을 위한 계약의 이행
• 법령에서 정한 의무사항 이행
• 정보주체의 동의`
    },
    usage: {
      title: '개인정보 이용 목적 및 보유기간',
      content: `1. 개인정보 이용 목적

가. 서비스 제공
• 식단 배송 서비스 제공
• 구독 서비스 관리
• 주문 처리 및 배송
• 고객 상담 및 불만 처리

나. 마케팅 및 광고
• 신상품 안내
• 이벤트 및 프로모션 정보 제공
• 맞춤형 서비스 제공
• 설문조사 및 통계 분석

다. 서비스 개선
• 서비스 이용 현황 분석
• 시스템 운영 및 보안
• 부정 이용 방지
• 법적 의무 이행

2. 개인정보 보유 및 이용 기간

가. 회원 정보
• 회원 탈퇴 시까지
• 탈퇴 후 6개월간 재가입 방지를 위해 최소 정보 보관

나. 거래 관련 정보
• 계약 또는 청약철회 등에 관한 기록: 5년
• 대금결제 및 재화 등의 공급에 관한 기록: 5년
• 소비자의 불만 또는 분쟁 처리에 관한 기록: 3년

다. 방문 기록
• 웹사이트 방문 기록: 3개월
• 앱 사용 기록: 1년

3. 개인정보 파기 절차 및 방법
• 전자적 파일: 복구 불가능한 방법으로 영구 삭제
• 종이 문서: 분쇄 또는 소각`
    },
    sharing: {
      title: '개인정보의 제3자 제공 및 처리위탁',
      content: `1. 개인정보의 제3자 제공

회사는 원칙적으로 정보주체의 개인정보를 수집·이용 목적으로 명시한 범위 내에서 처리하며, 다음의 경우를 제외하고는 정보주체의 사전 동의 없이는 본래의 목적 범위를 초과하여 처리하거나 제3자에게 제공하지 않습니다.

가. 제3자 제공 현황
• 제공받는 자: 배송업체 (CJ대한통운, 롯데택배 등)
• 제공 목적: 상품 배송
• 제공 항목: 성명, 휴대전화번호, 배송지 주소
• 보유 및 이용기간: 배송 완료 후 즉시 파기

• 제공받는 자: PG사 (토스페이먼츠 등)
• 제공 목적: 결제 처리
• 제공 항목: 주문정보, 결제정보
• 보유 및 이용기간: 거래 완료 후 5년

2. 개인정보 처리업무의 위탁

가. 위탁업체 현황
• 위탁받는 자: AWS(Amazon Web Services)
• 위탁하는 업무: 클라우드 인프라 운영
• 위탁기간: 서비스 종료 시까지

• 위탁받는 자: 나이스페이먼츠
• 위탁하는 업무: 결제대행 서비스
• 위탁기간: 계약 종료 시까지

• 위탁받는 자: 알리고
• 위탁하는 업무: SMS 발송 서비스
• 위탁기간: 계약 종료 시까지

3. 위탁업체 관리
• 개인정보보호 관련 법령 준수 의무화
• 정기적인 보안점검 실시
• 위탁계약서에 개인정보보호 조항 명시`
    },
    security: {
      title: '개인정보 보안 조치',
      content: `1. 기술적 보호조치

가. 개인정보 암호화
• 개인정보는 암호화되어 저장 및 관리됩니다
• 비밀번호는 복호화되지 않는 일방향 암호화하여 저장
• 신용카드 정보 등 민감정보 암호화

나. 해킹 등에 대비한 기술적 대책
• 보안서버(SSL) 구축으로 안전한 데이터 전송
• 침입차단시스템 및 침입탐지시스템 운영
• 보안 패치 및 백신프로그램 설치·운영

다. 접근 통제
• 개인정보에 대한 접근 권한을 최소한의 범위로 제한
• 접근 권한 부여, 변경, 말소에 관한 기준 수립·시행
• 접근 통제시스템 도입 및 운영

2. 관리적 보호조치

가. 개인정보 보호책임자 지정
• 개인정보 보호책임자 및 담당자 지정
• 정기적인 교육 실시

나. 개인정보의 안전한 보관
• 개인정보 취급자의 최소화 및 교육
• 개인정보취급방침의 수립 및 시행

다. 개인정보 보호 모니터링
• 개인정보 접근 기록의 보관 및 위·변조 방지
• 개인정보 보호 감사 실시

3. 물리적 보호조치
• 전산실, 자료보관실 등의 접근통제
• 개인정보가 포함된 서류, 보조저장매체 등의 안전한 보관`
    },
    rights: {
      title: '정보주체의 권리 및 행사방법',
      content: `1. 정보주체의 권리

정보주체는 언제든지 다음과 같은 권리를 행사할 수 있습니다:

가. 개인정보 처리 현황 통지 요구권
• 개인정보 처리 현황에 대한 통지 요구
• 처리 목적, 항목, 기간 등 관련 정보 제공

나. 개인정보 열람권
• 개인정보 처리 현황 열람 요구
• 개인정보 처리정지 요구권 행사 근거 제공

다. 개인정보 정정·삭제권
• 개인정보의 정정 또는 삭제 요구
• 다른 법령에서 개인정보가 수집 대상으로 명시된 경우 삭제 제한

라. 개인정보 처리정지권
• 개인정보 처리 정지 요구
• 처리정지 시 발생할 수 있는 불이익 사전 고지

2. 권리 행사 방법

가. 행사 방법
• 개인정보보호법 시행령 제41조에 따라 서면, 전화, 전자우편, 모사전송 등을 통해 요구
• 회사는 지체 없이 조치하겠습니다

나. 대리인의 권리 행사
• 정보주체의 법정대리인이나 위임을 받은 자는 권리 행사 가능
• 개인정보보호법 시행규칙 별지 제11호 서식에 따른 위임장 제출

3. 손해 배상 및 구제 방법

개인정보 침해로 인한 구제를 받기 위해 개인정보보호위원회, 한국인터넷진흥원 개인정보침해신고센터 등에 분쟁해결이나 상담 등을 신청할 수 있습니다.

• 개인정보보호위원회: privacy.go.kr (국번없이 182)
• 개인정보침해신고센터: privacy.kisa.or.kr (국번없이 118)
• 대검찰청: www.spo.go.kr (국번없이 1301)
• 경찰청: ecrm.cyber.go.kr (국번없이 182)

4. 개인정보 보호책임자 연락처

개인정보 보호책임자
• 성명: 김개인정
• 직책: 개인정보보호팀 팀장  
• 연락처: privacy@mealstack.co.kr
• 전화: 02-1234-5678

개인정보 보호담당자
• 성명: 박보안
• 직책: 개인정보보호팀 담당자
• 연락처: privacy@mealstack.co.kr
• 전화: 02-1234-5679`
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
      <Header title="개인정보처리방침" showBackButton />
      
      <main className="px-4 py-6">
        {/* 중요 안내 */}
        <Card variant="default" className="mb-6 border-l-4 border-primary-red">
          <div className="flex items-start space-x-3">
            <span className="text-primary-red text-xl">🔒</span>
            <div>
              <h3 className="text-text-white font-bold mb-2">개인정보보호 약속</h3>
              <p className="text-text-gray text-sm leading-relaxed">
                MealStack은 고객님의 개인정보를 소중히 생각하며, 
                개인정보보호법 및 관련 법령을 준수하여 안전하게 관리하고 있습니다.
              </p>
            </div>
          </div>
        </Card>
        
        {/* 섹션 탭 */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                activeSection === section.id
                  ? 'bg-primary-red text-white'
                  : 'bg-card-gray text-text-gray hover:text-text-white hover:bg-card-dark-gray'
              }`}
            >
              {section.title}
            </button>
          ))}
        </div>
        
        {/* 개인정보처리방침 내용 */}
        <Card variant="default">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-text-white mb-2">
              {privacyContent[activeSection].title}
            </h2>
            <p className="text-text-gray text-sm">
              시행일자: 2024년 1월 1일 | 최종 개정: 2024년 1월 1일
            </p>
          </div>
          
          <div className="text-text-white text-sm leading-relaxed whitespace-pre-line">
            {privacyContent[activeSection].content}
          </div>
        </Card>
        
        {/* 개인정보 관련 서비스 */}
        <div className="mt-6 space-y-3">
          <h3 className="text-text-white font-bold mb-3">개인정보 관리</h3>
          
          <button
            onClick={() => alert('개인정보 내보내기 기능은 준비중입니다.')}
            className="w-full p-4 bg-card-dark-gray rounded-lg flex items-center justify-between hover:bg-card-gray transition-colors"
          >
            <div className="text-left">
              <p className="text-text-white font-medium">개인정보 다운로드</p>
              <p className="text-text-gray text-sm">내 개인정보를 파일로 다운로드</p>
            </div>
            <span className="text-text-gray">→</span>
          </button>
          
          <button
            onClick={() => {
              if (confirm('정말로 개인정보 삭제를 요청하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
                alert('개인정보 삭제 요청이 접수되었습니다. 고객센터에서 확인 후 처리하겠습니다.');
              }
            }}
            className="w-full p-4 bg-card-dark-gray rounded-lg flex items-center justify-between hover:bg-card-gray transition-colors"
          >
            <div className="text-left">
              <p className="text-text-white font-medium">개인정보 삭제 요청</p>
              <p className="text-text-gray text-sm">내 개인정보 완전 삭제 요청</p>
            </div>
            <span className="text-red-500">⚠️</span>
          </button>
          
          <button
            onClick={() => router.push('/mypage/support')}
            className="w-full p-4 bg-card-dark-gray rounded-lg flex items-center justify-between hover:bg-card-gray transition-colors"
          >
            <div className="text-left">
              <p className="text-text-white font-medium">개인정보 문의</p>
              <p className="text-text-gray text-sm">개인정보 처리 관련 문의하기</p>
            </div>
            <span className="text-text-gray">→</span>
          </button>
        </div>
        
        {/* 개인정보보호 담당자 정보 */}
        <Card variant="default" className="mt-6">
          <h3 className="text-text-white font-bold mb-4">📧 개인정보보호 담당자</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-text-gray">보호책임자</span>
              <span className="text-text-white">김개인정 (개인정보보호팀 팀장)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-gray">이메일</span>
              <span className="text-primary-red">privacy@mealstack.co.kr</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-gray">전화</span>
              <span className="text-primary-red">02-1234-5678</span>
            </div>
          </div>
        </Card>
        
        {/* 개인정보 침해신고 */}
        <Card variant="default" className="mt-6">
          <h3 className="text-text-white font-bold mb-4">🚨 개인정보 침해신고</h3>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-text-white font-medium">개인정보보호위원회</p>
              <p className="text-text-gray">privacy.go.kr (국번없이 182)</p>
            </div>
            <div>
              <p className="text-text-white font-medium">개인정보침해신고센터</p>
              <p className="text-text-gray">privacy.kisa.or.kr (국번없이 118)</p>
            </div>
          </div>
        </Card>
        
        {/* 관련 링크 */}
        <div className="mt-6 space-y-3">
          <button
            onClick={() => router.push('/mypage/terms')}
            className="w-full p-4 bg-card-dark-gray rounded-lg flex items-center justify-between hover:bg-card-gray transition-colors"
          >
            <span className="text-text-white">이용약관</span>
            <span className="text-text-gray">→</span>
          </button>
        </div>
        
        {/* 하단 정보 */}
        <div className="mt-8 text-center text-text-light-gray text-xs space-y-1">
          <p>본 개인정보처리방침은 2024년 1월 1일부터 적용됩니다.</p>
          <p>이전의 개인정보처리방침은 공지사항에서 확인하실 수 있습니다.</p>
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
}