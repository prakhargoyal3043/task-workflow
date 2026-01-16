# Task-Workflow
A full-stack Task Workflow Management System built using Spring Boot and Angular, designed to manage tasks across different user roles with proper authentication, authorization, and workflow control.
The application supports role-based dashboards for Admin, Manager, and User, enabling structured task creation, assignment, approval, and tracking.

## 🚀 Getting Started

### Prerequisites

Before running the project, ensure you have the following installed:

* **Java 17** or higher
* **Maven 3.6+** (or use the Maven wrapper included in the project)
* **Node.js 18+** and **npm** or **yarn**
* **PostgreSQL 12+** 
* **Angular CLI** (optional, can be installed via npm/yarn)

### Database Setup

1. Install PostgreSQL and create a database:
   ```sql
   CREATE DATABASE taskdb;
   ```

2. Update database credentials in `task-workflow-backend/src/main/resources/application.properties` if needed:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/taskdb
   spring.datasource.username=postgres
   spring.datasource.password=postgres
   ```

### Starting the Backend (Spring Boot)

1. Navigate to the backend directory:
   ```bash
   cd task-workflow-backend
   ```

2. Run the Spring Boot application using Maven wrapper:
   
   **Windows:**
   ```bash
   .\mvnw.cmd spring-boot:run
   ```
   
   **Linux/Mac:**
   ```bash
   ./mvnw spring-boot:run
   ```

   Alternatively, you can use Maven directly:
   ```bash
   mvn spring-boot:run
   ```

3. The backend server will start on `http://localhost:8080`

4. The application will automatically create the required database tables on first run.

### Starting the Frontend (Angular)

1. Navigate to the frontend directory:
   ```bash
   cd task-workflow-frontend
   ```

2. Install dependencies using yarn (recommended):
   ```bash
   yarn install
   ```
   
   Or using npm:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   yarn start
   ```
   
   Or using npm:
   ```bash
   npm start
   ```

4. The frontend application will start on `http://localhost:4200`

5. Open your browser and navigate to `http://localhost:4200` to access the application.

### Default Login Credentials

After the application starts, a default admin user is automatically created. You can use these credentials to login:

* **Email:** `admin@taskworkflow.com`
* **Password:** `Admin@123`

You can also register new users through the application. Admins can create users with different roles (ADMIN, MANAGER, USER) from the admin dashboard.

## ✨ Key Features:
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


## 📊 Dashboards

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


## 🖥 Frontend (Angular)

* Standalone component architecture

* Modular dashboards for each role

* Reactive forms with validation

* Clean UI with tables, badges, and modals

* Proper parent-child component communication

* Auto refresh of dashboards on task updates


## 🛠 Tech Stack

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


## 🧱 Architecture Highlights

* DTO-based API responses (no entity exposure)

* Role-based access control at controller level

* Clean separation of Controller, Service, Repository layers

* Soft delete strategy for users

* Scalable and extensible design


## 🎯 Use Cases

* Internal task management system

* Team workflow tracking

* Role-based approval systems

* Enterprise-style dashboard applications


## 📌 Future Enhancements

* Task comments and history

* Notifications

* Due dates and priorities

* Advanced filters and search

* WebSocket-based real-time updates
