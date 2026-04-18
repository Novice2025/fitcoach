## Getting Started

Create a local env file for the frontend:

```bash
cp .env.example .env.local
```

Start the Flask API in a separate terminal:

```bash
python app.py
```

Then run the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Runtime Structure

- `app/` owns `/` and `/login`
- `pages/dashboard/*` owns the dashboard routes
- `app.py` is the active local API for the dashboard on port `5000`
- `server.js` is not wired into the frontend right now and should be treated as experimental until the app is intentionally migrated to it

## Environment

The dashboard reads its backend base URL from `NEXT_PUBLIC_API_BASE_URL`.

Default local value:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

If the Flask API is not running, dashboard pages now show an in-app error message instead of failing with an unhandled fetch runtime error.
