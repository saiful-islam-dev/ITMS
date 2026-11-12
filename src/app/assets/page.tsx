'use client';

import { useApp } from '../../context/AppContext';
import { ITAssetsScreen } from '../../components/screens/ITAssetsScreen';

export default function ITAssetsPage() {
  const { facilities, setSelectedFacilityForTerminal } = useApp();

  return (
    <ITAssetsScreen
      facilities={facilities}
      onOpenTerminal={(fac) => setSelectedFacilityForTerminal(fac)}
    />
  );
}

