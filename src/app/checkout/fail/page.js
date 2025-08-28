"use client";
import { useSearchParams } from "next/navigation";

export default function FailPage() {
  const params = useSearchParams();
  return (
    <div className="p-6 text-text-white">
      <h1 className="text-2xl font-bold mb-3">결제가 취소/실패했습니다</h1>
      <p className="text-text-gray">
        사유: {params.get("message") || "사용자 취소 또는 오류"}
      </p>
    </div>
  );
}
