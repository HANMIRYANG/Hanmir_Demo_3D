import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// ============================================================================
// [route.ts] - Gemini AI 채팅 API 엔드포인트
// ============================================================================
// 이 파일은 ChatWidget에서 보낸 사용자 메시지를 받아
// Google Gemini AI로 응답을 생성하는 API 라우트입니다.
// 경로: POST /api/chat
// ============================================================================

export async function POST(req: Request) {
    try {
        // ============================================================================
        // 🔧 [수정 포인트 #1] API 키 설정
        // ============================================================================
        // .env.local 또는 Vercel 환경변수의 GEMINI_API_KEY를 사용합니다.
        // Google AI Studio에서 API 키를 발급받으세요: https://aistudio.google.com/
        // ⚠️ 절대로 코드에 API 키를 직접 입력하지 마세요! (GitHub 유출 위험)
        // ============================================================================
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.error('GEMINI_API_KEY 환경변수가 설정되지 않았습니다.');
            return NextResponse.json(
                { error: "API Key not configured. Please set GEMINI_API_KEY environment variable." },
                { status: 500 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);

        // ============================================================================
        // 🔧 [수정 포인트 #2] AI 모델 선택
        // ============================================================================
        // 사용할 Gemini 모델을 지정합니다.
        // 옵션: "gemini-2.5-flash", "gemini-1.5-pro" 등
        // 참고: https://ai.google.dev/models/gemini
        // ============================================================================
        const modelName = "gemini-2.5-flash";

        const body = await req.json();
        const { userQuery, context } = body;

        // ============================================================================
        // 🔧 [수정 포인트 #3] 시스템 프롬프트 (AI 성격/역할 설정)
        // ============================================================================
        // 아래 텍스트를 수정하면 AI의 응답 스타일과 역할이 변경됩니다.
        // - 회사 정보, 제품 정보, 응답 규칙 등을 커스터마이징할 수 있습니다.
        // ============================================================================
        const systemInstructionText = `당신은 한미르(주)의 기술 영업 AI 어시스턴트인 'HANMIR AI'입니다.
    
        당신의 어조: 전문적이고 신뢰감 있으며, 간결하고 명확하게 답변하십시오.
        당신의 목표: 엔지니어 및 구매 담당자가 한미르의 기능성 도료 기술을 이해하도록 돕는 것입니다.
        
        회사 정보 (Context):
        - 한미르(주)는 고기능성 특수 도료 전문 기업입니다.
        - 주요 제품: 불연 코팅제, 방열(Heat Dissipation) 페인트, 전자파 차폐(EMI Shielding) 도료, 고내열성 세라믹 코팅제.
        - 핵심 가치: "혁신", "안전", "친환경", "초내구성".
        - 현재 사용자 상황: ${context || "일반 문의"}
        
        답변 규칙:
        1. 한국어로 답변하십시오.
        2. 가격 문의 시 "상세 견적은 영업팀에 직접 문의해 주시기 바랍니다."라고 안내하십시오.
        3. 수치, 온도, 두께 등 상세한 기술 스펙을 묻는 질문에는 절대 임의의 숫자를 지어내서 답변하지 마십시오.
        4. 위와 같은 기술 스펙 질문에는 "제품의 상세 스펙 및 정확한 수치 제원은 적용 환경에 따라 상이할 수 있습니다. 정확한 데이터는 공식 홈페이지 상단 메뉴의 [고객지원 > 문의하기](/ko/support/contact)를 통해 영업팀에 문의해 주시기 바랍니다." 라고 안내하십시오.
        5. 당신의 답변은 마크다운 형식을 지원합니다.`;

        const model = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: systemInstructionText,
        });

        console.log(`Model initialized: ${modelName}`);

        // 대화 히스토리 초기화 (첫 인사 메시지용)
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: "인사를 부탁해." }],
                },
                {
                    role: "model",
                    parts: [{ text: "반갑습니다. 한미르(주) 기술 영업 AI입니다. 무엇을 도와드릴까요?" }],
                }
            ],
        });

        // 사용자 메시지 전송 및 응답 받기
        const result = await chat.sendMessage(userQuery);
        const response = await result.response;
        const text = response.text();

        console.log("Response generated successfully");

        return NextResponse.json({ text });

    } catch (error: any) {
        console.error("Gemini API Error Full Details:", JSON.stringify(error, null, 2));

        return NextResponse.json(
            { error: `Gemini Error: ${error.message}` },
            { status: 500 }
        );
    }
}