import React, { useState } from 'react';
import { 
  UserCheck, 
  Plus, 
  Search, 
  Phone, 
  Car, 
  Star, 
  ShieldAlert, 
  Edit3, 
  Trash2, 
  X,
  Clock,
  Award,
  CheckCircle2
} from 'lucide-react';

export const DriverManagement = ({ 
  drivers, 
  vehicles, 
  onAddDriver, 
  onUpdateDriver, 
  onDeleteDriver 
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);

  const initialForm = {
    name: '',
    phone: '',
    email: '',
    licenseNumber: '',
    experienceYears: 4,
    assignedVehicleId: '',
    emergencyContact: '',
    status: 'Available'
  };
  const [formData, setFormData] = useState(initialForm);

  const statusOptions = ['All', 'Available', 'On Trip', 'Off Duty'];

  const filteredDrivers = drivers.filter((d) => {
    const matchesSearch = 
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.phone.toLowerCase().includes(search.toLowerCase()) ||
      d.licenseNumber.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || d.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleOpenAdd = () => {
    setEditingDriver(null);
    setFormData(initialForm);
    setModalOpen(true);
  };

  const handleOpenEdit = (driver) => {
    setEditingDriver(driver);
    setFormData({
      name: driver.name,
      phone: driver.phone,
      email: driver.email || '',
      licenseNumber: driver.licenseNumber,
      experienceYears: driver.experienceYears || 4,
      assignedVehicleId: driver.assignedVehicleId || '',
      emergencyContact: driver.emergencyContact || '',
      status: driver.status
    });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.licenseNumber) return;

    if (editingDriver) {
      onUpdateDriver(editingDriver.id, formData);
    } else {
      onAddDriver(formData);
    }
    setModalOpen(false);
  };

  const handleToggleStatus = (driver, newStatus) => {
    onUpdateDriver(driver.id, { status: newStatus });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Available':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-black bg-[#D31720]/15 text-[#D31720] border border-[#D31720]/30 flex items-center gap-1.5 shadow-sm whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-[#D31720] shadow-[0_0_8px_rgba(6,129,135,0.8)]" />
            <span>Available</span>
          </span>
        );
      case 'On Trip':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-black bg-[#FEA24F]/15 text-[#B25900] border border-[#FEA24F]/40 flex items-center gap-1.5 shadow-sm whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-[#FEA24F] animate-ping" />
            <span>On Trip</span>
          </span>
        );
      case 'Off Duty':
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-black bg-slate-100 text-slate-700 border border-slate-300 flex items-center gap-1.5 shadow-sm whitespace-nowrap">
            <Clock className="w-3 h-3 text-slate-500" />
            <span>Off Duty</span>
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
            Verified Captains Roster
          </div>
          <h2 className="text-lg sm:text-2xl font-black bg-gradient-to-r from-[#D31720] via-red-600 to-red-600 bg-clip-text text-transparent tracking-tight flex items-center gap-2">
            <UserCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#D31720]" />
            <span>Captains & Driver Management</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium italic">
            Manage verified captains, duty status, Tamil Nadu RTO badges, and vehicle allocations
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#D31720] to-[#9B1017] hover:brightness-105 text-white font-bold text-xs sm:text-sm active:scale-95 transition-all shadow-[0_4px_16px_rgba(211,23,32,0.35)] border border-white/30 flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Onboard Captain</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 sm:p-4 rounded-2xl glass-panel border border-[#D31720]/25 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search driver name (e.g. Murugan, Senthil), phone, TN license..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-950 placeholder:text-slate-400 focus:outline-none focus:border-[#D31720] transition-colors shadow-sm font-semibold"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {statusOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setStatusFilter(opt)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                statusFilter === opt
                  ? 'bg-gradient-to-r from-[#D31720] to-[#9B1017] text-white shadow-sm font-black'
                  : 'bg-white text-slate-700 hover:text-slate-950 hover:bg-red-50/50 border border-slate-200'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Drivers Grid - 2 cols on medium/laptop, 3 cols on 2xl to allow generous room with zero truncation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
        {filteredDrivers.length === 0 ? (
          <div className="col-span-full py-16 text-center glass-panel rounded-2xl border border-slate-200 shadow-sm">
            <UserCheck className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-60" />
            <p className="text-sm font-bold text-slate-950">No captains found</p>
            <p className="text-xs text-slate-600 mt-1 font-semibold italic">Check filter settings or onboard a new captain</p>
          </div>
        ) : (
          filteredDrivers.map((driver) => {
            // Find assigned vehicle details if present
            const assignedVeh = vehicles.find((v) => v.id === driver.assignedVehicleId);
            const vehModel = assignedVeh 
              ? assignedVeh.model 
              : (driver.assignedVehicleName && driver.assignedVehicleName !== 'Unassigned' 
                  ? driver.assignedVehicleName.replace(/\s*\([^)]*\)/, '') 
                  : null);
            const vehPlate = assignedVeh 
              ? assignedVeh.registrationNumber 
              : (driver.assignedVehicleName && driver.assignedVehicleName.includes('(') 
                  ? driver.assignedVehicleName.match(/\(([^)]+)\)/)?.[1] 
                  : null);

            return (
              <div
                key={driver.id}
                className="p-5 rounded-2xl bg-gradient-to-br from-white/95 via-white/90 to-[#D31720]/5 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(5,26,45,0.06)] hover:shadow-[0_16px_40px_rgba(16,187,195,0.18)] hover:border-[#D31720]/40 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between gap-4"
              >
                {/* Top specular reflection shimmer */}
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#D31720]/50 to-transparent" />
                
                {/* Ambient corner gloss glow */}
                <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#D31720]/10 rounded-full blur-2xl group-hover:bg-[#D31720]/20 transition-all pointer-events-none" />

                <div className="space-y-4 relative z-10">
                  {/* Driver Header Row: Avatar, Full Name & Rating, Duty Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {/* Glossy Avatar with Initials */}
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#051A2D] to-[#0A2F50] border-2 border-white/80 flex items-center justify-center text-white font-black text-sm shrink-0 shadow-md ring-2 ring-[#051A2D]/10">
                        {driver.name ? driver.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() : 'CP'}
                      </div>
                      
                      {/* Full Name & Star Rating - NO TRUNCATION */}
                      <div className="min-w-0 flex-1">
                        <h3 className="font-black text-base sm:text-lg text-slate-950 leading-snug group-hover:text-[#D31720] transition-colors">
                          {driver.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <div className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-lg text-amber-700 text-xs font-bold shadow-xs">
                            <Star className="w-3.5 h-3.5 fill-amber-400 stroke-none shrink-0" />
                            <span className="font-black text-slate-950">{driver.rating || 4.9}</span>
                          </div>
                          <span className="text-slate-600 font-semibold text-xs italic">
                            {driver.totalTrips || 0} completed trips
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 pt-0.5">
                      {getStatusBadge(driver.status)}
                    </div>
                  </div>

                  {/* Clean Essential Credentials (Phone, License, Experience) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/80 border border-slate-200/70">
                      <Phone className="w-3.5 h-3.5 text-[#D31720] shrink-0" />
                      <span className="text-slate-950 font-bold tracking-tight">{driver.phone}</span>
                    </div>

                    <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/80 border border-slate-200/70">
                      <ShieldAlert className="w-3.5 h-3.5 text-[#051A2D] shrink-0" />
                      <span className="text-slate-900 font-mono font-bold text-[11px]">
                        DL: {driver.licenseNumber}
                      </span>
                    </div>
                  </div>

                  {/* Assigned Fleet Cab Box: Clean card with full vehicle model and license plate */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 shadow-xs">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] text-[#D31720] font-black uppercase tracking-wider flex items-center gap-1.5">
                        <Car className="w-3.5 h-3.5 text-[#D31720]" />
                        Assigned Fleet Cab
                      </span>
                      {driver.experienceYears && (
                        <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200 shadow-2xs">
                          {driver.experienceYears} yrs exp
                        </span>
                      )}
                    </div>

                    {vehModel ? (
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                        <span className="font-black text-slate-950 text-sm">
                          {vehModel}
                        </span>
                        {vehPlate && (
                          <span className="font-mono font-black text-xs px-2.5 py-0.5 rounded-md bg-white border border-[#D31720]/40 text-[#051A2D] shadow-xs tracking-wider">
                            {vehPlate}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="text-xs font-semibold text-slate-600 italic py-0.5">
                        Float Chauffeur • No cab assigned
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Controls: Prominent Edit Button, Duty Toggle, and Delete */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 relative z-10">
                  <div className="flex items-center gap-2">
                    {/* Duty Status Quick Toggle */}
                    {driver.status === 'Off Duty' ? (
                      <button
                        onClick={() => handleToggleStatus(driver, 'Available')}
                        className="px-3 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#D31720] to-[#D31720] text-white hover:brightness-110 active:scale-95 transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Start Duty</span>
                      </button>
                    ) : driver.status === 'Available' ? (
                      <button
                        onClick={() => handleToggleStatus(driver, 'Off Duty')}
                        className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 active:scale-95 transition-all shadow-xs flex items-center gap-1.5"
                      >
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>Mark Off Duty</span>
                      </button>
                    ) : null}

                    {/* Clear, Prominent Edit Button */}
                    <button
                      onClick={() => handleOpenEdit(driver)}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 hover:border-[#D31720] transition-all shadow-xs flex items-center gap-1.5 font-bold text-xs group/edit"
                      title="Edit Captain Profile"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#D31720] group-hover/edit:scale-110 transition-transform" />
                      <span>Edit Details</span>
                    </button>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => {
                      if (confirm(`Remove captain ${driver.name} from the roster?`)) onDeleteDriver(driver.id);
                    }}
                    className="p-2 rounded-xl bg-white hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-200 hover:border-red-300 transition-colors shadow-xs"
                    title="Delete Captain"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Driver Modal with Clean Theme Styling */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto space-y-4 text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-base sm:text-lg text-slate-950 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[#D31720]" />
                {editingDriver ? 'Edit Captain Details' : 'Onboard New Captain'}
              </h3>
              <button 
                onClick={() => setModalOpen(false)}
                className="text-slate-500 hover:text-slate-950 p-1.5 rounded-lg bg-slate-100 border border-slate-200 transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-800 font-bold mb-1 text-[11px]">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Murugan Selvam"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-950 font-semibold focus:outline-none focus:border-[#D31720] shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1 text-[11px]">Mobile Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98401 22345"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-950 font-semibold focus:outline-none focus:border-[#D31720] shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1 text-[11px]">License Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value.toUpperCase() })}
                    placeholder="TN-07-20190045210"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-950 font-mono font-bold uppercase focus:outline-none focus:border-[#D31720] shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1 text-[11px]">Experience (Years)</label>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-950 font-semibold focus:outline-none focus:border-[#D31720] shadow-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-800 font-bold mb-1 text-[11px]">Assigned Fleet Vehicle</label>
                  <select
                    value={formData.assignedVehicleId}
                    onChange={(e) => setFormData({ ...formData, assignedVehicleId: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-950 font-semibold focus:outline-none focus:border-[#D31720] shadow-xs"
                  >
                    <option value="">-- No vehicle assigned (Float Chauffeur) --</option>
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.model} - {v.registrationNumber} ({v.type}) [{v.status}]
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1 text-[11px]">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="driver@citycabs.com"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-950 font-semibold focus:outline-none focus:border-[#D31720] shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1 text-[11px]">Emergency Contact</label>
                  <input
                    type="tel"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    placeholder="+91 94441 55667"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-950 font-semibold focus:outline-none focus:border-[#D31720] shadow-xs"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-col-reverse xs:flex-row items-stretch xs:items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold border border-slate-300 text-center transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D31720] to-[#9B1017] hover:brightness-105 text-white font-black active:scale-95 transition-all shadow-[0_4px_16px_rgba(211,23,32,0.35)] border border-white/20 text-center"
                >
                  {editingDriver ? 'Save Changes' : 'Confirm & Onboard'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
