'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PasswordInput } from '../../components/auth/PasswordInput';
import { PasswordStrengthMeter, evaluatePasswordStrength } from '../../components/auth/PasswordStrengthMeter';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('Tania Sultana');
  const [email, setEmail] = useState('t.sultana@apexgarments.com');
  const [employeeId, setEmployeeId] = useState('EMP-9042');
  const [department, setDepartment] = useState('merchandising');
  const [facilityLocation, setFacilityLocation] = useState('hq');
  const [password, setPassword] = useState('ApexSecure#2024');
  const [confirmPassword, setConfirmPassword] = useState('ApexSecure#2024');
  const [policyAgreed, setPolicyAgreed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const { label: strengthLabel, labelColor: strengthColor } = evaluatePasswordStrength(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordsMatch || !policyAgreed) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    }, 1000);
  };

  return (
    <div className="min-h-full flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 font-sans antialiased text-slate-900 bg-slate-50 enterprise-grid radial-glow relative">
      {/* Main Container */}
      <main className="w-full max-w-2xl mx-auto flex-1 flex flex-col justify-center">
        {/* Brand Header */}
        <header className="text-center mb-6" data-purpose="brand-header">
          <div className="inline-flex items-center justify-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#4f46e5] flex items-center justify-center text-white shadow-xs ring-1 ring-indigo-700/20">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div className="text-left">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold tracking-tight text-slate-900">ITMS</span>
                <span className="text-[10px] font-semibold bg-indigo-50 text-[#4f46e5] px-2 py-0.5 rounded border border-indigo-200">
                  v2.4 Enterprise
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Apex Garments IT Operations</p>
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create Your Account</h1>
          <p className="text-sm text-slate-500 mt-1">Register to access your organization's IT management platform.</p>
        </header>

        {/* Registration Card */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-level-2 p-6 sm:p-8" data-purpose="registration-card">
          {/* Notice Banner */}
          <aside className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start space-x-3" data-purpose="security-notice">
            <svg className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path
                clipRule="evenodd"
                d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                fillRule="evenodd"
              />
            </svg>
            <div className="text-xs leading-relaxed text-amber-800">
              <strong className="font-semibold text-amber-900">Notice: Internal Company System.</strong> Self-registration submits an account request to Apex Garments IT Security. Administrator role assignment and department verification are required before access is granted.
            </div>
          </aside>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit} data-purpose="signup-form">
            {/* Row 1: Full Name & Work Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5" htmlFor="full-name">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="full-name"
                  name="full-name"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Tania Sultana"
                  className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2.5 focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5] shadow-xs placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5" htmlFor="work-email">
                  Work Email <span className="text-rose-500">*</span>
                </label>
                <input
                  id="work-email"
                  name="work-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. t.sultana@apexgarments.com"
                  className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2.5 focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5] shadow-xs placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Row 2: Employee ID & Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5" htmlFor="employee-id">
                  Employee ID <span className="text-rose-500">*</span>
                </label>
                <input
                  id="employee-id"
                  name="employee-id"
                  type="text"
                  required
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  placeholder="e.g. EMP-9042"
                  className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2.5 focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5] shadow-xs font-mono uppercase placeholder:font-sans placeholder:normal-case placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5" htmlFor="department">
                  Department <span className="text-rose-500">*</span>
                </label>
                <select
                  id="department"
                  name="department"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2.5 focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5] shadow-xs text-slate-800 bg-white"
                >
                  <option value="production">Production & Sewing</option>
                  <option value="merchandising">Merchandising</option>
                  <option value="washing">Washing / Finishing</option>
                  <option value="it-ops">IT Operations</option>
                  <option value="hr">Human Resources</option>
                  <option value="finance">Finance & Accounts</option>
                </select>
              </div>
            </div>

            {/* Row 3: Facility Location */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5" htmlFor="facility-location">
                Primary Facility Location <span className="text-rose-500">*</span>
              </label>
              <select
                id="facility-location"
                name="facility-location"
                required
                value={facilityLocation}
                onChange={(e) => setFacilityLocation(e.target.value)}
                className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2.5 focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5] shadow-xs text-slate-800 bg-white"
              >
                <option value="factory-a">Factory Building A (Cutting & Sewing Unit)</option>
                <option value="factory-b">Factory Building B (Washing & Finishing Unit)</option>
                <option value="warehouse">Central Warehouse (Fabric & Trim Storage)</option>
                <option value="hq">Apex HQ & Design Studio</option>
              </select>
            </div>

            {/* Row 4: Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <PasswordInput
                  id="password-input"
                  name="password"
                  required
                  icon={false}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  label="Password *"
                  badge={
                    strengthLabel && (
                      <span className={`text-xs font-medium ${strengthColor}`}>
                        {strengthLabel}
                      </span>
                    )
                  }
                />
                <PasswordStrengthMeter password={password} />
              </div>

              <div>
                <PasswordInput
                  id="confirm-password"
                  name="confirm-password"
                  required
                  icon={false}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  label="Confirm Password *"
                  className={
                    confirmPassword && !passwordsMatch
                      ? 'border-rose-400 focus:border-rose-500'
                      : confirmPassword && passwordsMatch
                      ? 'border-emerald-500'
                      : ''
                  }
                  badge={
                    confirmPassword && (
                      <span
                        className={`text-xs font-medium flex items-center space-x-1 ${
                          passwordsMatch ? 'text-emerald-600' : 'text-rose-500'
                        }`}
                      >
                        {passwordsMatch ? (
                          <>
                            <svg className="w-3.5 h-3.5 mr-0.5 inline" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                clipRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                fillRule="evenodd"
                              />
                            </svg>
                            <span>Matched</span>
                          </>
                        ) : (
                          <span>Mismatch</span>
                        )}
                      </span>
                    )
                  }
                />
                <p className="text-[11px] text-slate-500 mt-2">Re-type to ensure matching credentials.</p>
              </div>
            </div>

            {/* Compliance & Agreement Checkbox */}
            <div className="pt-2">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="policy-agreement"
                    name="policy-agreement"
                    type="checkbox"
                    required
                    checked={policyAgreed}
                    onChange={(e) => setPolicyAgreed(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-[#4f46e5] focus:ring-[#4f46e5] cursor-pointer"
                  />
                </div>
                <div className="ml-3 text-xs leading-5">
                  <label className="text-slate-600 cursor-pointer select-none" htmlFor="policy-agreement">
                    I agree to the{' '}
                    <a className="font-medium text-[#4f46e5] hover:text-[#4338ca] underline" href="#policy">
                      Apex Garments IT Acceptable Use Policy
                    </a>{' '}
                    &amp;{' '}
                    <a className="font-medium text-[#4f46e5] hover:text-[#4338ca] underline" href="#security">
                      Data Security Guidelines
                    </a>
                    .
                  </label>
                </div>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || !passwordsMatch || !policyAgreed}
                className="w-full flex justify-center items-center py-2.5 px-4 rounded-lg text-sm font-semibold text-white bg-[#4f46e5] hover:bg-[#4338ca] active:bg-[#3730a3] transition duration-150 shadow-xs hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f46e5] disabled:opacity-50 cursor-pointer"
                data-purpose="submit-btn"
              >
                {isSubmitting ? (
                  <span>Submitting Request...</span>
                ) : isSubmitted ? (
                  <span>Request Dispatched! Redirecting to Sign In...</span>
                ) : (
                  <>
                    <span>Submit Registration Request</span>
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer Sign-in Link */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Already have an approved account?
              <Link className="font-semibold text-[#4f46e5] hover:text-[#4338ca] hover:underline ml-1" href="/login">
                Sign in
              </Link>
            </p>
          </div>
        </section>

        {/* Security Badges & Footer Information */}
        <footer className="mt-8 text-center text-xs text-slate-400 space-y-2" data-purpose="page-footer">
          <div className="flex items-center justify-center space-x-4 text-slate-400 text-xs">
            <span className="inline-flex items-center">
              <svg className="w-3.5 h-3.5 mr-1 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  clipRule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  fillRule="evenodd"
                />
              </svg>
              End-to-End Encrypted
            </span>
            <span>•</span>
            <span>256-Bit SSL Secured</span>
            <span>•</span>
            <span>Apex IT Infrastructure SOC-2</span>
          </div>
          <p>© 2024 Apex Garments IT Infrastructure. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}

