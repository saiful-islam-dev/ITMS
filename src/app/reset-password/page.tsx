'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PasswordInput } from '../../components/auth/PasswordInput';
import { PasswordStrengthMeter, evaluatePasswordStrength } from '../../components/auth/PasswordStrengthMeter';

export default function ResetPasswordPage() {
  const router = useRouter();

  // Step 1 State
  const [email, setEmail] = useState('tariq.rahman@apexgarments.com');
  const [isEmailDispatched, setIsEmailDispatched] = useState(true);
  const [isSendingLink, setIsSendingLink] = useState(false);

  // Step 2 State
  const [newPassword, setNewPassword] = useState('ApexSecure!2024');
  const [confirmPassword, setConfirmPassword] = useState('ApexSecure!2024');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);

  // Domain validation
  const isValidDomain = email.trim().endsWith('@apexgarments.com');

  // Criteria validation
  const hasMinLength = newPassword.length >= 10;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const isCompliant = hasMinLength && hasUppercase && hasSpecialChar;
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const { label: strengthLabel, labelColor: strengthColor } = evaluatePasswordStrength(newPassword);

  const handleSendResetLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidDomain) return;

    setIsSendingLink(true);
    setTimeout(() => {
      setIsSendingLink(false);
      setIsEmailDispatched(true);
    }, 800);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCompliant || !passwordsMatch) return;

    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      setIsUpdated(true);
      setTimeout(() => {
        router.push('/login');
      }, 1200);
    }, 900);
  };

  return (
    <div className="min-h-full flex flex-col justify-between text-slate-800 bg-[#f8fafc] enterprise-grid radial-glow relative">
      {/* Top Header */}
      <header className="w-full bg-white border-b border-slate-200 py-4 px-6 md:px-12 flex items-center justify-between shadow-2xs z-10">
        <div className="flex items-center space-x-3">
          {/* App Icon */}
          <div className="w-9 h-9 rounded-lg bg-[#4f46e5] flex items-center justify-center text-white shadow-xs font-bold text-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.2"
              />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 tracking-tight text-base">ITMS</span>
              <span className="text-[11px] font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                v2.4 Enterprise
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium leading-none mt-0.5">
              Apex Garments IT Ops • Identity &amp; Access
            </p>
          </div>
        </div>

        {/* Live Directory Link Status */}
        <div className="flex items-center space-x-2 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="hidden sm:inline">Active Directory Gateway:</span>
          <span className="text-slate-900 font-semibold">SSO-Apex-HQ</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col justify-center z-10">
        {/* Page Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[#4f46e5] text-xs font-semibold mb-3">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            Secured Credential Provisioning Service
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Enterprise Identity Recovery
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Dual-layer authentication recovery for floor management, line terminals, and corporate personnel.
          </p>
        </div>

        {/* Dual Card Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Step 1 Card: Request Link */}
          <section
            className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-6 sm:p-8 flex flex-col h-full justify-between relative overflow-hidden"
            data-purpose="forgot-password-card"
          >
            <div className="flex items-center justify-between pb-5 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#4f46e5] text-white text-xs font-bold">
                  1
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-[#4f46e5]">
                  Step 1: Request Link
                </span>
              </div>
              <span className="text-xs text-slate-400 font-medium">Domain Verified</span>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-bold text-slate-900">Reset Your Password</h2>
              <p className="mt-1 text-sm text-slate-600">
                Enter your registered Apex Garments enterprise email to receive secure 2FA reset instructions.
              </p>

              {/* Email Form */}
              <form className="mt-6 space-y-4" onSubmit={handleSendResetLink}>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5" htmlFor="enterprise-email">
                    Enterprise Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                    <input
                      id="enterprise-email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tariq.rahman@apexgarments.com"
                      className="block w-full pl-10 pr-24 py-2.5 text-sm rounded-lg border border-slate-300 focus:ring-1 focus:ring-[#4f46e5] focus:border-[#4f46e5] text-slate-900 placeholder:text-slate-400 transition-colors"
                    />
                    <span
                      className={`absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-xs font-medium ${
                        isValidDomain ? 'text-emerald-600' : 'text-rose-500'
                      }`}
                    >
                      {isValidDomain ? 'Valid Domain' : 'Invalid Domain'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                    Only internal domains (@apexgarments.com) are eligible for automated recovery.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSendingLink || !isValidDomain}
                  className="w-full inline-flex justify-center items-center py-2.5 px-4 rounded-lg shadow-xs text-sm font-semibold text-white bg-[#4f46e5] hover:bg-[#4338ca] active:bg-[#3730a3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f46e5] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isSendingLink ? (
                    <span>Dispatching Verification Link...</span>
                  ) : (
                    <>
                      <span>Send Reset Link</span>
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                    </>
                  )}
                </button>
              </form>

              {/* Live State Confirmation Preview */}
              {isEmailDispatched && (
                <div className="mt-6 p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start space-x-3">
                  <div className="shrink-0 mt-0.5">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                    </svg>
                  </div>
                  <div className="text-xs leading-relaxed">
                    <span className="font-bold block text-emerald-900">Verification email dispatched</span>
                    Verification email sent to <span className="font-mono font-semibold">{email.slice(0, 1)}***@apexgarments.com</span>. The single-use link expires in <span className="font-bold underline decoration-emerald-400">15 minutes</span>.
                  </div>
                </div>
              )}
            </div>

            {/* Back Link Navigation */}
            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <Link
                href="/login"
                className="inline-flex items-center font-medium text-slate-500 hover:text-[#4f46e5] transition-colors"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
                Return to Sign In
              </Link>
              <span className="text-slate-400 font-mono text-[11px]">Security Ref: #SEC-REC-409</span>
            </div>
          </section>

          {/* Step 2 Card: Set New Password */}
          <section
            className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-6 sm:p-8 flex flex-col h-full justify-between"
            data-purpose="new-password-card"
          >
            <div className="flex items-center justify-between pb-5 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold">
                  2
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Step 2: Set New Password
                </span>
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                Enforced Policy
              </span>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-bold text-slate-900">Set New Password</h2>
              <p className="mt-1 text-sm text-slate-600">
                Create a strong, compliant passphrase to restore system authorization.
              </p>

              <form className="mt-6 space-y-4" onSubmit={handleUpdatePassword}>
                {/* New Password */}
                <div>
                  <PasswordInput
                    id="new-password"
                    label="New Password"
                    icon={false}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••••••"
                    badge={
                      strengthLabel && (
                        <span className={`text-[11px] font-semibold ${strengthColor}`}>
                          Strength: {strengthLabel}
                        </span>
                      )
                    }
                  />
                  <PasswordStrengthMeter password={newPassword} />
                </div>

                {/* Confirm Password */}
                <div>
                  <PasswordInput
                    id="confirm-password"
                    label="Confirm New Password"
                    icon={false}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className={
                      confirmPassword && !passwordsMatch
                        ? 'border-rose-400 focus:border-rose-500'
                        : confirmPassword && passwordsMatch
                        ? 'border-emerald-500'
                        : ''
                    }
                  />
                </div>

                {/* Security Criteria Checklist */}
                <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-lg" data-purpose="security-criteria-checklist">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Compliance Requirements
                  </span>
                  <ul className="space-y-1.5 text-xs">
                    <li className={`flex items-center font-medium ${hasMinLength ? 'text-emerald-700' : 'text-slate-500'}`}>
                      <svg className={`w-4 h-4 mr-2 shrink-0 ${hasMinLength ? 'text-emerald-600' : 'text-slate-300'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path clipRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" fillRule="evenodd" />
                      </svg>
                      Minimum 10 characters in length
                    </li>
                    <li className={`flex items-center font-medium ${hasUppercase ? 'text-emerald-700' : 'text-slate-500'}`}>
                      <svg className={`w-4 h-4 mr-2 shrink-0 ${hasUppercase ? 'text-emerald-600' : 'text-slate-300'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path clipRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" fillRule="evenodd" />
                      </svg>
                      At least 1 uppercase letter (A-Z)
                    </li>
                    <li className={`flex items-center font-medium ${hasSpecialChar ? 'text-emerald-700' : 'text-slate-500'}`}>
                      <svg className={`w-4 h-4 mr-2 shrink-0 ${hasSpecialChar ? 'text-emerald-600' : 'text-slate-300'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path clipRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" fillRule="evenodd" />
                      </svg>
                      At least 1 special character (!@#$%^&amp;*)
                    </li>
                    <li className="flex items-center text-emerald-700 font-medium">
                      <svg className="w-4 h-4 mr-2 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path clipRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" fillRule="evenodd" />
                      </svg>
                      Cannot match previous 3 passwords
                    </li>
                  </ul>
                </div>

                <button
                  type="submit"
                  disabled={isUpdating || !isCompliant || !passwordsMatch}
                  className="w-full inline-flex justify-center items-center py-2.5 px-4 rounded-lg shadow-xs text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 active:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isUpdating ? (
                    <span>Synchronizing Password with Active Directory...</span>
                  ) : isUpdated ? (
                    <span>Password Updated! Redirecting to Sign In...</span>
                  ) : (
                    <>
                      <span>Update Password &amp; Sign In</span>
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Token Validity Note */}
            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Active Session ID: <code className="font-mono text-slate-700">SES-8902-TX</code></span>
              <span className="inline-flex items-center text-slate-500">
                <svg className="w-3.5 h-3.5 mr-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
                Token valid for 13:42
              </span>
            </div>
          </section>
        </div>

        {/* Floor IT Desk Emergency Contact Pill */}
        <div className="mt-10 flex justify-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-4 px-5 py-3 rounded-xl bg-white border border-slate-200 shadow-2xs text-xs text-slate-600" data-purpose="it-helpdesk-pill">
            <div className="flex items-center space-x-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#4f46e5]" />
              </span>
              <span className="font-bold text-slate-800">Need urgent access?</span>
              <span>Call Floor IT Desk <strong className="text-[#4f46e5] font-semibold font-mono">ext. 4401</strong></span>
            </div>
            <span className="hidden sm:inline text-slate-300">|</span>
            <div className="flex items-center space-x-2">
              <span className="text-slate-500">On-duty Dispatcher:</span>
              <span className="font-semibold text-slate-800">Tariq Rahman (HQ IT Ops)</span>
            </div>
          </div>
        </div>
      </main>

      {/* Recovery Footer */}
      <footer className="w-full bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-500 z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2024 Apex Garments Ltd. IT Infrastructure &amp; Security Services.</p>
          <div className="flex items-center space-x-4">
            <a className="hover:text-[#4f46e5] transition-colors" href="#security">IT Security Policy</a>
            <span>•</span>
            <a className="hover:text-[#4f46e5] transition-colors" href="#terms">Floor Access Terms</a>
            <span>•</span>
            <a className="hover:text-[#4f46e5] transition-colors" href="#hardware">Hardware Diagnostics</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

