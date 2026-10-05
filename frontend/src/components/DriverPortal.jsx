import React from 'react';
import { 
  Compass, 
  MapPin, 
  Phone, 
  Clock, 
  CheckCircle2, 
  Play, 
  Navigation, 
  Star, 
  Calendar, 
  FileText,
  Car
} from 'lucide-react';

export const DriverPortal = ({ 
  currentUser, 
  bookings, 
  drivers, 
  onStatusChange, 
  onToggleDuty, 
  onViewInvoice, 
  currency = '₹' 
}) => {
  const currentDriver = drivers.find(d => d.id === currentUser.driverId) || drivers[0] || {};
  
  const driverBookings = bookings.filter(
    b => b.driverId === currentDriver.id || b.driverName === currentDriver.name
  );

  const activeTrip = driverBookings.find(b => b.bookingStatus === 'In Progress');
  const upcomingTrips = driverBookings.filter(b => b.bookingStatus === 'Confirmed' || b.bookingStatus === 'Pending');
  const completedTrips = driverBookings.filter(b => b.bookingStatus === 'Completed');

  const totalEarningsToday = completedTrips.reduce((sum, b) => sum + (b.fareDetails?.totalFare || 0), 0);

  return (
    <div className="space-y-5 sm:space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Driver Status Glassy Banner */}
      <div className="p-4 sm:p-6 rounded-2xl theme-banner-vehicles shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-page-enter">
        <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 w-full sm:w-auto">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#D31720] to-[#9B1017] border border-white/30 flex items-center justify-center text-white font-black text-lg sm:text-xl shadow-md shrink-0">
            {currentDriver?.name ? currentDriver.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() : 'CP'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-xl font-black bg-gradient-to-r from-[#D31720] via-red-600 to-red-600 bg-clip-text text-transparent truncate">{currentDriver.name || 'Murugan Selvam'}</h2>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold shrink-0 ${
                currentDriver.status === 'Available' ? 'bg-[#D31720]/15 text-[#D31720] border border-[#D31720]/40' :
                currentDriver.status === 'On Trip' ? 'bg-[#FEA24F]/15 text-[#B25900] border border-[#FEA24F]/40' :
                'bg-[#051A2D]/10 text-[#051A2D] border border-[#051A2D]/30'
              }`}>
                {currentDriver.status === 'Available' ? 'Available' :
                 currentDriver.status === 'On Trip' ? 'On Trip' : 'Off Duty'}
              </span>
            </div>
            <p className="text-xs text-slate-700 font-semibold mt-0.5 truncate italic">
              Assigned Cab: <strong className="text-slate-950 font-black not-italic">{currentDriver.assignedVehicleName || 'Toyota Innova Crysta (TN 07 CM 4050)'}</strong>
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-700 mt-1 font-bold">
              <span className="flex items-center gap-1 text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-400 stroke-none shrink-0" />
                <span className="text-slate-950 font-black">{currentDriver.rating || 4.9}</span> Rating
              </span>
              <span>• {currentDriver.totalTrips || 0} Total Trips</span>
            </div>
          </div>
        </div>

        <div className="w-full sm:w-auto flex items-center justify-end">
          {currentDriver.status !== 'On Trip' && (
            <button
              onClick={() => onToggleDuty(currentDriver.id, currentDriver.status === 'Off Duty' ? 'Available' : 'Off Duty')}
              className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm text-center ${
                currentDriver.status === 'Off Duty'
                  ? 'bg-gradient-to-r from-[#D31720] to-[#D31720] hover:brightness-105 text-white font-black shadow-[0_2px_14px_rgba(6,129,135,0.30)] border border-white/20'
                  : 'bg-white text-slate-800 hover:bg-slate-100 border border-slate-300 font-bold'
              }`}
            >
              {currentDriver.status === 'Off Duty' ? 'Go Online (Start Duty)' : 'Go Off Duty'}
            </button>
          )}
        </div>
      </div>

      {/* Active Live Trip Card */}
      {activeTrip ? (
        <div className="p-4 sm:p-6 rounded-2xl glass-panel border-2 border-[#FEA24F] bg-gradient-to-br from-orange-50/70 via-white to-amber-50/50 shadow-lg space-y-4 text-slate-950 animate-page-enter">
          <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="flex h-3 w-3 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FEA24F] opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FEA24F]" />
              </span>
              <h3 className="font-black text-slate-950 text-sm sm:text-lg truncate">TRIP IN PROGRESS</h3>
              <span className="text-xs font-mono font-black text-[#B25900] shrink-0">({activeTrip.id})</span>
            </div>

            <span className="text-xs sm:text-sm font-black text-slate-950 bg-white px-3 py-1 rounded-xl border border-[#FEA24F]/40 shadow-sm self-start xs:self-auto shrink-0">
              Fare: {currency}{activeTrip.fareDetails?.totalFare || 0}
            </span>
          </div>

          {/* Passenger Contact & Route: Clean Cards with Crisp Black Data */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 pt-1">
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 shadow-sm text-slate-900">
              <span className="text-[10px] font-black text-[#B25900] uppercase tracking-wider block">
                Passenger Onboard
              </span>
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h4 className="font-black text-sm sm:text-base text-slate-950 truncate">{activeTrip.customerName}</h4>
                  <p className="text-xs text-slate-600 font-bold truncate">{activeTrip.customerPhone}</p>
                </div>
                <a
                  href={`tel:${activeTrip.customerPhone}`}
                  className="px-3 py-2 rounded-xl bg-[#D31720] hover:brightness-110 text-white font-black text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all shrink-0"
                >
                  <Phone className="w-3.5 h-3.5 text-white" />
                  <span>Call</span>
                </a>
              </div>
              {activeTrip.notes && (
                <div className="mt-2 text-xs text-amber-900 bg-amber-50 p-2 rounded-lg border border-amber-200 font-semibold">
                  Note: {activeTrip.notes}
                </div>
              )}
            </div>

            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs shadow-sm text-slate-900">
              <span className="text-[10px] font-black text-[#D31720] uppercase tracking-wider block">
                Route Details ({activeTrip.distanceKm} km)
              </span>
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-slate-950">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D31720] mt-1 shrink-0" />
                  <div>
                    <span className="text-[10px] text-[#D31720] font-bold uppercase block">Pickup Location</span>
                    <span className="font-bold text-xs">{activeTrip.pickupLocation}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-slate-950">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D31720] mt-1 shrink-0" />
                  <div>
                    <span className="text-[10px] text-[#D31720] font-bold uppercase block">Drop Destination</span>
                    <span className="font-bold text-xs">{activeTrip.dropLocation}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action to complete trip */}
          <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs text-slate-700 font-semibold">
              Collect <strong className="text-slate-950 font-black">{currency}{activeTrip.fareDetails?.totalFare || 0}</strong> ({activeTrip.paymentMethod}) upon arrival.
            </span>
            <button
              onClick={() => onStatusChange(activeTrip.id, 'Completed', 'Paid')}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D31720] to-[#9B1017] hover:brightness-105 text-white font-black text-sm transition-all shadow-md flex items-center justify-center gap-2 border border-white/20"
            >
              <CheckCircle2 className="w-4 h-4 text-white stroke-[2.5]" />
              <span>Complete Ride & Collect</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-2xl glass-panel border border-slate-200/90 shadow-sm bg-white/95 backdrop-blur-md text-center py-8">
          <Navigation className="w-9 h-9 text-[#D31720] mx-auto mb-2 opacity-75" />
          <h3 className="font-black text-base text-slate-950">No Active Trip</h3>
          <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto font-semibold">
            You are ready to accept rides across Tamil Nadu. Review upcoming assignments below.
          </p>
        </div>
      )}

      {/* Upcoming Assigned Trips */}
      <div className="space-y-3.5">
        <h3 className="font-black text-base sm:text-lg text-slate-950 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#D31720]" />
          Upcoming Assigned Trips ({upcomingTrips.length})
        </h3>

        {upcomingTrips.length === 0 ? (
          <div className="p-6 rounded-2xl glass-panel border border-slate-200/90 bg-white/95 backdrop-blur-md text-center text-xs text-slate-600 font-semibold">
            No upcoming trips scheduled at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
            {upcomingTrips.map((b) => (
              <div
                key={b.id}
                className="p-4 sm:p-5 rounded-2xl glass-panel glass-panel-hover flex flex-col justify-between space-y-3.5 transition-all border border-slate-200/90 shadow-sm hover:shadow-md bg-white/95 backdrop-blur-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-[#D31720] text-xs">{b.id}</span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                      {b.bookingStatus}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <h4 className="font-black text-sm text-slate-950">{b.customerName}</h4>
                      <p className="text-xs text-slate-600 font-semibold">{b.customerPhone}</p>
                    </div>
                    <a
                      href={`tel:${b.customerPhone}`}
                      className="p-2 rounded-xl bg-white text-[#D31720] hover:bg-red-50 border border-slate-300 shadow-sm"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="mt-3 space-y-1.5 text-xs">
                    <div className="text-slate-950 font-black truncate flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#D31720] shrink-0" />
                      <span className="truncate">{b.pickupLocation}</span>
                    </div>
                    <div className="text-slate-700 font-semibold truncate flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#D31720] shrink-0" />
                      <span className="truncate">{b.dropLocation}</span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-slate-700 pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-[#D31720]" />
                      {new Date(b.pickupDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <strong className="text-slate-950 font-black text-sm">{currency}{b.fareDetails?.totalFare || 0}</strong>
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    onClick={() => onStatusChange(b.id, 'In Progress')}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#D31720] to-[#9B1017] hover:brightness-105 text-white font-black text-xs shadow-sm flex items-center justify-center gap-1.5 border border-white/20"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    <span>Start Trip Now</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Trips Summary */}
      <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-slate-200/90 shadow-sm bg-white/95 backdrop-blur-md space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-sm sm:text-base text-slate-950 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#D31720]" />
            Completed Trips Today
          </h3>
          <span className="text-xs font-black text-[#D31720]">
            Total Handled: {currency}{totalEarningsToday.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 text-slate-700 uppercase font-black bg-slate-50">
                <th className="py-2.5 px-3">Trip ID</th>
                <th className="py-2.5 px-3">Passenger</th>
                <th className="py-2.5 px-3">Route</th>
                <th className="py-2.5 px-3">Fare Collected</th>
                <th className="py-2.5 px-3 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {completedTrips.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-6 text-center text-slate-500 font-semibold">
                    No completed trips yet for this session.
                  </td>
                </tr>
              ) : (
                completedTrips.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-black text-[#D31720]">{b.id}</td>
                    <td className="py-2.5 px-3 font-black text-slate-950">{b.customerName}</td>
                    <td className="py-2.5 px-3 max-w-xs truncate text-slate-700 font-semibold">
                      {b.pickupLocation} → {b.dropLocation}
                    </td>
                    <td className="py-2.5 px-3 font-black text-[#D31720]">
                      {currency}{b.fareDetails?.totalFare || 0} ({b.paymentMethod})
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => onViewInvoice(b)}
                        className="p-1.5 rounded-lg bg-white text-slate-900 hover:text-[#D31720] border border-slate-300 shadow-sm"
                        title="View Trip Slip"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View: Neat Completed Cards */}
        <div className="sm:hidden space-y-2">
          {completedTrips.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-500 font-semibold">
              No completed trips yet for this session.
            </div>
          ) : (
            completedTrips.map((b) => (
              <div key={b.id} className="p-3 rounded-xl bg-white border border-slate-200/90 flex items-center justify-between text-xs shadow-sm">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-black text-[#D31720]">{b.id}</span>
                    <span className="text-slate-950 font-black">• {b.customerName}</span>
                  </div>
                  <div className="text-[11px] text-slate-600 font-semibold truncate max-w-[200px] mt-0.5">
                    {b.pickupLocation} → {b.dropLocation}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-[#D31720] text-xs">
                    {currency}{b.fareDetails?.totalFare || 0}
                  </span>
                  <button
                    onClick={() => onViewInvoice(b)}
                    className="p-1.5 rounded-lg bg-white text-slate-900 border border-slate-300 shadow-sm"
                  >
                    <FileText className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
