import { login, signup, signInWithGoogle } from "./actions";
import { getTranslations } from "next-intl/server";

export default async function LoginPage() {
  const t = await getTranslations("AuthPage");

  return (
    <div className="min-h-screen w-full bg-base-200 lg:bg-base-200 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Mobile: Full screen, Desktop: Card */}
        <div className="min-h-screen lg:min-h-0 bg-base-100 lg:rounded-2xl lg:shadow-lg lg:border lg:border-base-300 flex flex-col justify-center">
          <div className="px-6 py-8 sm:px-8 lg:py-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-3xl font-bold text-base-content mb-3">
                {t("title")}
              </h1>
              <p className="text-base-content/60 text-base">{t("subtitle")}</p>
            </div>

            {/* Google Sign In - Primary Action */}
            <form className="mb-6">
              <button
                formAction={signInWithGoogle}
                type="submit"
                className="inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-base-100 w-full px-8 py-4 text-lg rounded-2xl h-14 min-h-0 bg-base-200 hover:bg-base-300 text-base-content border-base-300"
                aria-label={t("continueWithGoogle")}
              >
                <svg
                  className="w-5 h-5 mr-3 flex-shrink-0"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {t("continueWithGoogle")}
              </button>
            </form>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-base-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-base-100 text-base-content/60 font-medium">
                  {t("orContinueWith")}
                </span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form className="space-y-5">
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-base-content mb-2"
                  >
                    {t("emailAddress")}
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full px-4 py-4 rounded-xl border border-base-300 bg-base-100 text-base-content placeholder-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-base"
                    placeholder={t("enterEmail")}
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-base-content mb-2"
                  >
                    {t("password")}
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="w-full px-4 py-4 rounded-xl border border-base-300 bg-base-100 text-base-content placeholder-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-base"
                    placeholder={t("enterPassword")}
                  />
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <button
                  formAction={login}
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-base-100 w-full px-8 py-4 text-lg rounded-2xl h-14 min-h-0 bg-primary hover:bg-primary-focus text-primary-content border-primary"
                >
                  {t("signIn")}
                </button>
                <button
                  formAction={signup}
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-base-100 w-full px-8 py-4 text-lg rounded-2xl h-14 min-h-0 border-2 border-primary text-primary hover:bg-primary/10 bg-transparent"
                >
                  {t("createAccount")}
                </button>
              </div>
            </form>
          </div>
          {/* Footer Text - Only show on mobile */}
          <div className="text-center px-6 pb-8 lg:hidden">
            <p className="text-xs text-base-content/50 leading-relaxed">
              {t("termsPrivacy")}
            </p>
          </div>
        </div>

        {/* Footer Text - Only show on desktop */}
        <div className="hidden lg:block text-center mt-6 px-4">
          <p className="text-xs text-base-content/50 leading-relaxed">
            {t("termsPrivacy")}
          </p>
        </div>
      </div>
    </div>
  );
}
