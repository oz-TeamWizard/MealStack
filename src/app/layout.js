import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MealStack - 벌크업 도시락 구독 서비스",
  description: "벌크업 도시락을 간편하게 정기 구독으로 받아보세요",
  keywords: "벌크업, 도시락, 구독, 헬스, 단백질",
  authors: [{ name: "MealStack Team" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className={`${inter.className} text-text-white`}>
        <div className="min-h-screen max-w-md mx-auto">{children}</div>
      </body>
    </html>
  );
}
