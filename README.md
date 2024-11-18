# Specctra DSN Viewer

A web-based viewer for Specctra DSN files, built with React and TypeScript. This tool allows you to visualize PCB (Printed Circuit Board) designs by dragging and dropping Specctra DSN files directly into your browser.

## Features

- 🖱️ Drag and drop DSN files
- 📋 Paste DSN content directly
- 🔍 Interactive PCB visualization
- 📱 Responsive design
- 🎯 Example file included

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/tscircuit/dsn-viewer.git
cd dsn-viewer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:5173`

## Usage

There are three ways to view a DSN file:

1. **Drag and Drop**: Simply drag a .dsn file from your computer into the browser window
2. **Paste Content**: Copy DSN file content and paste it using Ctrl/Cmd+V
3. **Example File**: Click the "open example" link to view a sample DSN file

## Built With

- [React](https://reactjs.org/) - UI Framework
- [TypeScript](https://www.typescriptlang.org/) - Programming Language
- [Vite](https://vitejs.dev/) - Build Tool
- [@tscircuit/pcb-viewer](https://github.com/tscircuit/tscircuit) - PCB Visualization
- [Tailwind CSS](https://tailwindcss.com/) - Styling

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Built by [tscircuit](https://github.com/tscircuit/tscircuit)
- Uses the [dsn-converter](https://github.com/tscircuit/dsn-converter) package for parsing DSN files
