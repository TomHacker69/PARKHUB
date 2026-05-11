// Sample parking lots data
const parkingLots = [
    {
        id: 1,
        name: "Downtown Garage A",
        location: "123 Main St",
        availableSpaces: 45,
        totalSpaces: 100,
        hourlyRate: 2.50,
        rating: 4.5,
        image: "🅿️"
    },
    {
        id: 2,
        name: "Central Plaza Lot",
        location: "456 Oak Ave",
        availableSpaces: 32,
        totalSpaces: 75,
        hourlyRate: 2.00,
        rating: 4.2,
        image: "🅿️"
    },
    {
        id: 3,
        name: "Tech Park Garage",
        location: "789 Innovation Dr",
        availableSpaces: 67,
        totalSpaces: 200,
        hourlyRate: 1.50,
        rating: 4.7,
        image: "🅿️"
    },
    {
        id: 4,
        name: "Airport Terminal Lot",
        location: "555 Flight Way",
        availableSpaces: 23,
        totalSpaces: 150,
        hourlyRate: 3.50,
        rating: 4.3,
        image: "🅿️"
    }
];

// Sample user bookings
const userBookings = [
    {
        id: 1,
        lotName: "Downtown Garage A",
        spaceNo: 15,
        startTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
        duration: 3,
        status: "active"
    },
    {
        id: 2,
        lotName: "Central Plaza Lot",
        spaceNo: 42,
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
        duration: 2,
        status: "upcoming"
    }
];

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    displayUserStats();
    displayFeaturedLots();
    displayActiveBooking();
    setupEventListeners();
});

// Display user statistics
function displayUserStats() {
    document.getElementById('totalBookings').textContent = '24';
    document.getElementById('hoursParked').textContent = '156';
    document.getElementById('totalSpent').textContent = '$385.00';
    document.getElementById('userRating').textContent = '4.8';
}

// Display featured parking lots
function displayFeaturedLots() {
    const grid = document.getElementById('featuredLotsGrid');
    grid.innerHTML = '';

    parkingLots.forEach(lot => {
        const card = document.createElement('div');
        card.className = 'lot-card';
        card.innerHTML = `
            <div class="lot-card-header">
                <div class="lot-image">${lot.image}</div>
                <div class="lot-rating">⭐ ${lot.rating}</div>
            </div>
            <div class="lot-card-body">
                <h3>${lot.name}</h3>
                <p class="lot-location">📍 ${lot.location}</p>
                <div class="lot-stats">
                    <div class="lot-stat">
                        <span class="stat-label">Available:</span>
                        <span class="stat-value">${lot.availableSpaces}/${lot.totalSpaces}</span>
                    </div>
                    <div class="lot-stat">
                        <span class="stat-label">Rate:</span>
                        <span class="stat-value">$${lot.hourlyRate}/hr</span>
                    </div>
                </div>
                <div class="lot-availability-bar">
                    <div class="availability-filled" style="width: ${(lot.availableSpaces / lot.totalSpaces) * 100}%"></div>
                </div>
                <button class="book-lot-btn" onclick="bookParking(${lot.id})">Book Now</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Display active booking
function displayActiveBooking() {
    const activeCard = document.getElementById('activeBookingCard');
    const noActiveBooking = document.getElementById('noActiveBooking');
    
    const activeBooking = userBookings.find(b => b.status === 'active');
    
    if (activeBooking) {
        activeCard.classList.remove('hidden');
        noActiveBooking.classList.add('hidden');
        
        const endTime = new Date(activeBooking.startTime.getTime() + activeBooking.duration * 60 * 60 * 1000);
        const timeRemaining = Math.max(0, (endTime - new Date()) / (60 * 1000));
        
        activeCard.innerHTML = `
            <div class="active-booking-info">
                <div class="booking-main">
                    <h3>${activeBooking.lotName}</h3>
                    <p>Space #${activeBooking.spaceNo}</p>
                </div>
                <div class="booking-time">
                    <p><strong>Time Remaining:</strong></p>
                    <p class="time-remaining">${Math.floor(timeRemaining)} minutes</p>
                </div>
                <div class="booking-actions">
                    <button class="action-btn primary" onclick="window.location.href='bookings.html'">View Details</button>
                    <button class="action-btn secondary" onclick="extendBooking()">Extend</button>
                </div>
            </div>
        `;
    } else {
        activeCard.classList.add('hidden');
        noActiveBooking.classList.remove('hidden');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Logout button
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

// Book parking
function bookParking(lotId) {
    // Redirect to booking page with lot ID (correct path)
    window.location.href = `../pages/booking.html?lot=${lotId}`;
}

// Extend booking
function extendBooking() {
    alert('Redirecting to booking details to extend your parking time...');
    window.location.href = 'bookings.html';
}

// Auto-update active booking timer
setInterval(() => {
    displayActiveBooking();
}, 60000); // Update every minute