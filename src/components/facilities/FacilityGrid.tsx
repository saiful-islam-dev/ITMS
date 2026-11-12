import React from 'react';
import { Facility } from '../../types';
import { FacilityCard } from './FacilityCard';

interface FacilityGridProps {
  facilities: Facility[];
  onManageAssets: (facility: Facility) => void;
  onOpenTerminal: (facility: Facility) => void;
  onOpenThermals: (facility: Facility) => void;
  onOpenTickets: (facility: Facility) => void;
}

export const FacilityGrid: React.FC<FacilityGridProps> = ({
  facilities,
  onManageAssets,
  onOpenTerminal,
  onOpenThermals,
  onOpenTickets
}) => {
  if (facilities.length === 0) {
    return (
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-12 text-center shadow-level-1">
        <p className="text-sm font-semibold text-[#131b2e]">No facilities matched your filters</p>
        <p className="text-xs text-[#777587] mt-1">
          Try clearing your search query or switching to 'All Facilities'.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
      {facilities.map((facility) => (
        <FacilityCard
          key={facility.id}
          facility={facility}
          onManageAssets={onManageAssets}
          onOpenTerminal={onOpenTerminal}
          onOpenThermals={onOpenThermals}
          onOpenTickets={onOpenTickets}
        />
      ))}
    </div>
  );
};

