"use client";

import { use, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Loader2,
  ImageOff,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useProduct, useProductVariants } from "@/src/hooks/use-products";
import { useAddToCart } from "@/src/hooks/use-cart";
import useAuthStore from "@/src/store/auth.store";
import type { ProductVariant } from "@/src/utils/types";

function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const {
    data: product,
    isLoading: isProductLoading,
    error: productError,
  } = useProduct(id);
  const { data: variants, isLoading: isVariantsLoading } =
    useProductVariants(id);
  const addToCart = useAddToCart();

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null,
  );
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const isLoading = isProductLoading || isVariantsLoading;
  const error = productError;

  // Initialize selected variant if variants exist
  if (variants && variants.length > 0 && !selectedVariantId) {
    setSelectedVariantId(variants[0].id);
  }

  const selectedVariant = variants?.find((v) => v.id === selectedVariantId);
  const allImages = product
    ? ([product.thumbnailUrl, ...product.imageUrls].filter(Boolean) as string[])
    : [];

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (!selectedVariantId) return;

    addToCart.mutate({
      variantId: selectedVariantId,
      quantity,
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2
          className="h-10 w-10 animate-spin"
          style={{ color: "var(--p-color-text-secondary)" }}
        />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div
          className="rounded-lg p-6 text-center text-sm"
          style={{
            background: "var(--p-color-bg-surface-critical)",
            color: "var(--p-color-text-critical)",
          }}
        >
          Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
        {/* Left: Images */}
        <div className="flex flex-col-reverse lg:flex-row gap-4">
          {/* Thumbnail list (Desktop vertical, Mobile horizontal) */}
          {allImages.length > 1 && (
            <div className="flex w-full lg:w-20 lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto no-scrollbar pb-2 lg:pb-0">
              {allImages.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all"
                  style={{
                    borderColor:
                      activeImageIndex === idx
                        ? "var(--p-color-bg-fill-brand)"
                        : "transparent",
                    background: "var(--p-color-bg-surface-secondary)",
                  }}
                >
                  <Image
                    src={url}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Main Image */}
          <div
            className="relative flex-1 aspect-square w-full overflow-hidden rounded-xl border"
            style={{
              background: "var(--p-color-bg-surface-secondary)",
              borderColor: "var(--p-color-border-secondary)",
            }}
          >
            {allImages.length > 0 ? (
              <Image
                src={allImages[activeImageIndex]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <ImageOff
                  className="h-16 w-16"
                  style={{ color: "var(--p-color-icon-secondary)" }}
                />
              </div>
            )}

            {/* Arrows */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setActiveImageIndex((i) =>
                      i === 0 ? allImages.length - 1 : i - 1,
                    )
                  }
                  className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow-md backdrop-blur-sm transition-transform hover:scale-110"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={() =>
                    setActiveImageIndex((i) =>
                      i === allImages.length - 1 ? 0 : i + 1,
                    )
                  }
                  className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow-md backdrop-blur-sm transition-transform hover:scale-110"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Right: Info */}
        <div className="mt-10 px-2 sm:px-0 lg:mt-0">
          <h1
            className="text-3xl font-bold tracking-tight"
            style={{ color: "var(--p-color-text)" }}
          >
            {product.name}
          </h1>

          <div className="mt-4 flex items-end gap-4">
            <p
              className="text-3xl font-bold tracking-tight"
              style={{ color: "var(--p-color-text)" }}
            >
              {selectedVariant
                ? formatPrice(selectedVariant.price)
                : "Đang tải..."}
            </p>
          </div>

          <div className="mt-6">
            <h3 className="sr-only">Mô tả</h3>
            <p
              className="text-base leading-relaxed"
              style={{ color: "var(--p-color-text-secondary)" }}
            >
              {product.description || "Chưa có mô tả cho sản phẩm này."}
            </p>
          </div>

          <div
            className="mt-8 border-t pt-8"
            style={{ borderColor: "var(--p-color-border-secondary)" }}
          >
            {/* Variants */}
            {variants && variants.length > 0 && (
              <div className="mb-8">
                <h3
                  className="text-sm font-medium"
                  style={{ color: "var(--p-color-text)" }}
                >
                  Phân loại (Phiên bản)
                </h3>
                <div className="mt-3 flex flex-wrap gap-3">
                  {variants.map((v) => {
                    const isSelected = v.id === selectedVariantId;
                    const optionLabel =
                      v.options && Object.keys(v.options).length > 0
                        ? Object.entries(v.options)
                            .map(([key, val]) => `${val}`)
                            .join(" - ")
                        : v.name;

                    return (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariantId(v.id)}
                        className="rounded-md border px-4 py-2 text-sm font-medium transition-all"
                        style={{
                          background: isSelected
                            ? "var(--p-color-bg-surface-selected)"
                            : "var(--p-color-bg-surface)",
                          borderColor: isSelected
                            ? "var(--p-color-bg-fill-brand)"
                            : "var(--p-color-border)",
                          color: isSelected
                            ? "var(--p-color-text)"
                            : "var(--p-color-text-secondary)",
                          boxShadow: isSelected
                            ? "0 0 0 1px var(--p-color-bg-fill-brand)"
                            : "none",
                        }}
                      >
                        {optionLabel}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <h3
                className="text-sm font-medium"
                style={{ color: "var(--p-color-text)" }}
              >
                Số lượng
              </h3>
              <div
                className="mt-3 flex items-center w-32 rounded-md border"
                style={{ borderColor: "var(--p-color-border)" }}
              >
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-11 w-10 items-center justify-center text-gray-500 transition hover:bg-gray-50"
                >
                  &minus;
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="h-11 w-full text-center text-sm font-semibold focus:outline-none"
                  style={{ color: "var(--p-color-text)" }}
                />
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex h-11 w-10 items-center justify-center text-gray-500 transition hover:bg-gray-50"
                >
                  &#43;
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="mt-8 flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={addToCart.isPending || !selectedVariantId}
                className="flex flex-1 items-center justify-center gap-2 rounded-md py-4 text-base font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-70"
                style={{
                  background: "var(--p-color-bg-fill-brand)",
                  color: "var(--p-color-text-brand-on-bg-fill)",
                  boxShadow: "var(--p-shadow-button-primary)",
                }}
                onMouseEnter={(e) => {
                  if (!addToCart.isPending && selectedVariantId) {
                    e.currentTarget.style.background =
                      "var(--p-color-bg-fill-brand-hover)";
                    e.currentTarget.style.boxShadow =
                      "var(--p-shadow-button-primary-hover)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    "var(--p-color-bg-fill-brand)";
                  e.currentTarget.style.boxShadow =
                    "var(--p-shadow-button-primary)";
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0px 3px 0px 0px rgb(0, 0, 0) inset";
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.boxShadow =
                    "var(--p-shadow-button-primary-hover)";
                }}
              >
                {addToCart.isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5" />
                    {!isAuthenticated
                      ? "Đăng nhập để mua"
                      : "Thêm vào giỏ hàng"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
