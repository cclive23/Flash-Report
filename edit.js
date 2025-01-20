// Function to populate form with existing record data
function populateForm(record) {
    document.getElementById('record-no').value = record.recordNo;
    document.getElementById('record-type').value = record.type.toLowerCase();
    document.getElementById('title').value = record.title;
    document.getElementById('description').value = record.description || '';
    document.getElementById('geolocation').value = record.geolocation;
}

// Handle form submission
document.getElementById('edit-record-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const recordNo = document.getElementById('record-no').value;
    let records = JSON.parse(localStorage.getItem('records') || '[]');
    const recordIndex = records.findIndex(r => r.recordNo === recordNo);
    
    if (recordIndex !== -1) {
        // Get the existing record
        const existingRecord = records[recordIndex];
        
        // Create updated record maintaining original data
        const updatedRecord = {
            ...existingRecord, // Keep all existing properties
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            geolocation: document.getElementById('geolocation').value,
            type: document.getElementById('record-type').value,
            lastUpdated: new Date().toISOString()
        };
        
        // Update the record in the array
        records[recordIndex] = updatedRecord;
        
        // Save back to localStorage
        localStorage.setItem('records', JSON.stringify(records));
        alert('Record updated successfully!');
        window.location.href = 'user.html';
    } else {
        alert('Error updating record');
    }
});

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    const recordNo = new URLSearchParams(window.location.search).get('recordNo');
    if (!recordNo) {
        alert('No record specified for editing');
        window.location.href = 'user.html';
        return;
    }

    const records = JSON.parse(localStorage.getItem('records') || '[]');
    const record = records.find(r => r.recordNo === recordNo);
    
    if (!record) {
        alert('Record not found');
        window.location.href = 'user.html';
        return;
    }

    // Check if record is editable (status is 'Pending')
    if (record.status !== 'Pending') {
        alert('Only records with Pending status can be edited.');
        window.location.href = 'user.html';
        return;
    }

    // Populate form with record data
    populateForm(record);
});
