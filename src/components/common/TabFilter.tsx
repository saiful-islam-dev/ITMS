import React from 'react';
import { FacilityType } from '../../types';

export interface TabOption {
  id: FacilityType;
  label: string;
  count?: number;
}

interface TabFilterProps {
  options: TabOption[];
  activeId: FacilityType;
  onChange: (id: FacilityType) => void;
}

export const TabFilter: React.FC<TabFilterProps> = ({
  options,
  activeId,
  onChange
}) => {
  return (
    <div className="flex items-center gap-1 p-1 bg-[#eaedff] rounded-lg border border-[#dae2fd] overflow-x-auto">
      {options.map((tab) => {
        const isActive = activeId === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-all ${
              isActive
                ? 'bg-white text-[#3525cd] shadow-xs font-semibold'
                : 'text-[#464555] hover:text-[#131b2e] hover:bg-[#e2e7ff]/60'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono tabular-nums ${
                  isActive
                    ? 'bg-[#eaedff] text-[#3525cd]'
                    : 'bg-[#dae2fd]/70 text-[#464555]'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

