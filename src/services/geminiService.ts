// ============================================================================
// [geminiService.ts] - Gemini AI 통신 서비스
// ============================================================================
// 이 파일은 프론트엔드에서 /api/chat 엔드포인트로 요청을 보내고
// AI 응답을 받아오는 서비스 레이어입니다.
// ChatWidget.tsx에서 이 함수를 호출합니다.
// ============================================================================

/**
 * Gemini AI에게 기술 관련 질문을 보내고 응답을 받습니다.
 * 
 * @param userQuery - 사용자가 입력한 질문 텍스트
 * @param context - 현재 사용자 상황 컨텍스트 (선택적)
 * @returns AI 응답 텍스트
 */
export const generateTechnicalResponse = async (
    userQuery: string,
    context: string
): Promise<string> => {
    try {
        // /api/chat 엔드포인트로 POST 요청
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userQuery, context }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Server Error Response:", errorData);
            if (errorData.error === 'API Key not configured') {
                return "시스템 알림: 서버에 API Key가 설정되지 않았습니다. 관리자에게 문의하세요.";
            }
            throw new Error(errorData.error || 'Network response was not ok');
        }

        const data = await response.json();
        return data.text;
    } catch (error) {
        console.error("Chat Service Error:", error);
        // 🔧 [수정 포인트] 에러 발생 시 표시할 메시지
        return "시스템 알림: 일시적인 통신 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
    }
};