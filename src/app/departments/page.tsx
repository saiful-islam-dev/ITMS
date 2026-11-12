'use client';

import { useRouter } from 'next/navigation';
import { DepartmentsScreen } from '../../components/screens/DepartmentsScreen';

export default function DepartmentsPage() {
  const router = useRouter();

  return (
    <DepartmentsScreen
      onNavigateToScreen={(screen) => router.push(`/${screen}`)}
    />
  );
}

