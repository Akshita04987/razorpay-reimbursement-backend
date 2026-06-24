# Razorpay Reimbursement Management Backend

A role-based access control (RBAC) backend system for managing employee reimbursements with a two-level approval workflow.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **ORM**: Sequelize
- **Database**: PostgreSQL (Supabase)
- **Authentication**: JWT + Cookie-based
- **Password Hashing**: bcrypt

## Project Structure

```
razorpay-assignment/
├── config/              # Database configuration
├── migrations/          # Database migration files
├── seeders/             # Database seed files
├── models/              # Sequelize models with associations
├── src/
│   ├── app.js          # Main application entry point
│   ├── controllers/    # Business logic
│   ├── middleware/     # Authentication & authorization
│   └── routes/         # API endpoints
├── .env                # Environment variables
├── .gitignore          # Git ignore rules
└── package.json        # Dependencies and scripts
```

## Database Schema

### Tables

1. **users** - User accounts with roles (EMP, RM, APE, CFO)
2. **employee_managers** - Employee-manager relationships
3. **reimbursements** - Expense reimbursement requests
4. **approval_logs** - Approval/rejection history

### Roles

- **EMP** - Employee (submits reimbursements)
- **RM** - Reporting Manager (first-level approver)
- **APE** - Approving Executive (second-level approver)
- **CFO** - Chief Financial Officer (role assignment, full access)

## API Endpoints

### Public Endpoints (No Authentication)

- `POST /rest/onboardings/register` - Register new user
- `POST /rest/onboardings/login` - Login user
- `POST /rest/onboardings/logout` - Logout user

### Protected Endpoints (Authentication Required)

#### Role Management
- `POST /rest/roles/assign` - Assign role to user (CFO only)

#### Employee Management
- `GET /rest/employees` - Get all employees
- `POST /rest/employees/assign` - Assign manager to employee
- `DELETE /rest/employees/assign` - Remove manager assignment

#### Reimbursement Management
- `POST /rest/reimbursements` - Create reimbursement request
- `PATCH /rest/reimbursements/:id` - Approve/reject reimbursement (RM/APE only)
- `GET /rest/reimbursements` - Get all reimbursements
- `GET /rest/reimbursements/:userId` - Get user's reimbursements

## Setup Instructions

### Prerequisites

- Node.js installed
- Supabase PostgreSQL database

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env`:
   ```
   PORT=7002
   DB_HOST=your-supabase-host.supabase.co
   DB_DATABASE=postgres
   DB_USER=postgres
   DB_PASSWORD=your-database-password
   DB_PORT=5432
   JWT_SECRET=your-jwt-secret
   NODE_ENV=development
   ```

4. Run database migrations:
   ```bash
   npm run db:migrate
   ```

5. Seed the database:
   ```bash
   npm run db:seed-data
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

## Default CFO Account

- **Email**: cfo@org.com
- **Password**: CFO#ORG@April2026

## Approval Workflow

1. Employee submits reimbursement request (status: PENDING)
2. RM reviews and approves/rejects (sets rm_approved flag)
3. APE reviews and approves/rejects (sets ape_approved flag)
4. If both approve, status becomes APPROVED
5. If either rejects, status becomes REJECTED
6. All actions are logged in approval_logs table

## NPM Scripts

- `npm run dev` - Start development server with nodemon
- `npm run db:migrate` - Run database migrations
- `npm run db:seed-data` - Seed database with initial data

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Cookie-based session management
- Role-based access control (RBAC)
- Protected routes with middleware
- SSL connection to database

## Development Notes

- Server runs on port 7002
- Database uses SSL connection
- Models use UUID primary keys
- Timestamps are managed automatically
- Passwords are excluded from API responses
