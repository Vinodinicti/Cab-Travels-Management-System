import React, { useState, useRef, useEffect } from 'react';
import { 
  Car, 
  Plus, 
  User, 
  Shield, 
  Briefcase, 
  Compass, 
  Menu, 
  X, 
  CheckCircle2, 
  ChevronDown, 
  Sparkles, 
  KeyRound,
  LogOut 
} from 'lucide-react';
import { PAGE_THEMES } from '../theme';

export const Header = ({ 
  currentUser, 
  onRoleChange, 
  onOpenLoginModal, 
  onLogout,
  onNewBookingClick, 
  mobileMenuOpen, 
  setMobileMenuOpen, 
  pageTitle, 
  pageSubtitle, 
  currentTab, 
  theme 
}) => {
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
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

  // Access Roles: Admin, Manager, Driver
  const roles = [
    { 
      id: 'ADMIN', 
      label: 'Admin', 
      icon: Shield, 
      user: 'R. Rajasekaran', 
      desc: 'Managing Director & Founder'
    },
    { 
      id: 'MANAGER', 
      label: 'Manager', 
      icon: Briefcase, 
      user: 'Kavitha Manickam', 
      desc: 'Fleet Operations Lead'
    },
    { 
      id: 'DRIVER', 
      label: 'Driver', 
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
                <span>CITY CABS</span>
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

          {/* Active Logged-in User: ICON ONLY (No name or title) */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="p-1.5 sm:p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white border border-white/40 shadow-[0_4px_18px_rgba(0,0,0,0.22),inset_0_1px_1.5px_rgba(255,255,255,0.6)] backdrop-blur-md transition-all active:scale-95 group shrink-0 flex items-center gap-1.5 cursor-pointer"
              title={`${currentUser.role}`}
              aria-label="User Menu"
            >
              {/* Role Icon in White Luxury Badge */}
              <div className="w-8 h-8 rounded-lg bg-white text-[#D31720] flex items-center justify-center font-black text-xs shrink-0 shadow-md border border-white/80 group-hover:scale-105 transition-transform">
                {currentUser.role === 'ADMIN' && <Shield className="w-4 h-4 stroke-[2.5]" />}
                {currentUser.role === 'MANAGER' && <Briefcase className="w-4 h-4 stroke-[2.5]" />}
                {currentUser.role === 'DRIVER' && <Compass className="w-4 h-4 stroke-[2.5]" />}
                {!['ADMIN', 'MANAGER', 'DRIVER'].includes(currentUser.role) && <User className="w-4 h-4 stroke-[2.5]" />}
              </div>

              <ChevronDown className={`w-3.5 h-3.5 text-white/90 group-hover:text-white transition-transform duration-200 shrink-0 ${roleDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu with ONLY ICONS for personas and Sign Out */}
            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2.5 w-72 sm:w-80 max-w-[calc(100vw-1.5rem)] rounded-2xl bg-white border-2 border-slate-200/90 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4),0_0_0_1px_rgba(0,0,0,0.06)] p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-slate-900">
                {/* Header with Title and explicit Close (X) button */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D31720] to-[#9B1017] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                      {currentUser.role === 'ADMIN' && <Shield className="w-4 h-4 stroke-[2.5]" />}
                      {currentUser.role === 'MANAGER' && <Briefcase className="w-4 h-4 stroke-[2.5]" />}
                      {currentUser.role === 'DRIVER' && <Compass className="w-4 h-4 stroke-[2.5]" />}
                      {!['ADMIN', 'MANAGER', 'DRIVER'].includes(currentUser.role) && <User className="w-4 h-4 stroke-[2.5]" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black text-slate-900 truncate">
                        {roles.find(r => r.id === currentUser.role)?.label || currentUser.role}
                      </p>
                      <p className="text-[10px] text-slate-500 font-semibold truncate">
                        Active Account
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setRoleDropdownOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors shrink-0"
                    title="Close"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Role Switcher: ONLY ICONS (No exposed cards or credentials) */}
                <div className="py-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1">
                      <KeyRound className="w-3 h-3 text-[#D31720]" />
                      <span>Switch Role</span>
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 italic">
                      {roles.find(r => r.id === currentUser.role)?.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {roles.map((r) => {
                      const Icon = r.icon;
                      const isActive = currentUser.role === r.id;
                      return (
                        <button
                          key={r.id}
                          onClick={() => handleRoleSelect(r.id)}
                          title={`${r.label} (${r.user})`}
                          aria-label={r.label}
                          className={`
                            py-2.5 px-1.5 rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-200 relative group cursor-pointer
                            ${isActive 
                              ? 'bg-gradient-to-b from-[#D31720] via-red-600 to-[#9B1017] text-white shadow-md shadow-[#D31720]/40 scale-100 border border-white/30' 
                              : 'bg-slate-50 hover:bg-red-50/50 text-slate-600 hover:text-[#D31720] border border-slate-200 hover:border-red-200 shadow-2xs hover:scale-105'
                            }
                          `}
                        >
                          <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'stroke-[2.3] text-white' : 'stroke-[2] text-slate-600 group-hover:text-[#D31720]'}`} />
                          <span className={`text-[11px] font-black tracking-wide ${isActive ? 'text-white' : 'text-slate-700 group-hover:text-[#D31720]'}`}>
                            {r.label}
                          </span>
                          {isActive && (
                            <span className="w-1 h-1 rounded-full bg-white shadow-xs" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Actions: Sign Out button */}
                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  <button
                    onClick={() => {
                      setRoleDropdownOpen(false);
                      if (onLogout) onLogout();
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-[#D31720] font-black text-xs flex items-center justify-center gap-2 active:scale-95 transition-all border border-red-200"
                  >
                    <LogOut className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Sign Out</span>
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
