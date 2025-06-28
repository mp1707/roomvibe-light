import { Link } from "@/i18n/navigation";

export default function CheckEmailPage() {
  return (
    <div className="min-h-screen w-full bg-base-200 lg:bg-base-200 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Mobile: Full screen, Desktop: Card */}
        <div className="min-h-screen lg:min-h-0 bg-base-100 lg:rounded-2xl lg:shadow-lg lg:border lg:border-base-300 flex flex-col justify-center">
          <div className="px-6 py-8 sm:px-8 lg:py-8 text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 mx-auto mb-8 bg-success/10 rounded-2xl flex items-center justify-center">
              <svg
                className="w-10 h-10 text-success"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl sm:text-3xl font-bold text-base-content mb-3">
                Check Your Email
              </h1>
              <p className="text-base-content/60 text-base leading-relaxed max-w-sm mx-auto">
                We've sent you a confirmation email. Please click the link in
                the email to verify your account and complete your registration.
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-base-200/50 rounded-xl p-5 mb-8 text-left">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-base-content mb-1">
                    Didn't receive the email?
                  </p>
                  <p className="text-sm text-base-content/60 leading-relaxed">
                    Check your spam folder or try signing up again. The link
                    will expire in 24 hours.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <Link
                href="/auth/login"
                className="btn btn-primary w-full h-14 rounded-xl font-medium text-base hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-base-100"
              >
                Back to Sign In
              </Link>
              <Link
                href="/"
                className="btn btn-outline btn-primary w-full h-14 rounded-xl font-medium text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-base-100"
              >
                Go Home
              </Link>
            </div>
          </div>

          {/* Help Text - Only show on mobile */}
          <div className="text-center px-6 pb-8 lg:hidden">
            <p className="text-xs text-base-content/50">
              Need help? Contact our support team for assistance.
            </p>
          </div>
        </div>

        {/* Help Text - Only show on desktop */}
        <div className="hidden lg:block text-center mt-6 px-4">
          <p className="text-xs text-base-content/50">
            Need help? Contact our support team for assistance.
          </p>
        </div>
      </div>
    </div>
  );
}
