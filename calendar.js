/**
 * calendar.js - JavaScript for an interactive calendar.
 * Handles calendar generation, event management, and dark mode.
 */

// DOM elements
const calendarBody = document.getElementById('calendar-body');
const currentYearDisplay = document.getElementById('current-year');
const prevYearBtn = document.getElementById('prev-year-btn');
const nextYearBtn = document.getElementById('next-year-btn');
const clearEventsBtn = document.getElementById('clear-events-btn');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const body = document.body;

// Current date and selected year
const today = new Date();
let selectedYear = today.getFullYear();

// Load events from local storage or initialize an empty object
let events = JSON.parse(localStorage.getItem('events')) || {};

/**
 * Saves the events object to local storage.
 */
function saveEvents() {
    localStorage.setItem('events', JSON.stringify(events));
}

/**
 * Updates the displayed year in the calendar title.
 * @param {number} year - The year to display.
 */
function updateCalendarTitle(year) {
    currentYearDisplay.textContent = year;
}

/**
 * Generates the calendar table for the given year.
 * @param {number} year - The year for which to generate the calendar.
 */
function generateCalendar(year) {
    calendarBody.innerHTML = ''; // Clear existing calendar

    updateCalendarTitle(year);

    for (let month = 0; month < 12; month++) {
        const monthRow = document.createElement('tr');
        const monthHeader = document.createElement('th');
        monthHeader.colSpan = 7;
        monthHeader.textContent = new Date(year, month).toLocaleString('default', { month: 'long' });
        monthRow.appendChild(monthHeader);
        calendarBody.appendChild(monthRow);

        const daysRow = document.createElement('tr');
        ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
            const dayCell = document.createElement('th');
            dayCell.textContent = day;
            daysRow.appendChild(dayCell);
        });
        calendarBody.appendChild(daysRow);

        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        let dayCounter = 1;

        for (let i = 0; i < 6; i++) {
            const weekRow = document.createElement('tr');
            for (let j = 0; j < 7; j++) {
                const dayCell = document.createElement('td');
                if (i === 0 && j < firstDay) {
                    dayCell.textContent = '';
                } else if (dayCounter <= daysInMonth) {
                    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayCounter).padStart(2, '0')}`;
                    dayCell.textContent = dayCounter;

                    if (year === today.getFullYear() && month === today.getMonth() && dayCounter === today.getDate()) {
                        dayCell.classList.add('highlight-today');
                    }

                    if (events[dateKey]) {
                        events[dateKey].forEach((event, index) => {
                            const marker = document.createElement('div');
                            marker.textContent = event;
                            marker.classList.add('event-marker');
                            marker.dataset.index = index; // Store index for editing/deleting
                            dayCell.appendChild(marker);
                        });
                    }

                    dayCell.addEventListener('click', (event) => manageEvent(dateKey, event));
                    dayCounter++;
                }
                weekRow.appendChild(dayCell);
            }
            calendarBody.appendChild(weekRow);
            if (dayCounter > daysInMonth) break;
        }
    }
}

/**
 * Manages events for a specific date (add, edit, delete).
 * @param {string} dateKey - The date key (YYYY-MM-DD).
 * @param {Event} event - The click event.
 */
function manageEvent(dateKey, event) {
    const existingEvents = events[dateKey] || [];
    const date = new Date(dateKey);
    const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    if (event.target.classList.contains('event-marker')) { // Check if an event marker was clicked
        const eventIndex = event.target.dataset.index;
        const selectedEvent = existingEvents[eventIndex];

        const action = prompt(`Event for ${formattedDate}: ${selectedEvent}\n1. Edit\n2. Delete\n(Or leave blank to cancel)`, "");

        if (action === "1") { // Edit event
            const editedEvent = prompt("Edit event:", selectedEvent);
            if (editedEvent !== null) {
                existingEvents[eventIndex] = editedEvent.trim();
                events[dateKey] = existingEvents;
                saveEvents();
                generateCalendar(selectedYear);
            }
        } else if (action === "2") { // Delete event
            if (confirm(`Are you sure you want to delete "${selectedEvent}"?`)) {
                existingEvents.splice(eventIndex, 1);
                events[dateKey] = existingEvents;
                if (existingEvents.length === 0) {
                    delete events[dateKey]; // Remove the date key if no events remain
                }
                saveEvents();
                generateCalendar(selectedYear);
            }
        }
    } else { // Add new event
        const newEvent = prompt(`Enter event(s) for ${formattedDate} (separate with commas):`, existingEvents.join(', '));
        if (newEvent !== null) {
            if (newEvent.trim() === "") {
                delete events[dateKey]; // If prompt is empty delete existing events for that day
            } else {
                events[dateKey] = newEvent.split(",").map(item => item.trim()).filter(item => item !== ""); // Split, trim, and filter empty strings
            }
            saveEvents();
            generateCalendar(selectedYear);
        }
    }
}

// Event listeners for navigation buttons
prevYearBtn.addEventListener('click', () => {
    selectedYear--;
    generateCalendar(selectedYear);
});

nextYearBtn.addEventListener('click', () => {
    selectedYear++;
    generateCalendar(selectedYear);
});

// Event listener for clearing all events
clearEventsBtn.addEventListener('click', () => {
    if (confirm('Clear all events?')) {
        events = {};
        saveEvents();
        generateCalendar(selectedYear);
    }
});

// Event listener for dark mode toggle
darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
});

// Check for saved dark mode preference on page load
if (localStorage.getItem('darkMode') === 'true') {
    body.classList.add('dark-mode');
}

// Initial calendar generation
generateCalendar(selectedYear);