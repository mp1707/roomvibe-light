import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { StateGuard } from "@/components/StateGuard";
import { ImageModal } from "@/components/ImageModal";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import Header from "@/components/Header";
import { Toaster } from "react-hot-toast";
import MockModeIndicator from "../../components/MockModeIndicator";
import { useTranslations } from "next-intl";

function Footer() {
  const t = useTranslations("Layout");

  return (
    <footer className="bg-base-100 border-t border-base-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-6 text-sm text-base-content/60">
            <Link
              href="/impressum"
              className="hover:text-base-content transition-colors"
            >
              {t("impressum")}
            </Link>
            <span className="text-base-content/30">|</span>
            <Link
              href="/datenschutz"
              className="hover:text-base-content transition-colors"
            >
              {t("datenschutz")}
            </Link>
          </div>
          <p className="text-xs text-base-content/40 text-center">
            © {new Date().getFullYear()} roomvibe. {t("allRightsReserved")}.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Load messages for the current locale
  const messages = (await import(`../../../messages/${locale}.json`)).default;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <main className="min-h-screen w-full flex flex-col bg-base-100">
        <Header />

        {/* Main Content Area - Responsive Layout */}
        <div className="flex-1 bg-base-200 lg:bg-base-100 min-h-screen overflow-visible">
          {/* Mobile/Tablet: Card-like container */}
          <div className="lg:hidden max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="bg-base-100 rounded-2xl shadow-sm border border-base-300 min-h-[calc(100vh-200px)] overflow-visible">
              <div className="p-6 md:p-8 overflow-visible">
                <StateGuard>{children}</StateGuard>
              </div>
            </div>
          </div>

          {/* Desktop: Full viewport layout */}
          <div className="hidden lg:block overflow-visible">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-visible">
              <div className="overflow-visible">
                <StateGuard>{children}</StateGuard>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </main>

      <MockModeIndicator />
      <ImageModal />
      <ConfirmationModal />
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 5000,
          style: {
            background: "#333",
            color: "#fff",
          },
        }}
      />
    </NextIntlClientProvider>
  );
}
