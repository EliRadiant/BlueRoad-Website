# Blue Road

Factory site with a working register / login backend.

## Project structure

```
blueroad-website/
├── server.js              Express app entry point
├── package.json
├── .env.example            Copy to .env and edit
├── db/
│   └── database.js         Opens data/blueroad-website.db and creates the users table
├── routes/
│   └── auth.js             POST /api/auth/register, /login, /logout, GET /me
├── data/                    SQLite database file lives here (created on first run, gitignored)
└── public/                  Everything the browser can see
    ├── index.html, products.html, process.html, about.html, blog.html, contact.html, account.html
    ├── css/style.css
    ├── js/carousel.js
    ├── js/auth.js           Nav auth state and account-page guard logic
    └── images/
```

`server.js` and `routes/`, `db/`, `data/` sit **outside** `public/` on purpose — only
files inside `public/` are ever served to the browser, so your server code and the
SQLite database file itself are never downloadable.

## Setup (first time)

1. Install [Node.js](https://nodejs.org) if you don't already have it (v18 or later).
2. Open the `blueroad-website` folder in VS Code.
3. Open a terminal in VS Code (`` Ctrl+` `` / `` Cmd+` ``) and run:
   ```
   npm install
   ```
4. Copy the env file and set a real secret:
   ```
   cp .env.example .env
   ```
   Then open `.env` and replace `SESSION_SECRET` with a random string. You can generate one with:
   ```
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

## Running it

```
npm start
```
or, if you want the server to auto-restart whenever you save a file:
```
npm run dev
```

Then open **http://localhost:3000** in your browser. The main storefront pages are served from that one address.

## How the auth works

- Passwords are hashed with **bcrypt** before they're stored — the plain password is
  never written to the database.
- Logging in creates a **session**, tracked with a signed, `httpOnly` cookie, so
  client-side JavaScript can't read or tamper with it.
- Every page loads `js/auth.js`, which calls `GET /api/auth/me` on load. If you're
  logged in, the navigation swaps to "Hi, [name]" + Account + Log out.
- The site no longer exposes dedicated login/register pages; the account page is
  treated as an unavailable UI until a sign-in flow is reintroduced.

## Where the data lives

Registered users are stored in `data/blueroad-website.db`, a single SQLite file. You can
inspect it with a free tool like [DB Browser for SQLite](https://sqlitebrowser.org/)
while the server isn't running (SQLite is a single file, not a running service).

## Editing blog articles

The blog is a static page; article content is written directly in `public/blog.html`.
In VS Code, copy an existing `<article class="blog-card">...</article>` block inside
the `blog-grid`, then edit its category, date, title, summary, paragraphs, and author.
Save the file and refresh the page to see the update. No database or publishing form is
needed.

## Before deploying this anywhere public

This is set up for local development. Before putting it on the internet:
- Set a real, secret `SESSION_SECRET` in `.env` (never commit `.env`).
- Serve over HTTPS and uncomment `secure: true` on the session cookie in `server.js`.
- Swap the default in-memory session store for something like `connect-sqlite3` or
  Redis — the built-in memory store used here resets every time the server restarts
  and doesn't scale past one process.
- Add rate limiting to `/api/auth/login` and `/register` to slow down brute-force
  attempts (e.g. the `express-rate-limit` package).
