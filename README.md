[![security: bandit](https://img.shields.io/badge/security-bandit-yellow.svg)](https://github.com/PyCQA/bandit)
[![Code style: black](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/psf/black)

# WhatsMyName Web Application

This is a web-based version of the [WhatsMyName](https://github.com/WebBreacher/WhatsMyName) project with a modern, terminal-like UI using Flask and vanilla JavaScript.

## Features

- Web-based interface with a terminal-like UI
- Real-time updates using WebSockets
- Search for usernames across various platforms
- Export options for search results (HTML, Excel, PDF)
- Dark and light theme toggle
- Responsive design

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/YourUsername/WhatsMyName-Web.git
   cd WhatsMyName-Web
   ```

2. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

## Usage

1. Start the Flask server:
   ```
   python main.py
   ```

2. Open your web browser and navigate to `http://localhost:5000`

3. In the terminal-like interface, you can use the following commands:
   - Enter a username to search across various platforms
   - Type `help` to see available commands
   - Type `clear` to clear the terminal

4. After a search is complete, you can view and download reports in HTML, Excel, and PDF formats.

## Features

- **Real-time Updates**: As the application finds sites for the given username, it provides instant feedback.
- **Multiple Export Options**: Generate reports in HTML, Excel, and PDF formats.
- **Theme Toggle**: Switch between dark (green on black) and light (blue on white) modes for better visibility.
- **Command Execution Locking**: Only one command can be executed at a time, preventing potential conflicts.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [WhatsMyName Project](https://github.com/WebBreacher/WhatsMyName)
- Created by [Vance Poitier](https://www.linkedin.com/in/vance-poitier)

