import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  History, 
  Edit3, 
  Trash2, 
  X,
  FileText
} from 'lucide-react';

export const CustomerManagement = ({ 
  customers, 
  bookings, 
  onAddCustomer, 
  onUpdateCustomer, 
  onDeleteCustomer, 
  onViewInvoice, 
  currency = '₹' 
}) => {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [historyCustomer, setHistoryCustomer] = useState(null);

  const initialForm = {
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    notes: ''
  };
  const [formData, setFormData] = useState(initialForm);

  const filteredCustomers = customers.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.city && c.city.toLowerCase().includes(q))
    );
  });

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setFormData(initialForm);
    setModalOpen(true);
  };

  const handleOpenEdit = (c) => {
    setEditingCustomer(c);
    setFormData({
      name: c.name,
      phone: c.phone,
      email: c.email || '',
      address: c.address || '',
      city: c.city || '',
      notes: c.notes || ''
    });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    if (editingCustomer) {
      onUpdateCustomer(editingCustomer.id, formData);
    } else {
      onAddCustomer(formData);
    }
    setModalOpen(false);
  };

  const customerTrips = historyCustomer 
    ? bookings.filter(b => b.customerId === historyCustomer.id || b.customerPhone === historyCustomer.phone)
    : [];

  return (
    <div className="space-y-5 sm:space-y-6 pb-12">
      {/* Top Header with Theme Banner */}
      <div className="p-4 sm:p-5 rounded-2xl theme-banner-vehicles shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 animate-page-enter">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D31720]/15 text-[#D31720] text-[11px] font-bold mb-1 border border-[#D31720]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D31720] animate-ping" />
            Passenger Profiles & Loyalty
          </div>
          <h2 className="text-lg sm:text-2xl font-black bg-gradient-to-r from-[#D31720] via-red-600 to-red-600 bg-clip-text text-transparent tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-[#D31720]" />
            <span>Customer & Client Directory</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium italic">
            Manage passenger accounts across Chennai, Coimbatore, Madurai, Trichy, Salem and Nilgiris
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#D31720] to-[#9B1017] text-white font-bold text-xs sm:text-sm active:scale-95 hover:brightness-105 transition-all shadow-[0_4px_16px_rgba(211,23,32,0.35)] border border-white/20 flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Customer</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-3 sm:p-4 rounded-2xl glass-panel border border-[#D31720]/25 shadow-sm flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search passengers by name (e.g. Soundarya, Karthik), phone, email, or Tamil Nadu city..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-950 placeholder:text-slate-400 focus:outline-none focus:border-[#D31720] transition-colors shadow-sm font-semibold"
          />
        </div>
      </div>

      {/* Customer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
        {filteredCustomers.length === 0 ? (
          <div className="col-span-full py-16 text-center glass-panel rounded-2xl border border-slate-200 shadow-sm">
            <Users className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-60" />
            <p className="text-sm font-bold text-slate-950">No customers found</p>
            <p className="text-xs text-slate-600 mt-1 font-semibold italic">Try a different search or register a new customer</p>
          </div>
        ) : (
          filteredCustomers.map((c) => {
            const trips = bookings.filter(b => b.customerId === c.id || b.customerPhone === c.phone);
            const totalSpent = trips
              .filter(b => b.bookingStatus === 'Completed' || b.paymentStatus === 'Paid')
              .reduce((sum, b) => sum + (b.fareDetails?.totalFare || 0), 0);

            return (
              <div
                key={c.id}
                className="p-4 sm:p-5 rounded-2xl glass-panel glass-panel-hover flex flex-col justify-between space-y-4 transition-all group border border-slate-200/90 shadow-sm hover:shadow-md bg-white/95 backdrop-blur-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#D31720]/15 to-[#FEA24F]/15 border border-[#D31720]/30 flex items-center justify-center text-[#D31720] font-black text-base shrink-0 shadow-sm">
                        {c.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-black text-sm sm:text-base text-slate-950 truncate group-hover:text-[#D31720] transition-colors">
                          {c.name}
                        </h3>
                        <p className="text-xs text-slate-600 font-semibold flex items-center gap-1 mt-0.5 truncate">
                          <MapPin className="w-3 h-3 text-[#D31720] shrink-0" />
                          <span className="truncate">{c.city || 'Tamil Nadu'}</span>
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-800 border border-slate-300 shrink-0">
                      {c.id}
                    </span>
                  </div>

                  {/* Contact Info */}
                  <div className="mt-3.5 space-y-1.5 text-xs text-slate-700 font-semibold">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#D31720] shrink-0" />
                      <span className="text-slate-950 font-bold">{c.phone}</span>
                    </div>
                    {c.email && (
                      <div className="flex items-center gap-2 truncate">
                        <Mail className="w-3.5 h-3.5 text-[#D31720] shrink-0" />
                        <span className="truncate">{c.email}</span>
                      </div>
                    )}
                    {c.address && (
                      <div className="flex items-start gap-2 text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-[#D31720] shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{c.address}</span>
                      </div>
                    )}
                  </div>

                  {/* Booking Stats Box: Crisp Clean Card with Dark Text */}
                  <div className="grid grid-cols-2 gap-2 mt-3.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs shadow-sm">
                    <div>
                      <span className="text-[10px] text-slate-600 font-bold block uppercase tracking-wider">Bookings</span>
                      <strong className="text-xs sm:text-sm font-black text-slate-950">
                        {Math.max(c.totalBookings || 0, trips.length)} Trips
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-600 font-bold block uppercase tracking-wider">Total Spent</span>
                      <strong className="text-xs sm:text-sm font-black text-[#D31720]">
                        {currency}{Math.max(c.totalSpent || 0, totalSpent).toLocaleString('en-IN')}
                      </strong>
                    </div>
                  </div>

                  {c.notes && (
                    <p className="mt-2.5 text-[11px] text-slate-700 bg-white p-2 rounded-lg italic border border-slate-200">
                      "{c.notes}"
                    </p>
                  )}
                </div>

                {/* Bottom Controls */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setHistoryCustomer(c)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 transition-all shadow-sm"
                  >
                    <History className="w-3.5 h-3.5 text-[#D31720]" />
                    <span>Trip History ({trips.length})</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(c)}
                      className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 transition-colors shadow-sm"
                      title="Edit Customer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#D31720]" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Remove customer record for ${c.name}?`)) onDeleteCustomer(c.id);
                      }}
                      className="p-1.5 rounded-lg bg-white hover:bg-red-50 text-red-700 border border-slate-300 transition-colors shadow-sm"
                      title="Delete Customer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Customer Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto space-y-4 text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-base sm:text-lg text-slate-950 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#D31720]" />
                {editingCustomer ? 'Edit Customer Details' : 'Register New Customer'}
              </h3>
              <button 
                onClick={() => setModalOpen(false)}
                className="text-slate-500 hover:text-slate-950 p-1.5 rounded-lg bg-slate-100 border border-slate-200"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="block text-slate-800 font-bold mb-1 text-[11px]">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Soundarya Radhakrishnan"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-950 font-semibold focus:outline-none focus:border-[#D31720] shadow-sm"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1 text-[11px]">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98402 77890"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-950 font-semibold focus:outline-none focus:border-[#D31720] shadow-sm"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1 text-[11px]">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="passenger@gmail.com"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-950 font-semibold focus:outline-none focus:border-[#D31720] shadow-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-800 font-bold mb-1 text-[11px]">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Chennai / Coimbatore"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-950 font-semibold focus:outline-none focus:border-[#D31720] shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-slate-800 font-bold mb-1 text-[11px]">Preferences / Tag</label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="e.g. VIP, Airport frequent"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-950 font-semibold focus:outline-none focus:border-[#D31720] shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1 text-[11px]">Street Address</label>
                <textarea
                  rows="2"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Door No, Street, Area, Pin code..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-950 font-semibold focus:outline-none focus:border-[#D31720] shadow-sm resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-col-reverse xs:flex-row items-stretch xs:items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold border border-slate-300 text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D31720] to-[#9B1017] hover:brightness-105 text-white font-black active:scale-95 transition-all shadow-[0_4px_18px_rgba(211,23,32,0.35)] border border-white/20 text-center"
                >
                  {editingCustomer ? 'Update Customer' : 'Save Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Customer Booking History Modal */}
      {historyCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-3xl bg-white rounded-2xl border border-slate-200 shadow-2xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto space-y-4 text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-black text-base sm:text-lg text-slate-950 flex items-center gap-2">
                  <History className="w-5 h-5 text-[#D31720]" />
                  Trip History: {historyCustomer.name}
                </h3>
                <p className="text-xs text-slate-600 font-semibold">{historyCustomer.phone} • {historyCustomer.city || 'Tamil Nadu'}</p>
              </div>
              <button 
                onClick={() => setHistoryCustomer(null)}
                className="text-slate-500 hover:text-slate-950 p-1.5 rounded-lg bg-slate-100 border border-slate-200"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {customerTrips.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs font-semibold">
                  No trips on record for this customer.
                </div>
              ) : (
                customerTrips.map((trip) => (
                  <div
                    key={trip.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-sm"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 font-mono font-black text-[#051A2D]">
                        <span>{trip.id}</span>
                        <span className="text-slate-600 font-semibold">• {trip.tripType}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                          trip.bookingStatus === 'Completed' ? 'bg-[#D31720]/15 text-[#D31720]' :
                          trip.bookingStatus === 'In Progress' ? 'bg-[#FEA24F]/15 text-[#B25900]' :
                          'bg-[#051A2D]/10 text-[#051A2D]'
                        }`}>
                          {trip.bookingStatus}
                        </span>
                      </div>
                      <div className="text-slate-950 font-black space-y-0.5">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="w-2 h-2 rounded-full bg-[#D31720] shrink-0" />
                          <span className="truncate">{trip.pickupLocation}</span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate text-slate-700 font-semibold">
                          <span className="w-2 h-2 rounded-full bg-[#D31720] shrink-0" />
                          <span className="truncate">{trip.dropLocation}</span>
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-600 font-semibold flex items-center gap-3">
                        <span>Cab: {trip.vehicleModel}</span>
                        <span>Driver: {trip.driverName}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                      <div className="text-right">
                        <span className="font-black text-slate-950 text-sm">
                          {currency}{trip.fareDetails?.totalFare || 0}
                        </span>
                        <span className={`block text-[10px] font-bold ${
                          trip.paymentStatus === 'Paid' ? 'text-[#D31720]' : 'text-[#B25900]'
                        }`}>
                          {trip.paymentStatus}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setHistoryCustomer(null);
                          onViewInvoice(trip);
                        }}
                        className="p-2 rounded-xl bg-white text-slate-900 hover:text-[#D31720] border border-slate-300 transition-all shadow-sm"
                        title="View Invoice"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
