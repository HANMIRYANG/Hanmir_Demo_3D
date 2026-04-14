# 한미르(주) 공식 웹사이트 - Hanmir 3D

> **불연 · 단열 · 차열 기능성 도료 전문기업**
> 🔗 [https://hanmirfe.com](https://hanmirfe.com)

---

## 📋 프로젝트 개요

한미르(주)의 공식 기업 웹사이트입니다. 기능성 도료(불연, 단열, 차열, 방화코팅) 제품 소개, EV 전기차 지하주차장 화재안전 솔루션, 2차전지 면압패드, 기술자료 제공, AI 챗봇 상담, 고객 문의 및 Q&A, 관리자 콘텐츠 관리(CMS) 기능을 포함합니다.

---

## 🛠 기술 스택

### 프론트엔드

| 분류 | 기술 | 버전 |
|------|------|:---:|
| **프레임워크** | Next.js (App Router) | 16.1.1 |
| **언어** | TypeScript | 5.x |
| **UI 라이브러리** | React | 19.2.3 |
| **스타일링** | Tailwind CSS | 4.x |
| **3D 렌더링** | Three.js | 0.183 |
| **3D React 래퍼** | @react-three/fiber, @react-three/drei | 9.5 / 10.7 |
| **애니메이션** | Framer Motion | 12.34 |
| **아이콘** | Lucide React | 0.562 |
| **차트** | Recharts | 3.7 |
| **국제화 (i18n)** | next-intl (ko / en / cn) | 4.7 |
| **React Compiler** | babel-plugin-react-compiler | 1.0 |

### 백엔드 / 인프라

| 분류 | 기술 |
|------|------|
| **DB** | PostgreSQL (Neon Serverless) |
| **ORM** | Prisma 5.22 |
| **파일 저장** | Vercel Blob |
| **AI 연동** | Google Generative AI (Gemini) |
| **이메일 발송** | Nodemailer |
| **인증** | JWT (jsonwebtoken) + bcryptjs |
| **파일 압축** | JSZip |
| **환경변수** | dotenv |
| **배포** | Vercel |
| **도메인** | hanmirfe.com (Cloudflare 리다이렉트: hanmir.co) |

### 개발 도구

| 도구 | 용도 |
|------|------|
| **ESLint 9 + eslint-config-next** | 정적 분석 |
| **tsx** | TypeScript 스크립트 실행 (Prisma seed 등) |
| **Prisma CLI** | 스키마 마이그레이션 / 시드 |

---

## ✨ 주요 기능

### 🎨 제품 & 콘텐츠

- **제품 상세 페이지** — 동적 라우트 `[slug]` 기반, 카테고리별 SEO 메타데이터
- **기능성 페인트** — 건축 / 선박 / 일반공업 카테고리, DataSheet 제공
- **페인트 계산기(PaintCalculator)** — 면적 기반 필요 도료량 자동 계산
- **2차전지 면압패드** — 열폭주 방지 솔루션 전용 페이지
- **EV 화재안전 프리미엄 뷰** — 전기차 지하주차장 화재안전 인터랙티브 UI
- **3D 히어로 배경(HeroBackground3D)** — Three.js 기반 메인 히어로
- **시공사례 갤러리** — 현장 이미지, 네이버 스마트스토어 연계

### 🌐 사용자 상호작용

- **AI 챗봇(ChatWidget)** — Gemini 기반 실시간 상담
- **플로팅 문의 버튼(FloatingContactBtn)** — 전 페이지 고정 CTA
- **메인 팝업(MainPopup)** — 공지/이벤트 노출
- **통합 검색(SearchModal)** — 제품 / 자료 / 공지 통합 검색
- **Q&A 게시판(QnaBoard)** — 비밀번호 보호 문의글, 관리자 답변
- **카카오톡 연동(KakaoInit)** — 카카오 채널 / SDK 초기화
- **커스텀 커서(CustomCursor)** — (현재 비활성화)

### 🌍 다국어 지원

- `ko` (한국어) / `en` (English) / `cn` (中文) 3개 로케일
- `next-intl` 기반 locale segment 라우팅 (`/[locale]/...`)
- JSON 기반 메시지 번들 (`src/messages/ko|en|cn.json`)
- 로케일별 `alternate` 사이트맵 및 hreflang 생성

### 🔐 관리자 시스템 (`/admin`)

| 메뉴 | 기능 |
|------|------|
| **대시보드** | 최근 활동, 통계 |
| **페인트 제품** | 카테고리/제품 CRUD, DataSheet 업로드 |
| **기술자료실** | PDF/DOCX/XLSX 업로드 및 분류 |
| **공지사항** | 중요공지 고정, 썸네일/첨부 관리 |
| **미디어** | HANMIR NEWS / NOW / 홍보자료 관리 |
| **시공사례** | 이미지 갤러리, 스마트스토어 링크 |
| **회사 연혁** | 연도별 연혁 순서 관리 |
| **문의 내역(Inquiries)** | 읽음 처리, 상세 조회 |
| **Q&A 관리** | 답변 등록, 답변 완료 상태 |
| **활동 로그** | CREATE / UPDATE / DELETE 추적 |
| **사이트 설정** | 회사소개서 URL 등 key-value 설정 |
| **인증** | JWT + bcryptjs 로그인, 미들웨어 보호 |

### 📧 알림 & 연동

- **이메일 자동발송(Nodemailer)** — 문의 접수 시 담당자에게 알림
- **회사소개서 다운로드** — Vercel Blob 기반 PDF 배포
- **제품 공유(Product Share)** — 카드형 공유 URL 생성

---

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── layout.tsx                  # 루트 레이아웃 (SEO, 폰트, OG)
│   ├── sitemap.ts                  # 동적 사이트맵 (로케일 alternate)
│   ├── robots.ts                   # 크롤러 규칙
│   ├── globals.css                 # Tailwind 글로벌 스타일
│   ├── [locale]/                   # ko / en / cn
│   │   ├── layout.tsx              # 로케일별 SEO + JSON-LD
│   │   ├── page.tsx                # 메인 (Hero, Features, CTA)
│   │   ├── products/
│   │   │   ├── page.tsx            # 제품 라인업
│   │   │   ├── [slug]/             # 제품 상세 동적 라우트
│   │   │   └── paint/              # 기능성 페인트 상세
│   │   ├── company/                # 기업 소개 (CEO / 연혁 / 비전)
│   │   ├── contact/                # 문의 폼
│   │   ├── resources/              # 기술자료실
│   │   ├── cases/                  # 시공사례
│   │   ├── notice/                 # 공지사항
│   │   ├── media/                  # 미디어
│   │   ├── qna/                    # Q&A 게시판
│   │   └── search/                 # 통합 검색
│   ├── admin/                      # 관리자 CMS (JWT 보호)
│   │   ├── login/
│   │   ├── activity/
│   │   ├── cases/
│   │   ├── history/
│   │   ├── inquiries/
│   │   ├── media/
│   │   ├── notices/
│   │   ├── paint-products/
│   │   ├── qna/
│   │   ├── resources/
│   │   └── settings/
│   └── api/                        # API Routes
│       ├── admin/                  # 관리자 CRUD 엔드포인트
│       ├── cases/
│       ├── chat/                   # Gemini 챗봇
│       ├── company-brochure/
│       ├── history/
│       ├── inquiries/              # 문의 + 이메일 발송
│       ├── media/
│       ├── paint-products/
│       ├── product-share/
│       ├── qna/
│       ├── search/
│       └── upload/                 # Vercel Blob 업로드
├── components/                     # UI 컴포넌트 (Hero, Navbar, ChatWidget 등)
├── lib/
│   ├── activity.ts                 # 활동 로그 유틸
│   ├── auth.ts                     # JWT / bcrypt 헬퍼
│   ├── email.ts                    # Nodemailer
│   ├── prisma.ts                   # Prisma 싱글톤
│   ├── product-data.ts             # 제품 정적 데이터
│   └── media-data.ts               # 미디어 정적 데이터
├── services/
│   └── geminiService.ts            # Google Generative AI 래퍼
├── messages/                       # 다국어 번역
│   ├── ko.json
│   ├── en.json
│   └── cn.json
├── i18n.ts                         # next-intl 설정
├── middleware.ts                   # 로케일 + 관리자 인증 미들웨어
└── types.ts                        # 공통 타입

prisma/
├── schema.prisma                   # DB 스키마
├── seed.ts                         # 초기 데이터
├── seed-cases.ts
├── seed-history.ts
└── seed-media.js
```

---

## 🗄️ 데이터베이스 모델

| 모델 | 설명 |
|------|------|
| `Resource` | 기술자료 (Catalogue / Manual / Datasheet / Certificate) |
| `MediaItem` | 미디어 콘텐츠 (NEWS / NOW / 홍보자료) |
| `Inquiry` | 고객 문의 내역 |
| `ActivityLog` | 관리자 활동 로그 |
| `Notice` | 공지사항 (중요공지 플래그, 첨부) |
| `QnaPost` | Q&A 게시글 (비밀번호 해시, 답변) |
| `ConstructionCase` | 시공사례 |
| `CompanyHistory` | 회사 연혁 |
| `SiteSetting` | 사이트 key-value 설정 |
| `PaintCategory` / `PaintProduct` | 페인트 카테고리 및 제품 |

---

## 🚀 시작하기

### 설치

```bash
npm install
```

### 환경변수 설정

`.env` 파일을 생성하고 아래 항목을 설정합니다:

```env
DATABASE_URL=                  # NeonDB PostgreSQL 연결 URL (pooled)
DATABASE_URL_UNPOOLED=         # NeonDB 직접 연결 URL (마이그레이션용)
BLOB_READ_WRITE_TOKEN=         # Vercel Blob 토큰
GEMINI_API_KEY=                # Google Generative AI 키
EMAIL_USER=                    # 이메일 발신 계정
EMAIL_PASS=                    # 이메일 비밀번호 (앱 비밀번호)
JWT_SECRET=                    # 관리자 JWT 시크릿
BASE_URL=https://hanmirfe.com  # 사이트 기본 URL
```

### 개발 서버

```bash
npm run dev          # http://localhost:3000
```

### 프로덕션 빌드

```bash
npm run build        # prisma generate → prisma db push → next build
npm start
```

### DB 시드

```bash
npx prisma db seed                  # 기본 시드
npx tsx prisma/seed-cases.ts        # 시공사례 시드
npx tsx prisma/seed-history.ts      # 연혁 시드
node prisma/seed-media.js           # 미디어 시드
```

---

## 🔍 SEO 구성

### 크롤링 인프라

| 파일 | 역할 |
|------|------|
| `src/app/sitemap.ts` | 전체 페이지 사이트맵 (로케일 alternate 포함) |
| `src/app/robots.ts` | 크롤러 규칙 (`/admin`, `/api` 차단) |

### 메타데이터

| 파일 | SEO 범위 |
|------|---------|
| `src/app/layout.tsx` | 루트 메타데이터, OG 이미지, 인증코드 |
| `src/app/[locale]/layout.tsx` | 로케일별 제목/설명/키워드 + hreflang |
| `src/app/[locale]/products/[slug]/layout.tsx` | 제품별 동적 메타데이터 |
| `src/app/[locale]/products/paint/layout.tsx` | 페인트 페이지 메타데이터 |

### 타겟 키워드

```
불연도료, 단열도료, 차열도료, 방화코팅, 방염도료, 내화도료,
기능성 페인트, EV 전기차 지하주차장 화재안전, 불연코팅,
면압패드, 2차전지 열폭방지, 친환경 건축자재, 세라믹 코팅,
한미르, HANMIR
```

### JSON-LD 구조화 데이터

`src/components/JsonLd.tsx`에서 관리:

| 스키마 | 적용 위치 |
|--------|---------|
| `Organization` | 로케일 레이아웃 |
| `Product` | 제품 상세 페이지 |
| `BreadcrumbList` | 제품 상세, EV 화재안전 |
| `FAQPage` | EV 화재안전 페이지 |

### 검색엔진 등록

| 플랫폼 | 상태 | 비고 |
|--------|:---:|------|
| **네이버 웹마스터** | ✅ 등록 완료 | sitemap 제출 완료 |
| **구글 Search Console** | ✅ 등록 완료 | sitemap 제출 완료 |

---

## 🌐 도메인 및 리다이렉트

| 도메인 | 역할 | 관리 |
|--------|------|------|
| `hanmirfe.com` | **메인 도메인** (현재 운영) | Vercel |
| `hanmir.co` | 구 도메인 → 301 리다이렉트 | Cloudflare |

### 리다이렉트 구성 (Cloudflare)

```
http://hanmir.co/*       → 301 → https://hanmirfe.com
https://hanmir.co/*      → 301 → https://hanmirfe.com
http://www.hanmir.co/*   → 301 → https://hanmirfe.com
https://www.hanmir.co/*  → 301 → https://hanmirfe.com
```

- **Cloudflare Free Plan** 사용
- **SSL**: Flexible 모드
- **Page Rules**: `hanmir.co/*`, `www.hanmir.co/*` → 301 리다이렉트
- **도메인 등록**: 후이즈 (whois.co.kr), 한미르(주) 소유

---

## 📦 배포

Vercel에 자동 배포됩니다. `main` 브랜치 push 시 프로덕션 빌드가 트리거되며, 빌드 과정에서 `prisma generate` → `prisma db push` → `next build` 순서로 실행됩니다.

```bash
git add .
git commit -m "커밋 메시지"
git push origin main
```

| 환경 | URL |
|------|-----|
| **프로덕션** | [https://hanmirfe.com](https://hanmirfe.com) |
| **Vercel 기본** | hanmir-demo-3-d.vercel.app |

---

## 🗂 주요 페이지

| 페이지 | 경로 | 설명 |
|--------|------|------|
| 메인 | `/ko` | 3D 히어로, 제품 소개, CTA |
| 기업 소개 | `/ko/company` | CEO 인사말, 연혁, 비전 |
| 제품 소개 | `/ko/products` | 전체 제품 라인업 |
| 기능성 페인트 | `/ko/products/paint` | 도료 솔루션 + EV 화재안전 + 계산기 |
| 배터리 패드 | `/ko/products/battery-pad` | 2차 전지 열폭방지 면압패드 |
| 건축자재 | `/ko/products/building-materials` | 친환경 건축 소재 |
| 가전 코팅 | `/ko/products/home-appliances` | 프리미엄 가전 코팅 |
| 기술자료실 | `/ko/resources` | DATASHEET, 시험성적서 |
| 시공사례 | `/ko/cases` | 시공 현장 갤러리 |
| 공지사항 | `/ko/notice` | 공지 / 뉴스 / 이벤트 / 채용 |
| 미디어 | `/ko/media` | HANMIR NEWS / NOW / 홍보자료 |
| Q&A | `/ko/qna` | 비공개 문의 게시판 |
| 통합 검색 | `/ko/search` | 제품/자료/공지 통합 검색 |
| 문의하기 | `/ko/contact` | 이메일 문의 폼 |
| 관리자 | `/admin` | 콘텐츠 CMS (JWT 인증) |

---

## 📌 향후 운영 가이드

### 콘텐츠 SEO (검색 상위 노출)

- 공지사항/시공사례 **주 1~2회** 작성 (타겟 키워드 포함)
- 기술자료 PDF 정기적 업로드
- FAQ 콘텐츠 확충

### 외부 SEO

- 네이버 블로그/플레이스 운영
- 네이버 지식iN 전문 답변
- 업계 디렉토리 등록 (백링크 확보)

### 구 도메인 관리

- `hanmir.co` 도메인은 **최소 1~2년 유지** 후 만료 처리
- 후이즈에서 연 갱신 (연 1~3만원)
- Cloudflare 무료 플랜으로 유지비 없음

---

## 📄 라이선스

© 2025 한미르(주) All rights reserved.
