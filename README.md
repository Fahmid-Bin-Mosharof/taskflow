# TaskFlow

TaskFlow is a clean, focused task management workspace designed to help you organize projects, manage tasks, and track progress effortlessly. Create projects, move tasks across the board as work progresses, and watch your completion rate grow. TaskFlow works seamlessly across desktop, tablet, and mobile devices.

**Live demo:** [https://your-project.web.app](https://your-project.web.app)
**Repository:** [https://github.com/your-username/taskflow](https://github.com/your-username/taskflow)

## Features

- **Authentication:** register and log in with email/password or Google, with protected routes
- **Projects:** create, edit, delete (with confirmation), search, and sort. Deleting a project also deletes its tasks.
- **Kanban board:** Todo, In Progress, and Done columns with drag and drop in both directions. Changes show instantly and save to Firestore, with automatic rollback if saving fails.
- **Tasks:** title, description, priority, status, due date, and assigned user. Create, edit, delete, and view details.
- **Search, filter, and sort:** search by title or description, filter by status, priority, and assignee (filters combine), and sort by newest, oldest, due date, or priority
- **My Tasks:** every task assigned to you, with status tabs
- **Calendar:** monthly view of task due dates with keyboard navigation
- **Dashboard:** live statistics, a task status donut chart, a weekly activity chart, recent projects, and recent tasks
- **Profile:** update your display name, and upload, change, or remove a profile photo
- **Settings:** light and dark theme, saved on your device
- **Real-time updates:** data syncs live through Firestore listeners
- **Responsive and accessible:** works from phone to desktop, with keyboard support, visible focus states, a skip link, and screen-reader labels
- **Polished states:** loading, empty, and error states, an offline banner, and an error boundary

## Tech Stack

| Area | Technology |
|---|---|
| Frontend | React, Vite, JavaScript, React Router, Tailwind CSS v4, React Icons |
| Backend | Firebase Authentication, Cloud Firestore, Firebase App Check |
| Libraries | @dnd-kit/core, Recharts, react-hot-toast |


## Installation

Requires Node.js 18 or later.

```bash
git clone https://github.com/your-username/taskflow.git
cd taskflow
npm install
cp .env.example .env
```

Fill in `.env` (see below), then:

```bash
npm run dev
```

## Environment Variables

Create a `.env` file in the project root:

```text
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_RECAPTCHA_SITE_KEY=
```

Find the Firebase values in the Firebase Console under **Project settings → Your apps → SDK setup and configuration**. `VITE_RECAPTCHA_SITE_KEY` is optional: leave it empty to run without App Check. Never commit `.env`.

## Project Structure

```text
src/
├── components/      common/, dashboard/, projects/, tasks/, calendar/, profile/, layout/, landing/
├── context/         AuthContext, ThemeContext
├── firebase/        config, auth, projects, tasks, users, error messages
├── hooks/           useAuth, useProjects, useTasks, useUsers, useTaskFilters, useTheme, ...
├── layouts/         DashboardLayout, AuthLayout
├── pages/           Home, Login, Register, Dashboard, Projects, ProjectDetails, MyTasks,
│                    Calendar, Profile, Settings, NotFound
├── routes/          Router, PrivateRoute, PublicRoute
└── utils/           date, task, project, calendar, chart, image, and validation helpers
```

## Usage

1. Register or log in.
2. Create a project from **Projects**.
3. Open the project and add tasks with **Add Task** or a column's **+** button.
4. Drag tasks between columns, or use **Move to…** in a task's menu.
5. Use the search box and filters to find tasks.
6. Check **My Tasks**, the **Calendar**, and the **Dashboard** to track progress.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

