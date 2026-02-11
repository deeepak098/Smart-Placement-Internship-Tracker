// Application data structure
let applications = [];

// DOM Elements
const applicationForm = document.getElementById('applicationForm');
const applicationsBody = document.getElementById('applicationsBody');
const noApplicationsMessage = document.getElementById('noApplicationsMessage');
const applicationsTable = document.getElementById('applicationsTable');

// Summary elements
const totalApplicationsEl = document.getElementById('totalApplications');
const totalInterviewsEl = document.getElementById('totalInterviews');
const totalOffersEl = document.getElementById('totalOffers');
const totalRejectionsEl = document.getElementById('totalRejections');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    loadApplications();
    renderApplications();
    updateSummary();

    // Set default date to today
    document.getElementById('appliedDate').valueAsDate = new Date();
});

// Load applications from localStorage
function loadApplications() {
    const storedApplications = localStorage.getItem('placementApplications');
    if (storedApplications) {
        applications = JSON.parse(storedApplications);
    }
}

// Save applications to localStorage
function saveApplications() {
    localStorage.setItem('placementApplications', JSON.stringify(applications));
}

// Handle form submission
applicationForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form values
    const companyName = document.getElementById('companyName').value.trim();
    const role = document.getElementById('role').value.trim();
    const stage = document.getElementById('stage').value;
    const result = document.getElementById('result').value;
    const appliedDate = document.getElementById('appliedDate').value;

    // Validation
    if (!companyName || !role || !stage || !result || !appliedDate) {
        alert('Please fill all required fields!');
        return;
    }

    // Create new application object
    const newApplication = {
        id: Date.now(), // Simple unique ID
        companyName,
        role,
        stage,
        result,
        appliedDate
    };

    // Add to applications array
    applications.push(newApplication);

    // Save to localStorage
    saveApplications();

    // Update UI
    renderApplications();
    updateSummary();

    // Reset form
    applicationForm.reset();
    document.getElementById('appliedDate').valueAsDate = new Date();

    // Show success feedback
    alert(`Application for ${companyName} added successfully!`);
});

// Render applications in the table
function renderApplications() {
    // Clear current table body
    applicationsBody.innerHTML = '';

    // Show/hide table and no applications message
    if (applications.length === 0) {
        applicationsTable.style.display = 'none';
        noApplicationsMessage.style.display = 'flex';
    } else {
        applicationsTable.style.display = 'table';
        noApplicationsMessage.style.display = 'none';

        // Add each application to the table
        applications.forEach(app => {
            const row = document.createElement('tr');

            // Format date for display
            const formattedDate = new Date(app.appliedDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });

            // Determine CSS class for stage badge
            let stageClass = '';
            switch(app.stage) {
                case 'Applied': stageClass = 'stage-applied'; break;
                case 'Online Assessment (OA)': stageClass = 'stage-oa'; break;
                case 'Interview': stageClass = 'stage-interview'; break;
                case 'Offer': stageClass = 'stage-offer'; break;
                case 'Rejected': stageClass = 'stage-rejected'; break;
                default: stageClass = 'stage-applied';
            }

            // Determine CSS class for result badge
            let resultClass = '';
            switch(app.result) {
                case 'Pending': resultClass = 'result-pending'; break;
                case 'Cleared': resultClass = 'result-cleared'; break;
                case 'Rejected': resultClass = 'result-rejected'; break;
                default: resultClass = 'result-pending';
            }

            // Create table row content
            row.innerHTML = `
                <td>${app.companyName}</td>
                <td>${app.role}</td>
                <td><span class="stage-badge ${stageClass}">${app.stage}</span></td>
                <td><span class="result-badge ${resultClass}">${app.result}</span></td>
                <td>${formattedDate}</td>
                <td>
                    <button class="btn btn-delete delete-btn" data-id="${app.id}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            `;

            applicationsBody.appendChild(row);
        });

        // Add event listeners to delete buttons
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                deleteApplication(id);
            });
        });
    }
}

// Delete an application
function deleteApplication(id) {
    if (confirm('Are you sure you want to delete this application?')) {
        // Filter out the application with the given id
        applications = applications.filter(app => app.id !== id);

        // Save to localStorage
        saveApplications();

        // Update UI
        renderApplications();
        updateSummary();

        // Show feedback
        alert('Application deleted successfully!');
    }
}

// Update summary section
function updateSummary() {
    const totalApplications = applications.length;
    const totalInterviews = applications.filter(app =>
        app.stage === 'Interview' || app.stage === 'Offer'
    ).length;
    const totalOffers = applications.filter(app => app.stage === 'Offer').length;
    const totalRejections = applications.filter(app => app.result === 'Rejected').length;

    // Update summary UI
    totalApplicationsEl.textContent = totalApplications;
    totalInterviewsEl.textContent = totalInterviews;
    totalOffersEl.textContent = totalOffers;
    totalRejectionsEl.textContent = totalRejections;
}

// Add some dummy data on first load if no data exists
if (!localStorage.getItem('placementApplications')) {
    // Add dummy data
    const dummyApplications = [
        {
            id: 1,
            companyName: "TechCorp Inc.",
            role: "Software Engineer Intern",
            stage: "Applied",
            result: "Pending",
            appliedDate: new Date().toISOString().split('T')[0]
        },
        {
            id: 2,
            companyName: "DataSystems Ltd.",
            role: "Data Analyst",
            stage: "Online Assessment (OA)",
            result: "Cleared",
            appliedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        },
        {
            id: 3,
            companyName: "InnovateSoft",
            role: "Frontend Developer",
            stage: "Interview",
            result: "Pending",
            appliedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        },
        {
            id: 4,
            companyName: "GlobalBank",
            role: "Cybersecurity Analyst",
            stage: "Offer",
            result: "Cleared",
            appliedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        },
        {
            id: 5,
            companyName: "RetailGiant",
            role: "Product Manager Intern",
            stage: "Rejected",
            result: "Rejected",
            appliedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }
    ];

    applications = dummyApplications;
    saveApplications();
    renderApplications();
    updateSummary();
}