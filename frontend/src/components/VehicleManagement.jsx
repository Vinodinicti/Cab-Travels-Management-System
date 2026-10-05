import React, { useState } from 'react';
import { 
  Car, 
  Plus, 
  Search, 
  Users, 
  Wrench, 
  Trash2, 
  Edit3, 
  X,
  Gauge
} from 'lucide-react';

export const VehicleManagement = ({ 
  vehicles, 
  onAddVehicle, 
  onUpdateVehicle, 
  onDeleteVehicle,
  currency = '₹'
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const initialForm = {
    registrationNumber: '',
    model: '',
    type: 'Sedan',
    seatingCapacity: 4,
    fuelType: 'Petrol',
    color: 'White',
    year: 2024,
    perKmRate: 18,
    baseFare: 150,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=500&auto=format&fit=crop&q=80'
  };
  const [formData, setFormData] = useState(initialForm);

  const vehicleTypes = ['All', 'Sedan', 'SUV', 'Hatchback', 'Luxury', 'Electric', 'Tempo / Mini-Bus'];
  const statusOptions = ['All', 'Available', 'On Trip', 'Maintenance'];

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch = 
      v.registrationNumber.toLowerCase().includes(search.toLowerCase()) ||
      v.model.toLowerCase().includes(search.toLowerCase()) ||
      v.type.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || v.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesType = typeFilter === 'All' || v.type.toLowerCase() === typeFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleOpenAdd = () => {
    setEditingVehicle(null);
    setFormData(initialForm);
    setModalOpen(true);
  };

  const handleOpenEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      registrationNumber: vehicle.registrationNumber,
      model: vehicle.model,
      type: vehicle.type,
      seatingCapacity: vehicle.seatingCapacity,
      fuelType: vehicle.fuelType,
      color: vehicle.color || 'White',
      year: vehicle.year || 2024,
      perKmRate: vehicle.perKmRate,
      baseFare: vehicle.baseFare,
      status: vehicle.status,
      image: vehicle.image || ''
    });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.registrationNumber || !formData.model) return;

    if (editingVehicle) {
      onUpdateVehicle(editingVehicle.id, formData);
    } else {
      onAddVehicle(formData);
    }
    setModalOpen(false);
  };

  const handleToggleStatus = (vehicle, newStatus) => {
    onUpdateVehicle(vehicle.id, { status: newStatus });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Available':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#D31720]/15 text-[#D31720] border border-[#D31720]/40 flex items-center gap-1.5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D31720]" />
            <span>Available</span>
          </span>
        );
      case 'On Trip':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FEA24F]/15 text-[#B25900] border border-[#FEA24F]/40 flex items-center gap-1.5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FEA24F] animate-ping" />
            <span>On Trip</span>
          </span>
        );
      case 'Maintenance':
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#D31720]/15 text-[#D31720] border border-[#D31720]/40 flex items-center gap-1.5 shadow-sm">
            <Wrench className="w-3 h-3 text-[#D31720]" />
            <span>Maintenance</span>
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
            Depot Fleet Inventory
          </div>
          <h2 className="text-lg sm:text-2xl font-black bg-gradient-to-r from-[#D31720] via-red-600 to-red-600 bg-clip-text text-transparent tracking-tight flex items-center gap-2">
            <Car className="w-5 h-5 sm:w-6 sm:h-6 text-[#D31720]" />
            <span>Fleet & Vehicle Inventory</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium italic">
            Manage your fleet of cabs across Chennai, Coimbatore, Madurai, Salem & Trichy depots
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#D31720] to-[#9B1017] hover:brightness-105 text-white font-bold text-xs sm:text-sm active:scale-95 transition-all shadow-[0_4px_16px_rgba(211,23,32,0.35)] border border-white/30 flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Vehicle</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 sm:p-4 rounded-2xl glass-panel border border-[#D31720]/25 shadow-sm flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by TN plate (e.g. TN 07, TN 38), model, vehicle type..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-950 placeholder:text-slate-400 focus:outline-none focus:border-[#D31720] transition-colors shadow-sm font-semibold"
          />
          {search && (
            <button 
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
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

        {/* Type Filter */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-950 font-bold focus:outline-none focus:border-[#D31720] shadow-sm"
        >
          {vehicleTypes.map((t) => (
            <option key={t} value={t}>{t === 'All' ? 'All Vehicle Types' : t}</option>
          ))}
        </select>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
        {filteredVehicles.length === 0 ? (
          <div className="col-span-full py-16 text-center glass-panel rounded-2xl border border-slate-200 shadow-sm">
            <Car className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-60" />
            <p className="text-sm font-bold text-slate-950">No vehicles found</p>
            <p className="text-xs text-slate-600 mt-1 font-semibold italic">Try clearing filters or add a new cab to the fleet</p>
          </div>
        ) : (
          filteredVehicles.map((v) => (
            <div
              key={v.id}
              className="rounded-2xl glass-panel glass-panel-hover overflow-hidden flex flex-col justify-between transition-all group border border-slate-200/90 shadow-sm hover:shadow-md bg-white/95 backdrop-blur-md"
            >
              {/* Image banner: Clean light stage so vehicle photo looks clean */}
              <div className="relative h-48 bg-gradient-to-b from-slate-100 to-white flex items-center justify-center p-3 overflow-hidden border-b border-slate-200">
                <img
                  src={v.image}
                  alt={v.model}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_8px_16px_rgba(0,0,0,0.15)]"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=500&auto=format&fit=crop&q=80";
                  }}
                />
                
                {/* Plate Badge: Bold contrast with golden yellow TN accent */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-950 border border-amber-400/50 text-amber-300 font-mono font-black text-xs tracking-wider shadow-md flex items-center gap-1.5 max-w-[55%] truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  <span className="truncate">{v.registrationNumber}</span>
                </div>

                {/* Status Badge */}
                <div className="absolute top-3 right-3 shrink-0">
                  {getStatusBadge(v.status)}
                </div>

                {/* Type Badge */}
                <div className="absolute bottom-3 left-3 text-xs font-bold text-slate-900 bg-white/95 px-2.5 py-0.5 rounded-md backdrop-blur-md border border-slate-300 shadow-sm">
                  {v.type} • {v.fuelType}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-black text-base text-slate-950 group-hover:text-[#D31720] transition-colors">
                        {v.model}
                      </h3>
                      <p className="text-xs text-slate-600 font-semibold mt-0.5">
                        Year: {v.year} • Color: {v.color}
                      </p>
                    </div>
                  </div>

                  {/* Attributes Grid: Crisp Black contrast data */}
                  <div className="grid grid-cols-2 gap-2 mt-3.5 pt-3 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
                      <Users className="w-3.5 h-3.5 text-[#D31720] shrink-0" />
                      <span className="text-slate-600 text-[11px] font-bold">Seats:</span>
                      <strong className="text-slate-950 font-black">{v.seatingCapacity}</strong>
                    </div>

                    <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
                      <Gauge className="w-3.5 h-3.5 text-[#D31720] shrink-0" />
                      <span className="text-slate-600 text-[11px] font-bold">Odo:</span>
                      <strong className="text-slate-950 font-black truncate">{v.odometerKm || 0} km</strong>
                    </div>

                    <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
                      <span className="text-[#D31720] font-black text-xs">{currency}</span>
                      <span className="text-slate-600 text-[11px] font-bold">Base:</span>
                      <strong className="text-slate-950 font-black">{currency}{v.baseFare}</strong>
                    </div>

                    <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
                      <span className="text-[#D31720] font-black text-[11px]">{currency}/km</span>
                      <span className="text-slate-600 text-[11px] font-bold">Rate:</span>
                      <strong className="text-slate-950 font-black">{currency}{v.perKmRate}</strong>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {v.status !== 'Available' && (
                      <button
                        onClick={() => handleToggleStatus(v, 'Available')}
                        className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-[#D31720]/15 text-[#D31720] hover:bg-[#D31720] hover:text-white border border-[#D31720]/40 transition-all shadow-sm"
                      >
                        Set Available
                      </button>
                    )}
                    {v.status !== 'Maintenance' && (
                      <button
                        onClick={() => handleToggleStatus(v, 'Maintenance')}
                        className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-red-50 text-red-700 hover:bg-[#D31720] hover:text-white border border-red-200 transition-all shadow-sm"
                      >
                        Maintenance
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(v)}
                      className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 transition-colors shadow-sm"
                      title="Edit Vehicle"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#D31720]" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Remove vehicle ${v.registrationNumber}?`)) onDeleteVehicle(v.id);
                      }}
                      className="p-1.5 rounded-lg bg-white hover:bg-red-50 text-red-700 border border-slate-300 transition-colors shadow-sm"
                      title="Delete Vehicle"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Vehicle Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto space-y-4 text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-base sm:text-lg text-slate-950 flex items-center gap-2">
                <Car className="w-5 h-5 text-[#D31720]" />
                {editingVehicle ? 'Edit Vehicle Details' : 'Register New Vehicle'}
              </h3>
              <button 
                onClick={() => setModalOpen(false)}
                className="text-slate-500 hover:text-slate-950 p-1.5 rounded-lg bg-slate-100 border border-slate-200"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-800 font-bold mb-1 text-[11px]">TN Registration Plate *</label>
                  <input
                    type="text"
                    required
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value.toUpperCase() })}
                    placeholder="e.g. TN 07 CM 4050"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-950 font-mono font-bold uppercase focus:outline-none focus:border-[#D31720] shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1 text-[11px]">Make & Model *</label>
                  <input
                    type="text"
                    required
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    placeholder="e.g. Toyota Innova Hycross"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-950 font-semibold focus:outline-none focus:border-[#D31720] shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1 text-[11px]">Vehicle Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-950 font-semibold focus:outline-none focus:border-[#D31720] shadow-sm"
                  >
                    <option value="Sedan">Sedan (Dzire / Etios)</option>
                    <option value="SUV">SUV (Innova / Ertiga)</option>
                    <option value="Hatchback">Hatchback (WagonR / Tiago)</option>
                    <option value="Luxury">Luxury (Camry / Fortuner)</option>
                    <option value="Electric">Electric (Nexon EV / ZS EV)</option>
                    <option value="Tempo / Mini-Bus">Tempo Traveller (14+ Seater)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1 text-[11px]">Seating Capacity</label>
                  <input
                    type="number"
                    min="2"
                    max="30"
                    value={formData.seatingCapacity}
                    onChange={(e) => setFormData({ ...formData, seatingCapacity: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-950 font-semibold focus:outline-none focus:border-[#D31720] shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1 text-[11px]">Fuel Type</label>
                  <select
                    value={formData.fuelType}
                    onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-950 font-semibold focus:outline-none focus:border-[#D31720] shadow-sm"
                  >
                    <option value="Diesel">Diesel</option>
                    <option value="Petrol">Petrol</option>
                    <option value="CNG">CNG</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1 text-[11px]">Color & Year</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-1/2 px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-950 font-semibold focus:outline-none focus:border-[#D31720] shadow-sm"
                    />
                    <input
                      type="number"
                      placeholder="Year"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className="w-1/2 px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-950 font-semibold focus:outline-none focus:border-[#D31720] shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1 text-[11px]">Base Fare ({currency})</label>
                  <input
                    type="number"
                    value={formData.baseFare}
                    onChange={(e) => setFormData({ ...formData, baseFare: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-950 font-semibold focus:outline-none focus:border-[#D31720] shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1 text-[11px]">Per KM Rate ({currency})</label>
                  <input
                    type="number"
                    value={formData.perKmRate}
                    onChange={(e) => setFormData({ ...formData, perKmRate: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-950 font-semibold focus:outline-none focus:border-[#D31720] shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1 text-[11px]">Image URL (Optional)</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-950 font-semibold focus:outline-none focus:border-[#D31720] shadow-sm"
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
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D31720] to-[#9B1017] hover:brightness-105 text-white font-black active:scale-95 transition-all shadow-[0_4px_16px_rgba(211,23,32,0.35)] border border-white/20 text-center"
                >
                  {editingVehicle ? 'Update Vehicle' : 'Save & Register'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
