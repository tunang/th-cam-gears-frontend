"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Loader2,
  ImageOff,
} from "lucide-react";
import {
  useCart,
  useUpdateCartItem,
  useRemoveCartItem,
} from "@/src/hooks/use-cart";
import useAuthStore from "@/src/store/auth.store";
import type { CartItem } from "@/src/utils/types";

function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { isAuthenticated } = useAuthStore();
  const { data: cart, isLoading } = useCart();

  const items = cart?.items ?? [];
  const totalAmount = items.reduce(
    (sum, item) => sum + Number(item.variant.price) * item.quantity,
    0,
  );

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-[fade-in_0.2s_ease]" />
        <Dialog.Content
          className="fixed right-0 top-0 z-50 h-full w-full max-w-[420px] flex flex-col shadow-2xl data-[state=open]:animate-[slide-in-right_0.3s_ease]"
          style={{ background: "var(--p-color-bg-surface)" }}
        >
          {/* Header */}
          <div
            className="flex h-16 items-center justify-between flex-shrink-0 px-5 border-b"
            style={{ borderColor: "var(--p-color-border-secondary)" }}
          >
            <Dialog.Title
              className="flex items-center gap-2 text-lg font-semibold"
              style={{ color: "var(--p-color-text)" }}
            >
              <ShoppingBag className="h-5 w-5" />
              Giỏ hàng
              {items.length > 0 && (
                <span
                  className="flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold"
                  style={{
                    background: "var(--p-color-bg-fill-brand)",
                    color: "white",
                  }}
                >
                  {items.length}
                </span>
              )}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                className="flex h-8 w-8 items-center justify-center rounded-md transition-colors"
                style={{ color: "var(--p-color-icon)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "var(--p-color-bg-surface-hover)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
                aria-label="Đóng"
              >
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto">
            {!isAuthenticated ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
                <ShoppingBag
                  className="h-14 w-14"
                  style={{ color: "var(--p-color-icon-secondary)" }}
                />
                <p
                  className="text-base font-medium"
                  style={{ color: "var(--p-color-text)" }}
                >
                  Đăng nhập để xem giỏ hàng
                </p>
                <Link
                  href="/login"
                  onClick={() => onOpenChange(false)}
                  className="rounded-md px-5 py-2.5 text-sm font-semibold transition-colors"
                  style={{
                    background: "var(--p-color-bg-fill-brand)",
                    color: "white",
                  }}
                >
                  Đăng nhập
                </Link>
              </div>
            ) : isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2
                  className="h-7 w-7 animate-spin"
                  style={{ color: "var(--p-color-text-secondary)" }}
                />
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
                <ShoppingBag
                  className="h-14 w-14"
                  style={{ color: "var(--p-color-icon-secondary)" }}
                />
                <p
                  className="text-base font-medium"
                  style={{ color: "var(--p-color-text)" }}
                >
                  Giỏ hàng trống
                </p>
                <p
                  className="text-sm"
                  style={{ color: "var(--p-color-text-secondary)" }}
                >
                  Thêm sản phẩm vào giỏ để bắt đầu mua sắm
                </p>
                <Link
                  href="/"
                  onClick={() => onOpenChange(false)}
                  className="rounded-md px-5 py-2.5 text-sm font-semibold transition-colors"
                  style={{
                    background: "var(--p-color-bg-fill-brand)",
                    color: "white",
                  }}
                >
                  Khám phá sản phẩm
                </Link>
              </div>
            ) : (
              <div
                className="flex flex-col divide-y"
                style={{ borderColor: "var(--p-color-border-secondary)" }}
              >
                {items.map((item) => (
                  <CartItemRow key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {isAuthenticated && items.length > 0 && (
            <div
              className="flex-shrink-0 p-5 border-t space-y-4"
              style={{ borderColor: "var(--p-color-border-secondary)" }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--p-color-text-secondary)" }}
                >
                  Tổng cộng
                </span>
                <span
                  className="text-xl font-bold"
                  style={{ color: "var(--p-color-text)" }}
                >
                  {formatPrice(totalAmount)}
                </span>
              </div>
              <Link
                href="/checkout"
                onClick={() => onOpenChange(false)}
                className="flex w-full justify-center rounded-md py-3 text-sm font-semibold transition-colors"
                style={{
                  background: "var(--p-color-bg-fill-brand)",
                  color: "white",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "var(--p-color-bg-fill-brand-hover)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    "var(--p-color-bg-fill-brand)";
                }}
              >
                Tiến hành thanh toán
              </Link>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function CartItemRow({ item }: { item: CartItem }) {
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const { variant } = item;

  const handleQtyChange = (delta: number) => {
    const newQty = item.quantity + delta;
    if (newQty < 1) return removeItem.mutate(item.id);
    updateItem.mutate({ itemId: item.id, quantity: newQty });
  };

  const isUpdating = updateItem.isPending || removeItem.isPending;

  return (
    <div
      className={`flex gap-3 p-4 transition-opacity ${isUpdating ? "opacity-50" : ""}`}
    >
      {/* Thumbnail */}
      <Link
        href={`/products/${variant.product.id}`}
        className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg"
        style={{ background: "var(--p-color-bg-surface-secondary)" }}
      >
        {variant.product.thumbnailUrl ? (
          <Image
            src={variant.product.thumbnailUrl}
            alt={variant.product.name}
            fill
            className="object-cover"
            sizes="64px"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ImageOff
              className="h-5 w-5"
              style={{ color: "var(--p-color-icon-secondary)" }}
            />
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <Link href={`/products/${variant.product.id}`}>
          <p
            className="text-lg font-semibold leading-tight"
            style={{ color: "var(--p-color-text)" }}
          >
            {variant.product.name}
          </p>
        </Link>
        <p
          className="text-sm font-italic leading-tight"
          style={{ color: "var(--p-color-text)" }}
        >
          {variant.name}
        </p>
        <p
          className="text-sm font-bold"
          style={{ color: "var(--p-color-text)" }}
        >
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(Number(variant.price))}
        </p>

        {/* Qty + Remove */}
        <div className="flex items-center gap-2 mt-1">
          <div
            className="flex items-center rounded-md border"
            style={{ borderColor: "var(--p-color-border)" }}
          >
            <button
              onClick={() => handleQtyChange(-1)}
              disabled={isUpdating}
              className="flex h-7 w-7 items-center justify-center rounded-l-md transition-colors disabled:opacity-40"
              style={{ color: "var(--p-color-icon)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  "var(--p-color-bg-surface-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
              aria-label="Giảm"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span
              className="w-7 text-center text-sm font-medium tabular-nums"
              style={{ color: "var(--p-color-text)" }}
            >
              {item.quantity}
            </span>
            <button
              onClick={() => handleQtyChange(1)}
              disabled={isUpdating}
              className="flex h-7 w-7 items-center justify-center rounded-r-md transition-colors disabled:opacity-40"
              style={{ color: "var(--p-color-icon)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  "var(--p-color-bg-surface-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
              aria-label="Tăng"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <button
            onClick={() => removeItem.mutate(item.id)}
            disabled={isUpdating}
            className="flex h-7 w-7 items-center justify-center rounded-md transition-colors disabled:opacity-40"
            style={{ color: "var(--p-color-icon-secondary)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--p-color-icon-critical)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--p-color-icon-secondary)";
            }}
            aria-label="Xóa"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
