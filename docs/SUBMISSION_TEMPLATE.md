# Technical Assignment Submission

Hi Team,

Please find my completed technical assignment below.

## 1) GitHub Repository
`https://github.com/<your-username>/<repo-name>`

## 2) Live/Deployed URL
`https://<your-app>.up.railway.app`

## 3) API Documentation / Postman Collection
- API documentation: `README.md`
- System design and architecture: `docs/SYSTEM_DESIGN.md`
- Postman collection: `postman/Inventory-Management.postman_collection.json`

## 4) Steps to Run Locally
1. Clone repository
```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
```

2. Install dependencies
```bash
npm install
```

3. Configure environment
```bash
cp .env.example .env
```
Set required values in `.env`:
- `DATABASE_URL`
- `JWT_SECRET`
- Optional: `PORT`, `CORS_ORIGIN`, `RATE_LIMIT_*`

4. Generate Prisma client and apply migrations
```bash
npm run prisma:generate
npm run prisma:deploy
```

5. Run the app
```bash
npm run dev
```

6. Access application
- Login: `http://localhost:<PORT>/login`
- Register: `http://localhost:<PORT>/register`
- Dashboard: `http://localhost:<PORT>/dashboard`
- Health API: `http://localhost:<PORT>/api/health`

Thank you for your time and review.
