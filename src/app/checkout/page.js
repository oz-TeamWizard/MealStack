// src/app/checkout/page.js
"use client";

import { useEffect, useMemo, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loadPaymentWidget } from "@tosspayments/payment-widget-sdk";

import Header from "@/components/layout/Header";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";

import { useAuthStore } from "@/stores/authStore";
import { useCartStore } from "@/stores/cartStore";

/* helpers */
const toNumber = (v) =>
  typeof v === "number" ? v : Number(String(v ?? "").replace(/[^\d]/g, "")) || 0;
const KRW = (n) => `₩${Number(n || 0).toLocaleString()}`;
const isV2Key = (k) => /^(test|live)_gck_/.test(String(k || ""));
const normalizePhone = (v) => String(v || "").replace(/\D/g, "");
const prettyPhone = (v) => {
  const d = normalizePhone(v).slice(0, 11);
  if (d.length < 4) return d;
  if (d.length < 8) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
};
const makeCustomerKey = (user) => {
  const candidate = user?.id || user?.email || user?.phoneNumber || "";
  let key = String(candidate).trim().replace(/[^A-Za-z0-9_.-]/g, "-");
  if (key.length < 2) key = `anon-${Date.now()}`;
  if (key.length > 64) key = key.slice(0, 64);
  return key;
};
const makeTheme = (mode = "dark") => ({
  mode,
  variables: {
    colorPrimary: "#dc2626",
    colorText: mode === "dark" ? "#e5e5e5" : "#111111",
    colorBackground: mode === "dark" ? "#1a1a1a" : "#ffffff",
    borderRadius: "12px",
  },
});
const scrollToWidget = () =>
  document
    .querySelector("#payment-method")
    ?.scrollIntoView({ behavior: "smooth", block: "center" });

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background-black flex items-center justify-center text-white">로딩 중...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}

function CheckoutContent() {
  const router = useRouter();
  const params = useSearchParams();
  const orderType = params.get("type") || "product";

  const { isAuthenticated, user } = useAuthStore();
  const { items, selectedSubscription } = useCartStore();

  const qpSub = {
    name: params.get("name") || undefined,
    price: params.get("price") ? toNumber(params.get("price")) : undefined,
  };

  const subscription =
    orderType === "subscription"
      ? selectedSubscription?.price
        ? selectedSubscription
        : qpSub?.price
        ? qpSub
        : null
      : null;

  const [delivery, setDelivery] = useState({
    name: user?.name || "",
    phone: prettyPhone(user?.phoneNumber || ""),
    address: "",
    detail: "",
    memo: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [widgetReady, setWidgetReady] = useState(false);
  const [paymentRenderError, setPaymentRenderError] = useState("");

  const widgetRef = useRef(null);
  const methodsRef = useRef(null);

  const amount = useMemo(() => {
    if (orderType === "subscription") return toNumber(subscription?.price);
    const cartSum =
      items?.reduce(
        (sum, it) => sum + toNumber(it?.price) * Number(it?.quantity || 1),
        0
      ) || 0;
    return cartSum || 65000;
  }, [orderType, subscription?.price, items]);

  const customerKey = useMemo(() => makeCustomerKey(user), [user]);

  /* guards */
  useEffect(() => {
    if (!isAuthenticated) return; // 프리뷰 편의상 이동 막음
    if (orderType === "product") {
      if (items.length === 0 && amount !== 65000) router.push("/products");
    }
    if (orderType === "subscription") {
      if (!(subscription && toNumber(subscription.price) > 0))
        router.push("/subscription");
    }
  }, [isAuthenticated, orderType, items.length, amount, subscription, router]);

  /* overlay autoscale */
  useEffect(() => {
    const body = document.body;
    const applyScale = () => {
      const overlay = document.querySelector('iframe[src*="pay.tosspayments.com"]');
      const shell = document.querySelector(".app-shell");
      const isDesktop = window.innerWidth > 480;
      if (overlay && isDesktop) {
        const containerWidth = shell
          ? shell.getBoundingClientRect().width
          : Math.min(440, window.innerWidth);
        const overlayWidth = overlay?.getBoundingClientRect().width || 520;
        const scale = Math.min(1, Math.max(0.7, containerWidth / overlayWidth));
        body.style.setProperty("--toss-scale", String(scale));
        body.classList.add("toss-scale-fit");
      } else {
        body.classList.remove("toss-scale-fit");
        body.style.removeProperty("--toss-scale");
      }
    };
    const mo = new MutationObserver(applyScale);
    mo.observe(body, { childList: true, subtree: true });
    window.addEventListener("resize", applyScale);
    applyScale();
    return () => {
      mo.disconnect();
      window.removeEventListener("resize", applyScale);
      body.classList.remove("toss-scale-fit");
      body.style.removeProperty("--toss-scale");
    };
  }, []);

  /* toss widget */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setPaymentRenderError("");
        setWidgetReady(false);
        if (!isAuthenticated && !user) return;
        if (!amount || Number.isNaN(amount) || amount <= 0) {
          setPaymentRenderError("결제 금액이 올바르지 않습니다.");
          return;
        }

        // 강제로 테스트 키 사용하여 확인
        const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";

        const variantDark = process.env.NEXT_PUBLIC_TOSS_VARIANT_KEY_DARK || "";
        const variantLight =
          process.env.NEXT_PUBLIC_TOSS_VARIANT_KEY_LIGHT || "";
        const forced = (params.get("theme") || "").toLowerCase();
        const prefersDark = forced ? forced === "dark" : true;
        const chosenVariant = prefersDark ? variantDark : variantLight;
        const chosenTheme = makeTheme(prefersDark ? "dark" : "light");

        console.log("Loading payment widget with:", {
          clientKey,
          customerKey,
          variantKey: chosenVariant,
          theme: chosenTheme
        });
        
        const widget = await loadPaymentWidget(clientKey, customerKey, {
          ui: chosenVariant
            ? { variantKey: chosenVariant }
            : { theme: chosenTheme },
        });
        if (cancelled) return;
        widgetRef.current = widget;

        const target = document.querySelector("#payment-method");
        if (!target) {
          setPaymentRenderError(
            "결제수단 영역을 찾을 수 없습니다 (#payment-method)."
          );
          return;
        }

        const waitForIframe = (timeout = 1500) =>
          new Promise((resolve) => {
            const started = Date.now();
            const tick = () => {
              const ok =
                target.querySelector("iframe") ||
                target.querySelector("div[data-widget-loaded='true']");
              if (ok) return resolve(true);
              if (Date.now() - started > timeout) return resolve(false);
              requestAnimationFrame(tick);
            };
            tick();
          });

        target.innerHTML = "";
        let pm = widget.renderPaymentMethods(
          "#payment-method",
          { value: Number(amount), currency: "KRW" },
          chosenVariant ? { variantKey: chosenVariant } : { theme: chosenTheme }
        );
        methodsRef.current = pm;
        let ok = await waitForIframe();

        if (!ok && chosenVariant) {
          target.innerHTML = "";
          pm = widget.renderPaymentMethods(
            "#payment-method",
            { value: Number(amount), currency: "KRW" },
            { theme: chosenTheme }
          );
          methodsRef.current = pm;
          ok = await waitForIframe();
        }

        if (!ok) {
          target.innerHTML = "";
          pm = widget.renderPaymentMethods("#payment-method", {
            value: Number(amount),
            currency: "KRW",
          });
          methodsRef.current = pm;
          ok = await waitForIframe();
        }

        if (!ok) {
          setPaymentRenderError(
            "결제 UI 렌더링에 실패했습니다. 관리자 UI 설정/키/광고차단을 확인해 주세요."
          );
          return;
        }

        try {
          if (chosenVariant)
            widget.renderAgreement("#agreement", { variantKey: chosenVariant });
          else widget.renderAgreement("#agreement", { theme: chosenTheme });
        } catch {}

        setWidgetReady(true);
      } catch (e) {
        console.error("Toss widget load error:", e);
        setPaymentRenderError(
          "결제 모듈 로드 실패. 네트워크/키/CSP/광고차단을 확인하세요."
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, amount, customerKey, params, user]);

  useEffect(() => {
    try {
      methodsRef.current?.updateAmount({
        value: Number(amount),
        currency: "KRW",
      });
    } catch {}
  }, [amount]);

  /* business */
  const formValid = () => {
    const p = normalizePhone(delivery.phone);
    if (!(p.length >= 10 && p.length <= 11)) return false;
    if (!delivery.name || !delivery.address) return false;
    return amount > 0;
  };

  const pay = async () => {
    if (!formValid()) {
      alert("필수 정보를 모두 입력해주세요.");
      return;
    }
    if (!widgetRef.current) {
      alert("결제 위젯이 아직 준비되지 않았습니다.");
      return;
    }
    if (!widgetReady) {
      alert("결제수단 UI가 아직 준비 중입니다. 잠시 후 다시 시도해주세요.");
      scrollToWidget();
      return;
    }

    setIsProcessing(true);
    try {
      const orderId = `order-${Date.now()}`;
      const orderName =
        orderType === "subscription"
          ? subscription?.name || "구독 상품"
          : items?.[0]?.name
          ? items.length > 1
            ? `${items?.[0]?.name} 외 ${items.length - 1}건`
            : items?.[0]?.name
          : "도시락 주문";

      await widgetRef.current.requestPayment({
        orderId,
        orderName,
        successUrl:
          process.env.NEXT_PUBLIC_TOSS_SUCCESS_URL ||
          `${window.location.origin}/checkout/success`,
        failUrl:
          process.env.NEXT_PUBLIC_TOSS_FAIL_URL ||
          `${window.location.origin}/checkout/fail`,
        customerEmail: user?.email || undefined,
        customerName: delivery.name,
        customerMobilePhone: normalizePhone(delivery.phone),
        metadata: {
          address: delivery.address,
          detail: delivery.detail,
          memo: delivery.memo,
          type: orderType,
        },
      });
    } catch (e) {
      const code = e?.code || "";
      const msg = String(e?.message || "");
      if (code === "NOT_RENDERED_PAYMENT_METHODS_UI") {
        setPaymentRenderError(
          "결제 UI가 아직 준비되지 않았습니다. 1~2초 후 다시 시도해주세요."
        );
        scrollToWidget();
      } else if (
        code === "NOT_SELECTED_PAYMENT_METHOD" ||
        /결제수단이 아직 선택되지 않았어요|카드 결제 정보를 선택/.test(msg)
      ) {
        alert("아래 결제수단(카드/간편결제)에서 하나를 선택한 후 다시 시도해주세요.");
        scrollToWidget();
      } else if (code === "INVALID_SUCCESS_OR_FAIL_URL") {
        alert(
          "성공/실패 URL이 유효하지 않습니다. NEXT_PUBLIC_TOSS_SUCCESS_URL/FAIL_URL과 허용 Origin을 확인해주세요."
        );
      } else {
        console.error("requestPayment error:", e);
        setPaymentRenderError("결제 요청 실패. 다시 시도해 주세요.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  /* titles & classes */
  const title =
    orderType === "subscription"
      ? subscription?.name || "구독 상품"
      : items?.[0]?.name
      ? items.length > 1
        ? `${items?.[0]?.name} 외 ${items.length - 1}건`
        : items?.[0]?.name
      : "도시락 주문";

  const inputClass =
    "w-full bg-[#262626] border border-[#3a3a3a] text-text-white placeholder:text-text-light-gray rounded-xl px-4 py-3 focus:outline-none focus:border-primary-red focus:ring-2 focus:ring-primary-red";

  // 카드 클래스 (사용되는 것만 유지)
  const cardBaseDark = "p-4 mb-6 rounded-2xl bg-[#1a1a1a]";
  const cardClassGray = "p-4 mb-6 rounded-2xl bg-[#333333] border border-[#dc2626]";
  const cardNoBorder = cardBaseDark; // 배송 안내 카드(테두리 없음)

  const isBtnDisabled = !formValid() || isProcessing || !widgetReady;
  const btnBase =
    "w-full h-12 rounded-lg font-semibold text-[15px] transition-colors";
  const btnEnabled =
    "bg-primary-red hover:bg-primary-red-hover text-text-white";
  // 회색 버튼(비활성 시)
  const btnDisabled = "bg-[#565a60] text-[#ffffff] cursor-not-allowed";

  return (
    <div className="min-h-screen bg-background-black">
      <Header title="주문/결제" showBack />

      <main className="px-4 py-4 pb-6">
        {/* 결제 총액 — 문장/크기/색/레이아웃 */}
        <div className={cardClassGray}>
          <h3 className="text-base font-semibold text-text-white mb-3">결제 총액</h3>

          <div className="flex items-center justify-between">
            <span className="text-text-white">
              {title} <span className="text-text-gray"></span>
            </span>
            <span className="text-text-white font-medium">{KRW(amount)}</span>
          </div>

          <div className="my-3 h-px bg-[#666666]" />

          <div className="flex items-center justify-between">
            <span className="text-text-gray">배송비</span>
            <span className="text-primary-red font-semibold">무료</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-text-white font-bold">총 결제액</span>
            <span className="text-primary-red text-lg font-bold">
              {KRW(amount)}원
            </span>
          </div>

          {paymentRenderError && (
            <p className="mt-3 text-sm text-amber-300">{paymentRenderError}</p>
          )}
        </div>

        {/* 결제 방법 선택 — Toss v2(gck) 위젯 */}
        <div className={cardClassGray}>
          <h3 className="text-base font-semibold mb-3">결제 방법 선택</h3>
          <div className="mb-3 rounded-md bg-[#f9f3f1] text-[#5b2a22] text-xs p-3">
            테스트 환경 – 실제로 결제되지 않습니다.
          </div>
          <div className="rounded-md bg-white p-3">
            <div id="payment-method" />
            <div id="agreement" className="mt-3" />
          </div>
          {!widgetReady && !paymentRenderError && (
            <p className="text-sm text-text-gray mt-3">결제 모듈을 불러오고 있습니다…</p>
          )}
        </div>

        {/* 배송 정보 */}
        <div className={cardClassGray}>
          <h3 className="text-base font-semibold text-text-white mb-3">배송 정보</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-text-white mb-1">
                받는분
              </label>
              <Input
                placeholder="받는분 성함을 입력해주세요"
                value={delivery.name}
                onChange={(e) =>
                  setDelivery((p) => ({ ...p, name: e.target.value }))
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-white mb-1">
                전화번호
              </label>
              <Input
                placeholder="전화번호를 입력해주세요"
                value={delivery.phone}
                inputMode="numeric"
                onChange={(e) =>
                  setDelivery((p) => ({ ...p, phone: prettyPhone(e.target.value) }))
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-white mb-1">
                주소
              </label>
              <Input
                placeholder="배송 받으실 주소를 입력해주세요"
                value={delivery.address}
                onChange={(e) =>
                  setDelivery((p) => ({ ...p, address: e.target.value }))
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-white mb-1">
                상세주소
              </label>
              <Input
                placeholder="상세주소를 입력해주세요"
                value={delivery.detail}
                onChange={(e) =>
                  setDelivery((p) => ({ ...p, detail: e.target.value }))
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-white mb-1">
                배송 메모 (선택)
              </label>
              <Input
                placeholder="배송 시 요청사항"
                value={delivery.memo}
                onChange={(e) =>
                  setDelivery((p) => ({ ...p, memo: e.target.value }))
                }
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* 배송 안내 — 보더 제거 */}
        <div className={cardNoBorder} style={{ border: "none", borderWidth: 0 }}>
          <h3 className="text-base font-semibold text-text-white mb-2">배송 안내</h3>
          <ul className="text-xs text-text-gray leading-5 space-y-1">
            <li className="flex items-start gap-2">
              <span className="text-text-gray">•</span>
              <span>주문 완료 후 1-2일 내 배송됩니다</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-text-gray">•</span>
              <span>냉동 배송으로 신선하게 배달됩니다</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-text-gray">•</span>
              <span>부재 시 안전한 장소에 보관 배송됩니다</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-text-gray">•</span>
              <span>배송 관련 문의: 고객센터 1588-0000</span>
            </li>
          </ul>
        </div>

        {/* --- 이미지처럼: 상단 구분선 + 회색 버튼 영역 --- */}
        <div className="border-t border-[#2a2a2a] mt-2 pt-4 pb-0">
          <Button
            onClick={pay}
            loading={isProcessing}
            disabled={isBtnDisabled}
            className={`${btnBase} ${isBtnDisabled ? btnDisabled : btnEnabled}`}
          >
            {isProcessing
              ? "결제 준비 중..."
              : `${KRW(amount)}원 결제하기`}
          </Button>
        </div>
      </main>
    </div>
  );
}
