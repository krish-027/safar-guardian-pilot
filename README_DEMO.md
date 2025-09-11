# Smart Safar - Tourist Safety Management System

## Demo Overview
Smart Safar is a comprehensive tourist safety management platform for Himachal Pradesh with real-time monitoring, digital identity management, and emergency response capabilities.

## Storage & Data
- **localStorage key**: `smartSafarData`
- **Auto-seeding**: Data initializes automatically on first load
- **Cross-tab sync**: Storage events ensure real-time updates between Tourist and Officer views

## Developer Mode
- **Toggle**: Settings page → Developer Mode switch
- **Access**: Hidden `.dev-only` elements become visible when enabled
- **Debug controls**: Demo script, force refresh, data logging

## 2-Minute Demo Script

### Step 1: Tourist Registration (30 seconds)
1. Open Tourist View tab
2. Fill registration form or use existing tourist
3. Show Digital ID card with QR code and blockchain proof
4. Click "Copy Proof" to demonstrate blockchain verification

### Step 2: Map & Geofence (45 seconds)
1. Go to Map page
2. Drag tourist marker into Forest Reserve (red zone)
3. Observe geofence violation banner and safety score drop (-30)
4. Click SOS Panic Button → toast confirms "Panic sent to Officer Dashboard"

### Step 3: Officer Dashboard (30 seconds)
1. Switch to Officer Dashboard tab
2. New Panic alert appears in live feed
3. Tourist pin pulses and turns red
4. Click tourist pin → open modal → view Digital ID and alert history

### Step 4: E-FIR Demo (15 seconds)
1. In tourist modal, click "Generate E-FIR"
2. Show E-FIR (Demo) modal with placeholder summary
3. Click "Download Sample PDF (demo)" to download sample

## Quick Commands
- **Run full demo**: Developer Mode → "Run Demo Script"
- **Force refresh**: Developer Mode → "Force Officer Refresh"
- **Reset data**: Clear localStorage and refresh page

## Technical Features
- ✅ Real-time cross-tab communication via storage events
- ✅ SHA-256 blockchain proof generation
- ✅ QR code digital ID cards
- ✅ Geofence polygon detection
- ✅ Safety score animations
- ✅ Mock E-FIR PDF generation
- ✅ Responsive design with Tailwind CSS
- ✅ Type-safe TypeScript implementation

## Production Notes
- E-FIR generation is placeholder/demo only
- Map requires Mapbox token for full functionality
- All data persists in localStorage (frontend-only)
- No backend services required for demo