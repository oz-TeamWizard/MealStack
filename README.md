# MealStack - 벌크업 도시락 구독 서비스

벌크업 도시락을 간편하게 정기 구독으로 받아보는 웹 애플리케이션입니다.

## 🚀 프로젝트 개요

- **목적**: 벌크업 도시락 판매 및 구독 결제 처리
- **타겟**: 헬스/벌크업에 관심 있는 20-30대 남성
- **핵심 가치**: 간편한 주문, 정기 구독, 영양 관리

## 🛠 기술 스택

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: JavaScript (TypeScript 미사용)
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Font**: Inter

### 브랜드 컬러
- **Primary Red**: #dc2626
- **Background Black**: #111111
- **Card Gray**: #333333, #262626
- **Text**: #ffffff, #cccccc, #999999

## 📱 주요 기능

### 인증 시스템
- 전화번호 SMS 인증 로그인
- 24시간 자동 로그인 유지
- 사전예약 시스템

### 상품 관리
- 벌크업 도시락 상품 진열
- 개별 구매 (1개, 3개, 7개 세트)
- 영양 정보 표시 (단백질, 칼로리 등)

### 구독 서비스
- 주간 구독 (₩65,000/주)
- 월간 프리미엄 구독 (₩289,000/월)
- 구독 일시정지/해지 기능

### 주문 및 결제
- 장바구니 시스템
- 토스페이먼츠 연동 준비
- 배송지 관리

### 마이페이지
- 주문 내역 조회
- 구독 관리
- 프로필 설정

## 📂 프로젝트 구조

```
MealStack/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/
│   │   │   └── login/          # 전화번호 인증 로그인
│   │   ├── home/               # 홈화면
│   │   ├── products/           # 상품 주문
│   │   ├── subscription/       # 구독 페이지
│   │   ├── checkout/           # 결제페이지
│   │   └── mypage/             # 마이페이지
│   ├── components/             # 공통 컴포넌트
│   │   ├── common/             # Button, Input, Card
│   │   ├── layout/             # Header, BottomNav
│   │   └── forms/              # 폼 관련
│   ├── stores/                 # Zustand 스토어
│   │   ├── authStore.js        # 인증 상태
│   │   ├── cartStore.js        # 장바구니
│   │   └── userStore.js        # 사용자 정보
│   ├── lib/                    # 유틸리티
│   │   ├── api.js              # API 호출
│   │   └── utils.js            # 공통 함수
│   └── constants/              # 상수
│       └── colors.js           # 브랜드 컬러
├── public/
│   └── images/                 # 도시락 이미지
└── ...설정 파일들
```

## 👥 개발팀 분업

### 개발자 나종한: 인증 로그인
- [ ] 전화번호/ 카카오 인증 로그인 
- [ ] 마이페이지 
- [ ] 구독 관리 상세 기능

### 개발자 이준복: 주문/결제
- [ ] 상품 주문 페이지 
- [ ] 결제 페이지 
- [ ] 토스페이먼츠 연동

### 개발자 차성욱: 구독/마이페이지
- [ ] 구독 페이지 
- [ ] 홈화면 
- [ ] 사전 예약 기능

## 🚦 개발 현황

### ✅ 완료
- [x] 프로젝트 초기 설정
- [x] 폴더 구조 및 설정 파일
- [x] Zustand 상태 관리 구조
- [x] 공통 UI 컴포넌트 (Button, Input, Card)
- [x] 6개 페이지 기본 레이아웃
- [x] 피그마 디자인 시스템 반영

### 🔄 진행 예정
- [ ] Mock 데이터를 실제 API 연동으로 대체
- [ ] 토스페이먼츠 연동
- [ ] 이미지 최적화 및 업로드
- [ ] 반응형 디자인 최적화
- [ ] 성능 최적화 (이미지, 번들 사이즈)

## 🏃‍♂️ 시작하기

### 설치
```bash
npm install
```

### 개발 서버 실행
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 열기

### 빌드
```bash
npm run build
npm run start
```



## 🎨 디자인 시스템

### 컴포넌트
- **Button**: Primary, Secondary, Outline 변형
- **Input**: 다크 테마, 에러 상태 지원
- **Card**: Product, Subscription, Default 변형
- **Header**: 뒤로가기, 제목, 메뉴 지원
- **BottomNav**: 4개 탭 네비게이션

### 컬러 팔레트
```css
/* Primary */
--primary-red: #dc2626;
--primary-red-hover: #b91c1c;

/* Background */
--background-black: #111111;
--background-dark: #1a1a1a;

/* Text */
--text-white: #ffffff;
--text-gray: #cccccc;
--text-light-gray: #999999;
```

## 📞 연락처

- **프로젝트 관리**: [GitHub Issues](https://github.com/oz-TeamWizard/MealStack/issues)
- **개발팀**: MealStack Frontend Team

---

**MealStack** - 건강한 벌크업의 시작 🥗💪
