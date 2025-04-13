// calendar.js - Interactive Calendar with Event Management, Themes, and Weather Integration

// Constants
const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = Array.from({ length: 12 }, (_, i) =>
  new Date(0, i).toLocaleString('default', { month: 'long' })
);

// OpenWeatherMap API Key
const OPENWEATHERMAP_API_KEY = 'df0f16cf02a34bd7702290b645f69b9a'; // Replace with your API key

// DOM Elements
const body = document.body;
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

// Date and Weather Display Elements
const currentDateDisplay = document.getElementById('current-date');
const todayWeatherDisplay = document.getElementById('today-weather');

// Star Generation
const generateStars = () => {
  const starsContainer = document.createElement('div');
  starsContainer.className = 'stars';
  body.appendChild(starsContainer);

  const starCount = 200;
  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.top = `${Math.random() * 100}vh`;
    star.style.left = `${Math.random() * 100}vw`;
    star.style.animationDelay = `${Math.random() * 4}s`;
    starsContainer.appendChild(star);
  }
};

// Theme Management
const applyTheme = (theme) => {
  body.classList.remove(
    'abandoned-castle', 'adelaide-skyline', 'adriatic-sea', 'aloe-vera', 'alpine-landscape', 'amazon-dolphin',
    'amazon-river', 'antarctic-snowdrifts', 'arctic-glow', 'arctic-snowfall', 'autumn-harvest', 'bamboo-flute',
    'battle-of-the-ice', 'bermuda-triangle', 'best-practice', 'black-fashion', 'black-coffee', 'black-hacker',
    'black-hawk', 'black-hole', 'black-orange', 'black-velvet', 'black-violet', 'blue-bird', 'blue-ice', 
    'blue-planet','blue-whale', 'blue-white', 'bright-line', 'bronze-horseman', 'cacao-plantation', 
    'cafe-de-colombia', 'candy-world',
    'cardinals-guards', 'caribbean-sea', 'cherry-garden', 'cinnamon-street', 'clean-energy', 
    'competitive-advantage',
    'continuous-growth', 'coral-reef', 'cosmic-nebula', 'cracked-ice', 'crimson-sky', 'crossroads-stone', 
    'crystal-snowfall', 'crystal-stream',
    'cyber-pulse', 'dark-mode', 'dartagnans-rapier', 'daruma-doll', 'deep-forest', 'deep-ocean', 
    'desert-mirage', 'distant-skies', 
    'doterra-black','dragon-flame', 'dragonfly','emerald-stream', 'emperor-penguin', 
    'divi-divi-trees', 'essential-oils', 'everest-view', 'executive-management',
    'exotic-island', 'expedient-path', 'fast-track', 'fiji-islands',
    'finish-line', 'fir-balsam', 'flamingo-sky', 
    'free-flight', 'forgotten-dreams', 'frozen-wilderness', 'full-pink-moon',
    'galactic-glow', 'genghis-khan-arrow',
    'giant-petrel', 'golden-coast',
    'golden-gate', 'golden-horizon', 'great-lakes', 'great-wall', 'green-city', 'green-coffee',
    'greenland-icebergs', 'greyscale', 'guangzhou-lights', 'heavy-rain', 'hidden-trail', 'high-performance', 
    'high-speed-rail', 'high-speed-train', 'hurricane-clouds', 'hyperloop', 'ice-palace',
    'iceland-volcanoes' , 
    'imaginary-world', 'in-the-dusk', 'intelligence-quotient', 'into-the-night', 'invincible-zone', 
    'japan-emperor','kilimanjaro-outskirts', 'lavender-bliss', 
    'lemongrass-sky', 'life-quality', 'lions-mane', 'logical-intelligence',
    'love-station', 'lucid-dream', 'lunar-eclipse', 'macaroni-penguin',
    'magellanic-penguin', 'mammoth-tusk', 'maple-leaf-fall', 'maple-syrup', 'medieval-knights',
    'mediterranean-dreams', 'melting-glaciers', 'midnight-alchemy', 'midnight-train', 
    'migratory-birds', 'monochrome-ink','moonlit-path', 'morning-forest', 'mount-fuji', 'mountain-lake', 
    'mountain-peak', 'new-ai', 'new-black', 'neon-nights',
    'niagara-falls', 'night-dragon', 'north-pole', 'northern-nights', 'ocean-surf', 'ocean-view', 
    'ocean-vortex',
    'okinawa-breeze', 'one-step-ahead', 'on-the-island', 'orange-country', 'pink-lake', 'pirate-ship', 
    'polar-bear', 'porcupine-quill', 'port-victoria', 'practical-experience', 'precious-question', 
    'pure-light', 
    'purple-fog', 'quantum-programmer', 'quiet-evening',
    'rainbow-dream', 'rainforest-jungle', 'rain-waltz', 'red-lake', 'red-squirrel', 'rising-sun',
    'robin-good', 'royal-caribbean', 'samurai-path', 'sea-diamonds', 'sea-lions', 'sea-star',
    'secret-night', 'secretive-ninja', 'selfless-programmer', 'serene-shores', 'shaolin-monastery',
    'shift-in-perception', 'silicon-valley', 'sky-eagle', 'solar-flare', 'spring-meadow',
    'steel-shadows', 'stockholm-roofs', 'strategic-advantage', 'success-motivation', 'sword-of-fate',
    'tactical-advantage', 'tactical-command', 'technological-might', 
    'the-last-mohican', 'time-complexity', 'time-machine', 'tropical-sunset', 
    'velvety-dark', 'viking-helmet','viktoria-falls', 'weekend-downtime', 'white-shark', 
    'wild-rose', 'wild-wonders', 'winter-wonderland'

  );

  body.classList.add(theme);
  localStorage.setItem('calendarTheme', theme);

  const starsContainer = document.querySelector('.stars');
  if (theme === 'galactic-glow') {
    if (!starsContainer) {
      generateStars();
    }
  } else if (starsContainer) {
    starsContainer.remove();
  }
  generateCalendar(selectedYear);
};

// Event Listeners for Theme and Initial Theme Application
themeSwitcher.addEventListener('change', (e) => {
  const selectedTheme = e.target.value;
  applyTheme(selectedTheme);
});

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
    eventInput.value = ''; // Clear input
  };

  modal.style.display = 'block';
};

const closeModal = () => modal.style.display = 'none';

// Weather Functions
const fetchWeatherData = async (lat, lon) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHERMAP_API_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
};

const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          // Fallback to a default location (e.g., New York)
          resolve({
            lat: 40.7128,
            lon: -74.0060,
          });
        }
      );
    } else {
      // Fallback to a default location (e.g., New York)
      resolve({
        lat: 40.7128,
        lon: -74.0060,
      });
    }
  });
};

// Update Current Date Display
const updateCurrentDate = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = today.getFullYear();
  const dateString = `${day}/${month}/${year}`;
  currentDateDisplay.textContent = dateString;
};

// Update Today's Weather Display
const updateTodayWeather = async () => {
  try {
    const { lat, lon } = await getCurrentLocation();
    const weatherData = await fetchWeatherData(lat, lon);

    if (weatherData && weatherData.weather) {
      const weatherDescription = weatherData.weather[0].description;
      const temperature = (weatherData.main.temp - 273.15).toFixed(1); // Convert Kelvin to Celsius
      const weatherString = `${temperature}°C, ${weatherDescription}`;
      todayWeatherDisplay.textContent = weatherString;
    }
  } catch (error) {
    // Handle errors silently
  }
};

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
            dayCell.classList.add('current-day');
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

            if (eventListElement.scrollHeight > eventListElement.clientHeight) {
              const moreLink = document.createElement('a');
              moreLink.href = '#';
              moreLink.textContent = 'More...';
              moreLink.addEventListener('click', (e) => {
                e.preventDefault();
                manageEvent(dateKey);
              });
              eventContainer.appendChild(moreLink);

              eventListElement.style.maxHeight = '40px';
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

  // Display weather for the current day
  updateTodayWeather();
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

// Analog Watch Functionality
const updateClock = () => {
  const now = new Date();
  const seconds = now.getSeconds();
  const minutes = now.getMinutes();
  const hours = now.getHours();

  const secondHand = document.getElementById('second-hand');
  const minuteHand = document.getElementById('minute-hand');
  const hourHand = document.getElementById('hour-hand');

  const secondDegrees = ((seconds / 60) * 360) + 90;
  const minuteDegrees = ((minutes / 60) * 360) + ((seconds / 60) * 6) + 90;
  const hourDegrees = ((hours / 12) * 360) + ((minutes / 60) * 30) + 90;

  secondHand.style.transform = `rotate(${secondDegrees}deg)`;
  minuteHand.style.transform = `rotate(${minuteDegrees}deg)`;
  hourHand.style.transform = `rotate(${hourDegrees}deg)`;
};

setInterval(updateClock, 1000);

// Initial call to set the clock immediately
updateClock();

// Initial calendar generation and watch initialization
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('calendarTheme') || 'core';
  themeSwitcher.value = savedTheme;
  applyTheme(savedTheme);
  generateCalendar(selectedYear);

  // Initialize the analog watch
  updateClock();

  // Update current date and weather
  updateCurrentDate();
  updateTodayWeather();
});