Training Course Management and Booking System

Overview
This project is designed to develop a backend system for managing and booking training courses. The system allows users to:
Browse available courses.
Book training sessions.
Manage their registrations easily.

## Project Structure
├── src
│   ├── controllers      # Handle API requests
│   ├── models           # Define MongoDB schemas
│   ├── routes           # API routes
│   ├── services         # Business logic
│   └── utils            # Helper functions
├── tests                # Unit and integration tests
├── .env                 # environment variables
├── sonar-project.properties # SonarCloud configuration
├── package.json         # Dependencies and scripts
├── README.md            # This file
└── ...

## Features
User registration and authentication.
Course browsing and filtering.
Course booking and registration management.
Administrator tools for adding and updating course information.
Secure and optimized database using MongoDB.
Error handling and validation.

## Technologies Used
Node.js: JavaScript runtime.
Express.js: Web framework for Node.js.
MongoDB: NoSQL database to store course and user data.
Mongoose: MongoDB ORM for schema modeling and validation.
JWT: JSON Web Token for user authentication.
SonarCloud: Code quality analysis.
Jest: Testing framework for unit and integration tests.

## Node.js: JavaScript runtime.
Express.js: Web framework for Node.js.
MongoDB: NoSQL database to store course and user data.
Mongoose: MongoDB ORM for schema modeling and validation.
JWT: JSON Web Token for user authentication.
SonarCloud: Code quality analysis.
Jest: Testing framework for unit and integration tests.

## Installation
To get a local copy up and running, follow these steps:
1:Clone the repository:

git clone https://github.com/bessantomeh/LearnHub_Backend.git

2:Install dependencies:

npm install

## Running the Project
Start the development server: npm run dev
Run in production mode:npm start

## Testing
You can run tests using Jest:npm test


### Deployment
The backend system is deployed on **Render**, a cloud platform used for hosting and scaling web applications.

License
This project is licensed under the MIT License - see the LICENSE file for details.



