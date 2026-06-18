'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useOrder, useOrderPayment, type CheckoutResult } from '@/src/hooks/use-orders';
import { PaymentInfoDialog } from '@/src/components/payment-info-dialog';
import { Loader2, ArrowLeft, Package, MapPin, CreditCard, CalendarDays, FileText } from 'lucide-react';
import type { Order } from '@/src/utils/types';

function formatPrice(price: number | string) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(price));
}

function getStatusInfo(status: string) {
  switch (status) {
    case 'PENDING':
      return { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800' };
    case 'SHIPPING':
      return { label: 'Đang giao hàng', color: 'bg-blue-100 text-blue-800' };
    case 'COMPLETED':
      return { label: 'Hoàn thành', color: 'bg-green-100 text-green-800' };
    case 'CANCELLED':
      return { label: 'Đã hủy', color: 'bg-red-100 text-red-800' };
    case 'REFUNDED':
      return { label: 'Đã hoàn tiền', color: 'bg-purple-100 text-purple-800' };
    default:
      return { label: status, color: 'bg-gray-100 text-gray-800' };
  }
}

function getPaymentStatusInfo(status?: string) {
  switch (status) {
    case 'PENDING':
      return { label: 'Chờ thanh toán', color: 'bg-yellow-100 text-yellow-800' };
    case 'PAID':
      return { label: 'Đã thanh toán', color: 'bg-green-100 text-green-800' };
    case 'FAILED':
      return { label: 'Thất bại', color: 'bg-red-100 text-red-800' };
    case 'REFUNDED':
      return { label: 'Đã hoàn tiền', color: 'bg-purple-100 text-purple-800' };
    default:
      return { label: 'Chưa thanh toán', color: 'bg-gray-100 text-gray-800' };
  }
}

export default function OrderDetailPage() {
  const { id } = useParams() as { id: string };
  const { data: order, isLoading } = useOrder(id);
  const [payingOrder, setPayingOrder] = React.useState<Order | null>(null);

  const { data: paymentData, isFetching: isFetchingPayment } = useOrderPayment(
    payingOrder?.id || '',
    !!payingOrder
  );

  const checkoutResult: CheckoutResult | null = React.useMemo(() => {
    if (payingOrder && paymentData) {
      return {
        order: payingOrder,
        payment: paymentData,
      };
    }
    return null;
  }, [payingOrder, paymentData]);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: 'var(--p-color-icon-secondary)' }} />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-4xl p-4 md:p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Không tìm thấy đơn hàng</h1>
        <Link href="/profile/orders" className="text-blue-600 hover:underline">
          Quay lại danh sách đơn hàng
        </Link>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.status);
  const paymentStatusInfo = getPaymentStatusInfo(order.payment?.status);
  const isUnpaidSepay = order.status === 'PENDING' && order.payment?.method === 'SEPAY' && order.payment?.status === 'PENDING';

  return (
    <div className="mx-auto max-w-5xl p-4 md:p-8">
      {/* Back button */}
      <Link
        href="/profile/orders"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium transition-colors"
        style={{ color: 'var(--p-color-text-secondary)' }}
      >
        <ArrowLeft className="h-4 w-4" /> Quay lại danh sách đơn hàng
      </Link>

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3" style={{ color: 'var(--p-color-text)' }}>
            Đơn hàng #{order.orderNumber}
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
          </h1>
          <p className="mt-1 text-sm flex items-center gap-1.5" style={{ color: 'var(--p-color-text-secondary)' }}>
            <CalendarDays className="h-4 w-4" />
            {new Date(order.createdAt).toLocaleString('vi-VN')}
          </p>
        </div>

        {isUnpaidSepay && (
          <button
            onClick={() => setPayingOrder(order)}
            disabled={isFetchingPayment}
            className="inline-flex items-center gap-2 rounded-md px-6 py-2.5 font-semibold transition-colors disabled:opacity-50 shadow-sm"
            style={{ background: 'var(--p-color-bg-fill-brand)', color: 'white' }}
            onMouseEnter={(e) => {
              if (!e.currentTarget.disabled) e.currentTarget.style.background = 'var(--p-color-bg-fill-brand-hover)';
            }}
            onMouseLeave={(e) => {
              if (!e.currentTarget.disabled) e.currentTarget.style.background = 'var(--p-color-bg-fill-brand)';
            }}
          >
            {isFetchingPayment && payingOrder?.id === order.id ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <CreditCard className="h-5 w-5" />
            )}
            Thanh toán ngay
          </button>
        )}
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Left Column - Order Items */}
        <div className="flex flex-1 flex-col gap-6">
          <div
            className="rounded-xl border shadow-sm overflow-hidden"
            style={{ background: 'var(--p-color-bg-surface)', borderColor: 'var(--p-color-border-secondary)' }}
          >
            <div
              className="border-b px-6 py-4 flex items-center gap-2"
              style={{ borderColor: 'var(--p-color-border-secondary)', background: 'var(--p-color-bg-surface-secondary)' }}
            >
              <Package className="h-5 w-5" style={{ color: 'var(--p-color-icon)' }} />
              <h2 className="text-lg font-semibold" style={{ color: 'var(--p-color-text)' }}>
                Sản phẩm
              </h2>
            </div>
            <div className="flex flex-col gap-4 p-6">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border" style={{ borderColor: 'var(--p-color-border-secondary)' }}>
                    {item.variant?.product?.thumbnailUrl && (
                      <Image
                        src={item.variant.product.thumbnailUrl}
                        alt={item.variant.product.name || 'Product'}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-center min-w-0">
                    <p className="truncate font-semibold text-base" style={{ color: 'var(--p-color-text)' }}>
                      {item.variant?.product?.name}
                    </p>
                    <p className="mt-1 text-sm" style={{ color: 'var(--p-color-text-secondary)' }}>
                      Phân loại: {item.variant?.name}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-sm font-medium" style={{ color: 'var(--p-color-text-secondary)' }}>
                        Số lượng: {item.quantity}
                      </p>
                      <p className="font-semibold" style={{ color: 'var(--p-color-text)' }}>
                        {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Info */}
        <div className="w-full lg:w-[380px] flex flex-col gap-6">
          {/* Shipping Address */}
          <div
            className="rounded-xl border shadow-sm"
            style={{ background: 'var(--p-color-bg-surface)', borderColor: 'var(--p-color-border-secondary)' }}
          >
            <div
              className="border-b px-6 py-4 flex items-center gap-2"
              style={{ borderColor: 'var(--p-color-border-secondary)' }}
            >
              <MapPin className="h-5 w-5" style={{ color: 'var(--p-color-icon)' }} />
              <h2 className="text-lg font-semibold" style={{ color: 'var(--p-color-text)' }}>
                Thông tin nhận hàng
              </h2>
            </div>
            <div className="p-6">
              <p className="font-semibold mb-1" style={{ color: 'var(--p-color-text)' }}>
                {order.shippingName || 'N/A'}
              </p>
              <p className="text-sm mb-2" style={{ color: 'var(--p-color-text-secondary)' }}>
                {order.shippingPhone || 'N/A'}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--p-color-text-secondary)' }}>
                {order.shippingAddress || 'N/A'}
              </p>
            </div>
          </div>

          {/* Payment Info */}
          <div
            className="rounded-xl border shadow-sm"
            style={{ background: 'var(--p-color-bg-surface)', borderColor: 'var(--p-color-border-secondary)' }}
          >
            <div
              className="border-b px-6 py-4 flex items-center gap-2"
              style={{ borderColor: 'var(--p-color-border-secondary)' }}
            >
              <FileText className="h-5 w-5" style={{ color: 'var(--p-color-icon)' }} />
              <h2 className="text-lg font-semibold" style={{ color: 'var(--p-color-text)' }}>
                Thanh toán
              </h2>
            </div>
            <div className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm" style={{ color: 'var(--p-color-text-secondary)' }}>Phương thức</span>
                <span className="font-medium" style={{ color: 'var(--p-color-text)' }}>
                  {order.payment?.method === 'SEPAY' ? 'Chuyển khoản (SePay)' : order.payment?.method === 'COD' ? 'Thanh toán khi nhận hàng (COD)' : order.payment?.method || 'N/A'}
                </span>
              </div>
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm" style={{ color: 'var(--p-color-text-secondary)' }}>Trạng thái thanh toán</span>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${paymentStatusInfo.color}`}>
                  {paymentStatusInfo.label}
                </span>
              </div>
              
              <div className="my-4 border-t" style={{ borderColor: 'var(--p-color-border-secondary)' }} />
              
              <div className="mb-2 flex items-center justify-between text-sm">
                <span style={{ color: 'var(--p-color-text-secondary)' }}>Tạm tính</span>
                <span style={{ color: 'var(--p-color-text)' }}>{formatPrice(order.totalAmount)}</span>
              </div>
              <div className="mb-4 flex items-center justify-between text-sm">
                <span style={{ color: 'var(--p-color-text-secondary)' }}>Phí vận chuyển</span>
                <span style={{ color: 'var(--p-color-text)' }}>{formatPrice(0)}</span>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <span className="font-semibold" style={{ color: 'var(--p-color-text)' }}>Tổng cộng</span>
                <span className="text-xl font-bold" style={{ color: 'var(--p-color-text-critical)' }}>
                  {formatPrice(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

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
