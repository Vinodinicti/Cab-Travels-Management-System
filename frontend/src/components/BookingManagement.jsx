import React, { useState, useEffect } from 'react';
import { 
  CalendarClock, 
  Plus, 
  Search, 
  MapPin, 
  Car, 
  User, 
  Phone, 
  IndianRupee, 
  Clock, 
  CheckCircle2, 
  X, 
  Edit3, 
  Trash2, 
  FileText, 
  ChevronRight
} from 'lucide-react';

export const BookingManagement = ({ 
  bookings, 
  vehicles, 
  drivers, 
  customers, 
  settings, 
  onAddBooking, 
  onUpdateBooking, 
  onStatusChange, 
  onDeleteBooking, 
  onViewInvoice,
  currency = '₹',
  initialOpenModal = false,
  initialStatusFilter = 'All'
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialStatusFilter);
  const [modalOpen, setModalOpen] = useState(initialOpenModal);
  const [editingBooking, setEditingBooking] = useState(null);

  useEffect(() => {
    if (initialStatusFilter) {
      setStatusFilter(initialStatusFilter);
    }
  }, [initialStatusFilter]);

  // Form State for Booking
  const initialForm = {
    customerId: '',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    pickupLocation: 'Chennai International Airport (MAA), Terminal 4',
    dropLocation: 'OMR IT Expressway, Sholinganallur, Chennai',
    pickupDateTime: new Date().toISOString().slice(0, 16),
    returnDateTime: '',
    tripType: 'One-Way',
    distanceKm: 22,
    vehicleId: '',
    driverId: '',
    waitingCharge: 0,
    discount: 0,
    paymentStatus: 'Pending',
    paymentMethod: 'UPI / Online',
    bookingStatus: 'Confirmed',
    notes: ''
  };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (initialOpenModal) {
      setEditingBooking(null);
      setFormData(initialForm);
      setModalOpen(true);
    }
  }, [initialOpenModal]);

  const [calculatedFare, setCalculatedFare] = useState({
    baseFare: 140,
    distanceCharge: 352,
    waitingCharge: 0,
    driverAllowance: 0,
    tax: 25,
    discount: 0,
    totalFare: 517
  });

  const statusTabs = ['All', 'Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];

  useEffect(() => {
    const selectedVeh = vehicles.find(v => v.id === formData.vehicleId);
    const base = selectedVeh ? Number(selectedVeh.baseFare) : (settings?.baseFare || 140);
    const perKm = selectedVeh ? Number(selectedVeh.perKmRate) : (settings?.ratePerKm || 18);
    const km = Number(formData.distanceKm) || 10;

    let multiplier = 1;
    if (formData.tripType === 'Round-Trip') multiplier = 1.8;
    if (formData.tripType === 'Outstation') multiplier = 1.2;

    const distanceCharge = Math.round(km * perKm * multiplier);
    const driverAllowance = formData.tripType === 'Outstation' ? 500 : (formData.tripType === 'Round-Trip' ? 200 : 0);
    const waiting = Number(formData.waitingCharge) || 0;
    const discount = Number(formData.discount) || 0;

    const subtotal = base + distanceCharge + waiting + driverAllowance - discount;
    const taxRate = settings?.gstTaxPercentage || 5;
    const tax = Math.round((Math.max(0, subtotal) * taxRate) / 100);
    const totalFare = Math.max(0, subtotal + tax);

    setCalculatedFare({
      baseFare: base,
      distanceCharge,
      waitingCharge: waiting,
      driverAllowance,
      discount,
      tax,
      totalFare
    });
  }, [formData.distanceKm, formData.vehicleId, formData.tripType, formData.waitingCharge, formData.discount, vehicles, settings]);

  const handleCustomerSelect = (e) => {
    const cId = e.target.value;
    if (!cId) {
      setFormData(prev => ({
        ...prev,
        customerId: '',
        customerName: '',
        customerPhone: '',
        customerEmail: ''
      }));
      return;
    }
    const cust = customers.find(c => c.id === cId);
    if (cust) {
      setFormData(prev => ({
        ...prev,
        customerId: cust.id,
        customerName: cust.name,
        customerPhone: cust.phone,
        customerEmail: cust.email || ''
      }));
    }
  };

  const handleOpenAdd = () => {
    setEditingBooking(null);
    setFormData(initialForm);
    setModalOpen(true);
  };

  const handleOpenEdit = (b) => {
    setEditingBooking(b);
    setFormData({
      customerId: b.customerId || '',
      customerName: b.customerName,
      customerPhone: b.customerPhone,
      customerEmail: b.customerEmail || '',
      pickupLocation: b.pickupLocation,
      dropLocation: b.dropLocation,
      pickupDateTime: b.pickupDateTime ? b.pickupDateTime.slice(0, 16) : new Date().toISOString().slice(0, 16),
      returnDateTime: b.returnDateTime ? b.returnDateTime.slice(0, 16) : '',
      tripType: b.tripType || 'One-Way',
      distanceKm: b.distanceKm || 20,
      vehicleId: b.vehicleId || '',
      driverId: b.driverId || '',
      waitingCharge: b.fareDetails?.waitingCharge || 0,
      discount: b.fareDetails?.discount || 0,
      paymentStatus: b.paymentStatus || 'Pending',
      paymentMethod: b.paymentMethod || 'Cash',
      bookingStatus: b.bookingStatus || 'Confirmed',
      notes: b.notes || ''
    });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.pickupLocation || !formData.dropLocation || !formData.customerName || !formData.customerPhone) {
      alert("Please provide customer name, phone, pickup, and drop destination.");
      return;
    }

    const payload = {
      ...formData,
      customFare: calculatedFare
    };

    if (editingBooking) {
      onUpdateBooking(editingBooking.id, payload);
    } else {
      onAddBooking(payload);
    }
    setModalOpen(false);
  };

  const filteredBookings = bookings.filter((b) => {
    const q = search.toLowerCase();
    const matchesSearch = 
      b.id.toLowerCase().includes(q) ||
      b.customerName.toLowerCase().includes(q) ||
      b.pickupLocation.toLowerCase().includes(q) ||
      b.dropLocation.toLowerCase().includes(q) ||
      (b.driverName && b.driverName.toLowerCase().includes(q)) ||
      (b.vehicleNumber && b.vehicleNumber.toLowerCase().includes(q));

    const matchesStatus = statusFilter === 'All' || b.bookingStatus.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#D31720]/15 text-[#0A7379] border border-[#D31720]/40 shadow-sm">
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
    <div className="space-y-5 sm:space-y-6 pb-12">
      {/* Top Header with Theme Banner */}
      <div className="p-4 sm:p-5 rounded-2xl theme-banner-vehicles shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 animate-page-enter">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D31720]/15 text-[#D31720] text-[11px] font-bold mb-1 border border-[#D31720]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D31720] animate-ping" />
            Live Dispatch Operations
          </div>
          <h2 className="text-lg sm:text-2xl font-black bg-gradient-to-r from-[#D31720] via-red-600 to-red-600 bg-clip-text text-transparent tracking-tight flex items-center gap-2">
            <CalendarClock className="w-5 h-5 sm:w-6 sm:h-6 text-[#D31720]" />
            <span>Trip & Booking Operations</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium italic">
            Dispatch cabs across Tamil Nadu, track live trips, calculate tariffs, and issue official travel slips
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#D31720] to-[#9B1017] hover:brightness-105 text-white font-bold text-xs sm:text-sm active:scale-95 transition-all shadow-[0_4px_16px_rgba(211,23,32,0.35)] border border-white/30 flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Trip Booking</span>
        </button>
      </div>

      {/* Filter and Search Bar: Glassy Container */}
      <div className="p-3 sm:p-4 rounded-2xl glass-panel flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 border border-[#D31720]/25 shadow-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Trip ID, passenger, driver, location..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-950 placeholder:text-slate-400 focus:outline-none focus:border-[#D31720] transition-colors shadow-sm font-semibold"
          />
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {statusTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                statusFilter === tab
                  ? 'bg-gradient-to-r from-[#D31720] to-[#9B1017] text-white shadow-sm font-black'
                  : 'bg-white text-slate-700 hover:text-slate-950 hover:bg-red-50/50 border border-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Desktop Table with Neat Dark Typography & Popping Row Transitions */}
      <div className="hidden md:block rounded-2xl bg-white border border-slate-200/90 shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600 uppercase tracking-wider font-extrabold text-[11px] bg-slate-50/80">
                <th className="py-3.5 px-4 rounded-l-xl">Trip Ref</th>
                <th className="py-3.5 px-4">Passenger</th>
                <th className="py-3.5 px-4">Journey Route</th>
                <th className="py-3.5 px-4">Cab & Captain</th>
                <th className="py-3.5 px-4">Fare</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right rounded-r-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-16 text-center text-slate-400 font-semibold text-xs">
                    <CalendarClock className="w-10 h-10 text-slate-300 mx-auto mb-2 opacity-60" />
                    No bookings found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr 
                    key={b.id} 
                    className="group transition-all duration-200 hover:bg-slate-50/90 hover:scale-[1.008] hover:shadow-md rounded-xl cursor-default"
                  >
                    {/* Booking ID & Type */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="font-mono font-black text-slate-950 text-xs">
                        {b.id}
                      </div>
                      <span className="inline-block mt-0.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        {b.tripType || 'One-Way'}
                      </span>
                    </td>

                    {/* Customer Info */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="font-extrabold text-slate-950 text-xs leading-snug">
                        {b.customerName}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium mt-0.5 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{b.customerPhone}</span>
                      </div>
                    </td>

                    {/* Journey Route - Concise with timing */}
                    <td className="py-4 px-4 max-w-[260px]">
                      <div className="flex items-center gap-1.5 font-bold text-slate-950 text-xs truncate">
                        <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                        <span className="truncate">{b.pickupLocation ? b.pickupLocation.split(',')[0] : 'Origin'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600 font-medium text-[11px] truncate mt-0.5">
                        <span className="w-2 h-2 rounded-full bg-[#D31720] shrink-0" />
                        <span className="truncate">{b.dropLocation ? b.dropLocation.split(',')[0] : 'Destination'}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-semibold mt-1 flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{new Date(b.pickupDateTime).toLocaleDateString([], { month: 'short', day: 'numeric' })} • {b.distanceKm} km</span>
                      </div>
                    </td>

                    {/* Fleet & Captain */}
                    <td className="py-4 px-4 whitespace-nowrap">
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
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="font-black text-slate-950 text-sm">
                        {currency}{b.fareDetails?.totalFare || 0}
                      </div>
                      <span className={`inline-block text-[10px] font-extrabold uppercase tracking-wide ${
                        b.paymentStatus === 'Paid' ? 'text-[#D31720]' : 'text-amber-700'
                      }`}>
                        {b.paymentStatus}
                      </span>
                    </td>

                    {/* Status with Quick Transition */}
                    <td className="py-4 px-4 whitespace-nowrap text-center">
                      <div>{getStatusBadge(b.bookingStatus)}</div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {b.bookingStatus === 'Pending' && (
                          <button
                            onClick={() => onStatusChange(b.id, 'Confirmed')}
                            className="px-2 py-1 text-[11px] font-bold rounded-lg bg-[#D31720] hover:bg-[#9B1017] text-white shadow-sm transition-all active:scale-95"
                          >
                            Confirm
                          </button>
                        )}
                        {b.bookingStatus === 'Confirmed' && (
                          <button
                            onClick={() => onStatusChange(b.id, 'In Progress')}
                            className="px-2 py-1 text-[11px] font-bold rounded-lg bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition-all active:scale-95"
                          >
                            Start
                          </button>
                        )}
                        {b.bookingStatus === 'In Progress' && (
                          <button
                            onClick={() => onStatusChange(b.id, 'Completed', 'Paid')}
                            className="px-2 py-1 text-[11px] font-bold rounded-lg bg-[#D31720] hover:bg-emerald-700 text-white shadow-sm transition-all active:scale-95"
                          >
                            Complete
                          </button>
                        )}
                        <button
                          onClick={() => onViewInvoice(b)}
                          className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-950 border border-slate-300 transition-all shadow-sm active:scale-95"
                          title="Generate & Print Invoice"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(b)}
                          className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-950 border border-slate-300 transition-all shadow-sm active:scale-95"
                          title="Edit Booking"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete trip record ${b.id}?`)) onDeleteBooking(b.id);
                          }}
                          className="p-1.5 rounded-lg bg-white hover:bg-red-50 text-red-600 border border-slate-300 transition-all shadow-sm active:scale-95"
                          title="Delete Booking"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card List: Neat Typography & Popping Micro-card Effect */}
      <div className="md:hidden space-y-3">
        {filteredBookings.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-200 font-semibold">
            No bookings found matching current filters.
          </div>
        ) : (
          filteredBookings.map((b) => (
            <div
              key={b.id}
              className="p-4 rounded-2xl bg-white space-y-3 shadow-sm border border-slate-200/90 hover:shadow-md hover:border-slate-300 transition-all duration-200"
            >
              {/* Header: ID, Trip Type, Status */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-slate-950 text-xs">{b.id}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold uppercase tracking-wider">
                    {b.tripType || 'One-Way'}
                  </span>
                </div>
                <div>{getStatusBadge(b.bookingStatus)}</div>
              </div>

              {/* Passenger & Fare */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h4 className="font-extrabold text-sm text-slate-950 truncate">{b.customerName}</h4>
                  <a href={`tel:${b.customerPhone}`} className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{b.customerPhone}</span>
                  </a>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-black text-slate-950 text-sm block">
                    {currency}{b.fareDetails?.totalFare || 0}
                  </span>
                  <span className={`text-[10px] font-extrabold uppercase tracking-wide block ${
                    b.paymentStatus === 'Paid' ? 'text-[#D31720]' : 'text-amber-700'
                  }`}>
                    {b.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Journey Route Box: Concise */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-slate-950 font-bold min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                  <span className="truncate">{b.pickupLocation ? b.pickupLocation.split(',')[0] : 'Origin'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600 font-medium text-[11px] min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D31720] shrink-0" />
                  <span className="truncate">{b.dropLocation ? b.dropLocation.split(',')[0] : 'Destination'}</span>
                </div>
                <div className="pt-1 border-t border-slate-200/60 text-[10px] text-slate-400 flex items-center justify-between font-semibold">
                  <span>{new Date(b.pickupDateTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                  <span className="font-bold text-slate-600">{b.distanceKm} km</span>
                </div>
              </div>

              {/* Cab & Captain */}
              <div className="flex items-center justify-between text-xs text-slate-700 pt-0.5">
                <div className="min-w-0 truncate">
                  <strong className="text-slate-950 font-extrabold block truncate">
                    {b.vehicleModel ? b.vehicleModel.split(' ').slice(0, 3).join(' ') : 'Cab'}
                  </strong>
                  <span className="text-[10px] text-slate-500 font-mono font-bold block truncate">{b.vehicleNumber}</span>
                </div>
                <div className="min-w-0 text-right truncate">
                  <span className="text-[10px] text-slate-400 block font-medium">Captain</span>
                  <span className="font-bold text-slate-800 truncate block">{b.driverName || 'Pending'}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 flex-wrap xs:flex-nowrap">
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => onViewInvoice(b)}
                    className="p-1.5 rounded-lg bg-white text-slate-900 border border-slate-300 shadow-sm hover:bg-slate-50 transition-colors"
                    title="Invoice"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(b)}
                    className="p-1.5 rounded-lg bg-white text-slate-900 border border-slate-300 shadow-sm hover:bg-slate-50 transition-colors"
                    title="Edit"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete trip ${b.id}?`)) onDeleteBooking(b.id);
                    }}
                    className="p-1.5 rounded-lg bg-white text-red-700 border border-slate-300 shadow-sm hover:bg-red-50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {b.bookingStatus === 'Pending' && (
                    <button
                      onClick={() => onStatusChange(b.id, 'Confirmed')}
                      className="px-3 py-1.5 rounded-xl bg-red-50 text-red-700 font-black text-xs border border-red-200 hover:bg-[#D31720] hover:text-white transition-colors"
                    >
                      Confirm
                    </button>
                  )}
                  {b.bookingStatus === 'Confirmed' && (
                    <button
                      onClick={() => onStatusChange(b.id, 'In Progress')}
                      className="px-3 py-1.5 rounded-xl bg-amber-100 text-amber-900 font-black text-xs border border-amber-300 hover:bg-amber-500 hover:text-white transition-colors"
                    >
                      Start
                    </button>
                  )}
                  {b.bookingStatus === 'In Progress' && (
                    <button
                      onClick={() => onStatusChange(b.id, 'Completed', 'Paid')}
                      className="px-3 py-1.5 rounded-xl bg-[#D31720]/15 text-[#D31720] font-black text-xs border border-[#D31720]/40 hover:bg-[#D31720] hover:text-white transition-colors"
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

      {/* New / Edit Booking Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-3xl bg-white rounded-2xl border border-slate-200 shadow-2xl p-4 sm:p-6 max-h-[92vh] overflow-y-auto space-y-4 text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-base sm:text-lg text-slate-950 flex items-center gap-2">
                <CalendarClock className="w-5 h-5 text-[#D31720]" />
                {editingBooking ? `Edit Booking ${editingBooking.id}` : 'Create New Trip Booking'}
              </h3>
              <button 
                onClick={() => setModalOpen(false)}
                className="text-slate-500 hover:text-slate-900 p-1.5 rounded-lg bg-slate-100 border border-slate-200"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              {/* Customer Selector / Input */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-950 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-[#D31720]" />
                    Passenger Information
                  </span>
                  <span className="text-[10px] text-slate-600 font-bold">Choose existing or enter walk-in</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-slate-800 font-bold mb-1 text-[11px]">Select Registered Passenger</label>
                    <select
                      value={formData.customerId}
                      onChange={handleCustomerSelect}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-950 focus:outline-none focus:border-[#D31720] font-semibold"
                    >
                      <option value="">-- Manual / Walk-in Customer --</option>
                      {customers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.city}) [{c.phone}]
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-800 font-bold mb-1 text-[11px]">Customer Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      placeholder="e.g. Soundarya Radhakrishnan"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-950 focus:outline-none focus:border-[#D31720] font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-800 font-bold mb-1 text-[11px]">Mobile Phone *</label>
                    <input
                      type="tel"
                      required
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                      placeholder="+91 98..."
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-950 focus:outline-none focus:border-[#D31720] font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Journey Route & Schedule */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <span className="font-black text-slate-950 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#D31720]" />
                  Route & Journey Schedule
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-slate-800 font-bold mb-1 text-[11px]">Pickup Location *</label>
                    <input
                      type="text"
                      required
                      value={formData.pickupLocation}
                      onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                      placeholder="e.g. Chennai Airport T4 / Central Station / Gandhipuram"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-950 focus:outline-none focus:border-[#D31720] font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-800 font-bold mb-1 text-[11px]">Drop Destination *</label>
                    <input
                      type="text"
                      required
                      value={formData.dropLocation}
                      onChange={(e) => setFormData({ ...formData, dropLocation: e.target.value })}
                      placeholder="e.g. OMR IT Park / Mahabalipuram / Ooty Ghat Road"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-950 focus:outline-none focus:border-[#D31720] font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-800 font-bold mb-1 text-[11px]">Pickup Date & Time</label>
                    <input
                      type="datetime-local"
                      value={formData.pickupDateTime}
                      onChange={(e) => setFormData({ ...formData, pickupDateTime: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-950 focus:outline-none focus:border-[#D31720] font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-800 font-bold mb-1 text-[11px]">Trip Category</label>
                    <select
                      value={formData.tripType}
                      onChange={(e) => setFormData({ ...formData, tripType: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-950 focus:outline-none focus:border-[#D31720] font-semibold"
                    >
                      <option value="One-Way">One-Way City Ride</option>
                      <option value="Round-Trip">Round-Trip Outstation</option>
                      <option value="Local Rental">Hourly City Rental</option>
                      <option value="Outstation">Outstation Long Distance</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Fleet & Driver Assignment */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <span className="font-black text-slate-950 flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-[#D31720]" />
                  Fleet & Captain Allocation
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-slate-800 font-bold mb-1 text-[11px]">Select TN Cab</label>
                    <select
                      value={formData.vehicleId}
                      onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-950 focus:outline-none focus:border-[#D31720] font-semibold"
                    >
                      <option value="">-- Choose Available Cab --</option>
                      {vehicles.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.model} ({v.registrationNumber}) [{v.status}]
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-800 font-bold mb-1 text-[11px]">Assign Captain</label>
                    <select
                      value={formData.driverId}
                      onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-950 focus:outline-none focus:border-[#D31720] font-semibold"
                    >
                      <option value="">-- Choose Captain --</option>
                      {drivers.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.status}) - ★ {d.rating}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-800 font-bold mb-1 text-[11px]">Estimated Distance (KM)</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.distanceKm}
                      onChange={(e) => setFormData({ ...formData, distanceKm: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-950 focus:outline-none focus:border-[#D31720] font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Fare Calculator */}
              <div className="p-3.5 rounded-xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-300 space-y-2.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-950 flex items-center gap-1.5 text-xs sm:text-sm">
                    <IndianRupee className="w-4 h-4 text-[#D31720]" />
                    Automated Fare Calculation
                  </span>
                  <span className="text-[10px] text-[#D31720] font-black font-mono">
                    GST Tax: {settings?.gstTaxPercentage || 5}%
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-sm">
                    <span className="text-slate-600 text-[10px] block font-bold">Base Tariff</span>
                    <strong className="text-slate-950 font-black">{currency}{calculatedFare.baseFare}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-sm">
                    <span className="text-slate-600 text-[10px] block font-bold">Distance Running</span>
                    <strong className="text-slate-950 font-black">{currency}{calculatedFare.distanceCharge}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-sm">
                    <span className="text-slate-600 text-[10px] block font-bold">GST Tax</span>
                    <strong className="text-slate-950 font-black">{currency}{calculatedFare.tax}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-700 text-white shadow-md">
                    <span className="text-emerald-100 font-bold text-[10px] block uppercase">Net Fare</span>
                    <strong className="text-base text-white font-black">{currency}{calculatedFare.totalFare}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  <div>
                    <label className="block text-slate-800 font-bold mb-1 text-[11px]">Payment Status</label>
                    <select
                      value={formData.paymentStatus}
                      onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-950 focus:outline-none focus:border-[#D31720] font-semibold"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid in Full</option>
                      <option value="Partially Paid">Partially Paid</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-800 font-bold mb-1 text-[11px]">Payment Method</label>
                    <select
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-950 focus:outline-none focus:border-[#D31720] font-semibold"
                    >
                      <option value="UPI / Online">UPI / GPay / QR</option>
                      <option value="Cash">Cash to Driver</option>
                      <option value="Credit Card">Card Payment</option>
                      <option value="Corporate Account">Corporate Account</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-800 font-bold mb-1 text-[11px]">Booking Status</label>
                    <select
                      value={formData.bookingStatus}
                      onChange={(e) => setFormData({ ...formData, bookingStatus: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-950 focus:outline-none focus:border-[#D31720] font-semibold"
                    >
                      <option value="Pending">Pending Dispatch</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="In Progress">In Progress (Active)</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Special Instructions */}
              <div>
                <label className="block text-slate-800 font-bold mb-1 text-[11px]">Special Instructions</label>
                <textarea
                  rows="2"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Indigo flight arrival MAA Pillar 12, AC cool, temple trip"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-950 focus:outline-none focus:border-[#D31720] resize-none font-semibold"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-100 flex flex-col-reverse xs:flex-row items-stretch xs:items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 font-bold border border-slate-300 text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D31720] to-[#9B1017] hover:brightness-105 text-white font-black active:scale-95 transition-all shadow-[0_4px_16px_rgba(211,23,32,0.35)] border border-white/20 text-center"
                >
                  {editingBooking ? 'Save Changes' : 'Confirm & Dispatch Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

