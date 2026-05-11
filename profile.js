// Sample user data
let userData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    dob: '1990-05-15',
    address: '123 Main Street, Apt 4B',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    avatar: 'https://via.placeholder.com/120'
};

let userVehicles = [
    {
        id: 1,
        make: 'Toyota',
        model: 'Camry',
        year: 2022,
        plate: 'ABC-1234',
        color: 'Black',
        default: true
    },
    {
        id: 2,
        make: 'Honda',
        model: 'Civic',
        year: 2021,
        plate: 'XYZ-5678',
        color: 'White'
    }
];

let paymentMethods = [
    {
        id: 1,
        type: 'Credit Card',
        cardName: 'John Doe',
        cardNumber: '**** **** **** 1234',
        expiryDate: '12/25',
        default: true
    },
    {
        id: 2,
        type: 'Digital Wallet',
        name: 'Apple Pay',
        default: false
    }
];

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    setupTabNavigation();
    loadPersonalInfo();
    loadVehicles();
    loadPaymentMethods();
    setupEventListeners();
    setupLogout();
});

// Setup tab navigation
function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.profile-tab-btn');
    const tabContents = document.querySelectorAll('.profile-section');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;
            
            // Remove active class
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(t => t.classList.remove('active'));
            
            // Add active class
            btn.classList.add('active');
            document.getElementById(`${tabName}-tab`).classList.add('active');
        });
    });
}

// Load personal information
function loadPersonalInfo() {
    document.getElementById('firstName').value = userData.firstName;
    document.getElementById('lastName').value = userData.lastName;
    document.getElementById('email').value = userData.email;
    document.getElementById('phone').value = userData.phone;
    document.getElementById('dob').value = userData.dob;
    document.getElementById('address').value = userData.address;
    document.getElementById('city').value = userData.city;
    document.getElementById('state').value = userData.state;
    document.getElementById('zip').value = userData.zip;
    document.getElementById('avatarImg').src = userData.avatar;

    // Update profile header
    document.getElementById('userName').textContent = `${userData.firstName} ${userData.lastName}`;
    document.getElementById('userEmail').textContent = userData.email;
    document.getElementById('memberSince').textContent = 'Member since January 2024';

    // Setup profile stats
    document.getElementById('profileBookings').textContent = '24';
    document.getElementById('profileRating').textContent = '4.8';
    document.getElementById('profileSpent').textContent = '$385.00';

    // Setup form submission
    document.getElementById('personalForm').addEventListener('submit', (e) => {
        e.preventDefault();
        savePersonalInfo();
    });

    // Setup avatar change
    document.getElementById('changeAvatarBtn').addEventListener('click', () => {
        document.getElementById('avatarInput').click();
    });

    document.getElementById('avatarInput').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                userData.avatar = event.target.result;
                document.getElementById('avatarImg').src = userData.avatar;
                alert('Avatar updated successfully!');
            };
            reader.readAsDataURL(file);
        }
    });
}

// Save personal information
function savePersonalInfo() {
    userData.firstName = document.getElementById('firstName').value;
    userData.lastName = document.getElementById('lastName').value;
    userData.email = document.getElementById('email').value;
    userData.phone = document.getElementById('phone').value;
    userData.dob = document.getElementById('dob').value;
    userData.address = document.getElementById('address').value;
    userData.city = document.getElementById('city').value;
    userData.state = document.getElementById('state').value;
    userData.zip = document.getElementById('zip').value;

    document.getElementById('userName').textContent = `${userData.firstName} ${userData.lastName}`;
    document.getElementById('userEmail').textContent = userData.email;

    alert('Personal information updated successfully!');
}

// Load vehicles
function loadVehicles() {
    const vehiclesList = document.getElementById('vehiclesList');
    vehiclesList.innerHTML = '';

    userVehicles.forEach((vehicle, index) => {
        const vehicleCard = document.createElement('div');
        vehicleCard.className = 'vehicle-card';
        vehicleCard.innerHTML = `
            <div class="vehicle-info">
                <h4>${vehicle.make} ${vehicle.model}</h4>
                <p>Year: ${vehicle.year}</p>
                <p>License Plate: <strong>${vehicle.plate}</strong></p>
                <p>Color: ${vehicle.color}</p>
                ${vehicle.default ? '<p class="default-badge">Default Vehicle</p>' : ''}
            </div>
            <div class="vehicle-actions">
                <button class="edit-btn" onclick="editVehicle(${index})">Edit</button>
                <button class="delete-btn" onclick="deleteVehicle(${index})">Delete</button>
                ${!vehicle.default ? `<button class="set-default-btn" onclick="setDefaultVehicle(${index})">Set Default</button>` : ''}
            </div>
        `;
        vehiclesList.appendChild(vehicleCard);
    });
}

// Add vehicle
document.addEventListener('DOMContentLoaded', () => {
    const addVehicleBtn = document.getElementById('addVehicleBtn');
    if (addVehicleBtn) {
        addVehicleBtn.addEventListener('click', () => {
            document.getElementById('addVehicleForm').classList.remove('hidden');
        });
    }

    const cancelVehicleBtn = document.getElementById('cancelVehicleBtn');
    if (cancelVehicleBtn) {
        cancelVehicleBtn.addEventListener('click', () => {
            document.getElementById('addVehicleForm').classList.add('hidden');
            document.getElementById('vehicleForm').reset();
        });
    }

    const vehicleForm = document.getElementById('vehicleForm');
    if (vehicleForm) {
        vehicleForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const newVehicle = {
                id: userVehicles.length + 1,
                make: document.getElementById('vehicleMake').value,
                model: document.getElementById('vehicleModel').value,
                year: document.getElementById('vehicleYear').value,
                plate: document.getElementById('vehiclePlate').value,
                color: document.getElementById('vehicleColor').value,
                default: false
            };

            userVehicles.push(newVehicle);
            loadVehicles();
            document.getElementById('addVehicleForm').classList.add('hidden');
            vehicleForm.reset();
            alert('Vehicle added successfully!');
        });
    }
});

// Edit vehicle
function editVehicle(index) {
    alert(`Editing: ${userVehicles[index].make} ${userVehicles[index].model}`);
}

// Delete vehicle
function deleteVehicle(index) {
    if (confirm('Are you sure you want to delete this vehicle?')) {
        userVehicles.splice(index, 1);
        loadVehicles();
        alert('Vehicle deleted successfully!');
    }
}

// Set default vehicle
function setDefaultVehicle(index) {
    userVehicles.forEach(v => v.default = false);
    userVehicles[index].default = true;
    loadVehicles();
    alert('Default vehicle updated!');
}

// Load payment methods
function loadPaymentMethods() {
    const paymentList = document.getElementById('paymentMethods');
    paymentList.innerHTML = '';

    paymentMethods.forEach((method, index) => {
        const methodCard = document.createElement('div');
        methodCard.className = 'payment-card';
        methodCard.innerHTML = `
            <div class="payment-info">
                <h4>${method.type}</h4>
                <p>${method.cardNumber || method.name}</p>
                ${method.expiryDate ? `<p>Expires: ${method.expiryDate}</p>` : ''}
                ${method.default ? '<p class="default-badge">Default Method</p>' : ''}
            </div>
            <div class="payment-actions">
                <button class="delete-btn" onclick="deletePaymentMethod(${index})">Delete</button>
                ${!method.default ? `<button class="set-default-btn" onclick="setDefaultPayment(${index})">Set Default</button>` : ''}
            </div>
        `;
        paymentList.appendChild(methodCard);
    });
}

// Add payment method
document.addEventListener('DOMContentLoaded', () => {
    const addPaymentBtn = document.getElementById('addPaymentBtn');
    if (addPaymentBtn) {
        addPaymentBtn.addEventListener('click', () => {
            document.getElementById('addPaymentForm').classList.remove('hidden');
        });
    }

    const cancelPaymentBtn = document.getElementById('cancelPaymentBtn');
    if (cancelPaymentBtn) {
        cancelPaymentBtn.addEventListener('click', () => {
            document.getElementById('addPaymentForm').classList.add('hidden');
            document.getElementById('paymentForm').reset();
        });
    }

    const paymentForm = document.getElementById('paymentForm');
    if (paymentForm) {
        paymentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const newPayment = {
                id: paymentMethods.length + 1,
                type: document.getElementById('paymentType').value,
                cardName: document.getElementById('cardName').value,
                cardNumber: '**** **** **** ' + document.getElementById('cardNumber').value.slice(-4),
                expiryDate: document.getElementById('expiryDate').value,
                default: false
            };

            paymentMethods.push(newPayment);
            loadPaymentMethods();
            document.getElementById('addPaymentForm').classList.add('hidden');
            paymentForm.reset();
            alert('Payment method added successfully!');
        });
    }
});

// Delete payment method
function deletePaymentMethod(index) {
    if (confirm('Are you sure you want to delete this payment method?')) {
        paymentMethods.splice(index, 1);
        loadPaymentMethods();
        alert('Payment method deleted successfully!');
    }
}

// Set default payment
function setDefaultPayment(index) {
    paymentMethods.forEach(m => m.default = false);
    paymentMethods[index].default = true;
    loadPaymentMethods();
    alert('Default payment method updated!');
}

// Setup other event listeners
function setupEventListeners() {
    // Preferences form
    const preferencesForm = document.getElementById('preferencesForm');
    if (preferencesForm) {
        preferencesForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Preferences updated successfully!');
        });
    }

    // Password form
    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (newPassword !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }

            alert('Password updated successfully!');
            passwordForm.reset();
        });
    }

    // Enable 2FA
    const enableTwoFABtn = document.getElementById('enableTwoFA');
    if (enableTwoFABtn) {
        enableTwoFABtn.addEventListener('click', () => {
            alert('Two-factor authentication enabled! Check your email for setup instructions.');
        });
    }

    // Session logout buttons
    document.querySelectorAll('.session-logout').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.parentElement.remove();
            alert('Session signed out successfully!');
        });
    });

    // Delete account
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', () => {
            if (confirm('Are you absolutely sure? This action cannot be undone.')) {
                if (confirm('All your data will be permanently deleted. Type "DELETE" to confirm.')) {
                    alert('Account deletion request submitted. We will delete your account within 30 days.');
                }
            }
        });
    }
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