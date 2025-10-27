// calendar.js - Interactive Calendar with Event Management, Themes, and Weather Integration

// SIMPLE DONATION REMINDER
if (!localStorage.donation_reminder_shown) {
  setTimeout(function () {
    if (confirm('❤️ Enjoying this calendar?\n\nSupport its development with a small donation?')) {
      window.open('https://my.israelgives.org/en/fundme/Interactive_Calendar', '_blank');
    }
    localStorage.donation_reminder_shown = 'yes';
  }, 3000);
}

// YOUR EXISTING CALENDAR CODE STARTS HERE...

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
    'action-time', 'adelaide-skyline', 'a-desert-island',
    'adriatic-coastline', 'adriatic-sea', 'adriatic-shores', 'adriatic-skies',
    'adriatic-stars', 'a-foraging-trip', 'a-forward-move',
    'a-good-chapter', 'a-good-idea', 'a-great-experience', 'a-huge-moment', 'air-power',
    'a-king-of-stone', 'alaska-glacial-water', 'alaska-highway',
    'aloe-vera', 'alone-in-paradise', 'a-lovely-day',
    'alpha-centauri', 'alpine-landscape', 'amazing-opportunity',
    'amazing-sunrise', 'amazon-dolphin', 'amazon-rainforest', 'amazon-river', 'american-dream',
    'andromeda-galaxy', 'a-new-chapter', 'a-new-opportunity', 
    'antarctic-expedition', 'antarctic-ice',
    'antarctic-snowdrifts', 'apple-in-honey', 'aqua-marina', 'aqua-spirit',
    'a-quiet-creek', 'arctic-glow', 'arctic-snowfall',
    'art-studio', 'a-simple-task', 'a-solitude-moment', 'a-stunning-shoreline', 'a-thing-of-beauty',
    'a-turning-point', 'autumn-harvest', 'away-from-home', 'a-world-beyond-borders',
    'back-in-black', 'back-in-the-game', 'back-on-track', 'back-to-paradise', 'bamboo-flute',
    'battle-of-the-ice', 'bermuda-triangle', 'best-kept-secret', 
    'best-of-technology', 'best-practice', 'best-response', 'beyond-the-ordinary',
    'be-yourself', 'bigboss-style', 'big-crown', 'big-dream', 'big-fashion', 'big-pacific',
    'black-fashion', 'black-bird', 'black-classic', 'black-coffee', 'black-diamond',
    'black-hacker', 'black-hawk', 'black-hole', 'black-magic', 'black-mountain',
    'black-orange', 'black-orchid', 'black-panther', 'black-pear', 'black-pearl',
    'black-silver', 'black-style', 'black-velvet', 'black-violet', 'blue-and-violet',
    'blue-angels', 'blue-banana', 'blue-bird',
    'blue-bliss', 'blue-dragon', 'blue-frost', 'blue-gold',
    'blue-horizon', 'blue-ice', 'blue-island-waters', 'blue-lagoon', 'blue-marine',
    'blue-mountains', 'blue-ocean', 'blue-planet',
    'blue-rocky-roads', 'blue-sky', 'blue-stars', 'blue-system',
    'blue-whale', 'blue-white', 'blue-window',
    'bold-vision', 'bora-bora', 'boston-celtics',
    'box-of-surprises', 'breaking-point', 'break-the-night',
    'breathtaking-view', 'bright-line', 'brilliant-white', 'bronze-horseman',
    'business-class', 'cacao-plantation', 'cafe-de-colombia', 'california-sunshine',
    'camomile-flowers', 'canary-islands', 'can-do-attitude', 'candy-world',
    'captains-choice', 'cardinals-guards', 'caribbean-beaches',
    'caribbean-sea', 'celestial-objects', 'centaurus-constellation',
    'cherry-garden', 'chicago-bulls', 'cinnamon-street', 'citrus-blaze',
    'city-of-angels', 'city-of-dreams', 'city-of-night', 'city-skyline', 'classic-escape',
    'clean-code', 'clean-energy', 'coastal-atlantic', 'coastal-beauty', 'coastal-gulf',
    'coastal-pacific', 'coconut-islands', 'coconut-shores',
    'coffee-for-leaders', 'color-of-my-dreams',
    'colors-of-a-dream', 'color-symphony', 'collaboration-idea',
    'colombian-jungle', 'competitive-advantage', 'continuous-growth',
    'cool-atlantic-waves', 'coral-garden',
    'coral-reef', 'coral-sunset', 'core', 'cosmic-nebula', 'cosmic-perspective',
    'cracked-ice', 'creative-content', 'crimson-sky',
    'crisp-mountain-air', 'critical-thinking',
    'crossroads-stone', 'crystal-snowfall', 'crystal-stream', 'cultural-escape',
    'cyber-pulse', 'dark-chocolate', 'dark-code', 'dark-mode', 'darkness-blue',
    'dark-star', 'dartagnans-rapier', 'daruma-doll',
    'deep-forest', 'deep-ocean', 'deep-space', 'deep-tropics',
    'desert-between-us', 'desert-miracle',
    'desert-mirage', 'desert-rose', 'desert-water', 'destiny-to-succeed',
    'developers-zone', 'diamond-planet', 'different-perspective',
    'digital-excellence', 'digital-interface', 'digital-ocean',
    'digital-progress', 'distant-skies', 'divi-divi-trees',
    'domino-dancing', 'domino-effect',
    'doterra-black', 'doterra-colors', 'doterra-gold', 'doterra-green',
    'doterra-magic', 'doterra-natural', 'doterra-new', 'doterra-power',
    'double-rainbow', 'dragonfire',
    'dragon-flame', 'dragonfly', 'dragon-well', 'dramatic-coastline.css', 'dream-adventure',
    'dream-islands', 'dream-lagoon', 'eagle-beach-aruba', 'eagle-creek', 'eagle-river',
    'eagle-swoop', 'early-dreams', 'eco-friendly', 'eighty-mile-beach', 'emerald-lake',
    'emerald-stream', 'emerald-water', 'emperor-penguin', 'endless-horizon', 'endless-summer',
    'enjoy-the-journey', 'essential-oils', 'everest-view', 'every-little-step-counts',
    'excellent-mood', 'excellent-performance', 'exceptional-quality', 'executive-management',
    'exotic-escape', 'exotic-island', 'expedient-path', 'expedition-north',
    'exponential-acceleration', 'extraordinary-achievement', 'fabulous-evening',
    'fairytale-charm', 'fairytale-town', 'fast-track', 'fiji-islands',
    'finish-line', 'fir-balsam', 'flamingo-sky',
    'flamingo-sky', 'forgotten-dreams', 'formula-one',
    'for-the-last-time', 'forward-thinking', 'free-flight', 'fresh-start', 'frontier-unknown',
    'frozen-magic', 'frozen-wilderness', 'full-pink-moon', 'fun-activity',
    'galactic-glow', 'game-changer', 'games-are-fun', 'genghis-khan-arrow',
    'giant-petrel', 'global-impact',
    'glorious-day', 'gold-coast', 'golden-century', 'golden-eagle',
    'golden-gate', 'golden-gate-bridge',
    'golden-hillsides', 'golden-horizon', 'golden-langur',
    'golden-lights', 'golden-opportunity', 'golden-state-warriors',
    'golden-summer', 'golden-time', 'gold-mine', 'good-game',
    'gradual-improvement', 'grand-prix', 'great-britain', 'great-idea',
    'great-lakes', 'greece-is-bliss', 'green-city', 'green-coffee', 'green-heaven',
    'greenland-icebergs', 'green-light', 'green-river', 'green-tea',
    'greyscale', 'group-11',
    'guangzhou-lights', 'haute-couture', 'hawaiian-blue',
    'heavy-rain', 'hidden-gems', 'hidden-paradise', 'hidden-trail',
    'high-energy', 'high-intelligence', 'highline-trail', 'high-performance',
    'high-speed-rail', 'high-speed-train', 'high-style', 'high-tech-industry',
    'hometown-vibes', 'honolulu-hawaii', 'honolulu-weekend', 'hot-desert-summer',
    'hurricane-clouds', 'hyperloop', 'iceberg-edge',
    'iceberg-lake', 'ice-giant', 'ice-palace',
    'iceland-volcanoes', 'imaginary-world',
    'in-adriatic-waters', 'indigo-jeans', 'in-my-style',
    'inspiration-line', 'intelligence-quotient', 
    'inter-miami', 'in-the-dusk', 'in-the-mountains',
    'in-the-raspberry-dawn', 'into-the-jungle', 'into-the-night',
    'invincible-zone', 'in-your-dreams', 'island-bay',
    'iron-silence', 'island-beauty', 'island-breeze', 'island-glow',
    'island-of-rainbows', 'japan-emperor', 'jungle-nature', 'just-around-the-bend',
    'keep-cool', 'keep-it-simple', 'keep-on-smiling', 'keep-shining',
    'kilimanjaro-outskirts', 'lady-blue', 'lake-mcdonald',
    'land-of-dreams', 'land-of-tomorrow',
    'last-chance', 'lavender-bliss', 'lemongrass-sky', 'lemon-lime',
    'level-of-comfort', 'life-quality', 'light-and-shadows', 'like-a-bird',
    'limited-edition', 'lions-mane', 'logical-intelligence', 'long-beach',
    'long-beach-fiji', 'los-angeles-lakers', 'los-angeles-sky', 'love-and-passion',
    'love-of-yesterday', 'love-station', 'lucid-dream', 'lunar-eclipse',
    'lush-green-mountains', 'luxury-design', 'luxury-life', 'macaroni-penguin',
    'magellanic-penguin', 'magic-colors', 'magic-fly', 
    'magic-island', 'magnificent-symbol', 'main-stream',
    'mammoth-tusk', 'manchester-city', 'manchester-united',
    'maple-leaf-fall', 'maple-syrup', 'medieval-knights',
    'mediterranean-dreams', 'melting-glaciers', 'microtactic-environment',
    'middle-amazonia', 'middle-of-nowhere', 
    'middle-of-the-night', 'midnight-alchemy',
    'midnight-black', 'midnight-jungle',
    'midnight-sun', 'midnight-train', 'midnight-elegance',
    'migratory-birds', 'mirror-lake', 'mission-completed', 'modern-technology',
    'mogren-beach', 'monochrome-ink', 'monte-carlo', 'moon-bridge',
    'moonlit-path', 'morning-coffee', 'morning-forest', 'mountain-lake', 'mountain-landscape',
    'mountain-mood', 'mountain-of-dreams', 'mountain-peak', 'mountain-sunset', 'mountain-view',
    'mount-cook', 'mount-fuji', 'my-beautiful-village', 'my-dream-country', 'my-dream-home',
    'my-tomorrow', 'natural-wonders', 'neon-nights', 'new-ai', 'new-black', 'new-millenium',
    'new-mission', 'new-strategy', 'new-style', 'new-wings', 'next-level', 'next-steps',
    'niagara-falls', 'night-dragon', 'night-mode-design', 'night-ninja', 'night-sky',
    'no-place-like-home', 'northern-lights', 'northern-nights', 'north-pole',
    'north-pole-icebreaker', 'now-is-your-moment', 'ocean-beach', 'ocean-dreams',
    'oceanfront-elegance', 'ocean-parkway', 'ocean-surf', 'ocean-view',
    'ocean-view-drive', 'ocean-vortex', 
    'off-road-trip', 'okinawa-breeze', 'old-lighthouse',
    'olimpia-milano', 'one-dream', 'one-step-ahead', 'one-step-at-a-time',
    'one-way-ticket', 'on-the-island', 'on-the-moon',
    'on-the-wild-side', 'orange-country',
    'orange-dragon', 'orion-constellation', 'our-favorite-hangout', 'out-of-the-blue',
    'out-of-the-box', 'overnight-train', 'over-the-seven-seas',
    'pacific-division', 'pacific-ocean',
    'palma-de-mallorca', 'palm-beach', 'palm-beach-aruba', 'palm-tree',
    'panther-lake', 'patagonian-shores', 'patagonian-sky', 'perfect-afternoon',
    'perfect-level', 'perfect-world', 'pink-flamingo',
    'pink-lady', 'pink-lake', 'pirate-ship', 'planet-of-robots', 'point-nemo',
    'polar-bear', 'porcupine-quill', 'port-victoria', 'positive-energy', 'power-play',
    'practical-experience', 'practice-makes-perfect',
    'precious-question', 'premium-quality', 'pristine-lake', 'progressive-decision', 
    'pure-light', 'purple-fog', 'purple-sunset', 'quantum-programmer', 'queen-of-ambience',
    'quiet-confidence', 'quiet-evening', 'quiet-progress',
    'race-ready', 'rainbow-dream', 'rainforest-jungle', 'rain-waltz',
    'random-coincidence', 'real-madrid',
    'real-results', 'red-desert', 'red-grapefruit', 'red-lake', 
    'red-morning-light', 'red-squirrel', 'remarkable-city',
    'remote-island', 'right-on-track', 'rising-sun', 
    'road-to-nowhere', 'robin-good', 'rocky-mountains',
    'royal-caribbean', 'royal-crown', 'sacramento-kings',
    'saint-tropez-moon', 'samurai-path',
    'san-francisco-lights', 'san-francisco-sunrise',
    'santa-barbara', 'santa-monica', 'science-fiction',
    'sea-breeze', 'seabreeze-avenue', 'sea-diamonds', 'seahorse', 'sea-lions', 'sea-star', 'secret-item',
    'secret-night', 'secretive-ninja', 'selfless-programmer',
    'senior-management', 'serene-shores', 'shades-of-blue', 'shaolin-monastery',
    'shaping-the-future', 'shift-in-perception', 'significant-improvement',
    'silent-code', 'silicon-valley',
    'silver-dragon', 'sky-diving', 'sky-eagle', 'sky-hawk', 'skylight-window',
    'small-happiness', 'small-success', 'smiley-world',
    'snake-river', 'snoopy-white', 'snow-leopard', 'soft-balance',
    'solar-flare', 'something-special', 'spark-of-knowledge', 'spring-meadow', 'spring-silence',
    'statue-of-liberty', 'stay-cool', 'stay-curious', 'stay-positive', 'stay-that-way',
    'stay-your-way', 'steel-shadows', 'still-a-highlight', 'stockholm-roofs',
    'straight-to-the-point', 'strategic-advantage', 'strategic-planning',
    'strawberry-moon', 'street-art-installation', 'street-fashion-style',
    'strength-of-spirit', 'strings-of-sunrays', 'strong-and-free', 'strong-foundation',
    'style-spectrum', 'success-key', 'success-motivation', 'success-story',
    'summer-breeze', 'summer-sky', 'summer-vibes',
    'sunflower-fields', 'sunny-beach', 'sunrise-over-the-ocean', 'sunset-beach',
    'sunset-magic', 'sunset-point', 'supreme-level', 'surfing-club', 'sweet-misty-morning', 'swiss-train',
    'sword-of-fate', 'tactical-advantage', 'tactical-command', 'take-me-to-summer', 'tea-garden',
    'tech-innovator', 'technological-future', 'technological-innovation', 'technological-might',
    'the-art-of-visible', 'the-best-escape', 'the-best-kind-of-view',
    'the-best-mood', 'the-best-of-fashion', 'the-black-lake', 'the-black-spruce',
    'the-burning-heart-of-the-sahara', 'the-dead-sea', 'the-deepest-point',
    'the-desert-line', 'the-element-of-surprise', 'the-final-step',
    'the-finest-green-tea', 'the-first-prize', 'the-gold-standard',
    'the-great-silk-road', 'the-great-wall', 'the-green-mist',
    'the-hidden-jem', 'the-highest-level', 'the-highest-peak', 'the-huge-event',
    'the-last-day-of-spring', 'the-last-mohican', 'the-last-paradise',
    'the-modern-developer', 'the-perfect-blend', 'the-prince-of-monaco', 'the-real-luxury',
    'the-red-city', 'the-silver-sword', 'the-spirit-of-innovation', 'the-unstoppable-mindset',
    'the-west-coast', 'the-world-of-nature', 'think-different', 'tide-of-dreams',
    'tiger-design', 'time-complexity', 'time-machine', 'time-to-chill', 'tokyo-at-night',
    'too-beautiful-to-be-true', 'toronto-raptors', 'tropical-horizon',
    'tropical-islands', 'tropical-jungle', 'tropical-nature', 'tropical-paradise',
    'tropical-sunset', 'turquoise-frontier', 'twilight-garden', 
    'under-the-sun', 'underwater-life',
    'unexpected-layout', 'unforgettable-moments', 'unseen-wonders', 'untouched-paradise',
    'upcoming-dream', 'urban-fashion', 'urban-jungle', 'velvety-dark', 'vibrant-colors',
    'viking-helmet', 'viktoria-falls', 'watermelon',
    'waikiki-beach', 'weekend-downtime', 'weekend-mindset',
    'we-fly-higher', 'west-hollywood', 'whale-shark', 'when-style-speaks-first',
    'white-cherry-tree', 'white-shark', 'white-steamboat',
    'white-sun-of-the-desert', 'wild-escape',
    'wild-flower', 'wild-orange', 'wild-rose', 'wild-tropics',
    'wild-wonders', 'winter-trails', 'winter-wonderland', 'wonderful-experience',
    'world-champion', 'work-of-art', 'yellow-eyed-penguin', 'your-dreamland',
    'your-wildest-dreams', 'your-wildest-guess', 'zodiac-constellations'

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