# Buyer Lead Intake App

A Next.js application for managing buyer leads with modern web technologies.

## Stack

- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **Database:** SQLite with Drizzle ORM
- **Validation:** Zod (client + server)
- **Styling:** Tailwind CSS
- **Forms:** React Hook Form

## User Permissions & Ownership

### How Users Know Which Buyers They Can Edit

**Current User Information:**
- Your user ID is displayed in the sticky header: `user-demo-1`
- Name: Demo User
- Role: Agent

**Ownership Rules:**
- **Edit/Delete**: You can only modify buyers where `ownerId` matches your user ID
- **View**: You can view all buyers in the system
- **Cannot Edit**: For buyers with different owner IDs, you see "Read-only" instead of "Edit"

**Visual Indicators:**
-  **"Yours" badge**: Next to buyer names you own
-  **Status dropdown**: Only available for your buyers
-  **Edit button**: Only shows for buyers you own
-  **Grayed out**: Non-owned buyers appear with reduced opacity

### In Production Applications:
Replace the mock user (`user-demo-1`) with real authentication system (NextAuth.js, Clerk, etc.)

## Features Implemented

###  Core Functionality
- **Create Lead Form** (`/buyers/new`)
  - Conditional fields (BHK for residential properties)
  - Client-side validation with React Hook Form
  - Server-side validation with Zod
  - Form state management and error handling

- **Expanded Edit Form** (`/buyers/[id]`)
  - All relevant buyer fields are editable
  - Conditional fields (BHK for residential properties)
  - Client-side validation with React Hook Form
  - Server-side validation with Zod
  - Form state management and error handling

- **Delete Buyer Functionality** (`/buyers/[id]`)
  - Client-side confirmation dialog
  - Server-side deletion via API

- **Database Schema**
  - Buyers table with all required fields
  - Buyer history table prepared
  - SQLite with custom UUID generation
  - Proper constraints and data types

- **API Layer**
  - POST `/api/buyers` - Create buyer endpoint
  - GET `/api/buyers` - List buyers with filtering, pagination
  - Ownership enforcement (ownerId filtering)
  - Search functionality (partial)
  - GET `/api/buyers/[id]` - Get single buyer endpoint
  - PUT `/api/buyers/[id]` - Update buyer endpoint
  - DELETE `/api/buyers/[id]` - Delete buyer endpoint
  - GET `/api/buyers/export` - Export buyers to CSV
  - POST `/api/buyers/import` - Import buyers from CSV

- **CSV Export Page** (`/buyers/export`)
  - Client Component for interactive download

- **Validation & Safety**
  - Zod schemas for all buyer data
  - Email/phone format validation
  - Budget min <= max validation
  - BHK requirement for residential types
  - Database-level constraints

###  Architecture Quality
- **Type Safety:** Full TypeScript coverage
- **SSR Ready:** Server-side data operations
- **Scalable Structure:** Modular components and utilities

## Setup & Installation

### Prerequisites
- Node.js 18+ 
- npm

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/SandeepGKP/Buyer-App.git
   cd Buyer-App
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Database Setup**
   ```bash
   npx drizzle-kit push  # Creates tables in SQLite
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Access the Application**
   - Open [http://localhost:3000](http://localhost:3000)
   - Navigate to `/buyers/new` to create leads
   - API endpoint: `/api/buyers`

### Environment Variables
Create `.env.local`:
```env
# Add any custom env vars here
# Database is SQLite (file-based)
```

## Design Decisions & Notes

### Data Model
- **buyers** table with comprehensive field mapping
- **buyer_history** prepared for change tracking
- UUID primary keys for scalability
- JSON fields for flexible data (tags)
- SQLite chosen for simplicity (can easily switch to PostgreSQL)

### Validation Strategy
- **Client-side:** React Hook Form with user feedback
- **Server-side:** Zod validation with detailed error messages
- **Database:** Drizzle constraints and foreign keys

### Ownership & Authorization
- Simple ownerId approach implemented
- Current demo uses fixed owner ID 'demo-user-id'
- Ready for auth integration (database prepared for users/sessions)

### Search & Filtering
- Basic search by fullName (partial)
- URL-based filters for city, propertyType, status, timeline (partial)
- Pagination with adjustable page size (partial)
- SSR query optimization

### UI/UX Patterns
- Conditional form fields based on property type
- Accessible form labels and error states
- Responsive design with Tailwind
- Loading states and error feedback

## What's Done 

- Complete form with conditional logic
- Database schema with relations
- API endpoints for CRUD operations
- Client + server validation
- Ownership enforcement
- Search and filtering (partial)
- TypeScript type safety
- SSR-ready architecture
- **Full List Page** (`/buyers`): Table view with columns, sorting
- **Edit/View Buyer**: Individual buyer pages
- **CSV Import/Export**: File upload and processing

## Planned but Not Implemented ⏳

- **Buyer History**: Change tracking UI
- **Authentication**: Magic link or demo login
- **Advanced Search**: Full-text search on notes, email
- **Rate Limiting**: API protection
- **Unit Tests**: Test coverage
- **Pagination UI**: Interactive pagination component

## Database Migration

```bash
npx drizzle-kit generate  # Generate migrations
npx drizzle-kit push      # Apply migrations
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── buyers/
│   │   │   ├── [id]/route.ts   # API for single buyer (GET, PUT, DELETE)
│   │   │   ├── export/route.ts # API for exporting buyers
│   │   │   ├── import/route.ts # API for importing buyers
│   │   │   └── route.ts        # API for listing/creating buyers (GET, POST)
│   │   └── globals.css         # Global styles
│   ├── buyers/
│   │   ├── [id]/page.tsx       # Individual buyer view/edit page
│   │   ├── export/page.tsx     # Buyer export page
│   │   ├── import/page.tsx     # Buyer import page
│   │   ├── new/page.tsx        # Create new buyer form page
│   │   └── page.tsx            # Buyers list page
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
├── components/
│   └── Header.tsx              # Application header
└── lib/
    ├── auth.ts                 # Authentication utilities
    ├── db.ts                   # Database connection
    ├── schema.ts               # Drizzle schemas
    └── zod.ts                  # Validation schemas
├── __tests__/
│   └── csv-test.ts             # CSV related tests
├── public/                     # Static assets
├── drizzle.config.ts           # Drizzle ORM configuration
├── jest.config.js              # Jest test configuration
├── next.config.ts              # Next.js configuration
├── package.json                # Project dependencies and scripts
├── postcss.config.mjs          # PostCSS configuration
└── tsconfig.json               # TypeScript configuration
```

## Contributing

1. Follow TypeScript strict mode
2. Maintain form validation patterns
3. Use SSR where possible for performance
4. Test API endpoints thoroughly
