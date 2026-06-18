import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

export default function CheckoutSuccessPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-4">
      <div
        className="flex w-full max-w-md flex-col items-center rounded-2xl border p-8 text-center shadow-lg"
        style={{ background: 'var(--p-color-bg-surface)', borderColor: 'var(--p-color-border-secondary)' }}
      >
        <div
          className="mb-6 flex h-20 w-20 items-center justify-center rounded-full"
          style={{ background: 'var(--p-color-bg-surface-success)' }}
        >
          <CheckCircle2 className="h-10 w-10" style={{ color: 'var(--p-color-icon-success)' }} />
        </div>
        <h1 className="mb-2 text-2xl font-bold" style={{ color: 'var(--p-color-text)' }}>
          Đặt hàng thành công!
        </h1>
        <p className="mb-8 text-sm" style={{ color: 'var(--p-color-text-secondary)' }}>
          Cảm ơn bạn đã mua sắm tại TH Cam Gears. Đơn hàng của bạn đang được xử lý và sẽ sớm được giao đến bạn.
        </p>

        <div className="flex w-full flex-col gap-3">
          {/* We will route to profile orders in the future, for now back to home */}
          <Link
            href="/"
            className="w-full rounded-md py-3 text-sm font-semibold transition-colors"
            style={{ background: 'var(--p-color-bg-fill-brand)', color: 'white' }}
          >
            Về trang chủ
          </Link>
          <Link
            href="/profile/orders"
            className="w-full rounded-md border py-3 text-sm font-semibold transition-colors"
            style={{
              background: 'transparent',
              color: 'var(--p-color-text)',
              borderColor: 'var(--p-color-border-secondary)',
            }}
          >
            Theo dõi đơn hàng
          </Link>
        </div>
      </div>
    </div>
  );
}
