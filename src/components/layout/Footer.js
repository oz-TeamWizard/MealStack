"use client";

export default function Footer() {
  return (
    <footer className="bg-background-dark border-t border-card-gray mt-16">
      <div className="px-4 py-8">
        {/* 회사 정보 */}
        <div className="mb-6">
          <h3 className="text-text-white font-bold text-lg mb-4">MealStack</h3>
          <div className="space-y-2 text-sm text-text-gray">
            <p>대표이사: 차성욱</p>
            <p>사업자번호: 123-45-67890</p>
            <p>통신판매신고: 2024-서울강남-12345</p>
            <p>주소: 서울특별시 강남구 언주로 123, 456호</p>
            <p>이메일: mealstackteam@gmail.com</p>
            <p>고객센터: 1588-1234 (평일 9시~18시)</p>
          </div>
        </div>

        {/* 계좌 정보 */}
        <div className="mb-6">
          <h4 className="text-text-white font-semibold mb-2">계좌정보</h4>
          <div className="text-sm text-text-gray space-y-1">
            <p>기업은행 123-456789-01-012</p>
            <p>예금주: 밀스택</p>
          </div>
        </div>

        {/* 링크 섹션 */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-4 text-sm">
            <a
              href="/terms"
              className="text-text-gray hover:text-text-white transition-colors"
            >
              이용약관
            </a>
            <a
              href="/privacy"
              className="text-text-white font-semibold hover:text-primary-red transition-colors"
            >
              개인정보처리방침
            </a>
            <a
              href="/refund"
              className="text-text-gray hover:text-text-white transition-colors"
            >
              환불정책
            </a>
            <a
              href="/shipping"
              className="text-text-gray hover:text-text-white transition-colors"
            >
              배송안내
            </a>
          </div>
        </div>

        {/* 소셜 미디어 */}
        <div className="mb-6">
          <h4 className="text-text-white font-semibold mb-2">소셜 미디어</h4>
          <div className="flex space-x-4">
            <a
              href="#"
              className="text-text-gray hover:text-text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
            </a>
            <a
              href="#"
              className="text-text-gray hover:text-text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
              </svg>
            </a>
            <a
              href="#"
              className="text-text-gray hover:text-text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.219-5.175 1.219-5.175s-.312-.623-.312-1.543c0-1.446.839-2.526 1.884-2.526.888 0 1.317.664 1.317 1.461 0 .889-.565 2.219-.856 3.449-.243 1.028.515 1.864 1.527 1.864 1.833 0 3.244-1.934 3.244-4.724 0-2.471-1.776-4.197-4.317-4.197-2.943 0-4.67 2.209-4.67 4.492 0 .89.344 1.845.774 2.363.085.103.097.194.072.299-.079.33-.254 1.037-.289 1.183-.046.191-.148.232-.343.14-1.282-.595-2.084-2.464-2.084-3.969 0-3.256 2.365-6.24 6.819-6.24 3.583 0 6.369 2.551 6.369 5.96 0 3.554-2.241 6.413-5.353 6.413-1.045 0-2.031-.544-2.367-1.194l-.644 2.45c-.233.89-.864 2.007-1.286 2.686C9.57 23.615 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z" />
              </svg>
            </a>
          </div>
        </div>

        {/* 저작권 */}
        <div className="pt-4 border-t border-card-gray">
          <p className="text-xs text-text-gray">
            © 2025 MealStack. All rights reserved.
          </p>
          <p className="text-xs text-text-gray mt-1">
            건강한 식단 플랜으로 당신의 목표를 응원합니다.
          </p>
        </div>
      </div>
    </footer>
  );
}
