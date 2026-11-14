'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthHeader } from '../../components/auth/AuthHeader';
import { AuthBrandHeader } from '../../components/auth/AuthBrandHeader';
import { AuthFooter } from '../../components/auth/AuthFooter';
import { PasswordInput } from '../../components/auth/PasswordInput';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('tariq.rahman@apexgarments.com');
  const [password, setPassword] = useState('ApexSuperAdmin#2024');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [activeRole, setActiveRole] = useState<'admin' | 'manager' | 'tech'>('admin');

  const selectRole = (role: 'admin' | 'manager' | 'tech') => {
    setActiveRole(role);
    if (role === 'admin') {
      setEmail('tariq.rahman@apexgarments.com');
      setPassword('ApexSuperAdmin#2024');
    } else if (role === 'manager') {
      setEmail('ananya.sen@apexgarments.com');
      setPassword('ApexITOpsManager#99');
    } else if (role === 'tech') {
      setEmail('kabir.hossain@apexgarments.com');
      setPassword('ApexFloorTech#Gazipur');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setAuthSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 700);
    }, 900);
  };

  return (
    <div className="h-full text-slate-800 antialiased font-sans flex flex-col justify-between min-h-screen enterprise-grid radial-glow relative bg-slate-50">
      {/* Top Utility Header */}
      <AuthHeader />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8 z-10" data-purpose="login-container">
        {/* Branding Section */}
        <AuthBrandHeader
          title="Welcome Back"
          subtitle="Sign in to manage your IT operations and facility infrastructure."
        />

        {/* Login Card Container */}
        <div className="w-full sm:max-w-[460px] bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 p-8 sm:p-9 transition-all">
          {/* Quick Role Preset Selector */}
          <div className="mb-6 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 px-1 flex items-center justify-between">
              <span>Demo Role Switcher</span>
              <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.2 rounded font-mono">1-click fill</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => selectRole('admin')}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border shadow-xs transition-all text-center cursor-pointer ${
                  activeRole === 'admin'
                    ? 'bg-indigo-50 border-[#4f46e5] text-[#4f46e5] font-semibold'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-[#4f46e5] hover:text-[#4f46e5]'
                }`}
              >
                Super Admin
              </button>
              <button
                type="button"
                onClick={() => selectRole('manager')}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border shadow-xs transition-all text-center cursor-pointer ${
                  activeRole === 'manager'
                    ? 'bg-indigo-50 border-[#4f46e5] text-[#4f46e5] font-semibold'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-[#4f46e5] hover:text-[#4f46e5]'
                }`}
              >
                IT Manager
              </button>
              <button
                type="button"
                onClick={() => selectRole('tech')}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border shadow-xs transition-all text-center cursor-pointer ${
                  activeRole === 'tech'
                    ? 'bg-indigo-50 border-[#4f46e5] text-[#4f46e5] font-semibold'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-[#4f46e5] hover:text-[#4f46e5]'
                }`}
              >
                Floor Tech
              </button>
            </div>
          </div>

          {/* Authentication Form */}
          <form className="space-y-4" onSubmit={handleLogin}>
            {/* Email Input Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide" htmlFor="work-email">
                Work Email Address
              </label>
              <div className="relative rounded-lg shadow-xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
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
                  id="work-email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@apexgarments.com"
                  className="block w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5] transition-colors"
                />
              </div>
              <p className="mt-1.5 text-[11px] text-slate-400">Apex Active Directory domain credentials</p>
            </div>

            {/* Password Input Field with Forgot Link */}
            <PasswordInput
              id="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              label="Password"
              badge={
                <Link
                  href="/reset-password"
                  className="text-xs font-medium text-[#4f46e5] hover:text-[#4338ca] transition-colors"
                >
                  Forgot password?
                </Link>
              }
            />

            {/* Remember Me Checkbox */}
            <div className="flex items-center pt-1">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-[#4f46e5] focus:ring-[#4f46e5] cursor-pointer"
              />
              <label className="ml-2.5 block text-xs font-medium text-slate-600 cursor-pointer select-none" htmlFor="remember-me">
                Trust this facility terminal for 30 days
              </label>
            </div>

            {/* Primary Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition-all cursor-pointer ${
                  authSuccess
                    ? 'bg-emerald-600'
                    : 'bg-[#4f46e5] hover:bg-[#4338ca] active:bg-[#3730a3]'
                }`}
              >
                {isLoading ? (
                  authSuccess ? (
                    <>
                      <svg className="h-4 w-4 text-white mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Authenticated. Redirecting...</span>
                    </>
                  ) : (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Authenticating Active Directory...</span>
                    </>
                  )
                ) : (
                  <>
                    <span>Sign In to ITMS</span>
                    <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-indigo-200 bg-indigo-700/60 rounded">
                      ↵ Enter
                    </kbd>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* SSO / Federation Notice */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 mb-2">
              <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
              <span className="font-medium text-slate-700">Protected by Enterprise SSO & Apex AD</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Hardware security keys (FIDO2) and Smartcards are supported at factory checkpoints.
            </p>
          </div>

          {/* Sign Up Redirect */}
          <div className="mt-5 text-center text-xs text-slate-500">
            Don't have an IT account?
            <Link className="font-semibold text-[#4f46e5] hover:text-[#4338ca] transition-colors ml-1" href="/signup">
              Request system access
            </Link>
          </div>
        </div>

        {/* Security Advisory Notice */}
        <div className="mt-6 text-center max-w-sm text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
          <span>Apex Garments IT infrastructure is continuously monitored for compliance and security auditing.</span>
        </div>
      </main>

      {/* Enterprise Compliance Footer */}
      <AuthFooter />
    </div>
  );
}

