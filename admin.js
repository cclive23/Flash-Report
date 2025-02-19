// Handle hamburger menu
document.querySelector('.hamburger-menu').addEventListener('click', function() {
    document.querySelector('.side-menu').classList.toggle('active');
});

// Sample records data (in a real application, this would come from a database)
const records = [
    {
        id: 1,
        type: 'Red-Flag',
        title: 'Corruption in Department X',
        status: 'pending',
        description: 'Reported case of bribery...',
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
    },
    {
        id: 2,
        type: 'Intervention',
        title: 'Road Maintenance Required',
        status: 'pending',
        description: 'Poor road conditions...',
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
    }
];

// Function to update record status
function updateStatus(recordId, newStatus) {
    if (confirm(`Are you sure you want to mark this record as ${newStatus}?`)) {
        const record = records.find(r => r.id === recordId);
        if (record) {
            record.status = newStatus;
            renderRecords();
            showNotification(`Record status updated to ${newStatus}`);
        }
    }
}

// Function to render records
function renderRecords() {
    const recordsList = document.querySelector('.records-list');
    recordsList.innerHTML = records.map(record => `
        <div class="record-card">
            <h3>${record.type}: ${record.title}</h3>
            <p>${record.description}</p>
            <div class="status-section">
                <p>Current Status: <span class="status-${record.status}">${record.status}</span></p>
                <div class="status-controls">
                    <button onclick="updateStatus(${record.id}, 'under-investigation')" 
                            class="status-btn investigation">Under Investigation</button>
                    <button onclick="updateStatus(${record.id}, 'rejected')" 
                            class="status-btn rejected">Reject</button>
                    <button onclick="updateStatus(${record.id}, 'resolved')" 
                            class="status-btn resolved">Resolve</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Initialize the page
document.addEventListener('DOMContentLoaded', renderRecords);

// Add this to admin.js
function addSearchAndFilter() {
    const searchHTML = `
        <div class="search-filter-container">
            <input type="text" id="searchRecords" placeholder="Search records...">
            <select id="filterStatus">
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="under-investigation">Under Investigation</option>
                <option value="rejected">Rejected</option>
                <option value="resolved">Resolved</option>
            </select>
        </div>
    `;
    
    document.querySelector('.records-section h2').insertAdjacentHTML('afterend', searchHTML);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Add sorting functionality
function sortRecords(criteria) {
    records.sort((a, b) => {
        switch(criteria) {
            case 'date':
                return new Date(b.createdAt) - new Date(a.createdAt);
            case 'status':
                return a.status.localeCompare(b.status);
            default:
                return 0;
        }
    });
    renderRecords();
}

// Function to load and display records based on filter
function loadFilteredRecords() {
    const records = JSON.parse(localStorage.getItem('records') || '[]');
    const statusFilter = document.getElementById('statusFilter').value;
    const tableContainer = document.querySelector('.records-table-container');
    
    const filteredRecords = statusFilter === 'all' 
        ? records 
        : records.filter(record => record.status.toLowerCase() === statusFilter.toLowerCase());
    
    // Update table structure
    tableContainer.innerHTML = `
        <table class="records-table">
            <thead>
                <tr>
                    <th>Record No.</th>
                    <th>Title</th>
                    <th>Geolocation</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
        ${filteredRecords.length === 0 ? 
            `<div class="no-records-message">
                No ${statusFilter === 'all' ? '' : statusFilter.toLowerCase()} records found
            </div>` : ''
        }
    `;
    
    if (filteredRecords.length > 0) {
        const tbody = tableContainer.querySelector('.records-table tbody');
        
        filteredRecords.forEach(record => {
            const tr = document.createElement('tr');
            tr.className = record.status.toLowerCase() === 'resolved' ? 'highlight-green' : 
                          record.status.toLowerCase() === 'rejected' ? 'highlight-red' : '';
            
            tr.innerHTML = `
                <td>${record.recordNo}</td>
                <td>${record.title}</td>
                <td>${record.geolocation}</td>
                <td>${record.type}</td>
                <td>
                    <select class="status-update" data-record-no="${record.recordNo}">
                        <option value="Pending" ${record.status === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="Under Investigation" ${record.status === 'Under Investigation' ? 'selected' : ''}>Under Investigation</option>
                        <option value="Resolved" ${record.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
                        <option value="Rejected" ${record.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
                    </select>
                </td>
                <td>
                    <button class="view-details-btn" onclick="viewRecordDetails('${record.recordNo}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="delete-btn" onclick="deleteRecord('${record.recordNo}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
}

// Update the updateRecordStatus function
function updateRecordStatus(recordNo, newStatus) {
    const records = JSON.parse(localStorage.getItem('records') || '[]');
    const recordIndex = records.findIndex(r => r.recordNo === recordNo);
    
    if (recordIndex !== -1) {
        records[recordIndex].status = newStatus;
        records[recordIndex].lastUpdated = new Date().toISOString();
        localStorage.setItem('records', JSON.stringify(records));
        showNotification(`Record status updated to ${newStatus}`);
        
        // Reload the page to reflect changes
        loadFilteredRecords();
    }
}

// Update deleteRecord function
function deleteRecord(recordNo) {
    if (confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
        const records = JSON.parse(localStorage.getItem('records') || '[]');
        const updatedRecords = records.filter(r => r.recordNo !== recordNo);
        localStorage.setItem('records', JSON.stringify(updatedRecords));
        showNotification('Record deleted successfully');
        
        // Immediately reload the page
        window.location.reload();
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Get admin name from sessionStorage
    const adminName = sessionStorage.getItem('userName') || 'Admin';
    
    // Update the welcome message
    const welcomeMessage = document.querySelector('.welcome-bar h2');
    if (welcomeMessage) {
        welcomeMessage.textContent = `Hello, ${adminName}`;
    }

    // Check if user is logged in and has admin role
    const userRole = sessionStorage.getItem('userRole');
    if (!userRole || userRole !== 'admin') {
        alert('Unauthorized access. Please log in as an admin.');
        window.location.href = 'account.html';
        return;
    }

    // Load filtered records
    loadFilteredRecords();
    
    // Add filter change listener
    document.getElementById('statusFilter').addEventListener('change', loadFilteredRecords);
    
    // Add status update listener
    document.querySelector('.records-table').addEventListener('change', (e) => {
        if (e.target.classList.contains('status-update')) {
            const newStatus = e.target.value;
            const recordNo = e.target.dataset.recordNo;
            
            if (newStatus) {
                if (confirm(`Are you sure you want to update this record's status to ${newStatus}?`)) {
                    updateRecordStatus(recordNo, newStatus);
                } else {
                    // Reset select to previous value if cancelled
                    const record = JSON.parse(localStorage.getItem('records') || '[]')
                        .find(r => r.recordNo === recordNo);
                    if (record) {
                        e.target.value = record.status;
                    }
                }
            }
        }
    });
});

document.querySelector('.side-menu li.logout').addEventListener('click', function() {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = 'index.html';
    }
});

// Add popup HTML to the document
document.body.insertAdjacentHTML('beforeend', `
    <div class="popup-overlay">
        <div class="popup-content">
            <span class="popup-close">&times;</span>
            <h2>Record Details</h2>
            <div class="record-details"></div>
        </div>
    </div>
`);

// Function to view record details
function viewRecordDetails(recordNo) {
    const records = JSON.parse(localStorage.getItem('records') || '[]');
    const record = records.find(r => r.recordNo === recordNo);
    
    if (record) {
        const detailsHTML = `
            <p><span class="label">Record No:</span> ${record.recordNo}</p>
            <p><span class="label">Title:</span> ${record.title}</p>
            <p><span class="label">Type:</span> ${record.type}</p>
            <p><span class="label">Status:</span> ${record.status}</p>
            <p><span class="label">Geolocation:</span> ${record.geolocation}</p>
            <p><span class="label">User Email:</span> ${record.userEmail}</p>
            <p><span class="label">Created:</span> ${new Date(record.createdAt).toLocaleString()}</p>
            <p><span class="label">Last Updated:</span> ${new Date(record.lastUpdated).toLocaleString()}</p>
            ${record.description ? `<p><span class="label">Description:</span> ${record.description}</p>` : ''}
        `;
        
        document.querySelector('.record-details').innerHTML = detailsHTML;
        document.querySelector('.popup-overlay').style.display = 'flex';
    }
}

// Close popup when clicking the close button or outside the popup
document.querySelector('.popup-close').addEventListener('click', () => {
    document.querySelector('.popup-overlay').style.display = 'none';
});

document.querySelector('.popup-overlay').addEventListener('click', (e) => {
    if (e.target === document.querySelector('.popup-overlay')) {
        document.querySelector('.popup-overlay').style.display = 'none';
    }
});
