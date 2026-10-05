import React, { useState, useRef, useEffect } from 'react';
import { 
  Car, 
  Plus, 
  RotateCcw, 
  User, 
  Shield, 
  Briefcase, 
  Compass, 
  Menu, 
  X,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  KeyRound
} from 'lucide-react';
import { PAGE_THEMES } from '../theme';

export const Header = ({ 
  currentUser, 
  onRoleChange, 
  onOpenLoginModal,
  onNewBookingClick, 
  onResetData, 
  mobileMenuOpen, 
  setMobileMenuOpen,
  pageTitle,
  pageSubtitle,
  currentTab,
  theme
}) => {
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [resetConfirming, setResetConfirming] = useState(false);
  const dropdownRef = useRef(null);

  const currentTheme = theme || PAGE_THEMES[currentTab] || PAGE_THEMES.dashboard;

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    if (!roleDropdownOpen) return;

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setRoleDropdownOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setRoleDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [roleDropdownOpen]);

  // Role Personas with credentials
  const roles = [
    { 
      id: 'ADMIN', 
      label: 'Admin / Owner', 
      icon: Shield, 
      user: 'R. Rajasekaran', 
      desc: 'Managing Director & Founder'
    },
    { 
      id: 'MANAGER', 
      label: 'Fleet Operations', 
      icon: Briefcase, 
      user: 'Kavitha Manickam', 
      desc: 'Fleet Operations Lead'
    },
    { 
      id: 'DRIVER', 
      label: 'Senior Captain', 
      icon: Compass, 
      user: 'Murugan Selvam', 
      desc: 'Senior Fleet Captain'
    }
  ];

  const handleRoleSelect = (roleId) => {
    setRoleDropdownOpen(false);
    if (onOpenLoginModal) {
      onOpenLoginModal(roleId);
    } else if (onRoleChange) {
      onRoleChange(roleId);
    }
  };

  const handleReset = async () => {
    setResetConfirming(true);
    await onResetData();
    setTimeout(() => setResetConfirming(false), 2000);
  };

  return (
    <header className={`sticky top-0 ${roleDropdownOpen ? 'z-50' : 'z-40'} ${currentTheme.navGradient} ${currentTheme.navBorder} ${currentTheme.navGlow} backdrop-blur-xl px-3 sm:px-6 py-2.5 sm:py-3.5 transition-all duration-300 relative antialiased`} style={{ textRendering: 'optimizeLegibility', WebkitFontSmoothing: 'antialiased' }}>
      {/* Specular gloss highlight container with isolated overflow-hidden */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Specular gloss highlight stripe on the top of the navbar */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/90 to-transparent z-10" />
        {/* Glossy curved ambient highlight */}
        <div className="absolute -top-10 right-1/4 w-96 h-24 bg-red-400/20 rounded-full blur-2xl" />
        <div className="absolute -bottom-8 left-1/3 w-72 h-16 bg-white/10 rounded-full blur-xl" />
      </div>

      <div className="relative z-20 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Mobile Navigation Button & Page Title */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-white hover:text-white rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 backdrop-blur-md active:scale-95 transition-all shrink-0 shadow-sm"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-4 h-4 text-white" /> : <Menu className="w-4 h-4 text-white" />}
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-2xl font-black tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)] truncate flex items-center gap-2">
                <span>{pageTitle}</span>
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 text-white border border-white/35 backdrop-blur-md shadow-sm">
                <Sparkles className="w-3 h-3 text-amber-200" />
                <span>KAVERI</span>
              </span>
            </div>
            {pageSubtitle && (
              <p className="text-[10px] sm:text-xs text-white/95 truncate font-medium italic drop-shadow-sm mt-0.5">
                {pageSubtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right: Actions & Role Persona Switcher */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* New Booking Action: Glossy Luxury Glass Button with Smooth White Font */}
          {currentUser.role !== 'DRIVER' && (
            <button
              onClick={onNewBookingClick}
              className="group flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-white/25 via-white/20 to-white/30 hover:bg-white/35 text-white font-black text-xs sm:text-sm active:scale-95 transition-all shadow-[0_4px_16px_rgba(0,0,0,0.25),inset_0_1px_1.5px_rgba(255,255,255,0.7)] border border-white/50 backdrop-blur-md shrink-0"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3] text-white group-hover:rotate-90 transition-transform duration-200 drop-shadow-xs" />
              <span className="hidden xs:inline tracking-tight font-black text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">New Booking</span>
            </button>
          )}

          {/* Reset Demo Data Button */}
          <button
            onClick={handleReset}
            disabled={resetConfirming}
            title="Reset system to default demo state"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold text-white bg-white/15 hover:bg-white/25 border border-white/35 rounded-xl transition-all shadow-sm active:scale-95 backdrop-blur-md shrink-0"
          >
            <RotateCcw className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${resetConfirming ? 'animate-spin text-white' : 'text-white'}`} />
            <span className="hidden sm:inline text-white drop-shadow-xs">
              {resetConfirming ? 'Restoring...' : 'Reset Demo Data'}
            </span>
          </button>

          {/* Active Logged-in User Pill: High-Gloss Luxury Glass Card with Smooth White Font */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2.5 px-3 py-1.5 sm:py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white border border-white/40 shadow-[0_4px_18px_rgba(0,0,0,0.22),inset_0_1px_1.5px_rgba(255,255,255,0.6)] backdrop-blur-md transition-all text-left active:scale-95 group shrink-0"
              title="Active Login Details & Switch Persona"
            >
              {/* Avatar */}
              <div className="w-8 h-8 rounded-lg bg-white text-[#D31720] flex items-center justify-center font-black text-xs shrink-0 shadow-md border border-white/80">
                {currentUser?.name ? currentUser.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() : 'RR'}
              </div>

              {/* Login Details: Full name, role badge, full title - NO TRUNCATION */}
              <div className="text-left leading-tight pr-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-white whitespace-nowrap drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-black tracking-wider bg-white/30 text-white border border-white/50 shadow-2xs">
                    {currentUser.role}
                  </span>
                </div>
                <div className="text-[10px] sm:text-[11px] text-white/90 font-medium whitespace-nowrap mt-0.5 drop-shadow-xs">
                  {currentUser.title || currentUser.role}
                </div>
              </div>

              <ChevronDown className={`w-4 h-4 text-white/80 group-hover:text-white transition-transform duration-200 shrink-0 ${roleDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu with Complete Visible Login Credentials */}
            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2.5 w-84 sm:w-96 max-w-[calc(100vw-1.5rem)] rounded-2xl bg-white border-2 border-slate-200/90 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4),0_0_0_1px_rgba(0,0,0,0.06)] p-3.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-slate-900">
                {/* Header with Title and explicit Close (X) button */}
                <div className="px-1 py-1 border-b border-slate-100 pb-2.5 mb-2.5 flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-black text-slate-950 uppercase tracking-wider flex items-center gap-1.5">
                      <span>Active Login Details</span>
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5 italic">
                      Switch user persona
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#D31720]/10 text-[#D31720] border border-[#D31720]/25">
                      Online
                    </span>
                    <button
                      onClick={() => setRoleDropdownOpen(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                      title="Close"
                      aria-label="Close"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Role Cards List - Crisp High Contrast, Solid Background Cards */}
                <div className="space-y-2">
                  {roles.map((r) => {
                    const Icon = r.icon;
                    const isActive = currentUser.role === r.id;
                    return (
                      <button
                        key={r.id}
                        onClick={() => handleRoleSelect(r.id)}
                        className={`w-full text-left p-3 rounded-xl flex items-start gap-3 transition-all ${
                          isActive 
                            ? 'bg-red-50/70 text-slate-950 border-2 border-[#D31720] shadow-sm font-bold' 
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-900 border border-slate-200 shadow-2xs'
                        }`}
                      >
                        <div className={`p-2 rounded-lg shrink-0 ${isActive ? 'bg-gradient-to-r from-[#D31720] to-[#9B1017] text-white shadow-sm' : 'bg-white text-slate-700 border border-slate-200'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-black text-slate-950">{r.label}</span>
                            {isActive ? (
                              <span className="flex items-center gap-1 text-[10px] font-black text-[#D31720] shrink-0 bg-white px-1.5 py-0.5 rounded-md border border-[#D31720]/30 shadow-2xs">
                                <CheckCircle2 className="w-3 h-3 text-[#D31720]" />
                                <span>Active</span>
                              </span>
                            ) : null}
                          </div>
                          <p className="text-xs text-slate-900 font-bold mt-0.5">{r.user}</p>
                          <p className="text-[10px] text-slate-500 italic mt-0.5">{r.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Button to open full Login Portal */}
                <div className="mt-3 pt-2.5 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setRoleDropdownOpen(false);
                      if (onOpenLoginModal) onOpenLoginModal();
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#D31720] to-[#9B1017] hover:brightness-110 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all border border-white/20"
                  >
                    <KeyRound className="w-4 h-4 text-amber-200" />
                    <span>Open Full Login Portal</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
