"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, ImageOff } from "lucide-react";
import type { Product } from "@/src/utils/types";
import useAuthStore from "@/src/store/auth.store";
import { useAddToCart } from "@/src/hooks/use-cart";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  onAuthRequired?: () => void;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

export default function ProductCard({
  product,
  onAuthRequired,
}: ProductCardProps) {
  const { isAuthenticated } = useAuthStore();
  const addToCart = useAddToCart();
  const [added, setAdded] = useState(false);

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      onAuthRequired?.();
      return;
    }
    // Quick-add uses the first variant — full selection on detail page
    // For now we just navigate to detail page if no default variant
    window.location.href = `/products/${product.id}`;
  };

  return (
    <Link
      href={`/products/${product.id}`}
      className="group relative flex flex-col rounded-xl overflow-hidden transition-all duration-200"
      style={{
        background: "var(--p-color-bg-surface)",
        border: "1px solid var(--p-color-border)",
        boxShadow: "var(--p-shadow-100)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "var(--p-shadow-300)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "var(--p-shadow-100)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Image */}
      <div
        className="relative aspect-square overflow-hidden"
        style={{ background: "var(--p-color-bg-surface-secondary)" }}
      >
        {product.thumbnailUrl ? (
          <Image
            src={product.thumbnailUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ImageOff
              className="h-10 w-10"
              style={{ color: "var(--p-color-icon-secondary)" }}
            />
          </div>
        )}

        {/* Quick-add overlay */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full transition-transform duration-200 group-hover:translate-y-0">
          <button
            onClick={handleQuickAdd}
            disabled={addToCart.isPending}
            className="flex w-full items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors"
            style={{
              background: "var(--p-color-bg-fill-brand)",
              color: "var(--p-color-text-brand-on-bg-fill)",
            }}
            aria-label={`Xem ${product.name}`}
          >
            <ShoppingCart className="h-4 w-4" />
            Xem & Chọn
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 p-3">
        <h3
          className="line-clamp-2 text-sm font-semibold leading-snug"
          style={{ color: "var(--p-color-text)" }}
        >
          {product.name}
        </h3>
        {product.description && (
          <p
            className="line-clamp-2 text-xs"
            style={{ color: "var(--p-color-text-secondary)" }}
          >
            {product.description}
          </p>
        )}
      </div>
    </Link>
  );
}
