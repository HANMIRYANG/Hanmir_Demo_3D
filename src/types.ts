// ============================================================================
// [types.ts] - 타입 정의 파일
// ============================================================================
// 이 파일은 프로젝트 전체에서 사용하는 TypeScript 타입/인터페이스를 정의합니다.
// 새로운 데이터 구조가 필요하면 여기에 인터페이스를 추가하세요.
// ============================================================================

// AI 채팅 메시지 타입 (ChatWidget에서 사용)
export interface Message {
    id: string;                    // 고유 식별자
    role: 'user' | 'model';        // 발신자 (user: 사용자, model: AI)
    text: string;                  // 메시지 내용
    timestamp: Date;               // 전송 시간
}

// 제품 스펙 타입 (제품 상세 페이지에서 사용)
export interface ProductSpec {
    id: string;                    // 고유 식별자
    name: string;                  // 제품명
    description: string;           // 제품 설명
    features: string[];            // 특징 목록
    icon: string;                  // 아이콘 이름 (lucide-react)
}

// 네비게이션 아이템 타입 (Navbar에서 사용)
export interface NavItem {
    label: string;                 // 표시 텍스트 (예: "기업소개")
    href: string;                  // 이동 경로 (예: "/company")
}