# AI-Powered Todo App - Complete Documentation

A full-stack productivity application that leverages AI to help users manage their tasks efficiently with intelligent suggestions, multilingual support, secure email verification, and seamless task management.

---

## Table of Contents

1. [Technology Stack](#technology-stack)
2. [System Architecture](#system-architecture)
3. [Security Architecture](#security-architecture)
4. [User Flows](#user-flows)
5. [Database Schema](#database-schema)
6. [API Reference](#api-reference)
7. [State Management](#state-management)
8. [Key Features](#key-features)
9. [Performance Optimizations](#performance-optimizations)
10. [Deployment](#deployment)

---

## Technology Stack

### Frontend
- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS
- **State Management:** Redux Toolkit
- **Routing:** React Router v6
- **Internationalization:** i18next (English/Hindi)
- **HTTP Client:** Axios with interceptors

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** Supabase (PostgreSQL)
- **AI Engine:** Groq API (LLaMA 3.1 models)
- **Authentication:** Supabase Auth with JWT
- **Email Service:** Supabase SMTP

### Infrastructure
- **Frontend Hosting:** Vercel
- **Backend Hosting:** Render
- **Database:** Supabase Cloud
- **CI/CD:** GitHub Actions

---

## System Architecture

```
                         USER (Web Browser)
                                 |
                                 | HTTPS Request
                                 v
        +------------------------------------------------+
        |            FRONTEND LAYER                      |
        |            React 18 + Vite                     |
        |                                                |
        |  Components:                                   |
        |  - React Router (Navigation)                   |
        |  - Tailwind CSS (Styling)                      |
        |  - Redux Toolkit (State Management)            |
        |  - i18next (Internationalization)              |
        |                                                |
        |  Features:                                     |
        |  - Redux Slices (auth, tasks, ai, ui)          |
        |  - Multi-language support (EN/HI)              |
        |  - Theme switching (Light/Dark)                |
        |  - Email confirmation handling                 |
        +------------------------+-----------------------+
                                 |
                                 | HTTP/HTTPS + JWT Token
                                 | Authorization: Bearer <token>
                                 v
        +------------------------------------------------+
        |            BACKEND LAYER                       |
        |            Node.js + Express.js                |
        |                                                |
        |  Middleware Stack:                             |
        |  - CORS Handler                                |
        |  - JWT Verification (Supabase)                 |
        |  - Email Verification Check                    |
        |  - Request Logger                              |
        |  - Rate Limiter                                |
        |  - Error Handler                               |
        |                                                |
        |  API Routes:                                   |
        |  - /api/auth (Registration, Login, Confirm)    |
        |  - /api/tasks (CRUD operations)                |
        |  - /api/ai (AI Suggestions)                    |
        +------------+-------------------+---------------+
                     |                   |
                     v                   v
        +-----------------------+  +----------------------+
        |   DATABASE LAYER      |  |   AI SERVICES        |
        |   Supabase            |  |   Groq API           |
        |   (PostgreSQL)        |  |   (LLaMA Models)     |
        |                       |  |                      |
        |  Tables:              |  |  Functions:          |
        |  - Users (Auth)       |  |  - Task Suggestions  |
        |  - Tasks              |  |  - Smart Planning    |
        |  - Profiles           |  |  - Multilingual      |
        |                       |  |                      |
        |  Features:            |  |  Languages:          |
        |  - Real-time updates  |  |  - English           |
        |  - Row Level Security |  |  - Hindi             |
        |  - Email verification |  |                      |
        |  - Auto-scaling       |  |                      |
        +-----------+-----------+  +----------------------+
                    |
                    v
        +-----------------------+
        |   EMAIL SERVICE       |
        |   Supabase SMTP       |
        |                       |
        |  Functions:           |
        |  - Confirmation emails|
        |  - Password reset     |
        |  - Notifications      |
        +-----------------------+
```

---

## Security Architecture

### Complete User Registration Flow with Email Verification

```
Step 1: User Registration
        ↓
Step 2: Frontend Validation
        - Email format check
        - Password strength validation (min 8 chars)
        - Terms acceptance
        ↓
Step 3: POST /api/auth/register
        ↓
Step 4: Backend Validation
        - Email uniqueness check
        - Input sanitization
        ↓
Step 5: Supabase Auth Creates User
        - Generate UUID
        - Hash password (bcrypt, 10 rounds)
        - User status: "UNCONFIRMED"
        - Generate confirmation token (24h expiry)
        ↓
Step 6: Send Confirmation Email
        Subject: "Confirm your email - AI Todo App"
        Link: https://app.domain.com/auth/confirm?token=abc123xyz
        ↓
Step 7: Create User Profile
        - Store user metadata
        - Set email_confirmed_at: null
        ↓
Step 8: Return Registration Response (201)
        - requiresEmailConfirmation: true
        ↓
Step 9: Redirect to Email Confirmation Pending Page
        ↓
Step 10: User Clicks Email Link
        ↓
Step 11: Email Confirmation Process
        - Validate token
        - Check expiration
        - Update user record
        - Generate session tokens (JWT)
        ↓
Step 12: Redirect to Email Confirmed Page
        ↓
Step 13: Auto-login or Manual Login
```

### User Login Flow with Email Verification Check

```
Step 1: User Enters Credentials
        ↓
Step 2: Frontend Validation
        ↓
Step 3: POST /api/auth/login
        ↓
Step 4: Backend Validates Credentials
        ↓
Step 5: Check Email Confirmation Status
        |
        ├─→ Email NOT Confirmed → Return 403
        |                          Show "Please confirm email" modal
        |                          Offer resend option
        |
        └─→ Email Confirmed → Generate JWT tokens
                              ↓
                              Return user data + tokens
                              ↓
                              Store in Redux + localStorage
                              ↓
                              Redirect to /tasks
```

### Email Confirmation Resend Flow

```
Step 1: User Clicks "Resend Email"
        ↓
Step 2: POST /api/auth/resend-confirmation
        ↓
Step 3: Rate Limit Check
        - Max 3 requests per hour
        |
        ├─→ Limit Exceeded → Return 429
        |
        └─→ Within Limit → Continue
        ↓
Step 4: Validate User Status
        |
        ├─→ Email Not Found → Return 404
        |
        ├─→ Already Confirmed → Return 400
        |
        └─→ Unconfirmed → Continue
        ↓
Step 5: Invalidate Old Token
        ↓
Step 6: Generate New Token (24h expiry)
        ↓
Step 7: Send New Confirmation Email
        ↓
Step 8: Log Email Sent
        ↓
Step 9: Return Success (200)
        ↓
Step 10: Show Success Toast
                - Disable resend button (60s cooldown)
```

### Protected API Request Flow

```
Step 1: User Action (e.g., create task)
        ↓
Step 2: Frontend Adds JWT to Request Header
        Authorization: Bearer <token>
        ↓
Step 3: Request Reaches Backend
        ↓
Step 4: CORS Middleware
        ↓
Step 5: JWT Authentication Middleware
        - Extract token
        - Verify with Supabase
        |
        ├─→ Invalid Token → Return 401
        |                   Frontend tries refresh
        |                   If fails, logout & redirect
        |
        └─→ Valid Token → Decode payload
        ↓
Step 6: Email Verification Middleware
        |
        ├─→ Email Not Verified → Return 403
        |                         Show verification modal
        |
        └─→ Email Verified → Continue
        ↓
Step 7: Attach User to Request
        req.user = { id, email, emailVerified, role }
        ↓
Step 8: Route Handler Executes
        ↓
Step 9: Database Query with RLS
        - Automatic user_id filtering
        ↓
Step 10: Return Response
        ↓
Step 11: Frontend Updates State
```

---

## User Flows

### AI Suggestion Generation Flow

```
Step 1: User Clicks "Get AI Suggestions"
        ↓
Step 2: Check Authentication & Email Verification
        ↓
Step 3: Redux Dispatches Action
        ↓
Step 4: POST /api/ai
        Body: { language: "en", count: 5, context: {...} }
        ↓
Step 5: Backend Authentication & Verification
        ↓
Step 6: Prepare AI Prompt
        - Include language preference
        - Add user context
        - Specify requirements
        ↓
Step 7: Call Groq API
        Model: llama-3.1-70b-versatile
        Temperature: 0.8
        Max tokens: 1000
        ↓
Step 8: AI Processes Request (2-5 seconds)
        ↓
Step 9: Parse AI Response (JSON)
        ↓
Step 10: Enrich Suggestions
        - Add UUID
        - Add user ID
        - Add timestamps
        - Add source flag
        ↓
Step 11: Store in Memory Cache (30 min expiry)
        ↓
Step 12: Return to Frontend (200)
        ↓
Step 13: Redux Updates AI State
        ↓
Step 14: Component Displays Suggestions
        - Show suggestion cards
        - Enable "Add to Tasks" button
        ↓
Step 15: User Adds Suggestion → Creates Task
```

### Task Management Flows

#### CREATE Task

```
Step 1: Click "Add Task"
        ↓
Step 2: TaskForm Modal Opens
        Fields: Title*, Description, Priority*, Due Date, Category
        ↓
Step 3: User Fills Form
        ↓
Step 4: Frontend Validation
        - Title required (max 200 chars)
        - Priority must be low/medium/high
        - Due date must be future
        ↓
Step 5: Submit Form → Redux Action
        ↓
Step 6: POST /api/tasks
        ↓
Step 7: Backend Authentication
        ↓
Step 8: Backend Validation & Sanitization
        ↓
Step 9: Prepare Task Object
        - Generate UUID
        - Add user ID
        - Set timestamps
        ↓
Step 10: Insert into Supabase
        ↓
Step 11: Return Response (201)
        ↓
Step 12: Redux Updates State
        ↓
Step 13: UI Updates
        - Modal closes
        - Task appears at top
        - Success toast
        - No page reload
```

#### READ Tasks

```
Step 1: Navigate to /tasks or Component Mounts
        ↓
Step 2: useEffect Triggers
        ↓
Step 3: GET /api/tasks
        Query params: ?status=active&sort=createdAt&order=desc
        ↓
Step 4: Backend Authentication
        ↓
Step 5: Build Database Query
        - Filter by user_id (RLS automatic)
        - Apply status filter
        - Apply sorting
        ↓
Step 6: Execute Query
        ↓
Step 7: Return Tasks (200)
        ↓
Step 8: Redux Stores Tasks
        ↓
Step 9: TasksPage Renders
        - Calculate statistics
        - Filter & sort display
        - Render task list
```

#### UPDATE Task

```
Step 1: Click "Edit" on Task
        ↓
Step 2: TaskForm Opens with Current Data
        ↓
Step 3: User Modifies Fields
        ↓
Step 4: Submit Changes
        ↓
Step 5: PUT /api/tasks/:id
        ↓
Step 6: Backend Verification
        - Authenticate
        - Check ownership
        ↓
Step 7: Update Database
        - Update fields
        - Set updated_at timestamp
        ↓
Step 8: Return Updated Task (200)
        ↓
Step 9: Redux Updates Specific Task
        ↓
Step 10: UI Reflects Changes
        - Modal closes
        - Task updates in place
        - Success toast
```

#### DELETE Task

```
Step 1: Click "Delete"
        ↓
Step 2: Confirmation Dialog Appears
        ↓
Step 3: User Confirms
        ↓
Step 4: DELETE /api/tasks/:id
        ↓
Step 5: Backend Verifies Ownership
        ↓
Step 6: Delete from Database
        ↓
Step 7: Return Success (200)
        ↓
Step 8: Redux Removes Task
        ↓
Step 9: UI Updates
        - Fade animation
        - Task removed
        - Counter decrements
        - Success toast
```

#### TOGGLE Task Completion

```
Step 1: Click Checkbox
        ↓
Step 2: Optimistic UI Update
        - Checkbox animates
        - Strike-through style
        - Task fades slightly
        ↓
Step 3: PUT /api/tasks/:id
        Body: { completed: true }
        ↓
Step 4: Backend Updates
        ↓
Step 5: Return Updated Task
        ↓
Step 6: Redux Confirms State
        ↓
Step 7: UI Shows Completion
        - Move to "Completed" section
        - Update statistics
        - Optional celebration animation
```

### Dashboard/Tasks Page Flow

```
Step 1: Navigate to /tasks
        ↓
Step 2: ProtectedRoute Checks Auth
        |
        ├─→ Not Authenticated → Redirect to /login
        |
        ├─→ Not Email Verified → Show verification banner
        |
        └─→ Authenticated & Verified → Load TasksPage
        ↓
Step 3: TasksPage Mounts
        ↓
Step 4: Parallel Data Fetching
        - fetchTasks()
        - fetchAISuggestions()
        - fetchUserStats()
        ↓
Step 5: Multiple API Calls Execute
        ↓
Step 6: Calculate Real-time Statistics
        - Total tasks
        - Completed/Pending counts
        - Completion rate
        - Priority breakdown
        - Due date analysis
        - Category stats
        ↓
Step 7: Render Complete UI
        - Header with user info
        - Statistics cards
        - Actions bar
        - Tasks list (left column)
        - AI suggestions (right column)
        - Filter tabs
        ↓
Step 8: User Interactions Available
        - Add/Edit/Delete tasks
        - Toggle completion
        - Search & filter
        - Sort tasks
        - Generate AI suggestions
        - Switch language
        - Toggle theme
```

### Internationalization (i18n) Flow

```
Step 1: App Initialization
        ↓
Step 2: i18next Configuration
        - Load translation resources
        - Set default language (from localStorage or 'en')
        - Configure fallback
        ↓
Step 3: Load Language from Storage
        ↓
Step 4: User Clicks Language Switcher
        Options: English / हिंदी
        ↓
Step 5: Change Language Function
        - i18n.changeLanguage(lng)
        - localStorage.setItem('language', lng)
        - Redux: setLanguage(lng)
        ↓
Step 6: i18next Updates
        - All useTranslation() hooks re-render
        - All t() calls return new translations
        ↓
Step 7: Components Re-render with New Language
        - Navigation labels
        - Button text
        - Form labels
        - Error messages
        - Toast notifications
        ↓
Step 8: AI Suggestions Language Update
        - Fetch new suggestions in selected language
        ↓
Step 9: All Text Updates Across App
```

---

## Database Schema

### Users Table (Supabase Auth)
- **id:** UUID (Primary Key)
- **email:** VARCHAR(255) UNIQUE NOT NULL
- **encrypted_password:** VARCHAR(255) NOT NULL
- **email_confirmed_at:** TIMESTAMPTZ
- **confirmation_token:** VARCHAR(255)
- **confirmation_sent_at:** TIMESTAMPTZ
- **last_sign_in_at:** TIMESTAMPTZ
- **created_at:** TIMESTAMPTZ
- **updated_at:** TIMESTAMPTZ
- **raw_app_meta_data:** JSONB
- **raw_user_meta_data:** JSONB
- **role:** VARCHAR(50) DEFAULT 'authenticated'

**Indexes:**
- idx_users_email
- idx_users_confirmation_token
- idx_users_email_confirmed

### Profiles Table
- **id:** UUID (FK → auth.users.id)
- **full_name:** VARCHAR(255)
- **avatar_url:** TEXT
- **bio:** TEXT
- **preferences:** JSONB (theme, language, notifications)
- **created_at:** TIMESTAMPTZ
- **updated_at:** TIMESTAMPTZ

**Row Level Security:**
- Users can view own profile
- Users can update own profile

### Tasks Table
- **id:** UUID (Primary Key)
- **user_id:** UUID (FK → auth.users.id)
- **title:** VARCHAR(200) NOT NULL
- **description:** TEXT
- **priority:** VARCHAR(20) CHECK (low/medium/high)
- **category:** VARCHAR(50)
- **completed:** BOOLEAN DEFAULT FALSE
- **due_date:** DATE
- **source:** VARCHAR(50) (user_created/ai_generated)
- **created_at:** TIMESTAMPTZ
- **updated_at:** TIMESTAMPTZ
- **completed_at:** TIMESTAMPTZ

**Indexes:**
- idx_tasks_user_id
- idx_tasks_created_at
- idx_tasks_completed
- idx_tasks_due_date
- idx_tasks_priority
- idx_tasks_category
- idx_tasks_user_completed_created (composite)

**Row Level Security:**
- Users can view own tasks
- Users can create own tasks
- Users can update own tasks
- Users can delete own tasks

### Email Logs Table
- **id:** UUID (Primary Key)
- **email:** VARCHAR(255) NOT NULL
- **type:** VARCHAR(50) (confirmation/confirmation_resend/password_reset)
- **sent_at:** TIMESTAMPTZ
- **ip_address:** INET
- **user_agent:** TEXT

**Indexes:**
- idx_email_logs_email_sent

**Auto-cleanup:** Deletes logs older than 30 days

### Database Triggers

**update_updated_at_column:**
- Auto-updates updated_at timestamp on tasks and profiles

**set_completed_at:**
- Auto-sets completed_at when task.completed changes to true
- Clears completed_at when task.completed changes to false

---

## API Reference

### Authentication Endpoints

#### POST /api/auth/register
**Purpose:** Create new user account

**Request Body:**
- email: string (required)
- password: string (required, min 8 chars)
- name: string (optional)

**Success Response (201):**
- success: true
- message: "Registration successful! Please check your email."
- user: { id, email, name, emailConfirmed: false }
- requiresEmailConfirmation: true

**Error Responses:**
- 400: Email already exists / Invalid email / Weak password
- 500: Server error

---

#### POST /api/auth/login
**Purpose:** Authenticate user

**Request Body:**
- email: string (required)
- password: string (required)

**Success Response (200):**
- success: true
- user: { id, email, name, emailVerified: true }
- token: JWT access token
- refreshToken: JWT refresh token

**Error Responses:**
- 401: Invalid credentials
- 403: Email not confirmed
- 500: Server error

---

#### GET /api/auth/confirm
**Purpose:** Confirm email address

**Query Parameters:**
- token: string (confirmation token)

**Success Response:**
- 302 Redirect to /email-confirmed?autoLogin=true

**Error Responses:**
- 400: Invalid/expired token or already confirmed
- 404: User not found

---

#### POST /api/auth/resend-confirmation
**Purpose:** Resend confirmation email

**Request Body:**
- email: string (required)

**Success Response (200):**
- success: true
- message: "Confirmation email sent!"
- emailSentTo: string
- expiresIn: "24 hours"

**Error Responses:**
- 400: Email already confirmed
- 404: Email not found
- 429: Rate limit exceeded (max 3/hour)
- 500: Server error

---

#### GET /api/auth/profile
**Purpose:** Get current user profile

**Headers:**
- Authorization: Bearer <token>

**Success Response (200):**
- success: true
- user: { id, email, name, avatar, preferences }

**Error Responses:**
- 401: Invalid token
- 403: Email not verified

---

#### POST /api/auth/refresh
**Purpose:** Refresh access token

**Request Body:**
- refreshToken: string

**Success Response (200):**
- success: true
- token: new JWT access token
- refreshToken: new JWT refresh token

**Error Responses:**
- 401: Invalid/expired refresh token

---

### Task Endpoints

#### GET /api/tasks
**Purpose:** Retrieve all user tasks

**Headers:**
- Authorization: Bearer <token>

**Query Parameters:**
- status: string (optional: all/active/completed)
- sort: string (optional: createdAt/priority/dueDate)
- order: string (optional: asc/desc)

**Success Response (200):**
- success: true
- tasks: Array of task objects
- meta: { total, active, completed }

**Error Responses:**
- 401: Unauthorized
- 403: Email not verified

---

#### POST /api/tasks
**Purpose:** Create new task

**Headers:**
- Authorization: Bearer <token>

**Request Body:**
- title: string (required, max 200)
- description: string (optional, max 2000)
- priority: string (required: low/medium/high)
- dueDate: date (optional)
- category: string (optional)

**Success Response (201):**
- success: true
- task: Complete task object

**Error Responses:**
- 400: Missing required fields
- 401: Unauthorized
- 403: Email not verified

---

#### PUT /api/tasks/:id
**Purpose:** Update existing task

**Headers:**
- Authorization: Bearer <token>

**Request Body:**
- Any task fields to update

**Success Response (200):**
- success: true
- task: Updated task object

**Error Responses:**
- 400: Invalid data
- 401: Unauthorized
- 403: Not task owner or email not verified
- 404: Task not found

---

#### DELETE /api/tasks/:id
**Purpose:** Delete task

**Headers:**
- Authorization: Bearer <token>

**Success Response (200):**
- success: true
- message: "Task deleted successfully"
- deletedId: string

**Error Responses:**
- 401: Unauthorized
- 403: Not task owner or email not verified
- 404: Task not found

---

### AI Endpoints

#### GET /api/ai
**Purpose:** Retrieve user's AI suggestions

**Headers:**
- Authorization: Bearer <token>

**Success Response (200):**
- success: true
- suggestions: Array of suggestion objects
- meta: { generatedAt, expiresAt }

**Error Responses:**
- 401: Unauthorized
- 403: Email not verified

---

#### POST /api/ai
**Purpose:** Generate new AI suggestions

**Headers:**
- Authorization: Bearer <token>

**Request Body:**
- language: string (required: en/hi)
- count: number (optional, default: 5)

**Success Response (200):**
- success: true
- suggestions: Array of new suggestions
- meta: { generatedAt, model, language }

**Error Responses:**
- 400: Invalid language or count
- 401: Unauthorized
- 403: Email not verified
- 429: Rate limit exceeded
- 500: AI service error

---

#### DELETE /api/ai/:id
**Purpose:** Delete AI suggestion

**Headers:**
- Authorization: Bearer <token>

**Success Response (200):**
- success: true
- message: "Suggestion deleted"

**Error Responses:**
- 401: Unauthorized
- 403: Email not verified
- 404: Suggestion not found

---

## State Management

### Redux Store Structure

**authSlice:**
- user: object | null
- token: string | null
- refreshToken: string | null
- isAuthenticated: boolean
- emailVerified: boolean
- loading: boolean
- error: string | null

**tasksSlice:**
- tasks: array
- loading: boolean
- error: string | null
- filter: 'all' | 'active' | 'completed'
- sortBy: 'createdAt' | 'priority' | 'dueDate'
- sortOrder: 'asc' | 'desc'
- searchQuery: string

**aiSlice:**
- suggestions: array
- loading: boolean
- error: string | null
- language: 'en' | 'hi'
- lastGenerated: timestamp | null

**uiSlice:**
- theme: 'light' | 'dark'
- language: 'en' | 'hi'
- sidebarOpen: boolean
- notifications: array
- modals: object (taskForm, deleteConfirm, emailVerification)

### Key Selectors

**selectFilteredTasks:**
- Filters tasks by status and search query
- Sorts by selected criteria
- Memoized for performance

**selectTaskStats:**
- Calculates total, completed, pending
- Priority breakdown
- Overdue count
- Real-time statistics

---

## Key Features

### 1. AI-Powered Suggestions
- **Groq API Integration** with LLaMA 3.1 models
- Context-aware task recommendations
- **Multilingual support** (English/Hindi)
- One-click task creation
- Smart caching (30-minute expiry)
- Personalized based on user activity

### 2. Secure Authentication with Email Verification
- **Supabase Auth integration**
- **Email confirmation required** before access
- JWT token-based security
- Refresh token mechanism
- Row Level Security (RLS)
- Protected routes
- **Rate-limited resend** (3 per hour)
- **Token expiry** (24 hours)

### 3. Smart Task Management
- **CRUD operations** with real-time updates
- Priority levels (Low/Medium/High)
- Due date tracking with overdue detection
- Category organization
- Completion tracking with timestamps
- **Search and filter** functionality
- **Multiple sort options**
- Task statistics and analytics

### 4. Multilingual Interface
- Full i18n support with i18next
- **Dynamic language switching** (EN/HI)
- Localized AI suggestions
- Language-specific error messages
- Persistent language preference

### 5. Modern UI/UX
- **Tailwind CSS** styling
- Dark/Light theme toggle
- Responsive design (mobile-first)
- Smooth animations
- Toast notifications
- Loading states
- Optimistic UI updates
- Accessibility features

### 6. Real-time Capabilities
- Instant task updates (no page reload)
- Live data synchronization
- Optimistic updates
- Real-time statistics

---

## Performance Optimizations

### Frontend Optimizations

**Code Splitting:**
- Lazy load routes and components
- Reduce initial bundle size
- Faster first contentful paint

**Component Memoization:**
- React.memo for pure components
- Prevent unnecessary re-renders
- Optimize render performance

**Redux Selectors:**
- Memoized selectors with reselect
- Cache expensive computations
- Reduce selector recalculations

**Image Optimization:**
- Lazy loading
- WebP format with fallback
- Responsive images

**Debounced Search:**
- 300ms debounce on search input
- Reduce API calls
- Improve performance

### Backend Optimizations

**In-Memory Caching:**
- Cache AI suggestions (30 min)
- Reduce Groq API calls
- Faster response times

**Database Query Optimization:**
- Use indexes effectively
- Select only needed fields
- Implement pagination
- Limit result sets

**Connection Pooling:**
- Supabase handles automatically
- Configurable pool size

**Response Compression:**
- Gzip compression middleware
- Reduce payload size

**Rate Limiting:**
- 100 requests per 15 minutes per IP
- Prevent abuse
- Protect resources

### Database Optimizations

**Proper Indexing:**
- Indexes on frequently queried columns
- Composite indexes for complex queries
- Analyze query patterns

**Row Level Security:**
- Automatic filtering at database level
- No need for WHERE user_id clauses
- Enhanced security

**Efficient Queries:**
- Use joins instead of multiple queries
- Fetch related data in single query
- Optimize N+1 problems

---

## Deployment

### Deployment Architecture

```
GitHub Repository (main branch)
        ↓
    Webhooks trigger CI/CD
        ↓
    ┌────────┴────────┐
    ↓                 ↓
Frontend Pipeline   Backend Pipeline
    ↓                 ↓
Build (Vite)      Tests (Jest)
    ↓                 ↓
Deploy Vercel     Deploy Render
    ↓                 ↓
app.yourdomain.com  api.yourdomain.com
        ↓                 ↓
        └────────┬────────┘
                 ↓
        Supabase Cloud (Database)
                 ↓
        Groq AI API (AI Services)
```

### Environment Variables

**Frontend (.env.production):**
- VITE_API_URL
**Backend (.env.production):**
- PORT
- SUPABASE_URL
- SUPABASE_KEY
- GROQ_API_KEY
- JWT_SECRET
---

## Project Structure

### Frontend
```
client/
├── public/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   ├── tasks/
│   │   ├── ai/
│   │   ├── layout/
│   │   └── common/
│   ├── pages/
│   ├── store/
│   │   └── slices/
│   ├── services/
│   ├── utils/
│   ├── i18n/
│   │   └── locales/
│   └── styles/
├── .env
└── package.json
```

### Backend
```
server/
├── src/
│   ├── config/
│   ├── middleware/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── utils/
│   └── validators/
├── .env
└── package.json
```

---

## Error Handling

### Error Flow

```
Error Occurs
        ↓
Try-Catch Block
        ↓
Error Middleware
        ↓
Categorize Error:
        - Validation Error (400)
        - Authentication Error (401)
        - Authorization Error (403)
        - Not Found Error (404)
        - Rate Limit Error (429)
        - Server Error (500)
        ↓
Format Error Response:
        {
          success: false,
          error: "User-friendly message",
          code: "ERROR_CODE",
          details: {} // Only in development
        }
        ↓
Log Error:
        - Console (development)
        - File system (production)
        - Error tracking service (Sentry)
        ↓
Send Response to Client
        ↓
Frontend Error Interceptor
        ↓
Handle Error:
        - Update Redux error state
        - Show toast notification
        - Display inline error
        - Retry mechanism
        - Fallback UI
```

### Common Error Codes

**Authentication Errors:**
- `INVALID_CREDENTIALS`: Wrong email or password
- `TOKEN_INVALID`: JWT token is invalid or expired
- `TOKEN_EXPIRED`: Access token has expired
- `EMAIL_NOT_CONFIRMED`: User hasn't verified email
- `EMAIL_NOT_VERIFIED`: Email verification required for action

**Validation Errors:**
- `MISSING_REQUIRED_FIELDS`: Required fields not provided
- `INVALID_EMAIL`: Email format is invalid
- `WEAK_PASSWORD`: Password doesn't meet requirements
- `INVALID_PRIORITY`: Priority must be low/medium/high
- `INVALID_DATE`: Date format or value is invalid

**Authorization Errors:**
- `NOT_TASK_OWNER`: User doesn't own the task
- `INSUFFICIENT_PERMISSIONS`: User lacks required permissions

**Resource Errors:**
- `USER_NOT_FOUND`: User doesn't exist
- `TASK_NOT_FOUND`: Task doesn't exist
- `EMAIL_NOT_FOUND`: Email address not registered
- `SUGGESTION_NOT_FOUND`: AI suggestion doesn't exist

**Rate Limiting:**
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `EMAIL_RATE_LIMIT`: Too many email requests

**Server Errors:**
- `DATABASE_ERROR`: Database query failed
- `AI_SERVICE_ERROR`: Groq API error
- `EMAIL_SERVICE_ERROR`: Email sending failed
- `INTERNAL_SERVER_ERROR`: Unexpected server error

---

## Translation Structure

### English (en.json)

**auth:**
- login: "Login"
- register: "Register"
- email: "Email Address"
- password: "Password"
- confirmPassword: "Confirm Password"
- name: "Full Name"
- emailNotConfirmed: "Please confirm your email"
- resendEmail: "Resend Email"
- checkInbox: "Check your inbox"
- emailSent: "Confirmation email sent!"

**tasks:**
- addTask: "Add Task"
- editTask: "Edit Task"
- deleteTask: "Delete Task"
- title: "Title"
- description: "Description"
- priority: "Priority"
- low: "Low"
- medium: "Medium"
- high: "High"
- dueDate: "Due Date"
- category: "Category"
- completed: "Completed"
- active: "Active"
- all: "All Tasks"

**ai:**
- suggestions: "AI Suggestions"
- generate: "Generate Suggestions"
- addToTasks: "Add to Tasks"
- refresh: "Refresh Suggestions"
- noSuggestions: "No suggestions available"
- generating: "Generating suggestions..."

**common:**
- save: "Save"
- cancel: "Cancel"
- delete: "Delete"
- edit: "Edit"
- close: "Close"
- loading: "Loading..."
- error: "Error"
- success: "Success"
- confirm: "Confirm"

### Hindi (hi.json)

**auth:**
- login: "लॉगिन"
- register: "पंजीकरण"
- email: "ईमेल पता"
- password: "पासवर्ड"
- confirmPassword: "पासवर्ड की पुष्टि करें"
- name: "पूरा नाम"
- emailNotConfirmed: "कृपया अपना ईमेल सत्यापित करें"
- resendEmail: "ईमेल फिर से भेजें"
- checkInbox: "अपना इनबॉक्स जांचें"
- emailSent: "पुष्टिकरण ईमेल भेजा गया!"

**tasks:**
- addTask: "नया कार्य जोड़ें"
- editTask: "कार्य संपादित करें"
- deleteTask: "कार्य हटाएं"
- title: "शीर्षक"
- description: "विवरण"
- priority: "प्राथमिकता"
- low: "कम"
- medium: "मध्यम"
- high: "उच्च"
- dueDate: "नियत तारीख"
- category: "श्रेणी"
- completed: "पूर्ण"
- active: "सक्रिय"
- all: "सभी कार्य"

**ai:**
- suggestions: "AI सुझाव"
- generate: "सुझाव उत्पन्न करें"
- addToTasks: "कार्यों में जोड़ें"
- refresh: "सुझाव रीफ्रेश करें"
- noSuggestions: "कोई सुझाव उपलब्ध नहीं"
- generating: "सुझाव तैयार हो रहे हैं..."

**common:**
- save: "सहेजें"
- cancel: "रद्द करें"
- delete: "हटाएं"
- edit: "संपादित करें"
- close: "बंद करें"
- loading: "लोड हो रहा है..."
- error: "त्रुटि"
- success: "सफलता"
- confirm: "पुष्टि करें"

---

## Security Best Practices

### Authentication Security

1. **Password Security:**
   - Minimum 8 characters required
   - Bcrypt hashing with 10 rounds
   - Never store plain text passwords
   - Password strength validation

2. **Token Security:**
   - JWT with short expiry (1 hour)
   - Refresh tokens with longer expiry (7 days)
   - Secure token storage (httpOnly cookies recommended)
   - Token rotation on refresh

3. **Email Verification:**
   - Required before accessing protected resources
   - Secure token generation (32 bytes)
   - Token expiry (24 hours)
   - Rate limiting on resend (3 per hour)

4. **Session Management:**
   - Automatic logout on token expiry
   - Refresh token mechanism
   - Revoke tokens on logout
   - Monitor suspicious activity

### API Security

1. **CORS Configuration:**
   - Whitelist specific origins
   - Restrict allowed methods
   - Configure credentials handling

2. **Rate Limiting:**
   - 100 requests per 15 minutes per IP
   - Stricter limits on sensitive endpoints
   - Email sending limits

3. **Input Validation:**
   - Validate all user inputs
   - Sanitize data to prevent XSS
   - Type checking and format validation
   - Use validation libraries

4. **SQL Injection Prevention:**
   - Use parameterized queries
   - Supabase handles this automatically
   - Never concatenate user input into queries

### Database Security

1. **Row Level Security (RLS):**
   - Enabled on all tables
   - Policies enforce user isolation
   - Automatic filtering by user_id
   - No manual WHERE clauses needed

2. **Least Privilege:**
   - Backend uses service role key (full access)
   - Frontend uses anon key (limited access)
   - RLS policies enforce restrictions

3. **Data Encryption:**
   - Passwords encrypted with bcrypt
   - Sensitive data encrypted at rest
   - HTTPS for data in transit

---

## Testing Strategy

### Frontend Testing

**Unit Tests:**
- Redux reducers and actions
- Utility functions
- Helper functions
- Validation logic

**Component Tests:**
- Individual component rendering
- Props handling
- Event handlers
- Conditional rendering

**Integration Tests:**
- Redux store integration
- API service calls
- Form submissions
- Navigation flows

**E2E Tests:**
- Complete user flows
- Registration to task creation
- Login to task management
- AI suggestions workflow

### Backend Testing

**Unit Tests:**
- Controller functions
- Service functions
- Utility functions
- Validation logic

**Integration Tests:**
- API endpoint responses
- Database operations
- Authentication flow
- Email sending

**API Tests:**
- Request/response validation
- Status code verification
- Error handling
- Rate limiting

**Load Tests:**
- Concurrent user handling
- Database query performance
- AI API response times
- Cache effectiveness

---

## Monitoring and Logging

### Application Monitoring

**Frontend Metrics:**
- Page load times
- Component render times
- API request latency
- Error rates
- User interactions

**Backend Metrics:**
- Request/response times
- Database query duration
- AI API call duration
- Error rates
- Memory usage
- CPU usage

**Database Metrics:**
- Query performance
- Connection pool usage
- Table sizes
- Index effectiveness

### Logging Strategy

**Development:**
- Console logging
- Detailed error messages
- Request/response logging
- Database query logging

**Production:**
- File-based logging
- Error tracking (Sentry)
- Log rotation
- Minimal sensitive data
- Structured JSON logs

**Log Levels:**
- ERROR: Critical failures
- WARN: Potential issues
- INFO: General information
- DEBUG: Detailed debugging (dev only)

---

## Future Enhancements

### Planned Features

1. **Collaboration:**
   - Share tasks with other users
   - Team workspaces
   - Task assignments
   - Comments and discussions

2. **Advanced AI:**
   - Natural language task creation
   - Smart scheduling suggestions
   - Priority recommendations
   - Workload analysis

3. **Notifications:**
   - Due date reminders
   - Push notifications
   - Email digests
   - Slack/Discord integrations

4. **Analytics:**
   - Productivity insights
   - Task completion trends
   - Time tracking
   - Custom reports

5. **Mobile Apps:**
   - React Native apps
   - Offline support
   - Push notifications
   - Biometric authentication

6. **Integrations:**
   - Google Calendar sync
   - GitHub integration
   - Trello import/export
   - Zapier webhooks

7. **Gamification:**
   - Achievement system
   - Streaks and badges
   - Leaderboards
   - Rewards program

8. **Advanced Organization:**
   - Projects and sub-tasks
   - Tags and labels
   - Custom views
   - Kanban boards

---

## Troubleshooting Guide

### Common Issues

**Email Confirmation Not Received:**
1. Check spam/junk folder
2. Verify email address is correct
3. Click "Resend Email"
4. Wait for rate limit cooldown
5. Contact support if persistent

**Cannot Login:**
1. Verify credentials are correct
2. Check if email is confirmed
3. Try password reset
4. Clear browser cache
5. Check network connection

**Tasks Not Loading:**
1. Refresh the page
2. Check network connection
3. Verify authentication status
4. Check browser console for errors
5. Try different browser

**AI Suggestions Not Generating:**
1. Ensure email is verified
2. Check rate limits
3. Try different language
4. Wait and retry
5. Check Groq API status

**Performance Issues:**
1. Clear browser cache
2. Disable browser extensions
3. Check internet speed
4. Update browser
5. Try incognito mode

## Version History

**v1.0.0 (Current)**
- Initial release
- Core task management
- AI suggestions
- Email verification
- Multilingual support (EN/HI)

**Upcoming:**
- v1.1.0: Collaboration features
- v1.2.0: Advanced analytics
- v2.0.0: Mobile apps

---

## Glossary

**Terms:**
- **JWT:** JSON Web Token for authentication
- **RLS:** Row Level Security in database
- **CRUD:** Create, Read, Update, Delete operations
- **i18n:** Internationalization
- **API:** Application Programming Interface
- **UUID:** Universally Unique Identifier
- **SMTP:** Simple Mail Transfer Protocol
- **CORS:** Cross-Origin Resource Sharing
- **XSS:** Cross-Site Scripting attack
- **Bcrypt:** Password hashing algorithm

---

*Last Updated: October 4, 2025*
*Documentation Version: 1.0.0*