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
    'abandoned-castle', 'a-bright-future', 'a-brilliant-mind',
    'action-time', 'adelaide-skyline', 'a-desert-island', 'adriatic-sea', 'a-forward-move',
    'a-good-chapter', 'a-good-idea', 'aloe-vera', 'alone-in-paradise', 'a-lovely-day',
    'alpha-centauri', 'alpine-landscape', 'amazing-opportunity', 'amazon-dolphin',
    'amazon-river', 'american-dream', 'andromeda-galaxy', 'a-new-chapter', 
    'a-new-opportunity', 'antarctic-ice',
    'antarctic-snowdrifts', 'arctic-glow', 'arctic-snowfall', 
    'art-studio', 'a-simple-task', 'a-thing-of-beauty', 
    'a-turning-point', 'autumn-harvest', 'away-from-home', 'a-world-beyond-borders',
    'back-on-track', 'back-to-paradise', 'bamboo-flute',
    'battle-of-the-ice', 'bermuda-triangle', 'best-practice', 'best-response', 
    'be-yourself', 'big-dream',
    'big-fashion', 'big-pacific',
    'black-fashion', 'black-bird', 'black-coffee', 'black-hacker',
    'black-hawk', 'black-hole', 'black-magic', 'black-mountain',
    'black-orange', 'black-pear', 'black-pearl', 'black-style',
    'black-velvet', 'black-violet', 'blue-banana', 'blue-bird', 
    'blue-bliss', 'blue-frost', 'blue-gold',
    'blue-ice', 'blue-mountains','blue-ocean',
    'blue-planet', 'blue-stars', 'blue-whale', 'blue-white', 'blue-window',
    'bold-vision', 'box-of-surprises', 'breaking-point', 
    'breathtaking-view','bright-line', 'brilliant-white', 'bronze-horseman', 'cacao-plantation', 
    'cafe-de-colombia', 'california-sunshine',
    'camomile-flowers', 'canary-islands', 'can-do-attitude', 'candy-world',
    'cardinals-guards', 'caribbean-sea', 'celestial-objects', 'centaurus-constellation',
    'cherry-garden', 'cinnamon-street', 'city-of-dreams', 'city-of-night', 
    'clean-code', 'clean-energy', 'coastal-atlantic', 'coastal-beauty',
    'coastal-pacific', 'coconut-islands', 'coffee-for-leaders', 'color-symphony',
    'collaboration-idea', 'competitive-advantage',
    'continuous-growth', 'coral-reef', 'cosmic-nebula', 'cosmic-perspective',
    'cracked-ice', 'creative-content', 'crimson-sky', 'critical-thinking', 
    'crossroads-stone','crystal-snowfall', 'crystal-stream',
    'cyber-pulse', 'dark-code',
    'dark-mode', 'dark-star', 'dartagnans-rapier', 'daruma-doll', 
    'deep-forest', 'deep-ocean','deep-space', 'desert-between-us', 'desert-miracle', 
    'desert-mirage', 'desert-water',
    'developers-zone', 'diamond-planet', 'different-perspective',
    'digital-excellence', 'digital-progress', 'distant-skies','divi-divi-trees',
    'doterra-black', 'doterra-colors', 'doterra-gold', 'doterra-green', 
    'doterra-magic', 'doterra-new', 'doterra-power',
    'dragon-flame', 'dragonfly', 'dramatic-coastline.css', 'dream-adventure', 
    'eagle-swoop', 'early-dreams',
    'emerald-stream', 'emerald-water', 'emperor-penguin', 'enjoy-the-journey',
    'essential-oils', 'everest-view', 'every-little-step-counts',
    'excellent-mood', 'excellent-performance', 'executive-management',
    'exotic-island', 'expedient-path', 'exponential-acceleration',  
    'extraordinary-achievement', 'fast-track', 'fiji-islands',
    'finish-line', 'fir-balsam', 'flamingo-sky', 'forgotten-dreams', 'formula-one',
    'free-flight', 'fresh-start', 'frontier-unknown',
    'frozen-wilderness', 'full-pink-moon', 'fun-activity',
    'galactic-glow', 'game-changer', 'games-are-fun', 'genghis-khan-arrow',
    'giant-petrel', 'global-impact',
    'glorious-day', 'golden-century', 'golden-coast', 'golden-eagle',
    'golden-gate', 'golden-horizon', 'golden-lights', 'golden-opportunity', 
    'golden-summer', 'gradual-improvement', 'grand-prix', 'great-idea',
    'great-lakes', 'green-city', 'green-coffee', 'green-heaven',
    'greenland-icebergs', 'green-light', 'green-tea',
    'greyscale', 'group-11',
    'guangzhou-lights', 'heavy-rain', 'hidden-trail', 'hidden-paradise',
    'high-intelligence','high-performance', 
    'high-speed-rail', 'high-speed-train', 'high-style', 'hometown-vibes',
    'hurricane-clouds', 'hyperloop', 'ice-giant', 'ice-palace',
    'iceland-volcanoes' , 'imaginary-world', 'indigo-jeans', 'in-my-style', 'into-the-jungle',
    'inspiration-line', 'in-the-dusk', 'intelligence-quotient', 'into-the-night', 
    'in-the-raspberry-dawn', 'invincible-zone', 'in-your-dreams',
    'island-breeze', 'island-of-rainbows', 'japan-emperor', 'jungle-nature',
    'keep-it-simple', 'keep-on-smiling', 'keep-shining', 'kilimanjaro-outskirts', 
    'lady-blue', 'last-chance',
    'lavender-bliss', 'lemongrass-sky', 'lemon-lime', 'level-of-comfort',
    'life-quality', 'like-a-bird',
    'limited-edition', 'lions-mane', 'logical-intelligence', 'love-and-passion',
    'love-station', 'lucid-dream', 'lunar-eclipse', 'luxury-design', 'luxury-life', 'macaroni-penguin',
    'magellanic-penguin', 'magic-colors', 'magic-fly',
    'mammoth-tusk', 'maple-leaf-fall', 'maple-syrup', 'medieval-knights',
    'mediterranean-dreams', 'melting-glaciers', 'microtactic-environment', 'midnight-alchemy', 
    'midnight-black', 'midnight-train', 'midnight-elegance',
    'migratory-birds', 'modern-technology',
    'monochrome-ink','moonlit-path', 'morning-forest', 
    'mount-cook', 'mount-fuji', 'mountain-lake',
    'mountain-of-dreams', 
    'mountain-peak', 'my-dream-country',
    'new-ai', 'new-black', 'new-millenium', 'new-style', 'next-steps', 'neon-nights',
    'niagara-falls', 'night-dragon', 'night-sky','northern-nights','north-pole', 
    'north-pole-icebreaker', 'now-is-your-moment',
    'oceanfront-elegance', 'ocean-parkway', 'ocean-surf', 'ocean-view', 'ocean-vortex',
    'okinawa-breeze', 'one-step-ahead', 'one-step-at-a-time',
    'one-way-ticket', 'on-the-island', 'orange-country', 
    'orion-constellation', 'out-of-the-blue',
    'out-of-the-box', 'overnight-train', 'over-the-seven-seas', 
    'pacific-ocean', 'perfect-world', 'pink-flamingo', 'pink-lady', 'pink-lake', 'pirate-ship', 
    'polar-bear', 'porcupine-quill', 'port-victoria', 'positive-energy' , 'power-play',
    'practical-experience', 'practice-makes-perfect',
    'precious-question','progressive-decision', 'pure-light', 
    'purple-fog', 'quantum-programmer', 'queen-of-ambience', 'quiet-evening', 'quiet-progress',
    'rainbow-dream', 'rainforest-jungle', 'rain-waltz', 'random-coincidence',
    'real-results', 'red-lake', 'red-squirrel', 'remote-island',
    'right-on-track', 'rising-sun',
    'robin-good', 'royal-caribbean', 'samurai-path', 'science-fiction',
    'sea-breeze', 'seabreeze-avenue', 'sea-diamonds', 'sea-lions', 'sea-star', 'secret-item',
    'secret-night', 'secretive-ninja', 'selfless-programmer', 'serene-shores', 'shades-of-blue',
    'shaolin-monastery',
    'shift-in-perception', 'significant-improvement', 'silicon-valley', 
    'silver-dragon', 'sky-eagle', 'sky-hawk', 
    'skylight-window', 'small-happiness', 'small-success', 'solar-flare', 'something-special', 
    'spark-of-knowledge', 'spring-meadow', 'spring-silence',
    'statue-of-liberty', 'stay-cool', 'stay-positive',
    'steel-shadows', 'stockholm-roofs', 'straight-to-the-point',
    'strategic-advantage', 'strategic-planning',
    'strawberry-moon', 'strength-of-spirit', 'strong-foundation',
    'success-key','success-motivation', 'success-story', 'sunset-magic', 'sweet-misty-morning',
    'sword-of-fate', 'technological-future',
    'technological-might', 'tactical-advantage', 'tactical-command', 
    'the-best-of-fashion', 'the-black-spruce', 'the-dead-sea', 
    'the-desert-line', 'the-element-of-surprise','the-final-step',
    'the-great-silk-road', 'the-great-wall', 'the-hidden-jem', 'the-highest-level', 
    'the-last-day-of-spring', 'the-last-mohican', 'the-last-paradise',
    'the-modern-developer','the-perfect-blend', 'the-real-luxury',
    'the-silver-sword', 'the-spirit-of-innovation', 
    'the-unstoppable-mindset', 'the-west-coast', 'tide-of-dreams',
    'time-complexity', 'time-machine', 'time-to-chill', 'tokyo-at-night', 
    'tropical-islands', 'tropical-jungle', 'tropical-nature',
    'tropical-sunset', 'turquoise-frontier', 'twilight-garden',
    'unforgettable-moments', 'unseen-wonders', 'untouched-paradise', 'urban-fashion', 
    'velvety-dark', 'vibrant-colors',
    'viking-helmet','viktoria-falls', 'weekend-downtime', 'weekend-mindset',
    'white-shark', 'white-steamboat', 'white-sun-of-the-desert', 'wild-flower',
    'wild-rose', 'wild-wonders', 'winter-wonderland', 'wonderful-experience',
    'world-champion', 'work-of-art', 'yellow-eyed-penguin', 'your-wildest-dreams',
    'your-wildest-guess', 'zodiac-constellations'

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