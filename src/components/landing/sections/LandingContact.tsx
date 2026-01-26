"use client";
// ============================================================================
// LandingContact.tsx - 원페이지 랜딩 문의하기 섹션
// ============================================================================

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

interface Props {
    locale: 'en' | 'cn';
}

const content = {
    en: {
        tagline: "Get in Touch",
        title: "Contact Us",
        description: "Have questions about our products? We'd love to hear from you.",
        form: {
            name: "Your Name",
            email: "Email Address",
            company: "Company Name",
            message: "Message",
            submit: "Send Message",
            submitting: "Sending...",
            success: "Thank you for your message! We will get back to you soon."
        },
        info: {
            title: "Contact Information",
            address: "190 Dodam-ro, Seo-gu, Incheon, Korea",
            phone: "+82-32-561-2854",
            email: "hanmir@hanmirfe.com"
        }
    },
    cn: {
        tagline: "联系我们",
        title: "在线咨询",
        description: "如果您对我们的产品有任何疑问，请随时与我们联系。",
        form: {
            name: "您的姓名",
            email: "电子邮箱",
            company: "公司名称",
            message: "留言内容",
            submit: "发送消息",
            submitting: "发送中...",
            success: "感谢您的留言！我们将尽快回复您。"
        },
        info: {
            title: "联系方式",
            address: "韩国仁川广域市西区道淡路190号",
            phone: "+82-32-561-2854",
            email: "hanmir@hanmirfe.com"
        }
    }
};

export const LandingContact: React.FC<Props> = ({ locale }) => {
    const t = content[locale];
    const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/inquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    interest: 'general',
                    privacy: true
                })
            });

            if (response.ok) {
                setIsSuccess(true);
                setFormData({ name: '', email: '', company: '', message: '' });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-zinc-950 py-24">
            <div className="max-w-7xl mx-auto px-6">
                {/* 헤더 */}
                <div className="text-center mb-16">
                    <p className="text-sm tracking-[0.3em] text-amber-400 mb-4 uppercase">{t.tagline}</p>
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">{t.title}</h2>
                    <p className="text-lg text-zinc-400 max-w-2xl mx-auto">{t.description}</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* 문의 폼 */}
                    <div className="bg-zinc-900/50 rounded-2xl p-8 border border-zinc-800">
                        {isSuccess ? (
                            <div className="flex flex-col items-center justify-center h-full text-center py-12">
                                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                                <p className="text-lg text-white">{t.form.success}</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">{t.form.name}</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">{t.form.email}</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">{t.form.company}</label>
                                    <input
                                        type="text"
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">{t.form.message}</label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 resize-none"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 transition-colors disabled:opacity-50"
                                >
                                    <Send className="w-5 h-5" />
                                    {isSubmitting ? t.form.submitting : t.form.submit}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* 연락처 정보 */}
                    <div className="space-y-8">
                        <h3 className="text-2xl font-bold text-white">{t.info.title}</h3>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-6 h-6 text-amber-500" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-white mb-1">Address</h4>
                                    <p className="text-zinc-400">{t.info.address}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Phone className="w-6 h-6 text-amber-500" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-white mb-1">Phone</h4>
                                    <p className="text-zinc-400">{t.info.phone}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Mail className="w-6 h-6 text-amber-500" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-white mb-1">Email</h4>
                                    <p className="text-zinc-400">{t.info.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* 지도 플레이스홀더 */}
                        <div className="h-64 bg-zinc-800 rounded-xl overflow-hidden">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3169.123456!2d126.6789!3d37.4567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDI3JzI0LjEiTiAxMjbCsDQwJzQ0LjAiRQ!5e0!3m2!1sen!2skr!4v1234567890"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
