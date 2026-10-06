import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Briefcase, 
  Compass, 
  Lock, 
  X, 
  AlertCircle,
  Eye,
  EyeOff,
  KeyRound,
  CheckCircle2
} from 'lucide-react';
import { api } from '../api/apiClient';

export const LoginModal = ({ isOpen, onClose, onLoginSuccess, initialRole = 'ADMIN' }) => {
  const [selectedRole, setSelectedRole] = useState(initialRole || 'ADMIN');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialRole) {
      setSelectedRole(initialRole);
    }
    setPassword('');
    setError('');
  }, [initialRole, isOpen]);

  if (!isOpen) return null;

  const roleConfigs = [
    {
      id: 'ADMIN',
      label: 'Admin',
      icon: Shield
    },
    {
      id: 'MANAGER',
      label: 'Manager',
      icon: Briefcase
    },
    {
      id: 'DRIVER',
      label: 'Driver',
      icon: Compass
    }
  ];

  const handleSelectRole = (role) => {
    setSelectedRole(role.id);
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

      setError('');
      onLoginSuccess(data.user);
      onClose();
    } catch (err) {
      setError(err.message || 'Incorrect password.');
    } finally {
      setSubmitting(false);
    }
  };

  const currentRoleConfig = roleConfigs.find(r => r.id === selectedRole) || roleConfigs[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl bg-white/98 border border-[#D31720]/25 p-6 sm:p-7 shadow-[0_24px_70px_rgba(211,23,32,0.25)] text-slate-900 space-y-5 relative overflow-hidden">
        {/* Top Accent Line */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#D31720] via-red-500 to-[#9B1017]" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#D31720] to-[#9B1017] border border-white/20 flex items-center justify-center text-white shadow-sm shrink-0">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg tracking-tight text-slate-950">
                  Switch System Role
                </h3>
              </div>
              <p className="text-xs text-slate-500 font-medium italic">
                Select access role and authenticate
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setError('');
              onClose();
            }}
            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Account Selection: Bigger Icons with Role Name */}
        <div className="space-y-2">
          <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-[#D31720]" />
            Select Role
          </label>

          <div className="grid grid-cols-3 gap-3">
            {roleConfigs.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.id;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => handleSelectRole(role)}
                  title={role.label}
                  aria-label={role.label}
                  className={`py-3.5 px-2 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer relative group ${
                    isSelected
                      ? 'bg-gradient-to-b from-[#D31720] via-red-600 to-[#9B1017] text-white shadow-[0_8px_20px_rgba(211,23,32,0.45)] border border-white/30 scale-[1.02]'
                      : 'bg-slate-50 hover:bg-red-50/40 text-slate-600 hover:text-[#D31720] border border-slate-200 hover:border-red-200 shadow-2xs hover:scale-[1.02]'
                  }`}
                >
                  <Icon className={`w-7 h-7 transition-transform group-hover:scale-110 ${isSelected ? 'stroke-[2.3] text-white' : 'stroke-[2] text-slate-600 group-hover:text-[#D31720]'}`} />
                  <span className={`text-xs font-black tracking-wide ${isSelected ? 'text-white' : 'text-slate-700 group-hover:text-[#D31720]'}`}>
                    {role.label}
                  </span>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* Password Input with Visibility Toggle */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700">
                Password
              </label>
            </div>

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
                className="w-full pl-4 pr-11 py-2.5 rounded-xl bg-white border border-slate-300 focus:border-[#D31720] text-slate-950 text-sm font-semibold focus:outline-none shadow-xs transition-colors"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error notice */}
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => {
                setError('');
                onClose();
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-300 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D31720] to-[#9B1017] hover:brightness-110 text-white font-black text-xs transition-all active:scale-95 shadow-[0_4px_16px_rgba(211,23,32,0.30)] disabled:opacity-60 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{submitting ? 'Authenticating...' : `Sign In as ${currentRoleConfig.label}`}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
