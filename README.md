# Authentication System - Node.js, Express.js, MongoDB

🌐 Live Site [here](https://auth-system-v2.onrender.com)

## Overview

This project is a backend application built with Node.js, Express.js, and MongoDB for handling user authentication. The application includes a login form and a registration form, with additional advanced features introduced in Version 2, such as "Remember Me," "Forgot Password," and password update via OTP request.

## Features

### Version 1 - Basic Features
- **Registration Form:**
  - Name
  - Email
  - Password

- **Login Form:**
  - Email
  - Password

### Version 2 - Advanced Features
- **Remember Me:** 
  - Option to stay logged in after closing the browser. 
  - Utilizes long-lived JWT tokens to maintain the session.
  
- **Forgot Password:**
  - Allows users to request a password reset via email using a 6-digit OTP.
  
- **Update Password:**
  - Secure password update process through OTP verification.
  - A password reset link is sent after OTP verification, which expires in 5 hours.

### Security Implementations
- **Password Hashing:** 
  - Passwords are securely hashed using bcrypt before storing them in MongoDB.
  
- **JWT Authentication:** 
  - JSON Web Tokens (JWT) are used for secure session management. 
  - Authentication middleware is implemented to verify token validity for protected routes.
  
- **Error Handling:** 
  - Custom error handler middleware to catch and handle runtime errors gracefully.
  
- **OTP Expiration & Security:** 
  - OTPs have a short expiration time to enhance security.
  - Password reset links expire 5 hours after OTP verification, with a message displayed if the link is accessed after expiration.

## Routes

- `/auth`: 
  - Handles all authentication-related routes such as login, register, OTP verification, and password reset.
  
- `/home`: 
  - Protected route accessible only after successful authentication.

## Technologies Used

- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Frontend:** HTML, CSS, JavaScript
- **Security:** bcrypt, JWT, OTP verification

## Installation & Setup

### Prerequisites
Make sure you have the following installed on your machine:
- **Node.js:** [Download & Install Node.js](https://nodejs.org)
- **MongoDB Account:** Create a MongoDB account and set up a cluster [here](https://www.mongodb.com/cloud/atlas).

### Steps

1. **Clone the Repository:**
   Clone the project repository to your local machine using the following command:
   ```bash
   git clone <repository-url>
   cd <repository-name>
2. **Create these variables in .env file:**

   SECRET_KEY: A secret key used for JWT signing.

   JWT_LIFETIME: The expiration time for JWT tokens (e.g., 1d, 7d).

   MONGO_URI: The URI for connecting to your MongoDB database.

   EMAIL_USER and EMAIL_PASSWORD: Obtain these credentials from the email account you intend to use for sending emails to users. For guidance on generating an App Password in Gmail, you may refer to tutorials available on YouTube.
3. **Instructions to Obtain MONGO_URI**

    Go to MongoDB Atlas and log in.

    Create a new cluster (or use an existing one).

    Click the Connect button for your cluster.

    Choose Connect your application.

    Copy the connection string 

    Replace "username", "password", and "dbname" with your credentials and database name.

**Important:** Make sure to replace <password> with your actual database password and do not include angle brackets.

4. **Install Dependencies:** npm install

5. **Start the Server:** npm start 
