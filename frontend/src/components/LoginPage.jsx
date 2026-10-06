import React, { useState } from 'react';
import { 
  Shield, 
  Briefcase, 
  Compass, 
  Lock, 
  Eye, 
  EyeOff, 
  Car, 
  ArrowRight,
  AlertCircle,
  KeyRound
} from 'lucide-react';
import { api } from '../api/apiClient';

export const LoginPage = ({ onLoginSuccess }) => {
  const [selectedRole, setSelectedRole] = useState('ADMIN');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 3 Access Roles: admin, manager, driver (Clean, bigger icons, no hints)
  const roleConfigs = [
    {
      id: 'ADMIN',
      name: 'Admin',
      icon: Shield
    },
    {
      id: 'MANAGER',
      name: 'Manager',
      icon: Briefcase
    },
    {
      id: 'DRIVER',
      name: 'Driver',
      icon: Compass
    }
  ];

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    setPassword('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const data = await api.login({
        role: selectedRole,
        password: password
      });

      onLoginSuccess(data.user);
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-[#190406] to-[#2b080a] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden select-none">
      {/* Ambient background glow orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#D31720]/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-red-900/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Luxury Red-Themed Login Box */}
      <div className="w-full max-w-[430px] bg-white/98 backdrop-blur-3xl rounded-3xl border border-[#D31720]/25 shadow-[0_25px_70px_-12px_rgba(211,23,32,0.35),0_0_0_1px_rgba(211,23,32,0.12)] p-6 sm:p-8 relative z-10 animate-in fade-in zoom-in-95 duration-300 overflow-hidden">
        
        {/* Top Specular Red Gradient Accent Line */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#D31720] via-red-500 to-[#9B1017]" />

        {/* Brand Header */}
        <div className="text-center mt-1 mb-7">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D31720] via-red-600 to-[#9B1017] text-white shadow-[0_10px_30px_rgba(211,23,32,0.45)] border border-white/40 mb-3.5 transition-transform hover:scale-105">
            <Car className="w-8 h-8 stroke-[2.5]" />
          </div>
          
          <div className="flex items-center justify-center gap-1.5 leading-none">
            <h1 className="font-black text-2xl tracking-tight text-slate-950">CITY</h1>
            <span className="font-black text-2xl tracking-tight text-[#D31720]">CABS</span>
          </div>

          <p className="text-xs text-slate-500 font-medium italic mt-1.5">
            Tamil Nadu Fleet Operations & Dispatch Portal
          </p>
        </div>

        {/* Role Selector: Admin, Manager, Driver with BIGGER ICONS */}
        <div className="mb-6">
          <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-2.5 px-0.5 flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-[#D31720]" />
            <span>Select Access Role</span>
          </label>

          {/* 3 Prominent, Bigger Role Icon Buttons */}
          <div className="grid grid-cols-3 gap-3">
            {roleConfigs.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.id;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => handleRoleSelect(role.id)}
                  className={`
                    py-3.5 sm:py-4 px-2 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-200 cursor-pointer relative group
                    ${isSelected 
                      ? 'bg-gradient-to-b from-[#D31720] via-red-600 to-[#9B1017] text-white shadow-[0_10px_25px_-5px_rgba(211,23,32,0.5),inset_0_1.5px_2px_rgba(255,255,255,0.4)] border border-white/30 scale-[1.02]' 
                      : 'bg-slate-50 hover:bg-red-50/40 text-slate-600 hover:text-[#D31720] border border-slate-200 hover:border-red-200 shadow-2xs hover:scale-[1.02]'
                    }
                  `}
                >
                  {/* Noticeably bigger icon */}
                  <Icon className={`w-7 h-7 sm:w-8 sm:h-8 transition-transform group-hover:scale-110 ${isSelected ? 'stroke-[2.3] text-white drop-shadow-sm' : 'stroke-[2] text-slate-600 group-hover:text-[#D31720]'}`} />
                  
                  {/* Clean role title text: Admin, Manager, Driver */}
                  <span className={`text-xs font-black tracking-wide ${isSelected ? 'text-white' : 'text-slate-700 group-hover:text-[#D31720]'}`}>
                    {role.name}
                  </span>

                  {/* Active highlight dot */}
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Login Form: Clean, Professional, No Hints/Demo */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1.5 px-0.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D31720] pointer-events-none">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter password"
                className="w-full pl-10 pr-11 py-3 bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-[#D31720] rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D31720]/20 transition-all shadow-xs"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Elegant Red Action Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D31720] via-red-600 to-[#9B1017] hover:brightness-105 active:scale-[0.98] text-white font-black text-sm tracking-wide transition-all shadow-[0_10px_25px_rgba(211,23,32,0.4)] border border-white/30 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer mt-2"
          >
            {submitting ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to System</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
