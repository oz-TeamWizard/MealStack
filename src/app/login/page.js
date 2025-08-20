'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { useAuthStore } from '@/stores/authStore';

// 전화번호 인증 로그인 - 개발자 A 담당
export default function LoginPage() {
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
    verifyAndLogin,
    reset
  } = useAuthStore();
  
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    // 이미 로그인된 경우 홈으로 리다이렉트
    if (isAuthenticated) {
      router.replace('/home');
    }
    
    // 컴포넌트 언마운트 시 상태 리셋
    return () => reset();
  }, [isAuthenticated, router, reset]);
  
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
    <div className="min-h-screen bg-background-black">
      <Header title="로그인" showBack={true} />
      
      <main className="px-4 py-6">
        <div className="max-w-md mx-auto">
          {/* 안내 메시지 */}
          <div className="mb-8">
            <h1 className="text-lg font-semibold text-text-white mb-2">
              안전한 주문을 위해
              <br />
              전화번호 인증이 필요해요
            </h1>
          </div>
          
          {/* 전화번호 입력 */}
          <div className="mb-6">
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
          
          {/* 인증번호 전송 버튼 */}
          {!isVerificationSent && (
            <div className="mb-6">
              <Button
                onClick={handleSendCode}
                loading={isLoading}
                disabled={!phoneNumber || isLoading}
                className="w-full"
              >
                인증번호 전송
              </Button>
            </div>
          )}
          
          {/* 인증번호 입력 (인증번호 전송 후 표시) */}
          {isVerificationSent && (
            <>
              <div className="mb-4">
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <Input
                      label="인증번호"
                      type="number"
                      placeholder="6자리 숫자 입력"
                      value={verificationCode}
                      onChange={handleVerificationCodeChange}
                      error={errors.verificationCode}
                      maxLength={6}
                    />
                  </div>
                  <div className="w-20 bg-card-gray rounded-lg flex items-end justify-center pb-3">
                    <span className="text-primary-red font-semibold">
                      {formatTimer(verificationTimer)}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* 재전송 안내 */}
              <div className="mb-6 text-center">
                <p className="text-text-gray text-sm mb-2">
                  인증번호를 받지 못하셨나요?
                </p>
                <button
                  onClick={handleSendCode}
                  className="text-primary-red text-sm font-semibold hover:underline"
                  disabled={verificationTimer > 0}
                >
                  인증번호 재전송
                </button>
              </div>
              
              {/* 인증 완료 버튼 */}
              <div className="mb-6">
                <Button
                  onClick={handleLogin}
                  loading={isLoading}
                  disabled={!verificationCode || verificationCode.length !== 6 || isLoading}
                  className="w-full"
                >
                  인증 완료
                </Button>
              </div>
            </>
          )}
          
          {/* 안내사항 */}
          <div className="text-text-light-gray text-xs space-y-1">
            <p>• 인증번호는 SMS로 발송됩니다</p>
            <p>• 3분 내에 입력해주세요</p>
            <p>• 최대 5회까지 재전송 가능합니다</p>
          </div>
        </div>
      </main>
    </div>
  );
}