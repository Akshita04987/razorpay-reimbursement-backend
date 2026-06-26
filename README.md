# Razorpay Reimbursement Management System

A full-stack role-based access control (RBAC) system for managing employee reimbursements with a two-level approval workflow.

## Tech Stack

### Frontend
- **Framework**: React
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Routing**: React Router

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **ORM**: Sequelize
- **Database**: PostgreSQL (Supabase)
- **Authentication**: JWT + Cookie-based
- **Password Hashing**: bcrypt

## Project Overview

This system enables employees to submit reimbursement requests that go through a two-level approval process. Each role has specific permissions and views tailored to their responsibilities.

### Roles

- **EMP (Employee)** - Submits reimbursement requests
- **RM (Reporting Manager)** - First-level approver
- **APE (Approving Executive)** - Second-level approver
- **CFO (Chief Financial Officer)** - Full system access, role assignment

### Role Features

#### EMP (Employee)
- Register and login to the system
- Submit reimbursement requests with title, description, and amount
- View only their own reimbursement requests
- Track approval status (PENDING, APPROVED, REJECTED)

#### RM (Reporting Manager)
- View pending RM approvals only
- Approve or reject employee reimbursement requests
- Cannot see requests already approved/rejected by RM
- Cannot see APE-level approvals

#### APE (Approving Executive)
- View pending APE approvals only (after RM approval)
- Approve or reject reimbursement requests
- Cannot approve unless RM has approved first
- Final approval authority

#### CFO (Chief Financial Officer)
- View all reimbursements across the system
- Assign roles to users (EMP, RM, APE, CFO)
- Assign managers to employees
- Full system oversight

## Approval Workflow

1. **Employee Submission**
   - Employee submits reimbursement request
   - Status: PENDING
   - RM Approved: No
   - APE Approved: No

2. **RM Review**
   - RM reviews pending requests
   - If approved: RM Approved: Yes, Status: PENDING (waiting for APE)
   - If rejected: Status: REJECTED
   - Action logged in approval_logs

3. **APE Review**
   - APE reviews requests approved by RM
   - If approved: APE Approved: Yes, Status: APPROVED
   - If rejected: Status: REJECTED
   - Action logged in approval_logs

4. **Final Status**
   - APPROVED: Both RM and APE approved
   - REJECTED: Either RM or APE rejected
   - PENDING: Waiting for approval

## Project Structure

```
razorpay-assignment/
├── Backend/
│   ├── config/              # Database configuration
│   ├── migrations/          # Database migration files
│   ├── seeders/             # Database seed files
│   ├── models/              # Sequelize models with associations
│   ├── src/
│   │   ├── app.js          # Main application entry point
│   │   ├── config/         # Environment configuration
│   │   ├── controllers/    # Business logic
│   │   ├── middleware/     # Authentication & authorization
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # Service layer
│   │   └── utils/          # Utility functions
│   ├── .env                # Environment variables
│   ├── .gitignore          # Git ignore rules
│   └── package.json        # Dependencies and scripts
├── Frontend/
│   ├── src/
│   │   ├── api/            # API client configuration
│   │   ├── components/     # React components
│   │   ├── constants/      # Constants (roles, etc.)
│   │   ├── pages/          # Page components
│   │   ├── utils/          # Utility functions
│   │   ├── App.jsx         # Main App component
│   │   └── main.jsx        # Entry point
│   ├── index.html          # HTML template
│   ├── vite.config.js      # Vite configuration
│   ├── tailwind.config.js  # Tailwind configuration
│   ├── .gitignore          # Git ignore rules
│   └── package.json        # Dependencies and scripts
└── README.md               # This file
```

## Database Schema

### Tables

1. **users** - User accounts with roles
   - id (UUID, primary key)
   - name (string)
   - email (string, unique)
   - password (string, hashed)
   - role (ENUM: EMP, RM, APE, CFO)
   - createdAt, updatedAt

2. **employee_managers** - Employee-manager relationships
   - id (UUID, primary key)
   - employee_id (UUID, foreign key → users)
   - manager_id (UUID, foreign key → users)
   - createdAt

3. **reimbursements** - Expense reimbursement requests
   - id (UUID, primary key)
   - employee_id (UUID, foreign key → users)
   - title (string)
   - description (text)
   - amount (decimal)
   - status (ENUM: PENDING, APPROVED, REJECTED)
   - rm_approved (boolean)
   - ape_approved (boolean)
   - createdAt, updatedAt

4. **approval_logs** - Approval/rejection history
   - id (UUID, primary key)
   - reimbursement_id (UUID, foreign key → reimbursements)
   - approved_by (UUID, foreign key → users)
   - role (string)
   - action (ENUM: APPROVED, REJECTED)
   - createdAt

## API Endpoints

### Public Endpoints (No Authentication)

- `POST /rest/onboardings/register` - Register new user
  - Body: `{ name, email, password, role }`
  - Response: `{ success, message, data: { user } }`

- `POST /rest/onboardings/login` - Login user
  - Body: `{ email, password }`
  - Response: `{ success, message, data: { token, user } }`
  - Sets httpOnly cookie with JWT token

- `POST /rest/onboardings/logout` - Logout user
  - Response: `{ success, message }`
  - Clears httpOnly cookie

### Protected Endpoints (Authentication Required)

#### Role Management
- `POST /rest/roles/assign` - Assign role to user (CFO only)
  - Body: `{ userId, role }`
  - Response: `{ success, message, data: { user } }`

#### Employee Management
- `GET /rest/employees` - Get all employees
  - Response: `{ success, message, data: { employees } }`

- `GET /rest/users` - Get all users (CFO only)
  - Response: `{ success, message, data: { users } }`

- `POST /rest/employees/assign` - Assign manager to employee (CFO only)
  - Body: `{ employeeId, managerId }`
  - Response: `{ success, message, data: { relationship } }`

- `DELETE /rest/employees/assign` - Remove manager assignment (CFO only)
  - Body: `{ employeeId, managerId }`
  - Response: `{ success, message }`

#### Reimbursement Management
- `POST /rest/reimbursements` - Create reimbursement request
  - Body: `{ title, description, amount }`
  - Response: `{ success, message, data: { reimbursement } }`

- `GET /rest/reimbursements` - Get visible reimbursements (role-based)
  - EMP: Only own reimbursements
  - RM: Only pending RM approvals
  - APE: Only pending APE approvals
  - CFO: All reimbursements
  - Response: `{ success, message, data: { reimbursements } }`

- `GET /rest/reimbursements/me` - Get own reimbursements
  - Response: `{ success, message, data: { reimbursements } }`

- `GET /rest/reimbursements/:userId` - Get user's reimbursements
  - Response: `{ success, message, data: { reimbursements } }`

- `PATCH /rest/reimbursements/:id` - Approve/reject reimbursement (RM/APE only)
  - Body: `{ action: "APPROVED" | "REJECTED" }`
  - Response: `{ success, message, data: { reimbursement } }`

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- Supabase PostgreSQL database
- npm or yarn

### Backend Setup

1. Navigate to Backend directory:
   ```bash
   cd Backend
   ```

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

Backend will run on http://localhost:7002

### Frontend Setup

1. Navigate to Frontend directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

Frontend will run on http://localhost:5173

## Default CFO Account

After running the database seeder, a default CFO account is created:

- **Email**: cfo@org.com
- **Password**: CFO#ORG@April2026

Use this account to assign roles to other users.

## Authentication Flow

1. **Registration**
   - User submits registration with name, email, password, and role
   - Password is hashed using bcrypt
   - User is created in database
   - User can login

2. **Login**
   - User submits email and password
   - Server verifies credentials
   - If valid, JWT token is generated
   - Token is set in httpOnly cookie
   - User data returned to frontend

3. **Protected Routes**
   - Frontend sends requests with cookie
   - Backend middleware extracts token from cookie
   - Token is verified using JWT secret
   - User information attached to request
   - Authorization middleware checks role permissions
   - Request proceeds to controller

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- httpOnly cookies for token storage (XSS protection)
- CORS configuration for cross-origin requests
- Role-based access control (RBAC)
- Protected routes with authentication middleware
- SSL connection to database
- Passwords excluded from API responses
- Input validation in controllers

## NPM Scripts

### Backend
- `npm run dev` - Start development server with nodemon
- `npm run db:migrate` - Run database migrations
- `npm run db:seed-data` - Seed database with initial data

### Frontend
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Development Notes

- Backend runs on port 7002
- Frontend runs on port 5173
- Vite proxy handles API calls to backend
- Database uses SSL connection
- Models use UUID primary keys
- Timestamps are managed automatically
- Role-based filtering applied at service layer
- Approval workflow enforced at service layer

## Testing the Complete Workflow

1. **Register CFO** (if not using seeded account)
   - Go to http://localhost:5173/register
   - Select role: CFO
   - Register and login

2. **Register EMP**
   - Register new user with role: EMP
   - Login as EMP
   - Submit reimbursement request

3. **Register RM**
   - Register new user with role: RM
   - Login as RM
   - View pending RM approvals
   - Approve the reimbursement

4. **Register APE**
   - Register new user with role: APE
   - Login as APE
   - View pending APE approvals (after RM approval)
   - Approve the reimbursement (status becomes APPROVED)

5. **Verify as CFO**
   - Login as CFO
   - View all reimbursements
   - Assign roles to users if needed

## License

ISC
