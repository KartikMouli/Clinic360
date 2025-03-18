# Clinic 360 - Doctor Search & Appointment Booking System

This is a full-stack MERN (MongoDB, Express.js, React, Node.js) application that enables patients to search for doctors, view their availability, and book appointments. Doctors can manage their availability and locations.

## Table of Contents

*   [Features](#features)
*   [Setup and Installation Instructions](#setup-and-installation-instructions)
*   [API Usage Guide](#api-usage-guide)
*   [Sample Requests and Responses](#sample-requests-and-responses)
*   [Live Deployment Links](#live-deployment-links)
*   [Contributing](#contributing)
*   [License](#license)

## Features

*   **Doctor Search**: Search for doctors by specialization, location, and name.
    Redis Caching: Frequently searched queries are cached in Redis to reduce database load and improve response times.
*   **Doctor Profiles**: View detailed doctor profiles, including experience, location, and availability.
    Redis Caching: Doctor profiles are cached in Redis, allowing faster retrieval for subsequent requests.
*   **Appointment Booking**: Patients can book available time slots with doctors.
*   **Availability Management**: Doctors can set and manage their availability (working hours and consultation locations).
*   **Appointment Management**: Patients can view and cancel their appointments.
*   **User Authentication**: Secure user registration and authentication.
*   **Email Notifications**: Automatic email notifications for bookings and cancellations.
*   **Redux State Management**: Redux Toolkit for managing application state effectively.

## Setup and Installation Instructions

Follow these steps to set up the project locally:

1.  **Clone the repository:**

    ```
    git clone https://github.com/KartikMouli/Clinic360
    ```

2.  **Navigate to the project directory:**

    ```
    cd Clinic360
    ```

3.  **Install backend dependencies:**

    ```
    cd backend
    npm install
    ```

4.  **Configure environment variables:**

    *   Create a `.env` file in the `backend` directory.
    *   Add the following environment variables:

        ```
        MONGODB_URI=<your_mongodb_connection_string>
        JWT_SECRET=<your_jwt_secret>
        EMAIL_USER=<your_email_address>
        EMAIL_PASS=<your_email_password>
        EMAIL_FROM=<your_email_password>
        REDIS_HOST=<your_redis_host>
        REDIS_PORT=<your_redis_port>
        ```

        Replace the placeholder values with your actual configuration.

5.  **Start the backend server:**

    ```
    npm run dev
    ```

    This command starts the backend server in development mode.

6.  **Navigate to the frontend directory:**

    ```
    cd ../frontend
    ```

7.  **Install frontend dependencies:**

    ```
    npm install
    ```

8.  **Configure environment variables for the frontend (if needed):**

    *  The primary environment variable you might need to configure on the frontend is `API_URL`, which tells the frontend where to find the backend. You can create a `.env` or equivalent file in the `frontend` directory, and then update the build process or use a bundler like webpack to include this configuration when the frontend is built.

         ```
         VITE_API_URL=http://localhost:5000/api
         ```

         Since the VITE_API_URL starts with VITE, it needs to be used with `import.meta.env`.

9.  **Start the frontend development server:**

    ```
    npm run dev
    ```

    This command starts the frontend development server.

## API Usage Guide

The backend provides RESTful APIs for managing doctors, appointments, and users. All API endpoints are prefixed with `/api`.

### Authentication

Most API endpoints require authentication using JWT (JSON Web Tokens). You need to include the JWT token in the `Authorization` header with the format `Bearer <token>`.

### API Endpoints

#### 1. User Authentication

*   **POST `/api/auth/register/patient`**: Register a new patient.

    ```
    {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "password": "password123"
    }
    ```

*   **POST `/api/auth/register/doctor`**: Register a new doctor.

    ```
    {
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane@example.com",
      "password": "password123",
      "specialization": "Cardiologist",
      "experience": 5,
      "location": "New York"
    }
    ```

*   **POST `/api/auth/login`**: Log in as a user (patient or doctor).

    ```
    {
      "email": "john@example.com",
      "password": "password123",
      "role": "patient" // or "doctor"
    }
    ```

*   **POST `/api/auth/logout`**: Log out a user.
  Requires a valid JWT token.

*   **GET `/api/auth/me`**: Load the current user’s profile.
    Requires a valid JWT token.

#### 2. Doctor Management

*   **GET `/api/doctors/search?specialization=<specialization>&location=<location>&name=<name>`**: Search for doctors.
*   **GET `/api/doctors/:id`**: Get a doctor’s profile.
*   **POST `/api/doctors/availability`**: Set doctor availability slots.
    Requires a valid JWT token (doctor only).

    ```
    {
      "availabilitySlots": [
        {
          "date": "2025-03-15",
          "slots": ["09:00", "10:00", "11:00"]
        }
      ]
    }
    ```

*   **GET `/api/doctors/:id/availability/:date`**: Get a specific doctor availability for a given date.

#### 3. Appointment Management

*   **POST `/api/appointments/book`**: Book an appointment.
    Requires a valid JWT token (patient only).

    ```
    {
      "doctorId": "<doctor_id>",
      "appointmentDate": "2025-03-15",
      "startTime": "09:00"
    }
    ```

*   **POST `/api/appointments/cancel`**: Cancel an appointment.
    Requires a valid JWT token (patient only).

    ```
    {
      "appointmentId": "<appointment_id>",
      "patientId": "<patient_id>"
    }
    ```
*   **GET `/api/appointments/patient`**: Get Patient appoiments

#### 4. Location Management

*   **GET `/api/location`**: Get doctor locations.
    Requires a valid JWT token (doctor only).
*   **PUT `/api/location`**: Update doctor locations.
    Requires a valid JWT token (doctor only).

## Sample Requests and Responses

### 1. Search for Doctors

*   **Request**:
    ```
    GET /api/doctors/search?specialization=Cardiologist&location=New York&name=John
    ```
*   **Response (200 OK)**:
    ```
    [
      {
        "_id": "647b1c4a3b7b9a4b3b4c3d1a",
        "firstName": "John",
        "lastName": "Smith",
        "email": "john.smith@example.com",
        "specialization": "Cardiologist",
        "experience": 10,
        "location": "New York",
        "phoneNumber": "123-456-7890"
      }
    ]
    ```

### 2. Book an Appointment

*   **Request**:
    ```
    POST /api/appointments/book
    ```
    ```
    {
      "doctorId": "647b1c4a3b7b9a4b3b4c3d1a",
      "appointmentDate": "2025-03-15",
      "startTime": "09:00"
    }
    ```

*   **Response (201 Created)**:
    ```
    {
      "message": "Appointment booked successfully",
      "appointment": {
        "_id": "647b1c4a3b7b9a4b3b4c3d1b",
        "patientId": "647b1c4a3b7b9a4b3b4c3d1c",
        "doctorId": "647b1c4a3b7b9a4b3b4c3d1a",
        "appointmentDate": "2025-03-15T00:00:00.000Z",
        "startTime": "09:00",
        "status": "Scheduled"
      }
    }
    ```

### 3. Set Doctor Availability

*   **Request**:
    ```
    POST /api/doctors/availability
    ```
    ```
    {
      "availabilitySlots": [
        {
          "date": "2025-03-15",
          "slots": ["09:00"]
        }
      ]
    }
    ```
*   **Response (200 OK)**:

    ```
    {
        "message": "Availability updated successfully",
        "doctor": {
            "_id": "doctor_id",
            "availabilitySlots": [
                {
                    "date": "2025-03-15T00:00:00.000Z",
                    "slots": [
                        {
                            "time": "09:00",
                            "isAvailable": true
                        }
                    ]
                }
            ],
            "firstName": "Jane",
            "lastName": "Smith",
            "email": "jane@example.com",
            "password": "hashed_password",
            "specialization": "Cardiologist",
            "experience": 5,
            "location": "New York",
            "__v": 0
        }
    }
    ```

## Live Deployment Links

*   **Frontend**:  [Frontend Deployment](http://clinic360.vercel.app)
*   **Backend**:  [Backend API](https://arogoai-clinic360.onrender.com)


## Contributing

Contributions are welcome! Here's how you can contribute:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Implement your changes.
4.  Submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
