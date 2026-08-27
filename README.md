# EventPulse API

EventPulse is a Node.js backend API that simulates an event management
platform. It provides authentication and role-based access control,
event management, attendee registrations, announcements, real-time
updates with Socket.IO, input validation, centralized error handling,
and automated unit/integration testing.

## Tech Stack

-   **Node.js** --- JavaScript runtime
-   **Express** --- HTTP API framework
-   **MongoDB / Mongoose** --- database and ODM
-   **Socket.IO** --- real-time event announcements
-   **JWT** --- authentication
-   **bcrypt** --- password hashing
-   **express-validator** --- request validation
-   **Morgan** --- HTTP request logging
-   **Jest** --- unit testing
-   **Supertest** --- HTTP integration testing
-   **Swagger UI / swagger-jsdoc** --- API documentation
-   **Vercel** --- deployment

## Features

-   User registration and JWT login
-   Admin and attendee roles
-   Admin-only event creation, updating, and deletion
-   Event listing with filtering, sorting, searching, field selection,
    and pagination
-   Attendee event registration with duplicate-registration and capacity
    checks
-   Registration cancellation using soft deletion
-   Event-specific announcements
-   Real-time announcements through Socket.IO rooms
-   JWT authentication for Socket.IO connections
-   Input validation with `express-validator`
-   Centralized application and database error handling
-   Jest unit tests for core utilities
-   Supertest integration tests for HTTP endpoints
-   Swagger API documentation

## Local Installation

### 1. Clone the repository

``` bash
git clone https://github.com/yassin833/EventPulse.git
cd EventPulse
```

### 2. Install dependencies

``` bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root using `.env.example` as a
template:

``` env
PORT=3000
MONGO_URI=your_mongodb_connection_string
MONGO_URI_TEST=your_test_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=your_jwt_expiration
NODE_ENV=development
```

Do not commit your real `.env` file or secrets to version control.

### 4. Seed the database

The seed script clears the existing database data and creates sample
users, categories, events, registrations, and announcements.

``` bash
npm run seed
```

The seed data includes:

-   `admin@eventpulse.com` --- admin
-   `alice@eventpulse.com` --- attendee
-   `bob@eventpulse.com` --- attendee

The seeded password for these accounts is:

``` text
password123
```

### 5. Start the development server

``` bash
npm run dev
```

The API will run on the port specified by `PORT`.

## API Endpoint Summary

  -------------------------------------------------------------------------------
  Method                  Endpoint                        Description
  ----------------------- ------------------------------- -----------------------
  `POST`                  `/api/auth/register`            Register a new user

  `POST`                  `/api/auth/login`               Authenticate a user and
                                                          receive a JWT

  `POST`                  `/api/events`                   Create an event (admin
                                                          only)

  `GET`                   `/api/events`                   Retrieve events with
                                                          filtering, sorting,
                                                          searching, pagination,
                                                          and field selection

  `GET`                   `/api/events/:id`               Retrieve a single event

  `PATCH`                 `/api/events/:id`               Update an event (admin
                                                          only)

  `DELETE`                `/api/events/:id`               Delete an event (admin
                                                          only)

  `POST`                  `/api/registrations`            Register the
                                                          authenticated attendee
                                                          for an event

  `GET`                   `/api/registrations/my`         Retrieve the
                                                          authenticated user's
                                                          confirmed registrations

  `DELETE`                `/api/registrations/:id`        Cancel the
                                                          authenticated user's
                                                          registration

  `POST`                  `/api/announcements`            Create and broadcast an
                                                          announcement (admin
                                                          only)

  `GET`                   `/api/announcements/:eventId`   Retrieve announcements
                                                          for an event
  -------------------------------------------------------------------------------

### Authentication

Protected HTTP endpoints use a JWT in the standard Bearer format:

``` http
Authorization: Bearer <JWT>
```

## Real-Time Socket.IO

EventPulse uses Socket.IO for live event announcements.

Authenticated Socket.IO clients can request to join an event room. The
server verifies that the user has a confirmed registration for the event
before joining the corresponding room.

Example room:

``` text
event_<eventId>
```

When an admin creates an announcement through:

``` http
POST /api/announcements
```

the announcement is persisted in MongoDB and broadcast to the
corresponding Socket.IO room.

This gives the API two complementary mechanisms:

-   **REST** for persistent announcement history
-   **Socket.IO** for real-time delivery to connected attendees

## API Documentation

Swagger documentation is available locally at:

``` text
http://localhost:<PORT>/api-docs
```

The OpenAPI JSON specification is available at:

``` text
http://localhost:<PORT>/api-docs.json
```

## Testing

Run the automated test suite with:

``` bash
npm test
```

The project contains:

-   **Unit tests** for `AppError`
-   **Unit tests** for `asyncHandler`
-   **Integration tests** for the events API using Supertest

The integration suite verifies successful event retrieval,
authentication protection, and validation failures.

## Deployment

The API is deployed on Vercel:

**Live API:** https://event-pulse-flame.vercel.app

Health check:

``` text
https://event-pulse-flame.vercel.app/health
```

Swagger documentation:

``` text
https://event-pulse-flame.vercel.app/api-docs
```

## Project Structure

``` text
EventPulse/
├── config/              # Database, Socket.IO, authentication, Swagger, Jest config
├── controllers/         # Business logic for API endpoints
├── middleware/          # Authentication, validation, role checks, error handling
├── models/              # Mongoose models
├── routes/              # Express route definitions
├── scripts/             # Supporting scripts
├── tests/
│   ├── integration/     # Supertest integration tests
│   └── units/           # Jest unit tests
├── utils/               # Shared utilities
├── app.js               # Application/server entry point
├── seed.js              # Database seeding script
├── package.json
└── vercel.json          # Vercel deployment configuration
```
