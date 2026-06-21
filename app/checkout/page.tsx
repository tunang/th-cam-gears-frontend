"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/src/hooks/use-cart";
import { useAddresses } from "@/src/hooks/use-address";
import { useCheckout, useSavePaymentLink } from "@/src/hooks/use-orders";
import {
  prepareSepayCheckout,
  type SepayCheckoutData,
} from "@/app/actions/checkout";
import { MapPin, CreditCard, Loader2, Plus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

export default function CheckoutPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: cart, isLoading: isLoadingCart } = useCart();
  const { data: addresses, isLoading: isLoadingAddresses } = useAddresses();
  const checkoutMut = useCheckout();
  const savePaymentLinkMut = useSavePaymentLink();

  const [selectedAddressId, setSelectedAddressId] = React.useState<string>("");
  const [paymentMethod, setPaymentMethod] = React.useState<"SEPAY" | "COD">(
    "SEPAY",
  );
  const [note, setNote] = React.useState("");
  const [sepayData, setSepayData] = React.useState<SepayCheckoutData | null>(
    null,
  );
  const sepayFormRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (addresses && addresses.length > 0 && !selectedAddressId) {
      const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
      // The initial address arrives asynchronously from React Query.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedAddressId(defaultAddr.id);
    }
  }, [addresses, selectedAddressId]);

  const items = cart?.items || [];
  const totalAmount = items.reduce(
    (sum, item) => sum + Number(item.variant.price) * item.quantity,
    0,
  );

  const handleCheckout = async () => {
    const address = addresses?.find((a) => a.id === selectedAddressId);
    if (!address) {
      alert("Vui lòng chọn địa chỉ giao hàng");
      return;
    }

    checkoutMut.mutate(
      {
        shippingName: address.name,
        shippingPhone: address.phone,
        shippingAddress: `${address.address}`,
        paymentMethod,
        note,
      },
      {
        onSuccess: async (data) => {
          queryClient.invalidateQueries({ queryKey: ["cart"] });
          if (paymentMethod === "SEPAY") {
            try {
              const sepayCheckout = await prepareSepayCheckout({
                orderInvoiceNumber: data.order.orderNumber,
                orderAmount: Number(data.payment.amount),
                orderDescription: `Thanh toan don hang ${data.order.orderNumber}`,
              });
              await savePaymentLinkMut.mutateAsync({
                orderId: data.order.id,
                paymentLink: sepayCheckout.paymentLink,
              });
              setSepayData(sepayCheckout);
            } catch {
              alert("Không thể khởi tạo thanh toán SePay. Vui lòng thử lại.");
            }
          } else {
            router.push("/checkout/success");
          }
        },
        onError: (err) => {
          alert("Có lỗi xảy ra: " + err.message);
        },
      },
    );
  };

  // Auto-submit the SePay form once data is ready
  React.useEffect(() => {
    if (sepayData && sepayFormRef.current) {
      sepayFormRef.current.submit();
    }
  }, [sepayData]);

  if (isLoadingCart || isLoadingAddresses) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2
          className="h-8 w-8 animate-spin"
          style={{ color: "var(--p-color-icon-secondary)" }}
        />
      </div>
    );
  }

  if (items.length === 0 && !sepayData) {
    return (
      <div className="mx-auto max-w-lg p-8 text-center">
        <h1 className="mb-4 text-2xl font-bold">Giỏ hàng trống</h1>
        <p className="mb-8" style={{ color: "var(--p-color-text-secondary)" }}>
          Bạn chưa có sản phẩm nào trong giỏ hàng để thanh toán.
        </p>
        <Link
          href="/"
          className="inline-flex rounded-md px-6 py-3 font-semibold transition-colors"
          style={{ background: "var(--p-color-bg-fill-brand)", color: "white" }}
        >
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-4 md:p-8">
      <h1
        className="mb-8 text-2xl font-bold"
        style={{ color: "var(--p-color-text)" }}
      >
        Thanh toán
      </h1>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Left Column */}
        <div className="flex flex-1 flex-col gap-6">
          {/* Address Section */}
          <div
            className="rounded-xl border p-6 shadow-sm"
            style={{
              background: "var(--p-color-bg-surface)",
              borderColor: "var(--p-color-border-secondary)",
            }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2
                className="flex items-center gap-2 text-lg font-semibold"
                style={{ color: "var(--p-color-text)" }}
              >
                <MapPin className="h-5 w-5" /> Địa chỉ giao hàng
              </h2>
              <Link
                href="/profile/address"
                className="flex items-center gap-1 text-sm font-medium transition-colors"
                style={{ color: "var(--p-color-text-link)" }}
              >
                <Plus className="h-4 w-4" /> Thêm địa chỉ mới
              </Link>
            </div>

            {addresses && addresses.length > 0 ? (
              <div className="flex flex-col gap-3">
                {addresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={`flex cursor-pointer gap-3 rounded-lg border p-4 transition-colors ${
                      selectedAddressId === addr.id
                        ? "border-[var(--p-color-border-focus)] bg-[var(--p-color-bg-surface-info)]"
                        : ""
                    }`}
                    style={{
                      borderColor:
                        selectedAddressId === addr.id
                          ? "var(--p-color-border-focus)"
                          : "var(--p-color-border)",
                    }}
                  >
                    <input
                      type="radio"
                      name="address"
                      value={addr.id}
                      checked={selectedAddressId === addr.id}
                      onChange={() => setSelectedAddressId(addr.id)}
                      className="mt-1 h-4 w-4"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className="font-semibold"
                          style={{ color: "var(--p-color-text)" }}
                        >
                          {addr.name}
                        </span>
                        <span
                          className="text-sm font-medium"
                          style={{ color: "var(--p-color-text-secondary)" }}
                        >
                          {addr.phone}
                        </span>
                        {addr.isDefault && (
                          <span
                            className="rounded px-2 py-0.5 text-[10px] font-bold uppercase"
                            style={{
                              background: "var(--p-color-bg-fill-success)",
                              color: "white",
                            }}
                          >
                            Mặc định
                          </span>
                        )}
                      </div>
                      <p
                        className="mt-1 text-sm"
                        style={{ color: "var(--p-color-text-secondary)" }}
                      >
                        {addr.address}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              <div
                className="rounded-lg border border-dashed p-6 text-center"
                style={{ borderColor: "var(--p-color-border)" }}
              >
                <p
                  className="mb-2 text-sm"
                  style={{ color: "var(--p-color-text-secondary)" }}
                >
                  Bạn chưa có địa chỉ giao hàng nào
                </p>
                <Link
                  href="/profile/address"
                  className="inline-flex rounded-md px-4 py-2 text-sm font-semibold transition-colors"
                  style={{
                    background: "var(--p-color-bg-fill-brand)",
                    color: "white",
                  }}
                >
                  Thêm địa chỉ
                </Link>
              </div>
            )}
          </div>

          {/* Payment Method Section */}
          <div
            className="rounded-xl border p-6 shadow-sm"
            style={{
              background: "var(--p-color-bg-surface)",
              borderColor: "var(--p-color-border-secondary)",
            }}
          >
            <h2
              className="mb-4 flex items-center gap-2 text-lg font-semibold"
              style={{ color: "var(--p-color-text)" }}
            >
              <CreditCard className="h-5 w-5" /> Phương thức thanh toán
            </h2>
            <div className="flex flex-col gap-3">
              <label
                className={`flex cursor-pointer gap-3 rounded-lg border p-4 transition-colors ${
                  paymentMethod === "SEPAY"
                    ? "border-[var(--p-color-border-focus)] bg-[var(--p-color-bg-surface-info)]"
                    : ""
                }`}
                style={{
                  borderColor:
                    paymentMethod === "SEPAY"
                      ? "var(--p-color-border-focus)"
                      : "var(--p-color-border)",
                }}
              >
                <input
                  type="radio"
                  name="payment"
                  value="SEPAY"
                  checked={paymentMethod === "SEPAY"}
                  onChange={() => setPaymentMethod("SEPAY")}
                  className="mt-1 h-4 w-4"
                />
                <div>
                  <p
                    className="font-semibold"
                    style={{ color: "var(--p-color-text)" }}
                  >
                    Chuyển khoản ngân hàng (SEPAY)
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: "var(--p-color-text-secondary)" }}
                  >
                    Quét mã QR để chuyển khoản tự động
                  </p>
                </div>
              </label>

              <label
                className={`flex cursor-pointer gap-3 rounded-lg border p-4 transition-colors ${
                  paymentMethod === "COD"
                    ? "border-[var(--p-color-border-focus)] bg-[var(--p-color-bg-surface-info)]"
                    : ""
                }`}
                style={{
                  borderColor:
                    paymentMethod === "COD"
                      ? "var(--p-color-border-focus)"
                      : "var(--p-color-border)",
                }}
              >
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                  className="mt-1 h-4 w-4"
                />
                <div>
                  <p
                    className="font-semibold"
                    style={{ color: "var(--p-color-text)" }}
                  >
                    Thanh toán khi nhận hàng (COD)
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: "var(--p-color-text-secondary)" }}
                  >
                    Thanh toán bằng tiền mặt khi giao hàng
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="w-full lg:w-[380px]">
          <div
            className="sticky top-6 rounded-xl border p-6 shadow-sm"
            style={{
              background: "var(--p-color-bg-surface)",
              borderColor: "var(--p-color-border-secondary)",
            }}
          >
            <h2
              className="mb-4 text-lg font-semibold"
              style={{ color: "var(--p-color-text)" }}
            >
              Đơn hàng của bạn
            </h2>

            <div className="mb-6 flex flex-col gap-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div
                    className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border"
                    style={{ borderColor: "var(--p-color-border-secondary)" }}
                  >
                    {item.variant.product.thumbnailUrl && (
                      <Image
                        src={item.variant.product.thumbnailUrl}
                        alt={item.variant.product.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col min-w-0">
                    <p
                      className="truncate font-semibold text-sm"
                      style={{ color: "var(--p-color-text)" }}
                    >
                      {item.variant.product.name}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "var(--p-color-text-secondary)" }}
                    >
                      {item.variant.name} x {item.quantity}
                    </p>
                    <p
                      className="mt-1 font-semibold text-sm"
                      style={{ color: "var(--p-color-text)" }}
                    >
                      {formatPrice(Number(item.variant.price))}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-6">
              <label
                className="mb-2 block text-sm font-medium"
                style={{ color: "var(--p-color-text)" }}
              >
                Ghi chú đơn hàng
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ví dụ: Giao hàng giờ hành chính..."
                className="w-full rounded-md border p-3 text-sm focus:outline-none"
                style={{
                  background: "var(--p-color-input-bg-surface)",
                  borderColor: "var(--p-color-input-border)",
                }}
                rows={3}
              />
            </div>

            <div
              className="border-t pt-4"
              style={{ borderColor: "var(--p-color-border-secondary)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <span
                  className="font-semibold"
                  style={{ color: "var(--p-color-text)" }}
                >
                  Tổng cộng
                </span>
                <span
                  className="text-xl font-bold"
                  style={{ color: "var(--p-color-text-critical)" }}
                >
                  {formatPrice(totalAmount)}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={
                  checkoutMut.isPending ||
                  savePaymentLinkMut.isPending ||
                  !selectedAddressId
                }
                className="flex w-full items-center justify-center rounded-md py-3 font-semibold transition-colors disabled:opacity-50"
                style={{
                  background: "var(--p-color-bg-fill-brand)",
                  color: "white",
                }}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled)
                    e.currentTarget.style.background =
                      "var(--p-color-bg-fill-brand-hover)";
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.disabled)
                    e.currentTarget.style.background =
                      "var(--p-color-bg-fill-brand)";
                }}
              >
                {checkoutMut.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Đang xử
                    lý...
                  </>
                ) : paymentMethod === "SEPAY" ? (
                  "Thanh toán qua SePay"
                ) : (
                  "Đặt hàng"
                )}
              </button>

              {/* Hidden SePay form — auto-submitted via useEffect */}
              {sepayData && (
                <form
                  ref={sepayFormRef}
                  action={sepayData.checkoutUrl}
                  method="POST"
                  className="hidden"
                >
                  {Object.entries(sepayData.formFields).map(([field, value]) =>
                    value !== undefined ? (
                      <input
                        key={field}
                        type="hidden"
                        name={field}
                        value={String(value)}
                      />
                    ) : null,
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
