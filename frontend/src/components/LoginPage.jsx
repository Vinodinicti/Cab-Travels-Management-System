import React, { useState } from 'react';
import { 
  Shield, 
  Briefcase, 
  Compass, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle,
  KeyRound,
  CheckCircle2
} from 'lucide-react';
import { api } from '../api/apiClient';

export const LoginPage = ({ onLoginSuccess }) => {
  const [selectedRole, setSelectedRole] = useState('ADMIN');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 3 Access Roles: Admin, Manager, Driver
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

  const currentRole = roleConfigs.find(r => r.id === selectedRole) || roleConfigs[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      {/* Solid Pure White Card Container (No Dark Background) */}
      <div 
        className="w-full max-w-md rounded-3xl bg-white border-2 border-[#D31720]/25 p-6 sm:p-7 shadow-[0_25px_60px_-15px_rgba(211,23,32,0.25),0_10px_30px_rgba(0,0,0,0.08)] text-slate-900 space-y-5 relative overflow-hidden"
        style={{ backgroundColor: '#ffffff' }}
      >
        {/* Top Vibrant Red Accent Bar */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#D31720] via-red-600 to-[#9B1017]" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#D31720] to-[#9B1017] border border-white/40 flex items-center justify-center text-white shadow-sm shrink-0">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="font-black text-base sm:text-lg tracking-tight text-slate-900">
                System Portal Login
              </h3>
              <p className="text-xs text-slate-500 font-semibold italic">
                City Cabs & Travels • Select role to access portal
              </p>
            </div>
          </div>
        </div>

        {/* Role Selection: Bigger Icons with Role Name */}
        <div className="space-y-2">
          <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-[#D31720]" />
            <span>Select Role</span>
          </label>

          <div className="grid grid-cols-3 gap-3">
            {roleConfigs.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.id;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => handleRoleSelect(role.id)}
                  title={role.name}
                  aria-label={role.name}
                  className={`py-3.5 px-2 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer relative group ${
                    isSelected
                      ? 'bg-gradient-to-b from-[#D31720] via-red-600 to-[#9B1017] text-white shadow-[0_8px_20px_rgba(211,23,32,0.42)] border-2 border-red-500 scale-[1.02]'
                      : 'bg-white hover:bg-red-50/50 text-slate-700 hover:text-[#D31720] border-2 border-slate-200 hover:border-[#D31720]/40 shadow-xs hover:scale-[1.02]'
                  }`}
                >
                  <Icon className={`w-7 h-7 transition-transform group-hover:scale-110 ${isSelected ? 'stroke-[2.3] text-white' : 'stroke-[2] text-slate-600 group-hover:text-[#D31720]'}`} />
                  <span className={`text-xs font-black tracking-wide ${isSelected ? 'text-white' : 'text-slate-800 group-hover:text-[#D31720]'}`}>
                    {role.name}
                  </span>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Login Form: Pure White & Red */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* Password Input with Visibility Toggle */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter password"
                className="w-full pl-4 pr-11 py-2.5 rounded-xl bg-slate-50 hover:bg-white focus:bg-white border-2 border-slate-200 focus:border-[#D31720] text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#D31720]/20 shadow-xs transition-colors"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error notice */}
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border-2 border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#D31720] via-red-600 to-[#9B1017] hover:brightness-105 text-white font-black text-xs sm:text-sm transition-all active:scale-95 shadow-[0_4px_16px_rgba(211,23,32,0.35)] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{submitting ? 'Authenticating...' : `Sign In as ${currentRole.name}`}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
