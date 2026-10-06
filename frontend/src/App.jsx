import React, { useState, useEffect, useCallback } from 'react';
import { api } from './api/apiClient';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { VehicleManagement } from './components/VehicleManagement';
import { DriverManagement } from './components/DriverManagement';
import { CustomerManagement } from './components/CustomerManagement';
import { BookingManagement } from './components/BookingManagement';
import { DriverPortal } from './components/DriverPortal';
import { SettingsModal } from './components/SettingsModal';
import { InvoiceModal } from './components/InvoiceModal';
import { LoginModal } from './components/LoginModal';
import { LoginPage } from './components/LoginPage';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { PAGE_THEMES } from './theme';

export default function App() {
  // Current active user & role (Tamil Nadu Personas)
  // Initially null so opening the page starts on Login screen
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        const stored = window.sessionStorage.getItem('city_cabs_session_user');
        return stored ? JSON.parse(stored) : null;
      }
    } catch (e) {
      console.warn('Failed to load session user', e);
    }
    return null;
  });

  const [currentTab, setCurrentTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Security Login Modal State
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginTargetRole, setLoginTargetRole] = useState('ADMIN');

  // Core Data
  const [stats, setStats] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [settings, setSettings] = useState(null);

  // Modals
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState('drv-1');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('All');

  const handleNavigate = (tab, filter) => {
    setCurrentTab(tab);
    if (tab === 'bookings' && filter) {
      setBookingStatusFilter(filter);
    } else if (tab === 'bookings') {
      setBookingStatusFilter('All');
    }
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch all data from backend
  const loadAllData = useCallback(async () => {
    try {
      const [statsData, vehData, drvData, custData, bkData, settsData] = await Promise.all([
        api.getDashboardStats().catch(() => null),
        api.getVehicles().catch(() => []),
        api.getDrivers().catch(() => []),
        api.getCustomers().catch(() => []),
        api.getBookings().catch(() => []),
        api.getSettings().catch(() => null)
      ]);

      if (statsData) setStats(statsData);
      if (vehData) setVehicles(vehData);
      if (drvData) setDrivers(drvData);
      if (custData) setCustomers(custData);
      if (bkData) setBookings(bkData);
      if (settsData) setSettings(settsData);
    } catch (err) {
      console.error("Error loading operational data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Handle Login Authentication Success
  const handleLoginSuccess = (authenticatedUser) => {
    setCurrentUser(authenticatedUser);
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.setItem('city_cabs_session_user', JSON.stringify(authenticatedUser));
      }
    } catch (e) {
      console.warn('Failed to save session user', e);
    }

    if (authenticatedUser.role === 'DRIVER') {
      setCurrentTab('driver-portal');
    } else if (currentTab === 'driver-portal' && authenticatedUser.role !== 'DRIVER') {
      setCurrentTab('dashboard');
    }

    showToast(`Access granted: Signed in as ${authenticatedUser.name} (${authenticatedUser.role})`);
  };

  // Handle Logout (Returns directly to the Login page)
  const handleLogout = () => {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.removeItem('city_cabs_session_user');
      }
    } catch (e) {
      console.warn('Failed to clear session', e);
    }
    setCurrentUser(null);
    showToast('Signed out successfully.');
  };

  // Vehicle Actions
  const handleAddVehicle = async (vehData) => {
    try {
      const newV = await api.createVehicle(vehData);
      setVehicles(prev => [newV, ...prev]);
      showToast(`Vehicle ${newV.registrationNumber} added to fleet!`);
      loadAllData();
    } catch (err) {
      showToast(err.message || 'Failed to add vehicle', 'error');
    }
  };

  const handleUpdateVehicle = async (id, vehData) => {
    try {
      const updated = await api.updateVehicle(id, vehData);
      setVehicles(prev => prev.map(v => v.id === id ? updated : v));
      showToast(`Vehicle details updated!`);
      loadAllData();
    } catch (err) {
      showToast(err.message || 'Failed to update vehicle', 'error');
    }
  };

  const handleDeleteVehicle = async (id) => {
    try {
      await api.deleteVehicle(id);
      setVehicles(prev => prev.filter(v => v.id !== id));
      showToast(`Vehicle removed from fleet.`);
      loadAllData();
    } catch (err) {
      showToast(err.message || 'Failed to delete vehicle', 'error');
    }
  };

  // Driver Actions
  const handleAddDriver = async (drvData) => {
    try {
      const newD = await api.createDriver(drvData);
      setDrivers(prev => [newD, ...prev]);
      showToast(`Captain ${newD.name} onboarded!`);
      loadAllData();
    } catch (err) {
      showToast(err.message || 'Failed to onboard captain', 'error');
    }
  };

  const handleUpdateDriver = async (id, drvData) => {
    try {
      const updated = await api.updateDriver(id, drvData);
      setDrivers(prev => prev.map(d => d.id === id ? updated : d));
      showToast(`Driver profile updated!`);
      loadAllData();
    } catch (err) {
      showToast(err.message || 'Failed to update driver', 'error');
    }
  };

  const handleDeleteDriver = async (id) => {
    try {
      await api.deleteDriver(id);
      setDrivers(prev => prev.filter(d => d.id !== id));
      showToast(`Driver removed from roster.`);
      loadAllData();
    } catch (err) {
      showToast(err.message || 'Failed to remove driver', 'error');
    }
  };

  // Customer Actions
  const handleAddCustomer = async (custData) => {
    try {
      const newC = await api.createCustomer(custData);
      setCustomers(prev => [newC, ...prev]);
      showToast(`Customer ${newC.name} registered!`);
      loadAllData();
    } catch (err) {
      showToast(err.message || 'Failed to add customer', 'error');
    }
  };

  const handleUpdateCustomer = async (id, custData) => {
    try {
      const updated = await api.updateCustomer(id, custData);
      setCustomers(prev => prev.map(c => c.id === id ? updated : c));
      showToast(`Customer profile updated!`);
      loadAllData();
    } catch (err) {
      showToast(err.message || 'Failed to update customer', 'error');
    }
  };

  const handleDeleteCustomer = async (id) => {
    try {
      await api.deleteCustomer(id);
      setCustomers(prev => prev.filter(c => c.id !== id));
      showToast(`Customer removed.`);
      loadAllData();
    } catch (err) {
      showToast(err.message || 'Failed to delete customer', 'error');
    }
  };

  // Booking Actions
  const handleAddBooking = async (bookingData) => {
    try {
      const newB = await api.createBooking(bookingData);
      setBookings(prev => [newB, ...prev]);
      if (newB.driverId) {
        setSelectedDriverId(newB.driverId);
      }
      setIsNewBookingModalOpen(false);
      showToast(`Trip ${newB.id} scheduled for ${newB.customerName}! Fleet & Captain marked On Trip.`);
      await loadAllData();
    } catch (err) {
      showToast(err.message || 'Failed to create booking', 'error');
    }
  };

  const handleUpdateBooking = async (id, bookingData) => {
    try {
      const updated = await api.updateBooking(id, bookingData);
      setBookings(prev => prev.map(b => b.id === id ? updated : b));
      if (updated.driverId) {
        setSelectedDriverId(updated.driverId);
      }
      showToast(`Booking ${id} updated.`);
      await loadAllData();
    } catch (err) {
      showToast(err.message || 'Failed to update booking', 'error');
    }
  };

  const handleStatusChange = async (id, newStatus, paymentStatus) => {
    try {
      const updated = await api.updateBookingStatus(id, { 
        status: newStatus,
        paymentStatus
      });
      setBookings(prev => prev.map(b => b.id === id ? updated : b));
      showToast(`Trip ${id} marked as ${newStatus}`);
      await loadAllData();
    } catch (err) {
      showToast(err.message || 'Status transition failed', 'error');
    }
  };

  const handleDeleteBooking = async (id) => {
    try {
      await api.deleteBooking(id);
      setBookings(prev => prev.filter(b => b.id !== id));
      showToast(`Booking record ${id} removed.`);
      await loadAllData();
    } catch (err) {
      showToast(err.message || 'Failed to delete booking', 'error');
    }
  };

  // Settings Action
  const handleUpdateSettings = async (newSettings) => {
    try {
      const updated = await api.updateSettings(newSettings);
      setSettings(updated);
      showToast('System configuration saved!');
      loadAllData();
    } catch (err) {
      showToast(err.message || 'Failed to update settings', 'error');
    }
  };

  // Tab Titles
  const getTabTitle = () => {
    switch (currentTab) {
      case 'dashboard':
        return { title: 'Fleet Overview', subtitle: 'Live Operations & Active Rides' };
      case 'bookings':
        return { title: 'Trips & Bookings', subtitle: 'Route Dispatch & Passenger Bookings' };
      case 'vehicles':
        return { title: 'Fleet Inventory', subtitle: 'Registered Cabs, Tariffs & Maintenance' };
      case 'drivers':
        return { title: 'Captains Roster', subtitle: 'Captains Duty Status & Passenger Ratings' };
      case 'customers':
        return { title: 'Customer Directory', subtitle: 'Passenger Profiles & Lifetime Journeys' };
      case 'driver-portal':
        return { title: 'Captain Duty Desk', subtitle: 'Active Ride, Passenger Contact & Fare Collection' };
      case 'settings':
        return { title: 'System Administration', subtitle: 'Tariff Engine, GST & Permissions Matrix' };
      default:
        return { title: 'Operations Control', subtitle: 'City Cabs & Travels' };
    }
  };

  // Gatekeeper: Show Login page on initial open if not authenticated
  if (!currentUser) {
    return (
      <>
        <LoginPage onLoginSuccess={handleLoginSuccess} />
        {toast && (
          <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-white/95 backdrop-blur-xl border border-[#D31720]/30 text-slate-900 text-xs font-bold shadow-xl animate-in fade-in slide-in-from-bottom-3 duration-200">
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-[#D31720] shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        )}
      </>
    );
  }

  const { title, subtitle } = getTabTitle();
  const activeTheme = PAGE_THEMES[currentTab] || PAGE_THEMES.dashboard;

  return (
    <div className={`min-h-screen ${activeTheme.bodyBg} text-slate-950 flex selection:bg-[#D31720] selection:text-white font-sans w-full max-w-full overflow-x-hidden relative transition-colors duration-500`}>
      {/* Dynamic Ambient Glossy Lighting Effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {activeTheme.orbs.map((orbClass, idx) => (
          <div 
            key={`${activeTheme.id}-orb-${idx}`} 
            className={`absolute rounded-full blur-3xl opacity-75 transition-all duration-700 pointer-events-none ${orbClass}`} 
          />
        ))}
        {/* Subtle specular glass highlight shimmer on top */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/[0.02] pointer-events-none" />
      </div>

      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentUser={currentUser}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        stats={stats}
        theme={activeTheme}
        onOpenLoginModal={(role) => {
          if (role) setLoginTargetRole(role);
          setIsLoginModalOpen(true);
        }}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 w-full lg:pl-64 transition-all overflow-x-hidden relative z-10">
        {/* Top Header */}
        <Header
          currentUser={currentUser}
          onLogout={handleLogout}
          onOpenLoginModal={(role) => {
            if (role) setLoginTargetRole(role);
            setIsLoginModalOpen(true);
          }}
          onNewBookingClick={() => {
            setCurrentTab('bookings');
            setIsNewBookingModalOpen(true);
          }}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          pageTitle={title}
          pageSubtitle={subtitle}
          currentTab={currentTab}
          theme={activeTheme}
        />

        {/* Page Body */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto min-w-0">
          {loading && !stats ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-600">
              <Loader2 className="w-8 h-8 animate-spin text-[#D31720] mb-3" />
              <p className="text-sm font-semibold">Loading fleet operations data...</p>
            </div>
          ) : (
            <>
              {currentTab === 'dashboard' && (
                <Dashboard
                  stats={stats}
                  bookings={bookings}
                  vehicles={vehicles}
                  drivers={drivers}
                  currency={settings?.currency || '₹'}
                  onNavigate={handleNavigate}
                  onNewBookingClick={() => {
                    setCurrentTab('bookings');
                    setIsNewBookingModalOpen(true);
                  }}
                  onViewInvoice={setSelectedInvoice}
                  onQuickStatusChange={handleStatusChange}
                />
              )}

              {currentTab === 'bookings' && (
                <BookingManagement
                  bookings={bookings}
                  vehicles={vehicles}
                  drivers={drivers}
                  customers={customers}
                  settings={settings}
                  onAddBooking={handleAddBooking}
                  onUpdateBooking={handleUpdateBooking}
                  onStatusChange={handleStatusChange}
                  onDeleteBooking={handleDeleteBooking}
                  onViewInvoice={setSelectedInvoice}
                  currency={settings?.currency || '₹'}
                  initialOpenModal={isNewBookingModalOpen}
                  initialStatusFilter={bookingStatusFilter}
                />
              )}

              {currentTab === 'vehicles' && (
                <VehicleManagement
                  vehicles={vehicles}
                  onAddVehicle={handleAddVehicle}
                  onUpdateVehicle={handleUpdateVehicle}
                  onDeleteVehicle={handleDeleteVehicle}
                  currency={settings?.currency || '₹'}
                />
              )}

              {currentTab === 'drivers' && (
                <DriverManagement
                  drivers={drivers}
                  vehicles={vehicles}
                  onAddDriver={handleAddDriver}
                  onUpdateDriver={handleUpdateDriver}
                  onDeleteDriver={handleDeleteDriver}
                />
              )}

              {currentTab === 'customers' && (
                <CustomerManagement
                  customers={customers}
                  bookings={bookings}
                  onAddCustomer={handleAddCustomer}
                  onUpdateCustomer={handleUpdateCustomer}
                  onDeleteCustomer={handleDeleteCustomer}
                  onViewInvoice={setSelectedInvoice}
                  currency={settings?.currency || '₹'}
                />
              )}

              {currentTab === 'driver-portal' && (
                <DriverPortal
                  currentUser={currentUser}
                  bookings={bookings}
                  drivers={drivers}
                  vehicles={vehicles}
                  selectedDriverId={selectedDriverId}
                  onSelectDriver={setSelectedDriverId}
                  onStatusChange={handleStatusChange}
                  onToggleDuty={(driverId, newStatus) => handleUpdateDriver(driverId, { status: newStatus })}
                  onViewInvoice={setSelectedInvoice}
                  currency={settings?.currency || '₹'}
                />
              )}

              {currentTab === 'settings' && (
                <SettingsModal
                  settings={settings}
                  onUpdateSettings={handleUpdateSettings}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-white/95 backdrop-blur-xl border border-[#D31720]/30 text-slate-900 text-xs font-bold shadow-xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-[#D31720] shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Printable Invoice Modal */}
      {selectedInvoice && (
        <InvoiceModal
          booking={selectedInvoice}
          settings={settings}
          onClose={() => setSelectedInvoice(null)}
        />
      )}

      {/* New Booking quick modal from header */}
      {isNewBookingModalOpen && currentTab !== 'bookings' && (
        <BookingManagement
          bookings={bookings}
          vehicles={vehicles}
          drivers={drivers}
          customers={customers}
          settings={settings}
          onAddBooking={(b) => {
            handleAddBooking(b);
            setIsNewBookingModalOpen(false);
          }}
          onUpdateBooking={handleUpdateBooking}
          onStatusChange={handleStatusChange}
          onDeleteBooking={handleDeleteBooking}
          onViewInvoice={setSelectedInvoice}
          currency={settings?.currency || '₹'}
          initialOpenModal={true}
        />
      )}
      {/* Security Login Modal (Password required, no hint/reveal) */}
      <LoginModal
        isOpen={isLoginModalOpen}
        initialRole={loginTargetRole}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
