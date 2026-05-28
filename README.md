# file-processing-system
A full stack project-centric file processing system using React+Typescript (Frontend) and Node.js+Express+PostgreSQL (Backend). It includes-
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

Backend-
- Node.js
- Typescript
- Express.js
- Worker threads
- JWT authentication
- Multer
- Archiver
- PostgreSQL


## Folder Structure
### Frontend
`frontend/`
- src- react ts application code with frontend compoenents architeture
- index.html- app entry html
- vite.confg.ts- vite config

`frontend/src`
- components- Reusable UI components or modals
- pages- route level apges
- contexts- authentication, global states
- hooks- custom react hooks/reducer
- routes- navigation between pages/components
- services- api calls, data types and backend connection
- styles- application css 

### Backend
`backend/`
- src- backend APIs implementation
- uploads- uploaded project files
- zips- generated zip outputs

`backend/src/modules`
- auth- user authentication 
- projects- projects management
- files- files management
- jobs- jobs zip and status tracking
- *Files format under modules*: 
  - route- API route definitions
  - contoroller- request handlers
  - service- business logic
  - repository- Postgresql connection and queries
  - worker- worker thread processing logic

## Setup
### 1. Clone Repository
```bash
git clone <repo-url>
cd repo-name
```
### 2. Frontedn setup
```bash
cd frontend
npm install
npm run dev
```
- Frontend runs on vite dev server- http://localhost:5173
### 3. Backend setup
```bash
cd backend
npm install
```
Create a `.env` file:
```env
PORT=4000
DB_URL=postgresql_connection
JWT_SECRET=token
NODE_ENV=dev
```
Run backend-
```bash
npm run dev
```
- Backend runs on- http://localhost:4000

## Features
### Authentication
- Login
- Logout
- JWT-based authentication
- Protected routes

### Projects
- Create and manage projects
- project scoped file management
- project scoped job management

### File Uploads
- Upload multiple files using `multer`
- Drag and drop feature
- File storage on disk, delete feature

### Background Processing Jobs
- Create ZIP compression job for porject files
- Worker thread based processing
- Real time job status tracking
- Download generated zip output

### Polling system
- Frontend polls backend in interval
- Job progress updates auto reflected
- Stops polling when job completes/fails

## Database Design
### Entities
1. Users- represents users data for login into application 
2. Projects- represents domain entity with projects listing
3. Files- files uploaded under a specific project.
4. Jobs- background processing tasks associated with project.
- *Indexing on files, jobs table with cascade delete constraints*

## Polling strategy
Frontend uses interval based polling to track job progress. Here's its workflow-
1. user creates processing job with zip creation
2. job immediately appears in UI
3. frontend starts polling with fetching latest job status every 2-3 seconds
4. polling stops automatically when job status becomes `completed`/`failed`

## Worker threads architecture
Background jobs are processed using node js worker threads. Here's its workflow-
1. API creates job entry in db
2. worker thread is generated
3. worker uses `archiver` to compress selected files
4. worker updates db job status with `pending`/`processing`/`completed`/`failed`
5. frontend polling shows updates in UI
