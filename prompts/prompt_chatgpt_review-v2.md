# IMAGE MANAGER APPLICATION — MASTER PROMPT

## GLOBAL RULES

- Be factual, professional, and direct
- No compliments or filler
- Always argue choices: why this instead of that
- Take examples, URLs, or references into account and challenge them
- Use Node.js ESM (`.mjs`) on front-end and back-end
- Balance performance, security, maintainability, mainstream practices
- Comment code only when logic is non-trivial
- Explicitly say when a requirement is unrealistic or unsafe
- Analyze existing `index.html` first because it is the base of this project
- Ensure all third-party dependencies are documented and justified

---

## PHASE 0 — PRELIMINARY ANALYSIS

### Objectives
- Analyze existing `index.html`
- Identify reusable vs replaceable elements
- Decide if a build step (Vite / ESBuild) is required
- Review `faces_recognition.py` for face detection logic

### Deliverable
- react front end app or next.js if more relevant (your choice, to be argumented)
- express.js back end app
- a markdown describing reflexions, choices and roadmap
- Updated `faces_recognition.py` with improvements (error handling, performance optimizations) 

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
- React front-end 
- Starting from `index.html` (no server, limited)
- Component-based architecture
- Lazy loading on scroll
- Optional unloading of off-screen images
- Themes: dark, light, system, emerald green
- All action button appearance : round icon button  
  https://icons.getbootstrap.com/icons/three-dots-vertical/

---

### Functionalities
- File-explorer keyboard navigation
- Context menus (right-click / long-press)
- Move-to modal with folder tree
- Rotation (local if possible, DB otherwise)
- Tag CRUD
- Drag & drop import (copy locally if applicable)

---

### Design
- Icons only (rather than emoji) and text
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
    - Home/images
    - People
    - Map
    - Settings
    - Admin
- Stucked on the right:
    - Auth (sign in/up or log out)
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
- DynamoDB allowed if justified by you (LLM)

---

### Models
- User, example: 
  https://github.com/CuriosityAHumanSuperpower/LikEat-backend/blob/main/models/User.js. Provide better solution if there is.
- Image
- Collection = folder root + associated settings
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
  https://github.com/CuriosityAHumanSuperpower/person-recognition-on-pictures
  - private github folder : see `attachement>faces_recognition.py`
  - python package 'face_recognition'
  - Provide better solution if there is.
- Face recognition should be handled on the backend.
- Replace the JSON database with MongoDB for storing face recognition data.
- Store detected faces in a dedicated folder at the root if run locally or on pCloud, not on the backend or frontend server.

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

## EXTENDED REQUIREMENTS AND DETAILS

### FRONTEND — DETAILED FUNCTIONALITY

#### Keyboard Navigation (Explorer-like)
- Ctrl+A: select all
- Esc: clear selection
- Ctrl+C: copy selection (logical copy, not OS if unavailable)
- Shift + click: range selection
- Ctrl + click: toggle selection
- Mac equivalents must be implemented if specific configuration required

#### Context Actions
Available via:
- Right click (desktop)
- Long press (mobile)
- Round “three dots” icon on image or folder
  - visible, on PC, on image hovering
  - visible, on mobile, ~transparent 

Actions on folder section of images selection:
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

#### Home/Images 
- Load last opened folder from DB
- If unavailable:
  > “No images loaded. Use the picker to select images. Works offline and runs from this file.”
- Prompt to:
  - Create collection
  - Configure settings
- Once the folder content has been load, display images as in `index.html`
- sidebar overcanvas to go through folder tree as in `index.html`

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
    - Ask to run in background, if app run locally, else on dedicated VM
    - CPU/RAM throttling strategy must be explained

#### People
- Display detected faces (rounded images everywhere)
- Editable names with backend autocomplete (max 5 suggestions)
- Generic actions:
  - Show images
  - Rename
  - Delete
- One person ↔ multiple faces, display one representative image, the one with better resolution by default
  - allow user to pick one
- URL update with personId + slug
- specific page for one person selected (URL or cliked): 
  - Jumbotron:
    - Main face
    - Editable name
    - Image count
  - main section : Folder section and images listed as in Home/images

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
- Auto-dismiss after ~10 seconds (otherwise justify recommendation)

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
- Recommendation: Use environment variables with a secure vault (e.g., AWS Secrets Manager, HashiCorp Vault) for production deployments.

---

### DATABASE — DEEPER ANALYSIS

#### Choice Reflection
- MongoDB preferred (free tier, ecosystem, aggregation)
- DynamoDB or other db acceptable if justified

#### Models (Mandatory Fields)

Non exautive lists bellow. 
Please add all other relevant fields and explain why (securty, perf, project relevant, etc.).

**User**
- email
- passwordHash
- roles (admin / user)
- MFA config
- Google SSO IDs
- tokenVersion (jwt)
- isActive

**Image**
- id
- hash (image uniqueness)
- paths[]
- metadata
- GPS
- faces[{personId, x/y position on the image}]
- ownerId
- timestamps
- imageExtension
- tagsID[]

**Collection**
- id
- ownerId
- mainFolder
- settings

**Person**
- id
- name
- isMe : true, if the person is the current user. 
- imageIds[]

**Tags**
- id
- name
- createdBy : userID

Indexes:
- compound (ownerId + hash)
- text (name, folder, filename)
- geo (GPS)

Auth:
- JWT
- Short-lived access token
- Refresh rotation OR token versioning (to be justify by you/LLM)

Relationships:
- Person ↔ Image: many-to-many (to be justify by you/LLM)
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
- API documentation using Swagger or similar tools

---

### SEARCH
- MongoDB Atlas Search
- Autocomplete
- Fuzzy maxEdits: 2
- Targets:
  - person
  - user
  - tag
  - folder
  - image filename

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
- Optimize face recognition performance for large image collections

---

## TESTING
- Provide tests, either code or markdown, such as: 
  - Unit tests for individual components and functions
  - Integration tests for API endpoints and database interactions
  - End-to-end tests for user flows (e.g., image upload, face recognition)
- Use testing frameworks like Jest for React and Mocha/Chai for Express.js

---

## EXTENDED OPEN QUESTIONS
- Desktop single-click (Electron / Tauri)
  - At first, the app (frontend and backend) should be executable locally and on a web hoster that can run Node.js (free tier); no Docker so far.
  - Future consideration: Electron or Tauri for desktop packaging.
- Folder ↔ DB divergence handling
  - Strategy for syncing file system changes with the database.
- Duplicate reconciliation
  - Detect and handle duplicate images based on hash or metadata.
- Large-folder virtualization
  - Implement lazy loading and pagination for large image collections.
- pCloud integration
- Monetization:
  - payments
  - accounts
  - security
  - GDPR automation
  - SEO
  - naming

---
