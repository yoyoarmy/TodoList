# Task Manager Web Application

A full-stack task management application with user authentication, dark mode support, and real-time task filtering capabilities.

## Features

- **User Authentication**
  - Secure login and registration system
  - JWT-based authentication
  - Password hashing for security

- **Task Management**
  - Create, read, update, and delete tasks
  - Mark tasks as complete/incomplete
  - Search functionality
  - Filter tasks (All, Active, Completed)

- **UI Features**
  - Responsive design
  - Dark mode support
  - Clean and intuitive interface
  - Real-time updates

## Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript (Vanilla)
- Font Awesome Icons

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (JSON Web Tokens)
- bcrypt.js

## Prerequisites

- Node.js (v12 or higher)
- MongoDB (v4 or higher)
- Modern web browser

## Installation

1. Clone the repository:

bash
git clone [repository-url]
cd TodoList

2. Install dependencies:

bash
npm install


3. Set up MongoDB:
- Ensure MongoDB is running on your system
- The default connection URL is: `mongodb://localhost:27017/todolist`

4. Start the server:

bash
node server.js

5. Open your browser and navigate to `http://localhost:3000` to access the application.

## Project Structure
TodoList/
├── public/
│ ├── auth.js # Authentication handling
│ ├── script.js # Main application logic
│ ├── styles.css # Main styles
│ ├── loginstyle.css # Login/Register styles
│ ├── index.html # Login page
│ ├── register.html # Registration page
│ └── taskmanager.html# Main application page
└── server.js # Backend server



## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - User login

### Tasks
- `GET /tasks` - Fetch all tasks
- `POST /tasks` - Create new task
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task

## Security Features

- Password hashing using bcrypt
- JWT-based authentication
- Protected API endpoints
- Input validation
- Secure session management

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Font Awesome for icons
- MongoDB for database
- Express.js community