import Link from 'next/link';
import { XCircle } from 'lucide-react';

export default function CheckoutFailedPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-4">
      <div
        className="flex w-full max-w-md flex-col items-center rounded-2xl border p-8 text-center shadow-lg"
        style={{ background: 'var(--p-color-bg-surface)', borderColor: 'var(--p-color-border-secondary)' }}
      >
        <div
          className="mb-6 flex h-20 w-20 items-center justify-center rounded-full"
          style={{ background: 'var(--p-color-bg-surface-critical)' }}
        >
          <XCircle className="h-10 w-10" style={{ color: 'var(--p-color-icon-critical)' }} />
        </div>
        <h1 className="mb-2 text-2xl font-bold" style={{ color: 'var(--p-color-text)' }}>
          Đặt hàng thất bại
        </h1>
        <p className="mb-8 text-sm" style={{ color: 'var(--p-color-text-secondary)' }}>
          Rất tiếc, đã có lỗi xảy ra trong quá trình đặt hàng. Vui lòng thử lại sau hoặc liên hệ bộ phận hỗ trợ khách hàng.
        </p>

        <div className="flex w-full flex-col gap-3">
          <Link
            href="/checkout"
            className="w-full rounded-md py-3 text-sm font-semibold transition-colors"
            style={{ background: 'var(--p-color-bg-fill-brand)', color: 'white' }}
          >
            Thử lại
          </Link>
          <Link
            href="/"
            className="w-full rounded-md border py-3 text-sm font-semibold transition-colors"
            style={{
              background: 'transparent',
              color: 'var(--p-color-text)',
              borderColor: 'var(--p-color-border-secondary)',
            }}
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
