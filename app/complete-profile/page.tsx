import { Suspense } from 'react';
import CompleteProfileClient from './CompleteProfileClient';
import type { UserRole } from '@/lib/user-profile';

export default async function CompleteProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const params = await searchParams;
  const role = params.role === 'client' || params.role === 'driver' ? (params.role as UserRole) : null;

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#121212]" />}>
      <CompleteProfileClient role={role} />
    </Suspense>
  );
}
