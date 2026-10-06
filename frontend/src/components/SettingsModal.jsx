import React, { useState } from 'react';
import { 
  Settings, 
  Shield, 
  Save, 
  CheckCircle2, 
  Building2, 
  Sliders
} from 'lucide-react';

export const SettingsModal = ({ 
  settings, 
  onUpdateSettings 
}) => {
  const [formData, setFormData] = useState({
    companyName: settings?.companyName || 'City Cabs & Travels',
    tagline: settings?.tagline || "Tamil Nadu's Trusted Fleet & Chauffeur Network",
    currency: settings?.currency || '₹',
    currencyCode: settings?.currencyCode || 'INR',
    baseFare: settings?.baseFare || 150,
    ratePerKm: settings?.ratePerKm || 18,
    waitingChargePerHour: settings?.waitingChargePerHour || 120,
    gstTaxPercentage: settings?.gstTaxPercentage || 5,
    supportPhone: settings?.supportPhone || '+91 44 2234 5678',
    supportEmail: settings?.supportEmail || 'support@citycabs.com',
    address: settings?.address || 'No. 42, GST Road, Guindy Industrial Estate, Chennai, Tamil Nadu - 600032'
  });

  const [savedMessage, setSavedMessage] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateSettings(formData);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <div className="space-y-5 sm:space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header with Theme Banner */}
      <div className="p-3.5 sm:p-4 rounded-2xl theme-banner-vehicles shadow-sm flex flex-col justify-between gap-1 animate-page-enter relative overflow-hidden group">
        {/* Subtle Ambient Color Glow & Specular Line */}
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-gradient-to-br from-red-500/15 via-[#D31720]/10 to-transparent rounded-full blur-2xl pointer-events-none animate-pulse" />
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#D31720]/35 to-transparent pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#D31720]/15 via-red-50 to-[#D31720]/10 text-[#D31720] text-[10px] font-extrabold uppercase tracking-wider mb-1 border border-[#D31720]/30 shadow-2xs self-start">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D31720] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D31720]"></span>
            </span>
            <span>Enterprise Administration</span>
          </div>
          <h2 className="text-sm sm:text-base md:text-lg font-black bg-gradient-to-r from-[#D31720] via-red-700 to-[#7D0B12] bg-clip-text text-transparent tracking-tight flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-[#D31720] to-[#9B1017] text-white flex items-center justify-center shadow-xs shadow-[#D31720]/25 shrink-0">
              <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
            </div>
            <span>Admin Control & System Parameters</span>
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-600 font-medium italic mt-0.5">
            Configure baseline tariffs, Tamil Nadu GST rates, enterprise branding, and RBAC matrix
          </p>
        </div>
      </div>

      {savedMessage && (
        <div className="p-3.5 rounded-xl bg-[#D31720]/15 border border-[#D31720]/40 text-[#D31720] flex items-center gap-2 text-xs font-bold animate-in fade-in shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-[#D31720]" />
          Settings updated successfully!
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
        {/* Company Identity: Glass Panel */}
        <div className="p-5 sm:p-6 rounded-2xl glass-panel border border-slate-200/90 bg-white/95 backdrop-blur-md shadow-md space-y-4">
          <h3 className="font-bold text-sm sm:text-base text-slate-950 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#D31720]" />
            Enterprise Branding & Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs sm:text-sm">
            <div>
              <label className="block text-slate-950 font-bold mb-1 text-[11px]">Company Name</label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-[#D31720]/25 rounded-xl text-slate-950 font-medium focus:outline-none focus:border-[#D31720] shadow-sm"
              />
            </div>

            <div>
              <label className="block text-slate-950 font-bold mb-1 text-[11px]">Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-[#D31720]/25 rounded-xl text-slate-950 font-medium focus:outline-none focus:border-[#D31720] shadow-sm"
              />
            </div>

            <div>
              <label className="block text-slate-950 font-bold mb-1 text-[11px]">Support Phone</label>
              <input
                type="text"
                value={formData.supportPhone}
                onChange={(e) => setFormData({ ...formData, supportPhone: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-[#D31720]/25 rounded-xl text-slate-950 font-medium focus:outline-none focus:border-[#D31720] shadow-sm"
              />
            </div>

            <div>
              <label className="block text-slate-950 font-bold mb-1 text-[11px]">Support Email</label>
              <input
                type="email"
                value={formData.supportEmail}
                onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-[#D31720]/25 rounded-xl text-slate-950 font-medium focus:outline-none focus:border-[#D31720] shadow-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-950 font-bold mb-1 text-[11px]">Head Office Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-[#D31720]/25 rounded-xl text-slate-950 font-medium focus:outline-none focus:border-[#D31720] shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Pricing & Tariffs Engine: Glass Panel */}
        <div className="p-5 sm:p-6 rounded-2xl glass-panel border border-slate-200/90 bg-white/95 backdrop-blur-md shadow-md space-y-4">
          <h3 className="font-bold text-sm sm:text-base text-slate-950 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#D31720]" />
            Default Tariff Engine
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs sm:text-sm">
            <div>
              <label className="block text-slate-950 font-bold mb-1 text-[11px]">Currency Symbol</label>
              <input
                type="text"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-[#D31720]/25 rounded-xl text-slate-950 font-bold focus:outline-none focus:border-[#D31720] shadow-sm"
              />
            </div>

            <div>
              <label className="block text-slate-950 font-bold mb-1 text-[11px]">Default Base Fare ({formData.currency})</label>
              <input
                type="number"
                value={formData.baseFare}
                onChange={(e) => setFormData({ ...formData, baseFare: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-white border border-[#D31720]/25 rounded-xl text-slate-950 font-semibold focus:outline-none focus:border-[#D31720] shadow-sm"
              />
            </div>

            <div>
              <label className="block text-slate-950 font-bold mb-1 text-[11px]">Default Rate Per KM ({formData.currency})</label>
              <input
                type="number"
                value={formData.ratePerKm}
                onChange={(e) => setFormData({ ...formData, ratePerKm: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-white border border-[#D31720]/25 rounded-xl text-slate-950 font-semibold focus:outline-none focus:border-[#D31720] shadow-sm"
              />
            </div>

            <div>
              <label className="block text-slate-950 font-bold mb-1 text-[11px]">Waiting Charge / Hour ({formData.currency})</label>
              <input
                type="number"
                value={formData.waitingChargePerHour}
                onChange={(e) => setFormData({ ...formData, waitingChargePerHour: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-white border border-[#D31720]/25 rounded-xl text-slate-950 font-semibold focus:outline-none focus:border-[#D31720] shadow-sm"
              />
            </div>

            <div>
              <label className="block text-slate-950 font-bold mb-1 text-[11px]">Tamil Nadu GST / Tax (%)</label>
              <input
                type="number"
                value={formData.gstTaxPercentage}
                onChange={(e) => setFormData({ ...formData, gstTaxPercentage: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-white border border-[#D31720]/25 rounded-xl text-slate-950 font-semibold focus:outline-none focus:border-[#D31720] shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* User Roles & RBAC Matrix: Glass Panel */}
        <div className="p-5 sm:p-6 rounded-2xl glass-panel border border-slate-200/90 bg-white/95 backdrop-blur-md shadow-md space-y-4">
          <h3 className="font-bold text-sm sm:text-base text-slate-950 flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#D31720]" />
            Role-Based Access Control (RBAC Matrix)
          </h3>
          <p className="text-xs text-slate-600 font-medium">
            The platform enforces distinct permission boundaries across operational personas in Tamil Nadu:
          </p>

          <p className="sm:hidden text-[11px] text-[#D31720] font-bold mb-1">
            ← Swipe table horizontally to view all permissions →
          </p>

          <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm -mx-1 sm:mx-0">
            <table className="w-full min-w-[560px] text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-950 font-black">
                  <th className="py-2.5 px-3">System Permission</th>
                  <th className="py-2.5 px-3 text-center">ADMIN / OWNER (Rajasekaran)</th>
                  <th className="py-2.5 px-3 text-center">MANAGER (Kavitha)</th>
                  <th className="py-2.5 px-3 text-center">DRIVER (Murugan)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-950">Fleet & Vehicle Management (Add/Edit/Delete)</td>
                  <td className="py-2.5 px-3 text-center text-[#D31720] font-bold">✓ Full</td>
                  <td className="py-2.5 px-3 text-center text-[#D31720] font-bold">✓ Full</td>
                  <td className="py-2.5 px-3 text-center text-red-600 font-bold">✗ No Access</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-950">Driver Onboarding & Vehicle Assignment</td>
                  <td className="py-2.5 px-3 text-center text-[#D31720] font-bold">✓ Full</td>
                  <td className="py-2.5 px-3 text-center text-[#D31720] font-bold">✓ Full</td>
                  <td className="py-2.5 px-3 text-center text-red-600 font-bold">✗ No Access</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-950">Create, Edit & Dispatch Trip Bookings</td>
                  <td className="py-2.5 px-3 text-center text-[#D31720] font-bold">✓ Full</td>
                  <td className="py-2.5 px-3 text-center text-[#D31720] font-bold">✓ Full</td>
                  <td className="py-2.5 px-3 text-center text-red-600 font-bold">✗ No Access</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-950">View Assigned Trips & Passenger Contact</td>
                  <td className="py-2.5 px-3 text-center text-[#D31720] font-bold">✓ Full</td>
                  <td className="py-2.5 px-3 text-center text-[#D31720] font-bold">✓ Full</td>
                  <td className="py-2.5 px-3 text-center text-[#D31720] font-bold">✓ My Trips</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-950">Update Trip Status (Start, Complete)</td>
                  <td className="py-2.5 px-3 text-center text-[#D31720] font-bold">✓ Full</td>
                  <td className="py-2.5 px-3 text-center text-[#D31720] font-bold">✓ Full</td>
                  <td className="py-2.5 px-3 text-center text-[#D31720] font-bold">✓ Assigned</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-950">System Settings & Tariff Engine</td>
                  <td className="py-2.5 px-3 text-center text-[#D31720] font-bold">✓ Full</td>
                  <td className="py-2.5 px-3 text-center text-red-600 font-bold">✗ Read Only</td>
                  <td className="py-2.5 px-3 text-center text-red-600 font-bold">✗ No Access</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#D31720]/15">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D31720] to-[#9B1017] hover:brightness-105 text-white font-black text-sm active:scale-95 transition-all shadow-md shadow-[#D31720]/30 border border-white/30 flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Parameters</span>
          </button>
        </div>
      </form>
    </div>
  );
};
