# 📝 Task Management API

## Overview
A robust and scalable task management backend API engineered with TypeScript, Node.js, and Express, leveraging Prisma ORM for efficient data management with a SQLite database. This API provides secure endpoints for user authentication, authorization, and comprehensive CRUD operations for managing todos.

## Features
-   **TypeScript**: Enhances code quality, readability, and maintainability with static type checking and modern language features.
-   **Node.js & Express.js**: Powers a fast, unopinionated, and efficient RESTful API development framework.
-   **Prisma ORM**: Provides an elegant, type-safe, and declarative way to interact with the database (SQLite).
-   **JWT Authentication**: Secures API endpoints, ensuring only authenticated and authorized users can access protected resources.
-   **Role-Based Authorization**: Implements fine-grained access control, allowing specific actions (e.g., todo deletion) to be restricted to certain user roles (e.g., 'admin').
-   **Bcrypt.js**: Securely hashes and salts user passwords to protect sensitive information.
-   **Centralized Error Handling**: Implements a consistent and graceful approach to managing and responding to application errors.
-   **Request Logging**: Middleware to log incoming HTTP requests, aiding in monitoring and debugging.

## Getting Started
To get this project up and running locally, follow these steps.

### Installation
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/todo-backend.git # Replace with your actual repository URL
    cd todo-backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up the database:**
    Initialize the Prisma schema and create the SQLite database file:
    ```bash
    npx prisma migrate dev --name init
    ```

4.  **Seed the database (optional):**
    Populate the database with some demo todo items:
    ```bash
    npm run seed
    ```

5.  **Run the application:**
    *   **Development mode (with `ts-node`):**
        ```bash
        npm run dev
        ```
    *   **Production mode (after building):**
        First, build the project:
        ```bash
        npm run build
        ```
        Then, start the server:
        ```bash
        npm start
        ```

### Environment Variables
Create a `.env` file in the root directory and add the following variables:

-   `DATABASE_URL`: Connection string for your database.
    -   Example: `DATABASE_URL="file:./dev.db"` (for SQLite)
-   `JWT_SECRET`: A strong, secret key for signing JWT tokens.
    -   Example: `JWT_SECRET="your_very_secure_jwt_secret_key_here"`
-   `JWT_EXPIRES_IN`: The duration after which JWT tokens expire.
    -   Example: `JWT_EXPIRES_IN="7d"` (for 7 days)

## Usage
Once the server is running, you can interact with the API using tools like `curl`, Postman, or a client-side application. The API will be accessible on `http://localhost:3000`.

### Example Workflow:

1.  **Register a new user:**
    ```bash
    curl -X POST -H "Content-Type: application/json" -d '{"email": "test@example.com", "password": "password123", "role": "user"}' http://localhost:3000/auth/register
    ```
    *(Note: The `role` field is optional and defaults to `"user"`. You can specify `"admin"` to register an administrator.)*

2.  **Log in to get an authentication token:**
    ```bash
    curl -X POST -H "Content-Type: application/json" -d '{"email": "test@example.com", "password": "password123"}' http://localhost:3000/auth/login
    ```
    This command will return a JWT token in the response. Copy this token for use in subsequent authenticated requests by including it in the `Authorization` header as `Bearer <YOUR_JWT_TOKEN>`.

3.  **Create a new todo (using the token):**
    Replace `<YOUR_JWT_TOKEN>` with the actual token obtained from the login step.
    ```bash
    curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer <YOUR_JWT_TOKEN>" -d '{"title": "Complete Dokugen README", "status": "pending", "priority": "high", "description": "Ensure all requirements are met"}' http://localhost:3000/todos
    ```

4.  **Get all todos:**
    ```bash
    curl http://localhost:3000/todos
    ```
    You can also filter todos by `status` and `priority` using query parameters:
    ```bash
    curl "http://localhost:3000/todos?status=pending&priority=high"
    ```

## API Documentation

### Base URL
`http://localhost:3000`

### Endpoints

#### POST /auth/register
Registers a new user account with the provided email, password, and an optional role.
**Request**:
```json
{
  "email": "string",            // Required: User's unique email address.
  "password": "string",         // Required: User's password.
  "role": "user" | "admin"      // Optional: User's role. Defaults to "user".
}
```

**Response**:
```json
{
  "message": "User created successfully",
  "result": {
    "token": "string",          // JWT authentication token for the newly registered user.
    "user": {
      "id": "number",
      "email": "string",
      "role": "user" | "admin"
    }
  }
}
```

**Errors**:
-   400 Bad Request: `Email and Password are required`.
-   409 Conflict: `Email already existed`.
-   500 Internal Server Error: An unexpected error occurred on the server.

#### POST /auth/login
Authenticates a user with their email and password, returning a JWT token upon successful login.
**Request**:
```json
{
  "email": "string",            // Required: User's email address.
  "password": "string"          // Required: User's password.
}
```

**Response**:
```json
{
  "message": "User created successfully",
  "result": {
    "token": "string",          // JWT authentication token.
    "user": {
      "id": "number",
      "email": "string",
      "role": "user" | "admin"
    }
  }
}
```

**Errors**:
-   400 Bad Request: `Email and Password are required`.
-   401 Unauthorized: `Invalid email or password`.
-   500 Internal Server Error: An unexpected error occurred on the server.

#### GET /auth/me
Retrieves the profile information of the currently authenticated user.
**Requires Authentication**
**Request**:
```
No request body.
Authentication token must be provided in the Authorization header: `Authorization: Bearer <JWT_TOKEN>`
```

**Response**:
```json
{
  "id": "number",               // Unique ID of the user.
  "email": "string",            // User's email address.
  "role": "user" | "admin",     // User's assigned role.
  "createdAt": "string"         // ISO 8601 date string when the user account was created.
}
```

**Errors**:
-   401 Unauthorized: `No token provided` / `Invalid or expired token`.
-   404 Not Found: `User no longer exists`.
-   500 Internal Server Error: An unexpected error occurred on the server.

#### GET /todos
Retrieves a list of all todo items. Can be filtered by `status` and `priority` using query parameters.
**Request**:
```
Query Parameters (all optional):
  - status: "pending" | "completed"  // Filters todos by their completion status.
  - priority: "low" | "medium" | "high" // Filters todos by their priority level.
```

**Response**:
```json
[
  {
    "id": "number",               // Unique ID of the todo.
    "title": "string",            // Title of the todo.
    "description": "string | null",// Optional description of the todo.
    "status": "pending" | "completed",// Current status of the todo.
    "priority": "low" | "medium" | "high",// Priority level of the todo.
    "createdAt": "string"         // ISO 8601 date string when the todo was created.
  }
]
```

**Errors**:
-   500 Internal Server Error: An unexpected error occurred on the server.

#### GET /todos/:id
Retrieves a single todo item by its unique ID.
**Request**:
```
Path Parameter:
  - id: number (Required: The unique identifier of the todo to retrieve.)
```

**Response**:
```json
{
  "id": "number",               // Unique ID of the todo.
  "title": "string",            // Title of the todo.
  "description": "string | null",// Optional description of the todo.
  "status": "pending" | "completed",// Current status of the todo.
  "priority": "low" | "medium" | "high",// Priority level of the todo.
  "createdAt": "string"         // ISO 8601 date string when the todo was created.
}
```

**Errors**:
-   404 Not Found: `Todo with {id}, not found`.
-   500 Internal Server Error: An unexpected error occurred on the server.

#### POST /todos
Creates a new todo item.
**Requires Authentication**
**Request**:
```json
{
  "title": "string",                    // Required: Title of the new todo.
  "status": "pending" | "completed",    // Required: Initial status of the todo. Must be "pending" or "completed".
  "priority": "low" | "medium" | "high",// Required: Priority level of the todo. Must be "low", "medium", or "high".
  "description": "string"               // Optional: Detailed description of the todo.
}
```

**Response**:
```json
{
  "message": "Todo created successfully",
  "newTodo": {
    "id": "number",
    "title": "string",
    "description": "string | null",
    "status": "pending" | "completed",
    "priority": "low" | "medium" | "high",
    "createdAt": "string"
  }
}
```

**Errors**:
-   400 Bad Request: `missing field: {field_name(s)}` / `{status} is not in the option, for status` / `{priority} is not in the option, for priority`.
-   401 Unauthorized: `No token provided` / `Invalid or expired token`.
-   500 Internal Server Error: An unexpected error occurred on the server.

#### PATCH /todos/:id
Updates one or more fields of an existing todo item identified by its ID.
**Requires Authentication**
**Request**:
```
Path Parameter:
  - id: number (Required: The unique identifier of the todo to update.)
Payload structure for updates (all fields are optional, provide only those to change):
```json
{
  "title": "string",                    // New title for the todo.
  "description": "string",              // New description for the todo.
  "status": "pending" | "completed",    // New status for the todo.
  "priority": "low" | "medium" | "high" // New priority for the todo.
}
```

**Response**:
```json
{
  "message": "Todo with id {id} updated successfully"
}
```

**Errors**:
-   401 Unauthorized: `No token provided` / `Invalid or expired token`.
-   404 Not Found: `Todo with id {id} not found`.
-   500 Internal Server Error: An unexpected error occurred on the server.

#### DELETE /todos/:id
Deletes a todo item by its ID. This action requires an authenticated user with an `admin` role.
**Requires Authentication & Admin Role**
**Request**:
```
Path Parameter:
  - id: number (Required: The unique identifier of the todo to delete.)
No request body.
Authentication token must be provided in the Authorization header: `Authorization: Bearer <JWT_TOKEN>`
```

**Response**:
```json
{
  "message": "Todo with {id}, deleted successfuly"
}
```

**Errors**:
-   401 Unauthorized: `No token provided` / `Invalid or expired token`.
-   403 Forbidden: `You do not have permission to do this` (requires 'admin' role).
-   404 Not Found: `Todo with id {id} not found`.
-   500 Internal Server Error: An unexpected error occurred on the server.

## Technologies Used

| Technology     | Description                                                          | Link                                             |
| :------------- | :------------------------------------------------------------------- | :----------------------------------------------- |
| **TypeScript** | A strongly typed superset of JavaScript that compiles to plain JavaScript. | [TypeScript](https://www.typescriptlang.org/)    |
| **Node.js**    | A JavaScript runtime built on Chrome's V8 JavaScript engine.         | [Node.js](https://nodejs.org/en/)                |
| **Express.js** | A fast, unopinionated, minimalist web framework for Node.js.         | [Express.js](https://expressjs.com/)             |
| **Prisma ORM** | Next-generation ORM for Node.js and TypeScript.                      | [Prisma](https://www.prisma.io/)                 |
| **SQLite**     | A C-language library that implements a small, fast, self-contained, high-reliability, full-featured, SQL database engine. | [SQLite](https://www.sqlite.org/index.html)      |
| **JWT**        | JSON Web Tokens for securely transmitting information between parties as a JSON object. | [JWT.io](https://jwt.io/)                        |
| **Bcrypt.js**  | A library to help you hash passwords.                                | [Bcrypt.js](https://www.npmjs.com/package/bcryptjs) |
| **ts-node**    | TypeScript execution and REPL for Node.js.                           | [ts-node](https://typestrong.org/ts-node/)       |

## License
This project is licensed under the ISC License. For more details, please refer to the `package.json` file.

## Author
**[Your Name]**
A passionate software developer focused on building robust and scalable backend solutions with a keen eye for clean architecture and developer experience.

-   **LinkedIn**: [https://www.linkedin.com/in/your-linkedin-profile](https://www.linkedin.com/in/your-linkedin-profile)
-   **X (formerly Twitter)**: [https://x.com/your-twitter-handle](https://x.com/your-twitter-handle)

---

### Badges
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)

[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://www.npmjs.com/package/dokugen)