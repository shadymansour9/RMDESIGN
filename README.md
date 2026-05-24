# RM Design Studio — Web Platform

A live, bilingual web platform for an interior-design & architecture studio.
Real students register for courses through it, and real clients request meetings — every day.

🔗 **Live site:** https://www.rmdesignsstudios.com

---

## What it does

This is not a demo or a static portfolio site. It is a production platform that a real design studio depends on for day-to-day operations:

- **Course registration** — students sign up for Revit courses directly through the site (50+ registrations to date).
- **Meeting booking & client inquiries** — prospective clients request meetings.
- **Project gallery** — a showcase of the studio's interior & architecture work.
- **Automated lead flow** — every submission sends an instant email confirmation to both the studio and the registrant, and syncs into a Google Sheet the studio manages directly.

---

## Tech stack

| Area | Choice |
|------|--------|
| Frontend | React |
| Styling | Pure CSS (no UI frameworks, no Tailwind) |
| Languages | Fully bilingual — English + Hebrew with complete RTL support |
| Forms & email | EmailJS |
| Data | Google Sheets integration |
| Hosting | Vercel (custom domain) |

---

## Key engineering decision

The most important choice in this project is what I deliberately *didn't* build.

Instead of a full backend with a database and an admin dashboard, I chose a lightweight **email + Google Sheets** flow for handling registrations and leads.

Why: the business needs **reliability and zero maintenance**, not complexity. The studio owner manages incoming registrations directly in a sheet (marking paid / partially paid / pending) without depending on me. This is cheaper, more reliable, and removes a whole class of security and maintenance concerns — the right tool for the actual problem, not the fanciest one.

---

## Highlights

- Built entirely from scratch in React + pure CSS — no component libraries.
- Full bilingual EN/HE support including right-to-left (RTL) layout.
- Live in production on a custom domain, serving real users.
- Automated, dependency-free lead management.

---

## Running locally

```bash
npm install
npm start
```

The app runs at `http://localhost:3000`.

---

## Author

**Shady Mansour** — Software Engineer (B.Sc., Braude College)
Frontend / Full-Stack · Flutter / Mobile
