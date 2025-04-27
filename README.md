📚 Fullstack App Documentation
🛠️ Project Stack
This project is a fullstack web application using Next.js for the frontend and Express.js for the backend.
It is built to be scalable, secure, and developer-friendly.

🧩 Frontend Dependencies (Next.js)

Package	Why It’s Used	Alternatives	Why This One Wins
next	Framework for React with SSR, SSG, API routes, and optimized performance.	Create React App, Vite	Next.js is production-grade and battle-tested for SEO and large apps.
react	UI library for building interactive UIs.	Vue, Angular	Most flexible and has massive ecosystem/support.
react-dom	Connects React to the DOM.	N/A	Official, needed for React apps.
axios	Promise-based HTTP client for API calls.	Fetch API, Superagent	Axios has better error handling, interceptors, and built-in features.
zod	Runtime validation for inputs and API responses.	Yup, Joi	Zod is faster, typesafe by default, and better with TypeScript.
react-hot-toast	Beautiful, lightweight toast notifications.	Notistack, React-Toastify	Simpler and cleaner UI, minimal footprint.
Dev Packages

Package	Why It’s Used
typescript	Static typing for better development and production quality.
eslint, eslint-config-next	Enforce clean, consistent code.
tailwindcss, postcss, @tailwindcss/postcss	Utility-first CSS framework for rapid and responsive UI development.
@types/*	TypeScript support for Node and React packages.
🛠️ Backend Dependencies (Express.js)

Package	Why It’s Used	Alternatives	Why This One Wins
express	Lightweight, unopinionated server framework.	Fastify, Koa	Express is the most popular, well-documented, and has the biggest ecosystem.
cors	Enable CORS to allow frontend/backend communication.	Custom middleware	Simple and reliable standard solution.
cookie-parser	Parse HTTP cookies easily.	Manually parsing headers	This package is battle-tested and safer.
express-session	Manage server-side sessions.	JWT-only auth	Sessions are safer for sensitive actions (optionally with Redis).
express-validator	Validate and sanitize user input.	Joi, Celebrate	Lightweight, native Express middleware.
passport + passport-local + passport-jwt	Handle authentication (session + JWT).	Auth0, Firebase Auth	Passport is flexible and supports both session-based and token-based auth easily.
bcryptjs	Secure password hashing and comparison.	argon2, crypto	bcrypt is the industry standard for password hashing.
dotenv	Load environment variables safely.	N/A	Secure and standard practice.
express-rate-limit	Rate-limiting to prevent DDoS and brute force attacks.	Helmet (partial protection)	Fine-grained control over request limits.
@prisma/client + prisma	Database ORM for type-safe queries and migrations.	Sequelize, TypeORM, Drizzle	Prisma is cleaner, faster, typesafe by default, and easier to maintain.
Dev Packages

Package	Why It’s Used
nodemon	Auto-restarts server on file changes during development.
prisma	ORM toolkit for migrations, seeding, and schema management.
🚦 API Routes Documentation
🛡️ IMPORTANT: ADMIN SECTION
🚨 The Admin Routes (/admin/...) were specifically added to greatly simplify the setup and testing process.
This allows admins to create hospitals, services, and time slots quickly without manually inserting records into the database.

✅ Why?

Makes real-world testing and QA much smoother.

Allows simulation of a full booking flow without DB seeding.

Admins can dynamically set up environments based on need.

This massively improves developer velocity and testing realism.

Method	Route	Description	Middleware
POST	/register	Register a new user.	-
POST	/login	Authenticate user and issue JWT token.	-
POST	/refreshToken	Issue a new JWT token using refresh token.	
POST	/admin/hospital	Create a new hospital record.	authMiddleware, isAdminMiddleware
POST	/admin/service	Create a new service record linked to a hospital.	authMiddleware, isAdminMiddleware
POST	/admin/timeslot	Create a new time slot for services.	authMiddleware, isAdminMiddleware
GET	/hospitals	Retrieve all available hospitals.	authMiddleware
GET	/services/:hospitalId	Get services and available slots for a specific hospital.	authMiddleware
POST	/book/:serviceId/:timeSlotId	Book an appointment for a service at a specific time.	authMiddleware
Global Middleware
Rate Limiting:
express-rate-limit is used globally — 100 requests per 15 minutes per IP to protect the API from abuse.

Route Protections
authMiddleware: Validates user JWT and attaches user info to request.

isAdminMiddleware: Ensures only admin users can access admin-specific endpoints.

🧠 Why This Architecture?
✅ Security-first: Proper authentication, validation, and rate-limiting.
✅ Scalable: Prisma ORM, modular controllers/middleware, Next.js rendering options.
✅ Developer Experience: TypeScript, Prisma, ESLint, auto-reloads, clean API contracts.
✅ Performance: Tailwind for fast frontend loading, Express optimized for backend APIs.

🚀 Final Thoughts
Every technology and package is hand-picked to:

Stay modern and future-proof (Next.js 15, Express 5, Prisma 6, React 19).

Offer the best balance between flexibility and structure.

Keep the app easy to maintain and extend even as complexity grows.
