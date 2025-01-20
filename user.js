// Select the hamburger menu and menu bar
const hamburgerMenu = document.querySelector('.hamburger-menu');
const sideMenu = document.querySelector('.side-menu');

// Function to toggle the side menu
const toggleMenu = () => {
    sideMenu.classList.toggle('active');
};

// Function to close the side menu
const closeMenu = () => {
    if (sideMenu.classList.contains('active')) {
        sideMenu.classList.remove('active');
    }
};

// Add click event listener to the hamburger menu
hamburgerMenu.addEventListener('click', (event) => {
    event.stopPropagation(); // Prevent click from propagating to the document
    toggleMenu();
});

// Add click event listener to the document to close the menu
document.addEventListener('click', () => {
    closeMenu();
});

// Prevent clicks inside the side menu from closing it
sideMenu.addEventListener('click', (event) => {
    event.stopPropagation(); // Prevent click from propagating to the document
});

// Function to load records for the current user
function loadRecords() {
    const records = JSON.parse(localStorage.getItem('records') || '[]');
    const userEmail = sessionStorage.getItem('userEmail');
    const tbody = document.querySelector('.records-table tbody');
    const tableContainer = document.querySelector('.table-container');
    
    // Clear existing content
    tbody.innerHTML = '';
    
    // Remove existing no-records message if it exists
    const existingMessage = document.querySelector('.no-records-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Filter records for current user
    const userRecords = records.filter(record => record.userEmail === userEmail);
    
    if (userRecords.length === 0) {
        const noRecordsMessage = document.createElement('div');
        noRecordsMessage.className = 'no-records-message';
        noRecordsMessage.textContent = 'No records created yet';
        tableContainer.appendChild(noRecordsMessage);
    } else {
        userRecords.forEach(record => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${record.recordNo}</td>
                <td>${record.title}</td>
                <td>${record.geolocation}</td>
                <td>${record.type}</td>
                <td>${record.status}</td>
            `;
            tbody.appendChild(tr);
        });
    }
}

// Load records when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const userEmail = sessionStorage.getItem('userEmail');
    const userName = sessionStorage.getItem('userName');
    const userRole = sessionStorage.getItem('userRole');
    
    // Redirect if not logged in
    if (!userEmail || !userName) {
        alert('Please log in to access this page.');
        window.location.href = 'account.html';
        return;
    }
    
    // Redirect admin to admin page
    if (userRole === 'admin') {
        window.location.href = 'admin.html';
        return;
    }
    
    // Update welcome message
    const welcomeMessage = document.querySelector('.welcome-bar h2');
    if (welcomeMessage) {
        welcomeMessage.textContent = `Hello, ${userName}`;
    }
    
    // Load user's records
    loadRecords();
});

// Update the edit record functionality
document.querySelector('.edit-record').addEventListener('click', function(e) {
    e.preventDefault();
    
    const records = JSON.parse(localStorage.getItem('records') || '[]');
    const tableContainer = document.querySelector('.table-container');
    
    // Check if there are any records
    if (records.length === 0) {
        alert('No records available to edit.');
        tableContainer.classList.remove('moved');
        return;
    }
    
    // Check if there are any pending records
    const pendingRecords = records.filter(record => record.status === 'Pending');
    if (pendingRecords.length === 0) {
        alert('No pending records available to edit. Only records with "Pending" status can be edited.');
        tableContainer.classList.remove('moved');
        return;
    }
    
    // If we have pending records, proceed with the edit functionality
    tableContainer.classList.toggle('moved');
    
    const tableRows = document.querySelectorAll('.records-table tbody tr');
    
    // Remove existing dots
    document.querySelectorAll('.dots-wrapper').forEach(wrapper => {
        wrapper.remove();
    });
    
    // Create dots container if it doesn't exist
    let dotsContainer = document.querySelector('.dots-container');
    if (!dotsContainer) {
        dotsContainer = document.createElement('div');
        dotsContainer.className = 'dots-container';
        tableContainer.appendChild(dotsContainer);
    }
    
    tableRows.forEach((row, index) => {
        const status = row.querySelector('td:last-child').textContent.trim();
        
        if (status === 'Under Investigation') {
            row.classList.toggle('highlight-red');
        } else if (status === 'Pending') {
            row.classList.toggle('highlight-green');
            
            // Create dots wrapper
            const dotsWrapper = document.createElement('div');
            dotsWrapper.className = 'dots-wrapper';
            dotsWrapper.style.position = 'absolute';
            dotsWrapper.style.top = `${row.offsetTop}px`;
            dotsWrapper.style.height = `${row.offsetHeight}px`;
            
            // Create dots icon
            const dots = document.createElement('div');
            dots.className = 'dots-icon';
            dots.innerHTML = '<i class="fa-solid fa-ellipsis-vertical"></i>';
            
            // Create dropdown menu
            const dropdown = document.createElement('div');
            dropdown.className = 'dots-dropdown';
            dropdown.innerHTML = `
                <div class="dropdown-item edit">Edit</div>
                <div class="dropdown-item delete">Delete</div>
            `;
            
            // Add click event to dots with stopPropagation
            dots.addEventListener('click', function(event) {
                event.stopPropagation();
                
                // Close all other dropdowns
                document.querySelectorAll('.dots-dropdown.show').forEach(d => {
                    if (d !== dropdown) {
                        d.classList.remove('show');
                    }
                });
                
                // Toggle current dropdown
                dropdown.classList.toggle('show');
            });
            
            // Add click events for dropdown items
            dropdown.querySelector('.edit').addEventListener('click', function(event) {
                event.stopPropagation();
                const recordNo = row.querySelector('td:nth-child(1)').textContent;
                // Redirect to edit page with record number
                window.location.href = `editPage.html?recordNo=${recordNo}`;
                dropdown.classList.remove('show');
            });
            
            dropdown.querySelector('.delete').addEventListener('click', function(event) {
                event.stopPropagation();
                const recordNo = row.querySelector('td:nth-child(1)').textContent;
                if (confirm('Are you sure you want to delete this record?')) {
                    const records = JSON.parse(localStorage.getItem('records') || '[]');
                    const updatedRecords = records.filter(record => record.recordNo !== recordNo);
                    localStorage.setItem('records', JSON.stringify(updatedRecords));
                    
                    showNotification('Record deleted successfully');
                    setTimeout(() => {
                        location.reload(); // Force page reload
                    }, 1000);
                }
                dropdown.classList.remove('show');
            });
            
            dotsWrapper.appendChild(dots);
            dotsWrapper.appendChild(dropdown);
            dotsContainer.appendChild(dotsWrapper);
        }
    });
});

// Add click handler to document to close dropdowns when clicking outside
document.addEventListener('click', function(event) {
    if (!event.target.closest('.dots-wrapper')) {
        document.querySelectorAll('.dots-dropdown.show').forEach(dropdown => {
            dropdown.classList.remove('show');
        });
    }
});

//To get the current location

const x = document.getElementById("demo");

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else { 
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
    const locationDisplay = document.querySelector('.location-display');
    locationDisplay.innerHTML = `
        <i class="fa-solid fa-location-dot"></i>
        <span>${position.coords.latitude.toFixed(4)}°, ${position.coords.longitude.toFixed(4)}°</span>
    `;
}

// Call getLocation when the page loads
document.addEventListener('DOMContentLoaded', getLocation);

// Add a flag to track if location has been copied
let isLocationCopied = false;

// Update the location copy click handler
document.querySelector('.location-display').addEventListener('click', function(e) {
    // Create ripple effect
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    this.appendChild(ripple);
    
    // Copy location to clipboard
    const locationText = this.querySelector('span').textContent;
    navigator.clipboard.writeText(locationText).then(() => {
        isLocationCopied = true; // Set flag when location is copied
        this.classList.add('copied');
        
        setTimeout(() => {
            this.classList.remove('copied');
        }, 1000);
    });
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
});

// Add click handler for create record button
document.querySelector('.create-record').addEventListener('click', function(e) {
    e.preventDefault(); // Prevent default navigation
    
    const userRole = sessionStorage.getItem('userRole');
    if (userRole !== 'user' && userRole !== 'admin') {
        alert('Please log in to create a record.');
        window.location.href = 'account.html';
        return;
    }
    
    // Check if location has been copied
    if (!isLocationCopied) {
        alert('Please copy your location first by clicking on the coordinates.');
        // Add a visual hint by adding a temporary highlight class to location display
        const locationDisplay = document.querySelector('.location-display');
        locationDisplay.style.backgroundColor = 'rgba(255, 215, 0, 0.2)'; // Subtle gold highlight
        setTimeout(() => {
            locationDisplay.style.backgroundColor = ''; // Remove highlight after 1.5s
        }, 1500);
        return;
    }
    
    // If location is copied and user is logged in, proceed to create page
    window.location.href = 'createPage.html';
});

document.addEventListener('DOMContentLoaded', () => {
    // Get user name from sessionStorage
    const userName = sessionStorage.getItem('userName') || 'Guest';
    
    // Update the welcome message
    const welcomeMessage = document.querySelector('.welcome-bar h2');
    if (welcomeMessage) {
        welcomeMessage.textContent = `Hello, ${userName}`;
    }
    
    // ... rest of your existing DOMContentLoaded code ...
});

// Add logout functionality
document.querySelector('.side-menu li.logout').addEventListener('click', function() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear session data
        sessionStorage.clear();
        window.location.href = 'index.html';
    }
});

// Add event listener for search functionality
document.querySelector('.search-container button').addEventListener('click', function(e) {
    e.preventDefault();
    searchRecord();
});

// Add event listener for Enter key in search input
document.querySelector('.search-container input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        searchRecord();
    }
});

function searchRecord() {
    const searchInput = document.querySelector('.search-container input').value.trim();
    const userEmail = sessionStorage.getItem('userEmail');
    const records = JSON.parse(localStorage.getItem('records') || '[]');
    const tableContainer = document.querySelector('.table-container');
    const tbody = document.querySelector('.records-table tbody');
    
    // Clear existing table content
    tbody.innerHTML = '';
    
    // Remove existing no-records message if it exists
    const existingMessage = document.querySelector('.no-records-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    if (!searchInput) {
        // If search is empty, show all user's records
        loadRecords();
        return;
    }
    
    // Filter records by record number and user email
    const filteredRecords = records.filter(record => 
        record.recordNo === searchInput && record.userEmail === userEmail
    );
    
    if (filteredRecords.length === 0) {
        // Display no records found message
        const noRecordsMessage = document.createElement('div');
        noRecordsMessage.className = 'no-records-message';
        noRecordsMessage.textContent = `No record found with number: ${searchInput}`;
        tableContainer.appendChild(noRecordsMessage);
    } else {
        // Display found records
        filteredRecords.forEach(record => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${record.recordNo}</td>
                <td>${record.title}</td>
                <td>${record.geolocation}</td>
                <td>${record.type}</td>
                <td>${record.status}</td>
            `;
            tbody.appendChild(tr);
        });
    }
}



