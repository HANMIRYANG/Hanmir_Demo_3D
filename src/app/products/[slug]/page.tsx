import React from 'react';
import { notFound } from 'next/navigation';
import { products } from '@/lib/product-data';
import { ProductHero } from '@/components/ProductHero';
import ProductTabContent from '@/components/ProductTabContent';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { CustomCursor } from '@/components/CustomCursor';

// 정적 경로 생성 (SSG 최적화)
export async function generateStaticParams() {
    return Object.keys(products).map((slug) => ({
        slug: slug,
    }));
}

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: PageProps) {
    const { slug } = await params;
    const product = products[slug];

    if (!product) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-black text-white cursor-none selection:bg-blue-500 selection:text-white relative font-sans">
            <CustomCursor />

            {/* 상단 Navbar - 상세페이지에선 sticky 해제 */}
            <Navbar isSticky={false} />

            <main>
                {/* 섹션 1: 히어로 영역 (항상 표시) */}
                <ProductHero
                    title={product.title}
                    koreanTitle={product.koreanTitle}
                    description={product.description}
                    heroImage={product.heroImage}
                />

                {/* 섹션 2: 탭 콘텐츠 영역 (서브 네비게이션 포함) */}
                <ProductTabContent
                    koreanTitle={product.koreanTitle}
                    features={product.features}
                    longDescription={product.longDescription}
                    featureSections={product.featureSections}
                    techSpecs={product.techSpecs}
                    applications={product.applications}
                />

            </main>
            <Footer />
        </div>
    );
}
