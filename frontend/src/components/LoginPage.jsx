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
  KeyRound,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { api } from '../api/apiClient';

export const LoginPage = ({ onLoginSuccess }) => {
  const [selectedRole, setSelectedRole] = useState('ADMIN');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 3 Persona roles represented by ONLY ICONS
  const roleIcons = [
    {
      id: 'ADMIN',
      icon: Shield,
      tooltip: 'Administrator / Owner',
      defaultPass: 'admin123'
    },
    {
      id: 'MANAGER',
      icon: Briefcase,
      tooltip: 'Fleet Operations Lead',
      defaultPass: 'manager123'
    },
    {
      id: 'DRIVER',
      icon: Compass,
      tooltip: 'Senior Fleet Captain',
      defaultPass: 'driver123'
    }
  ];

  const handleRoleSelect = (roleId, defPass) => {
    setSelectedRole(roleId);
    setPassword(defPass);
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
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-[#1b0608] to-[#2c080b] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden select-none">
      {/* Ambient background glow orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#D31720]/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-900/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-3xl border border-white/60 shadow-[0_25px_70px_rgba(0,0,0,0.5),0_0_0_1px_rgba(211,23,32,0.15)] p-6 sm:p-8 relative z-10 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D31720] via-red-600 to-[#9B1017] text-white shadow-[0_8px_24px_rgba(211,23,32,0.4)] border border-white/40 mb-3 group transition-transform hover:scale-105">
            <Car className="w-7 h-7 stroke-[2.5]" />
          </div>
          
          <div className="flex items-center justify-center gap-1.5 leading-none">
            <h1 className="font-black text-2xl tracking-tight text-slate-950">CITY</h1>
            <span className="font-black text-2xl tracking-tight text-[#D31720]">CABS</span>
            <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#D31720]/10 text-[#D31720] border border-[#D31720]/30 ml-1">
              PRO
            </span>
          </div>

          <p className="text-xs text-slate-500 font-medium italic mt-1.5">
            Fleet & Travels Operations Gateway
          </p>
        </div>

        {/* Role Selector: ONLY ICONS (No exposed cards or credential details) */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2 px-1">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[#D31720]" />
              <span>Select Access Role</span>
            </label>
            <span className="text-[10px] font-bold text-slate-400 italic">
              {roleIcons.find(r => r.id === selectedRole)?.tooltip}
            </span>
          </div>

          {/* 3 Role Icons Only */}
          <div className="grid grid-cols-3 gap-3 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/80">
            {roleIcons.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.id;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => handleRoleSelect(role.id, role.defaultPass)}
                  title={role.tooltip}
                  aria-label={role.tooltip}
                  className={`
                    relative h-13 rounded-xl flex items-center justify-center transition-all duration-200 group
                    ${isSelected 
                      ? 'bg-gradient-to-br from-[#D31720] to-[#9B1017] text-white shadow-md shadow-[#D31720]/30 scale-100 border border-white/30' 
                      : 'bg-white hover:bg-slate-50 text-slate-600 hover:text-[#D31720] border border-slate-200/70 shadow-2xs hover:scale-[1.02]'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isSelected ? 'stroke-[2.5]' : 'stroke-2'}`} />
                  
                  {/* Subtle active pip indicator */}
                  {isSelected && (
                    <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1.5 px-1">
              Secure Password
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
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
                className="w-full pl-10 pr-11 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-[#D31720] rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D31720]/20 transition-all shadow-xs"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 transition-colors"
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D31720] via-red-600 to-[#9B1017] hover:brightness-105 active:scale-[0.98] text-white font-black text-xs sm:text-sm tracking-wide transition-all shadow-md shadow-[#D31720]/35 border border-white/30 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
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

        {/* Discreet Quick Switch Indicator */}
        <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium px-1">
          <span className="flex items-center gap-1 text-slate-400">
            <Sparkles className="w-3 h-3 text-[#D31720]" />
            <span>Role-Based Portal</span>
          </span>
          <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
            Demo: {selectedRole.toLowerCase()}123
          </span>
        </div>
      </div>
    </div>
  );
};
