// Page Theme Configuration for Cab Management System
// Unified Fleet/Cabs Page Theme (Warm Rose / Deep Wine Ruby with ambient lighting) across all pages

const UNIFIED_THEME_BASE = {
  colorKey: 'Glossy Maroon',
  bodyBg: 'bg-white',
  orbs: [],
  navGradient: 'bg-gradient-to-r from-[#7D0B12] via-[#A81018] to-[#D31720]',
  navBorder: 'border-b border-white/25',
  navGlow: 'shadow-[0_8px_32px_rgba(211,23,32,0.35)]',
  badgeStyle: 'bg-white/20 text-white border-white/35',
  headingGradient: 'from-[#D31720] via-red-700 to-[#7D0B12]',
  accentText: 'text-[#D31720]',
  bannerClass: 'theme-banner-vehicles',
  primaryColor: '#D31720',
};

export const PAGE_THEMES = {
  dashboard: {
    id: 'dashboard',
    name: 'Fleet Overview',
    subtitle: 'Live Operations & Active Rides',
    ...UNIFIED_THEME_BASE
  },
  bookings: {
    id: 'bookings',
    name: 'Trips & Bookings',
    subtitle: 'Route Dispatch & Passenger Bookings',
    ...UNIFIED_THEME_BASE
  },
  vehicles: {
    id: 'vehicles',
    name: 'Fleet / Cabs',
    subtitle: 'Registered Cabs, Tariffs & Maintenance',
    ...UNIFIED_THEME_BASE
  },
  drivers: {
    id: 'drivers',
    name: 'Captains Roster',
    subtitle: 'Captains Duty Status & Passenger Ratings',
    ...UNIFIED_THEME_BASE
  },
  customers: {
    id: 'customers',
    name: 'Passenger Directory',
    subtitle: 'Passenger Profiles & Lifetime Journeys',
    ...UNIFIED_THEME_BASE
  },
  'driver-portal': {
    id: 'driver-portal',
    name: 'Captain Duty Desk',
    subtitle: 'Active Ride, Passenger Contact & Fare Collection',
    ...UNIFIED_THEME_BASE
  },
  settings: {
    id: 'settings',
    name: 'System Administration',
    subtitle: 'Tariff Engine, GST & Permissions Matrix',
    ...UNIFIED_THEME_BASE
  }
};
