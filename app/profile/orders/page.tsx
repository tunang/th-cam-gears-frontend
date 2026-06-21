"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  useMyOrders,
  useOrderPayment,
  type CheckoutResult,
} from "@/src/hooks/use-orders";
import { PaymentInfoDialog } from "@/src/components/payment-info-dialog";
import { Loader2, PackageOpen, ChevronRight, CreditCard } from "lucide-react";
import type { Order } from "@/src/utils/types";
import { submitSepayPayment } from "@/src/utils/sepay";

function formatPrice(price: number | string) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(price));
}

function getStatusInfo(status: string) {
  switch (status) {
    case "PENDING":
      return { label: "Chờ xử lý", color: "bg-yellow-100 text-yellow-800" };
    case "SHIPPING":
      return { label: "Đang giao hàng", color: "bg-blue-100 text-blue-800" };
    case "COMPLETED":
      return { label: "Hoàn thành", color: "bg-green-100 text-green-800" };
    case "CANCELLED":
      return { label: "Đã hủy", color: "bg-red-100 text-red-800" };
    default:
      return { label: status, color: "bg-gray-100 text-gray-800" };
  }
}

export default function MyOrdersPage() {
  const [page, setPage] = React.useState(1);
  const { data, isLoading } = useMyOrders(page, 10);
  const [payingOrder, setPayingOrder] = React.useState<Order | null>(null);

  // When user clicks "Pay", we fetch the payment details for that order
  const { data: paymentData, isFetching: isFetchingPayment } = useOrderPayment(
    payingOrder?.id || "",
    !!payingOrder,
  );

  const checkoutResult: CheckoutResult | null = React.useMemo(() => {
    if (payingOrder && paymentData && !paymentData.paymentLink) {
      return {
        order: payingOrder,
        payment: paymentData,
      };
    }
    return null;
  }, [payingOrder, paymentData]);

  React.useEffect(() => {
    if (payingOrder && paymentData?.paymentLink) {
      submitSepayPayment(paymentData.paymentLink);
    }
  }, [payingOrder, paymentData]);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2
          className="h-8 w-8 animate-spin"
          style={{ color: "var(--p-color-icon-secondary)" }}
        />
      </div>
    );
  }

  const orders = data?.data || [];

  return (
    <div className="mx-auto max-w-4xl p-4 md:p-8">
      <h1
        className="mb-6 text-2xl font-bold"
        style={{ color: "var(--p-color-text)" }}
      >
        Đơn hàng của tôi
      </h1>

      {orders.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center"
          style={{ borderColor: "var(--p-color-border)" }}
        >
          <PackageOpen
            className="mb-4 h-16 w-16"
            style={{ color: "var(--p-color-icon-secondary)" }}
          />
          <h2
            className="mb-2 text-lg font-semibold"
            style={{ color: "var(--p-color-text)" }}
          >
            Bạn chưa có đơn hàng nào
          </h2>
          <p style={{ color: "var(--p-color-text-secondary)" }}>
            Hãy khám phá các sản phẩm của chúng tôi và đặt hàng nhé.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            const isUnpaidSepay =
              order.status === "PENDING" &&
              order.payment?.method === "SEPAY" &&
              order.payment?.status === "PENDING";

            return (
              <div
                key={order.id}
                className="overflow-hidden rounded-xl border shadow-sm transition-shadow hover:shadow-md"
                style={{
                  background: "var(--p-color-bg-surface)",
                  borderColor: "var(--p-color-border-secondary)",
                }}
              >
                {/* Header */}
                <div
                  className="flex items-center justify-between border-b px-5 py-3"
                  style={{
                    background: "var(--p-color-bg-surface-secondary)",
                    borderColor: "var(--p-color-border-secondary)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="font-semibold"
                      style={{ color: "var(--p-color-text)" }}
                    >
                      #{order.orderNumber}
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: "var(--p-color-text-secondary)" }}
                    >
                      {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusInfo.color}`}
                  >
                    {statusInfo.label}
                  </span>
                </div>

                {/* Items */}
                <div className="flex flex-col gap-4 p-5">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div
                        className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border"
                        style={{
                          borderColor: "var(--p-color-border-secondary)",
                        }}
                      >
                        {item.variant?.product?.thumbnailUrl && (
                          <Image
                            src={item.variant.product.thumbnailUrl}
                            alt={item.variant.product.name || "Product"}
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
                          {item.variant?.product?.name}
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: "var(--p-color-text-secondary)" }}
                        >
                          {item.variant?.name}
                        </p>
                        <p
                          className="text-xs font-medium"
                          style={{ color: "var(--p-color-text-secondary)" }}
                        >
                          x {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className="font-semibold text-sm"
                          style={{ color: "var(--p-color-text)" }}
                        >
                          {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div
                  className="flex items-center justify-between border-t px-5 py-4"
                  style={{ borderColor: "var(--p-color-border-secondary)" }}
                >
                  <div>
                    <p
                      className="text-xs"
                      style={{ color: "var(--p-color-text-secondary)" }}
                    >
                      Tổng tiền
                    </p>
                    <p
                      className="text-lg font-bold"
                      style={{ color: "var(--p-color-text-critical)" }}
                    >
                      {formatPrice(order.totalAmount)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {isUnpaidSepay && (
                      <button
                        onClick={() => setPayingOrder(order)}
                        disabled={isFetchingPayment}
                        className="flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50"
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
                        {isFetchingPayment && payingOrder?.id === order.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <CreditCard className="h-4 w-4" />
                        )}
                        Thanh toán ngay
                      </button>
                    )}
                    <Link
                      href={`/profile/orders/${order.id}`}
                      className="flex items-center gap-1 text-sm font-semibold transition-colors"
                      style={{ color: "var(--p-color-text-link)" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color =
                          "var(--p-color-text-link-hover)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color =
                          "var(--p-color-text-link)";
                      }}
                    >
                      Chi tiết <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination (Simplified) */}
      {data?.meta && data.meta.lastPage > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded border px-3 py-1 text-sm disabled:opacity-50"
            style={{
              borderColor: "var(--p-color-border)",
              color: "var(--p-color-text)",
            }}
          >
            Trang trước
          </button>
          <span className="flex items-center px-2 text-sm">
            {page} / {data.meta.lastPage}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(data.meta.lastPage, p + 1))}
            disabled={page === data.meta.lastPage}
            className="rounded border px-3 py-1 text-sm disabled:opacity-50"
            style={{
              borderColor: "var(--p-color-border)",
              color: "var(--p-color-text)",
            }}
          >
            Trang sau
          </button>
        </div>
      )}

      {/* Payment Dialog */}
      <PaymentInfoDialog
        open={!!checkoutResult}
        onOpenChange={(open) => {
          if (!open) setPayingOrder(null);
        }}
        result={checkoutResult}
      />
    </div>
  );
}
