/**
 * calendar.js - Interactive Calendar with Event Management and Themes
 *
 * Features:
 * - Calendar generation for any year.
 * - Event management (add, edit, delete events).
 * - Persistent storage for events and theme preferences.
 * - Dynamic theme switcher with Light, Dark, and Ocean themes.
 * - Smooth scrolling "Back to Top" button.
 */

// Constants
const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']; // Days of the week
const MONTHS = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString('default', { month: 'long' }) // Array of month names
);

// DOM Elements
const calendarBody = document.getElementById('calendar-body'); // Calendar table body element
const currentYearDisplay = document.getElementById('current-year'); // Display for the current year
const prevYearBtn = document.getElementById('prev-year-btn'); // Button to navigate to previous year
const nextYearBtn = document.getElementById('next-year-btn'); // Button to navigate to next year
const clearEventsBtn = document.getElementById('clear-events-btn'); // Button to clear all events
const themeSwitcher = document.getElementById('theme-switcher'); // Theme switcher dropdown
const backToTopBtn = document.getElementById('backToTopBtn'); // "Back to Top" button
const body = document.body; // Body element to apply themes

// Modal Elements
const modal = document.getElementById('event-modal'); // Modal for event management
const modalTitle = document.getElementById('modal-title'); // Modal title element
const eventList = document.getElementById('event-list'); // List of events in modal
const eventInput = document.getElementById('event-input'); // Input for adding new events
const addEventBtn = document.getElementById('add-event-btn'); // Button to add events
const closeButton = document.querySelector('.close-button'); // Close button for the modal

// Current date and selected year
const today = new Date();
let selectedYear = today.getFullYear(); // Default selected year is the current year

// Persistent storage for events (using localStorage)
let events = JSON.parse(localStorage.getItem('events')) || {}; // Load stored events or initialize empty object

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
    currentYearDisplay.textContent = year; // Set the year in the header
}

/**
 * Generates the calendar for a specific year.
 * @param {number} year - The year for which the calendar is generated.
 */
function generateCalendar(year) {
    calendarBody.innerHTML = ''; // Clear existing calendar
    updateCalendarTitle(year); // Update the title with the selected year

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
        const daysInMonth = new Date(year, monthIndex + 1, 0).getDate(); // Get the number of days in the month
        const firstDay = new Date(year, monthIndex, 1).getDay(); // Get the first day of the month (Sunday-Saturday)
        let dayCounter = 1;

        for (let week = 0; week < 6; week++) {
            const weekRow = document.createElement('tr');
            for (let day = 0; day < 7; day++) {
                const dayCell = document.createElement('td');

                if (week === 0 && day < firstDay) {
                    // Empty cells for days before the first of the month
                    dayCell.textContent = '';
                } else if (dayCounter <= daysInMonth) {
                    const dateKey = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(dayCounter).padStart(2, '0')}`; // Key for events
                    dayCell.textContent = dayCounter;

                    // Highlight today's date
                    if (year === today.getFullYear() && monthIndex === today.getMonth() && dayCounter === today.getDate()) {
                        dayCell.classList.add('highlight-today');
                    }

                    // Create event container for the day
                    const eventContainer = document.createElement('div');
                    eventContainer.classList.add('event-container');
                    dayCell.appendChild(eventContainer); // Append container to the cell

                    // Add event markers if events exist for the day
                    if (events[dateKey]) {
                        events[dateKey].forEach(event => {
                            const marker = document.createElement('div');
                            marker.textContent = event; // Event name as text
                            marker.classList.add('event-marker'); // Styling for event markers
                            eventContainer.appendChild(marker); // Append marker to the event container
                        });
                    }

                    // Add event listener to manage events on the clicked day
                    dayCell.addEventListener('click', () => manageEvent(dateKey));
                    dayCounter++;
                }

                weekRow.appendChild(dayCell); // Add day cell to the week row
            }
            calendarBody.appendChild(weekRow); // Add week row to the calendar
            if (dayCounter > daysInMonth) break; // Stop creating rows once the month ends
        }
    });
}

/**
 * Opens the modal for managing events on a specific date.
 * @param {string} dateKey - The date in YYYY-MM-DD format.
 */
function manageEvent(dateKey) {
    const dateObj = new Date(dateKey);
    const formattedDate = `${String(dateObj.getDate()).padStart(2, '0')}/${String(dateObj.getMonth() + 1).padStart(2, '0')}/${dateObj.getFullYear()}`;
    modalTitle.textContent = `Events for ${formattedDate}`; // Set the modal title

    eventInput.value = ''; // Clear event input field
    eventList.innerHTML = ''; // Clear event list in modal

    // Display existing events for the selected date
    const existingEvents = events[dateKey] || [];
    existingEvents.forEach((event, index) => {
        const eventItem = document.createElement('div');
        eventItem.textContent = `${index + 1}. ${event}`;
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete'; // Button to delete event
        deleteButton.addEventListener('click', () => {
            existingEvents.splice(index, 1); // Remove the event from the list
            if (existingEvents.length > 0) {
                events[dateKey] = existingEvents; // Update events for the day
            } else {
                delete events[dateKey]; // Remove the date if no events are left
            }
            saveEvents(); // Save changes to localStorage
            generateCalendar(selectedYear); // Regenerate the calendar
            manageEvent(dateKey); // Refresh modal with updated events
        });
        eventItem.appendChild(deleteButton); // Add delete button to event item
        eventList.appendChild(eventItem); // Add event item to the modal
    });

    // Add new event on "Add Event" button click
    addEventBtn.onclick = () => {
        const newEvent = eventInput.value.trim();
        if (newEvent) {
            existingEvents.push(newEvent); // Add new event to the list
            events[dateKey] = existingEvents; // Update events for the day
            saveEvents(); // Save changes to localStorage
            generateCalendar(selectedYear); // Regenerate the calendar
            manageEvent(dateKey); // Refresh modal with updated events
        }
    };

    modal.style.display = 'block'; // Show modal
}

// Close the modal when the close button is clicked
closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Close modal when clicking outside the modal
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Dynamic Theme Switcher
themeSwitcher.addEventListener('change', (event) => {
    body.classList.remove('dark-mode', 'ocean-view'); // Remove any previously applied theme
    const selectedTheme = event.target.value;
    if (selectedTheme === 'light') {
        // No class needed for default light theme
    } else if (selectedTheme === 'dark') {
        body.classList.add('dark-mode'); // Apply dark mode theme
    } else if (selectedTheme === 'ocean') {
        body.classList.add('ocean-view'); // Apply ocean theme
    }
    localStorage.setItem('theme', selectedTheme); // Save theme preference to localStorage
});

// Apply saved theme preference on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light'; // Load saved theme or default to light
    themeSwitcher.value = savedTheme; // Set theme switcher to the saved theme
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode'); // Apply dark mode theme
    } else if (savedTheme === 'ocean') {
        body.classList.add('ocean-view'); // Apply ocean theme
    }
});

// Event Listeners for year navigation and other controls
prevYearBtn.addEventListener('click', () => {
    selectedYear--; // Decrease year
    generateCalendar(selectedYear); // Regenerate the calendar with the new year
});

nextYearBtn.addEventListener('click', () => {
    selectedYear++; // Increase year
    generateCalendar(selectedYear); // Regenerate the calendar with the new year
});

clearEventsBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all events?')) {
        events = {}; // Clear all events
        saveEvents(); // Save the empty event list
        generateCalendar(selectedYear); // Regenerate the calendar
    }
});

// Back to Top button functionality
backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Smooth scroll to the top of the page
});

// Initial calendar generation
generateCalendar(selectedYear);
