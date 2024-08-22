# Mentor-Student Scheduling System(Career carve)

## Built By

- **Rakesh Pabbathi**

## Project Overview

This project is a simple scheduling system for a mentor-student platform. It provides an API for managing mentors, students, and bookings. The backend is built using Node.js, Express, and SQLite, offering functionalities such as listing mentors, creating bookings, scheduling sessions with mentors, and calculating payment for sessions.

## Table of Contents

1. [Project Structure](#project-structure)
2. [API Endpoints](#api-endpoints)
   - [Get All Mentors](#get-all-mentors)
   - [Get All Bookings for a Student](#get-all-bookings-for-a-student)
   - [Create a New Booking](#create-a-new-booking)
   - [Schedule a Session](#schedule-a-session)
   - [Calculate Payment](#calculate-payment)
3. [Database Schema](#database-schema)
4. [Error Handling](#error-handling)
5. [How to Run](#how-to-run)
6. [Credits](#credits)

## Project Structure

The project consists of the following files:

- `index.js`: The main entry point for the Express server, handling routes and database connections.
- `schedular.db`: The SQLite database file used for storing data related to mentors, students, and bookings.

### Bakend Deploy link:https://careercarve-backend-rakesh.onrender.com
## API Endpoints

### Get All Mentors

- **Endpoint**: `GET /mentors`
- **Description**: Fetches a list of all mentors available in the system.
- **Response**: Returns an array of mentors with their details.
 
## Sample Mentor Data

Here is an example of the mentor data available in the system:

```json
  [
    {"mentor_id":1,"name":"Charlie","availability":"Monday-Friday, 10 AM - 4 PM","areas_of_expertise":"UI/UX Design, Figma","is_premium":1},
    {"mentor_id":2,"name":"David","availability":"Monday-Wednesday, 1 PM - 6 PM","areas_of_expertise":"Project Management, Agile","is_premium":0},
    {"mentor_id":3,"name":"Emily","availability":"Tuesday-Thursday, 3 PM - 9 PM","areas_of_expertise":"Digital Marketing, SEO","is_premium":1},
    {"mentor_id":4,"name":"Frank","availability":"Monday-Friday, 8 AM - 3 PM","areas_of_expertise":"Software Testing, Automation","is_premium":0},
    {"mentor_id":5,"name":"Grace","availability":"Tuesday-Friday, 11 AM - 5 PM","areas_of_expertise":"Mobile App Development, Flutter","is_premium":1},
    {"mentor_id":6,"name":"Henry","availability":"Monday-Wednesday, 2 PM - 7 PM","areas_of_expertise":"Cloud Computing, AWS","is_premium":0},
   .......
  ]
```
- **Endpoint**: `GET /bookings`
- **Query Parameters**: `student_id` - The ID of the student whose bookings you want to retrieve.
- **Description**: Fetches all bookings made by a specific student.
- **Response**: Returns an array of bookings.

### Create a New Booking

- **Endpoint**: `POST /bookings`
- **Body**:
  ```json
  {
  "student_id": 101,
  "mentor_id": 1,
  "area_of_interest": "Digital Marketing",
  "duration": 45,
  "scheduled_time": "2024-08-22T19:00:00Z"
  }
  ```
- **Description**: Creates a new booking between a student and a mentor.
- **Response**: Confirmation message that the booking was successfully created.

### GET student Booking Details based student id
  - ### **GET** http://localhost:3000/bookings?student_id=101
  - **response**:

    ```json
    {"booking_id":1,
    "student_id":101,
    "mentor_id":1,
    "duration":45,
    "scheduled_time":"2024-08-22T19:00:00Z"}
    ```

### Schedule a Session

- **Endpoint**: `POST /schedule-session`
- **Body**:
  ```json
  {
    "student_id": 3,
    "area_of_interest": "Web Development",
    "duration": 45,
    "requested_time": "2024-08-22T19:00:00Z",
    "is_premium": false
  }
  ```
- **Description**: Schedules a session with a mentor based on the student's area of interest, requested time, and premium status.
- **Response**: Confirmation message along with the assigned mentor's name.

### Calculate Payment

- **Endpoint**: `POST /calculate-payment`
- **Body**:
  ```json
  {
    "duration": 45,
    "is_premium": true
  }
  ```
- **Description**: Calculates the payment required for a session based on its duration and whether the mentor is premium.
- **Response**: Returns the calculated cost. ex: ```json {"cost":2000} ```

## Database Schema

The project uses an SQLite database with the following tables:

### `mentor`

- `mentor_id`: Unique ID for each mentor.
- `name`: Name of the mentor.
- `availability`: Mentor's availability schedule.
- `areas_of_expertise`: Expertise areas of the mentor.
- `is_premium`: Whether the mentor is a premium mentor (0 or 1).

### `student`

- `student_id`: Unique ID for each student.
- `name`: Name of the student.
- `availability`: Student's availability.
- `area_of_interest`: Area of interest for mentoring.

### `booking`

- `booking_id`: Unique ID for each booking.
- `student_id`: ID of the student making the booking.
- `mentor_id`: ID of the mentor being booked.
- `duration`: Duration of the booked session in minutes.
- `scheduled_time`: The scheduled time for the booking.

## Error Handling

Each API endpoint includes error handling to manage potential issues, such as missing parameters, invalid data, or database errors. Errors are logged to the console, and appropriate HTTP status codes and messages are returned to the client.

## How to Run

1. Clone or download this repository.
2. Install the necessary dependencies using:
   ```bash
   npm install
   ```
3. Start the server using:
   ```bash
   nodemon index.js
   ```
4. The server will run on `http://localhost:3000/` by default.

## Credits

- **SQLite**: The lightweight database used for this project.
- **Express**: The web framework used to build the API.
- **Node.js**: The JavaScript runtime environment for executing server-side code.
- **API Testing**:https://reqbin.com/

## Conclusion

This project provides a basic backend for a mentor-student scheduling system with features such as mentor management, booking creation, session scheduling, and payment calculation. The use of Node.js, Express, and SQLite ensures a lightweight and efficient solution.


