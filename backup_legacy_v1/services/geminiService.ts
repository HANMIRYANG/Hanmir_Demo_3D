import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

// Initialize the client only if the key exists to prevent immediate crashes,
// handling the check inside the function call.
let ai: GoogleGenAI | null = null;
if (API_KEY) {
    ai = new GoogleGenAI({ apiKey: API_KEY });
}

export const generateTechnicalResponse = async (
    userQuery: string,
    context: string
): Promise<string> => {
    if (!ai) {
        return "시스템 알림: API 설정이 완료되지 않았습니다. 관리자에게 문의하세요.";
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `사용자 질문: ${userQuery}`,
            config: {
                systemInstruction: `당신은 한미르(주)의 기술 영업 AI 어시스턴트인 'HANMIR AI'입니다.
                
                당신의 어조: 전문적이고 신뢰감 있으며, 간결하고 명확하게 답변하십시오. 기술적인 내용은 정확하게 전달하십시오.
                당신의 목표: 엔지니어 및 구매 담당자가 한미르의 기능성 도료 기술을 이해하도록 돕는 것입니다.
                
                회사 정보 (Context):
                - 한미르(주)는 고기능성 특수 도료 전문 기업입니다.
                - 주요 제품: 불연 코팅제, 방열(Heat Dissipation) 페인트, 전자파 차폐(EMI Shielding) 도료, 고내열성 세라믹 코팅제.
                - 핵심 가치: "혁신", "안전", "친환경", "초내구성".
                - 현재 사용자 상황: ${context}
                
                답변 규칙:
                1. 한국어로 답변하십시오.
                2. 가격 문의 시 "상세 견적은 영업팀에 직접 문의해 주시기 바랍니다."라고 안내하십시오.
                3. 상세한 기술 사양 요청이 아닌 경우 3문장 이내로 답변하십시오.`,
            },
        });

        return response.text || "시스템 오류: 응답을 생성할 수 없습니다.";
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "시스템 알림: 일시적인 통신 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
    }
};