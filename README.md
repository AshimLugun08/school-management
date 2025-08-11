# School Management System

A full-stack web application that helps manage and locate schools with their geographical coordinates. The system allows users to add new schools and find nearby educational institutions based on their current location.

## Features

- 🏫 Add new schools with details (name, address, coordinates)
- 📍 Get user's current location
- 🔍 Find nearby schools sorted by distance
- 📱 Responsive design with modern UI
- 🗺️ Distance calculation between user and schools
- ✨ Real-time form validation
- 🚀 Fast performance with Vite and React

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- Lucide React for icons
- React Hooks for state management

### Backend
- Node.js with Express
- PostgreSQL with PostGIS for geographical queries
- Express Validator for input validation
- CORS enabled for cross-origin requests

## Project Structure

```
├── backend/
│   ├── controllers/
│   │   └── schools.js      # School-related business logic
│   ├── routes/
│   │   └── schools.js      # API route definitions
│   ├── db.js              # Database connection setup
│   ├── index.js           # Express server setup
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx        # Main application component
│   │   ├── main.tsx       # Application entry point
│   │   └── index.css      # Global styles
│   ├── index.html
│   ├── vite.config.ts     # Vite configuration
│   └── package.json
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL with PostGIS extension
- npm or yarn package manager

### Environment Variables

#### Backend (.env)
```
PORT=3000
DATABASE_URL=your_postgresql_connection_string
```

#### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:3000
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/AshimLugun08/school-management.git
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm start
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

## API Endpoints

### `POST /addSchool`
Add a new school to the database.

Request body:
```json
{
  "name": "School Name",
  "address": "School Address",
  "latitude": 19.0760,
  "longitude": 72.8777
}
```

### `GET /listSchools`
Get list of schools sorted by distance from provided coordinates.

Query parameters:
- `latitude`: User's latitude
- `longitude`: User's longitude

## Database Schema

The application uses PostgreSQL with PostGIS for geographical data:

```sql
CREATE TABLE schools (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  location GEOGRAPHY(POINT) NOT NULL
);
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.