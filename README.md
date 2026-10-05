# Cab & Travels Management System (Apex Cabs)

A comprehensive, full-stack digital management platform built to streamline the daily operations of modern cab, travels, and chauffeur fleet businesses.

---

## 🎨 Theme & Color Palette
- **Ink Black**: `#031211` (Dominant luxury dark backdrop)
- **Warm Ivory**: `#E8E4D3` (High-contrast typography & labels)
- **Electric Teal**: `#00AEBB` (Primary action accent, telemetry pulses & highlights)

---

## 🚀 Key Modules & Capabilities

1. **Operations Dashboard**
   - Live KPI overview: Total Bookings, Active Trips in Progress, Fleet Availability Ratio, and Gross Settled Revenue.
   - Real-time Fleet Status bar: Available, On Trip, and Under Maintenance.
   - Driver Roster Status: Ready, Driving, and Off Duty counts.
   - Active & Recent Bookings table with one-click ride progression triggers and invoice generators.

2. **Vehicle & Fleet Management**
   - Manage vehicle registrations, model names, seating capacity (2-30 seats), fuel types (Petrol, Diesel, CNG, Electric EV, Hybrid), and odometer logs.
   - Set per-vehicle tariffs: Base Fare & Per-KM running rates.
   - Instant status toggling: Available, On Trip, Maintenance.
   - Search by registration plate, make/model, and filter by vehicle category (Sedan, SUV, Hatchback, Luxury, Electric, Tempo/Mini-Bus).

3. **Driver & Chauffeur Management**
   - Driver profiles with driving license verification, contact numbers, experience years, and performance rating stars.
   - Assigned cab linking with vehicle registration preview.
   - Duty management: Toggle between **Available** and **Off Duty**.
   - Search and filtering across all operational drivers.

4. **Customer Directory**
   - Passenger profiles with phone, email, home/business address, and preferences.
   - Complete booking history modal: View all trips booked by an individual passenger, routes, and lifetime spend.

5. **Trip & Booking Management**
   - **Booking Creation Wizard**:
     - Fast passenger selection or auto-registration of new walk-in clients.
     - Origin (Pickup) and Destination (Drop) addresses.
     - Trip category: One-Way, Round-Trip, Hourly City Rental, Outstation Long Distance.
     - Live Dynamic Fare Calculator: Automatically calculates Base Fare + Distance Charges + Waiting/Allowance + GST (5%) - Discounts.
     - Fleet vehicle & Chauffeur assignment with live availability checking.
   - **Trip Lifecycle Progression**:
     - `Pending Dispatch` ➔ `Confirmed` ➔ `In Progress` (Auto-sets vehicle & driver to "On Trip") ➔ `Completed` (Frees up vehicle & driver back to "Available" & records passenger spend).
   - **Tax Invoice & Travel Slip**:
     - Printable official invoice with QR verification badge, itemized tariffs, GST breakdown, and trip timeline logs.

6. **Dedicated Driver Portal**
   - Tailored view for Chauffeurs:
     - Prominent "Trip In Progress" card with passenger details and direct phone call trigger.
     - One-click "Start Ride" and "Complete Ride & Collect Fare" actions.
     - Duty status toggle (Go Online / Go Off Duty).

7. **Admin Control & RBAC Matrix**
   - Role switching between **ADMIN / OWNER**, **MANAGER**, and **DRIVER**.
   - Custom tariff parameters: Base Fare, Per-KM rate, Waiting charge per hour, and GST Tax %.
   - Enterprise details customization.
   - One-click demo data reset button to restore fresh state anytime.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React Icons.
- **Backend**: Node.js, Express.js, CORS, RESTful API architecture.

---

## ⚡ Quick Start Instructions

### Prerequisites
- Node.js (v18+) and npm.

### 1. Start the Backend API Server
```powershell
cd backend
npm install
npm start
```
*The backend API starts on **http://localhost:5000**.*

### 2. Start the Frontend React Client
In a separate terminal:
```powershell
cd frontend
npm install
npm run dev
```
*The frontend interface starts on **http://localhost:3000** (with automatic API proxy to backend port 5000).*

---

## 👥 Demo User Personas

You can switch between any of the 3 roles at any time using the role selector in the top-right header:

| Role | Demo User | Permissions |
|---|---|---|
| **ADMIN / OWNER** | Alexander Vance | Full access: Fleet, Drivers, Customers, Bookings, System Pricing & Settings, Reset Data |
| **MANAGER** | Priya Sharma | Operations access: Fleet, Drivers, Customers, Bookings, Status & Fares |
| **DRIVER** | Rajesh Kumar | Driver Portal: View assigned rides, passenger phone contact, Start & Complete trips |

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/dashboard/stats` | Operational summary statistics & fleet counts |
| `GET` | `/api/vehicles` | List vehicles (supports `status`, `type`, `search`) |
| `POST` | `/api/vehicles` | Register new fleet vehicle |
| `PUT` | `/api/vehicles/:id` | Update vehicle or tariff rates |
| `DELETE` | `/api/vehicles/:id` | Remove vehicle from inventory |
| `GET` | `/api/drivers` | List chauffeurs (supports `status`, `search`) |
| `POST` | `/api/drivers` | Onboard new driver |
| `PUT` | `/api/drivers/:id` | Update driver or duty status |
| `DELETE` | `/api/drivers/:id` | Remove driver from roster |
| `GET` | `/api/customers` | List customers & lifetime trips |
| `POST` | `/api/customers` | Register customer |
| `GET` | `/api/bookings` | List trip bookings (filters by status, customer, driver) |
| `POST` | `/api/bookings` | Create new booking with auto-fare calculation |
| `PATCH` | `/api/bookings/:id/status` | Fast transition booking status & payments |
| `GET` | `/api/settings` | Retrieve company info & pricing rules |
| `PUT` | `/api/settings` | Update company info & default rates |
| `POST` | `/api/reset-demo` | Restore all records to initial demo state |
