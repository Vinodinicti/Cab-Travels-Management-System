import React from 'react';
import { 
  X, 
  Printer, 
  Car, 
  Phone, 
  Clock, 
  FileText
} from 'lucide-react';

export const InvoiceModal = ({ booking, settings, onClose }) => {
  if (!booking) return null;

  const currency = settings?.currency || '₹';
  const fare = booking.fareDetails || {
    baseFare: 150,
    distanceCharge: 300,
    waitingCharge: 0,
    driverAllowance: 0,
    tax: 23,
    discount: 0,
    totalFare: 473
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white rounded-2xl border border-slate-300 shadow-2xl p-4 sm:p-6 max-h-[92vh] overflow-y-auto space-y-5 printable-receipt text-slate-900">
        {/* Action Header */}
        <div className="no-print flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 min-w-0">
            <FileText className="w-5 h-5 text-[#051A2D] shrink-0" />
            <h3 className="font-black text-sm sm:text-lg text-slate-950 truncate">Trip Invoice & Receipt</h3>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrint}
              className="px-3 sm:px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#D31720] to-[#9B1017] hover:brightness-110 text-white font-black text-xs flex items-center gap-1.5 shadow-[0_2px_14px_rgba(211,23,32,0.30)] active:scale-95 transition-all border border-white/20"
            >
              <Printer className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden xs:inline">Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-500 hover:text-slate-950 rounded-lg bg-slate-100 border border-slate-200 shrink-0"
              aria-label="Close Modal"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Sheet Content */}
        <div className="space-y-5 p-1 sm:p-2">
          {/* Company Branding & Meta */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#D31720] to-[#9B1017] text-white flex items-center justify-center font-black shadow-sm">
                  <Car className="w-4 h-4" />
                </div>
                <h2 className="text-lg sm:text-xl font-black tracking-tight text-slate-950">
                  {settings?.companyName || 'City Cabs & Travels'}
                </h2>
              </div>
              <p className="text-xs text-slate-700 font-bold mt-1 italic">{settings?.tagline || "Tamil Nadu's Trusted Fleet & Chauffeur Network"}</p>
              <p className="text-[11px] text-slate-600 mt-0.5">{settings?.address || 'No. 42, GST Road, Guindy Industrial Estate, Chennai, Tamil Nadu - 600032'}</p>
              <p className="text-[11px] text-slate-600 font-semibold">Support: {settings?.supportPhone || '+91 44 2234 5678'} • GSTIN: 33AAACK1234F1Z8</p>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <span className="text-[10px] font-black text-[#D31720] uppercase tracking-wider block">
                TAX INVOICE / RECEIPT
              </span>
              <div className="font-mono font-black text-base sm:text-lg text-slate-950">{booking.id}</div>
              <div className="text-xs text-slate-600 font-semibold">
                Issued: {new Date(booking.createdAt || Date.now()).toLocaleDateString('en-IN')}
              </div>
              <div className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold ${
                booking.paymentStatus === 'Paid' ? 'bg-[#D31720]/15 text-[#D31720] border border-[#D31720]/40' : 'bg-[#FEA24F]/15 text-[#B25900] border border-[#FEA24F]/40'
              }`}>
                Payment: {booking.paymentStatus} ({booking.paymentMethod})
              </div>
            </div>
          </div>

          {/* Passenger & Vehicle Details: Crisp White Insets for High Contrast */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 shadow-sm text-slate-900">
              <span className="text-[10px] font-black text-[#D31720] uppercase tracking-wider block">
                Passenger Details
              </span>
              <div className="font-black text-sm text-slate-950">{booking.customerName}</div>
              <div className="text-slate-700 flex items-center gap-1 font-semibold">
                <Phone className="w-3 h-3 text-[#D31720]" />
                {booking.customerPhone}
              </div>
              {booking.customerEmail && (
                <div className="text-slate-600 truncate">{booking.customerEmail}</div>
              )}
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 shadow-sm text-slate-900">
              <span className="text-[10px] font-black text-[#D31720] uppercase tracking-wider block">
                Fleet & Driver
              </span>
              <div className="font-black text-sm text-slate-950">{booking.vehicleModel}</div>
              <div className="text-slate-700 font-mono font-bold">TN Plate: <strong className="text-slate-950">{booking.vehicleNumber}</strong></div>
              <div className="text-slate-700 font-semibold">
                Driver: <strong className="text-[#D31720] font-bold">{booking.driverName}</strong> ({booking.driverPhone})
              </div>
            </div>
          </div>

          {/* Journey Route Box */}
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5 text-xs shadow-sm">
            <span className="text-[10px] font-black text-[#D31720] uppercase tracking-wider block">
              Trip Route ({booking.tripType} • {booking.distanceKm} KM)
            </span>
            <div className="space-y-1.5">
              <div className="flex items-start gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D31720] mt-1 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Pickup Location</span>
                  <span className="font-black text-xs text-slate-950">{booking.pickupLocation}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D31720] mt-1 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Destination</span>
                  <span className="font-black text-xs text-slate-950">{booking.dropLocation}</span>
                </div>
              </div>
            </div>
            <div className="text-[11px] text-slate-600 font-semibold pt-1.5 border-t border-slate-100 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#D31720]" />
              <span>Schedule: {new Date(booking.pickupDateTime).toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Itemized Fare Statement */}
          <div className="space-y-2 text-xs">
            <span className="text-[10px] font-black text-[#D31720] uppercase tracking-wider block">
              Fare Itemization
            </span>
            <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-950 font-black border-b border-slate-200">
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3 text-right">Amount ({currency})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  <tr>
                    <td className="py-2 px-3 text-slate-950 font-semibold">Base Tariff / Minimum Booking Charge</td>
                    <td className="py-2 px-3 text-right text-slate-950 font-black">{currency}{fare.baseFare}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-slate-950 font-semibold">Distance Running Tariff ({booking.distanceKm} km)</td>
                    <td className="py-2 px-3 text-right text-slate-950 font-black">{currency}{fare.distanceCharge}</td>
                  </tr>
                  {fare.waitingCharge > 0 && (
                    <tr>
                      <td className="py-2 px-3 text-slate-950 font-semibold">Waiting Charges</td>
                      <td className="py-2 px-3 text-right text-slate-950 font-black">{currency}{fare.waitingCharge}</td>
                    </tr>
                  )}
                  {fare.driverAllowance > 0 && (
                    <tr>
                      <td className="py-2 px-3 text-slate-950 font-semibold">Outstation Chauffeur Allowance</td>
                      <td className="py-2 px-3 text-right text-slate-950 font-black">{currency}{fare.driverAllowance}</td>
                    </tr>
                  )}
                  {fare.discount > 0 && (
                    <tr>
                      <td className="py-2 px-3 text-[#D31720] font-semibold">Promotional Discount Applied</td>
                      <td className="py-2 px-3 text-right text-[#D31720] font-black">-{currency}{fare.discount}</td>
                    </tr>
                  )}
                  <tr>
                    <td className="py-2 px-3 text-slate-600 font-semibold">Tamil Nadu GST ({settings?.gstTaxPercentage || 5}%)</td>
                    <td className="py-2 px-3 text-right text-slate-600 font-bold">{currency}{fare.tax}</td>
                  </tr>
                  <tr className="bg-gradient-to-r from-[#D31720] to-[#9B1017] font-black text-sm text-white">
                    <td className="py-3 px-3 text-white font-black">Net Payable Amount</td>
                    <td className="py-3 px-3 text-right text-white text-base font-black">{currency}{fare.totalFare}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Trip Timeline Logs */}
          {booking.timeline && booking.timeline.length > 0 && (
            <div className="space-y-1.5 text-xs pt-1">
              <span className="text-[10px] font-black text-[#D31720] uppercase tracking-wider block">
                Trip Operations Timeline
              </span>
              <div className="space-y-1.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
                {booking.timeline.map((evt, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-[11px]">
                    <span className="text-[#D31720] font-mono font-bold shrink-0">{evt.time}</span>
                    <span className="text-slate-950 font-black">• {evt.title}:</span>
                    <span className="text-slate-700 font-medium truncate">{evt.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Terms */}
          <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-600 gap-2 font-medium">
            <p className="text-center sm:text-left font-semibold">
              City Cabs & Travels 24x7 Customer Helpline: {settings?.supportPhone || '+91 44 2234 5678'}
            </p>
            <div className="font-mono font-bold text-[#D31720] uppercase tracking-wider text-[10px]">
              [ Digitally Authorized • Tamil Nadu State ]
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
