# 한미르(주) 공식 웹사이트 - Hanmir 3D

> **불연 · 단열 · 차열 기능성 도료 전문기업**  
> 🔗 [https://hanmirfe.com](https://hanmirfe.com)

---

## 📋 프로젝트 개요

한미르(주)의 공식 기업 웹사이트입니다. 기능성 도료(불연, 단열, 차열, 방화코팅) 제품 소개, EV 전기차 지하주차장 화재안전 솔루션, 기술자료 제공, 고객 문의 기능을 포함합니다.

---

## 🛠 기술 스택

| 분류 | 기술 |
|------|------|
| **프레임워크** | Next.js 16.1 (App Router) |
| **언어** | TypeScript, React 19 |
| **스타일링** | Tailwind CSS 4 |
| **3D 렌더링** | Three.js, React Three Fiber, Drei |
| **애니메이션** | Framer Motion |
| **국제화 (i18n)** | next-intl (한국어/영어/중국어) |
| **차트** | Recharts |
| **DB/ORM** | Prisma + NeonDB (PostgreSQL) |
| **파일 저장** | Vercel Blob |
| **AI 기능** | Google Generative AI |
| **이메일** | Nodemailer |
| **배포** | Vercel |
| **도메인** | hanmirfe.com |

---

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── layout.tsx                  # 루트 레이아웃 (SEO 메타데이터, 폰트)
│   ├── sitemap.ts                  # 동적 사이트맵 생성
│   ├── robots.ts                   # 크롤러 접근 규칙
│   ├── [locale]/                   # 다국어 라우팅 (ko, en, cn)
│   │   ├── layout.tsx              # 로케일별 SEO 메타데이터
│   │   ├── page.tsx                # 메인 페이지
│   │   ├── products/               # 제품 페이지
│   │   │   ├── page.tsx            # 제품 목록
│   │   │   ├── [slug]/             # 제품 상세 (동적 라우트)
│   │   │   │   ├── layout.tsx      # 제품별 SEO 메타데이터
│   │   │   │   └── page.tsx        # 제품 상세 페이지
│   │   │   └── paint/              # 기능성 페인트
│   │   │       ├── layout.tsx      # 페인트 SEO 메타데이터
│   │   │       └── page.tsx        # 페인트 페이지
│   │   ├── company/                # 기업 소개
│   │   ├── contact/                # 문의하기
│   │   ├── resources/              # 기술자료실
│   │   ├── cases/                  # 시공사례
│   │   ├── notice/                 # 공지사항
│   │   ├── media/                  # 미디어
│   │   ├── qna/                    # Q&A
│   │   └── search/                 # 검색
│   ├── admin/                      # 관리자 페이지
│   └── api/                        # API 라우트
├── components/
│   ├── Navbar.tsx                  # 네비게이션 바
│   ├── Footer.tsx                  # 푸터
│   ├── JsonLd.tsx                  # JSON-LD 구조화 데이터
│   ├── EvFireSafetyPremiumView.tsx # EV 화재안전 프리미엄 뷰
│   └── ...
├── lib/
│   └── product-data.ts            # 제품 데이터
└── messages/                       # 다국어 번역 파일
    ├── ko.json
    ├── en.json
    └── cn.json
```

---

## 🚀 시작하기

### 설치

```bash
npm install
```

### 환경변수 설정

`.env` 파일을 생성하고 아래 항목을 설정합니다:

```env
DATABASE_URL=                  # NeonDB PostgreSQL 연결 URL
BLOB_READ_WRITE_TOKEN=         # Vercel Blob 토큰
GEMINI_API_KEY=                # Google Generative AI 키
EMAIL_USER=                    # 이메일 발신 계정
EMAIL_PASS=                    # 이메일 비밀번호
JWT_SECRET=                    # JWT 인증 시크릿
BASE_URL=https://hanmirfe.com  # 사이트 기본 URL
```

### 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인할 수 있습니다.

### 프로덕션 빌드

```bash
npm run build
npm start
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
| `src/app/[locale]/layout.tsx` | 로케일별 제목/설명/키워드 |
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
http://hanmir.co/*     → 301 → https://hanmirfe.com
https://hanmir.co/*    → 301 → https://hanmirfe.com
http://www.hanmir.co/* → 301 → https://hanmirfe.com
https://www.hanmir.co/*→ 301 → https://hanmirfe.com
```

- **Cloudflare Free Plan** 사용
- **SSL**: Flexible 모드
- **Page Rules**: `hanmir.co/*`, `www.hanmir.co/*` → 301 리다이렉트
- **도메인 등록**: 후이즈 (whois.co.kr), 한미르(주) 소유

---

## 📦 배포

Vercel에 자동 배포됩니다.

```bash
git add .
git commit -m "커밋 메시지"
git push origin main
```

`main` 브랜치에 push 시 자동으로 프로덕션 배포가 진행됩니다.

| 환경 | URL |
|------|-----|
| **프로덕션** | [https://hanmirfe.com](https://hanmirfe.com) |
| **Vercel 기본** | hanmir-demo-3-d.vercel.app |

---

## 🗂 주요 페이지

| 페이지 | 경로 | 설명 |
|--------|------|------|
| 메인 | `/ko` | 히어로, 제품 소개, CTA |
| 기업 소개 | `/ko/company` | CEO 인사말, 연혁, 비전 |
| 제품 소개 | `/ko/products` | 전체 제품 라인업 |
| 기능성 페인트 | `/ko/products/paint` | 도료 솔루션 + EV 화재안전 |
| 배터리 패드 | `/ko/products/battery-pad` | 2차 전지 열폭방지 면압패드 |
| 건축자재 | `/ko/products/building-materials` | 친환경 건축 소재 |
| 가전 코팅 | `/ko/products/home-appliances` | 프리미엄 가전 코팅 |
| 기술자료실 | `/ko/resources` | DATASHEET, 시험성적서 |
| 시공사례 | `/ko/cases` | 시공 현장 갤러리 |
| 문의하기 | `/ko/contact` | 이메일 문의 폼 |
| 관리자 | `/admin` | 콘텐츠 관리 (인증 필요) |

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
