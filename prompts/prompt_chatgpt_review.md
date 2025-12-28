# IMAGE MANAGER APPLICATION — MASTER PROMPT

## GLOBAL RULES

- Be factual, professional, and direct
- No compliments or filler
- Always argue choices: why this instead of that
- Take examples, URLs, or references into account and challenge them
- Use Node.js ESM (`.mjs`)
- Balance performance, security, maintainability, mainstream practices
- Comment code only when logic is non-trivial
- Explicitly say when a requirement is unrealistic or unsafe
- Analyze existing `index.html` first because it is the base of this project

---

## PHASE 0 — PRELIMINARY ANALYSIS

### Objectives
- Analyze existing `index.html`
- Identify reusable vs replaceable elements
- Decide if a build step (Vite / ESBuild) is required

### Deliverable
- react front end app
- express.js back end app
- a markdown describing reflexions, choices and roadmap 

---

## PHASE 1 — GENERAL DESCRIPTION

### Purpose
- Display locally stored images (if app run locally)
- Keyboard-based image actions
- HEIC → JPG conversion
- Face recognition (either locally run if on PC, or on VM)
- Search bar
- Persistent database

---

## FRONTEND

### Basics
- React
- Starting from `index.html` (no server, limited)
- Component-based architecture
- Lazy loading on scroll
- Optional unloading of off-screen images
- Themes: dark, light, system, emerald green
- All cction button appearance : round icon button  
  https://icons.getbootstrap.com/icons/three-dots-vertical/

---

### Functionalities (front-end)
- File-explorer keyboard navigation
- Context menus (right-click / long-press)
- Move-to modal with folder tree
- Rotation (local if possible, DB otherwise)
- Tag CRUD
- Drag & drop import

---

### Design
- Icons only  
  https://icons.getbootstrap.com/  
  `npm i bootstrap-icons`
- No bordered buttons
- Subtle hover effects
- Navbar underline (bottom border, not text)

---

### Image Modal
- Metadata panel with persistent visibility
- GPS + map
- Face thumbnails → person filter
- Existing functionalities from `index.html`, such as: 
    - full sceen
    - previous/next base on click on screen or keyboard arrows 

---

## PAGES AND NAVBAR

- From right to left: 
    - Home
    - People
    - Map
    - Settings
    - Admin
- Stucked on the right:
    - Auth  
- Search bar in between 

---

## BACKEND

### General
- Express.js (ESM)
- Security: rate-limit, helmet, xss-clean, hpp
- CSP, CSRF (if cookies)
- Argon2 passwords
- Encrypted local DB
- Zero-trust internal API

---

### Database
- MongoDB (free tier)
- Mongoose aggregates  
  https://mongoosejs.com/docs/api/aggregate.html
- DynamoDB allowed if justified

---

### Models
- User, example: 
  https://github.com/CuriosityAHumanSuperpower/LikEat-backend/blob/main/models/User.js. Provide better solution if there is.
- Image
- Collection: FILL INFORMAITON FROM PROMT_DRAFT.TXT
- Person
- Tags

Indexes:
- (ownerId + hash)
- text
- geo

---

### Middleware
- Auth / Authorization, example: 
  https://github.com/CuriosityAHumanSuperpower/LikEat-backend/blob/main/middlewares/authorization.js. Provide better solution if there is. 
- Async error handling, example: 
  https://github.com/CuriosityAHumanSuperpower/LikEat-backend/blob/main/middlewares/catchAsync.js. Provide better solution if there is. 

---

### Face Recognition
- Local PC or remote VM
- Auto-detection
- Settings UI indicator
- Python example project  
  https://github.com/CuriosityAHumanSuperpower/person-recognition-on-pictures. Provide better solution if there is.

---

## NON-FUNCTIONAL REQUIREMENTS

- Performance budgets
- Memory caps
- Accessibility (ARIA)

---

## OPEN QUESTIONS (REFLECTION PHASE)

- Desktop single-click execution
- Folder vs DB consistency
- Duplicate detection
- Large folder virtualization
- pCloud integration  
  https://docs.pcloud.com/
- Commercialization & GDPR

