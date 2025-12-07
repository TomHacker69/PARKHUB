// Sample bookings data
const allBookings = [
    {
        id: 1,
        confirmId: 'PH9A2B5C8D',
        lotName: 'Downtown Garage A',
        location: '123 Main St',
        spaceNo: 15,
        startTime: new Date(Date.now() + 1 * 60 * 60 * 1000),
        duration: 3,
        vehicleType: 'Sedan',
        hourlyRate: 2.50,
        totalAmount: 7.50,
        status: 'active',
        paymentStatus: 'Paid'
    },
    {
        id: 2,
        confirmId: 'PH3X4Y5Z6W',
        lotName: 'Central Plaza Lot',
        location: '456 Oak Ave',
        spaceNo: 42,
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
        duration: 2,
        vehicleType: 'SUV',
        hourlyRate: 2.00,
        totalAmount: 4.00,
        status: 'upcoming',
        paymentStatus: 'Paid'
    },
    {
        id: 3,
        confirmId: 'PH7M8N9O0P',
        lotName: 'Tech Park Garage',
        location: '789 Innovation Dr',
        spaceNo: 67,
        startTime: new Date(Date.now() - 5 * 60 * 60 * 1000),
        duration: 4,
        vehicleType: 'Compact',
        hourlyRate: 1.50,
        totalAmount: 6.00,
        status: 'completed',
        paymentStatus: 'Paid'
    },
    {
        id: 4,
        confirmId: 'PH1Q2R3S4T',
        lotName: 'Airport Terminal Lot',
        location: '555 Flight Way',
        spaceNo: 89,
        startTime: new Date(Date.now() - 48 * 60 * 60 * 1000),
        duration: 8,
        vehicleType: 'Sedan',
        hourlyRate: 3.50,
        totalAmount: 28.00,
        status: 'cancelled',
        paymentStatus: 'Refunded'
    },
    {
        id: 5,
        confirmId: 'PH5U6V7W8X',
        lotName: 'Downtown Garage A',
        location: '123 Main St',
        spaceNo: 23,
        startTime: new Date(Date.now() - 10 * 60 * 60 * 1000),
        duration: 2,
        vehicleType: 'Motorcycle',
        hourlyRate: 2.50,
        totalAmount: 5.00,
        status: 'completed',
        paymentStatus: 'Paid'
    }
];

let filteredBookings = [...allBookings];
let currentFilter = 'all';
let selectedBooking = null;

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    displayBookings();
    setupFilterButtons();
    setupSearchBar();
    setupModalListeners();
    setupLogout();
});

// Display bookings
function displayBookings() {
    const activeContainer = document.getElementById('activeBookingsContainer');
    const upcomingContainer = document.getElementById('upcomingBookingsContainer');
    const completedContainer = document.getElementById('completedBookingsContainer');
    const emptyState = document.getElementById('emptyState');

    const activeBookings = filteredBookings.filter(b => b.status === 'active');
    const upcomingBookings = filteredBookings.filter(b => b.status === 'upcoming');
    const completedBookings = filteredBookings.filter(b => b.status === 'completed' || b.status === 'cancelled');

    // Clear containers
    document.getElementById('activeBookings').innerHTML = '';
    document.getElementById('upcomingBookings').innerHTML = '';
    document.getElementById('completedBookings').innerHTML = '';

    // Display active bookings
    if (activeBookings.length > 0) {
        activeContainer.classList.remove('hidden');
        activeBookings.forEach(booking => {
            document.getElementById('activeBookings').appendChild(createBookingCard(booking));
        });
    } else {
        activeContainer.classList.add('hidden');
    }

    // Display upcoming bookings
    if (upcomingBookings.length > 0) {
        upcomingContainer.classList.remove('hidden');
        upcomingBookings.forEach(booking => {
            document.getElementById('upcomingBookings').appendChild(createBookingCard(booking));
        });
    } else {
        upcomingContainer.classList.add('hidden');
    }

    // Display completed bookings
    if (completedBookings.length > 0) {
        completedContainer.classList.remove('hidden');
        completedBookings.forEach(booking => {
            document.getElementById('completedBookings').appendChild(createBookingCard(booking));
        });
    } else {
        completedContainer.classList.add('hidden');
    }

    // Show empty state if no bookings
    if (filteredBookings.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
    }
}

// Create booking card
function createBookingCard(booking) {
    const card = document.createElement('div');
    card.className = `booking-card status-${booking.status}`;
    
    const endTime = new Date(booking.startTime.getTime() + booking.duration * 60 * 60 * 1000);
    
    card.innerHTML = `
        <div class="booking-card-header">
            <div>
                <h3>${booking.lotName}</h3>
                <p>Space #${booking.spaceNo}</p>
            </div>
            <span class="status-badge status-${booking.status}">${booking.status.toUpperCase()}</span>
        </div>
        <div class="booking-card-body">
            <div class="booking-detail">
                <span class="detail-label">📅 Start:</span>
                <span>${booking.startTime.toLocaleString()}</span>
            </div>
            <div class="booking-detail">
                <span class="detail-label">⏱️ Duration:</span>
                <span>${booking.duration} hours</span>
            </div>
            <div class="booking-detail">
                <span class="detail-label">💰 Amount:</span>
                <span>$${booking.totalAmount.toFixed(2)}</span>
            </div>
            <div class="booking-detail">
                <span class="detail-label">📍 Location:</span>
                <span>${booking.location}</span>
            </div>
        </div>
        <div class="booking-card-footer">
            <button class="view-details-btn" onclick="showBookingDetails(${booking.id})">View Details</button>
            ${booking.status === 'active' ? `<button class="extend-btn" onclick="openExtendModal(${booking.id})">Extend</button>` : ''}
            ${booking.status !== 'cancelled' && booking.status !== 'completed' ? `<button class="cancel-btn-card" onclick="openCancelModal(${booking.id})">Cancel</button>` : ''}
        </div>
    `;
    
    return card;
}

// Show booking details
function showBookingDetails(bookingId) {
    selectedBooking = allBookings.find(b => b.id === bookingId);
    if (!selectedBooking) return;

    const endTime = new Date(selectedBooking.startTime.getTime() + selectedBooking.duration * 60 * 60 * 1000);

    document.getElementById('modalConfirmId').textContent = selectedBooking.confirmId;
    document.getElementById('modalLotName').textContent = selectedBooking.lotName;
    document.getElementById('modalLocation').textContent = selectedBooking.location;
    document.getElementById('modalSpaceNo').textContent = `#${selectedBooking.spaceNo}`;
    document.getElementById('modalStartTime').textContent = selectedBooking.startTime.toLocaleString();
    document.getElementById('modalEndTime').textContent = endTime.toLocaleString();
    document.getElementById('modalDuration').textContent = `${selectedBooking.duration} hours`;
    document.getElementById('modalVehicleType').textContent = selectedBooking.vehicleType;
    document.getElementById('modalRate').textContent = `$${selectedBooking.hourlyRate}/hour`;
    document.getElementById('modalTotalAmount').textContent = `$${selectedBooking.totalAmount.toFixed(2)}`;
    
    const statusBadge = document.getElementById('modalStatus');
    statusBadge.textContent = selectedBooking.status.toUpperCase();
    statusBadge.className = `status-badge status-${selectedBooking.status}`;

    // Generate QR code
    generateQRCode(selectedBooking.confirmId);

    // Update button visibility
    document.getElementById('extendBtn').style.display = selectedBooking.status === 'active' ? 'block' : 'none';
    document.getElementById('cancelBtn').style.display = (selectedBooking.status !== 'completed' && selectedBooking.status !== 'cancelled') ? 'block' : 'none';

    document.getElementById('bookingModal').classList.remove('hidden');
}

// Generate QR code
function generateQRCode(id) {
    const qrDiv = document.getElementById('modalQRCode');
    qrDiv.innerHTML = `
        <div style="font-size: 1.5rem; margin: 1rem 0;">█ █ █ █ █</div>
        <div style="font-size: 1.5rem; margin: 1rem 0;">█ ░ ░ ░ █</div>
        <div style="font-size: 1.5rem; margin: 1rem 0;">█ ░ ★ ░ █</div>
        <div style="font-size: 1.5rem; margin: 1rem 0;">█ ░ ░ ░ █</div>
        <div style="font-size: 1.5rem; margin: 1rem 0;">█ █ █ █ █</div>
        <p style="margin-top: 1rem;"><strong>${id}</strong></p>
    `;
}

// Setup filter buttons
function setupFilterButtons() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            currentFilter = e.target.dataset.filter;
            filterBookings();
        });
    });
}

// Filter bookings
function filterBookings() {
    if (currentFilter === 'all') {
        filteredBookings = [...allBookings];
    } else {
        filteredBookings = allBookings.filter(b => b.status === currentFilter);
    }
    displayBookings();
}

// Setup search bar
function setupSearchBar() {
    document.getElementById('searchBooking').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        filteredBookings = allBookings.filter(b => 
            b.lotName.toLowerCase().includes(searchTerm) ||
            b.confirmId.toLowerCase().includes(searchTerm)
        );
        displayBookings();
    });
}

// Open extend modal
function openExtendModal(bookingId) {
    selectedBooking = allBookings.find(b => b.id === bookingId);
    document.getElementById('bookingModal').classList.add('hidden');
    document.getElementById('extendModal').classList.remove('hidden');
    
    document.getElementById('extendDuration').addEventListener('change', () => {
        calculateExtendCost();
    });
}

// Calculate extend cost
function calculateExtendCost() {
    const additionalHours = parseInt(document.getElementById('extendDuration').value);
    if (!additionalHours) return;
    
    const additionalCost = additionalHours * selectedBooking.hourlyRate;
    const newTotal = selectedBooking.totalAmount + additionalCost;
    
    document.getElementById('extendCost').textContent = additionalCost.toFixed(2);
    document.getElementById('extendTotal').textContent = newTotal.toFixed(2);
}

// Confirm extend
document.addEventListener('DOMContentLoaded', () => {
    const confirmExtendBtn = document.getElementById('confirmExtend');
    if (confirmExtendBtn) {
        confirmExtendBtn.addEventListener('click', () => {
            alert('Booking extended successfully!');
            document.getElementById('extendModal').classList.add('hidden');
            location.reload();
        });
    }
});

// Open cancel modal
function openCancelModal(bookingId) {
    selectedBooking = allBookings.find(b => b.id === bookingId);
    document.getElementById('bookingModal').classList.add('hidden');
    document.getElementById('cancelModal').classList.remove('hidden');
}

// Confirm cancel
document.addEventListener('DOMContentLoaded', () => {
    const confirmCancelBtn = document.getElementById('confirmCancel');
    if (confirmCancelBtn) {
        confirmCancelBtn.addEventListener('click', () => {
            if (selectedBooking) {
                selectedBooking.status = 'cancelled';
                selectedBooking.paymentStatus = 'Refunded';
                alert('Booking cancelled successfully! Refund will be processed within 2-3 business days.');
                document.getElementById('cancelModal').classList.add('hidden');
                displayBookings();
            }
        });
    }
});

// Setup modal listeners
function setupModalListeners() {
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.modal').classList.add('hidden');
        });
    });

    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    });

    const dontCancelBtn = document.getElementById('dontCancelBtn');
    if (dontCancelBtn) {
        dontCancelBtn.addEventListener('click', () => {
            document.getElementById('cancelModal').classList.add('hidden');
            document.getElementById('bookingModal').classList.remove('hidden');
        });
    }
}

// Copy to clipboard
function copyToClipboard() {
    const text = document.getElementById('modalConfirmId').textContent;
    navigator.clipboard.writeText(text).then(() => {
        alert('Confirmation ID copied to clipboard!');
    });
}

// Setup logout
function setupLogout() {
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Are you sure you want to logout?')) {
                // Clear user session
                localStorage.removeItem('parkhub_user');
                // Redirect to login page (correct path)
                window.location.href = '../login.html';
            }
        });
    }
}