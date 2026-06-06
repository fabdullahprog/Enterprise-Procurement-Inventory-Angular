# SuperShop Management Admin Panel

## Project Overview

SuperShop Management Admin Panel is an Angular-based administrative frontend for a Supply Chain & ERP Management System. It enables administrators and operational teams to manage products, suppliers, categories, users, roles, reports, and other core business data through a centralized dashboard.

The application communicates with the ASP.NET Core Web API backend and provides a secure, role-based interface for managing business operations.

---

## Features

- User Authentication & Authorization
- JWT-Based Session Management
- Dashboard with Business Statistics
- Department Management
- Brand Management
- Item Category Management
- Sub-Category Management
- Product Management
- Unit & Unit Set Management
- Currency Management
- Supplier Management
- Role & Permission Management
- User Management
- Reporting & Analytics
- Route Protection using Guards
- HTTP Request Interception
- Responsive Admin Interface

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Angular 21 | Frontend framework |
| TypeScript | Strongly typed application development |
| RxJS | Reactive programming and API handling |
| Bootstrap 5 | Responsive UI design |
| ngx-pagination | Client-side pagination |
| Angular Router | Navigation and route management |
| Angular HttpClient | Backend API communication |

---


## Installation

### Prerequisites

- Node.js
- Angular CLI

### Install Dependencies

```bash
npm install
```

---

## Configuration

Environment configuration is located in:

```text
src/app/environments/environment.ts
```

### API Configuration

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5186/api'
};
```

Update the API URL according to your backend environment.

---

## Running the Project

### Development Mode

```bash
npm install
ng serve
```

Application URL:

```text
http://localhost:4200
```

### Production Build

```bash
ng build --configuration production
```

---

## Authentication & Authorization

The application uses JWT-based authentication.

### Security Components

- Login & Registration
- JWT Token Storage
- Route Guards
- HTTP Interceptors
- Role-Based Permissions
- Protected Admin Routes

### Authentication Flow

1. User logs in.
2. Backend returns a JWT token.
3. Token is stored locally.
4. Interceptor attaches the token to API requests.
5. Guards protect authenticated routes.

---

## Application Modules

### Authentication
- Login
- Registration

### Dashboard
- Business KPIs
- Statistics

### Catalog Management
- Departments
- Brands
- Categories
- Sub-Categories
- Products
- Units
- Unit Sets
- Currencies

### Purchase Management
- Suppliers

### Reporting
- Category Reports
- Sub-Category Reports
- Combined Reports

### Administration
- Roles
- Permissions
- Users

---

## Project Structure

```text
src/
│
├── app/
│   ├── components/
│   │   └── Feature components and UI pages
│   │
│   ├── environments/
│   │   └── Environment configuration files
│   │
│   ├── guards/
│   │   └── Route protection and authorization logic
│   │
│   ├── interceptors/
│   │   └── HTTP request and response interceptors
│   │
│   ├── models/
│   │   └── Interfaces and data models
│   │
│   ├── services/
│   │   └── API communication and business services
│   │
│   ├── shared/
│   │   └── Shared layouts, components, and utilities
│   │
│   ├── app.config.ts
│   ├── app.css
│   ├── app.html
│   ├── app.routes.ts
│   ├── app.spec.ts
│   └── app.ts
│
├── index.html
├── main.ts
└── styles.css
```

---

## Future Improvements

- Add Global Error Handling
- Add Environment-Based Configuration Files
- Improve Reporting Dashboard
- Add Audit Logging Features
- Enhance UI/UX Consistency

---

## Author
- Abdullah Al Foysal
- Shahriar Bin Iqbal
- Sayde Monirul Islam
- Mohammad Sayem
- Tahmina Khan

---
