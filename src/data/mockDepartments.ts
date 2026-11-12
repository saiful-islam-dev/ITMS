import { Department } from '../types';

export const mockDepartments: Department[] = [
  {
    id: 'dept-01',
    name: 'CAD & Design Engineering',
    code: 'DEPT-CAD-01',
    head: 'Nusrat Jahan',
    facilityId: 'loc-corp-01',
    facilityName: 'Apex HQ & Design Studio',
    assetCount: 68,
    employeeCount: 45,
    budgetCode: 'CAPEX-CAD-2026',
    costCenter: 'CC-1010-DESIGN'
  },
  {
    id: 'dept-02',
    name: 'Executive & Corporate HQ',
    code: 'DEPT-EXEC-02',
    head: 'Zafar Iqbal',
    facilityId: 'loc-corp-01',
    facilityName: 'Apex HQ & Design Studio',
    assetCount: 112,
    employeeCount: 88,
    budgetCode: 'OPEX-HQ-2026',
    costCenter: 'CC-1020-EXEC'
  },
  {
    id: 'dept-03',
    name: 'Sewing & Garment Assembly',
    code: 'DEPT-MFG-A',
    head: 'Engr. M. Kamal',
    facilityId: 'loc-fct-01',
    facilityName: 'Factory Building A',
    assetCount: 215,
    employeeCount: 650,
    budgetCode: 'MFG-LINE-2026',
    costCenter: 'CC-2010-ASSEMBLY'
  },
  {
    id: 'dept-04',
    name: 'Quality Assurance & Audit',
    code: 'DEPT-QA-01',
    head: 'Mohammad Faruk',
    facilityId: 'loc-fct-01',
    facilityName: 'Factory Building A',
    assetCount: 111,
    employeeCount: 75,
    budgetCode: 'QA-INSP-2026',
    costCenter: 'CC-2020-QA'
  },
  {
    id: 'dept-05',
    name: 'Industrial Dyeing & Chemical Wash',
    code: 'DEPT-WASH-B',
    head: 'Aminul Haque',
    facilityId: 'loc-fct-02',
    facilityName: 'Factory Building B',
    assetCount: 189,
    employeeCount: 320,
    budgetCode: 'IND-CHEM-2026',
    costCenter: 'CC-3010-WASH'
  },
  {
    id: 'dept-06',
    name: 'Raw Materials & Yarn Logistics',
    code: 'DEPT-LOG-01',
    head: 'Sajid Mir',
    facilityId: 'loc-whse-01',
    facilityName: 'Central Fabric Warehouse Hub',
    assetCount: 64,
    employeeCount: 60,
    budgetCode: 'LOG-WHSE-2026',
    costCenter: 'CC-4010-WAREHOUSE'
  }
];

