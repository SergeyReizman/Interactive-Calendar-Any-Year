# Interactive Calendar

An engaging, user-friendly calendar application that allows users to view monthly calendars, navigate between years, and add events or reminders for specific dates. Built with pure HTML, CSS, and JavaScript, this project is perfect for personal or professional use.

## Features

- **Dynamic Year Navigation**: Easily switch between years using "Previous Year" and "Next Year" buttons.
- **Responsive Design**: Optimized for various devices, including desktops, tablets, and smartphones.
- **Event Management**: Click on any date to add an event or reminder. Events are displayed within the selected date's cell.
- **Today's Highlight**: The current date is automatically highlighted for quick reference.
- **Local Storage**: Events are saved locally in the browser and persist between page refreshes.
- **Accessible Design**: Uses contrasting colors and WCAG-compliant styles for better usability.

## Preview

![Interactive Calendar Screenshot](screenshot.png)  
*A screenshot of the Interactive Calendar in action.*

## Technologies Used

- **HTML5**: For structuring the calendar and content.
- **CSS3**: For responsive and visually appealing styles.
- **JavaScript**: For dynamic calendar generation and user interaction.

## How to Use

1. **Open the Application**:
   - Clone or download the repository.
   - Open `index.html` in your web browser.

2. **Navigate Between Years**:
   - Use the **Previous Year** and **Next Year** buttons to explore different years.

3. **Add Events**:
   - Click on any date to add a custom event or reminder.
   - Events are displayed within the selected date's cell.
   - Events are stored in your browser's `localStorage` and persist between sessions.

4. **View Today**:
   - The current date is automatically highlighted for easy identification.

## Folder Structure

```plaintext
Interactive-Calendar/
├── index.html       # Main HTML file
├── style.css        # Inline CSS for styling
├── script.js        # Inline JavaScript for functionality
├── README.md        # Project documentation
└── screenshot.png   # Placeholder for project screenshot

Future Improvements
Event Deletion: Allow users to remove events once they are no longer needed.
Event Editing: Provide an option to modify or update existing events.
Monthly Navigation: Add buttons to navigate between months without changing the year.
Custom Styling: Enable users to choose from different themes for the calendar.