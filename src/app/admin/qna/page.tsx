"use client";

import React, { useState, useEffect } from 'react';
import { MessageCircle, Eye, Send, ChevronDown, ChevronUp } from 'lucide-react';

interface QnaPost {
    id: string;
    number: number;
    author: string;
    email: string;
    phone: string;
    title: string;
    content: string;
    isAnswered: boolean;
    answer?: string;
    answeredAt?: string;
    views: number;
    createdAt: string;
}

export default function AdminQnaPage() {
    const [posts, setPosts] = useState<QnaPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [answerText, setAnswerText] = useState<{ [key: string]: string }>({});
    const [submitting, setSubmitting] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'pending' | 'answered'>('all');

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await fetch('/api/qna?timestamp=' + Date.now(), { cache: 'no-store' });
            const data = await res.json();
            if (res.ok && data.posts) {
                // 관리자용으로 전체 데이터 다시 가져오기 (이메일, 전화번호 포함)
                const adminRes = await fetch('/api/admin/qna?timestamp=' + Date.now(), { cache: 'no-store' });
                const adminData = await adminRes.json();
                if (adminRes.ok && adminData.posts) {
                    setPosts(adminData.posts);
                } else {
                    setPosts(data.posts);
                }
            }
        } catch (error) {
            console.error("Failed to fetch posts:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitAnswer = async (postId: string) => {
        const answer = answerText[postId];
        if (!answer || answer.trim() === '') {
            alert('답변 내용을 입력해주세요.');
            return;
        }

        setSubmitting(postId);
        try {
            const res = await fetch(`/api/admin/qna/${postId}/answer`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answer })
            });
            const data = await res.json();
            if (res.ok) {
                alert('답변이 등록되었습니다. 작성자에게 이메일 알림이 발송됩니다.');
                setAnswerText({ ...answerText, [postId]: '' });
                fetchPosts();
            } else {
                alert(data.error || '답변 등록에 실패했습니다.');
            }
        } catch (error) {
            alert('오류가 발생했습니다.');
        } finally {
            setSubmitting(null);
        }
    };

    const filteredPosts = posts.filter(post => {
        if (filter === 'pending') return !post.isAnswered;
        if (filter === 'answered') return post.isAnswered;
        return true;
    });

    const pendingCount = posts.filter(p => !p.isAnswered).length;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">문의게시판 관리</h1>
                    <p className="text-gray-500 mt-1">
                        총 {posts.length}건 |
                        <span className="text-amber-600 font-bold ml-2">답변 대기 {pendingCount}건</span>
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 text-sm font-bold transition-colors ${filter === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        전체
                    </button>
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-4 py-2 text-sm font-bold transition-colors ${filter === 'pending' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        대기 ({pendingCount})
                    </button>
                    <button
                        onClick={() => setFilter('answered')}
                        className={`px-4 py-2 text-sm font-bold transition-colors ${filter === 'answered' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        완료
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-400">로딩 중...</div>
            ) : filteredPosts.length === 0 ? (
                <div className="text-center py-12 text-gray-400">문의글이 없습니다.</div>
            ) : (
                <div className="space-y-4">
                    {filteredPosts.map((post) => (
                        <div key={post.id} className="border border-gray-200 rounded-lg overflow-hidden">
                            {/* 헤더 */}
                            <div
                                className={`flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors ${!post.isAnswered ? 'bg-amber-50' : 'bg-white'}`}
                                onClick={() => setExpandedId(expandedId === post.id ? null : post.id)}
                            >
                                <div className="flex items-center gap-4">
                                    <span className="text-gray-400 font-mono text-sm">#{post.number}</span>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{post.title}</h3>
                                        <p className="text-sm text-gray-500">
                                            {post.author} | {post.email} | {post.phone}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    {post.isAnswered ? (
                                        <span className="px-2 py-1 bg-green-100 text-green-600 text-xs font-bold rounded flex items-center gap-1">
                                            <MessageCircle className="w-3 h-3" />완료
                                        </span>
                                    ) : (
                                        <span className="px-2 py-1 bg-amber-100 text-amber-600 text-xs font-bold rounded">
                                            대기
                                        </span>
                                    )}
                                    <span className="text-gray-400 text-sm flex items-center gap-1">
                                        <Eye className="w-3 h-3" />{post.views}
                                    </span>
                                    {expandedId === post.id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                                </div>
                            </div>

                            {/* 확장 내용 */}
                            {expandedId === post.id && (
                                <div className="border-t border-gray-200 p-6 bg-gray-50">
                                    {/* 문의 내용 */}
                                    <div className="mb-6">
                                        <h4 className="text-sm font-bold text-gray-700 mb-2">문의 내용</h4>
                                        <div className="bg-white p-4 border border-gray-200 text-gray-700 whitespace-pre-wrap">
                                            {post.content}
                                        </div>
                                        <p className="text-xs text-gray-400 mt-2">
                                            작성일: {new Date(post.createdAt).toLocaleString()}
                                        </p>
                                    </div>

                                    {/* 기존 답변 또는 답변 입력 */}
                                    {post.isAnswered && post.answer ? (
                                        <div>
                                            <h4 className="text-sm font-bold text-green-600 mb-2 flex items-center gap-2">
                                                <MessageCircle className="w-4 h-4" />
                                                관리자 답변
                                                <span className="text-xs text-gray-400 font-normal ml-2">
                                                    {post.answeredAt && new Date(post.answeredAt).toLocaleString()}
                                                </span>
                                            </h4>
                                            <div className="bg-green-50 p-4 border border-green-200 text-gray-700 whitespace-pre-wrap">
                                                {post.answer}
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <h4 className="text-sm font-bold text-amber-600 mb-2">답변 작성</h4>
                                            <textarea
                                                rows={4}
                                                value={answerText[post.id] || ''}
                                                onChange={(e) => setAnswerText({ ...answerText, [post.id]: e.target.value })}
                                                className="w-full border border-gray-300 p-4 text-gray-900 focus:outline-none focus:border-amber-500 resize-none"
                                                placeholder="답변 내용을 입력하세요..."
                                            />
                                            <div className="flex justify-end mt-3">
                                                <button
                                                    onClick={() => handleSubmitAnswer(post.id)}
                                                    disabled={submitting === post.id}
                                                    className="flex items-center gap-2 px-6 py-2 bg-amber-500 text-white font-bold hover:bg-amber-600 transition-colors disabled:opacity-50"
                                                >
                                                    <Send className="w-4 h-4" />
                                                    {submitting === post.id ? '등록 중...' : '답변 등록'}
                                                </button>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-2">
                                                * 답변 등록 시 작성자({post.email})에게 이메일 알림이 발송됩니다.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
