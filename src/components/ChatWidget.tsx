"use client";

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Cpu, Loader2 } from 'lucide-react';
import { generateTechnicalResponse } from '../services/geminiService';
import { Message } from '../types';

// ============================================================================
// [ChatWidget.tsx] - AI 채팅 위젯 컴포넌트
// ============================================================================
// 이 파일은 좌측 하단에 표시되는 AI 기술 상담 채팅 위젯입니다.
// Gemini AI를 활용하여 사용자 질문에 자동 응답합니다.
// ============================================================================

export const ChatWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // ============================================================================
    // 🔧 [수정 포인트 #1] 초기 인사 메시지
    // ============================================================================
    // AI가 처음 보여주는 환영 메시지입니다.
    // 아래 text 값을 수정하면 초기 메시지가 변경됩니다.
    // ============================================================================
    const [messages, setMessages] = useState<Message[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // 클라이언트에서만 초기 메시지 설정 (Hydration 오류 방지)
    useEffect(() => {
        if (!isInitialized) {
            setMessages([{
                id: 'init',
                role: 'model',
                text: '안녕하세요. 한미르(주) 기술 지원 AI입니다. 해당 AI는 Gemini 를 기반으로 하였기 때문에 정확한 정보는 문의하기를 통해 주시길 바랍니다.',
                timestamp: new Date()
            }]);
            setIsInitialized(true);
        }
    }, [isInitialized]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            text: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        // AI 응답 생성 - geminiService.ts 에서 처리
        const responseText = await generateTechnicalResponse(userMsg.text, '사용자가 기술소개 페이지를 보고 있습니다.');

        const botMsg: Message = {
            id: (Date.now() + 1).toString(),
            role: 'model',
            text: responseText,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, botMsg]);
        setIsLoading(false);
    };

    return (
        <>
            {/* ================================================================
                🔧 [수정 포인트 #2] 채팅 열기 버튼
                버튼 텍스트 "AI 기술상담"을 수정하면 변경됩니다.
            ================================================================ */}
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-8 left-8 z-40 flex items-center gap-3 px-6 py-4 bg-white text-black hover:bg-zinc-200 transition-all shadow-2xl ${isOpen ? 'hidden' : 'flex'}`}
            >
                <Cpu className="w-5 h-5" />
                <span className="font-bold tracking-tight text-xs">AI 기술상담</span>
            </button>

            {/* 채팅 인터페이스 */}
            <div
                className={`fixed bottom-0 left-0 md:bottom-8 md:left-8 w-full md:w-[400px] bg-black border border-zinc-800 shadow-2xl z-50 transition-all duration-300 transform ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
                    }`}
                style={{ height: isOpen ? '600px' : '0' }}
            >
                {/* ============================================================
                    🔧 [수정 포인트 #3] 채팅창 헤더
                    "HANMIR AI v2.0" 텍스트를 수정하면 AI 이름이 변경됩니다.
                ============================================================ */}
                <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-950">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="font-bold text-xs text-zinc-400">HANMIR AI v2.0</span>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* 메시지 영역 */}
                <div className="flex-1 overflow-y-auto p-4 h-[calc(600px-130px)] bg-black/95">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[85%] p-4 text-sm leading-relaxed ${msg.role === 'user'
                                    ? 'bg-zinc-800 text-white border border-zinc-700'
                                    : 'bg-transparent text-zinc-300 border border-zinc-800'
                                    }`}
                            >
                                <p className="break-keep">{msg.text}</p>
                                <span className="block mt-2 text-[10px] text-zinc-600 font-mono uppercase">
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start mb-4">
                            <div className="bg-transparent border border-zinc-800 p-4 flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin text-zinc-500" />
                                <span className="text-xs text-zinc-500">답변 생성 중...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* ============================================================
                    🔧 [수정 포인트 #4] 입력창 placeholder
                    아래 placeholder 텍스트를 수정하면 안내문구가 변경됩니다.
                ============================================================ */}
                <div className="absolute bottom-0 w-full p-4 bg-zinc-950 border-t border-zinc-800">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="궁금한 내용을 입력하세요..."
                            className="flex-1 bg-black border border-zinc-800 text-white text-sm px-4 py-3 focus:outline-none focus:border-white transition-colors"
                        />
                        <button
                            onClick={handleSend}
                            disabled={isLoading}
                            className="bg-white text-black px-4 hover:bg-zinc-200 transition-colors disabled:opacity-50"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};