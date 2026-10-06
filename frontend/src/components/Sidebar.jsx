import React from 'react';
import { 
  LayoutDashboard, 
  CalendarClock, 
  Car, 
  UserCheck, 
  Users, 
  Compass, 
  Settings,
  X
} from 'lucide-react';

export const Sidebar = ({ 
  currentTab, 
  setCurrentTab, 
  currentUser, 
  mobileMenuOpen, 
  setMobileMenuOpen, 
  stats,
  theme,
  onOpenLoginModal
}) => {
  const navItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard, 
      roles: ['ADMIN', 'MANAGER'],
      badge: null,
      activeGradient: 'bg-gradient-to-r from-[#051A2D] to-[#0A2F50]',
      activeShadow: 'shadow-[0_4px_16px_rgba(5,26,45,0.35)]',
      hoverBg: 'hover:bg-slate-100'
    },
    { 
      id: 'bookings', 
      label: 'Trips & Bookings', 
      icon: CalendarClock, 
      roles: ['ADMIN', 'MANAGER'],
      badge: stats?.totals?.activeTrips ? `${stats.totals.activeTrips} Active` : null,
      badgeColor: 'bg-[#FEA24F]/15 text-[#B25900] font-bold border border-[#FEA24F]/30',
      activeGradient: 'bg-gradient-to-r from-[#FEA24F] to-[#FF8F1F]',
      activeShadow: 'shadow-[0_4px_16px_rgba(254,162,79,0.35)]',
      hoverBg: 'hover:bg-orange-50'
    },
    { 
      id: 'driver-portal', 
      label: 'Captain Desk', 
      icon: Compass, 
      roles: ['ADMIN', 'MANAGER', 'DRIVER'],
      badge: currentUser.role === 'DRIVER' ? 'My Duty' : 'Preview',
      badgeColor: 'bg-[#FEA24F]/15 text-[#B25900] font-bold border border-[#FEA24F]/30',
      activeGradient: 'bg-gradient-to-r from-[#FEA24F] via-[#FF8F1F] to-[#D31720]',
      activeShadow: 'shadow-[0_4px_16px_rgba(254,162,79,0.35)]',
      hoverBg: 'hover:bg-amber-50'
    },
    { 
      id: 'vehicles', 
      label: 'Fleet / Cabs', 
      icon: Car, 
      roles: ['ADMIN', 'MANAGER'],
      badge: stats?.fleet?.available ? `${stats.fleet.available} Free` : null,
      badgeColor: 'bg-[#D31720]/15 text-[#D31720] font-bold border border-[#D31720]/30',
      activeGradient: 'bg-gradient-to-r from-[#D31720] to-[#9B1017]',
      activeShadow: 'shadow-[0_4px_16px_rgba(211,23,32,0.35)]',
      hoverBg: 'hover:bg-red-50'
    },
    { 
      id: 'drivers', 
      label: 'Captains', 
      icon: UserCheck, 
      roles: ['ADMIN', 'MANAGER'],
      badge: null,
      activeGradient: 'bg-gradient-to-r from-[#D31720] to-[#9B1017]',
      activeShadow: 'shadow-[0_4px_16px_rgba(211,23,32,0.35)]',
      hoverBg: 'hover:bg-red-50'
    },
    { 
      id: 'customers', 
      label: 'Passengers', 
      icon: Users, 
      roles: ['ADMIN', 'MANAGER'],
      badge: null,
      activeGradient: 'bg-gradient-to-r from-[#D31720] to-[#9B1017]',
      activeShadow: 'shadow-[0_4px_16px_rgba(211,23,32,0.35)]',
      hoverBg: 'hover:bg-red-50'
    },
    { 
      id: 'settings', 
      label: 'System & Tariffs', 
      icon: Settings, 
      roles: ['ADMIN'],
      badge: 'Admin',
      badgeColor: 'bg-[#D31720]/15 text-[#D31720] font-bold border border-[#D31720]/30',
      activeGradient: 'bg-gradient-to-r from-[#D31720] to-[#9B1017]',
      activeShadow: 'shadow-[0_4px_16px_rgba(211,23,32,0.35)]',
      hoverBg: 'hover:bg-red-50'
    }
  ];

  const visibleItems = navItems.filter(item => item.roles.includes(currentUser.role));

  const handleSelect = (tabId) => {
    setCurrentTab(tabId);
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar container: Glossy Pure Red Gradient (#D31720) with Smooth White Font */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-gradient-to-b from-[#D31720] via-[#A81018] via-[#7D0B12] to-[#4A060A] text-white border-r border-white/20 flex flex-col transition-transform duration-200 ease-out shadow-[4px_0_35px_rgba(211,23,32,0.45)] overflow-hidden antialiased
        lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      style={{ textRendering: 'optimizeLegibility', WebkitFontSmoothing: 'antialiased' }}
      >
        {/* Specular gloss top light sweep */}
        <div className="absolute top-0 left-0 right-0 h-44 bg-gradient-to-b from-white/30 via-white/8 to-transparent pointer-events-none z-10" />
        {/* Specular vertical glass edge */}
        <div className="absolute top-0 right-0 w-[1.5px] h-full bg-gradient-to-b from-white/80 via-white/25 to-transparent pointer-events-none z-10" />
        {/* Ambient glowing pure red light orbs */}
        <div className="absolute -top-10 -left-10 w-48 h-48 bg-red-400/25 rounded-full blur-3xl pointer-events-none z-0" />
        <div className="absolute top-1/2 -right-10 w-44 h-44 bg-red-600/25 rounded-full blur-3xl pointer-events-none z-0" />

        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 sm:px-5 border-b border-white/15 bg-black/15 backdrop-blur-md relative z-20">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white via-red-50 to-white text-[#D31720] border border-white/80 flex items-center justify-center font-black shadow-[0_4px_16px_rgba(0,0,0,0.25)] shrink-0">
              <Car className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-black tracking-tight text-white text-base drop-shadow-[0_2px_8px_rgba(255,255,255,0.35)]">CITY</span>
                <span className="font-extrabold tracking-tight text-amber-200 text-base drop-shadow-sm">CABS</span>
              </div>
              <p className="text-[10px] text-white/90 tracking-wider font-semibold italic mt-1 truncate drop-shadow-xs">
                Fleet & Captains Network
              </p>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-white/90 hover:text-white hover:bg-white/20 transition-colors shrink-0"
            aria-label="Close Navigation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto relative z-20">
          <div className="px-3 pb-2 text-[10px] font-black uppercase tracking-wider text-white/80 drop-shadow-xs">
            Operations Console
          </div>

          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`
                  w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 group relative overflow-hidden
                  ${isActive 
                    ? 'bg-gradient-to-r from-white/25 via-white/20 to-white/10 text-white shadow-[0_4px_20px_rgba(0,0,0,0.35),inset_0_1px_1.5px_rgba(255,255,255,0.7)] border border-white/55 font-black scale-[1.02] backdrop-blur-md' 
                    : 'text-white/85 hover:text-white hover:bg-white/15 hover:border-white/30 border border-transparent hover:shadow-[0_2px_12px_rgba(255,255,255,0.1)]'
                  }
                `}
              >
                {/* Active glossy glass highlight shine */}
                {isActive && (
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none" />
                )}
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 shrink-0 ${isActive ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]' : 'text-white/85 group-hover:text-white'}`} />
                  <span className={`text-left whitespace-nowrap tracking-wide ${isActive ? 'text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)] font-black' : 'font-semibold group-hover:translate-x-0.5 transition-transform'}`}>
                    {item.label}
                  </span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-black shrink-0 ${isActive ? 'bg-white/30 text-white border border-white/50 backdrop-blur-md shadow-xs' : 'bg-white/15 text-white/90 border border-white/25'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
};
