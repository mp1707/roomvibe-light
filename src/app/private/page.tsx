import { requireAuth } from "@/utils/auth";

export default async function PrivatePage() {
  const user = await requireAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-md shadow-2xl bg-base-100">
        <div className="card-body text-center">
          <h2 className="card-title justify-center mb-4">
            Welcome to your private page!
          </h2>
          <p className="text-base-content/70 mb-6">
            Hello {user.email}, this is a protected page that only authenticated
            users can see.
          </p>
          <div className="card-actions justify-center space-x-2">
            <a href="/" className="btn btn-primary">
              Go Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
