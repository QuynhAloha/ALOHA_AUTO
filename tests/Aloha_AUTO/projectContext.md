# Aloha_AUTO — Project Context & Automation Guide

## 1. Project Overview

**Project Name:** Aloha_AUTO

**Purpose:**
This project is an automated testing project for the OrangeHRM demo application.

**Application Under Test (AUT):**
OrangeHRM Demo

**Base URL:**
https://opensource-demo.orangehrmlive.com/web/index.php/

The main goal of this project is to build and maintain automated UI tests for the key OrangeHRM modules and user flows.

---

## 2. Current Automation Scope

The current automation scope includes the following modules/pages:

### Login

Used to authenticate users before accessing the OrangeHRM application.

Main scenarios:

* Valid login
* Invalid username/password
* Required field validation
* Logout
* Session/authentication behavior

### Dashboard

The main landing page after successful login.

Main scenarios:

* Dashboard is displayed after login
* Dashboard widgets/components are displayed correctly
* Navigation from Dashboard to other modules

### Admin

Used to manage system administration data.

Potential automation areas:

* User management
* Add user
* Edit user
* Search user
* Delete user
* User role validation
* Status validation
* Required field validation

### Recruitment

Used to manage the recruitment process.

Current pages/features include:

* Recruitment dashboard
* Candidates
* Vacancies
* Add Vacancy
* View Vacancy
* Edit Vacancy
* Job vacancy information
* Candidate/application management

Potential automation areas:

* Create vacancy
* Search vacancy
* Edit vacancy
* Delete vacancy
* Vacancy validation
* Candidate management
* Recruitment navigation and filtering

---

## 3. Application Structure

The application generally follows this navigation structure:

```text
Login
  |
  +-- Dashboard
  |
  +-- Admin
  |     +-- User Management
  |     +-- Users
  |
  +-- Recruitment
  |     +-- Candidates
  |     +-- Vacancies
  |           +-- View Vacancies
  |           +-- Add Vacancy
  |           +-- Edit Vacancy
  |
  +-- Other OrangeHRM Modules
```

The automation project should focus on the modules currently included in the project scope instead of attempting to automate the entire OrangeHRM application at once.

---

## 4. Automation Goals

The automation should help verify:

1. Core business flows work correctly.
2. UI elements are displayed and behave correctly.
3. Form validation works correctly.
4. CRUD operations work correctly.
5. Navigation between pages works correctly.
6. Search, filter and pagination work correctly where applicable.
7. Regression testing can be executed quickly and repeatedly.
8. Test cases are stable and maintainable.

---

## 5. Automation Principles

When creating or updating automated tests:

### Prefer stable locators

Use locators in this order where possible:

1. `data-*` / test-specific attributes
2. Stable IDs
3. Accessible roles / labels
4. Unique text
5. CSS selectors
6. XPath only when necessary

Avoid relying on:

* Dynamic generated class names
* Position-based XPath
* Fragile DOM structures
* Arbitrary indexes such as `(//button)[3]`

Example:

```text
Prefer:
getByRole()
getByLabel()
getByText()
getByTestId()

Avoid:
xpath based on long parent/child hierarchy
```

---

## 6. Test Design

Each test should ideally follow:

```text
Arrange
  ↓
Act
  ↓
Assert
```

Example:

```text
Arrange:
Login as Admin

Act:
Navigate to Recruitment
Create a new vacancy

Assert:
The new vacancy is displayed in the vacancy list
```

Tests should validate **business behavior**, not only whether an element exists.

Bad assertion:

```text
Verify button is visible
```

Better assertion:

```text
Verify clicking Save creates the vacancy
and the created vacancy appears in the vacancy list
```

---

## 7. Test Data

Test data should be:

* Clearly named
* Reusable where appropriate
* Easy to identify
* Independent between tests where possible
* Avoid hardcoding unnecessary data directly inside test cases

Example:

```text
Vacancy Name:
AUTO_QA_Vacancy_<timestamp>

Job Title:
QA Engineer

Hiring Manager:
Existing employee available in OrangeHRM

Number of Positions:
2
```

When unique data is required, prefer generating unique values rather than reusing the same record.

---

## 8. Authentication

Most tests require a logged-in OrangeHRM Admin user.

The automation should avoid repeating unnecessary login steps if the framework supports reusable authentication/session state.

Conceptually:

```text
Login
  ↓
Authenticated session
  ↓
Execute module test
```

However, Login tests themselves should still explicitly test the authentication flow.

---

## 9. Page Object / Framework Guideline

Use a maintainable structure such as:

```text
Aloha_AUTO/
│
├── tests/
│   ├── login/
│   ├── dashboard/
│   ├── admin/
│   └── recruitment/
│
├── pages/
│   ├── LoginPage
│   ├── DashboardPage
│   ├── AdminPage
│   ├── RecruitmentPage
│   └── VacancyPage
│
├── fixtures/
├── test-data/
├── utils/
├── config/
│
└── PROJECT_CONTEXT.md
```

Page objects should contain:

* Locators
* Page-specific actions
* Reusable page methods

Test files should contain:

* Test scenarios
* Test steps
* Assertions

Avoid putting large amounts of business logic directly inside test cases.

---

## 10. Expected Claude Support

When supporting this project, Claude should understand that the main objective is **QA automation for OrangeHRM Demo**, not application development.

Claude should:

* Help create automated test cases
* Convert manual test scenarios into automation
* Suggest appropriate test coverage
* Create/update Page Objects
* Suggest stable locators
* Help debug failed automation tests
* Improve test reliability
* Refactor duplicated automation code
* Suggest reusable fixtures/utilities
* Explain automation concepts when needed
* Keep automation code readable and maintainable
* Follow the existing project structure and framework instead of introducing unnecessary architectural changes

Before creating new automation code, Claude should inspect the existing project structure and reuse existing:

* Page Objects
* Fixtures
* Utilities
* Test data
* Helper methods
* Authentication/session handling

Do not create duplicate implementations when an existing reusable component is available.

---

## 11. QA Perspective

The automation should be designed from a QA perspective.

For each feature, consider:

### Positive scenarios

* Valid input
* Successful operation
* Expected navigation
* Successful CRUD operation

### Negative scenarios

* Invalid input
* Missing required fields
* Duplicate data
* Invalid format
* Unauthorized operation

### Boundary scenarios

* Minimum/maximum allowed values
* Empty values
* Long text
* Special characters

### UI/Behavior scenarios

* Button state
* Error messages
* Confirmation messages
* Search/filter behavior
* Pagination
* Modal behavior
* Navigation

---

## 12. Important Rule for Automation

Do not automatically automate every possible scenario.

Prioritize:

1. Critical business flows
2. High-risk functionality
3. Frequently used functionality
4. Regression-prone functionality
5. Stable and repeatable scenarios

The goal is to build a **reliable automation suite**, not simply maximize the number of automated test cases.

---

## 13. Current Project Context

This project is currently focused on learning and building practical UI automation against the OrangeHRM Demo application.

Current modules in scope:

```text
✓ Login
✓ Dashboard
✓ Admin
✓ Recruitment

→ Additional modules may be added later.
```

When new modules are added, update this document so that it remains the main source of project context.

---

## 14. How Claude Should Respond

When helping with this project:

* Keep explanations practical and QA-focused.
* Assume the user is a QA Engineer working on automation.
* Explain unfamiliar automation concepts simply when necessary.
* Prefer examples based on OrangeHRM.
* Do not over-engineer simple test scenarios.
* Reuse existing project patterns.
* If existing code is provided, analyze it before proposing a new implementation.
* When fixing an automation issue, explain the root cause briefly and provide the recommended fix.
* When suggesting a test case, clearly identify:

  * Preconditions
  * Test steps
  * Expected result
  * Automation approach

The priority is:

**Readable → Stable → Reusable → Maintainable automation.**
