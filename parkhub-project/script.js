// Parking Lots Data
const parkingLots = [
    {
        id: 1,
        name: "Downtown Garage A",
        location: "123 Main St",
        availableSpaces: 45,
        totalSpaces: 100,
        hourlyRate: 2.50,
        rating: 4.5
    },
    {
        id: 2,
        name: "Central Plaza Lot",
        location: "456 Oak Ave",
        availableSpaces: 32,
        totalSpaces: 75,
        hourlyRate: 2.00,
        rating: 4.2
    },
    {
        id: 3,
        name: "Tech Park Garage",
        location: "789 Innovation Dr",
        availableSpaces: 67,
        totalSpaces: 200,
        hourlyRate: 1.50,
        rating: 4.7
    },
    {
        id: 4,
        name: "Airport Terminal Lot",
        location: "555 Flight Way",
        availableSpaces: 23,
        totalSpaces: 150,
        hourlyRate: 3.50,
        rating: 4.3
    }
];

// State Management
let state = {
    selectedLot: null,
    selectedSpace: null,
    selectedSpaces: new Map(),
    bookings: []
};

// DOM Elements
const lotsList = document.getElementById('lotsList');
const parkingMap = document.getElementById('parkingMap');
const selectedLotInput = document.getElementById('selectedLot');
const selectedSpaceInput = document.getElementById('selectedSpace');
const startTimeInput = document.getElementById('startTime');
const durationSelect = document.getElementById('duration');
const vehicleTypeSelect = document.getElementById('vehicleType');
const paymentMethodSelect = document.getElementById('paymentMethod');
const totalPriceSpan = document.getElementById('totalPrice');
const hourlyRateSpan = document.getElementById('hourlyRate');
const totalDurationSpan = document.getElementById('totalDuration');
const bookBtn = document.getElementById('bookBtn');
const spaceModal = document.getElementById('spaceModal');
const confirmModal = document.getElementById('confirmModal');
const loader = document.getElementById('loader');
const closeButtons = document.querySelectorAll('.close-btn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeLotsList();
    setupEventListeners();
    setMinDateTime();
});

// Initialize Lots List
function initializeLotsList() {
    lotsList.innerHTML = '';
    parkingLots.forEach(lot => {
        const lotElement = createLotElement(lot);
        lotsList.appendChild(lotElement);
    });
}

// Create Lot Element
function createLotElement(lot) {
    const div = document.createElement('div');
    div.className = 'lot-item';
    div.innerHTML = `
        <div class="lot-name">${lot.name}</div>
        <div class="lot-info">
            📍 ${lot.location}<br>
            ${lot.availableSpaces}/${lot.totalSpaces} available<br>
            💲 $${lot.hourlyRate}/hr
        </div>
    `;
    div.addEventListener('click', () => selectLot(lot, div));
    return div;
}

// Select Lot
function selectLot(lot, element) {
    // Remove active class from all lot items
    document.querySelectorAll('.lot-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to selected lot
    element.classList.add('active');
    
    // Update state
    state.selectedLot = lot;
    state.selectedSpace = null;
    selectedLotInput.value = lot.name;
    selectedSpaceInput.value = '';
    hourlyRateSpan.textContent = '$' + lot.hourlyRate.toFixed(2);
    
    // Generate parking spaces
    generateParkingSpaces(lot);
}

// Generate Parking Spaces
function generateParkingSpaces(lot) {
    parkingMap.innerHTML = '';
    
    if (!state.selectedSpaces.has(lot.id)) {
        state.selectedSpaces.set(lot.id, new Map());
    }
    
    const spacesForLot = state.selectedSpaces.get(lot.id);
    
    for (let i = 1; i <= lot.totalSpaces; i++) {
        const spaceDiv = document.createElement('div');
        const isOccupied = Math.random() < 0.55; // 55% occupied
        const isSelected = spacesForLot.has(i) && spacesForLot.get(i).selected;
        
        spaceDiv.className = `parking-space ${isOccupied ? 'occupied' : 'available'} ${isSelected ? 'selected' : ''}`;
        spaceDiv.textContent = `${i}`;
        
        if (!isOccupied) {
            spaceDiv.addEventListener('click', () => selectSpace(lot, i, spacesForLot, spaceDiv));
        }
        
        parkingMap.appendChild(spaceDiv);
    }
}

// Select Space
function selectSpace(lot, spaceNumber, spacesForLot, element) {
    if (element.classList.contains('occupied')) return;
    
    // Deselect previous space
    document.querySelectorAll('.parking-space.selected').forEach(space => {
        space.classList.remove('selected');
    });
    
    // Select new space
    element.classList.add('selected');
    state.selectedSpace = spaceNumber;
    selectedSpaceInput.value = `${lot.name} - Space ${spaceNumber}`;
    
    // Update spaces map
    spacesForLot.clear();
    spacesForLot.set(spaceNumber, { selected: true });
    
    // Show space modal
    showSpaceModal(lot, spaceNumber);
    
    checkFormValidity();
}

// Show Space Modal
function showSpaceModal(lot, spaceNumber) {
    document.getElementById('modalTitle').textContent = `Space ${spaceNumber} Selected`;
    document.getElementById('modalMessage').innerHTML = `
        <p><strong>${lot.name}</strong></p>
        <p>Space: <strong>#${spaceNumber}</strong></p>
        <p>Location: ${lot.location}</p>
        <p>Hourly Rate: $${lot.hourlyRate}</p>
    `;
    
    const confirmBtn = document.getElementById('confirmBtn');
    confirmBtn.onclick = () => {
        spaceModal.classList.add('hidden');
        durationSelect.focus();
    };
    
    spaceModal.classList.remove('hidden');
}

// Setup Event Listeners
function setupEventListeners() {
    // Duration change
    durationSelect.addEventListener('change', () => {
        calculatePrice();
        checkFormValidity();
    });
    
    // Start time change
    startTimeInput.addEventListener('change', () => {
        checkFormValidity();
    });
    
    // Book button
    bookBtn.addEventListener('click', processBooking);
    
    // Close modals
    closeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.modal').classList.add('hidden');
        });
    });
    
    // Confirm modal OK button
    document.getElementById('okBtn').addEventListener('click', () => {
        confirmModal.classList.add('hidden');
        resetForm();
    });
    
    // Modal background click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    });
}

// Calculate Price
function calculatePrice() {
    if (!state.selectedLot || !durationSelect.value) return;
    
    const duration = parseInt(durationSelect.value);
    const rate = state.selectedLot.hourlyRate;
    const total = duration * rate;
    
    totalDurationSpan.textContent = duration;
    totalPriceSpan.textContent = total.toFixed(2);
}

// Check Form Validity
function checkFormValidity() {
    const isValid = 
        state.selectedLot &&
        state.selectedSpace &&
        startTimeInput.value &&
        durationSelect.value &&
        vehicleTypeSelect.value &&
        paymentMethodSelect.value;
    
    bookBtn.disabled = !isValid;
}

// Process Booking
function processBooking() {
    if (!state.selectedLot || !state.selectedSpace) return;
    
    showLoader();
    
    // Simulate API call
    setTimeout(() => {
        hideLoader();
        showConfirmationModal();
    }, 2000);
}

// Show Confirmation Modal
function showConfirmationModal() {
    const booking = {
        lot: state.selectedLot.name,
        space: state.selectedSpace,
        dateTime: new Date(startTimeInput.value).toLocaleString(),
        duration: durationSelect.value,
        amount: totalPriceSpan.textContent,
        confirmationId: generateConfirmationId()
    };
    
    state.bookings.push(booking);
    
    document.getElementById('confirmLot').textContent = booking.lot;
    document.getElementById('confirmSpace').textContent = `#${booking.space}`;
    document.getElementById('confirmDateTime').textContent = booking.dateTime;
    document.getElementById('confirmDuration').textContent = booking.duration;
    document.getElementById('confirmAmount').textContent = booking.amount;
    
    // Generate QR Code
    generateQRCode(booking.confirmationId);
    
    confirmModal.classList.remove('hidden');
}

// Generate Confirmation ID
function generateConfirmationId() {
    return 'PH' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Generate QR Code (Simulated)
function generateQRCode(id) {
    const qrCodeDiv = document.getElementById('qrCode');
    qrCodeDiv.innerHTML = `
        <div style="font-size: 2rem; margin: 1rem 0;">█ █ █ █ █</div>
        <div style="font-size: 2rem; margin: 1rem 0;">█ ░ ░ ░ █</div>
        <div style="font-size: 2rem; margin: 1rem 0;">█ ░ ★ ░ █</div>
        <div style="font-size: 2rem; margin: 1rem 0;">█ ░ ░ ░ █</div>
        <div style="font-size: 2rem; margin: 1rem 0;">█ █ █ █ █</div>
        <p><strong>Confirmation ID:</strong> ${id}</p>
    `;
}

// Reset Form
function resetForm() {
    selectedLotInput.value = '';
    selectedSpaceInput.value = '';
    startTimeInput.value = '';
    durationSelect.value = '';
    vehicleTypeSelect.value = '';
    paymentMethodSelect.value = '';
    totalPriceSpan.textContent = '0.00';
    totalDurationSpan.textContent = '0';
    
    state.selectedLot = null;
    state.selectedSpace = null;
    
    document.querySelectorAll('.parking-space.selected').forEach(space => {
        space.classList.remove('selected');
    });
    
    document.querySelectorAll('.lot-item.active').forEach(item => {
        item.classList.remove('active');
    });
    
    bookBtn.disabled = true;
    parkingMap.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999;">Select a parking lot to view available spaces</p>';
}

// Show Loader
function showLoader() {
    loader.classList.remove('hidden');
}

// Hide Loader
function hideLoader() {
    loader.classList.add('hidden');
}

// Set Minimum DateTime
function setMinDateTime() {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 15);
    const minDateTime = now.toISOString().slice(0, 16);
    startTimeInput.min = minDateTime;
    startTimeInput.value = minDateTime;
}