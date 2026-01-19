import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "@/i18n";
import { FloatingContactBtn } from "@/components/FloatingContactBtn";

// ============================================================================
// [locale]/layout.tsx - 다국어 레이아웃
// ============================================================================

export const metadata: Metadata = {
    title: "HANMIR - Advanced Functional Paints",
    description: "High-performance functional coating solutions by HANMIR Co., Ltd.",
    icons: {
        icon: "/logo.png",
        shortcut: "/logo.png",
        apple: "/logo.png",
    },
};

// Next.js 15+ params는 Promise
type Props = {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({
    children,
    params
}: Props) {
    // params가 Promise인 경우 await
    const { locale } = await params;

    // 지원하지 않는 언어인 경우 404
    if (!locales.includes(locale as any)) {
        notFound();
    }

    // 해당 언어의 메시지 로드
    const messages = await getMessages();

    return (
        <NextIntlClientProvider messages={messages}>
            {children}
            <FloatingContactBtn />
        </NextIntlClientProvider>
    );
}
