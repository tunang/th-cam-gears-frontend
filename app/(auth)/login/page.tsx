"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GoogleLogin } from "@react-oauth/google";
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { loginSchema, type LoginFormData } from "@/src/utils/auth.schema";
import { useLogin, useGoogleAuth } from "@/src/hooks/use-auth";

// ── Wrapper with Suspense for useSearchParams ────────────────────────────
export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageContent />
    </Suspense>
  );
}

function LoginPageContent() {
  const searchParams = useSearchParams();
  const showRegisteredBanner = searchParams.get("registered") === "true";

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const loginMutation = useLogin();
  const googleAuthMutation = useGoogleAuth();

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const isLoading = loginMutation.isPending || googleAuthMutation.isPending;
  const error = loginMutation.error || googleAuthMutation.error;
  const errorMessage =
    error?.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại.";

  return (
    <div
      style={{
        animation: "fade-in var(--p-motion-duration-300) var(--p-motion-ease)",
      }}
    >
      {/* Logo / Branding */}
      <div className="mb-8 text-center">
        <div
          className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
          style={{ background: "var(--p-color-bg-fill-brand)" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"
              fill="white"
            />
          </svg>
        </div>
        <h1
          className="text-2xl font-semibold"
          style={{ color: "var(--p-color-text)", letterSpacing: "-0.3px" }}
        >
          Đăng nhập
        </h1>
        <p
          className="mt-1 text-sm"
          style={{ color: "var(--p-color-text-secondary)" }}
        >
          Chào mừng trở lại TH Cam Gears
        </p>
      </div>

      {/* Card */}
      <div
        className="rounded-xl p-6"
        style={{
          background: "var(--p-color-bg-surface)",
          boxShadow: "var(--p-shadow-200)",
          border: "1px solid var(--p-color-border)",
        }}
      >
        {/* Success banner */}
        {showRegisteredBanner && (
          <div
            className="mb-4 flex items-start gap-3 rounded-lg p-3 text-sm"
            style={{
              background: "var(--p-color-bg-surface-success)",
              color: "var(--p-color-text-success)",
            }}
            role="alert"
          >
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              Đăng ký thành công! Kiểm tra email để xác minh tài khoản, sau đó
              đăng nhập.
            </span>
          </div>
        )}

        {/* Error banner */}
        {error && (
          <div
            className="mb-4 flex items-start gap-3 rounded-lg p-3 text-sm"
            style={{
              background: "var(--p-color-bg-surface-critical)",
              color: "var(--p-color-text-critical)",
            }}
            role="alert"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          {/* Email */}
          <div>
            <label
              htmlFor="login-email"
              className="mb-1.5 block text-sm font-medium"
              style={{ color: "var(--p-color-text)" }}
            >
              Email
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="email@example.com"
              disabled={isLoading}
              className="w-full rounded-md px-3 py-2 text-sm transition-colors duration-100 placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                background: "var(--p-color-input-bg-surface)",
                border: `1px solid ${errors.email ? "var(--p-color-border-critical-secondary)" : "var(--p-color-input-border)"}`,
                borderRadius: "var(--p-border-radius-150)",
                color: "var(--p-color-text)",
                minHeight: "36px",
              }}
              {...register("email")}
            />
            {errors.email && (
              <p
                className="mt-1 text-xs"
                style={{ color: "var(--p-color-text-critical)" }}
              >
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="login-password"
              className="mb-1.5 block text-sm font-medium"
              style={{ color: "var(--p-color-text)" }}
            >
              Mật khẩu
            </label>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••"
                disabled={isLoading}
                className="w-full rounded-md px-3 py-2 pr-10 text-sm transition-colors duration-100 placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  background: "var(--p-color-input-bg-surface)",
                  border: `1px solid ${errors.password ? "var(--p-color-border-critical-secondary)" : "var(--p-color-input-border)"}`,
                  borderRadius: "var(--p-border-radius-150)",
                  color: "var(--p-color-text)",
                  minHeight: "36px",
                }}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded"
                style={{ color: "var(--p-color-text-secondary)" }}
                tabIndex={-1}
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p
                className="mt-1 text-xs"
                style={{ color: "var(--p-color-text-critical)" }}
              >
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            id="login-submit-btn"
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold transition-all duration-100 disabled:cursor-not-allowed disabled:opacity-70"
            style={{
              background: "var(--p-color-bg-fill-brand)",
              color: "var(--p-color-text-brand-on-bg-fill)",
              borderRadius: "var(--p-border-radius-150)",
              minHeight: "40px",
            }}
            onMouseEnter={(e) => {
              if (!isLoading)
                e.currentTarget.style.background =
                  "var(--p-color-bg-fill-brand-hover)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--p-color-bg-fill-brand)";
            }}
          >
            {loginMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang đăng nhập...
              </>
            ) : (
              "Đăng nhập"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-5">
          <div
            className="absolute inset-0 flex items-center"
            aria-hidden="true"
          >
            <div
              className="w-full"
              style={{ borderTop: "1px solid var(--p-color-border-secondary)" }}
            />
          </div>
          <div className="relative flex justify-center text-xs">
            <span
              className="px-3"
              style={{
                background: "var(--p-color-bg-surface)",
                color: "var(--p-color-text-secondary)",
              }}
            >
              hoặc
            </span>
          </div>
        </div>

        {/* Google Login — uses @react-oauth/google GoogleLogin component */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              if (credentialResponse.credential) {
                googleAuthMutation.mutate({
                  idToken: credentialResponse.credential,
                });
              }
            }}
            onError={() => {
              console.error("Google Login Failed");
            }}
            width="368"
            text="signin_with"
            shape="rectangular"
            theme="outline"
          />
        </div>
      </div>

      {/* Register link */}
      <p
        className="mt-6 text-center text-sm"
        style={{ color: "var(--p-color-text-secondary)" }}
      >
        Chưa có tài khoản?{" "}
        <Link
          href="/register"
          className="font-medium transition-colors duration-100"
          style={{ color: "var(--p-color-text-link)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--p-color-text-link-hover)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--p-color-text-link)";
          }}
        >
          Đăng ký
        </Link>
      </p>
    </div>
  );
}
