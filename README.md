# file-processing-system
A full stack project-centric file processing system using React+Typescript(Frontend) and Node.js+Express+PostgreSQL(Backend). It includes-
- Authentication support
- Projects management
- Upload project files
- Background zip job tracking suing polling

## Tech Stack
Frontend-
- React
- TypeScript
- Vite
- CSS
- Json server(mock backend)

Backend-
- Node.js
- Typescript
- Express.js
- Worker threads
- JWT authentication
- PostgreSQL


## Setup
### 1. Clone Repository
```bash
git clone <repo-url>
cd repo-name
```
### 2. Frontedn setup
```bash
npm install
npm run dev
```
- Frontend runs on vite dev server- http://localhost:5173
### 2. Backend setup
```bash
cd backend
npm install
```
Create a `.env` file:
```env
PORT=4000
DB_URL=postgresql_connection
```
Run backend-
```bash
npm run dev
```
- Backend runs on- http://localhost:4000