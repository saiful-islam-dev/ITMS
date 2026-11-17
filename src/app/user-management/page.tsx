'use client';

import { useApp } from '../../context/AppContext';
import { UserManagementScreen } from '../../components/screens/UserManagementScreen';

export default function UserManagementPage() {
  const { facilities } = useApp();

  return <UserManagementScreen facilities={facilities} />;
}
