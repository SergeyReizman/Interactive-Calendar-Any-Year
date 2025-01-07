/**
 * calendar.js - Interactive Calendar with Event Management and Themes
 * 
 * Features:
 * - Calendar generation for any year.
 * - Event management (add, edit, delete events).
 * - Persistent storage for events and theme preferences.
 * - Dark mode and Ocean View theme toggles.
 * - Smooth scrolling "Back to Top" button.
 */

// Constants
const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString('default', { month: 'long' })
);

// DOM Elements
const calendarBody = document.getElementById('calendar-body');
const currentYearDisplay = document.getElementById('current-year');
const prevYearBtn = document.getElementById('prev-year-btn');
const nextYearBtn = document.getElementById('next-year-btn');
const clearEventsBtn = document.getElementById('clear-events-btn');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const oceanViewToggle = document.getElementById('ocean-view-toggle');
const backToTopBtn = document.getElementById('backToTopBtn');
const body = document.body;

// Modal Elements
const modal = document.getElementById('event-modal');
const modalTitle = document.getElementById('modal-title');
const eventList = document.getElementById('event-list');
const eventInput = document.getElementById('event-input');
const addEventBtn = document.getElementById('add-event-btn');
const closeButton = document.querySelector('.close-button');

// Current date and selected year
const today = new Date();
let selectedYear = today.getFullYear();

// Persistent storage for events
let events = JSON.parse(localStorage.getItem('events')) || {};

// Track Ocean View state
let isOceanView = false;

/**
 * Saves the current events object to local storage.
 */
function saveEvents() {
    localStorage.setItem('events', JSON.stringify(events));
}

/**
 * Updates the calendar header with the current year.
 * @param {number} year - The year to display.
 */
function updateCalendarTitle(year) {
    currentYearDisplay.textContent = year;
}

/**
 * Generates the calendar for a specific year.
 * @param {number} year - The year for which the calendar is generated.
 */
function generateCalendar(year) {
    calendarBody.innerHTML = ''; // Clear existing calendar
    updateCalendarTitle(year);

    MONTHS.forEach((monthName, monthIndex) => {
        // Add month header
        const monthRow = document.createElement('tr');
        const monthHeader = document.createElement('th');
        monthHeader.colSpan = 7;
        monthHeader.textContent = monthName;
        monthRow.appendChild(monthHeader);
        calendarBody.appendChild(monthRow);

        // Add days of the week row
        const daysRow = document.createElement('tr');
        DAYS_OF_WEEK.forEach(day => {
            const dayCell = document.createElement('th');
            dayCell.textContent = day;
            daysRow.appendChild(dayCell);
        });
        calendarBody.appendChild(daysRow);

        // Generate days for the month
        const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
        const firstDay = new Date(year, monthIndex, 1).getDay();
        let dayCounter = 1;

        for (let week = 0; week < 6; week++) {
            const weekRow = document.createElement('tr');
            for (let day = 0; day < 7; day++) {
                const dayCell = document.createElement('td');

                if (week === 0 && day < firstDay) {
                    // Empty cells for days before the first of the month
                    dayCell.textContent = '';
                } else if (dayCounter <= daysInMonth) {
                    const dateKey = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(dayCounter).padStart(2, '0')}`;
                    dayCell.textContent = dayCounter;

                    // Highlight today's date
                    if (year === today.getFullYear() && monthIndex === today.getMonth() && dayCounter === today.getDate()) {
                        dayCell.classList.add('highlight-today');
                    }

                    // Add event markers if any exist
                    if (events[dateKey]) {
                        events[dateKey].forEach(event => {
                            const marker = document.createElement('div');
                            marker.textContent = event;
                            marker.classList.add('event-marker');
                            dayCell.appendChild(marker);
                        });
                    }

                    // Add event listener for managing events
                    dayCell.addEventListener('click', () => manageEvent(dateKey));
                    dayCounter++;
                }

                weekRow.appendChild(dayCell);
            }
            calendarBody.appendChild(weekRow);
            if (dayCounter > daysInMonth) break; // Stop creating rows once the month ends
        }
    });
}

/**
 * Opens the modal for managing events on a specific date.
 * @param {string} dateKey - The date in YYYY-MM-DD format.
 */
function manageEvent(dateKey) {
    modalTitle.textContent = `Events for ${new Date(dateKey).toLocaleDateString()}`;
    eventInput.value = '';
    eventList.innerHTML = '';

    const existingEvents = events[dateKey] || [];
    existingEvents.forEach((event, index) => {
        const eventItem = document.createElement('div');
        eventItem.textContent = `${index + 1}. ${event}`;
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
            existingEvents.splice(index, 1);
            if (existingEvents.length > 0) {
                events[dateKey] = existingEvents;
            } else {
                delete events[dateKey];
            }
            saveEvents();
            generateCalendar(selectedYear);
            manageEvent(dateKey); // Refresh modal
        });
        eventItem.appendChild(deleteButton);
        eventList.appendChild(eventItem);
    });

    addEventBtn.onclick = () => {
        const newEvent = eventInput.value.trim();
        if (newEvent) {
            existingEvents.push(newEvent);
            events[dateKey] = existingEvents;
            saveEvents();
            generateCalendar(selectedYear);
            manageEvent(dateKey); // Refresh modal
        }
    };

    modal.style.display = 'block';
}

// Close the modal
closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Close modal on outside click
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

/**
 * Toggles the Ocean View theme.
 */
function toggleOceanView() {
    isOceanView = !isOceanView;
    body.classList.toggle('ocean-view', isOceanView);
    localStorage.setItem('oceanView', isOceanView);
}

// Event Listeners
prevYearBtn.addEventListener('click', () => {
    selectedYear--;
    generateCalendar(selectedYear);
});

nextYearBtn.addEventListener('click', () => {
    selectedYear++;
    generateCalendar(selectedYear);
});

clearEventsBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all events?')) {
        events = {};
        saveEvents();
        generateCalendar(selectedYear);
    }
});

darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
});

oceanViewToggle.addEventListener('click', toggleOceanView);

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Initialize themes based on saved preferences
if (localStorage.getItem('darkMode') === 'true') {
    body.classList.add('dark-mode');
}

if (localStorage.getItem('oceanView') === 'true') {
    isOceanView = true;
    body.classList.add('ocean-view');
}

// Initial calendar generation
generateCalendar(selectedYear);
