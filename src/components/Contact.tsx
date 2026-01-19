"use client";

import React from 'react';
import { useTranslations } from "next-intl";

// ============================================================================
// [Contact.tsx] - 문의하기 폼 컴포넌트 (다국어 지원)
// ============================================================================

export const Contact: React.FC = () => {
    const t = useTranslations();

    return (
        <section id="contact" className="py-32 bg-gray-50 relative border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20">
                {/* 좌측 정보 영역 */}
                <div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 tracking-tight leading-tight">
                        {t('contact.title')}
                    </h2>
                    <p className="text-gray-500 text-lg mb-12 max-w-md break-keep">
                        {t('contact.description')}
                    </p>

                    <div className="space-y-8">
                        <div>
                            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-2">
                                {t('contact.info.address')}
                            </h4>
                            <p className="text-gray-500">{t('footer.address')}</p>
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-2">
                                {t('contact.info.email')}
                            </h4>
                            <p className="text-gray-500">hanmir@hanmirfe.com<br />1533-2112</p>
                        </div>
                    </div>
                </div>

                {/* 문의 폼 영역 */}
                <form className="space-y-6" onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const formData = {
                        name: (form.querySelector('input[name="name"]') as HTMLInputElement).value,
                        company: (form.querySelector('input[name="company"]') as HTMLInputElement).value,
                        phone: (form.querySelector('input[name="phone"]') as HTMLInputElement).value,
                        email: (form.querySelector('input[name="email"]') as HTMLInputElement).value,
                        interest: (form.querySelector('select') as HTMLSelectElement).value,
                        message: (form.querySelector('textarea') as HTMLTextAreaElement).value
                    };

                    const button = form.querySelector('button');
                    if (button) {
                        button.disabled = true;
                        button.textContent = t('contact.form.submitting');
                    }

                    try {
                        const res = await fetch('/api/inquiries', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(formData)
                        });

                        const result = await res.json();

                        if (res.ok) {
                            alert(t('contact.success'));
                            form.reset();
                        } else {
                            alert(t('contact.error'));
                        }
                    } catch (error) {
                        alert(t('contact.error'));
                    } finally {
                        if (button) {
                            button.disabled = false;
                            button.textContent = t('contact.form.submit');
                        }
                    }
                }}>
                    {/* Row 1: 담당자 성명 | 업체명 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500">
                                {t('contact.form.name')} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                required
                                className="w-full bg-white border border-gray-300 p-4 text-gray-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors rounded-none placeholder-gray-400"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500">
                                {t('contact.form.company')}
                            </label>
                            <input
                                type="text"
                                name="company"
                                className="w-full bg-white border border-gray-300 p-4 text-gray-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors rounded-none placeholder-gray-400"
                            />
                        </div>
                    </div>

                    {/* Row 2: 연락처 | 이메일 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500">
                                {t('contact.form.phone')} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                required
                                className="w-full bg-white border border-gray-300 p-4 text-gray-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors rounded-none placeholder-gray-400"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500">
                                {t('contact.form.email')} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                required
                                className="w-full bg-white border border-gray-300 p-4 text-gray-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors rounded-none placeholder-gray-400"
                            />
                        </div>
                    </div>

                    {/* Interest Dropdown */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500">{t('contact.form.interest')}</label>
                        <select
                            name="interest"
                            className="w-full bg-white border border-gray-300 p-4 text-gray-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors rounded-none appearance-none"
                        >
                            <option>{t('contact.form.interestOptions.automotive')}</option>
                            <option>{t('contact.form.interestOptions.ship')}</option>
                            <option>{t('contact.form.interestOptions.construction')}</option>
                            <option>{t('contact.form.interestOptions.other')}</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500">{t('contact.form.message')}</label>
                        <textarea
                            name="message"
                            rows={4}
                            className="w-full bg-white border border-gray-300 p-4 text-gray-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors rounded-none placeholder-gray-400"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gray-900 text-white font-bold py-5 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {t('contact.form.submit')}
                    </button>
                </form>
            </div>
        </section>
    );
};