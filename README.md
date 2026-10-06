# HostelHub

## Run locally

Requires Node.js 20 or later.

```powershell
npm install
npm start
```

Open http://localhost:3000. The server connects to MongoDB at `mongodb://127.0.0.1:27017/hostelhub` by default, then seeds the collections with sample hostel records on the first run. Ensure MongoDB is running before starting the app.

To use MongoDB Atlas or another MongoDB instance, set `MONGODB_URI` to its connection string before running `npm start`. If `data/hostel.json` exists and the MongoDB collections are empty, the server imports those records once; after import, MongoDB is the source of truth.

Copy `.env.example` to `.env` for local configuration. Never commit `.env` or put database credentials in source control.

## Demo accounts

| Role | Username | Password |
| --- | --- | --- |
| Admin | `admin` | `Admin@123` |
| Warden | `warden` | `Warden@123` |
| Student | `student1` | `Student@123` |

When opened directly as an HTML file or on GitHub Pages without a configured backend, these accounts provide a browser-only demo using sample data. Demo changes are not saved or shared, and these public credentials must never be used for a real deployment.

Student sessions are read-only and only return records associated with that student. Admin and warden sessions can manage hostel records.

In Mess Management, staff maintain a recurring Sunday-to-Saturday menu with individual dishes for breakfast, lunch, snacks, and dinner. Students can select multiple dishes across the week and update their selections later. Kitchen and warden accounts can review per-dish student counts by weekday. Menus and selections are stored in MongoDB; legacy date-based menus and selections are migrated to weekdays when the server starts.

## AI assistant

Hostel Intelligence provides operational alerts and answers common questions about occupancy, fees, maintenance, and leave requests using local rules. For generated summaries, set `OPENAI_API_KEY`; optionally set `OPENAI_MODEL` (defaults to `gpt-4o-mini`). Only aggregate hostel metrics and the user's question are sent to the provider. The key stays on the server. Without a key, the local assistant remains available.

## Deploy with GitHub

This is a full-stack Express app, so GitHub Pages can serve its frontend but cannot host the login API or database. The included `render.yaml` configures Render to deploy the Node server from a GitHub repository. `.github/workflows/ci.yml` checks JavaScript syntax on pushes and pull requests to `main`.

1. Push this project to a GitHub repository.
2. Create a MongoDB Atlas database and copy its connection URI.
3. In Render, choose **New + > Blueprint**, connect the GitHub repository, and apply `render.yaml`.
4. In the Render service environment, set `MONGODB_URI`, unique admin/warden/student usernames, and passwords of at least 12 characters. The Blueprint allows the `https://deena178.github.io` Pages origin and generates `JWT_SECRET`. Keep all credentials in Render environment settings, not GitHub.
5. Set `window.HOSTEL_API_BASE_URL` in both `config.js` and `public/config.js` to the deployed Render service URL (for example, `https://your-service.onrender.com`).
6. Wait for the service health check at `/api/health`, then open the GitHub Pages URL. The frontend uses the configured backend for login and all API requests. Keep GitHub Pages configured to publish from the repository root.

For local development the demo accounts remain available. Production refuses to start without a MongoDB URI, JWT secret, and deployment-specific credentials; do not use demo passwords in production.