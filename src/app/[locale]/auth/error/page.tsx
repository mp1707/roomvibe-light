import { Link } from "@/i18n/navigation";

export default async function ErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const params = await searchParams;
  const errorMessage =
    params?.message ||
    "Sorry, we could not authenticate you. This could be due to an expired link or an error in the authentication process.";

  return (
    <div className="min-h-screen w-full bg-base-200 lg:bg-base-200 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Mobile: Full screen, Desktop: Card */}
        <div className="min-h-screen lg:min-h-0 bg-base-100 lg:rounded-2xl lg:shadow-lg lg:border lg:border-base-300 flex flex-col justify-center">
          <div className="px-6 py-8 sm:px-8 lg:py-8 text-center">
            {/* Error Icon */}
            <div className="w-20 h-20 mx-auto mb-8 bg-error/10 rounded-2xl flex items-center justify-center">
              <svg
                className="w-10 h-10 text-error"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl sm:text-3xl font-bold text-base-content mb-3">
                Authentication Error
              </h1>
              <p className="text-base-content/60 text-base leading-relaxed max-w-sm mx-auto">
                {errorMessage}
              </p>
            </div>

            {/* Help Section */}
            <div className="bg-base-200/50 rounded-xl p-5 mb-8 text-left">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  <svg
                    className="w-5 h-5 text-warning"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-base-content mb-2">
                    What you can try:
                  </p>
                  <ul className="text-sm text-base-content/60 space-y-1 leading-relaxed">
                    <li>• Check if the link in your email has expired</li>
                    <li>• Try signing in again with a fresh link</li>
                    <li>• Clear your browser cache and cookies</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <Link
                href="/auth/login"
                className="btn btn-primary w-full h-14 rounded-xl font-medium text-base hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-base-100"
              >
                Try Again
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
              Still having trouble? Contact our support team for assistance.
            </p>
          </div>
        </div>

        {/* Help Text - Only show on desktop */}
        <div className="hidden lg:block text-center mt-6 px-4">
          <p className="text-xs text-base-content/50">
            Still having trouble? Contact our support team for assistance.
          </p>
        </div>
      </div>
    </div>
  );
}
