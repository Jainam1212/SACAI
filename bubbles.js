// Debugging: Log start
console.log('Starting bubbles.js');

// Check Konva availability
if (typeof Konva === 'undefined') {
    console.error('Konva is not defined. Ensure Konva.js loads before bubbles.js');
    throw new Error('Konva.js required');
}

// Initialize main Konva stage
console.log('Initializing Konva stage');
let width = window.innerWidth;
let height = window.innerHeight;
const stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height
});
const layer = new Konva.Layer();
stage.add(layer);

// Handle window resize
window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    stage.width(width);
    stage.height(height);
    stage.draw();
    console.log('Resized stage:', width, height);
});

// Cache for job titles
let jobsByTitle = {};
let allJobTitles = [];
let displayedJobTitles = [];
const jobsPerPage = 6;
let currentPage = 0;

console.log('Fetching companies.json');
fetch('data/companies.json')
    .then(response => {
        console.log('Fetch response:', response.status, response.url);
        if (!response.ok) throw new Error(`Failed to load companies.json: ${response.status}`);
        return response.json();
    })
    .then(data => {
        console.log('JSON loaded, companies:', data.companies.length);

        // Group companies by job title
        data.companies.forEach(company => {
            company.jobs.forEach(job => {
                const jobTitle = job.title?.trim() || 'Unknown';
                if (!jobsByTitle[jobTitle]) {
                    jobsByTitle[jobTitle] = [];
                }
                jobsByTitle[jobTitle].push({ company, job });
            });
        });

        // Sort job titles by company count
        allJobTitles = Object.keys(jobsByTitle).sort((a, b) => 
            jobsByTitle[b].length - jobsByTitle[a].length
        );
        console.log('Job titles:', allJobTitles);

        // Display first page
        loadMoreJobs();
    })
    .catch(error => console.error('Error loading JSON:', error));

// Load jobs as large bubbles
function loadMoreJobs() {
    console.log('Loading more jobs, page:', currentPage);
    const start = currentPage * jobsPerPage;
    const end = Math.min(start + jobsPerPage, allJobTitles.length);
    const jobsToDisplay = allJobTitles.slice(start, end);

    const centerX = width / 2;
    const centerY = height / 2;
    const baseRadius = Math.min(width, height) / 3.5 + currentPage * 50;

    jobsToDisplay.forEach((jobTitle, index) => {
        if (displayedJobTitles.includes(jobTitle)) return;
        displayedJobTitles.push(jobTitle);

        // Color gradient
        const t = jobsToDisplay.length > 1 ? index / (jobsToDisplay.length - 1) : 0;
        const r = Math.floor(100 + t * 155);
        const g = Math.floor(50 + t * 100);
        const b = Math.floor(150 + t * 100);
        const color = `rgb(${r},${g},${b})`;

        // Large bubble
        const circle = new Konva.Circle({
            x: 0,
            y: 0,
            radius: 45,
            fill: color,
            shadowColor: 'white',
            shadowBlur: 3,
            shadowOffset: { x: 1, y: 1 },
            shadowOpacity: 0.3,
            data: { jobTitle, entries: jobsByTitle[jobTitle] }
        });

        // Job title label
        const label = new Konva.Text({
            x: -35,
            y: -5,
            text: jobTitle,
            fontSize: 10,
            fontFamily: 'Arial',
            fill: 'white',
            align: 'center',
            verticalAlign: 'middle',
            width: 80,
            wrap: 'word'
        });

        const group = new Konva.Group({
            x: centerX,
            y: centerY
        });
        group.add(circle, label);
        layer.add(group);

        // Spiral animation
        const globalIndex = displayedJobTitles.length - 1;
        const baseAngle = (globalIndex % jobsPerPage) / jobsPerPage * 2 * Math.PI;
        const spiralFactor = 0.05 * globalIndex;
        const radius = baseRadius + spiralFactor * 10;

        new Konva.Tween({
            node: group,
            duration: 0.8,
            x: centerX + radius * Math.cos(baseAngle + spiralFactor),
            y: centerY + radius * Math.sin(baseAngle + spiralFactor),
            easing: Konva.Easings.EaseOut,
            onFinish: () => {
                console.log('Bubble positioned:', jobTitle, 'X:', group.x(), 'Y:', group.y());
            }
        }).play();

        // Click for burst and popup
        circle.on('click', () => {
            console.log('Clicked bubble:', jobTitle, 'Entries:', jobsByTitle[jobTitle]?.length);
            if (!jobsByTitle[jobTitle] || !jobsByTitle[jobTitle].length) {
                console.error('No entries for', jobTitle);
                return;
            }
            new Konva.Tween({
                node: circle,
                duration: 0.15,
                opacity: 0,
                scaleX: 1.2,
                scaleY: 1.2,
                onFinish: () => {
                    circle.opacity(1);
                    circle.scaleX(1);
                    circle.scaleY(1);
                    console.log('Burst finished, opening popup for', jobTitle);
                    showCompaniesPopup(jobsByTitle[jobTitle], color);
                }
            }).play();
        });
    });

    layer.batchDraw();
    console.log('Displayed jobs:', jobsToDisplay, 'Total bubbles:', layer.children.length);

    // Load More button
    if (end >= allJobTitles.length) {
        const loadMoreButton = document.getElementById('load-more');
        if (loadMoreButton) {
            loadMoreButton.style.display = 'none';
        }
    } else {
        const loadMoreButton = document.getElementById('load-more') || document.createElement('button');
        if (!loadMoreButton.id) {
            loadMoreButton.id = 'load-more';
            loadMoreButton.textContent = 'Load More';
            loadMoreButton.onclick = loadMoreJobs;
            document.body.appendChild(loadMoreButton);
        }
        loadMoreButton.style.display = 'block';
    }

    currentPage++;
}

// Show companies in popup
function showCompaniesPopup(entries, parentColor) {
    console.log('Attempting to show popup, entries:', entries.length);
    const popup = document.getElementById('popup');
    const container = document.getElementById('small-bubbles-container');
    
    if (!popup || !container) {
        console.error('Popup or container missing:', { popup, container });
        return;
    }

    container.innerHTML = '';

    const popupWidth = container.offsetWidth || 700;
    const popupHeight = container.offsetHeight || 500;
    console.log('Popup dimensions:', popupWidth, popupHeight);

    const popupStage = new Konva.Stage({
        container: 'small-bubbles-container',
        width: popupWidth,
        height: popupHeight
    });
    const popupLayer = new Konva.Layer();
    popupStage.add(popupLayer);

    const centerX = popupWidth / 2;
    const centerY = popupHeight / 2;
    const maxRadius = Math.min(popupWidth, popupHeight) / 4; // Increased spacing

    const maxCompanies = 6;
    const displayEntries = entries.slice(0, maxCompanies);

    const rgb = parentColor.match(/\d+/g)?.map(Number) || [100, 50, 150];
    const lighterColor = `rgb(${Math.min(rgb[0] + 60, 255)},${Math.min(rgb[1] + 60, 255)},${Math.min(rgb[2] + 60, 255)})`;

    displayEntries.forEach((entry, index) => {
        const company = entry.company;
        const job = entry.job;
        const angle = (index / displayEntries.length) * 2 * Math.PI;
        const x = centerX + maxRadius * Math.cos(angle);
        const y = centerY + maxRadius * Math.sin(angle);

        const circle = new Konva.Circle({
            x: x,
            y: y,
            radius: 40, // Increased from 35px
            fill: lighterColor,
            shadowBlur: 0, // Removed for clarity
            data: { company, job }
        });

        const label = new Konva.Text({
            x: x,
            y: y,
            text: `${company.name}\n${job.location}`,
            fontSize: 14, // Increased for clarity
            fontFamily: 'Arial',
            fill: 'black',
            align: 'center',
            verticalAlign: 'middle',
            offsetX: 35,
            offsetY: 7,
            width: 80, // Wider for readability
            wrap: 'word'
        });

        const group = new Konva.Group();
        group.add(circle, label);
        popupLayer.add(group);

        circle.on('click', () => {
            console.log('Clicked small bubble:', company.name);
            showCompanyDetails(company, job);
        });
    });

    popupLayer.batchDraw();
    popup.style.display = 'block';
    console.log('Popup rendered successfully');
}

// Show company details
function showCompanyDetails(company, job) {
    console.log('Showing details for:', company.name);
    const modal = document.getElementById('modal');
    const details = document.getElementById('company-details');

    let jobsHtml = '<h3>Selected Job:</h3><ul>';
    jobsHtml += `
        <li>
            <strong>${job.title}</strong> (${job.location}, ${job.type})<br>
            <strong>Department:</strong> ${job.department}<br>
            <strong>Salary:</strong> ${job.salaryRange}<br>
            <strong>Requirements:</strong> ${job.requirements.join(', ')}<br>
            <strong>Responsibilities:</strong> ${job.responsibilities.join(', ')}<br>
            <strong>Benefits:</strong> ${job.benefits.join(', ')}
        </li>
    `;
    jobsHtml += '</ul>';

    details.innerHTML = `
        <h2>${company.name}</h2>
        <p><strong>Industry:</strong> ${company.industry}</p>
        <p><strong>Location:</strong> ${company.location}</p>
        ${jobsHtml}
    `;

    modal.style.display = 'block';
}

// Close popup (return to large bubbles)
document.querySelector('.popup-close').onclick = () => {
    console.log('Closing popup');
    const popup = document.getElementById('popup');
    popup.style.display = 'none';
    document.getElementById('small-bubbles-container').innerHTML = '';
    stage.draw();
};

// Close modal
document.querySelector('.modal-close').onclick = () => {
    console.log('Closing modal');
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
};

// Close popup/modal when clicking outside
window.onclick = (event) => {
    const popup = document.getElementById('popup');
    const modal = document.getElementById('modal');
    if (event.target === popup) {
        console.log('Closing popup (outside click)');
        popup.style.display = 'none';
        document.getElementById('small-bubbles-container').innerHTML = '';
        stage.draw();
    }
    if (event.target === modal) {
        console.log('Closing modal (outside click)');
        modal.style.display = 'none';
    }
};