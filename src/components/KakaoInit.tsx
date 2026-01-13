"use client";

import { useEffect } from 'react';

// ============================================================================
// 카카오 SDK 초기화 컴포넌트
// ============================================================================
// 앱 전체에서 한 번만 초기화되도록 layout에 포함됩니다.
// 카카오 개발자센터에서 발급받은 JavaScript 키를 사용합니다.
// ============================================================================

declare global {
    interface Window {
        Kakao: any;
    }
}

export function KakaoInit() {
    useEffect(() => {
        // 카카오 SDK 스크립트 로드
        const script = document.createElement('script');
        script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js';
        script.integrity = 'sha384-DKYJZ8NLiK8MN4/C5P2dtSmLQ4KwPaoqAfyA/DfmEc1VDxu4yyC7wy6K1Ber8sJ4';
        script.crossOrigin = 'anonymous';
        script.async = true;

        script.onload = () => {
            // SDK 로드 후 초기화
            if (window.Kakao && !window.Kakao.isInitialized()) {
                const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
                if (kakaoKey) {
                    window.Kakao.init(kakaoKey);
                    console.log('Kakao SDK initialized:', window.Kakao.isInitialized());
                } else {
                    console.warn('Kakao JavaScript key not found in environment variables');
                }
            }
        };

        document.head.appendChild(script);

        return () => {
            // Cleanup: 스크립트가 필요 없어지면 제거
            if (document.head.contains(script)) {
                document.head.removeChild(script);
            }
        };
    }, []);

    return null; // 이 컴포넌트는 UI를 렌더링하지 않음
}
