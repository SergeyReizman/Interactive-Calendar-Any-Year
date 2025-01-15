/**
 * calendar.js - Interactive Calendar with Event Management and Themes
 *
 * Features:
 * - Calendar generation for any year.
 * - Event management (add, edit, delete events).
 * - Persistent storage for events and theme preferences.
 * - Dynamic theme switcher with Light, Dark, and Ocean themes.
 * - Smooth scrolling "Back to Top" button.
 * - Current Year in header and Current Date cell highlighted in red.
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
const themeSwitcher = document.getElementById('theme-switcher');
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

/**
 * Save events to local storage
 */
function saveEvents() {
  localStorage.setItem('events', JSON.stringify(events));
}

/**
 * Update the calendar's title with the selected year
 * @param {number} year - The year to display in the calendar header
 */
function updateCalendarTitle(year) {
  currentYearDisplay.textContent = year;
  if (year === today.getFullYear()) {
    currentYearDisplay.style.color = 'red';
    currentYearDisplay.style.fontWeight = 'bold';
  } else {
    currentYearDisplay.style.color = '';
    currentYearDisplay.style.fontWeight = 'normal';
  }
}

/**
 * Generate the calendar for a specific year
 * @param {number} year - The year for which to generate the calendar
 */
function generateCalendar(year) {
  calendarBody.innerHTML = '';
  updateCalendarTitle(year);

  MONTHS.forEach((monthName, monthIndex) => {
    const monthRow = document.createElement('tr');
    const monthHeader = document.createElement('th');
    monthHeader.colSpan = 7;
    monthHeader.textContent = monthName;
    monthRow.appendChild(monthHeader);
    calendarBody.appendChild(monthRow);

    const daysRow = document.createElement('tr');
    DAYS_OF_WEEK.forEach(day => {
      const dayCell = document.createElement('th');
      dayCell.textContent = day;
      daysRow.appendChild(dayCell);
    });
    calendarBody.appendChild(daysRow);

    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const firstDay = new Date(year, monthIndex, 1).getDay();
    let dayCounter = 1;

    for (let week = 0; week < 6; week++) {
      const weekRow = document.createElement('tr');
      for (let day = 0; day < 7; day++) {
        const dayCell = document.createElement('td');

        if (week === 0 && day < firstDay) {
          dayCell.textContent = '';
        } else if (dayCounter <= daysInMonth) {
          const dateKey = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(dayCounter).padStart(2, '0')}`;
          dayCell.textContent = dayCounter;

          // Highlight CURRENT DATE CELL
          if (year === today.getFullYear() && monthIndex === today.getMonth() && dayCounter === today.getDate()) {
            dayCell.style.backgroundColor = 'red';
            dayCell.style.color = 'white';
          }

          const eventContainer = document.createElement('div');
          eventContainer.classList.add('event-container');
          dayCell.appendChild(eventContainer);

          if (events[dateKey]) {
            events[dateKey].forEach(event => {
              const marker = document.createElement('div');
              marker.textContent = event;
              marker.classList.add('event-marker');
              eventContainer.appendChild(marker);
            });
          }

          dayCell.addEventListener('click', () => manageEvent(dateKey));
          dayCounter++;
        }
        weekRow.appendChild(dayCell);
      }
      calendarBody.appendChild(weekRow);
      if (dayCounter > daysInMonth) break;
    }
  });
}

/**
 * Manage events for a specific date
 * @param {string} dateKey - The date in YYYY-MM-DD format
 */
function manageEvent(dateKey) {
  const dateObj = new Date(dateKey);
  const formattedDate = `${String(dateObj.getDate()).padStart(2, '0')}/${String(dateObj.getMonth() + 1).padStart(2, '0')}/${dateObj.getFullYear()}`;
  modalTitle.textContent = `Events for ${formattedDate}`;

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
      manageEvent(dateKey);
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
      manageEvent(dateKey);
    }
  };

  modal.style.display = 'block';
}

// Modal Close Logic
closeButton.onclick = () => {
  modal.style.display = 'none';
};

window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});

// Theme Management
/**
 * Apply the selected theme
 * @param {string} theme - The theme name ('light', 'dark', 'ocean')
 */
function applyTheme(theme) {
  body.classList.remove('dark-mode', 'ocean-view');
  if (theme === 'dark') {
    body.classList.add('dark-mode');
  } else if (theme === 'ocean') {
    body.classList.add('ocean-view');
  }
}

themeSwitcher.addEventListener('change', (e) => {
  const selectedTheme = e.target.value;
  localStorage.setItem('theme', selectedTheme);
  applyTheme(selectedTheme);
});

// Back to Top Button Logic
backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener('scroll', () => {
  if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
    backToTopBtn.style.display = 'block';
  } else {
    backToTopBtn.style.display = 'none';
  }
});

// Year Navigation Logic
prevYearBtn.addEventListener('click', () => {
  selectedYear--;
  generateCalendar(selectedYear);
  updateCalendarTitle(selectedYear);
});

nextYearBtn.addEventListener('click', () => {
  selectedYear++;
  generateCalendar(selectedYear);
  updateCalendarTitle(selectedYear);
});

// Clear All Events
clearEventsBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to clear all events?')) {
    events = {};
    saveEvents();
    generateCalendar(selectedYear);
  }
});

// Initialize Calendar and Theme on Page Load
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  themeSwitcher.value = savedTheme;
  applyTheme(savedTheme);
  generateCalendar(selectedYear);
  updateCalendarTitle(selectedYear);
});
