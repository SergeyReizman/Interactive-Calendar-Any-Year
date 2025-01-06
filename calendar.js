/**
 * calendar.js - JavaScript for an interactive calendar.
 * Handles calendar generation, event management, and dark mode.
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
const backToTopBtn = document.getElementById('backToTopBtn');
const body = document.body;

// Current date and selected year
const today = new Date();
let selectedYear = today.getFullYear();

// Load events from local storage or initialize an empty object
let events = JSON.parse(localStorage.getItem('events')) || {};

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

                    // Add events markers if any exist
                    if (events[dateKey]) {
                        events[dateKey].forEach((event, index) => {
                            const marker = document.createElement('div');
                            marker.textContent = event;
                            marker.classList.add('event-marker');
                            marker.dataset.index = index; // Store index for editing/deleting
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
 * Handles adding, editing, or deleting events for a given date.
 * @param {string} dateKey - The date in YYYY-MM-DD format.
 */
function manageEvent(dateKey) {
    const existingEvents = events[dateKey] || [];
    const formattedDate = new Date(dateKey).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const action = prompt(`Events for ${formattedDate}:\n${existingEvents.join('\n')}\n1. Add Event\n2. Edit Event\n3. Delete Event`, '');

    if (action === '1') {
        const newEvent = prompt('Enter new event:');
        if (newEvent) {
            existingEvents.push(newEvent.trim());
            events[dateKey] = existingEvents;
            saveEvents();
            generateCalendar(selectedYear);
        }
    } else if (action === '2') {
        const eventIndex = prompt(`Which event number to edit? (1-${existingEvents.length})`);
        if (eventIndex && existingEvents[eventIndex - 1]) {
            const editedEvent = prompt('Edit event:', existingEvents[eventIndex - 1]);
            if (editedEvent) {
                existingEvents[eventIndex - 1] = editedEvent.trim();
                saveEvents();
                generateCalendar(selectedYear);
            }
        }
    } else if (action === '3') {
        const eventIndex = prompt(`Which event number to delete? (1-${existingEvents.length})`);
        if (eventIndex && existingEvents[eventIndex - 1]) {
            if (confirm(`Are you sure you want to delete "${existingEvents[eventIndex - 1]}"?`)) {
                existingEvents.splice(eventIndex - 1, 1);
                if (existingEvents.length > 0) {
                    events[dateKey] = existingEvents;
                } else {
                    delete events[dateKey];
                }
                saveEvents();
                generateCalendar(selectedYear);
            }
        }
    }
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

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Initialize dark mode based on saved preference
if (localStorage.getItem('darkMode') === 'true') {
    body.classList.add('dark-mode');
}

// Initial calendar generation
generateCalendar(selectedYear);
