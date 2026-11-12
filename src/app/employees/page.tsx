'use client';

import { useApp } from '../../context/AppContext';
import { EmployeesScreen } from '../../components/screens/EmployeesScreen';

export default function EmployeesPage() {
  const { facilities } = useApp();

  return <EmployeesScreen facilities={facilities} />;
}

