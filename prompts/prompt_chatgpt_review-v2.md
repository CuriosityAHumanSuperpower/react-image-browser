# IMAGE MANAGER APPLICATION — MASTER PROMPT (v2)

This document is a **complete, autonomous, and production-grade prompt**.
It integrates **all missing requirements, constraints, and reflections** from `prompt_draft.txt`
into the reviewed and structured version.

---

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



---

## EXTENDED REQUIREMENTS AND DETAILS (INTEGRATED FROM DRAFT)

### FRONTEND — DETAILED FUNCTIONALITY

#### Keyboard Navigation (Explorer-like)
- Ctrl+A: select all
- Esc: clear selection
- Ctrl+C: copy selection (logical copy, not OS if unavailable)
- Shift + click: range selection
- Ctrl + click: toggle selection
- Mac equivalents must be documented

#### Context Actions
Available via:
- Right click (desktop)
- Long press (mobile)
- Round “three dots” icon on image or folder

Actions:
- Download
- Copy
- Add images (drag & drop)
- Move to:
  - Modal with:
    - Selected image recap
    - Folder tree navigation
    - Destination selection

#### Image Actions
- Rotate image:
  - Apply directly to local file if permissions allow
  - Otherwise persist rotation metadata in DB
- Tags:
  - Create / delete
  - Apply to one or many images
- Never auto-download local images if OS copy is impossible

---

### IMAGE MODAL — EXTENSIONS
- Lateral info panel toggle (round list icon)
- Panel visibility preference persisted in DB (global user setting)
- Metadata:
  - name, path
  - creation / modification dates
  - format
  - GPS (lat/lng)
- Map preview:
  - Click → redirect to map page
- Face recognition:
  - Rounded thumbnails
  - Click → filter by person
  - Display all related images

---

### PAGES — COMPLETE SPECIFICATION

#### Home
- Load last opened folder from DB
- If unavailable:
  > “No images loaded. Use the picker to select images. Works offline and runs from this file.”
- Prompt to:
  - Create collection
  - Configure settings

#### Settings
- User info
- Security (danger zone, red):
  - Delete collection
  - Delete DB
  - Delete account
- Auth:
  - Password reset
  - Google SSO
  - MFA:
    - Password + OTP
    - Generate 10 recovery OTPs
    - Show once only
    - Copy-to-clipboard
- Collection settings:
  - HEIC handling:
    - Placeholder
    - Frontend conversion attempt
    - Auto convert to JPG in `./heic-to-jpg`
  - Current folder mapping (browse & update)
  - Face recognition:
    - Ask to run in background
    - CPU/RAM throttling strategy must be explained

#### People
- Display detected faces (rounded images everywhere)
- Editable names with backend autocomplete (max 5 suggestions)
- Generic actions:
  - Show images
  - Rename
  - Delete
- One person ↔ multiple faces, display one representative image
- URL update with personId + slug
- Jumbotron:
  - Main face
  - Editable name
  - Image count
  - Folder → image listing

#### Map
- All geo-tagged images
- Zoom / unzoom
- Click point:
  - Split screen:
    - Right: map
    - Left: images in area
- Same image actions as elsewhere

#### Auth Pages
- Sign in / up (dedicated pages)
- Sign off only in navbar

#### Admin
- Admin-only
- Table:
  - User
  - Creation date
  - Active status
- Actions:
  - Disable
  - Delete
  - Reset password

---

### NOTIFICATIONS
- react-bootstrap Toasts
- Top-right
- Pale colors only (green / orange / red)
- Close button
- Auto-dismiss after ~10 seconds (justify recommendation)

---

## BACKEND — COMPLETION

### Security
- rate-limit
- helmet
- xss-clean
- hpp
- CSP headers
- CSRF if cookies
- Argon2
- Encrypted DB at rest
- Zero-trust API (even Electron)

Sensitive config:
- No dotenv in production
- Use OS keychain / encrypted config file / Electron secure store

---

### DATABASE — DEEPER ANALYSIS

#### Choice Reflection
- MongoDB preferred (free tier, ecosystem, aggregation)
- GraphQL pros/cons explained (over-fetching vs attack surface)
- DynamoDB acceptable if justified

#### Models (Mandatory Fields)

**User**
- email
- passwordHash
- roles (admin / user)
- MFA config
- Google SSO IDs
- tokenVersion

**Image**
- id
- hash (unique)
- paths[]
- metadata
- GPS
- faces (personId + x/y)
- ownerId
- sharedWith[]
- timestamps

**Collection**
- id
- ownerId
- mainFolder
- settings

**Person**
- id
- name
- ownerId
- imageIds[]

**Tags**
- id
- name
- ownerId

Indexes:
- compound (ownerId + hash)
- text (name, folder, filename)
- geo (GPS)

Auth:
- JWT
- Short-lived access token
- Refresh rotation OR token versioning (justify)

Relationships:
- Person ↔ Image: many-to-many (justify)
- Index strategy explained

---

### ROUTES & CONTROLLERS
- Single route config object
- CRUD:
  - user
  - image
  - collection
  - tag
- Auth
- Admin
- Aggregation for image queries

---

### SEARCH
- MongoDB Atlas Search
- Autocomplete
- Fuzzy maxEdits: 2
- Targets:
  - person
  - user
  - folder
  - filename

---

### FACE RECOGNITION
- Local execution if desktop
- Remote VM fallback:
  - SSH
  - IP config
  - Resource limits
- UI indicator (local vs VM)
- Faces stored locally or pCloud
- Review provided Python repo and propose better approach

---

## EXTENDED OPEN QUESTIONS
- Desktop single-click (Electron / Tauri)
- Folder ↔ DB divergence handling
- Duplicate reconciliation
- Large-folder virtualization
- pCloud integration
- Monetization:
  - payments
  - accounts
  - security
  - GDPR automation
  - SEO
  - naming

---
