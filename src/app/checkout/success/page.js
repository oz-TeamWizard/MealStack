// src/app/checkout/success/page.js
"use client";

import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="p-6 min-h-[70vh] text-center">
      <h1 className="text-2xl font-bold text-text-white mb-3">
        결제가 완료되었습니다 🎉
      </h1>
      <p className="text-text-gray mb-8">
        마이페이지에서 주문 내역을 확인하세요.
      </p>

      <div className="flex justify-center">
        <Link
          href="/"
          className="w-full max-w-[240px] inline-flex items-center justify-center px-4 py-3
                     rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold shadow-sm
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500
                     transition-colors"
        >
          홈으로 가기
        </Link>
      </div>
    </div>
  );
}
