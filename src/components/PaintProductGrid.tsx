"use client";
// src/components/PaintProductGrid.tsx
// ============================================================================
// 페인트 제품 그리드
// ============================================================================

import React from 'react';

interface PaintProduct {
    id: string;
    name: string;
    thumbnail: string;
    description?: string;
}

interface PaintProductGridProps {
    products: PaintProduct[];
    onProductClick: (product: PaintProduct) => void;
}

export const PaintProductGrid: React.FC<PaintProductGridProps> = ({
    products,
    onProductClick
}) => {
    if (products.length === 0) {
        return (
            <div className="py-20 text-center text-gray-400">
                등록된 제품이 없습니다.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {products.map((product) => (
                <button
                    key={product.id}
                    onClick={() => onProductClick(product)}
                    className="group text-left bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-300"
                >
                    {/* Product Image */}
                    <div className="aspect-square bg-gray-50 relative overflow-hidden">
                        <img
                            src={product.thumbnail}
                            alt={product.name}
                            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                        />
                    </div>

                    {/* Product Info */}
                    <div className="p-4 border-t border-gray-100">
                        <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2 group-hover:text-amber-600 transition-colors">
                            {product.name}
                        </h3>
                        {product.description && (
                            <p className="text-xs text-gray-500 line-clamp-2">
                                {product.description}
                            </p>
                        )}
                    </div>
                </button>
            ))}
        </div>
    );
};
