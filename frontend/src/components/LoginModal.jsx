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
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const LoginModal = ({ isOpen, onClose, onLoginSuccess, initialRole = 'ADMIN' }) => {
  const [selectedRole, setSelectedRole] = useState(initialRole || 'ADMIN');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialRole) {
      setSelectedRole(initialRole);
      const defaults = {
        ADMIN: 'admin123',
        MANAGER: 'manager123',
        DRIVER: 'driver123'
      };
      if (defaults[initialRole]) {
        setPassword(defaults[initialRole]);
      }
    }
    setError('');
  }, [initialRole, isOpen]);

  if (!isOpen) return null;

  const roleConfigs = [
    {
      id: 'ADMIN',
      label: 'Admin / Owner',
      user: 'R. Rajasekaran',
      icon: Shield,
      tag: 'Full Access',
      defaultPassword: 'admin123'
    },
    {
      id: 'MANAGER',
      label: 'Fleet Operations',
      user: 'Kavitha Manickam',
      icon: Briefcase,
      tag: 'Ops Desk',
      defaultPassword: 'manager123'
    },
    {
      id: 'DRIVER',
      label: 'Senior Captain',
      user: 'Murugan Selvam',
      icon: Compass,
      tag: 'Captain View',
      defaultPassword: 'driver123'
    }
  ];

  const handleSelectRole = (role) => {
    setSelectedRole(role.id);
    setPassword(role.defaultPassword);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      setError('Please enter your account password.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: selectedRole,
          password: password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Authentication failed. Please check credentials.');
      }

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
      <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 p-5 sm:p-7 shadow-[0_24px_70px_rgba(5,26,45,0.25)] text-slate-900 space-y-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#D31720] to-[#9B1017] border border-white/20 flex items-center justify-center text-white shadow-sm shrink-0">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg tracking-tight text-slate-950">
                  System Login Details
                </h3>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#D31720]/15 text-[#D31720] border border-[#D31720]/30">
                  Verified
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium italic">
                Choose an account or verify password to switch persona
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

        {/* Visible Demo Accounts with Passwords */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[#D31720]" />
              Select Account & View Login Details
            </label>
            <span className="text-[10px] text-slate-500 font-medium italic">
              Click to 1-click autofill
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {roleConfigs.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.id;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => handleSelectRole(role)}
                  className={`p-3 rounded-2xl flex flex-col items-start gap-1.5 transition-all text-left border relative overflow-hidden ${
                    isSelected
                      ? 'bg-gradient-to-br from-[#D31720]/5 via-white to-[#D31720]/10 border-[#D31720] shadow-md ring-2 ring-[#D31720]/15'
                      : 'bg-slate-50/80 border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className={`p-1.5 rounded-xl shrink-0 ${isSelected ? 'bg-gradient-to-br from-[#D31720] to-[#9B1017] text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200'}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    {isSelected ? (
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-[#D31720] text-white shadow-xs">
                        Selected
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                        {role.tag}
                      </span>
                    )}
                  </div>

                  <div className="w-full min-w-0 mt-0.5">
                    <span className="text-xs font-black text-slate-950 block truncate">
                      {role.label}
                    </span>
                    <span className="text-[11px] text-slate-700 font-bold block truncate">
                      {role.user}
                    </span>
                  </div>

                  {/* High Visibility Password Display */}
                  <div className="w-full mt-1 pt-1.5 border-t border-slate-200/80 flex items-center justify-between text-[10px]">
                    <span className="text-slate-500 font-medium">Pass:</span>
                    <span className="font-mono font-black text-slate-950 bg-white px-1.5 py-0.5 rounded border border-slate-300 tracking-wider shadow-2xs">
                      {role.defaultPassword}
                    </span>
                  </div>
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
                Password for {currentRoleConfig.user}
              </label>
              <button
                type="button"
                onClick={() => setPassword(currentRoleConfig.defaultPassword)}
                className="text-[11px] font-bold text-[#D31720] hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>Fill "{currentRoleConfig.defaultPassword}"</span>
              </button>
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
