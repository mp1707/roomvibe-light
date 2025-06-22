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
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-md shadow-2xl bg-base-100">
        <div className="card-body text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-error rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-error-content"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="card-title justify-center mb-2">
            Authentication Error
          </h2>
          <p className="text-base-content/70 mb-6">{errorMessage}</p>
          <div className="card-actions justify-center space-x-2">
            <a href="/auth/login" className="btn btn-primary">
              Try Again
            </a>
            <a href="/" className="btn btn-outline">
              Go Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
