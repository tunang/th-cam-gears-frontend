'use client';

import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import Image from 'next/image';
import { Copy, CheckCheck, X } from 'lucide-react';
import type { CheckoutResult } from '@/src/hooks/use-orders';

interface PaymentInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: CheckoutResult | null;
}

export function PaymentInfoDialog({ open, onOpenChange, result }: PaymentInfoDialogProps) {
  const [copiedField, setCopiedField] = React.useState<string | null>(null);

  if (!result) return null;

  const { payment, order } = result;
  const amount = Number(payment.amount);

  const qrUrl = `https://qr.sepay.vn/img?bank=${encodeURIComponent(
    payment.bankName,
  )}&acc=${encodeURIComponent(payment.accountNumber)}&template=compact&amount=${amount}&des=${encodeURIComponent(
    payment.content,
  )}`;

  async function copyToClipboard(text: string, field: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // ignore
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-[fade-in_0.2s_ease]" />
        <Dialog.Content
          className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-xl p-6 shadow-2xl data-[state=open]:animate-[scale-in_0.2s_ease]"
          style={{ background: 'var(--p-color-bg-surface)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-xl font-bold" style={{ color: 'var(--p-color-text)' }}>
              Thanh toán đơn hàng
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                className="flex h-8 w-8 items-center justify-center rounded-md transition-colors"
                style={{ color: 'var(--p-color-icon)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--p-color-bg-surface-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          <Dialog.Description className="mb-4 text-sm" style={{ color: 'var(--p-color-text-secondary)' }}>
            Vui lòng chuyển khoản theo thông tin bên dưới. Đơn hàng sẽ được xác nhận tự động sau khi nhận được tiền.
          </Dialog.Description>

          {/* QR Code */}
          <div className="flex justify-center py-4">
            <div
              className="overflow-hidden rounded-xl border shadow-sm"
              style={{ borderColor: 'var(--p-color-border-secondary)' }}
            >
              <Image
                src={qrUrl}
                alt="QR Chuyển khoản"
                width={200}
                height={200}
                className="h-48 w-48 object-contain"
                unoptimized
              />
            </div>
          </div>

          {/* Bank info */}
          <div className="flex flex-col gap-3 text-[13px]">
            <InfoRow
              label="Ngân hàng"
              value={payment.bankName}
              field="bank"
              copiedField={copiedField}
              onCopy={copyToClipboard}
            />
            <InfoRow
              label="Số tài khoản"
              value={payment.accountNumber}
              field="account"
              copiedField={copiedField}
              onCopy={copyToClipboard}
            />
            <InfoRow
              label="Chủ tài khoản"
              value={payment.accountName}
              field="name"
              copiedField={copiedField}
              onCopy={copyToClipboard}
            />
            <InfoRow
              label="Số tiền"
              value={`${amount.toLocaleString('vi-VN')}₫`}
              field="amount"
              copiedField={copiedField}
              onCopy={copyToClipboard}
            />
            <div
              className="mt-2 rounded-lg p-3"
              style={{ background: 'var(--p-color-bg-surface-info)' }}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="mb-1 text-[11px]" style={{ color: 'var(--p-color-text-secondary)' }}>
                    Nội dung chuyển khoản
                  </p>
                  <p
                    className="truncate font-mono text-[13px] font-semibold"
                    style={{ color: 'var(--p-color-text-info)' }}
                  >
                    {payment.content}
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(payment.content, 'content')}
                  className="flex-shrink-0 transition-colors"
                  style={{ color: 'var(--p-color-text-info)' }}
                >
                  {copiedField === 'content' ? <CheckCheck size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <p className="text-[12px]" style={{ color: 'var(--p-color-text-secondary)' }}>
              Mã đơn hàng: <span className="font-semibold" style={{ color: 'var(--p-color-text)' }}>{order?.orderNumber}</span>
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// ─── Helper component ─────────────────────────────────────────────────────────

interface InfoRowProps {
  label: string;
  value: string;
  field: string;
  copiedField: string | null;
  onCopy: (text: string, field: string) => void;
}

function InfoRow({ label, value, field, copiedField, onCopy }: InfoRowProps) {
  return (
    <div
      className="flex items-center justify-between gap-2 border-b py-2 last:border-0"
      style={{ borderColor: 'var(--p-color-border-secondary)' }}
    >
      <div className="min-w-0">
        <p className="text-[11px]" style={{ color: 'var(--p-color-text-secondary)' }}>
          {label}
        </p>
        <p className="truncate text-[13px] font-medium" style={{ color: 'var(--p-color-text)' }}>
          {value}
        </p>
      </div>
      <button
        onClick={() => onCopy(value, field)}
        className="flex-shrink-0 transition-colors"
        style={{ color: 'var(--p-color-icon-secondary)' }}
        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--p-color-text-link)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--p-color-icon-secondary)'; }}
      >
        {copiedField === field ? <CheckCheck size={14} /> : <Copy size={14} />}
      </button>
    </div>
  );
}
