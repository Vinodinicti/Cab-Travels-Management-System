import React from 'react';
import { 
  Car, 
  CalendarClock, 
  Compass, 
  Users, 
  IndianRupee, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight,
  Phone,
  FileText,
  ChevronRight,
  Activity,
  MapPin,
  Plus
} from 'lucide-react';

export const Dashboard = ({ 
  stats, 
  bookings = [], 
  vehicles = [], 
  drivers: driversList = [], 
  currency = '₹', 
  onNavigate, 
  onNewBookingClick, 
  onViewInvoice, 
  onQuickStatusChange 
}) => {
  const totals = stats?.totals || {};
  const fleet = stats?.fleet || { available: 0, onTrip: 0, maintenance: 0, total: 0 };
  const drivers = stats?.drivers || { available: 0, onTrip: 0, offDuty: 0, total: 0 };
  const recentBookings = stats?.recentBookings || bookings.slice(0, 5) || [];

  // 5-Color KPI Metric Cards matching reference image specification (Crimson, Orange, Aqua, Teal, Navy)
  const kpiCards = [
    {
      num: '01',
      title: 'Active Rides',
      value: totals.activeTrips || bookings.filter(b => b.bookingStatus === 'In Progress').length || 0,
      subtext: 'Live cabs en route',
      glossyClass: 'glossy-crimson',
      numberColor: 'text-[#D31720]',
      icon: Compass,
      pulse: totals.activeTrips > 0
    },
    {
      num: '02',
      title: 'Gross Revenue',
      value: `${currency}${Number(totals.totalRevenue || 0).toLocaleString('en-IN')}`,
      subtext: 'Passenger fares settled',
      glossyClass: 'glossy-orange',
      numberColor: 'text-[#FEA24F]',
      icon: IndianRupee
    },
    {
      num: '03',
      title: 'Fleet Ready',
      value: `${fleet.available} / ${fleet.total || vehicles.length || 1}`,
      subtext: `${fleet.onTrip} on trip • ${fleet.maintenance} service`,
      glossyClass: 'glossy-aqua',
      numberColor: 'text-[#D31720]',
      icon: Car
    },
    {
      num: '04',
      title: 'Completed Trips',
      value: totals.completedTrips || bookings.filter(b => b.bookingStatus === 'Completed').length || 0,
      subtext: 'Completed safely',
      glossyClass: 'glossy-teal',
      numberColor: 'text-[#D31720]',
      icon: CheckCircle2
    },
    {
      num: '05',
      title: 'Captains Pool',
      value: `${drivers.available || 0} / ${drivers.total || driversList.length || 0}`,
      subtext: `${drivers.onTrip || 0} driving • TN staff`,
      glossyClass: 'glossy-navy',
      numberColor: 'text-[#051A2D]',
      icon: Users
    }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FEA24F]/15 text-[#B25900] border border-[#FEA24F]/40 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FEA24F] animate-ping" />
            <span>In Progress</span>
          </span>
        );
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#D31720]/15 text-[#D31720] border border-[#D31720]/40 shadow-sm">
            <CheckCircle2 className="w-3 h-3 text-[#D31720]" />
            <span>Confirmed</span>
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#D31720]/15 text-[#D31720] border border-[#D31720]/40 shadow-sm">
            <CheckCircle2 className="w-3 h-3 text-[#D31720]" />
            <span>Completed</span>
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#D31720]/15 text-[#D31720] border border-[#D31720]/40 shadow-sm">
            <span>Cancelled</span>
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#051A2D]/10 text-[#051A2D] border border-[#051A2D]/30 shadow-sm">
            <Clock className="w-3 h-3 text-[#051A2D]" />
            <span>Pending</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 sm:space-y-7 pb-12">
      {/* Top Welcome / Operations Compact Hero Banner */}
      <div className="p-4 sm:p-5 rounded-2xl theme-banner-vehicles shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 animate-page-enter">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D31720]/15 text-[#D31720] text-[11px] font-bold mb-1 border border-[#D31720]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D31720] animate-ping" />
            Live Fleet Control
          </div>
          <h2 className="text-lg sm:text-2xl font-black bg-gradient-to-r from-[#D31720] via-red-600 to-red-600 bg-clip-text text-transparent tracking-tight flex items-center gap-2">
            <Car className="w-5 h-5 sm:w-6 sm:h-6 text-[#D31720]" />
            <span>Kaveri Cabs Operations Hub</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium italic">
            Real-time dispatch and fleet oversight across Chennai, Coimbatore, Madurai, Salem & Trichy depots
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={onNewBookingClick}
            className="px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#D31720] to-[#9B1017] hover:brightness-105 text-white font-bold text-xs sm:text-sm active:scale-95 transition-all shadow-[0_4px_16px_rgba(211,23,32,0.35)] border border-white/30 flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create Booking</span>
          </button>
          <button
            onClick={() => onNavigate('bookings')}
            className="px-3.5 py-2 sm:py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm border border-slate-300 hover:border-slate-400 transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>View Bookings</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-600" />
          </button>
        </div>
      </div>

      {/* 5 Compact High-Contrast Metric Cards: Neat, All Data Visible, Small Font, Popping */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-2.5 sm:gap-3">
        {kpiCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`glossy-card ${card.glossyClass} p-3 rounded-2xl flex flex-col justify-between text-white shadow-md cursor-pointer transition-all duration-200 hover:scale-[1.03] hover:shadow-xl`}
            >
              {/* Top row: Number badge & Icon */}
              <div className="flex items-center justify-between mb-1.5">
                <div className={`w-6 h-6 rounded-full bg-white ${card.numberColor} shadow-sm flex items-center justify-center font-black text-[11px] shrink-0 border border-white/80`}>
                  {card.num}
                </div>
                <div className="w-6 h-6 rounded-full bg-white/15 border border-white/30 flex items-center justify-center text-white shrink-0">
                  <Icon className="w-3.5 h-3.5 text-white" />
                </div>
              </div>

              {/* Title, Value, Subtext: Small Font, All Data Clearly Visible Without Truncation */}
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-white/80 block leading-tight">
                  {card.title}
                </span>
                <div className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-1 my-0.5 leading-tight">
                  <span>{card.value}</span>
                  {card.pulse && (
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-white animate-ping shrink-0" />
                  )}
                </div>
                <p className="text-[10px] text-white/90 font-medium leading-tight">
                  {card.subtext}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Operations Quick Grid: Fleet Status & Chauffeur Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        {/* Fleet Availability Gauge */}
        <div className="p-5 rounded-2xl glass-panel space-y-4 border border-[#D31720]/20 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-slate-950 text-sm sm:text-base flex items-center gap-2">
                <Car className="w-4 h-4 text-[#D31720]" />
                Fleet Availability
              </h3>
            </div>
            <button 
              onClick={() => onNavigate('vehicles')}
              className="text-xs text-[#D31720] hover:underline font-black flex items-center gap-0.5"
            >
              Manage <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 pt-1">
            <div>
              <div className="flex justify-between text-xs font-black mb-1">
                <span className="text-[#D31720]">Available / Ready</span>
                <span className="text-slate-950">{fleet.available} / {fleet.total} cabs</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 border border-slate-200 overflow-hidden">
                <div 
                  className="bg-[#D31720] h-full rounded-full transition-all duration-500"
                  style={{ width: `${fleet.total ? (fleet.available / fleet.total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-black mb-1">
                <span className="text-[#B25900]">On Active Trip</span>
                <span className="text-slate-950">{fleet.onTrip} cabs</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 border border-slate-200 overflow-hidden">
                <div 
                  className="bg-[#FEA24F] h-full rounded-full transition-all duration-500"
                  style={{ width: `${fleet.total ? (fleet.onTrip / fleet.total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-black mb-1">
                <span className="text-[#D31720]">Maintenance</span>
                <span className="text-slate-950">{fleet.maintenance} cabs</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 border border-slate-200 overflow-hidden">
                <div 
                  className="bg-[#D31720] h-full rounded-full transition-all duration-500"
                  style={{ width: `${fleet.total ? (fleet.maintenance / fleet.total) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-700 font-bold">
            <span>Total Registered Cabs: <strong className="text-slate-950">{fleet.total}</strong></span>
            <span className="text-[#D31720] font-black">Active Fleet</span>
          </div>
        </div>

        {/* Chauffeur Readiness Box */}
        <div className="p-5 rounded-2xl glass-panel space-y-4 border border-[#051A2D]/20 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-slate-950 text-sm sm:text-base flex items-center gap-2">
              <Users className="w-4 h-4 text-[#051A2D]" />
              Captains Roster
            </h3>
            <button 
              onClick={() => onNavigate('drivers')}
              className="text-xs text-[#051A2D] hover:underline font-black flex items-center gap-0.5"
            >
              Roster <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-2.5 pt-1 text-center">
            <div className="p-3 rounded-xl bg-[#D31720]/10 text-slate-950 border border-[#D31720]/30 shadow-sm">
              <span className="text-2xl font-black text-[#D31720] block">{drivers.available}</span>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-700">Ready</span>
            </div>
            <div className="p-3 rounded-xl bg-[#FEA24F]/10 text-slate-950 border border-[#FEA24F]/30 shadow-sm">
              <span className="text-2xl font-black text-[#B25900] block">{drivers.onTrip}</span>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-700">Driving</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 text-slate-950 border border-slate-200 shadow-sm">
              <span className="text-2xl font-black text-slate-700 block">{drivers.offDuty}</span>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-700">Off Duty</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-700 font-bold">Average Passenger Rating:</span>
            <span className="font-black text-slate-950 flex items-center gap-1">
              <span className="text-amber-500 font-bold">★</span> 4.88 / 5.0
            </span>
          </div>
        </div>

        {/* Dispatch Shortcuts */}
        <div className="p-5 rounded-2xl glass-panel space-y-3 border border-[#FEA24F]/25 shadow-sm">
          <h3 className="font-black text-slate-950 text-sm sm:text-base flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#FEA24F]" />
            Dispatch Actions
          </h3>

          <div className="space-y-2">
            <button
              onClick={onNewBookingClick}
              className="w-full p-2.5 rounded-xl bg-[#FEA24F]/10 hover:bg-[#FEA24F]/20 border border-[#FEA24F]/30 text-left flex items-center justify-between transition-all group shadow-sm"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-r from-[#FEA24F] to-[#FF8F1F] text-white font-black flex items-center justify-center text-xs shadow-sm">
                  +
                </div>
                <div>
                  <p className="text-xs font-black text-slate-950 group-hover:text-[#B25900] transition-colors">Instant Booking Form</p>
                  <p className="text-[10px] text-slate-600 font-medium italic">Pickup, drop, live fare estimator</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#FEA24F]" />
            </button>

            <button
              onClick={() => onNavigate('vehicles')}
              className="w-full p-2.5 rounded-xl bg-white hover:bg-red-50/50 border border-slate-200 text-left flex items-center justify-between transition-all shadow-sm"
            >
              <div className="flex items-center gap-2.5">
                <Car className="w-4 h-4 text-[#D31720]" />
                <span className="text-xs font-bold text-slate-950">Add Fleet Vehicle</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => onNavigate('drivers')}
              className="w-full p-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-left flex items-center justify-between transition-all shadow-sm"
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-[#051A2D]" />
                <span className="text-xs font-bold text-slate-950">Onboard Captain</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Trips & Bookings Section with Popping Effects & Crisp Dark Text */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-md space-y-4 transition-all duration-300 hover:shadow-xl hover:border-slate-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-950 text-white flex items-center justify-center shadow-sm">
              <CalendarClock className="w-4 h-4 text-[#D31720]" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-950 text-base sm:text-lg tracking-tight">
                Recent Bookings
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Live trip dispatches & recent fares
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('bookings')}
            className="group px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-[#D31720] text-white text-xs font-bold transition-all duration-200 active:scale-95 flex items-center gap-1.5 shadow-sm self-start sm:self-auto hover:shadow-md"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Desktop Table: Precision-Aligned, Clean Dark Typography, Concise Content */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600 uppercase tracking-wider font-extrabold text-[11px] bg-slate-50/80">
                <th className="py-3 px-4 rounded-l-xl">Trip Ref</th>
                <th className="py-3 px-4">Passenger</th>
                <th className="py-3 px-4">Route</th>
                <th className="py-3 px-4">Cab & Captain</th>
                <th className="py-3 px-4">Fare</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right rounded-r-xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentBookings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-slate-400 font-semibold text-xs">
                    No bookings logged yet. Create your first booking above!
                  </td>
                </tr>
              ) : (
                recentBookings.map((b) => (
                  <tr 
                    key={b.id} 
                    className="group transition-all duration-200 hover:bg-slate-50/90 hover:scale-[1.008] hover:shadow-md rounded-xl cursor-default"
                  >
                    {/* Trip Ref & Type */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-mono font-black text-slate-950 text-xs">
                        {b.id}
                      </div>
                      <span className="inline-block mt-0.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        {b.tripType || 'One-Way'}
                      </span>
                    </td>

                    {/* Passenger */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-extrabold text-slate-950 text-xs leading-snug">
                        {b.customerName}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium mt-0.5 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{b.customerPhone}</span>
                      </div>
                    </td>

                    {/* Route: Concise with clean dot indicators */}
                    <td className="py-3.5 px-4 max-w-[240px]">
                      <div className="flex items-center gap-1.5 font-bold text-slate-950 text-xs truncate">
                        <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                        <span className="truncate">{b.pickupLocation ? b.pickupLocation.split(',')[0] : 'Origin'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600 font-medium text-[11px] truncate mt-0.5">
                        <span className="w-2 h-2 rounded-full bg-[#D31720] shrink-0" />
                        <span className="truncate">{b.dropLocation ? b.dropLocation.split(',')[0] : 'Destination'}</span>
                      </div>
                    </td>

                    {/* Cab & Captain */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-extrabold text-slate-950 text-xs">
                        {b.vehicleModel ? b.vehicleModel.split(' ').slice(0, 3).join(' ') : 'Unassigned'}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                        <span className="font-mono font-bold text-slate-800 bg-slate-100 px-1 py-0.2 rounded border border-slate-200">
                          {b.vehicleNumber}
                        </span>
                        <span className="mx-1">•</span>
                        <span className="font-semibold text-slate-700">{b.driverName || 'Pending'}</span>
                      </div>
                    </td>

                    {/* Fare */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-black text-slate-950 text-sm">
                        {currency}{b.fareDetails?.totalFare || 0}
                      </div>
                      <span className={`inline-block text-[10px] font-extrabold uppercase tracking-wide ${
                        b.paymentStatus === 'Paid' ? 'text-[#D31720]' : 'text-amber-700'
                      }`}>
                        {b.paymentStatus}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {getStatusBadge(b.bookingStatus)}
                    </td>

                    {/* Quick Action Buttons */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onViewInvoice(b)}
                          title="View / Print Invoice"
                          className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-950 border border-slate-300 transition-all shadow-sm active:scale-95"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                        {b.bookingStatus === 'Pending' && (
                          <button
                            onClick={() => onQuickStatusChange(b.id, 'Confirmed')}
                            className="px-2.5 py-1 rounded-lg bg-[#D31720] hover:bg-[#9B1017] text-white font-bold text-[11px] shadow-sm transition-all active:scale-95"
                          >
                            Confirm
                          </button>
                        )}
                        {b.bookingStatus === 'Confirmed' && (
                          <button
                            onClick={() => onQuickStatusChange(b.id, 'In Progress')}
                            className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] shadow-sm transition-all active:scale-95"
                          >
                            Start
                          </button>
                        )}
                        {b.bookingStatus === 'In Progress' && (
                          <button
                            onClick={() => onQuickStatusChange(b.id, 'Completed')}
                            className="px-2.5 py-1 rounded-lg bg-[#D31720] hover:bg-[#9B1017] text-white font-bold text-[11px] shadow-sm transition-all active:scale-95"
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View: Concise Stylish Popping Cards */}
        <div className="md:hidden space-y-3">
          {recentBookings.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 font-semibold">
              No recent trips. Create your first booking!
            </div>
          ) : (
            recentBookings.map((b) => (
              <div 
                key={b.id}
                className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 space-y-2.5"
              >
                {/* Header row: ID, Status, Fare */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-slate-950 text-xs">{b.id}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold uppercase tracking-wider">
                      {b.tripType || 'One-Way'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-slate-950 text-sm">
                      {currency}{b.fareDetails?.totalFare || 0}
                    </span>
                  </div>
                </div>

                {/* Passenger row */}
                <div className="flex items-center justify-between gap-2 text-xs">
                  <div className="min-w-0 flex-1">
                    <span className="font-extrabold text-slate-950 block truncate">{b.customerName}</span>
                    <span className="text-[11px] text-slate-500 font-medium block truncate">{b.customerPhone}</span>
                  </div>
                  <div className="shrink-0">
                    {getStatusBadge(b.bookingStatus)}
                  </div>
                </div>

                {/* Route Flow: Concise */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-950 font-bold min-w-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                    <span className="truncate">{b.pickupLocation ? b.pickupLocation.split(',')[0] : 'Origin'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600 font-medium min-w-0 text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D31720] shrink-0" />
                    <span className="truncate">{b.dropLocation ? b.dropLocation.split(',')[0] : 'Destination'}</span>
                  </div>
                </div>

                {/* Footer with Cab & Quick Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-2 text-xs">
                  <div className="min-w-0 flex-1">
                    <span className="font-bold text-slate-950 block truncate">
                      {b.vehicleModel ? b.vehicleModel.split(' ').slice(0, 3).join(' ') : 'Cab'}
                    </span>
                    <span className="text-[10px] text-slate-500 block truncate">
                      {b.driverName || 'Pending'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => onViewInvoice(b)}
                      className="p-1.5 rounded-lg bg-white text-slate-700 border border-slate-300 shadow-sm hover:bg-slate-50 transition-colors"
                      title="Invoice"
                    >
                      <FileText className="w-3.5 h-3.5" />
                    </button>
                    {b.bookingStatus === 'Pending' && (
                      <button
                        onClick={() => onQuickStatusChange(b.id, 'Confirmed')}
                        className="px-2.5 py-1 rounded-lg bg-[#D31720] text-white font-bold text-[11px] shadow-sm"
                      >
                        Confirm
                      </button>
                    )}
                    {b.bookingStatus === 'Confirmed' && (
                      <button
                        onClick={() => onQuickStatusChange(b.id, 'In Progress')}
                        className="px-2.5 py-1 rounded-lg bg-amber-500 text-white font-bold text-[11px] shadow-sm"
                      >
                        Start
                      </button>
                    )}
                    {b.bookingStatus === 'In Progress' && (
                      <button
                        onClick={() => onQuickStatusChange(b.id, 'Completed')}
                        className="px-2.5 py-1 rounded-lg bg-[#D31720] text-white font-bold text-[11px] shadow-sm"
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
