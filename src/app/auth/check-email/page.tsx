export default function CheckEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-md shadow-2xl bg-base-100">
        <div className="card-body text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-success rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-success-content"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="card-title justify-center mb-2 text-success">
            Check Your Email
          </h2>
          <p className="text-base-content/70 mb-6">
            We've sent you a confirmation email. Please click the link in the
            email to verify your account and complete your registration.
          </p>
          <div className="bg-base-200 p-4 rounded-lg mb-6">
            <p className="text-sm text-base-content/60">
              <strong>Didn't receive the email?</strong>
              <br />
              Check your spam folder or try signing up again.
            </p>
          </div>
          <div className="card-actions justify-center space-x-2">
            <a href="/auth/login" className="btn btn-primary">
              Back to Login
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
