# Local Development Instructions

Since the frontend and backend are now separated, you need to run them in two separate terminal sessions.

## 1. Backend API
Runs on **Port 5000**.

```bash
# From root directory
npm run dev
```

*Ensure your MongoDB is running or your `.env` contains the correct connection string.*

## 2. Frontend Client
Runs on **Port 5173** (by default).
Configured to proxy `/api` requests to `http://localhost:5000`.

```bash
# From client directory
cd client
npm run dev
```

---

**Access the application at:** [http://localhost:5173](http://localhost:5173)
