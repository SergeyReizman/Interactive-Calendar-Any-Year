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

function saveEvents() {
  localStorage.setItem('events', JSON.stringify(events));
}

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

function generateCalendar(year) {
  // Clear the calendar and update the title with the selected year
  calendarBody.innerHTML = '';
  updateCalendarTitle(year);

  // Loop through each month of the year
  MONTHS.forEach((monthName, monthIndex) => {
    // Add the month's name as a header
    const monthRow = document.createElement('tr');
    const monthHeader = document.createElement('th');
    monthHeader.colSpan = 7; // Span the entire week
    monthHeader.textContent = monthName;
    monthRow.appendChild(monthHeader);
    calendarBody.appendChild(monthRow);

    // Add the days of the week header row
    const daysRow = document.createElement('tr');
    DAYS_OF_WEEK.forEach(day => {
      const dayCell = document.createElement('th');
      dayCell.textContent = day;
      daysRow.appendChild(dayCell);
    });
    calendarBody.appendChild(daysRow);

    // Calculate the number of days in the current month
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const firstDay = new Date(year, monthIndex, 1).getDay(); // Day of the week the month starts on

    let dayCounter = 1;

    // Generate calendar rows (weeks) and cells (days)
    for (let week = 0; week < 6; week++) { // Maximum of 6 weeks in a month
      const weekRow = document.createElement('tr');

      for (let day = 0; day < 7; day++) { // Days of the week (Sun to Sat)
        const dayCell = document.createElement('td');

        // Fill blank cells for days before the month starts
        if (week === 0 && day < firstDay) {
          dayCell.textContent = '';
        } else if (dayCounter <= daysInMonth) {
          // Create the date key for event tracking
          const dateKey = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(dayCounter).padStart(2, '0')}`;
          
          // Set the day's number
          dayCell.textContent = dayCounter;

          // Highlight the current date
          if (year === today.getFullYear() && monthIndex === today.getMonth() && dayCounter === today.getDate()) {
            dayCell.style.backgroundColor = 'red';
            dayCell.style.color = 'white';
          }

          // Create a container for events
          const eventContainer = document.createElement('div');
          eventContainer.classList.add('event-container');
          dayCell.appendChild(eventContainer);

          // Display events for the day with tooltips
          if (events[dateKey]) {
            events[dateKey].forEach(event => {
              // Create a marker for each event
              const marker = document.createElement('div');
              marker.textContent = event;
              marker.classList.add('event-marker');

              // Create a tooltip for the event
              const tooltip = document.createElement('div');
              tooltip.textContent = event;
              tooltip.classList.add('event-tooltip');
              tooltip.style.display = 'none'; // Initially hidden
              marker.appendChild(tooltip);

              // Show the tooltip on hover
              marker.addEventListener('mouseenter', () => {
                tooltip.style.display = 'block';
              });

              // Hide the tooltip when not hovering
              marker.addEventListener('mouseleave', () => {
                tooltip.style.display = 'none';
              });

              eventContainer.appendChild(marker);
            });
          }

          // Add click event to manage events for the day
          dayCell.addEventListener('click', () => manageEvent(dateKey));
          dayCounter++;
        }

        weekRow.appendChild(dayCell);
      }

      // Append the week's row to the calendar
      calendarBody.appendChild(weekRow);

      // Stop creating weeks once all days in the month are processed
      if (dayCounter > daysInMonth) break;
    }
  });
}

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

closeButton.onclick = () => {
  modal.style.display = 'none';
};

window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});

themeSwitcher.addEventListener('change', (e) => {
  const selectedTheme = e.target.value;
  localStorage.setItem('theme', selectedTheme);
  applyTheme(selectedTheme);
});

function applyTheme(theme) {
  body.classList.remove('dark-mode', 'ocean-view');
  if (theme === 'dark') {
    body.classList.add('dark-mode');
  } else if (theme === 'ocean') {
    body.classList.add('ocean-view');
  }
}

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

clearEventsBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to clear all events?')) {
    events = {};
    saveEvents();
    generateCalendar(selectedYear);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  themeSwitcher.value = savedTheme;
  applyTheme(savedTheme);
  generateCalendar(selectedYear);
  updateCalendarTitle(selectedYear);
});

// Initial calendar generation and title update
generateCalendar(selectedYear);
updateCalendarTitle(selectedYear);