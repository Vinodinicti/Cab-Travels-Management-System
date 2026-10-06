// Client-Side Self-Contained Local Storage API Service for City Cabs & Travels
// Designed for seamless Vercel / static frontend deployment with zero backend dependency.

import { initialData } from '../data/initialData';

const STORAGE_KEY = 'city_cabs_db_v1';

// Safe helper to deep clone data
function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// In-memory fallback if localStorage is restricted
let memoryDb = null;

// Retrieve database from localStorage or fallback
function getDb() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.vehicles && parsed.bookings && parsed.drivers) {
          return parsed;
        }
      }
      // Initialize with seed data
      const seed = clone(initialData);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
  } catch (err) {
    console.warn('localStorage access failed, falling back to memory store:', err);
  }

  if (!memoryDb) {
    memoryDb = clone(initialData);
  }
  return memoryDb;
}

// Persist database to localStorage
function saveDb(db) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    }
  } catch (err) {
    console.warn('Failed to save to localStorage:', err);
  }
  memoryDb = db;
}

// Helper: Synchronize vehicle and driver statuses when booking status transitions
function syncFleetStatus(db, booking, newStatus) {
  if (!booking) return;
  const vehicle = db.vehicles.find(v => v.id === booking.vehicleId);
  const driver = db.drivers.find(d => d.id === booking.driverId);

  if (newStatus === "In Progress" || newStatus === "Confirmed") {
    if (vehicle && vehicle.status !== "Maintenance") {
      vehicle.status = "On Trip";
    }
    if (driver && driver.status !== "Off Duty") {
      driver.status = "On Trip";
      if (vehicle) {
        driver.assignedVehicleId = vehicle.id;
        driver.assignedVehicleName = `${vehicle.model} (${vehicle.registrationNumber})`;
      }
    }
  } else if (newStatus === "Completed" || newStatus === "Cancelled") {
    // Check if vehicle has any other active trips (In Progress or Confirmed)
    const hasOtherVehicleTrip = (db.bookings || []).some(
      b => b.id !== booking.id && b.vehicleId === booking.vehicleId && (b.bookingStatus === "In Progress" || b.bookingStatus === "Confirmed")
    );
    if (!hasOtherVehicleTrip && vehicle && vehicle.status === "On Trip") {
      vehicle.status = "Available";
    }

    // Check if driver has any other active trips (In Progress or Confirmed)
    const hasOtherDriverTrip = (db.bookings || []).some(
      b => b.id !== booking.id && b.driverId === booking.driverId && (b.bookingStatus === "In Progress" || b.bookingStatus === "Confirmed")
    );
    if (!hasOtherDriverTrip && driver && driver.status === "On Trip") {
      driver.status = "Available";
    }

    if (newStatus === "Completed") {
      if (driver) driver.totalTrips = (driver.totalTrips || 0) + 1;
      const customer = db.customers.find(c => c.id === booking.customerId);
      if (customer) {
        customer.totalBookings = (customer.totalBookings || 0) + 1;
        customer.totalSpent = (customer.totalSpent || 0) + (booking.fareDetails?.totalFare || 0);
      }
    }
  }
}

// Helper: Calculate trip fare based on distance, vehicle tariffs and rules
function calculateFare(db, distanceKm, vehicle, tripType = "One-Way", waitingCharge = 0, discount = 0) {
  const km = Number(distanceKm) || 10;
  const base = vehicle ? Number(vehicle.baseFare) : db.settings.baseFare;
  const perKm = vehicle ? Number(vehicle.perKmRate) : db.settings.ratePerKm;

  let multiplier = 1;
  if (tripType === "Round-Trip") multiplier = 1.8;
  if (tripType === "Outstation") multiplier = 1.2;

  const distanceCharge = Math.round(km * perKm * multiplier);
  const driverAllowance = tripType === "Outstation" ? 500 : (tripType === "Round-Trip" ? 200 : 0);
  const subtotal = base + distanceCharge + Number(waitingCharge) + driverAllowance - Number(discount);
  const tax = Math.round((Math.max(0, subtotal) * (db.settings.gstTaxPercentage || 5)) / 100);
  const totalFare = Math.max(0, subtotal + tax);

  return {
    baseFare: base,
    distanceCharge,
    waitingCharge: Number(waitingCharge) || 0,
    driverAllowance,
    discount: Number(discount) || 0,
    tax,
    totalFare
  };
}

// Simulated microscopic delay for ultra-smooth UI transitions
const asyncResolve = (data) => new Promise(resolve => setTimeout(() => resolve(clone(data)), 30));

export const api = {
  // ----------------- AUTHENTICATION -----------------
  login: async ({ role, username, password }) => {
    const db = getDb();
    let user;

    if (role) {
      user = db.users.find(u => u.role.toUpperCase() === role.toUpperCase());
    } else if (username) {
      user = db.users.find(u => u.username.toLowerCase() === username.toLowerCase());
    }

    if (!user) {
      throw new Error("Invalid credentials. User not found.");
    }

    if (!password || user.password !== password) {
      throw new Error("Incorrect password.");
    }

    const { password: _pwd, ...safeUser } = user;
    return asyncResolve({
      token: `token-${user.id}-${Date.now()}`,
      user: safeUser
    });
  },

  getUsers: async () => {
    const db = getDb();
    const safeUsers = db.users.map(({ password: _pwd, ...u }) => u);
    return asyncResolve(safeUsers);
  },

  // ----------------- DASHBOARD / STATS -----------------
  getDashboardStats: async () => {
    const db = getDb();
    const totalBookings = db.bookings.length;
    const activeTrips = db.bookings.filter(b => b.bookingStatus === "In Progress").length;
    const confirmedTrips = db.bookings.filter(b => b.bookingStatus === "Confirmed").length;
    const pendingRequests = db.bookings.filter(b => b.bookingStatus === "Pending").length;
    const completedTrips = db.bookings.filter(b => b.bookingStatus === "Completed").length;
    const cancelledTrips = db.bookings.filter(b => b.bookingStatus === "Cancelled").length;

    const totalRevenue = db.bookings
      .filter(b => b.bookingStatus === "Completed" || b.paymentStatus === "Paid")
      .reduce((sum, b) => sum + (b.fareDetails?.totalFare || 0), 0);

    const availableVehicles = db.vehicles.filter(v => v.status === "Available").length;
    const onTripVehicles = db.vehicles.filter(v => v.status === "On Trip").length;
    const maintenanceVehicles = db.vehicles.filter(v => v.status === "Maintenance").length;

    const availableDrivers = db.drivers.filter(d => d.status === "Available").length;
    const onTripDrivers = db.drivers.filter(d => d.status === "On Trip").length;
    const offDutyDrivers = db.drivers.filter(d => d.status === "Off Duty").length;

    // Recent 6 bookings
    const recentBookings = [...db.bookings]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 6);

    // Revenue by trip type
    const revenueByType = {};
    db.bookings.forEach(b => {
      const type = b.tripType || "One-Way";
      revenueByType[type] = (revenueByType[type] || 0) + (b.fareDetails?.totalFare || 0);
    });

    return asyncResolve({
      totals: {
        totalBookings,
        activeTrips,
        confirmedTrips,
        pendingRequests,
        completedTrips,
        cancelledTrips,
        totalRevenue,
        totalCustomers: db.customers.length,
        totalVehicles: db.vehicles.length,
        totalDrivers: db.drivers.length
      },
      fleet: {
        available: availableVehicles,
        onTrip: onTripVehicles,
        maintenance: maintenanceVehicles,
        total: db.vehicles.length
      },
      drivers: {
        available: availableDrivers,
        onTrip: onTripDrivers,
        offDuty: offDutyDrivers,
        total: db.drivers.length
      },
      recentBookings,
      revenueByType,
      settings: db.settings
    });
  },

  // ----------------- VEHICLE MANAGEMENT -----------------
  getVehicles: async (params = {}) => {
    const db = getDb();
    const { status, type, search } = params;
    let results = [...db.vehicles];

    if (status && status !== "All") {
      results = results.filter(v => v.status.toLowerCase() === status.toLowerCase());
    }
    if (type && type !== "All") {
      results = results.filter(v => v.type.toLowerCase() === type.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        v =>
          v.registrationNumber.toLowerCase().includes(q) ||
          v.model.toLowerCase().includes(q) ||
          v.type.toLowerCase().includes(q)
      );
    }

    return asyncResolve(results);
  },

  getVehicle: async (id) => {
    const db = getDb();
    const vehicle = db.vehicles.find(v => v.id === id);
    if (!vehicle) throw new Error("Vehicle not found");
    return asyncResolve(vehicle);
  },

  createVehicle: async (data) => {
    const db = getDb();
    const { registrationNumber, model, type, seatingCapacity, fuelType, color, year, perKmRate, baseFare, image } = data;

    if (!registrationNumber || !model) {
      throw new Error("Registration number and model are required");
    }

    if (db.vehicles.some(v => v.registrationNumber.toLowerCase() === registrationNumber.toLowerCase())) {
      throw new Error("A vehicle with this registration number already exists");
    }

    const newVehicle = {
      id: `veh-${Date.now().toString().slice(-4)}`,
      registrationNumber: registrationNumber.toUpperCase(),
      model,
      type: type || "Sedan",
      seatingCapacity: Number(seatingCapacity) || 4,
      fuelType: fuelType || "Petrol",
      color: color || "White",
      year: Number(year) || new Date().getFullYear(),
      status: "Available",
      odometerKm: 0,
      perKmRate: Number(perKmRate) || db.settings.ratePerKm,
      baseFare: Number(baseFare) || db.settings.baseFare,
      image: image || "/cars/maruti_dzire.png",
      insuranceExpiry: "2027-12-31",
      pucExpiry: "2027-06-30"
    };

    db.vehicles.unshift(newVehicle);
    saveDb(db);
    return asyncResolve(newVehicle);
  },

  updateVehicle: async (id, data) => {
    const db = getDb();
    const index = db.vehicles.findIndex(v => v.id === id);
    if (index === -1) throw new Error("Vehicle not found");

    db.vehicles[index] = {
      ...db.vehicles[index],
      ...data,
      seatingCapacity: data.seatingCapacity ? Number(data.seatingCapacity) : db.vehicles[index].seatingCapacity,
      perKmRate: data.perKmRate ? Number(data.perKmRate) : db.vehicles[index].perKmRate,
      baseFare: data.baseFare ? Number(data.baseFare) : db.vehicles[index].baseFare
    };

    saveDb(db);
    return asyncResolve(db.vehicles[index]);
  },

  deleteVehicle: async (id) => {
    const db = getDb();
    const index = db.vehicles.findIndex(v => v.id === id);
    if (index === -1) throw new Error("Vehicle not found");

    // Disassociate from drivers
    db.drivers.forEach(d => {
      if (d.assignedVehicleId === id) {
        d.assignedVehicleId = null;
        d.assignedVehicleName = "Unassigned";
      }
    });

    const deleted = db.vehicles.splice(index, 1)[0];
    saveDb(db);
    return asyncResolve({ message: "Vehicle deleted successfully", vehicle: deleted });
  },

  // ----------------- DRIVER MANAGEMENT -----------------
  getDrivers: async (params = {}) => {
    const db = getDb();
    const { status, search } = params;
    let results = [...db.drivers];

    if (status && status !== "All") {
      results = results.filter(d => d.status.toLowerCase() === status.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        d =>
          d.name.toLowerCase().includes(q) ||
          d.phone.toLowerCase().includes(q) ||
          d.licenseNumber.toLowerCase().includes(q)
      );
    }

    return asyncResolve(results);
  },

  getDriver: async (id) => {
    const db = getDb();
    const driver = db.drivers.find(d => d.id === id);
    if (!driver) throw new Error("Driver not found");
    return asyncResolve(driver);
  },

  createDriver: async (data) => {
    const db = getDb();
    const { name, phone, email, licenseNumber, experienceYears, assignedVehicleId, emergencyContact } = data;

    if (!name || !phone || !licenseNumber) {
      throw new Error("Name, phone, and license number are required");
    }

    let assignedVehicleName = "Unassigned";
    if (assignedVehicleId) {
      const veh = db.vehicles.find(v => v.id === assignedVehicleId);
      if (veh) assignedVehicleName = `${veh.model} (${veh.registrationNumber})`;
    }

    const newDriver = {
      id: `drv-${Date.now().toString().slice(-4)}`,
      name,
      phone,
      email: email || `${name.toLowerCase().replace(/\s+/g, ".")}@citycabs.com`,
      licenseNumber: licenseNumber.toUpperCase(),
      experienceYears: Number(experienceYears) || 3,
      assignedVehicleId: assignedVehicleId || null,
      assignedVehicleName,
      status: "Available",
      rating: 5.0,
      totalTrips: 0,
      joiningDate: new Date().toISOString().split("T")[0],
      emergencyContact: emergencyContact || ""
    };

    db.drivers.unshift(newDriver);
    saveDb(db);
    return asyncResolve(newDriver);
  },

  updateDriver: async (id, data) => {
    const db = getDb();
    const index = db.drivers.findIndex(d => d.id === id);
    if (index === -1) throw new Error("Driver not found");

    let assignedVehicleName = db.drivers[index].assignedVehicleName;
    if (data.assignedVehicleId !== undefined) {
      if (data.assignedVehicleId) {
        const veh = db.vehicles.find(v => v.id === data.assignedVehicleId);
        assignedVehicleName = veh ? `${veh.model} (${veh.registrationNumber})` : "Unassigned";
      } else {
        assignedVehicleName = "Unassigned";
      }
    }

    db.drivers[index] = {
      ...db.drivers[index],
      ...data,
      assignedVehicleName,
      experienceYears: data.experienceYears ? Number(data.experienceYears) : db.drivers[index].experienceYears
    };

    saveDb(db);
    return asyncResolve(db.drivers[index]);
  },

  deleteDriver: async (id) => {
    const db = getDb();
    const index = db.drivers.findIndex(d => d.id === id);
    if (index === -1) throw new Error("Driver not found");

    const deleted = db.drivers.splice(index, 1)[0];
    saveDb(db);
    return asyncResolve({ message: "Driver deleted successfully", driver: deleted });
  },

  // ----------------- CUSTOMER MANAGEMENT -----------------
  getCustomers: async (params = {}) => {
    const db = getDb();
    const { search } = params;
    let results = [...db.customers];

    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        c =>
          c.name.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          (c.city && c.city.toLowerCase().includes(q))
      );
    }

    return asyncResolve(results);
  },

  getCustomer: async (id) => {
    const db = getDb();
    const customer = db.customers.find(c => c.id === id);
    if (!customer) throw new Error("Customer not found");

    const customerTrips = db.bookings.filter(b => b.customerId === id);
    return asyncResolve({ ...customer, trips: customerTrips });
  },

  createCustomer: async (data) => {
    const db = getDb();
    const { name, phone, email, address, city, notes } = data;
    if (!name || !phone) {
      throw new Error("Name and phone are required");
    }

    const newCustomer = {
      id: `cust-${Date.now().toString().slice(-4)}`,
      name,
      phone,
      email: email || "",
      address: address || "",
      city: city || "",
      totalBookings: 0,
      totalSpent: 0,
      rating: 5.0,
      notes: notes || "",
      createdAt: new Date().toISOString().split("T")[0]
    };

    db.customers.unshift(newCustomer);
    saveDb(db);
    return asyncResolve(newCustomer);
  },

  updateCustomer: async (id, data) => {
    const db = getDb();
    const index = db.customers.findIndex(c => c.id === id);
    if (index === -1) throw new Error("Customer not found");

    db.customers[index] = {
      ...db.customers[index],
      ...data
    };

    saveDb(db);
    return asyncResolve(db.customers[index]);
  },

  deleteCustomer: async (id) => {
    const db = getDb();
    const index = db.customers.findIndex(c => c.id === id);
    if (index === -1) throw new Error("Customer not found");

    const deleted = db.customers.splice(index, 1)[0];
    saveDb(db);
    return asyncResolve({ message: "Customer deleted successfully", customer: deleted });
  },

  // ----------------- TRIP & BOOKING MANAGEMENT -----------------
  getBookings: async (params = {}) => {
    const db = getDb();
    const { status, driverId, customerId, search } = params;
    let results = [...db.bookings];

    if (status && status !== "All") {
      results = results.filter(b => b.bookingStatus.toLowerCase() === status.toLowerCase());
    }
    if (driverId) {
      results = results.filter(b => b.driverId === driverId);
    }
    if (customerId) {
      results = results.filter(b => b.customerId === customerId);
    }
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        b =>
          b.id.toLowerCase().includes(q) ||
          b.customerName.toLowerCase().includes(q) ||
          b.pickupLocation.toLowerCase().includes(q) ||
          b.dropLocation.toLowerCase().includes(q) ||
          (b.driverName && b.driverName.toLowerCase().includes(q)) ||
          (b.vehicleNumber && b.vehicleNumber.toLowerCase().includes(q))
      );
    }

    results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return asyncResolve(results);
  },

  getBooking: async (id) => {
    const db = getDb();
    const booking = db.bookings.find(b => b.id === id);
    if (!booking) throw new Error("Booking not found");
    return asyncResolve(booking);
  },

  estimateFare: async (data) => {
    const db = getDb();
    const { distanceKm, vehicleId, tripType, waitingCharge, discount } = data;
    const vehicle = db.vehicles.find(v => v.id === vehicleId);
    const fare = calculateFare(db, distanceKm, vehicle, tripType, waitingCharge, discount);
    return asyncResolve(fare);
  },

  createBooking: async (data) => {
    const db = getDb();
    const {
      customerId,
      customerName,
      customerPhone,
      customerEmail,
      vehicleId,
      driverId,
      pickupLocation,
      dropLocation,
      pickupDateTime,
      returnDateTime,
      tripType,
      distanceKm,
      paymentStatus,
      paymentMethod,
      bookingStatus,
      notes,
      customFare
    } = data;

    if (!pickupLocation || !dropLocation) {
      throw new Error("Pickup and Drop locations are required");
    }

    let cId = customerId;
    let cName = customerName;
    let cPhone = customerPhone;
    let cEmail = customerEmail;

    if (!cId && cName && cPhone) {
      const existing = db.customers.find(c => c.phone === cPhone || (c.name && c.name.toLowerCase() === cName.toLowerCase()));
      if (existing) {
        cId = existing.id;
        cName = existing.name;
        cPhone = existing.phone;
        cEmail = existing.email || cEmail;
        existing.totalBookings = (existing.totalBookings || 0) + 1;
      } else {
        const detectedCity = pickupLocation.includes("Chennai") ? "Chennai" :
          (pickupLocation.includes("Coimbatore") ? "Coimbatore" :
          (pickupLocation.includes("Madurai") ? "Madurai" :
          (pickupLocation.includes("Salem") ? "Salem" :
          (pickupLocation.includes("Trichy") ? "Trichy" : "Chennai"))));

        const newCust = {
          id: `cust-${Date.now().toString().slice(-4)}`,
          name: cName,
          phone: cPhone,
          email: cEmail || "",
          address: pickupLocation,
          city: detectedCity,
          totalBookings: 1,
          totalSpent: 0,
          rating: 5.0,
          notes: "Auto-registered via trip booking",
          createdAt: new Date().toISOString().split("T")[0]
        };
        db.customers.unshift(newCust);
        cId = newCust.id;
      }
    } else if (cId) {
      const existing = db.customers.find(c => c.id === cId);
      if (existing) {
        cName = existing.name;
        cPhone = existing.phone;
        cEmail = existing.email;
        existing.totalBookings = (existing.totalBookings || 0) + 1;
      }
    } else if (cName) {
      const detectedCity = pickupLocation.includes("Chennai") ? "Chennai" : "Tamil Nadu";
      const newCust = {
        id: `cust-${Date.now().toString().slice(-4)}`,
        name: cName,
        phone: cPhone || "+91 98401 99999",
        email: cEmail || "",
        address: pickupLocation,
        city: detectedCity,
        totalBookings: 1,
        totalSpent: 0,
        rating: 5.0,
        notes: "Auto-registered via trip booking",
        createdAt: new Date().toISOString().split("T")[0]
      };
      db.customers.unshift(newCust);
      cId = newCust.id;
    }

    const vehicle = db.vehicles.find(v => v.id === vehicleId);
    const driver = db.drivers.find(d => d.id === driverId);

    const fareDetails = customFare || calculateFare(db, distanceKm, vehicle, tripType);
    const newBookingId = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
    const initialStatus = bookingStatus || (vehicle && driver ? "Confirmed" : "Pending");

    const newBooking = {
      id: newBookingId,
      customerId: cId || "guest",
      customerName: cName || "Guest Rider",
      customerPhone: cPhone || "+91 99999 00000",
      customerEmail: cEmail || "",
      vehicleId: vehicle ? vehicle.id : null,
      vehicleModel: vehicle ? vehicle.model : "Pending Assignment",
      vehicleNumber: vehicle ? vehicle.registrationNumber : "Pending",
      vehicleType: vehicle ? vehicle.type : "Standard",
      driverId: driver ? driver.id : null,
      driverName: driver ? driver.name : "Pending Assignment",
      driverPhone: driver ? driver.phone : "Pending",
      pickupLocation,
      dropLocation,
      pickupDateTime: pickupDateTime || new Date().toISOString(),
      returnDateTime: returnDateTime || null,
      tripType: tripType || "One-Way",
      distanceKm: Number(distanceKm) || 15,
      fareDetails,
      paymentStatus: paymentStatus || "Pending",
      paymentMethod: paymentMethod || "Cash",
      bookingStatus: initialStatus,
      notes: notes || "",
      createdAt: new Date().toISOString(),
      timeline: [
        {
          time: new Date().toLocaleString(),
          title: "Booking Created",
          desc: `Trip created for ${cName || "Customer"}`
        }
      ]
    };

    if (vehicle && driver) {
      newBooking.timeline.push({
        time: new Date().toLocaleString(),
        title: "Vehicle & Driver Allocated",
        desc: `${vehicle.model} (${vehicle.registrationNumber}) assigned with ${driver.name}`
      });
    }

    syncFleetStatus(db, newBooking, initialStatus);
    db.bookings.unshift(newBooking);
    saveDb(db);

    return asyncResolve(newBooking);
  },

  updateBooking: async (id, data) => {
    const db = getDb();
    const index = db.bookings.findIndex(b => b.id === id);
    if (index === -1) throw new Error("Booking not found");

    const current = db.bookings[index];
    const oldStatus = current.bookingStatus;
    const newStatus = data.bookingStatus || oldStatus;

    let vehicleModel = current.vehicleModel;
    let vehicleNumber = current.vehicleNumber;
    let vehicleType = current.vehicleType;
    if (data.vehicleId && data.vehicleId !== current.vehicleId) {
      const v = db.vehicles.find(veh => veh.id === data.vehicleId);
      if (v) {
        vehicleModel = v.model;
        vehicleNumber = v.registrationNumber;
        vehicleType = v.type;
      }
    }

    let driverName = current.driverName;
    let driverPhone = current.driverPhone;
    if (data.driverId && data.driverId !== current.driverId) {
      const d = db.drivers.find(drv => drv.id === data.driverId);
      if (d) {
        driverName = d.name;
        driverPhone = d.phone;
      }
    }

    const updatedBooking = {
      ...current,
      ...data,
      vehicleModel,
      vehicleNumber,
      vehicleType,
      driverName,
      driverPhone
    };

    if (newStatus !== oldStatus) {
      updatedBooking.timeline = updatedBooking.timeline || [];
      updatedBooking.timeline.push({
        time: new Date().toLocaleString(),
        title: `Status Changed to ${newStatus}`,
        desc: data.statusNote || `Booking updated by operator`
      });
      syncFleetStatus(db, updatedBooking, newStatus);
    }

    db.bookings[index] = updatedBooking;
    saveDb(db);
    return asyncResolve(updatedBooking);
  },

  updateBookingStatus: async (id, statusData) => {
    const db = getDb();
    const index = db.bookings.findIndex(b => b.id === id);
    if (index === -1) throw new Error("Booking not found");

    const { status, note, paymentStatus } = statusData;
    if (!status) throw new Error("Status is required");

    const booking = db.bookings[index];
    booking.bookingStatus = status;
    if (paymentStatus) {
      booking.paymentStatus = paymentStatus;
    }

    booking.timeline = booking.timeline || [];
    booking.timeline.push({
      time: new Date().toLocaleString(),
      title: `Trip Status: ${status}`,
      desc: note || `Status transitioned to ${status}`
    });

    syncFleetStatus(db, booking, status);
    saveDb(db);
    return asyncResolve(booking);
  },

  deleteBooking: async (id) => {
    const db = getDb();
    const index = db.bookings.findIndex(b => b.id === id);
    if (index === -1) throw new Error("Booking not found");

    const booking = db.bookings[index];
    if (booking.bookingStatus === "In Progress" || booking.bookingStatus === "Confirmed") {
      syncFleetStatus(db, booking, "Cancelled");
    }

    const deleted = db.bookings.splice(index, 1)[0];
    saveDb(db);
    return asyncResolve({ message: "Booking deleted successfully", booking: deleted });
  },

  // ----------------- SYSTEM SETTINGS & RESTORE -----------------
  getSettings: async () => {
    const db = getDb();
    return asyncResolve(db.settings);
  },

  updateSettings: async (data) => {
    const db = getDb();
    db.settings = {
      ...db.settings,
      ...data
    };
    saveDb(db);
    return asyncResolve(db.settings);
  },

  resetDemoData: async () => {
    const freshDb = clone(initialData);
    saveDb(freshDb);
    return asyncResolve({ message: "System state successfully restored to initial demo data", stats: freshDb });
  }
};

export default api;
