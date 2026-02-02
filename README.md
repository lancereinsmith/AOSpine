# AOSpine Trauma Flow (TL AOSIS)

Thoracolumbar Injury Classification & Severity Score — React app (Vite, Tailwind).

## Project structure

- **`src/`** — App source: `App.jsx`, `main.jsx`, `index.css`
- **`docker/`** — Docker image: `Dockerfile`, `nginx.conf`
- **Root** — Config: `package.json`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `index.html`, `docker-compose.yml`

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (e.g. <http://localhost:5173>).

- **Build:** `npm run build`
- **Preview build:** `npm run preview`

## Run with Docker Compose

From the project root:

```bash
docker compose up --build
```

App is at **<http://localhost:3000**>. Stop with `Ctrl+C` or run in the background with `docker compose up -d --build`.

## Deploy

1. **Build and tag the image** (optional, for a registry):

   ```bash
   docker compose build
   docker tag aospine-app:latest <registry>/aospine-trauma-flow:latest
   docker push <registry>/aospine-trauma-flow:latest
   ```

2. **Run on a server or cloud** — Either:
   - Copy the project (or clone the repo), then run `docker compose up -d` on the host, or
   - Use the pushed image: `docker run -p 80:80 <registry>/aospine-trauma-flow:latest`

3. **Production tips:**
   - Put a reverse proxy (e.g. Caddy, Traefik, or nginx) in front for TLS and a hostname.
   - Use a process manager or orchestrator (e.g. Docker Compose, Kubernetes) and set `restart: unless-stopped` (already set in `docker-compose.yml`).
