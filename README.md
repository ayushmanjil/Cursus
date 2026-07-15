# Cursus

A modern, responsive personal book-tracking app. Single-page application built with React, TypeScript, Tailwind CSS, and Framer Motion. All data is stored locally in your browser via `localStorage` — no backend, no account, no database.

---

## 🚀 Getting Started (How to Run the App)

### 1. Install dependencies
In the project root directory, run:
```bash
npm install
```

### 2. Run the app locally
Start the local development server:
```bash
npm run dev
```
This will start a dev server, by default at **`http://localhost:5173`**. Open that URL in your browser. Source file changes will hot-reload automatically.

### 3. Build for production
```bash
npm run build
```
This runs a type check and outputs an optimized, static build to the `dist/` folder.

To preview the production build locally before deploying:
```bash
npm run preview
```

### 4. Deploy
Since this is a fully static, backend-free app, the contents of `dist/` can be hosted anywhere that serves static files — Netlify, Vercel, GitHub Pages, S3, Cloudflare Pages, etc. There is nothing to configure server-side.

---

## 🔑 Authentication (How to Log In)

The application includes a premium-designed login screen. You must authenticate to access the library dashboard.

### Default Credentials:
- **Username / Email:** `Ayush`
- **Password:** `ayush1234`

### Configuration:
These credentials can be configured or changed in the project's [`.env`](file:///c:/Users/VICTUS/Downloads/my-library/.env) file:
```env
VITE_LOGIN_EMAIL=Ayush
VITE_LOGIN_PASSWORD=ayush1234
```

---

## 📖 How to Read & Understand the Codebase

Here is a step-by-step guide on how the project is structured and how data flows through the application. Use this roadmap to navigate the source code.

### 1. Entry Points
* **[`index.html`](file:///c:/Users/VICTUS/Downloads/my-library/index.html)**: The HTML skeleton containing the root element `<div id="root"></div>`.
* **[`src/main.tsx`](file:///c:/Users/VICTUS/Downloads/my-library/src/main.tsx)**: The main entry point where React is initialized and mounts the [`App`](file:///c:/Users/VICTUS/Downloads/my-library/src/App.tsx) component.
* **[`src/index.css`](file:///c:/Users/VICTUS/Downloads/my-library/src/index.css)**: Holds root styles, fonts, color variables, custom scrollbars, and imports Tailwind.

### 2. Core Application Layout ([`src/App.tsx`](file:///c:/Users/VICTUS/Downloads/my-library/src/App.tsx))
[`App.tsx`](file:///c:/Users/VICTUS/Downloads/my-library/src/App.tsx) acts as the main hub of the application:
1. **Authentication Check**: If the user is not logged in (`isAuthenticated === false`), it displays the [`Login.tsx`](file:///c:/Users/VICTUS/Downloads/my-library/src/components/Login.tsx) component.
2. **State & Logic Initialization**: Hooks into [`useBooks.ts`](file:///c:/Users/VICTUS/Downloads/my-library/src/hooks/useBooks.ts) for book data, lists, genres, and CRUD functions.
3. **Filtering & Sorting**: Utilizes React `useMemo` to dynamically filter and sort books based on current user selections.
4. **Layout Assembly**: Assembles the [`Sidebar`](file:///c:/Users/VICTUS/Downloads/my-library/src/components/Sidebar.tsx) (navigation), [`TopBar`](file:///c:/Users/VICTUS/Downloads/my-library/src/components/TopBar.tsx) (search and actions), and the active view main component.

### 3. Key Components & Pages ([`src/components/`](file:///c:/Users/VICTUS/Downloads/my-library/src/components/))
* **[`Login.tsx`](file:///c:/Users/VICTUS/Downloads/my-library/src/components/Login.tsx)**: Handles the beautiful authentication screen. Logs in using credentials from environment variables (`import.meta.env`) or fallback defaults.
* **[`Dashboard.tsx`](file:///c:/Users/VICTUS/Downloads/my-library/src/components/Dashboard.tsx)**: Displays the home screen. Showcases key statistics (total books, favorites, completion ring, reading streak overview) and list of recently added/finished books.
* **[`StatsPage.tsx`](file:///c:/Users/VICTUS/Downloads/my-library/src/components/StatsPage.tsx)**: Renders user performance data, yearly reading goals, rating distribution, and genre breakdown charts.
* **[`StreakManager.tsx`](file:///c:/Users/VICTUS/Downloads/my-library/src/components/StreakManager.tsx)**: Tracks reading habits, logs reading ticks (date, pages read, reading duration), and keeps track of consecutive daily streaks.
* **[`BookCard.tsx`](file:///c:/Users/VICTUS/Downloads/my-library/src/components/BookCard.tsx) & [`BookGrid.tsx`](file:///c:/Users/VICTUS/Downloads/my-library/src/components/BookGrid.tsx)**: Displays books in a responsive layout, with cover image placeholders, status tags, ratings, favorite hearts, and contextual quick actions.
* **[`AddBookModal.tsx`](file:///c:/Users/VICTUS/Downloads/my-library/src/components/AddBookModal.tsx) & [`BookDetailsModal.tsx`](file:///c:/Users/VICTUS/Downloads/my-library/src/components/BookDetailsModal.tsx)**: Overlays to add a new book to the library, view detailed book records, edit details, or change status (on-shelf / reading / read).
* **[`ui/`](file:///c:/Users/VICTUS/Downloads/my-library/src/components/ui/)**: Reusable UI blocks such as [`Badge`](file:///c:/Users/VICTUS/Downloads/my-library/src/components/ui/Badge.tsx), [`Button`](file:///c:/Users/VICTUS/Downloads/my-library/src/components/ui/Button.tsx), [`Modal`](file:///c:/Users/VICTUS/Downloads/my-library/src/components/ui/Modal.tsx), [`StarRating`](file:///c:/Users/VICTUS/Downloads/my-library/src/components/ui/StarRating.tsx), and [`CoverUpload`](file:///c:/Users/VICTUS/Downloads/my-library/src/components/ui/CoverUpload.tsx).

### 4. Custom Hooks & State Flow ([`src/hooks/`](file:///c:/Users/VICTUS/Downloads/my-library/src/hooks/))
* **[`useLocalStorage.ts`](file:///c:/Users/VICTUS/Downloads/my-library/src/hooks/useLocalStorage.ts)**: A custom React hook that synchronizes state variables automatically with browser local storage.
* **[`useBooks.ts`](file:///c:/Users/VICTUS/Downloads/my-library/src/hooks/useBooks.ts)**: Houses the central state logic of the books collection. Provides actions for:
  - `addBook()`: Appends a new book.
  - `updateBook()`: Modifies book properties.
  - `deleteBook()`: Removes a book.
  - `setStatus()`: Transition statuses (e.g. marking a book as *Read* sets `dateFinished` to today).
  - `importBooks()` / `handleExport()`: Backs up and loads files.
* **[`useTheme.ts`](file:///c:/Users/VICTUS/Downloads/my-library/src/hooks/useTheme.ts)**: Handles dark mode/light mode changes and updates the root DOM class.

### 5. Types & Seed Data
* **[`src/types/book.ts`](file:///c:/Users/VICTUS/Downloads/my-library/src/types/book.ts)**: Core type definitions for `Book`, `BookStatus` (on-shelf, wishlist, reading, read), `SortState`, and `FilterState`.
* **[`src/data/seed.ts`](file:///c:/Users/VICTUS/Downloads/my-library/src/data/seed.ts)**: Pre-configured dummy books used on the first run of the app so the library is populated initially.

---

## 🗄️ Data & Privacy
Everything you add — books, notes, ratings, your theme preference, and your yearly reading goal — is saved directly in your browser's `localStorage`, scoped to the origin the app is served from. Nothing is sent anywhere. Clearing your browser data (or using a different browser/device) will start you with a fresh library, which is why the Export button is there — use it any time you want a backup, and Import to restore or merge it back in.
