# Employee Management Dashboard

A multi-screen React application developed as part of a technical assessment.

The project demonstrates structured routing, protected views, API integration with graceful fallback handling, camera access using browser APIs, and a clean, responsive user interface suitable for internal business tools.

---

## Overview

This application simulates an employee management dashboard with authentication, employee browsing, data visualization, and live photo capture functionality.

The focus of the implementation is:

- Clear component structure
- Maintainable styling
- Logical state management
- Professional UI consistency
- Practical feature implementation

---

## Application Screens

| Screen | Route | Description |
|--------|-------|-------------|
| Login | `/` | Username and password authentication |
| Employee List | `/list` | Searchable employee list with statistics and chart access |
| Employee Details | `/details/:id` | Detailed employee profile with live camera capture |
| Photo Result | `/photo-result` | Displays captured photo with download option |
| Salary Chart | `/charts` | Bar chart of top 10 salaries with ranked comparison table |

---

## Demo Credentials

Use the following credentials to log in:

- **Username:** `testuser`
- **Password:** `Test123`

---

## API Integration

The application makes a POST request to:

- https://backend.jotish.in/backend_dev/gettabledata.php


## Request payload:
```json
{ "username": "test", "password": "123456" }
```

## Key Features

- Route-based authentication guard
- Live search filtering
- Employee statistics overview
- Salary comparison bar chart (Recharts)
- Ranked salary table
- Live camera capture using getUserMedia
- Photo preview and download functionality
- Responsive layout for mobile and desktop
- Graceful loading and empty states


## Tech Stack

- React 18
- React Router v6
- Recharts (data visualization)
- Pure CSS (no UI frameworks)
- Browser MediaDevices API (getUserMedia)

## Getting Started
1. Install dependencies
```bash
npm install
```
2. Start development server
```bash
npm start
```
3. Open in browser
```bash
http://localhost:3000
```

## Project Structure

src/
├── api.js              API integration + mock fallback
├── App.js              Router configuration + auth guard
├── index.css           Global styles and shared design tokens
├── components/
│   └── Navbar.js       Shared navigation component
└── pages/
    ├── LoginPage.js
    ├── ListPage.js
    ├── DetailsPage.js
    ├── PhotoResultPage.js
    └── BarChartPage.js

