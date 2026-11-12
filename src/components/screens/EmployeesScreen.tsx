'use client';

import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Phone,
  Mail,
  ShieldCheck,
  Building,
  Clock,
  Award,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { Employee, Facility } from '../../types';
import { mockEmployees } from '../../data/mockEmployees';

interface EmployeesScreenProps {
  facilities: Facility[];
}

export const EmployeesScreen: React.FC<EmployeesScreenProps> = ({ facilities }) => {
  const [search, setSearch] = useState('');
  const [selectedFacility, setSelectedFacility] = useState<string>('all');
  const [selectedShift, setSelectedShift] = useState<string>('all');

  const filteredEmployees = useMemo(() => {
    return mockEmployees.filter((emp) => {
      if (selectedFacility !== 'all' && emp.facilityId !== selectedFacility) return false;
      if (selectedShift !== 'all' && !emp.shift.includes(selectedShift)) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = emp.name.toLowerCase().includes(q);
        const matchesRole = emp.role.toLowerCase().includes(q);
        const matchesSpec = emp.specialty.toLowerCase().includes(q);
        const matchesFac = emp.facilityName.toLowerCase().includes(q);
        if (!matchesName && !matchesRole && !matchesSpec && !matchesFac) return false;
      }
      return true;
    });
  }, [selectedFacility, selectedShift, search]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-3">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold text-[#131b2e] tracking-tight">
              Field IT Engineering & Shift Rotations
            </h1>
            <span className="px-2 py-0.5 text-[11px] font-mono font-bold bg-[#eaedff] text-[#3525cd] rounded-full border border-[#dae2fd]">
              14 ACTIVE ENGINEERS
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#464555] mt-1">
            24/7 on-site technical support roster covering sewing assembly floors, dyeing plants, and logistics hubs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#065f46] px-2.5 py-1 bg-[#ecfdf5] border border-[#a7f3d0] rounded-full font-semibold">
            ● 2 Active Shifts On Floor
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-3 shadow-level-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#777587]" />
          <input
            type="text"
            placeholder="Search engineers by name, specialty, certification, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#f2f3ff] rounded-lg border border-transparent focus:border-[#4f46e5] outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedFacility}
            onChange={(e) => setSelectedFacility(e.target.value)}
            className="px-3 py-2 text-xs bg-[#f2f3ff] text-[#131b2e] rounded-lg border border-transparent focus:border-[#4f46e5] outline-none font-medium"
          >
            <option value="all">All Campuses</option>
            {facilities.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.code})
              </option>
            ))}
          </select>

          <select
            value={selectedShift}
            onChange={(e) => setSelectedShift(e.target.value)}
            className="px-3 py-2 text-xs bg-[#f2f3ff] text-[#131b2e] rounded-lg border border-transparent focus:border-[#4f46e5] outline-none font-medium"
          >
            <option value="all">All Shifts</option>
            <option value="Shift A">Shift A (06:00 - 14:00)</option>
            <option value="Shift B">Shift B (14:00 - 22:00)</option>
            <option value="General">General (09:00 - 18:00)</option>
          </select>
        </div>
      </div>

      {/* Engineers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredEmployees.map((emp) => (
          <div
            key={emp.id}
            className="bg-white border border-[#e2e8f0] hover:border-[#c7c4d8] rounded-xl p-4 shadow-level-1 transition-all flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={emp.avatar}
                    alt={emp.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-[#cbd5e1]"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-[#131b2e]">{emp.name}</h3>
                    <p className="text-xs text-[#3525cd] font-medium">{emp.role}</p>
                    <span className="text-[10px] text-[#777587] block font-mono">
                      {emp.facilityCode} · {emp.facilityName.split(' ')[0]}
                    </span>
                  </div>
                </div>

                <span className="px-2 py-0.5 text-[10px] font-semibold bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0] rounded-full">
                  Active
                </span>
              </div>

              {/* Shift info */}
              <div className="mt-3 p-2 bg-[#f8f9fe] rounded-lg border border-slate-100 flex items-center justify-between text-xs text-[#464555]">
                <span className="flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#5b598c]" />
                  <span>{emp.shift}</span>
                </span>
              </div>

              {/* Specialty & Certifications */}
              <div className="mt-3 space-y-1.5 text-xs">
                <div className="text-[11px] text-[#777587]">
                  <strong className="text-[#131b2e]">Specialty:</strong> {emp.specialty}
                </div>
                <div className="flex flex-wrap gap-1">
                  {emp.certifications.map((cert) => (
                    <span
                      key={cert}
                      className="px-1.5 py-0.2 text-[10px] bg-[#eaedff] text-[#3525cd] rounded border border-[#dae2fd]"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Actions */}
            <div className="pt-3 border-t border-[#f1f5f9] flex items-center justify-between text-xs">
              <a
                href={`tel:${emp.phone}`}
                className="flex items-center gap-1.5 font-mono text-[#4f46e5] hover:text-[#3730a3]"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{emp.phone}</span>
              </a>

              <a
                href={`mailto:${emp.email}`}
                className="p-1.5 text-[#464555] hover:text-[#131b2e] hover:bg-[#eaedff] rounded-md transition-colors"
                title={`Send email to ${emp.name}`}
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

