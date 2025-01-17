// calendar.js - Interactive Calendar with Event Management and Themes

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

// Utility Functions
const saveEvents = () => localStorage.setItem('events', JSON.stringify(events));

const updateCalendarTitle = (year) => {
  currentYearDisplay.textContent = year;
  currentYearDisplay.style.color = year === today.getFullYear() ? 'red' : '';
  currentYearDisplay.style.fontWeight = year === today.getFullYear() ? 'bold' : 'normal';
};

const applyTheme = (theme) => {
  body.classList.remove('dark-mode', 'ocean-view');
  if (theme === 'dark') body.classList.add('dark-mode');
  else if (theme === 'ocean') body.classList.add('ocean-view');
};

const toggleBackToTopButton = () => {
  backToTopBtn.style.display = window.scrollY > 100 ? 'block' : 'none';
};

// Event Management Functions
const renderEvents = (dateKey) => {
  const existingEvents = events[dateKey] || [];
  eventList.innerHTML = existingEvents
    .map((event, index) => `
      <div>
        ${index + 1}. ${event}
        <button class="delete-event-btn" data-index="${index}">Delete</button>
      </div>
    `)
    .join('');

  document.querySelectorAll('.delete-event-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      existingEvents.splice(btn.dataset.index, 1);
      if (existingEvents.length > 0) events[dateKey] = existingEvents;
      else delete events[dateKey];
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
            dayCell.style.backgroundColor = 'red';
            dayCell.style.color = 'white';
          }

          const eventContainer = document.createElement('div');
          eventContainer.className = 'event-container';
          dayCell.appendChild(eventContainer);

          if (events[dateKey]) {
            events[dateKey].forEach((event) => {
              const marker = document.createElement('div');
              marker.className = 'event-marker';
              marker.textContent = event;
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
  localStorage.setItem('theme', selectedTheme);
  applyTheme(selectedTheme);
});

document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  themeSwitcher.value = savedTheme;
  applyTheme(savedTheme);
  generateCalendar(selectedYear);
});
