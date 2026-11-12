'use client';

import { useRouter } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import { LocationsScreen } from '../../components/screens/LocationsScreen';

export default function LocationsPage() {
  const router = useRouter();
  const {
    activeFacilities,
    setIsAddModalOpen,
    setIsExportModalOpen,
    setSelectedFacilityForAssets,
    setSelectedFacilityForTerminal,
    setSelectedFacilityForThermals,
    setIsHotlineModalOpen
  } = useApp();

  return (
    <LocationsScreen
      facilities={activeFacilities}
      onOpenAddModal={() => setIsAddModalOpen(true)}
      onOpenExportModal={() => setIsExportModalOpen(true)}
      onManageAssets={(fac) => setSelectedFacilityForAssets(fac)}
      onOpenTerminal={(fac) => setSelectedFacilityForTerminal(fac)}
      onOpenThermals={(fac) => setSelectedFacilityForThermals(fac)}
      onOpenTickets={() => router.push('/tickets')}
      onHotlineClick={() => setIsHotlineModalOpen(true)}
      onNavigateToScreen={(screen) => router.push(`/${screen}`)}
    />
  );
}

