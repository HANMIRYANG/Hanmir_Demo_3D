"use client";
// src/app/admin/paint-products/page.tsx
// ============================================================================
// 페인트 제품 관리 페이지
// ============================================================================

import React, { useState, useEffect, useCallback } from 'react';
import {
    Plus,
    Pencil,
    Trash2,
    Loader2,
    ChevronDown,
    ChevronRight,
    Image as ImageIcon,
    FileText,
    GripVertical,
    X,
    Save,
    Upload
} from 'lucide-react';
import { upload } from '@vercel/blob/client';

// 메인 카테고리 정의 (하드코딩)
const MAIN_CATEGORIES = [
    { id: 'building', name: '건축' },
    { id: 'ship', name: '선박 (개발진행중)' },
    { id: 'industrial', name: '일반공업' }
];

// Types
interface PaintCategory {
    id: string;
    mainCategory: string;
    slug: string;
    name: string;
    order: number;
    isActive: boolean;
    products: PaintProduct[];
    _count?: { products: number };
}

interface PaintProduct {
    id: string;
    categoryId: string;
    name: string;
    thumbnail: string;
    description?: string;
    dataSheetPath?: string;
    dataSheetName?: string;
    usage?: string;
    features?: string;
    specification?: string;
    instructions?: string;
    order: number;
    isActive: boolean;
}

// Modal Component
function Modal({ isOpen, onClose, title, children }: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-2xl max-h-[90vh] bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-zinc-700">
                    <h3 className="text-lg font-bold text-white">{title}</h3>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default function PaintProductsPage() {
    const [categories, setCategories] = useState<PaintCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
    const [activeMainCategory, setActiveMainCategory] = useState<string>('building');

    // Modal states
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const [productModalOpen, setProductModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<PaintCategory | null>(null);
    const [editingProduct, setEditingProduct] = useState<PaintProduct | null>(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');

    // Form states
    const [categoryForm, setCategoryForm] = useState({ mainCategory: 'building', slug: '', name: '', order: 0, isActive: true });
    const [productForm, setProductForm] = useState({
        name: '',
        thumbnail: '',
        description: '',
        dataSheetPath: '',
        dataSheetName: '',
        usage: '',
        features: '',
        specification: '',
        instructions: '',
        order: 0,
        isActive: true
    });
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    // 파일 업로드 핸들러 (Vercel Blob 클라이언트 업로드)
    const handleFileUpload = async (file: File, type: 'thumbnail' | 'dataSheet') => {
        // 파일 크기 체크 (50MB)
        if (file.size > 50 * 1024 * 1024) {
            alert('파일 크기는 50MB를 초과할 수 없습니다.');
            return;
        }

        setUploading(true);
        try {
            // Vercel 환경: 클라이언트 직접 업로드
            const isVercel = window.location.hostname.includes('vercel.app') ||
                !window.location.hostname.includes('localhost');

            if (isVercel) {
                const newBlob = await upload(file.name, file, {
                    access: 'public',
                    handleUploadUrl: '/api/upload',
                });

                if (type === 'thumbnail') {
                    setProductForm(prev => ({ ...prev, thumbnail: newBlob.url }));
                } else {
                    setProductForm(prev => ({
                        ...prev,
                        dataSheetPath: newBlob.url,
                        dataSheetName: file.name
                    }));
                }
            } else {
                // 로컬 환경: 기존 FormData 방식
                const formData = new FormData();
                formData.append('file', file);
                formData.append('type', type === 'thumbnail' ? 'image' : 'attachment');

                const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData
                });

                const data = await res.json();
                if (res.ok && data.url) {
                    if (type === 'thumbnail') {
                        setProductForm(prev => ({ ...prev, thumbnail: data.url }));
                    } else {
                        setProductForm(prev => ({
                            ...prev,
                            dataSheetPath: data.url,
                            dataSheetName: data.originalName
                        }));
                    }
                } else {
                    alert(data.error || '업로드 실패');
                }
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('파일 업로드 중 오류가 발생했습니다.');
        } finally {
            setUploading(false);
        }
    };

    // Fetch data
    const fetchData = useCallback(async () => {
        try {
            const res = await fetch('/api/admin/paint-products');
            const data = await res.json();
            if (res.ok) {
                setCategories(data.categories || []);
            }
        } catch (error) {
            console.error('Failed to fetch:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Filter categories by main category
    const filteredCategories = categories.filter(c => c.mainCategory === activeMainCategory);

    // Toggle category expansion
    const toggleCategory = (id: string) => {
        const newSet = new Set(expandedCategories);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setExpandedCategories(newSet);
    };

    // Open category modal
    const openCategoryModal = (category?: PaintCategory) => {
        if (category) {
            setEditingCategory(category);
            setCategoryForm({
                mainCategory: category.mainCategory,
                slug: category.slug,
                name: category.name,
                order: category.order,
                isActive: category.isActive
            });
        } else {
            setEditingCategory(null);
            setCategoryForm({ mainCategory: activeMainCategory, slug: '', name: '', order: filteredCategories.length, isActive: true });
        }
        setCategoryModalOpen(true);
    };

    // Open product modal
    const openProductModal = (categoryId: string, product?: PaintProduct) => {
        setSelectedCategoryId(categoryId);
        if (product) {
            setEditingProduct(product);
            setProductForm({
                name: product.name,
                thumbnail: product.thumbnail,
                description: product.description || '',
                dataSheetPath: product.dataSheetPath || '',
                dataSheetName: product.dataSheetName || '',
                usage: product.usage || '',
                features: product.features || '',
                specification: product.specification || '',
                instructions: product.instructions || '',
                order: product.order,
                isActive: product.isActive
            });
        } else {
            setEditingProduct(null);
            const category = categories.find(c => c.id === categoryId);
            setProductForm({
                name: '',
                thumbnail: '',
                description: '',
                dataSheetPath: '',
                dataSheetName: '',
                usage: '',
                features: '',
                specification: '',
                instructions: '',
                order: category?.products?.length || 0,
                isActive: true
            });
        }
        setProductModalOpen(true);
    };

    // Save category
    const saveCategory = async () => {
        setSaving(true);
        try {
            const url = editingCategory
                ? `/api/admin/paint-products/${editingCategory.id}`
                : '/api/admin/paint-products';
            const method = editingCategory ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'category', ...categoryForm })
            });

            if (res.ok) {
                setCategoryModalOpen(false);
                fetchData();
            } else {
                alert('저장 실패');
            }
        } catch (error) {
            console.error('Save category error:', error);
            alert('저장 중 오류 발생');
        } finally {
            setSaving(false);
        }
    };

    // Save product
    const saveProduct = async () => {
        setSaving(true);
        try {
            const url = editingProduct
                ? `/api/admin/paint-products/${editingProduct.id}`
                : '/api/admin/paint-products';
            const method = editingProduct ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'product',
                    categoryId: selectedCategoryId,
                    ...productForm
                })
            });

            if (res.ok) {
                setProductModalOpen(false);
                fetchData();
            } else {
                alert('저장 실패');
            }
        } catch (error) {
            console.error('Save product error:', error);
            alert('저장 중 오류 발생');
        } finally {
            setSaving(false);
        }
    };

    // Delete category
    const deleteCategory = async (id: string) => {
        if (!confirm('이 카테고리와 모든 제품을 삭제하시겠습니까?')) return;

        try {
            const res = await fetch(`/api/admin/paint-products/${id}?type=category`, {
                method: 'DELETE'
            });
            if (res.ok) {
                fetchData();
            }
        } catch (error) {
            console.error('Delete category error:', error);
        }
    };

    // Delete product
    const deleteProduct = async (id: string) => {
        if (!confirm('이 제품을 삭제하시겠습니까?')) return;

        try {
            const res = await fetch(`/api/admin/paint-products/${id}?type=product`, {
                method: 'DELETE'
            });
            if (res.ok) {
                fetchData();
            }
        } catch (error) {
            console.error('Delete product error:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">페인트 제품 관리</h1>
                    <p className="text-zinc-400 text-sm mt-1">메인 카테고리별로 서브 카테고리와 제품을 관리합니다.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => openCategoryModal()}
                        className="flex items-center gap-2 px-4 py-2 bg-zinc-700 text-white text-sm font-bold rounded-lg hover:bg-zinc-600 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        서브 카테고리 추가
                    </button>
                    <button
                        onClick={() => {
                            // 첫 번째 카테고리 선택하여 제품 추가 모달 열기
                            const firstCategory = filteredCategories[0];
                            if (firstCategory) {
                                openProductModal(firstCategory.id);
                            } else {
                                alert('먼저 서브 카테고리를 추가해주세요.');
                            }
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        제품 추가
                    </button>
                </div>
            </div>

            {/* Main Category Tabs */}
            <div className="flex gap-2 border-b border-zinc-700 pb-2">
                {MAIN_CATEGORIES.map((mc) => (
                    <button
                        key={mc.id}
                        onClick={() => setActiveMainCategory(mc.id)}
                        className={`px-4 py-2 text-sm font-bold rounded-t transition-colors ${activeMainCategory === mc.id
                            ? 'bg-zinc-700 text-white'
                            : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                            }`}
                    >
                        {mc.name}
                        <span className="ml-2 text-xs text-zinc-500">
                            ({categories.filter(c => c.mainCategory === mc.id).length})
                        </span>
                    </button>
                ))}
            </div>

            {/* Sub Categories List */}
            <div className="space-y-4">
                {filteredCategories.length === 0 ? (
                    <div className="text-center py-12 text-zinc-500">
                        등록된 서브 카테고리가 없습니다. 서브 카테고리를 추가해주세요.
                    </div>
                ) : (
                    filteredCategories.map((category) => (
                        <div key={category.id} className="bg-zinc-800 border border-zinc-700 rounded-lg overflow-hidden">
                            {/* Category Header */}
                            <div className="flex items-center justify-between p-4 bg-zinc-800/50">
                                <button
                                    onClick={() => toggleCategory(category.id)}
                                    className="flex items-center gap-3 text-left flex-1"
                                >
                                    {expandedCategories.has(category.id) ? (
                                        <ChevronDown className="w-5 h-5 text-zinc-400" />
                                    ) : (
                                        <ChevronRight className="w-5 h-5 text-zinc-400" />
                                    )}
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-white">{category.name}</span>
                                            <span className="text-xs px-2 py-0.5 bg-zinc-700 text-zinc-400 rounded">
                                                {category.slug}
                                            </span>
                                            {!category.isActive && (
                                                <span className="text-xs px-2 py-0.5 bg-red-900/50 text-red-400 rounded">
                                                    비활성
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-xs text-zinc-500">
                                            {category.products?.length || 0}개 제품
                                        </span>
                                    </div>
                                </button>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => openProductModal(category.id)}
                                        className="p-2 text-zinc-400 hover:text-green-400 hover:bg-zinc-700 rounded transition-colors"
                                        title="제품 추가"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => openCategoryModal(category)}
                                        className="p-2 text-zinc-400 hover:text-blue-400 hover:bg-zinc-700 rounded transition-colors"
                                        title="카테고리 수정"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => deleteCategory(category.id)}
                                        className="p-2 text-zinc-400 hover:text-red-400 hover:bg-zinc-700 rounded transition-colors"
                                        title="카테고리 삭제"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Products List */}
                            {expandedCategories.has(category.id) && (
                                <div className="border-t border-zinc-700">
                                    {category.products?.length > 0 ? (
                                        <div className="divide-y divide-zinc-700/50">
                                            {category.products.map((product) => (
                                                <div
                                                    key={product.id}
                                                    className="flex items-center gap-4 p-4 hover:bg-zinc-700/30 transition-colors"
                                                >
                                                    <GripVertical className="w-4 h-4 text-zinc-600 cursor-grab" />

                                                    {/* Thumbnail */}
                                                    <div className="w-12 h-12 bg-zinc-700 rounded overflow-hidden flex-shrink-0">
                                                        {product.thumbnail ? (
                                                            <img
                                                                src={product.thumbnail}
                                                                alt={product.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <ImageIcon className="w-5 h-5 text-zinc-500" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Product Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium text-white truncate">
                                                                {product.name}
                                                            </span>
                                                            {product.dataSheetPath && (
                                                                <span title="DataSheet 있음">
                                                                    <FileText className="w-4 h-4 text-blue-400" />
                                                                </span>
                                                            )}
                                                            {!product.isActive && (
                                                                <span className="text-xs px-2 py-0.5 bg-red-900/50 text-red-400 rounded">
                                                                    비활성
                                                                </span>
                                                            )}
                                                        </div>
                                                        {product.description && (
                                                            <p className="text-xs text-zinc-500 truncate mt-0.5">
                                                                {product.description}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            onClick={() => openProductModal(category.id, product)}
                                                            className="p-2 text-zinc-400 hover:text-blue-400 hover:bg-zinc-700 rounded transition-colors"
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => deleteProduct(product.id)}
                                                            className="p-2 text-zinc-400 hover:text-red-400 hover:bg-zinc-700 rounded transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-8 text-center text-zinc-500 text-sm">
                                            등록된 제품이 없습니다.
                                            <button
                                                onClick={() => openProductModal(category.id)}
                                                className="block mx-auto mt-2 text-blue-400 hover:text-blue-300"
                                            >
                                                + 제품 추가
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Category Modal */}
            <Modal
                isOpen={categoryModalOpen}
                onClose={() => setCategoryModalOpen(false)}
                title={editingCategory ? '서브 카테고리 수정' : '서브 카테고리 추가'}
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">
                            메인 카테고리 <span className="text-red-400">*</span>
                        </label>
                        <select
                            value={categoryForm.mainCategory}
                            onChange={(e) => setCategoryForm({ ...categoryForm, mainCategory: e.target.value })}
                            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded text-white focus:border-blue-500 focus:outline-none"
                        >
                            {MAIN_CATEGORIES.map((mc) => (
                                <option key={mc.id} value={mc.id}>{mc.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">
                            서브 카테고리명 <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={categoryForm.name}
                            onChange={(e) => {
                                const name = e.target.value;
                                // 자동으로 slug 생성 (영문 소문자, 특수문자 제거)
                                const autoSlug = name
                                    .toLowerCase()
                                    .replace(/[^a-z0-9가-힣\s]/gi, '')
                                    .replace(/\s+/g, '-')
                                    .replace(/-+/g, '-');
                                setCategoryForm({ ...categoryForm, name, slug: autoSlug });
                            }}
                            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded text-white focus:border-blue-500 focus:outline-none"
                            placeholder="예: 인테리어페인트"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">
                            슬러그 (URL) <span className="text-xs text-zinc-500">(자동 생성)</span>
                        </label>
                        <input
                            type="text"
                            value={categoryForm.slug}
                            readOnly
                            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-zinc-400 cursor-not-allowed"
                            placeholder="서브 카테고리명 입력 시 자동 생성"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-1">정렬 순서</label>
                            <input
                                type="number"
                                value={categoryForm.order}
                                onChange={(e) => setCategoryForm({ ...categoryForm, order: parseInt(e.target.value) || 0 })}
                                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded text-white focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div className="flex items-center gap-2 pt-6">
                            <input
                                type="checkbox"
                                id="categoryActive"
                                checked={categoryForm.isActive}
                                onChange={(e) => setCategoryForm({ ...categoryForm, isActive: e.target.checked })}
                                className="w-4 h-4"
                            />
                            <label htmlFor="categoryActive" className="text-sm text-zinc-300">활성화</label>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-4 border-t border-zinc-700">
                        <button
                            onClick={() => setCategoryModalOpen(false)}
                            className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
                        >
                            취소
                        </button>
                        <button
                            onClick={saveCategory}
                            disabled={saving || !categoryForm.name || !categoryForm.slug}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            저장
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Product Modal */}
            <Modal
                isOpen={productModalOpen}
                onClose={() => setProductModalOpen(false)}
                title={editingProduct ? '제품 수정' : '제품 추가'}
            >
                <div className="space-y-4">
                    {/* 서브 카테고리 선택 */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">
                            서브 카테고리 <span className="text-red-400">*</span>
                        </label>
                        <select
                            value={selectedCategoryId}
                            onChange={(e) => setSelectedCategoryId(e.target.value)}
                            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded text-white focus:border-blue-500 focus:outline-none"
                        >
                            <option value="">서브 카테고리 선택</option>
                            {filteredCategories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* 제품명 */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">
                            제품명 <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={productForm.name}
                            onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded text-white focus:border-blue-500 focus:outline-none"
                            placeholder="예: 숲으로FLE-X"
                        />
                    </div>

                    {/* Slug URL 자동 생성 (읽기 전용) */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">
                            슬러그 URL <span className="text-xs text-zinc-500">(자동 생성)</span>
                        </label>
                        <input
                            type="text"
                            value={productForm.name
                                ? productForm.name.toLowerCase().replace(/[^a-z0-9가-힣]/gi, '-').replace(/-+/g, '-')
                                : ''
                            }
                            readOnly
                            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-zinc-400 cursor-not-allowed"
                            placeholder="제품명 입력 시 자동 생성"
                        />
                    </div>

                    {/* 간단 요약설명 */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">
                            간단 요약설명
                        </label>
                        <textarea
                            value={productForm.description}
                            onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                            rows={3}
                            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded text-white focus:border-blue-500 focus:outline-none resize-none"
                            placeholder="예: 고급형 특수 에멀전 수지를 사용한 수성 도료로서, 내오염성 및 Easy Cleaning, 내스크래치성이 우수하며..."
                        />
                    </div>

                    {/* 제품 이미지 업로드 */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">
                            제품 이미지 <span className="text-red-400">*</span>
                        </label>
                        <div className="space-y-2">
                            {/* 이미지 미리보기 */}
                            {productForm.thumbnail && (
                                <div className="relative w-32 h-32 bg-zinc-700 rounded-lg overflow-hidden">
                                    <img
                                        src={productForm.thumbnail}
                                        alt="제품 이미지 미리보기"
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setProductForm({ ...productForm, thumbnail: '' })}
                                        className="absolute top-1 right-1 p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                                    >
                                        <X className="w-3 h-3 text-white" />
                                    </button>
                                </div>
                            )}
                            {/* 파일 업로드 영역 */}
                            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-zinc-600 rounded-lg cursor-pointer hover:bg-zinc-800 hover:border-zinc-500 transition-colors">
                                <div className="flex flex-col items-center justify-center py-2">
                                    {uploading ? (
                                        <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
                                    ) : (
                                        <Upload className="w-6 h-6 text-zinc-400 mb-1" />
                                    )}
                                    <p className="text-xs text-zinc-400">
                                        {uploading ? '업로드 중...' : '이미지 파일을 선택하거나 드래그하세요'}
                                    </p>
                                    <p className="text-xs text-zinc-500">(jpg, png, gif, webp)</p>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleFileUpload(file, 'thumbnail');
                                    }}
                                    disabled={uploading}
                                />
                            </label>
                        </div>
                    </div>

                    {/* DataSheet 파일 업로드 */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">DataSheet 파일</label>
                        <div className="space-y-2">
                            {/* 업로드된 파일 표시 */}
                            {productForm.dataSheetPath && (
                                <div className="flex items-center gap-2 p-2 bg-zinc-700 rounded">
                                    <FileText className="w-5 h-5 text-blue-400" />
                                    <span className="text-sm text-zinc-300 flex-1 truncate">
                                        {productForm.dataSheetName || productForm.dataSheetPath}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setProductForm({ ...productForm, dataSheetPath: '', dataSheetName: '' })}
                                        className="p-1 hover:bg-zinc-600 rounded transition-colors"
                                    >
                                        <X className="w-4 h-4 text-zinc-400" />
                                    </button>
                                </div>
                            )}
                            {/* 파일 업로드 버튼 */}
                            <label className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-zinc-600 rounded cursor-pointer hover:bg-zinc-800 hover:border-zinc-500 transition-colors">
                                {uploading ? (
                                    <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                                ) : (
                                    <Upload className="w-4 h-4 text-zinc-400" />
                                )}
                                <span className="text-sm text-zinc-400">
                                    {uploading ? '업로드 중...' : 'DataSheet 파일 선택'}
                                </span>
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleFileUpload(file, 'dataSheet');
                                    }}
                                    disabled={uploading}
                                />
                            </label>
                        </div>
                    </div>

                    {/* 용도 */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">용도</label>
                        <textarea
                            value={productForm.usage}
                            onChange={(e) => setProductForm({ ...productForm, usage: e.target.value })}
                            rows={3}
                            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded text-white focus:border-blue-500 focus:outline-none resize-none"
                            placeholder="예: - 콘크리트 및 모르타르 등으로 마감한 건물의 내부 마감 상도&#10;- 아파트, 오피스텔, 상가, 학교, 병원 등의 인테리어용"
                        />
                    </div>

                    {/* 특성 */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">특성</label>
                        <textarea
                            value={productForm.features}
                            onChange={(e) => setProductForm({ ...productForm, features: e.target.value })}
                            rows={2}
                            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded text-white focus:border-blue-500 focus:outline-none resize-none"
                            placeholder="예: 내오염성, Easy Cleaning, 내스크래치성"
                        />
                    </div>

                    {/* 규격 */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">규격</label>
                        <textarea
                            value={productForm.specification}
                            onChange={(e) => setProductForm({ ...productForm, specification: e.target.value })}
                            rows={2}
                            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded text-white focus:border-blue-500 focus:outline-none resize-none"
                            placeholder="예: 0.9L, 3.78L, 10L"
                        />
                    </div>

                    {/* 사용방법 */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">사용방법</label>
                        <textarea
                            value={productForm.instructions}
                            onChange={(e) => setProductForm({ ...productForm, instructions: e.target.value })}
                            rows={3}
                            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded text-white focus:border-blue-500 focus:outline-none resize-none"
                            placeholder="예: 붓, 롤러를 사용하여 2~3회 도장해주세요.&#10;최대 3시간이면 모두 말라요."
                        />
                    </div>

                    {/* 정렬순서 & 활성화 */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-1">정렬 순서</label>
                            <input
                                type="number"
                                value={productForm.order}
                                onChange={(e) => setProductForm({ ...productForm, order: parseInt(e.target.value) || 0 })}
                                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded text-white focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div className="flex items-center gap-2 pt-6">
                            <input
                                type="checkbox"
                                id="productActive"
                                checked={productForm.isActive}
                                onChange={(e) => setProductForm({ ...productForm, isActive: e.target.checked })}
                                className="w-4 h-4"
                            />
                            <label htmlFor="productActive" className="text-sm text-zinc-300">활성화</label>
                        </div>
                    </div>

                    {/* 버튼 */}
                    <div className="flex justify-end gap-2 pt-4 border-t border-zinc-700">
                        <button
                            onClick={() => setProductModalOpen(false)}
                            className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
                        >
                            취소
                        </button>
                        <button
                            onClick={saveProduct}
                            disabled={saving || !selectedCategoryId || !productForm.name || !productForm.thumbnail}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            저장
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
