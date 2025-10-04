# AI-Powered Todo App

AI-Powered Todo App is a full-stack productivity application that leverages AI to help users manage their tasks efficiently with intelligent suggestions, multilingual support, and seamless task management.

---

## Technology Stack Overview

**Core Technologies:**
* **Frontend:** React 18 with Vite
* **Backend:** Node.js with Express.js
* **Database:** Supabase (PostgreSQL)
* **AI Engine:** Groq API (LLaMA models)
* **Authentication:** Supabase Auth with JWT
* **State Management:** Redux Toolkit
* **Internationalization:** i18next

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
        |  - Request Logger                              |
        |  - Error Handler                               |
        |                                                |
        |  API Routes:                                   |
        |  - /api/auth (Registration & Login)            |
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
        |  - Users              |  |  - Task Suggestions  |
        |  - Tasks              |  |  - Smart Planning    |
        |  - Profiles           |  |  - Multilingual      |
        |                       |  |                      |
        |  Features:            |  |  Languages:          |
        |  - Real-time updates  |  |  - English           |
        |  - Row Level Security |  |  - Hindi             |
        |  - Auto-scaling       |  |                      |
        +-----------------------+  +----------------------+
```

---

## Security Architecture

### User Registration Flow

```
User enters credentials
        |
        v
POST /api/auth/register
        |
        v
Supabase Auth creates user
        - Email validation
        - Password hashing (bcrypt by Supabase)
        - User ID generation
        |
        v
Create user profile in Supabase DB
        |
        v
Return JWT token
        - Payload: userId, email
        - Expiration: Based on Supabase config
        |
        v
Send token to frontend
        |
        v
Store in Redux state + localStorage
```

### User Login Flow

```
User enters credentials
        |
        v
POST /api/auth/login
        |
        v
Supabase Auth validates credentials
        |
        +-- Valid --> Generate JWT Token
        |             - Access token
        |             - Refresh token
        |             |
        |             v
        |             Fetch user profile
        |             |
        |             v
        |             Send to frontend
        |             |
        |             v
        |             Store in Redux + localStorage
        |
        +-- Invalid --> Return 401 Unauthorized
```

### Protected API Request Flow

```
Frontend sends request
        |
        v
Redux middleware adds:
"Authorization: Bearer <token>"
        |
        v
Backend JWT middleware
        |
        v
Supabase verifies token
        |
        +-- Valid --> Extract user info
        |             |
        |             v
        |             Attach user to req.user
        |             |
        |             v
        |             Process request
        |
        +-- Invalid --> Return 403 Forbidden
```

---

## AI Suggestion Generation Flow

```
Step 1: User requests AI suggestions
        |
        v
Step 2: Frontend dispatches Redux action
        - Current language (EN/HI)
        - User context
        |
        v
Step 3: POST /api/ai
        |
        v
Step 4: Backend prepares AI prompt
        - Include language preference
        - Add context about productivity
        - Request 3-5 task suggestions
        |
        v
Step 5: Send request to Groq API
        Model: LLaMA (via Groq)
        Prompt: "Generate {count} productive task 
                 suggestions in {language} for 
                 daily productivity"
        |
        v
Step 6: AI processes request
        - Understands language context
        - Generates relevant suggestions
        - Returns structured response
        |
        v
Step 7: Backend stores suggestions
        - In-memory storage (current implementation)
        - Associated with user ID
        - Timestamp added
        |
        v
Step 8: Return suggestions to frontend
        [
          {
            id: "uuid",
            text: "Complete morning exercise",
            language: "en",
            createdAt: "timestamp"
          },
          ...
        ]
        |
        v
Step 9: Redux updates AI state
        |
        v
Step 10: Component displays suggestions
        - AISuggestionsEnhanced component
        - One-click add to tasks
        - Refresh option available
```

**Processing Time:** 2-5 seconds for suggestions

---

## Task Management Flow

### CREATE Task
```
User fills task form
        |
        v
Fields:
        - Title (required)
        - Description (optional)
        - Priority (Low/Medium/High)
        - Due Date (optional)
        - Category (optional)
        |
        v
POST /api/tasks
        |
        v
Backend validates data
        - Check required fields
        - Sanitize input
        - Add user ID
        - Set timestamps
        |
        v
Save to Supabase database
        {
          userId,
          title,
          description,
          priority,
          dueDate,
          category,
          completed: false,
          createdAt,
          updatedAt
        }
        |
        v
Return new task
        |
        v
Redux updates tasks state
        |
        v
Component re-renders
        - Task appears in list
        - Success notification
```

### READ Tasks
```
Component mounts / User logs in
        |
        v
GET /api/tasks
        |
        v
Backend queries Supabase
        - Filter by userId
        - Order by createdAt DESC
        - Include all task fields
        |
        v
Return tasks array
        |
        v
Redux stores tasks
        |
        v
Display in TasksPage
        - Filter by status
        - Sort options
        - Search functionality
```

### UPDATE Task
```
User edits task
        |
        v
Modal/Form opens with current data
        |
        v
Modify fields
        |
        v
PUT /api/tasks/:id
        |
        v
Backend validates and updates
        - Verify task ownership
        - Update only changed fields
        - Update timestamp
        |
        v
Save to Supabase
        |
        v
Return updated task
        |
        v
Redux updates specific task
        |
        v
UI reflects changes
        - No page reload
        - Success notification
```

### DELETE Task
```
User clicks delete
        |
        v
Confirmation dialog
        |
        v
DELETE /api/tasks/:id
        |
        v
Backend verifies ownership
        |
        v
Delete from Supabase
        |
        v
Return success status
        |
        v
Redux removes task from state
        |
        v
UI updates
        - Task removed from list
        - Counter updated
```

### TOGGLE Task Completion
```
User clicks checkbox
        |
        v
PUT /api/tasks/:id
        - Toggle completed status
        |
        v
Backend updates task
        |
        v
Return updated task
        |
        v
Redux updates task
        |
        v
UI shows completion
        - Visual indication
        - Move to completed section
```

---

## Dashboard/Tasks Page Flow

```
User navigates to /tasks (or /)
        |
        v
Check authentication
        |
        +-- Not authenticated --> Redirect to /login
        |
        +-- Authenticated --> Load TasksPage
        |
        v
TasksPage component mounts
        |
        v
useEffect() triggers data fetching
        |
        +-------+-------+
        |               |
        v               v
      GET tasks      GET ai/suggestions
        |               |
        v               v
   Load all tasks   Load AI suggestions
        |               |
        v               v
   Redux updates   Redux updates
   tasks state     ai state
        |
        v
Calculate statistics
        - Total tasks count
        - Completed tasks count
        - Pending tasks count
        - Completion percentage
        |
        v
Render UI components
        - Header with user info
        - Statistics cards
        - Add task button
        - Tasks list/grid
        - Filter options (All/Active/Completed)
        - AI suggestions panel
        - Language switcher
        - Theme toggle
```

---

## Internationalization (i18n) Flow

```
User selects language
        |
        v
LanguageSwitcher component
        - EN (English)
        - HI (Hindi)
        |
        v
i18next changes language
        |
        v
All components re-render
        |
        v
Text updates across app
        - Navigation labels
        - Button text
        - Form labels
        - Error messages
        - AI suggestions
        |
        v
Language preference saved
        - localStorage
        - User can switch anytime
```

**Supported Languages:**
- English (EN)
- Hindi (HI)

---

## Database Schema

### Users Table (Supabase Auth)
```javascript
{
  id: UUID (Primary Key),
  email: String (unique),
  encrypted_password: String,
  email_confirmed_at: Timestamp,
  created_at: Timestamp,
  updated_at: Timestamp
}
```

### Profiles Table
```javascript
{
  id: UUID (Primary Key, Foreign Key to Users),
  full_name: String,
  avatar_url: String,
  preferences: JSONB,
  created_at: Timestamp,
  updated_at: Timestamp
}
```

### Tasks Table
```javascript
{
  id: UUID (Primary Key),
  user_id: UUID (Foreign Key to Users),
  title: String (required),
  description: Text,
  priority: String (enum: ['low', 'medium', 'high']),
  due_date: Date,
  category: String,
  completed: Boolean (default: false),
  created_at: Timestamp,
  updated_at: Timestamp
}
```

**Database Indexes:**
- tasks.user_id (for fast user queries)
- tasks.created_at (for sorting)
- tasks.completed (for filtering)

**Row Level Security (RLS):**
- Users can only access their own tasks
- Automatic filtering by user_id
- Secure by default

---

## API Endpoints Reference

### Authentication Endpoints
- **POST /api/auth/register** - Create new user account
  - Body: { email, password, name }
  - Returns: { user, token }

- **POST /api/auth/login** - Authenticate user
  - Body: { email, password }
  - Returns: { user, token }

- **GET /api/auth/profile** - Get current user profile
  - Headers: Authorization: Bearer <token>
  - Returns: { user, profile }

### Task Endpoints
- **GET /api/tasks** - Retrieve all user tasks
  - Headers: Authorization: Bearer <token>
  - Query: ?status=completed&sort=createdAt
  - Returns: { tasks: [...] }

- **POST /api/tasks** - Create new task
  - Headers: Authorization: Bearer <token>
  - Body: { title, description, priority, dueDate, category }
  - Returns: { task: {...} }

- **PUT /api/tasks/:id** - Update existing task
  - Headers: Authorization: Bearer <token>
  - Body: { title?, description?, priority?, completed?, ... }
  - Returns: { task: {...} }

- **DELETE /api/tasks/:id** - Delete task
  - Headers: Authorization: Bearer <token>
  - Returns: { success: true }

- **GET /api/tasks/debug-all** - Debug endpoint (development)
  - Headers: Authorization: Bearer <token>
  - Returns: All tasks with metadata

- **GET /api/tasks/test-all** - Test endpoint (no auth)
  - Returns: Sample tasks

### AI Endpoints
- **GET /api/ai** - Retrieve user's AI suggestions
  - Headers: Authorization: Bearer <token>
  - Returns: { suggestions: [...] }

- **POST /api/ai** - Generate new AI suggestions
  - Headers: Authorization: Bearer <token>
  - Body: { language: 'en' | 'hi', count: 3-5 }
  - Returns: { suggestions: [...] }

- **DELETE /api/ai/:id** - Delete AI suggestion
  - Headers: Authorization: Bearer <token>
  - Returns: { success: true }

---

## Frontend State Management (Redux)

### Auth Slice
```javascript
{
  user: null | User,
  token: null | string,
  isAuthenticated: boolean,
  loading: boolean,
  error: null | string
}
```

### Tasks Slice
```javascript
{
  tasks: Task[],
  loading: boolean,
  error: null | string,
  filter: 'all' | 'active' | 'completed',
  sortBy: 'createdAt' | 'priority' | 'dueDate'
}
```

### AI Slice
```javascript
{
  suggestions: Suggestion[],
  loading: boolean,
  error: null | string,
  language: 'en' | 'hi'
}
```

### UI Slice
```javascript
{
  theme: 'light' | 'dark',
  language: 'en' | 'hi',
  sidebarOpen: boolean,
  notifications: Notification[]
}
```

---

## Key Features

1. **AI-Powered Suggestions**
   - Groq API integration with LLaMA models
   - Context-aware task recommendations
   - Multilingual support (English/Hindi)
   - One-click task creation from suggestions

2. **Smart Task Management**
   - CRUD operations with real-time updates
   - Priority levels (Low/Medium/High)
   - Due date tracking
   - Category organization
   - Completion tracking

3. **Multilingual Interface**
   - Full i18n support with i18next
   - Dynamic language switching
   - Localized AI suggestions
   - Language-specific error messages

4. **Secure Authentication**
   - Supabase Auth integration
   - JWT token-based security
   - Row Level Security (RLS)
   - Protected routes

5. **Modern UI/UX**
   - Tailwind CSS styling
   - Dark/Light theme toggle
   - Responsive design
   - Smooth animations
   - Toast notifications

6. **State Management**
   - Redux Toolkit for predictable state
   - Persistent authentication
   - Optimistic UI updates
   - Error handling

7. **Real-time Capabilities**
   - Instant task updates
   - Live data synchronization
   - No page reloads required

8. **Developer Experience**
   - Vite for fast development
   - Hot module replacement
   - Environment variable support
   - Debug endpoints for testing

---

## Deployment Architecture

```
Developer Machine
        |
        v
git commit and push
        |
        v
GitHub Repository
        |
        +-------------+
        |             |
        v             v
    FRONTEND      BACKEND
    (React)       (Node.js)
        |             |
        v             v
npm run build     Deploy to
(Vite bundler)    Render/Heroku
        |             |
        v             v
Production build  API live at:
created           api.domain.com
        |             |
        v             v
Deploy to Vercel  Connected to
        |         Supabase
        v             |
Live at:              v
app.domain.com    Cloud Database
                  (PostgreSQL)
                      |
                      v
                  Connected to
                  Groq AI API
```

**Environment Variables:**

Frontend (.env):
```
VITE_API_URL=http://localhost:5000/api
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

Backend (.env):
```
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_service_role_key
GROQ_API_KEY=your_groq_api_key
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

---

## Component Structure

### Frontend Components

**Pages:**
- `LandingPage` - Home page with app introduction
- `LoginPage` - User authentication
- `RegisterPage` - New user registration
- `TasksPage` - Main task management interface

**Components:**
- `Header` - Navigation and user menu
- `TaskItem` - Individual task display
- `TaskList` - Collection of tasks
- `TaskForm` - Create/Edit task form
- `AISuggestionsEnhanced` - AI suggestions panel
- `LanguageSwitcher` - Language selection
- `ThemeToggle` - Dark/Light mode switch
- `ProtectedRoute` - Route guard for authentication

---

## Performance Optimizations

1. **Frontend:**
   - Code splitting with React.lazy
   - Memoization with React.memo
   - Redux selector optimization
   - Vite's optimized bundling

2. **Backend:**
   - In-memory AI suggestion caching
   - Database query optimization
   - Connection pooling with Supabase
   - Efficient middleware stack

3. **Database:**
   - Indexed queries for fast retrieval
   - Row Level Security for automatic filtering
   - Optimized table structure

---

## Error Handling

```
Request Error Occurs
        |
        v
Backend catches error
        |
        v
Error middleware processes
        |
        v
Categorize error:
        - 400: Bad Request
        - 401: Unauthorized
        - 403: Forbidden
        - 404: Not Found
        - 500: Server Error
        |
        v
Return structured error response
        {
          success: false,
          error: "Error message",
          code: "ERROR_CODE"
        }
        |
        v
Frontend receives error
        |
        v
Redux updates error state
        |
        v
Display user-friendly message
        - Toast notification
        - Inline error display
        - Fallback UI
```

---

## Future Enhancements

- **Advanced AI Features**
  - Task prioritization suggestions
  - Smart scheduling recommendations
  - Productivity analytics
  - Natural language task input

- **Collaboration**
  - Shared task lists
  - Team workspaces
  - Real-time collaboration
  - Task assignment

- **Integrations**
  - Calendar sync (Google, Outlook)
  - Email notifications
  - Mobile app (React Native)
  - Browser extension

- **Enhanced Features**
  - Recurring tasks
  - Sub-tasks and checklists
  - File attachments
  - Task templates
  - Time tracking
  - Kanban board view
  - Gantt chart view

- **Analytics**
  - Productivity insights
  - Task completion trends
  - Time spent analysis
  - Category-wise breakdown

- **Notifications**
  - Push notifications
  - Email reminders
  - SMS alerts
  - Due date warning
**Made with ❤️ for productivity enthusiasts**