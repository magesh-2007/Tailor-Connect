# TailorConnect – Tailoring Services & Learning Platform

A **frontend-only** React + Vite application built for a final-year college project.
TailorConnect connects **Customers**, **Tailors**, **Students**, and **Admins** on a single
platform for custom tailoring orders and tailoring/embroidery learning courses.

> This is a frontend-only build. It uses mock data by default so the app is fully
> functional and demo-ready even without a backend. When a backend is available at
> `VITE_API_URL`, the app will automatically use live data and fall back to mock data
> if any API call fails.

---

## Tech Stack

- React 18 + Vite
- React Router v6
- Axios (API calls with mock-data fallback)
- Plain CSS (pink themed, responsive)

## Theme

- Primary Pink: `#E91E63`
- Light Pink: `#FCE4EC`
- White: `#FFFFFF`

## Folder Structure

```
src/
  components/     Reusable UI components (cards, navbar, sidebar, table, modal, etc.)
  pages/          Route-level pages, grouped by role (customer, tailor, student, admin, auth, shared)
  layouts/        DashboardLayout (navbar + role-based sidebar)
  services/       api.js (axios client) + one service file per feature
  data/           mockData.js – central mock dataset used as API fallback
  hooks/          (reserved for custom hooks)
  context/        AuthContext.jsx – mock role-based authentication
  assets/         (reserved for local images/icons)
  App.jsx         All route definitions
  main.jsx        App entry point
  index.css       Global pink-themed styling
```

## Getting Started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

### Environment Variables

Create/edit `.env` in the project root:

```
VITE_API_URL=http://localhost:8080/api
```

If no backend is running at this URL, the app automatically uses realistic mock data
instead, so every screen remains fully browsable.

## Roles & Login

From the home page (`/`), pick a role and log in with **any email/password** (mock auth,
no real backend validation):

| Role     | Login Route         | Register Route         |
|----------|----------------------|-------------------------|
| Customer | `/login/customer`    | `/register/customer`    |
| Tailor   | `/login/tailor`      | `/register/tailor`      |
| Student  | `/login/student`     | `/register/student`     |
| Admin    | `/login/admin`       | *(no self-registration)*|

## Key Routes

```
/                       Role selection landing page
/login/:role            Login (customer | tailor | student | admin)
/register/:role         Register (customer | tailor | student)

/customer/dashboard      /tailor/dashboard
/student/dashboard       /admin/dashboard

/orders                 My orders (customer)
/quotations              Compare & accept tailor quotations
/payment                 Payment page (used after accepting a quotation)
/tracking/:id             Order tracking timeline
/courses                 Student course catalog
/profile                 Customer profile
```

Each role also has its own full sidebar navigation (Find Tailors, Create Order,
Appointments, Wishlist, Chat, Notifications, Reviews, Portfolio, Stitching Progress,
Assignments, Quizzes, Certificates, Tailor Verification, Complaints, Reports, etc.)

## Order Flow (Customer)

```
Create Order → Upload Design → Measurements → Fabric → Budget →
Delivery Date → Urgent Option → Request Quotations → Compare Tailors →
Accept Tailor → Payment → Order Tracking → Delivery → Review
```

## Notes for Evaluators

- All buttons and navigation links are wired to real routes — nothing is a dead link.
- Loading, empty, and error states are handled on every data-driven page.
- Images are loaded from a remote placeholder image service (picsum.photos) with
  fixed seeds, so dresses, tailors, fabrics, and courses each show a consistent,
  realistic-looking photo inside a reusable card component.
- Authentication is intentionally mocked (no real backend/security) since this is a
  frontend-only deliverable. Swap `services/api.js`'s `VITE_API_URL` and connect a real
  backend to make it production-ready.

## Build for Production

```bash
npm run build
npm run preview
```
