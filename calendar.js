// calendar.js - Interactive Calendar with Event Management and Themes

// Constants
const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = Array.from({ length: 12 }, (_, i) =>
  new Date(0, i).toLocaleString('default', { month: 'long' })
);

// DOM Elements (MUST be defined before use)
const body = document.body; // Define body *first*
const calendarBody = document.getElementById('calendar-body');
const currentYearDisplay = document.getElementById('current-year');
const prevYearBtn = document.getElementById('prev-year-btn');
const nextYearBtn = document.getElementById('next-year-btn');
const clearEventsBtn = document.getElementById('clear-events-btn');
const themeSwitcher = document.getElementById('theme-switcher');
const backToTopBtn = document.getElementById('backToTopBtn');

// Modal Elements
const modal = document.getElementById('event-modal');
const modalTitle = document.getElementById('modal-title');
const eventList = document.getElementById('event-list');
const eventInput = document.getElementById('event-input');
const addEventBtn = document.getElementById('add-event-btn');
const closeButton = document.querySelector('.close-button');

// Theme Management
const applyTheme = (theme) => {
  body.classList.remove(
    'dark-mode', 'ocean-view', 'greyscale', 'autumn-harvest',
    'serene-shores', 'blue-ice', 'cherry-garden', 'deep-forest',
    'orange-country', 'neon-nights'
  );
  switch (theme) {
    case 'dark-mode':
      body.classList.add('dark-mode');
      break;
    case 'ocean-view':
      body.classList.add('ocean-view');
      break;
    case 'greyscale':
      body.classList.add('greyscale');
      break;
    case 'autumn-harvest':
      body.classList.add('autumn-harvest');
      break;
    case 'serene-shores':
      body.classList.add('serene-shores');
      break;
    case 'blue-ice':
      body.classList.add('blue-ice');
      break;
    case 'cherry-garden':
      body.classList.add('cherry-garden');
      break;
    case 'deep-forest':
      body.classList.add('deep-forest');
      break;
    case 'orange-country':
      body.classList.add('orange-country');
      break;
    case 'neon-nights':
      body.classList.add('neon-nights');
      break;
    default:
      break; // No class added for default (core/light theme)
  }
  localStorage.setItem('calendarTheme', theme);
};

// Event Listeners for Theme and Initial Theme Application
themeSwitcher.addEventListener('change', (e) => {
  const selectedTheme = e.target.value;
  applyTheme(selectedTheme);
  generateCalendar(selectedYear); // Important: Regenerate calendar after theme change
});

document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('calendarTheme') || 'core'; // Default to 'core'
  themeSwitcher.value = savedTheme;
  applyTheme(savedTheme);
  generateCalendar(selectedYear); // Generate calendar on load
});

// Current date and selected year (Moved down after theme setup)
const today = new Date();
let selectedYear = today.getFullYear();

// Persistent storage for events
let events = JSON.parse(localStorage.getItem('events')) || {};

// Utility Functions
const saveEvents = () => localStorage.setItem('events', JSON.stringify(events));

const updateCalendarTitle = (year) => {
  currentYearDisplay.textContent = year;
  currentYearDisplay.style.color = year === today.getFullYear() ? 'red' : '';
  currentYearDisplay.style.fontWeight = year === today.getFullYear() ? 'bold' : 'normal';
};

const toggleBackToTopButton = () => {
  backToTopBtn.style.display = window.scrollY > 100 ? 'block' : 'none';
};

// Event Management Functions
const renderEvents = (dateKey) => {
  const existingEvents = events[dateKey] || [];
  eventList.innerHTML = "";
  existingEvents.forEach((event, index) => {
    const eventDiv = document.createElement('div');
    eventDiv.textContent = `${index + 1}. ${event}`;
    const deleteButton = document.createElement('button');
    deleteButton.className = "delete-event-btn";
    deleteButton.dataset.index = index;
    deleteButton.textContent = "Delete";
    eventDiv.appendChild(deleteButton);
    eventList.appendChild(eventDiv);
  });

  document.querySelectorAll('.delete-event-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const indexToDelete = parseInt(btn.dataset.index);
      events[dateKey].splice(indexToDelete, 1);
      if (events[dateKey].length === 0) {
        delete events[dateKey];
      }
      saveEvents();
      generateCalendar(selectedYear);
      renderEvents(dateKey);
    });
  });
};

const manageEvent = (dateKey) => {
  const dateObj = new Date(dateKey);
  modalTitle.textContent = `Events for ${dateObj.toLocaleDateString('en-GB')}`;
  eventInput.value = '';
  renderEvents(dateKey);

  addEventBtn.onclick = () => {
    const newEvent = eventInput.value.trim();
    if (!newEvent) return;
    events[dateKey] = [...(events[dateKey] || []), newEvent];
    saveEvents();
    generateCalendar(selectedYear);
    renderEvents(dateKey);
    // Clear the input value after adding the event
    eventInput.value = '';
  };

  modal.style.display = 'block';
};

const closeModal = () => (modal.style.display = 'none');

// Calendar Generation
const generateCalendar = (year) => {
  calendarBody.innerHTML = '';
  updateCalendarTitle(year);

  MONTHS.forEach((monthName, monthIndex) => {
    const monthRow = document.createElement('tr');
    monthRow.innerHTML = `<th colspan="7">${monthName}</th>`;
    calendarBody.appendChild(monthRow);

    const daysRow = document.createElement('tr');
    daysRow.innerHTML = DAYS_OF_WEEK.map((day) => `<th>${day}</th>`).join('');
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

          if (year === today.getFullYear() && monthIndex === today.getMonth() && dayCounter === today.getDate()) {
            dayCell.classList.add('current-day'); // Use a class for styling
          }

          const eventContainer = document.createElement('div');
          eventContainer.className = 'event-container';
          dayCell.appendChild(eventContainer);

          if (events[dateKey]) {
            const eventListElement = document.createElement('ul');
            eventListElement.className = 'event-list-in-cell';
            eventContainer.appendChild(eventListElement);

            events[dateKey].forEach((event) => {
              const listItem = document.createElement('li');
              listItem.className = 'event-marker';
              listItem.textContent = event;
              eventListElement.appendChild(listItem);
            });

            // Check if the event list is overflowing, if so, add a "More..." link
            if (eventListElement.scrollHeight > eventListElement.clientHeight) {
              const moreLink = document.createElement('a');
              moreLink.href = '#';
              moreLink.textContent = 'More...';
              moreLink.addEventListener('click', (e) => {
                e.preventDefault();
                manageEvent(dateKey);
              });
              eventContainer.appendChild(moreLink);

              // Set the height of the list to hide the overflow
              eventListElement.style.maxHeight = `${eventListElement.clientHeight - moreLink.offsetHeight}px`;
              eventListElement.style.overflow = 'hidden';
            }
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
};
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

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener('scroll', toggleBackToTopButton);

closeButton.addEventListener('click', closeModal);
window.addEventListener('click', (e) => e.target === modal && closeModal());

themeSwitcher.addEventListener('change', (e) => {
  const selectedTheme = e.target.value;
  localStorage.setItem('calendarTheme', selectedTheme); // Correct key
  applyTheme(selectedTheme);
});

document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('calendarTheme') || 'light'; // Correct key
  themeSwitcher.value = savedTheme;
  applyTheme(savedTheme);
  generateCalendar(selectedYear);
});

// Initial calendar generation
generateCalendar(selectedYear);