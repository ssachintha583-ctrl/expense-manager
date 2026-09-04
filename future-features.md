# Future Features

The current Expense Manager provides the core functionality required to create, view, update, delete, and search expense records. The following features are proposed for future versions of the application. These improvements are based on potential user and business needs and demonstrate how the system could be extended.

## 1. User Authentication

### Need
The current application does not distinguish between different users. In a real-world expense management system, each user should have access only to their own financial records.

### Proposed Feature
Introduce user registration, login, logout, and authenticated expense management.

### Technical Changes
Laravel authentication could be used to manage users and protect API endpoints. Expense records would be associated with a user ID, and authenticated API requests would return only the expenses belonging to the current user.

Possible API endpoints could include:

- `POST /api/register`
- `POST /api/login`
- `POST /api/logout`

### Benefit
This would improve security, privacy, and allow the application to support multiple users.

### Status
Proposed for future development.

---

## 2. Expense Categories

### Need
As the number of expense records increases, users may find it difficult to understand where their money is being spent.

### Proposed Feature
Allow expenses to be organised into categories such as Food, Transport, Shopping, Bills, and Entertainment.

### Technical Changes
A category field or separate categories table could be added to the database. The API could also support retrieving expenses by category.

Example:

`GET /api/expenses?category=Food`

### Benefit
Categories would make expense records easier to organise, search, analyse, and report.

### Status
Proposed for future development.

---

## 3. Monthly Reports

### Need
Individual expense records provide useful information, but users may also need an overview of their spending over time.

### Proposed Feature
Generate monthly summaries showing total expenditure, number of expenses, and spending by category.

### Technical Changes
Laravel could calculate aggregated expense information and expose it through a reporting endpoint.

Example:

`GET /api/reports/monthly?month=2026-09`

### Benefit
Monthly reports would help users understand spending behaviour and make better financial decisions.

### Status
Proposed for future development.

---

## 4. Budget Management

### Need
Users may want to control their spending rather than only record expenses after they occur.

### Proposed Feature
Allow users to define monthly budgets and display warnings when spending approaches or exceeds the configured limit.

### Technical Changes
Budget information could be stored in the database and compared with expense totals. Additional API endpoints could allow budgets to be created and updated.

Example:

- `GET /api/budgets`
- `POST /api/budgets`
- `PUT /api/budgets/{id}`

### Benefit
This would transform the application from a simple expense recorder into a more useful financial management tool.

### Status
Proposed for future development.

---

## 5. Advanced Filtering

### Need
The current application already provides basic expense searching. As the amount of stored data increases, users may require more precise ways to locate records.

### Proposed Feature
Extend the existing search functionality with filters for date range, expense type, minimum cost, and maximum cost.

### Technical Changes
The existing expense API could accept optional query parameters.

Example:

`GET /api/expenses?type=Food&min_cost=10&max_cost=100`

### Benefit
Advanced filtering would make large collections of expense records easier and faster to manage.

### Status
Basic search is implemented. Advanced filtering is proposed for future development.

---

## 6. Data Visualisation

### Need
Numerical records alone may make spending patterns difficult to identify quickly.

### Proposed Feature
Display expense information using charts and graphs, including monthly spending trends and category breakdowns.

### Technical Changes
The React frontend could use reporting data supplied by the Laravel REST API and display the results using a charting library.

Example API endpoint:

`GET /api/reports/summary`

### Benefit
Visual information would allow users to understand spending patterns more quickly.

### Status
Proposed for future development.

---

## 7. Export Functionality

### Need
Users may need copies of their expense information for reporting, record keeping, or use in other applications.

### Proposed Feature
Allow expense records and reports to be exported in formats such as CSV or PDF.

### Technical Changes
Laravel could generate downloadable files using expense data and expose dedicated export endpoints.

Examples:

- `GET /api/expenses/export?format=csv`
- `GET /api/expenses/export?format=pdf`

### Benefit
Export functionality would improve portability and make the application more useful for personal or business reporting.

### Status
Proposed for future development.

---

## 8. Improved Mobile Support

### Need
Expense information is often recorded while users are away from a desktop computer.

### Proposed Feature
Further optimise the interface for phones and tablets and provide a mobile-focused expense entry experience.

### Technical Changes
The responsive React interface could be extended with improved mobile layouts, touch-friendly controls, and additional accessibility testing across different screen sizes.

### Benefit
Users would be able to manage expenses more conveniently from mobile devices.

### Status
The current interface is responsive, but additional mobile optimisation is proposed for future development.

---

## Relationship to the OpenAPI Specification

The current `openapi.yaml` documents the API implemented in this version of the Expense Manager. Future features described above would require additional API paths, request parameters, schemas, and security definitions.

These proposed changes have not been added to the current API specification because they are not implemented in the submitted application. They demonstrate how the existing REST API architecture could be extended in future versions while keeping the current OpenAPI specification consistent with the implemented system.

## Conclusion

The revised OpenAPI specification includes a proposed `/expenses/search` endpoint to demonstrate how a business requirement can be translated into a technical API design. This endpoint is specified as a future API extension and is not implemented as a Laravel server route in the submitted application. The current user interface provides basic search and filtering on the client side.