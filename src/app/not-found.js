'use client';

import { useRouter } from 'next/navigation';
import Button from '@/components/common/Button';

export default function NotFound() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/home');
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-background-black flex flex-col items-center justify-center px-4">
      <div className="text-center">
        {/* 404 아이콘 */}
        <div className="mb-8">
          <div className="text-8xl text-primary-red mb-4">404</div>
          <div className="text-4xl mb-2">🍱</div>
        </div>

        {/* 메시지 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-text-white mb-4">
            페이지를 찾을 수 없습니다
          </h1>
          <p className="text-text-gray text-base mb-2">
            요청하신 페이지가 존재하지 않거나
          </p>
          <p className="text-text-gray text-base">
            이동되었을 수 있습니다
          </p>
        </div>

        {/* 액션 버튼들 */}
        <div className="space-y-3 w-full max-w-sm">
          <Button
            onClick={handleGoHome}
            className="w-full bg-primary-red text-white"
          >
            홈으로 돌아가기
          </Button>
          
          <Button
            onClick={handleGoBack}
            variant="outline"
            className="w-full border-text-gray text-text-gray hover:bg-text-gray hover:text-background-black"
          >
            이전 페이지로
          </Button>
        </div>

        {/* 추가 안내 */}
        <div className="mt-8 text-text-light-gray text-sm">
          <p>문제가 계속 발생한다면</p>
          <p className="text-primary-red">고객센터에 문의해 주세요</p>
        </div>
      </div>
    </div>
  );
}