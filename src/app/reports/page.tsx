'use client';

import { useApp } from '../../context/AppContext';
import { ReportsScreen } from '../../components/screens/ReportsScreen';

export default function ReportsPage() {
  const { facilities, tickets } = useApp();

  return <ReportsScreen facilities={facilities} tickets={tickets} />;
}

