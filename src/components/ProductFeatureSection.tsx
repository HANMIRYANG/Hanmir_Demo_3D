import React from 'react';
import { FeatureSection } from '@/lib/product-data';

interface ProductFeatureSectionProps {
    sections: FeatureSection[];
}

export const ProductFeatureSection: React.FC<ProductFeatureSectionProps> = ({ sections }) => {
    return (
        <section className="bg-white">
            {sections.map((section, idx) => {
                const isReversed = idx % 2 === 1;

                return (
                    <div
                        key={idx}
                        className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} min-h-[600px]`}
                    >
                        {/* 이미지 영역 - 50% 너비 */}
                        <div className="w-full lg:w-1/2 h-[400px] lg:h-auto relative overflow-hidden">
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                                style={{ backgroundImage: `url(${section.image})` }}
                            />
                        </div>

                        {/* 텍스트 영역 - 50% 너비 */}
                        <div className={`w-full lg:w-1/2 flex items-center ${isReversed ? 'bg-zinc-100' : 'bg-zinc-50'}`}>
                            <div className="max-w-xl mx-auto px-8 lg:px-16 py-16 lg:py-24">
                                {/* 섹션 번호 */}
                                <span className="text-blue-500 font-mono text-sm mb-4 block">
                                    {String(idx + 1).padStart(2, '0')}
                                </span>

                                {/* 제목 */}
                                <h3 className="text-3xl lg:text-4xl font-bold text-zinc-900 mb-6 leading-tight">
                                    {section.title}
                                </h3>

                                {/* 설명 */}
                                <p className="text-zinc-600 text-lg leading-relaxed">
                                    {section.description}
                                </p>

                                {/* 장식 라인 */}
                                <div className="mt-8 h-1 w-16 bg-gradient-to-r from-blue-500 to-blue-400" />
                            </div>
                        </div>
                    </div>
                );
            })}
        </section>
    );
};
