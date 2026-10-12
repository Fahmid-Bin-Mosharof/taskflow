# TaskFlow

A task management workspace built with React, Tailwind CSS, Firebase Authentication, and Firestore. Create projects, organize tasks on a drag-and-drop Kanban board, and track progress from a dashboard with charts.

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

## Screenshots

<!-- Uncomment after adding the images to docs/screenshots/ -->
<!--
| Landing | Dashboard |
|---|---|
| ![Landing](docs/screenshots/landing.png) | ![Dashboard](docs/screenshots/dashboard.png) |

| Kanban board | Calendar |
|---|---|
| ![Board](docs/screenshots/board.png) | ![Calendar](docs/screenshots/calendar.png) |

| Dark mode | Mobile |
|---|---|
| ![Dark mode](docs/screenshots/dark-mode.png) | ![Mobile](docs/screenshots/mobile.png) |
-->

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

## Firebase Setup

1. Create a project in the [Firebase Console](https://console.firebase.google.com).
2. Register a **Web app** and copy its config into `.env`.
3. Under **Authentication → Sign-in method**, enable **Email/Password** and **Google**.
4. Create a **Firestore Database** in production mode.
5. Publish the security rules from [`firestore.rules`](firestore.rules), either by pasting them in **Firestore → Rules** or by running `firebase deploy --only firestore:rules`.
6. For a deployed site, add its domain under **Authentication → Settings → Authorized domains**.
7. Optional but recommended: set up **App Check** with reCAPTCHA Enterprise, restrict the API key to your domains, and add a budget alert.

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

## Security

- Firestore security rules limit each user to their own projects and tasks, accept only known fields, require server timestamps, and validate sizes and values. See [`firestore.rules`](firestore.rules).
- Emails are never stored in Firestore. Public profile documents hold only a display name, photo, and creation date.
- App Check (reCAPTCHA Enterprise) can be enabled so only this app can talk to the backend.
- Firebase web configuration values are public by design. Access is controlled by the rules, App Check, authorized domains, and API key restrictions.

To report a vulnerability, see [`SECURITY.md`](SECURITY.md).

## Known Limitations

- Tasks are visible only to the user who created them. Assigning a task to another registered user doesn't give that user access to it.
- Display names and photos are visible to every signed-in user, because the assignee dropdown lists all registered users.
- Profile photos are stored as small images inside Firestore. Firebase Storage would be better for large images but needs the paid plan.
- A photo set by link can point to any server.
- Weekly Activity estimates completions from each done task's last-updated time, because tasks have no `completedAt` field.
- Within a column, task order follows the chosen sort, not manual ordering.
- Project deletion runs from the browser, so closing the tab mid-delete could leave some tasks behind. They stay private to their creator.

## Future Improvements

- Project sharing, invitations, and membership, so assigned users can see and edit tasks
- Cloud Functions for reliable project deletion and per-user limits
- A `completedAt` field for exact activity charts
- Manual task ordering inside columns (an `order` field with `@dnd-kit/sortable`)
- Drag tasks between days on the calendar, and create tasks from a calendar day
- Profile photos in Firebase Storage
- Comments and activity history on tasks
- Unit and end-to-end tests

## License

MIT. See [`LICENSE`](LICENSE).

## Author

**Your Name**
GitHub: [@your-username](https://github.com/your-username)
Portfolio: [your-portfolio-link]