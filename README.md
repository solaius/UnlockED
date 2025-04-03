# UnlockED - Chemistry Nomenclature Learning Platform

UnlockED is an educational platform designed to help students learn chemistry nomenclature through personalized, scaffolded learning paths with adaptive AI feedback.

## Features

- **Personalized Learning Paths**: Scaffolded lessons that adapt to student progress
- **Interactive Questions**: Multiple-choice and fill-in-the-blank questions with immediate feedback
- **AI-Powered Feedback**: Intelligent evaluation of student answers with targeted hints
- **Gamification Elements**: Points, badges, and progress tracking to motivate students
- **Teacher Dashboard**: Monitor student progress and generate performance reports

## Project Structure

- **Frontend**: React-based user interface
- **Backend**: Node.js/Express API with MongoDB database
- **AI Module**: Python Flask API for answer evaluation
- **Content System**: Structured lessons and questions for chemistry nomenclature

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB
- Python 3.9+
- Docker and Docker Compose (optional)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/solaius/UnlockED.git
   cd UnlockED
   ```

2. Install dependencies:
   ```
   # Frontend
   cd frontend
   npm install
   
   # Backend
   cd ../backend
   npm install
   
   # AI Module
   cd ../ai-module
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   - Create a `.env` file in the backend directory with the following variables:
     ```
     PORT=5000
     MONGO_URI=mongodb://localhost:27017/unlocked
     JWT_SECRET=your_secret_key
     NODE_ENV=development
     ```

4. Seed the database:
   ```
   cd backend
   node seed.js
   ```

### Running the Application

#### Without Docker

1. Start the backend server:
   ```
   cd backend
   npm start
   ```

2. Start the AI module:
   ```
   cd ai-module
   python app.py
   ```

3. Start the frontend:
   ```
   cd frontend
   npm start
   ```

4. Access the application at `http://localhost:3000`

#### With Docker

1. Build and start all services:
   ```
   docker-compose up
   ```

2. Access the application at `http://localhost:3000`

## Default Users

After seeding the database, you can log in with the following credentials:

- **Student Account**:
  - Email: student1@example.com
  - Password: password123

- **Teacher Account**:
  - Email: teacher1@example.com
  - Password: password123

## License

This project is licensed under the MIT License - see the LICENSE file for details.