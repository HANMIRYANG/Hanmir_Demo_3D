import { redirect } from 'next/navigation';

// /company 접속 시 /company/about으로 리다이렉트
export default function CompanyPage() {
    redirect('/company/about');
}
