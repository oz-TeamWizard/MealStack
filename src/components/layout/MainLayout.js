'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import Link from 'next/link';

export default function MainLayout({ children }) {
  const [showSidePage, setShowSidePage] = useState(true);
  const [activeTab, setActiveTab] = useState('promotion');
  const [errors, setErrors] = useState({});

  const {
    phoneNumber,
    verificationCode,
    isVerificationSent,
    verificationTimer,
    isLoading,
    isAuthenticated,
    user,
    setPhoneNumber,
    setVerificationCode,
    sendVerificationCode,
    verifyAndLogin,
    reset
  } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      setActiveTab('promotion');
    }
  }, [isAuthenticated]);

  // 전화번호 유효성 검사
  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    return phoneRegex.test(phone);
  };

  // 인증번호 유효성 검사
  const validateVerificationCode = (code) => {
    return code.length === 6 && /^\d+$/.test(code);
  };

  // 전화번호 형식 자동 변환
  const handlePhoneNumberChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    
    if (value.length <= 11) {
      if (value.length > 3 && value.length <= 7) {
        value = value.slice(0, 3) + '-' + value.slice(3);
      } else if (value.length > 7) {
        value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7);
      }
      setPhoneNumber(value);
      setErrors({ ...errors, phoneNumber: '' });
    }
  };

  // 인증번호 전송
  const handleSendCode = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      setErrors({ ...errors, phoneNumber: '올바른 전화번호 형식이 아닙니다 (010-0000-0000)' });
      return;
    }
    
    const result = await sendVerificationCode();
    if (!result.success) {
      setErrors({ ...errors, phoneNumber: result.error });
    }
  };

  // 인증번호 입력
  const handleVerificationCodeChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    setVerificationCode(value);
    setErrors({ ...errors, verificationCode: '' });
  };

  // 로그인 처리
  const handleLogin = async () => {
    if (!validateVerificationCode(verificationCode)) {
      setErrors({ ...errors, verificationCode: '6자리 숫자를 입력해주세요' });
      return;
    }
    
    const result = await verifyAndLogin();
    if (result.success) {
      setActiveTab('promotion');
      reset();
    } else {
      setErrors({ ...errors, verificationCode: result.error });
    }
  };

  // 탭 초기화
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'login') {
      reset();
      setErrors({});
    }
  };

  // 타이머 표시 포맷
  const formatTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex min-h-screen bg-background-black">
      
      {/* 사이드 대표 페이지 */}
      {showSidePage && (
        <div className="w-96 bg-gradient-to-br from-background-black via-background-black to-primary-red/10 border-r border-card-gray flex-shrink-0">
          <div className="p-6 h-full overflow-y-auto">
            
            {/* 사이드 페이지 헤더 */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-primary-red text-2xl font-bold">
                🍱 mealStack
              </div>
              <button 
                onClick={() => setShowSidePage(false)}
                className="text-text-gray hover:text-text-white text-xl"
                title="사이드 페이지 숨기기"
              >
                ×
              </button>
            </div>

            {/* 탭 네비게이션 */}
            <div className="flex mb-6 bg-card-gray rounded-lg p-1">
              <button
                onClick={() => handleTabChange('promotion')}
                className={`flex-1 py-2 px-3 rounded-md text-center font-semibold text-sm transition-all ${
                  activeTab === 'promotion' 
                    ? 'bg-primary-red text-white' 
                    : 'text-text-gray hover:text-text-white'
                }`}
              >
                🎉 프로모션
              </button>
              {!isAuthenticated && (
                <button
                  onClick={() => handleTabChange('login')}
                  className={`flex-1 py-2 px-3 rounded-md text-center font-semibold text-sm transition-all ${
                    activeTab === 'login' 
                      ? 'bg-primary-red text-white' 
                      : 'text-text-gray hover:text-text-white'
                  }`}
                >
                  로그인
                </button>
              )}
            </div>

            {/* 프로모션 탭 */}
            {activeTab === 'promotion' && (
              <div className="space-y-4">
                
                {/* 메인 프로모션 배너 */}
                <Card variant="default" className="bg-gradient-to-r from-primary-red to-red-700 text-white text-center p-4">
                  <h1 className="text-lg font-bold mb-2">
                    🔥 런칭 이벤트!
                  </h1>
                  <p className="text-sm mb-2">
                    벌크업 도시락 첫 구독
                    <br />
                    <span className="text-xl font-bold">50% 할인</span>
                  </p>
                  <div className="bg-white/20 rounded-lg p-2 text-xs">
                    📅 2024.08.25 ~ 2024.09.30
                  </div>
                </Card>

                {/* 혜택 안내 */}
                <Card variant="dark">
                  <h3 className="text-sm font-bold text-text-white mb-3">
                    🎁 특별 혜택
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center">
                      <span className="text-primary-red mr-2">✓</span>
                      <span className="text-text-white">첫 달 구독료 50% 할인</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-primary-red mr-2">✓</span>
                      <span className="text-text-white">무료 배송 (평생 혜택)</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-primary-red mr-2">✓</span>
                      <span className="text-text-white">프리미엄 영양 관리 앱</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-primary-red mr-2">✓</span>
                      <span className="text-text-white">언제든지 해지 가능</span>
                    </div>
                  </div>
                </Card>

                {/* 가격 비교 */}
                <Card variant="default" className="bg-card-gray">
                  <h3 className="text-sm font-bold text-text-white mb-3 text-center">
                    💰 가격 혜택
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div>
                      <p className="text-text-gray text-xs mb-1">기존 가격</p>
                      <p className="text-text-gray line-through">₩289,000</p>
                    </div>
                    <div>
                      <p className="text-primary-red text-xs mb-1 font-semibold">런칭 가격</p>
                      <p className="text-primary-red font-bold">₩144,500</p>
                    </div>
                  </div>
                  <div className="text-center mt-3 py-1 bg-primary-red/10 rounded text-xs">
                    <span className="text-primary-red font-bold">144,500원 절약!</span>
                  </div>
                </Card>

                {/* 고객 후기 */}
                <Card variant="dark">
                  <h3 className="text-sm font-bold text-text-white mb-3">
                    👥 베타 테스터 후기
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-card-gray p-3 rounded-lg">
                      <p className="text-text-white text-xs mb-1">
                        "맛도 좋고 단백질도 충분해서 완벽해요!"
                      </p>
                      <p className="text-text-gray text-xs">- 김헬창 (헬스장 3년차)</p>
                    </div>
                    <div className="bg-card-gray p-3 rounded-lg">
                      <p className="text-text-white text-xs mb-1">
                        "배송도 빠르고 포장도 깔끔해서 만족 👍"
                      </p>
                      <p className="text-text-gray text-xs">- 박벌크 (직장인)</p>
                    </div>
                  </div>
                </Card>

                {/* CTA 버튼 */}
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <Link href="/subscription">
                      <Button className="w-full bg-primary-red hover:bg-red-700 py-3 text-sm">
                        🔥 지금 구독하고 50% 할인받기
                      </Button>
                    </Link>
                    <Link href="/products">
                      <Button variant="outline" className="w-full text-sm">
                        더 많은 상품 보기
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Button 
                    onClick={() => handleTabChange('login')}
                    className="w-full bg-primary-red hover:bg-red-700 py-3 text-sm"
                  >
                    🔥 로그인하고 50% 할인받기
                  </Button>
                )}
              </div>
            )}

            {/* 로그인 탭 */}
            {activeTab === 'login' && !isAuthenticated && (
              <div className="space-y-4">
                
                <div className="text-center">
                  <h2 className="text-lg font-bold text-text-white mb-2">
                    로그인하고
                  </h2>
                  <p className="text-primary-red font-semibold">
                    특별 혜택을 받아보세요! 🎁
                  </p>
                </div>

                {/* 전화번호 입력 */}
                <div className="space-y-3">
                  <Input
                    label="전화번호"
                    type="tel"
                    placeholder="010-1234-5678"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    error={errors.phoneNumber}
                    disabled={isVerificationSent}
                  />

                  {/* 인증번호 전송 버튼 */}
                  {!isVerificationSent && (
                    <Button
                      onClick={handleSendCode}
                      loading={isLoading}
                      disabled={!phoneNumber || isLoading}
                      className="w-full"
                    >
                      인증번호 전송
                    </Button>
                  )}

                  {/* 인증번호 입력 */}
                  {isVerificationSent && (
                    <div className="space-y-3">
                      <div className="flex space-x-2">
                        <div className="flex-1">
                          <Input
                            label="인증번호"
                            type="number"
                            placeholder="6자리 숫자"
                            value={verificationCode}
                            onChange={handleVerificationCodeChange}
                            error={errors.verificationCode}
                            maxLength={6}
                          />
                        </div>
                        <div className="w-16 bg-card-gray rounded-lg flex items-end justify-center pb-3">
                          <span className="text-primary-red font-semibold text-xs">
                            {formatTimer(verificationTimer)}
                          </span>
                        </div>
                      </div>

                      <div className="text-center">
                        <p className="text-text-gray text-xs mb-2">
                          인증번호를 받지 못하셨나요?
                        </p>
                        <button
                          onClick={handleSendCode}
                          className="text-primary-red text-xs font-semibold hover:underline"
                          disabled={verificationTimer > 0}
                        >
                          재전송
                        </button>
                      </div>

                      <Button
                        onClick={handleLogin}
                        loading={isLoading}
                        disabled={!verificationCode || verificationCode.length !== 6 || isLoading}
                        className="w-full"
                      >
                        인증 완료하고 혜택 받기 🎁
                      </Button>
                    </div>
                  )}
                </div>

                {/* 혜택 안내 */}
                <Card variant="dark" className="border border-primary-red/20">
                  <div className="text-center mb-2">
                    <span className="text-primary-red font-semibold text-sm">로그인 후 받을 수 있는 혜택</span>
                  </div>
                  <div className="text-text-white text-xs space-y-1">
                    <div className="flex items-center">
                      <span className="text-primary-red mr-2">🎯</span>
                      <span>첫 달 구독료 50% 할인</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-primary-red mr-2">🚚</span>
                      <span>평생 무료 배송</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-primary-red mr-2">📱</span>
                      <span>영양 관리 앱 무료</span>
                    </div>
                  </div>
                </Card>

                <div className="text-text-light-gray text-xs space-y-1 text-center">
                  <p>• 인증번호는 SMS로 발송됩니다</p>
                  <p>• 3분 내에 입력해주세요</p>
                  <p>• 안전하고 간편한 전화번호 인증</p>
                </div>
              </div>
            )}

            {/* 로그인된 경우 사용자 정보 */}
            {isAuthenticated && (
              <div className="mt-6 pt-4 border-t border-card-gray">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-red rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold">
                      {user?.name?.charAt(0) || '🍱'}
                    </span>
                  </div>
                  <p className="text-text-white font-semibold text-sm">{user?.name}님</p>
                  <p className="text-text-gray text-xs">{user?.phone}</p>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* 메인 앱 영역 */}
      <div className="flex-1 relative">
        
        {/* 사이드 페이지 토글 버튼 (사이드 페이지가 숨겨진 경우) */}
        {!showSidePage && (
          <button
            onClick={() => setShowSidePage(true)}
            className="fixed left-4 top-1/2 transform -translate-y-1/2 bg-primary-red text-white p-2 rounded-r-lg shadow-lg z-50 hover:bg-red-700 transition-colors"
            title="프로모션 & 로그인"
          >
            <span className="text-sm font-bold">🍱</span>
          </button>
        )}
        
        {/* 기존 메인 앱 콘텐츠 */}
        {children}
      </div>
    </div>
  );
}