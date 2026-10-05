import express from "express";
import cors from "cors";
import { initialData } from "./data.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory operational store initialized from deep copy of initialData
let db = JSON.parse(JSON.stringify(initialData));

// Helper to auto update vehicle and driver status based on booking status
function syncFleetStatus(booking, newStatus) {
  if (!booking) return;
  const vehicle = db.vehicles.find(v => v.id === booking.vehicleId);
  const driver = db.drivers.find(d => d.id === booking.driverId);

  if (newStatus === "In Progress") {
    if (vehicle && vehicle.status !== "Maintenance") vehicle.status = "On Trip";
    if (driver && driver.status !== "Off Duty") driver.status = "On Trip";
  } else if (newStatus === "Completed" || newStatus === "Cancelled") {
    if (vehicle && vehicle.status === "On Trip") vehicle.status = "Available";
    if (driver && driver.status === "On Trip") driver.status = "Available";
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

// ----------------- AUTH ENDPOINTS -----------------
app.post("/api/auth/login", (req, res) => {
  const { role, username, password } = req.body;
  let user;

  if (role) {
    user = db.users.find(u => u.role.toUpperCase() === role.toUpperCase());
  } else if (username) {
    user = db.users.find(u => u.username.toLowerCase() === username.toLowerCase());
  }

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials. User not found." });
  }

  if (!password || user.password !== password) {
    return res.status(401).json({ message: "Incorrect password." });
  }

  // Safe user payload without password field
  const { password: _pwd, ...safeUser } = user;

  res.json({
    token: `token-${user.id}-${Date.now()}`,
    user: safeUser
  });
});

app.get("/api/auth/users", (req, res) => {
  const safeUsers = db.users.map(({ password: _pwd, ...u }) => u);
  res.json(safeUsers);
});

// ----------------- DASHBOARD / STATS -----------------
app.get("/api/dashboard/stats", (req, res) => {
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

  res.json({
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
});

// ----------------- VEHICLE MANAGEMENT -----------------
app.get("/api/vehicles", (req, res) => {
  const { status, type, search } = req.query;
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

  res.json(results);
});

app.get("/api/vehicles/:id", (req, res) => {
  const vehicle = db.vehicles.find(v => v.id === req.params.id);
  if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
  res.json(vehicle);
});

app.post("/api/vehicles", (req, res) => {
  const { registrationNumber, model, type, seatingCapacity, fuelType, color, year, perKmRate, baseFare, image } = req.body;

  if (!registrationNumber || !model) {
    return res.status(400).json({ message: "Registration number and model are required" });
  }

  // Check duplicate registration number
  if (db.vehicles.some(v => v.registrationNumber.toLowerCase() === registrationNumber.toLowerCase())) {
    return res.status(400).json({ message: "A vehicle with this registration number already exists" });
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
    image: image || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=500&auto=format&fit=crop&q=80",
    insuranceExpiry: "2027-12-31",
    pucExpiry: "2027-06-30"
  };

  db.vehicles.unshift(newVehicle);
  res.status(201).json(newVehicle);
});

app.put("/api/vehicles/:id", (req, res) => {
  const index = db.vehicles.findIndex(v => v.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Vehicle not found" });

  db.vehicles[index] = {
    ...db.vehicles[index],
    ...req.body,
    seatingCapacity: req.body.seatingCapacity ? Number(req.body.seatingCapacity) : db.vehicles[index].seatingCapacity,
    perKmRate: req.body.perKmRate ? Number(req.body.perKmRate) : db.vehicles[index].perKmRate,
    baseFare: req.body.baseFare ? Number(req.body.baseFare) : db.vehicles[index].baseFare
  };

  res.json(db.vehicles[index]);
});

app.delete("/api/vehicles/:id", (req, res) => {
  const index = db.vehicles.findIndex(v => v.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Vehicle not found" });

  // Disassociate from any driver
  db.drivers.forEach(d => {
    if (d.assignedVehicleId === req.params.id) {
      d.assignedVehicleId = null;
      d.assignedVehicleName = "Unassigned";
    }
  });

  const deleted = db.vehicles.splice(index, 1)[0];
  res.json({ message: "Vehicle deleted successfully", vehicle: deleted });
});

// ----------------- DRIVER MANAGEMENT -----------------
app.get("/api/drivers", (req, res) => {
  const { status, search } = req.query;
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

  res.json(results);
});

app.get("/api/drivers/:id", (req, res) => {
  const driver = db.drivers.find(d => d.id === req.params.id);
  if (!driver) return res.status(404).json({ message: "Driver not found" });
  res.json(driver);
});

app.post("/api/drivers", (req, res) => {
  const { name, phone, email, licenseNumber, experienceYears, assignedVehicleId, emergencyContact, avatar } = req.body;

  if (!name || !phone || !licenseNumber) {
    return res.status(400).json({ message: "Name, phone, and license number are required" });
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
    email: email || `${name.toLowerCase().replace(/\s+/g, ".")}@apexcarcab.com`,
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
  res.status(201).json(newDriver);
});

app.put("/api/drivers/:id", (req, res) => {
  const index = db.drivers.findIndex(d => d.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Driver not found" });

  let assignedVehicleName = db.drivers[index].assignedVehicleName;
  if (req.body.assignedVehicleId !== undefined) {
    if (req.body.assignedVehicleId) {
      const veh = db.vehicles.find(v => v.id === req.body.assignedVehicleId);
      assignedVehicleName = veh ? `${veh.model} (${veh.registrationNumber})` : "Unassigned";
    } else {
      assignedVehicleName = "Unassigned";
    }
  }

  db.drivers[index] = {
    ...db.drivers[index],
    ...req.body,
    assignedVehicleName,
    experienceYears: req.body.experienceYears ? Number(req.body.experienceYears) : db.drivers[index].experienceYears
  };

  res.json(db.drivers[index]);
});

app.delete("/api/drivers/:id", (req, res) => {
  const index = db.drivers.findIndex(d => d.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Driver not found" });

  const deleted = db.drivers.splice(index, 1)[0];
  res.json({ message: "Driver deleted successfully", driver: deleted });
});

// ----------------- CUSTOMER MANAGEMENT -----------------
app.get("/api/customers", (req, res) => {
  const { search } = req.query;
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

  res.json(results);
});

app.get("/api/customers/:id", (req, res) => {
  const customer = db.customers.find(c => c.id === req.params.id);
  if (!customer) return res.status(404).json({ message: "Customer not found" });

  // Get customer trip history
  const customerTrips = db.bookings.filter(b => b.customerId === req.params.id);
  res.json({ ...customer, trips: customerTrips });
});

app.post("/api/customers", (req, res) => {
  const { name, phone, email, address, city, notes } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ message: "Name and phone are required" });
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
  res.status(201).json(newCustomer);
});

app.put("/api/customers/:id", (req, res) => {
  const index = db.customers.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Customer not found" });

  db.customers[index] = {
    ...db.customers[index],
    ...req.body
  };

  res.json(db.customers[index]);
});

app.delete("/api/customers/:id", (req, res) => {
  const index = db.customers.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Customer not found" });

  const deleted = db.customers.splice(index, 1)[0];
  res.json({ message: "Customer deleted successfully", customer: deleted });
});

// ----------------- TRIP & BOOKING MANAGEMENT -----------------
app.get("/api/bookings", (req, res) => {
  const { status, driverId, customerId, search } = req.query;
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

  // Sort by createdAt descending
  results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(results);
});

app.get("/api/bookings/:id", (req, res) => {
  const booking = db.bookings.find(b => b.id === req.params.id);
  if (!booking) return res.status(404).json({ message: "Booking not found" });
  res.json(booking);
});

// Fare Calculator helper
function calculateFare(distanceKm, vehicle, tripType = "One-Way", waitingCharge = 0, discount = 0) {
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

// POST endpoint to estimate fare before saving
app.post("/api/bookings/estimate-fare", (req, res) => {
  const { distanceKm, vehicleId, tripType, waitingCharge, discount } = req.body;
  const vehicle = db.vehicles.find(v => v.id === vehicleId);
  const fare = calculateFare(distanceKm, vehicle, tripType, waitingCharge, discount);
  res.json(fare);
});

app.post("/api/bookings", (req, res) => {
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
  } = req.body;

  if (!pickupLocation || !dropLocation) {
    return res.status(400).json({ message: "Pickup and Drop locations are required" });
  }

  // Find or create customer
  let cId = customerId;
  let cName = customerName;
  let cPhone = customerPhone;
  let cEmail = customerEmail;

  if (!cId && cName && cPhone) {
    const existing = db.customers.find(c => c.phone === cPhone);
    if (existing) {
      cId = existing.id;
    } else {
      const newCust = {
        id: `cust-${Date.now().toString().slice(-4)}`,
        name: cName,
        phone: cPhone,
        email: cEmail || "",
        address: pickupLocation,
        city: "",
        totalBookings: 1,
        totalSpent: 0,
        rating: 5.0,
        notes: "Auto-registered upon booking",
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
    }
  }

  // Find vehicle and driver details
  const vehicle = db.vehicles.find(v => v.id === vehicleId);
  const driver = db.drivers.find(d => d.id === driverId);

  const fareDetails = customFare || calculateFare(distanceKm, vehicle, tripType);

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

  // Update vehicle and driver status if in progress
  syncFleetStatus(newBooking, initialStatus);

  db.bookings.unshift(newBooking);
  res.status(201).json(newBooking);
});

app.put("/api/bookings/:id", (req, res) => {
  const index = db.bookings.findIndex(b => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Booking not found" });

  const current = db.bookings[index];
  const oldStatus = current.bookingStatus;
  const newStatus = req.body.bookingStatus || oldStatus;

  // If vehicle or driver changed
  let vehicleModel = current.vehicleModel;
  let vehicleNumber = current.vehicleNumber;
  let vehicleType = current.vehicleType;
  if (req.body.vehicleId && req.body.vehicleId !== current.vehicleId) {
    const v = db.vehicles.find(veh => veh.id === req.body.vehicleId);
    if (v) {
      vehicleModel = v.model;
      vehicleNumber = v.registrationNumber;
      vehicleType = v.type;
    }
  }

  let driverName = current.driverName;
  let driverPhone = current.driverPhone;
  if (req.body.driverId && req.body.driverId !== current.driverId) {
    const d = db.drivers.find(drv => drv.id === req.body.driverId);
    if (d) {
      driverName = d.name;
      driverPhone = d.phone;
    }
  }

  const updatedBooking = {
    ...current,
    ...req.body,
    vehicleModel,
    vehicleNumber,
    vehicleType,
    driverName,
    driverPhone
  };

  if (newStatus !== oldStatus) {
    updatedBooking.timeline.push({
      time: new Date().toLocaleString(),
      title: `Status Changed to ${newStatus}`,
      desc: req.body.statusNote || `Booking updated by operator`
    });
    syncFleetStatus(updatedBooking, newStatus);
  }

  db.bookings[index] = updatedBooking;
  res.json(updatedBooking);
});

// Fast status change endpoint for Driver & Manager
app.patch("/api/bookings/:id/status", (req, res) => {
  const index = db.bookings.findIndex(b => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Booking not found" });

  const { status, note, paymentStatus } = req.body;
  if (!status) return res.status(400).json({ message: "Status is required" });

  const booking = db.bookings[index];
  booking.bookingStatus = status;
  if (paymentStatus) {
    booking.paymentStatus = paymentStatus;
  }

  booking.timeline.push({
    time: new Date().toLocaleString(),
    title: `Trip Status: ${status}`,
    desc: note || `Status transitioned to ${status}`
  });

  syncFleetStatus(booking, status);

  res.json(booking);
});

app.delete("/api/bookings/:id", (req, res) => {
  const index = db.bookings.findIndex(b => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Booking not found" });

  const booking = db.bookings[index];
  // Revert vehicle/driver if it was on trip
  if (booking.bookingStatus === "In Progress") {
    syncFleetStatus(booking, "Cancelled");
  }

  const deleted = db.bookings.splice(index, 1)[0];
  res.json({ message: "Booking deleted successfully", booking: deleted });
});

// ----------------- SETTINGS & RESET -----------------
app.get("/api/settings", (req, res) => {
  res.json(db.settings);
});

app.put("/api/settings", (req, res) => {
  db.settings = {
    ...db.settings,
    ...req.body
  };
  res.json(db.settings);
});

app.post("/api/reset-demo", (req, res) => {
  db = JSON.parse(JSON.stringify(initialData));
  res.json({ message: "System state successfully restored to initial demo data", stats: db });
});

// Start Express server
app.listen(PORT, () => {
  console.log(`Cab & Travels Management System API running at http://localhost:${PORT}`);
});
