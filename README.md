# Task-Workflow
A full-stack Task Workflow Management System built using Spring Boot and Angular, designed to manage tasks across different user roles with proper authentication, authorization, and workflow control.
The application supports role-based dashboards for Admin, Manager, and User, enabling structured task creation, assignment, approval, and tracking.

### ✨ Key Features:
#### 🔐 Authentication & Security

  * JWT-based authentication

  * Role-based authorization (ADMIN, MANAGER, USER)

  * Secure REST APIs with Spring Security

  * HTTP Interceptor in Angular for token handling
    

#### 👥 User Management (Admin)

* Create users with specific roles

* Promote or demote users (Manager ↔ User)

* Soft delete users

* Paginated user listing

* Admin dashboard with summary cards
  

#### 📋 Task Management

* Admin & Manager can create tasks

* Tasks are assigned to users

* Status lifecycle:

  * TODO

  * IN_PROGRESS

  * COMPLETED

  * REJECTED

* Single endpoint to update task status

* Manager approval workflow


### 📊 Dashboards

#### Admin Dashboard

* Total users

* Total tasks

* Pending approvals


#### Manager Dashboard

* Pending task approvals

* Task creation

* Status updates


#### User Dashboard

* View assigned tasks

* Update task progress

* Track task status


### 🖥 Frontend (Angular)

* Standalone component architecture

* Modular dashboards for each role

* Reactive forms with validation

* Clean UI with tables, badges, and modals

* Proper parent-child component communication

* Auto refresh of dashboards on task updates


### 🛠 Tech Stack

#### Backend

* Java

* Spring Boot

* Spring Security

* JWT

* Spring Data JPA

* Hibernate

* MySQL


#### Frontend

* Angular

* TypeScript

* Standalone Components

* Reactive Forms

* Angular Router

* SCSS


### 🧱 Architecture Highlights

* DTO-based API responses (no entity exposure)

* Role-based access control at controller level

* Clean separation of Controller, Service, Repository layers

* Soft delete strategy for users

* Scalable and extensible design


### 🎯 Use Cases

* Internal task management system

* Team workflow tracking

* Role-based approval systems

* Enterprise-style dashboard applications


### 📌 Future Enhancements

* Task comments and history

* Notifications

* Due dates and priorities

* Advanced filters and search

* WebSocket-based real-time updates
