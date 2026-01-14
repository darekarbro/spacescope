/**
 * README - Project Structure Guide
 * 
 * SpaceScope Frontend - Next.js 13+ App Router
 * 
 * FOLDER ORGANIZATION:
 * 
 * /app                  - Next.js pages & routing
 *   /(auth)             - Login/Signup pages (shared layout)
 *   /(public)           - Public pages (Events, Weather, etc)
 *   /admin              - Admin-only pages
 *   /scientist          - Scientist-only pages
 * 
 * /components           - Reusable React components
 *   /ui                 - Basic UI components (Button, Card, Input, etc)
 *   /charts             - Data visualization
 *   /maps               - Map components
 *   /layout             - Navbar, Footer, Sidebar
 *   /shared             - Shared components across features
 * 
 * /lib                  - Utility functions
 *   /api                - API client & endpoints
 *   /services           - Data fetching & transformation
 *   constants.ts        - App-wide constants
 *   utils.ts            - Helper functions
 * 
 * /types                - TypeScript interfaces
 * /context              - React Context providers (Auth)
 * /stores               - State management (Zustand)
 * /hooks                - Custom React hooks
 * 
 * GETTING STARTED:
 * 
 * 1. Install dependencies:
 *    npm install
 * 
 * 2. Set up environment variables (.env.local):
 *    NEXT_PUBLIC_API_URL=http://localhost:8000
 *    NEXT_PUBLIC_NASA_API_KEY=your_key_here
 * 
 * 3. Run development server:
 *    npm run dev
 * 
 * 4. Open http://localhost:3000
 * 
 * KEY FEATURES:
 * ✅ Type-safe API calls with endpoints contract
 * ✅ Service layer for data transformation
 * ✅ Auth context with role-based routing
 * ✅ Protected admin/scientist pages
 * ✅ Reusable UI component library
 * ✅ Error handling & loading states
 * ✅ Tailwind CSS styling
 * 
 * API INTEGRATION:
 * - All API calls go through /lib/api/client.ts
 * - Endpoint contracts in /lib/api/endpoints.ts
 * - Data services in /lib/services/
 * - Custom hooks in /hooks/ for common patterns
 * 
 * DEVELOPMENT WORKFLOW:
 * 1. Define types in /types
 * 2. Add API endpoints in /lib/api/endpoints.ts
 * 3. Create service methods in /lib/services/
 * 4. Build components in /components
 * 5. Create pages in /app with routing
 * 
 * This structure ensures:
 * - Clean separation of concerns
 * - Easy to test & maintain
 * - Scalable for 12-hour hackathon sprint
 * - Professional code organization for judges
 */
