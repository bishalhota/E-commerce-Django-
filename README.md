# E-commerce Django + React

A small e-commerce application with a Django REST API, PostgreSQL, and a React/Vite frontend.

## Requirements

- Docker Desktop
- Node.js 18 or newer

## Run the backend

From the `Backend` directory:

```powershell
Copy-Item .env.example .env
docker compose up --build
```

The API is available at `http://localhost:8001`. Django admin is available at `http://localhost:8001/admin/`.

For a new installation, apply migrations in another terminal:

```powershell
docker compose exec backend python manage.py migrate
```

Create an admin user when needed:

```powershell
docker compose exec backend python manage.py createsuperuser
```

## Run the frontend

From the `Frontend` directory:

```powershell
Copy-Item .env.example .env
npm install
npm run dev
```

Open the Vite URL shown in the terminal, normally `http://localhost:5173`.

The frontend uses `VITE_DJANGO_BASE_URL` from `Frontend/.env` to reach the API.

## Useful commands

```powershell
# Backend checks
docker compose exec backend python manage.py check

# Frontend production build
cd ..\Frontend
npm run build

# Stop containers
cd ..\Backend
docker compose down
```

Never commit `.env` files. Put local passwords and secret keys in the ignored environment files instead.