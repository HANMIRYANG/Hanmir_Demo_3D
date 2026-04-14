# ============================================================================
# 환경 변수 설정 가이드 - 한미르 관리자 시스템
# ============================================================================
# 이 파일을 `.env.local`로 복사하고 실제 값을 입력하세요.
# Vercel 배포 시에는 Vercel 대시보드 > Settings > Environment Variables 에 등록합니다.
# ============================================================================

## AI
# GEMINI_API_KEY=your_gemini_api_key_here

## PostgreSQL (Neon) 데이터베이스 연결
# DATABASE_URL=postgresql://neondb_owner:xxx@ep-xxx.aws.neon.tech/neondb?sslmode=require
# DATABASE_URL_UNPOOLED=postgresql://neondb_owner:xxx@ep-xxx.aws.neon.tech/neondb?sslmode=require

## 관리자 계정 (로그인 자격증명)
# ADMIN_ID=your_admin_id
# ADMIN_PASSWORD_HASH=$2a$12$...   # bcrypt 해시 (절대 평문 금지)
#
# 🔐 비밀번호 해시 생성 방법:
#    node -e "console.log(require('bcryptjs').hashSync('원하는비밀번호', 12))"
#    출력된 $2a$... 값을 ADMIN_PASSWORD_HASH에 그대로 붙여넣으세요.

## JWT 시크릿 (최소 32자 랜덤 문자열)
# JWT_SECRET=your_32_char_random_secret_here
#
# 🔐 생성 방법:
#    node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"

## 이메일 발송 (Nodemailer)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your_email@gmail.com
# SMTP_PASS=your_app_password
# ADMIN_EMAIL=hanmir@hanmirfe.com

## Vercel Blob
# BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxx

## 사이트
# BASE_URL=https://hanmirfe.com

# ============================================================================
# 보안 체크리스트
# ============================================================================
# [ ] `.env.local`은 반드시 `.gitignore`에 포함되어야 함
# [ ] 과거 커밋에 노출된 비밀번호는 즉시 변경
# [ ] Vercel 환경변수는 Production/Preview/Development 별로 분리 가능
# [ ] JWT_SECRET, ADMIN_PASSWORD_HASH는 개발/운영 환경 모두 다른 값 사용 권장
