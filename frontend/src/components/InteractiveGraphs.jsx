import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Activity, 
  Car, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

export const InteractiveGraphs = ({ 
  bookings = [], 
  vehicles = [], 
  drivers = [], 
  currency = '₹' 
}) => {
  const [timeFilter, setTimeFilter] = useState('all'); // 'all', '7d', '30d'
  const [metricType, setMetricType] = useState('revenue'); // 'revenue', 'trips'
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [hoveredVehicleStatus, setHoveredVehicleStatus] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);

  // 1. Filter bookings by time frame
  const filteredBookings = useMemo(() => {
    if (timeFilter === 'all') return bookings;
    const now = new Date();
    const daysAgo = timeFilter === '7d' ? 7 : 30;
    const cutoff = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    return bookings.filter(b => {
      const dt = new Date(b.createdAt || b.pickupDateTime);
      return !isNaN(dt) && dt >= cutoff;
    });
  }, [bookings, timeFilter]);

  // 2. Timeline Aggregation (Daily Trend)
  const timelineData = useMemo(() => {
    const map = {};
    
    // Sort bookings chronologically
    const sorted = [...filteredBookings].sort((a, b) => {
      return new Date(a.pickupDateTime || a.createdAt) - new Date(b.pickupDateTime || b.createdAt);
    });

    if (sorted.length === 0) {
      // Fallback placeholder data if empty
      const today = new Date();
      return Array.from({ length: 6 }).map((_, i) => {
        const d = new Date(today);
        d.setDate(d.getDate() - (5 - i));
        return {
          dateStr: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          revenue: 0,
          trips: 0,
          avgFare: 0
        };
      });
    }

    sorted.forEach((b) => {
      const d = new Date(b.pickupDateTime || b.createdAt);
      const key = isNaN(d) 
        ? 'Oct 5' 
        : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      const fare = Number(b.fareDetails?.totalFare || 0);
      if (!map[key]) {
        map[key] = { dateStr: key, revenue: 0, trips: 0 };
      }
      map[key].trips += 1;
      if (b.bookingStatus !== 'Cancelled') {
        map[key].revenue += fare;
      }
    });

    return Object.values(map).map(item => ({
      ...item,
      avgFare: item.trips > 0 ? Math.round(item.revenue / item.trips) : 0
    }));
  }, [filteredBookings]);

  // 3. Vehicle Utilization Breakdown
  const vehicleStats = useMemo(() => {
    const available = vehicles.filter(v => v.status === 'Available').length;
    const onTrip = vehicles.filter(v => v.status === 'On Trip').length;
    const maintenance = vehicles.filter(v => v.status === 'Maintenance').length;
    const total = vehicles.length || 1;

    return [
      { 
        label: 'Available', 
        count: available, 
        percentage: Math.round((available / total) * 100),
        color: '#D31720', // 04 Teal Green
        bgClass: 'bg-[#D31720]' 
      },
      { 
        label: 'On Trip', 
        count: onTrip, 
        percentage: Math.round((onTrip / total) * 100),
        color: '#FEA24F', // 02 Sunset Orange
        bgClass: 'bg-[#FEA24F]' 
      },
      { 
        label: 'Maintenance', 
        count: maintenance, 
        percentage: Math.round((maintenance / total) * 100),
        color: '#D31720', // 01 Crimson Red
        bgClass: 'bg-[#D31720]' 
      }
    ];
  }, [vehicles]);

  // 4. Trip Status Distribution
  const tripStatusStats = useMemo(() => {
    const counts = {
      'In Progress': 0,
      'Confirmed': 0,
      'Completed': 0,
      'Pending': 0,
      'Cancelled': 0
    };
    filteredBookings.forEach(b => {
      const status = b.bookingStatus || 'Pending';
      if (counts[status] !== undefined) {
        counts[status] += 1;
      } else {
        counts['Pending'] += 1;
      }
    });

    const total = filteredBookings.length || 1;
    return [
      { status: 'Completed', count: counts['Completed'], color: '#D31720', pct: Math.round((counts['Completed'] / total) * 100) }, // 04 Teal
      { status: 'In Progress', count: counts['In Progress'], color: '#FEA24F', pct: Math.round((counts['In Progress'] / total) * 100) }, // 02 Orange
      { status: 'Confirmed', count: counts['Confirmed'], color: '#D31720', pct: Math.round((counts['Confirmed'] / total) * 100) }, // 03 Aqua
      { status: 'Pending', count: counts['Pending'], color: '#051A2D', pct: Math.round((counts['Pending'] / total) * 100) }, // 05 Navy
      { status: 'Cancelled', count: counts['Cancelled'], color: '#D31720', pct: Math.round((counts['Cancelled'] / total) * 100) } // 01 Crimson
    ];
  }, [filteredBookings]);

  // 5. Popular Travel Routes
  const topRoutes = useMemo(() => {
    const routeMap = {};
    filteredBookings.forEach(b => {
      const key = `${b.pickupLocation || 'Origin'} → ${b.dropLocation || 'Destination'}`;
      if (!routeMap[key]) {
        routeMap[key] = {
          name: key,
          pickup: b.pickupLocation || 'Origin',
          drop: b.dropLocation || 'Destination',
          trips: 0,
          revenue: 0
        };
      }
      routeMap[key].trips += 1;
      routeMap[key].revenue += Number(b.fareDetails?.totalFare || 0);
    });

    return Object.values(routeMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [filteredBookings]);

  // SVG Chart Dimensions & Math
  const chartWidth = 650;
  const chartHeight = 220;
  const paddingX = 40;
  const paddingY = 25;

  const maxVal = useMemo(() => {
    const vals = timelineData.map(d => metricType === 'revenue' ? d.revenue : d.trips);
    const m = Math.max(...vals, 1);
    return metricType === 'revenue' ? Math.ceil(m * 1.15) : Math.max(m + 1, 4);
  }, [timelineData, metricType]);

  const points = useMemo(() => {
    if (timelineData.length === 0) return [];
    const count = timelineData.length;
    const stepX = (chartWidth - paddingX * 2) / Math.max(count - 1, 1);

    return timelineData.map((d, index) => {
      const val = metricType === 'revenue' ? d.revenue : d.trips;
      const x = paddingX + index * stepX;
      const y = chartHeight - paddingY - (val / maxVal) * (chartHeight - paddingY * 2);
      return { x, y, data: d, value: val };
    });
  }, [timelineData, maxVal, metricType]);

  // SVG Area and Line paths
  const linePath = useMemo(() => {
    if (points.length === 0) return '';
    return points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`, '');
  }, [points]);

  const areaPath = useMemo(() => {
    if (points.length === 0) return '';
    const firstX = points[0].x;
    const lastX = points[points.length - 1].x;
    const bottomY = chartHeight - paddingY;
    return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  }, [linePath, points]);

  // Donut SVG circumference calculation
  const radius = 60;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="space-y-6">
      {/* Interactive Controls Bar with Analytics Theme Banner */}
      <div className="p-4 sm:p-5 rounded-2xl theme-banner-analytics shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-page-enter">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D31720] animate-ping shrink-0" />
            <h3 className="text-base sm:text-lg font-black bg-gradient-to-r from-[#D31720] via-red-600 to-[#9B1017] bg-clip-text text-transparent flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#D31720] shrink-0" />
              <span>Operations & Performance Intelligence</span>
            </h3>
          </div>
          <p className="text-xs text-slate-600 font-medium italic mt-0.5">
            Real-time interactive metrics across active bookings, fleet utilization & tariffs
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Metric Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold flex-1 xs:flex-initial justify-center">
            <button
              onClick={() => setMetricType('revenue')}
              className={`flex-1 xs:flex-initial px-3 py-1.5 rounded-lg transition-all text-center ${
                metricType === 'revenue'
                  ? 'bg-gradient-to-r from-[#D31720] to-[#00C4D0] text-white font-black shadow-sm'
                  : 'text-slate-700 hover:text-slate-950 font-bold'
              }`}
            >
              Revenue ({currency})
            </button>
            <button
              onClick={() => setMetricType('trips')}
              className={`flex-1 xs:flex-initial px-3 py-1.5 rounded-lg transition-all text-center ${
                metricType === 'trips'
                  ? 'bg-gradient-to-r from-[#D31720] to-[#00C4D0] text-white font-black shadow-sm'
                  : 'text-slate-700 hover:text-slate-950 font-bold'
              }`}
            >
              Trip Volume
            </button>
          </div>

          {/* Timeframe Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold flex-1 xs:flex-initial justify-center">
            {[
              { id: 'all', label: 'All Time' },
              { id: '30d', label: '30 Days' },
              { id: '7d', label: '7 Days' }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTimeFilter(t.id)}
                className={`flex-1 xs:flex-initial px-2.5 sm:px-3 py-1.5 rounded-lg transition-all text-center ${
                  timeFilter === t.id
                    ? 'bg-gradient-to-r from-[#051A2D] to-[#0B3356] text-white font-black shadow-sm'
                    : 'text-slate-700 hover:text-slate-950 font-bold'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Timeline Trend Graph + Vehicle Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Interactive Trend Graph (Span 2) */}
        <div className="lg:col-span-2 p-5 rounded-2xl glass-panel border border-red-200/80 shadow-sm flex flex-col justify-between relative overflow-hidden text-slate-950">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div className="min-w-0">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#D31720] block">
                {metricType === 'revenue' ? 'Revenue Trajectory' : 'Daily Booking Volume'}
              </span>
              <h4 className="text-lg sm:text-2xl font-black text-slate-950 flex items-center gap-1.5 mt-0.5 flex-wrap">
                <span>
                  {metricType === 'revenue' ? (
                    <>
                      {currency}
                      {filteredBookings
                        .filter(b => b.bookingStatus !== 'Cancelled')
                        .reduce((sum, b) => sum + Number(b.fareDetails?.totalFare || 0), 0)
                        .toLocaleString('en-IN')}
                    </>
                  ) : (
                    <>{filteredBookings.length} Total Bookings</>
                  )}
                </span>
                <span className="text-[11px] text-emerald-900 font-black bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full inline-flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3 stroke-[3]" /> Live Synced
                </span>
              </h4>
            </div>

            <div className="text-left sm:text-right text-[11px] text-slate-500 font-bold shrink-0">
              <span>Tap points to inspect</span>
            </div>
          </div>

          {/* SVG Area Chart */}
          <div className="relative mt-4 w-full overflow-hidden">
            <svg 
              viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
              className="w-full h-48 sm:h-56 overflow-visible select-none"
            >
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D31720" stopOpacity="0.4" />
                  <stop offset="60%" stopColor="#D31720" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#D31720" />
                  <stop offset="100%" stopColor="#D31720" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                const y = chartHeight - paddingY - ratio * (chartHeight - paddingY * 2);
                const labelVal = Math.round(ratio * maxVal);
                return (
                  <g key={i}>
                    <line 
                      x1={paddingX} 
                      y1={y} 
                      x2={chartWidth - paddingX} 
                      y2={y} 
                      stroke="#e2e8f0" 
                      strokeDasharray="4 4" 
                    />
                    <text 
                      x={paddingX - 8} 
                      y={y + 3} 
                      textAnchor="end" 
                      fontSize="9" 
                      fontWeight="700" 
                      fill="#475569" 
                    >
                      {metricType === 'revenue' ? `${currency}${labelVal}` : labelVal}
                    </text>
                  </g>
                );
              })}

              {/* Area fill */}
              {areaPath && (
                <path d={areaPath} fill="url(#areaGrad)" />
              )}

              {/* Line path */}
              {linePath && (
                <path 
                  d={linePath} 
                  fill="none" 
                  stroke="url(#lineGrad)" 
                  strokeWidth="3.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
              )}

              {/* Data points */}
              {points.map((p, idx) => (
                <g key={idx} className="cursor-pointer group">
                  <circle 
                    cx={p.x} 
                    cy={p.y} 
                    r={hoveredPoint?.index === idx ? 7 : 4.5} 
                    fill="#ffffff" 
                    stroke="#059669" 
                    strokeWidth={hoveredPoint?.index === idx ? "3.5" : "2.5"}
                    className="transition-all duration-200"
                  />
                  {/* Invisible hit-target for comfortable hover on mobile and desktop */}
                  <circle 
                    cx={p.x} 
                    cy={p.y} 
                    r="18" 
                    fill="transparent" 
                    onMouseEnter={() => setHoveredPoint({ ...p, index: idx })}
                    onMouseLeave={() => setHoveredPoint(null)}
                    onTouchStart={() => setHoveredPoint({ ...p, index: idx })}
                  />
                  {/* X Axis Date labels in Bold Black */}
                  <text 
                    x={p.x} 
                    y={chartHeight - 6} 
                    textAnchor="middle" 
                    fontSize="10" 
                    fontWeight="800" 
                    fill="#0f172a" 
                    opacity={hoveredPoint?.index === idx ? "1" : "0.85"}
                  >
                    {p.data.dateStr}
                  </text>
                </g>
              ))}
            </svg>

            {/* Interactive Floating Tooltip */}
            {hoveredPoint && (
              <div 
                className="absolute z-20 pointer-events-none p-2.5 sm:p-3 rounded-xl bg-white/98 border border-emerald-400 text-slate-950 text-xs shadow-2xl backdrop-blur-md transition-all duration-150 animate-in fade-in max-w-[190px] sm:max-w-[220px]"
                style={{
                  left: `${Math.min(82, Math.max(18, (hoveredPoint.x / chartWidth) * 100))}%`,
                  top: `${Math.max(18, Math.min(80, (hoveredPoint.y / chartHeight) * 100 - 40))}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className="font-black text-[#D31720] text-[11px] mb-1">
                  {hoveredPoint.data.dateStr}
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-600 font-semibold">Revenue:</span>
                    <strong className="text-slate-950 font-black">{currency}{hoveredPoint.data.revenue.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-600 font-semibold">Trips:</span>
                    <strong className="text-slate-950 font-black">{hoveredPoint.data.trips} rides</strong>
                  </div>
                  <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-1 mt-1 text-[10px]">
                    <span className="text-slate-500 font-medium">Avg / Trip:</span>
                    <span className="text-slate-900 font-bold">{currency}{hoveredPoint.data.avgFare}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Fleet Utilization Interactive Donut */}
        <div className="p-5 rounded-2xl glass-panel border border-red-200/80 shadow-sm flex flex-col justify-between text-slate-950">
          <div className="pb-3 border-b border-slate-100">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#D31720]">
              Fleet Capacity & State
            </span>
            <h4 className="text-lg font-black text-slate-950 flex items-center gap-1.5 mt-0.5">
              <Car className="w-4 h-4 text-[#D31720]" />
              {vehicles.length} Total Registered Cabs
            </h4>
          </div>

          {/* Donut representation */}
          <div className="py-4 flex flex-col items-center justify-center relative">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                {/* Background Ring */}
                <circle 
                  cx="80" 
                  cy="80" 
                  r={radius} 
                  fill="none" 
                  stroke="#e2e8f0" 
                  strokeWidth="20" 
                />

                {/* Slices */}
                {(() => {
                  let accumulatedOffset = 0;
                  return vehicleStats.map((s, idx) => {
                    const strokeDasharray = `${(s.percentage / 100) * circumference} ${circumference}`;
                    const strokeDashoffset = -accumulatedOffset;
                    accumulatedOffset += (s.percentage / 100) * circumference;

                    const isHovered = hoveredVehicleStatus === s.label;

                    return (
                      <circle
                        key={idx}
                        cx="80"
                        cy="80"
                        r={radius}
                        fill="none"
                        stroke={s.color}
                        strokeWidth={isHovered ? "24" : "20"}
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="cursor-pointer transition-all duration-300"
                        onMouseEnter={() => setHoveredVehicleStatus(s.label)}
                        onMouseLeave={() => setHoveredVehicleStatus(null)}
                      />
                    );
                  });
                })()}
              </svg>

              {/* Center Metrics Pill */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-2xl font-black text-slate-950">
                  {hoveredVehicleStatus
                    ? vehicleStats.find(s => s.label === hoveredVehicleStatus)?.count
                    : `${vehicleStats.find(s => s.label === 'Available')?.percentage || 0}%`}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-600 tracking-wider">
                  {hoveredVehicleStatus || 'Available'}
                </span>
              </div>
            </div>

            {/* Legend & Count Badges */}
            <div className="w-full space-y-2 mt-3 pt-3 border-t border-slate-100">
              {vehicleStats.map((s, idx) => (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredVehicleStatus(s.label)}
                  onMouseLeave={() => setHoveredVehicleStatus(null)}
                  className={`flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer transition-all ${
                    hoveredVehicleStatus === s.label
                      ? 'bg-red-50 text-slate-950 border border-emerald-400 shadow-sm font-black'
                      : 'bg-slate-50 hover:bg-red-50/60 text-slate-950 border border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-2.5 h-2.5 rounded-full" 
                      style={{ backgroundColor: s.color }} 
                    />
                    <span className="font-bold text-slate-950">{s.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-slate-950">{s.count} cabs</span>
                    <span className="text-[11px] text-slate-600 font-semibold">({s.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Row: Trip Pipeline Funnel + Top Performing Routes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Trip Status Pipeline */}
        <div className="p-5 rounded-2xl glass-panel border border-red-200/80 shadow-sm space-y-4 text-slate-950">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#D31720]">
                Operational Pipeline
              </span>
              <h4 className="text-base sm:text-lg font-black text-slate-950 flex items-center gap-2 mt-0.5">
                <Clock className="w-4 h-4 text-[#D31720]" />
                Trip Status Funnel
              </h4>
            </div>
            <span className="text-xs font-black text-slate-700">
              {filteredBookings.length} Total Trips
            </span>
          </div>

          <div className="space-y-3">
            {tripStatusStats.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-2.5 h-2.5 rounded-full" 
                      style={{ backgroundColor: item.color }} 
                    />
                    <strong className="text-slate-950 font-black">{item.status}</strong>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <span className="font-black text-slate-950">{item.count} rides</span>
                    <span className="text-[11px] font-bold">({item.pct}%)</span>
                  </div>
                </div>

                {/* Horizontal Progress Bar */}
                <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200">
                  <div 
                    className="h-full rounded-full transition-all duration-500" 
                    style={{ 
                      width: `${Math.max(item.pct, item.count > 0 ? 4 : 0)}%`,
                      backgroundColor: item.color 
                    }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Corridors & High-Revenue Routes */}
        <div className="p-5 rounded-2xl glass-panel border border-red-200/80 shadow-sm space-y-4 text-slate-950">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#D31720]">
                Top Corridors
              </span>
              <h4 className="text-base sm:text-lg font-black text-slate-950 flex items-center gap-2 mt-0.5">
                <MapPin className="w-4 h-4 text-[#D31720]" />
                Popular Routes & Revenue
              </h4>
            </div>
            <span className="text-xs font-black text-emerald-900 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
              Highest Yield
            </span>
          </div>

          <div className="space-y-2.5">
            {topRoutes.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500 font-semibold">
                No route data logged yet. Create bookings to see route analytics.
              </div>
            ) : (
              topRoutes.map((r, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedRoute(selectedRoute === r.name ? null : r.name)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedRoute === r.name
                      ? 'bg-red-50 text-slate-950 border-emerald-400 shadow-md font-bold'
                      : 'bg-white hover:bg-red-50/50 border-slate-200 text-slate-950 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2.5 text-xs">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="w-5 h-5 rounded-lg bg-emerald-100 text-[#D31720] flex items-center justify-center font-mono font-black text-[10px] shrink-0 border border-emerald-300">
                        #{idx + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <strong className="font-black truncate block text-slate-950 text-xs">
                          {r.pickup}
                        </strong>
                        <span className="text-[11px] font-semibold text-slate-600 truncate block">
                          → {r.drop}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-black text-xs sm:text-sm block text-slate-950">
                        {currency}{r.revenue.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-600 font-semibold block">
                        {r.trips} {r.trips === 1 ? 'ride' : 'rides'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
