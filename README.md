# Expense Manager

A full-stack Expense Manager web application developed using Laravel, React, TypeScript, and REST API integration.

The application allows users to create, view, update, delete, search, and manage expense records through a responsive user interface. The project demonstrates full-stack application development, API integration, validation, automated testing, and code quality practices.

## Features

- Create new expense records
- View all recorded expenses
- Edit existing expenses
- Delete expenses with confirmation
- Search expenses
- Client-side form validation
- Server-side validation
- REST API integration between React and Laravel
- Responsive user interface
- Automated backend API testing
- Automated frontend component testing
- API documentation using OpenAPI

## Technologies Used

### Backend
- PHP
- Laravel
- RESTful API
- SQLite
- Laravel validation
- Pest / PHPUnit for automated API testing

### Frontend
- React
- TypeScript
- Vite
- HTML and CSS
- Fetch API for communication with the Laravel backend

### Development and Quality Tools
- Git and GitHub for version control
- ESLint for JavaScript and TypeScript code quality
- Laravel Pint for PHP code formatting
- Vitest and React Testing Library for frontend testing
- OpenAPI for API documentation

## Application Architecture

The application follows a client-server architecture. React and TypeScript provide the frontend user interface, while Laravel handles backend processing, validation, database operations, and REST API endpoints.

The frontend communicates with the Laravel backend through HTTP requests to the `/api/expenses` endpoints. Laravel processes these requests and performs CRUD operations on expense records stored in the database.

### Main Application Flow

User Interface → React/TypeScript → REST API → Laravel Controller → Database

The API response is returned to the React frontend and the interface is updated with the latest expense data.

## REST API Endpoints

The Laravel backend provides RESTful endpoints for managing expense records.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/expenses` | Retrieve all expenses |
| GET | `/api/expenses/{id}` | Retrieve a single expense |
| POST | `/api/expenses` | Create a new expense |
| PUT | `/api/expenses/{id}` | Update an existing expense |
| DELETE | `/api/expenses/{id}` | Delete an expense |

### Expense Data

An expense record contains the following main fields:

- `date` - Date of the expense
- `cost` - Cost of the expense
- `description` - Description of the expense
- `expense_type` - Type or category of the expense

### Validation

The backend validates incoming expense data before storing or updating records. Invalid requests return validation errors, which are displayed to the user by the frontend.

Detailed API documentation is also available in the `openapi.yaml` file included in the project.

## Installation and Setup

### Prerequisites

Before running the project, make sure the following software is installed:

- PHP
- Composer
- Node.js and npm
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/ssachintha583-ctrl/expense-manager.git
cd expense-manager
```

### 2. Install PHP Dependencies

```bash
composer install
```

### 3. Install Frontend Dependencies

```bash
npm install
```

### 4. Configure the Environment

Create a local environment file from the provided example:

```bash
cp .env.example .env
```

On Windows PowerShell, you can use:

```powershell
Copy-Item .env.example .env
```

Then generate the Laravel application key:

```bash
php artisan key:generate
```

### 5. Set Up the Database

The application uses SQLite. Ensure the SQLite database is configured in the `.env` file, then run:

```bash
php artisan migrate
```

### 6. Start the Application

Run the Laravel development server:

```bash
php artisan serve
```

In another terminal, start the Vite development server:

```bash
npm run dev
```

Open the local Laravel application URL shown in the terminal to use the Expense Manager.

## Testing

The project includes automated tests for both the Laravel backend and React frontend.

### Backend Tests

Run the Laravel test suite with:

```bash
php artisan test
```

The backend test suite covers:

- Creating an expense
- Listing all expenses
- Retrieving a single expense
- Updating an expense
- Deleting an expense
- Rejecting invalid expense data

Current backend test result:

```text
8 tests passed
24 assertions passed
```

### Frontend Tests

Run the frontend test suite with:

```bash
npm test
```

The frontend tests cover important user interactions including:

- Rendering the Expense Manager
- Displaying expenses returned from the API
- Creating expenses
- Displaying validation errors
- Updating expenses
- Deleting expenses
- Cancelling edit mode
- Cancelling delete confirmation
- Searching and filtering expenses

Current frontend test result:

```text
9 tests passed
1 test file passed
```

## Code Quality

### ESLint

Check the React and TypeScript code with:

```bash
npm run lint:check
```

### Laravel Pint

Check PHP code formatting with:

```bash
php vendor/bin/pint --test
```

Automatically format PHP code with:

```bash
php vendor/bin/pint
```

### Production Build

Create and verify the production frontend build with:

```bash
npm run build
```

The project has been verified successfully with the backend tests, frontend tests, ESLint, Laravel Pint, and Vite production build.

## Project Structure

The main project structure is organised as follows:

```text
expense-manager/
├── app/
│   ├── Http/Controllers/
│   └── Models/
├── database/
│   ├── migrations/
│   └── database.sqlite
├── resources/
│   ├── css/
│   └── js/
│       ├── pages/
│       └── tests/
├── routes/
│   ├── api.php
│   └── web.php
├── tests/
│   ├── Feature/
│   └── Unit/
├── openapi.yaml
├── future-features.md
├── composer.json
├── package.json
└── README.md
```

### Important Files

- `app/Http/Controllers/ExpenseController.php` - Handles expense CRUD operations and server-side validation.
- `resources/js/pages/expenses.tsx` - Main React and TypeScript user interface for managing expenses.
- `routes/api.php` - Defines the REST API routes.
- `tests/Feature/ExpenseApiTest.php` - Contains automated backend API tests.
- `resources/js/tests/expenses.test.tsx` - Contains automated frontend component tests.
- `openapi.yaml` - Contains the OpenAPI specification for the REST API.
- `future-features.md` - Documents possible future improvements to the application.
