import React from 'react';
import { Building, Users, HardDrive, DollarSign, ArrowRight, Layers } from 'lucide-react';
import { Department } from '../../types';
import { mockDepartments } from '../../data/mockDepartments';

interface DepartmentsScreenProps {
  onNavigateToScreen: (screen: any) => void;
}

export const DepartmentsScreen: React.FC<DepartmentsScreenProps> = ({ onNavigateToScreen }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-3">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold text-[#131b2e] tracking-tight">
              Departmental Asset Allocation
            </h1>
            <span className="px-2 py-0.5 text-[11px] font-mono font-bold bg-[#eaedff] text-[#3525cd] rounded-full border border-[#dae2fd]">
              6 OPERATIONAL UNITS
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#464555] mt-1">
            Cost centers, workstation quotas, and equipment assignments per manufacturing division.
          </p>
        </div>
      </div>

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockDepartments.map((dept) => (
          <div
            key={dept.id}
            className="bg-white border border-[#e2e8f0] hover:border-[#c7c4d8] rounded-xl p-5 shadow-level-1 transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-[10px] font-semibold px-2 py-0.5 bg-[#eaedff] text-[#3525cd] rounded border border-[#dae2fd]">
                    {dept.code}
                  </span>
                  <h3 className="font-bold text-sm text-[#131b2e] mt-1.5">{dept.name}</h3>
                  <p className="text-xs text-[#777587] mt-0.5">{dept.facilityName}</p>
                </div>
                <div className="p-2 bg-[#f2f3ff] text-[#3525cd] rounded-lg">
                  <Building className="w-5 h-5" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[#f1f5f9] text-xs">
                <div className="p-2.5 bg-[#faf8ff] rounded-lg">
                  <div className="text-[10px] text-[#777587] uppercase font-semibold">
                    Allocated Fleet
                  </div>
                  <div className="font-mono font-bold text-sm text-[#131b2e] mt-0.5">
                    {dept.assetCount} Units
                  </div>
                </div>

                <div className="p-2.5 bg-[#faf8ff] rounded-lg">
                  <div className="text-[10px] text-[#777587] uppercase font-semibold">
                    Department Headcount
                  </div>
                  <div className="font-mono font-bold text-sm text-[#131b2e] mt-0.5">
                    {dept.employeeCount} Staff
                  </div>
                </div>
              </div>

              <div className="mt-3 text-xs space-y-1 text-[#464555]">
                <div className="flex justify-between">
                  <span className="text-[#777587]">Department Head:</span>
                  <span className="font-medium text-[#131b2e]">{dept.head}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#777587]">Cost Center:</span>
                  <span className="font-mono text-[11px] text-[#3525cd]">{dept.costCenter}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#777587]">Budget Code:</span>
                  <span className="font-mono text-[11px] text-[#777587]">{dept.budgetCode}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigateToScreen('assets')}
              className="pt-3 border-t border-[#f1f5f9] text-xs font-semibold text-[#3525cd] hover:text-[#3730a3] flex items-center justify-between"
            >
              <span>View Allocated Hardware Fleet</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

