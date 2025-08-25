'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { useAuthStore } from '@/stores/authStore';

export default function PromoLoginPage() {
  const router = useRouter();
  const {
    phoneNumber,
    verificationCode,
    isVerificationSent,
    verificationTimer,
    isLoading,
    isAuthenticated,
    setPhoneNumber,
    setVerificationCode,
    sendVerificationCode,
    verifyAndLogin
  } = useAuthStore();
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/home');
    }
  }, [isAuthenticated, router]);

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
      router.push('/home');
    } else {
      setErrors({ ...errors, verificationCode: result.error });
    }
  };

  // 타이머 표시 포맷
  const formatTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background-black hidden md:flex">
      {/* 왼쪽: 프로모션 영역 */}
      <div className="flex-1 bg-gradient-to-br from-primary-red to-red-800 flex items-center justify-center p-12">
        <div className="max-w-2xl text-white">
          <div className="mb-12 text-center">
            <h1 className="text-6xl font-bold mb-6 leading-tight">
              🍱 MealStack
            </h1>
            <div className="w-32 h-1 bg-white mx-auto mb-8"></div>
            <h2 className="text-3xl font-bold mb-4">
              벌크업 도시락 구독 서비스
            </h2>
            <p className="text-xl opacity-90 leading-relaxed">
              체계적인 영양 관리로 당신의 목표를 달성하세요
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-8 text-center">
              <div className="text-4xl mb-4">💪</div>
              <h3 className="text-xl font-bold mb-3">완벽한 영양 밸런스</h3>
              <p className="text-sm opacity-90 leading-relaxed">
                전문 영양사가 설계한<br />고단백, 저지방 식단으로<br />효율적인 근육량 증가
              </p>
            </div>
            
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-8 text-center">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-bold mb-3">편리한 정기 배송</h3>
              <p className="text-sm opacity-90 leading-relaxed">
                주간/월간 구독으로<br />신선한 도시락을<br />정기적으로 집까지 배송
              </p>
            </div>
            
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-8 text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-3">개인 맞춤 관리</h3>
              <p className="text-sm opacity-90 leading-relaxed">
                목표 체중과 운동량에 따른<br />개인별 맞춤 식단<br />제공
              </p>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">🔥 런칭 기념 특별 혜택</h3>
            <div className="flex justify-center items-center space-x-8 mb-6">
              <div>
                <p className="text-gray-300 text-lg line-through">₩289,000</p>
                <p className="text-sm opacity-75">기존 가격</p>
              </div>
              <div className="text-4xl">→</div>
              <div>
                <p className="text-3xl font-bold text-yellow-300">₩144,500</p>
                <p className="text-sm font-semibold">50% 할인가</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-center">
                <span className="text-yellow-300 mr-2">✓</span>
                <span>첫 달 구독료 50% 할인</span>
              </div>
              <div className="flex items-center justify-center">
                <span className="text-yellow-300 mr-2">✓</span>
                <span>무료 배송 (평생 혜택)</span>
              </div>
              <div className="flex items-center justify-center">
                <span className="text-yellow-300 mr-2">✓</span>
                <span>언제든지 해지 가능</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 오른쪽: 로그인 영역 */}
      <div className="w-[450px] bg-background-black flex flex-col">
        {/* 헤더 */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-text-white">로그인</h2>
            <Link 
              href="/home" 
              className="text-text-gray hover:text-text-white transition-colors text-sm"
            >
              메인으로 이동 →
            </Link>
          </div>
        </div>

        {/* 로그인 폼 */}
        <div className="flex-1 p-8 flex items-center">
          <div className="w-full max-w-sm mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-text-white mb-3">
                특별 혜택을 받으세요! 🎁
              </h3>
              <p className="text-text-gray">
                안전한 주문을 위해 전화번호 인증이 필요해요
              </p>
            </div>

            {/* 로그인 후 상태 */}
            {isAuthenticated ? (
              <div className="space-y-6">
                <div className="bg-card-gray rounded-lg p-6 text-center">
                  <div className="text-green-400 text-4xl mb-4">✓</div>
                  <h4 className="text-xl font-bold text-text-white mb-2">
                    로그인 완료!
                  </h4>
                  <p className="text-text-gray mb-6">
                    이제 특별 혜택을 받을 수 있어요
                  </p>
                  <div className="space-y-3">
                    <Link href="/subscription">
                      <Button className="w-full bg-primary-red hover:bg-red-700 text-lg py-3">
                        🔥 지금 구독하고 50% 할인받기
                      </Button>
                    </Link>
                    <Link href="/home">
                      <Button variant="outline" className="w-full">
                        더 많은 상품 보기
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              /* 로그인 폼 */
              <div className="space-y-6">
                <div>
                  <Input
                    label="전화번호"
                    type="tel"
                    placeholder="010-1234-5678"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    error={errors.phoneNumber}
                    disabled={isVerificationSent}
                  />
                </div>

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

                {isVerificationSent && (
                  <>
                    <div className="flex space-x-3">
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
                      <div className="w-20 bg-card-gray rounded-lg flex items-end justify-center pb-3">
                        <span className="text-primary-red font-semibold text-sm">
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
                        인증번호 재전송
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
                  </>
                )}

                {/* 혜택 안내 */}
                <div className="bg-card-gray rounded-lg p-4 border border-primary-red/20">
                  <div className="text-center mb-3">
                    <span className="text-primary-red font-semibold text-sm">로그인 후 받을 수 있는 혜택</span>
                  </div>
                  <div className="text-text-white text-xs space-y-2">
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
                      <span>영양 관리 앱 무료 이용</span>
                    </div>
                  </div>
                </div>

                <div className="text-text-light-gray text-xs space-y-1 text-center">
                  <p>• 인증번호는 SMS로 발송됩니다</p>
                  <p>• 3분 내에 입력해주세요</p>
                  <p>• 안전하고 간편한 전화번호 인증</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}