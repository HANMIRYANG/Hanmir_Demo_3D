import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ProductFeatureGridProps {
    features: string[];
    description: string;
}

export const ProductFeatureGrid: React.FC<ProductFeatureGridProps> = ({ features, description }) => {
    return (
        <section className="py-24 bg-black relative">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

                {/* Description Column */}
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                        혁신을 위한 <br />
                        <span className="text-blue-500">최적의 솔루션</span>
                    </h2>
                    <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                        {description}
                    </p>
                    <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                </div>

                {/* Features List Column */}
                <div className="grid grid-cols-1 gap-6">
                    {features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-4 p-4 rounded-lg bg-zinc-900/50 border border-zinc-800/50 hover:border-blue-500/50 transition-colors">
                            <CheckCircle2 className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                            <span className="text-zinc-200 font-medium text-lg">{feature}</span>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};
