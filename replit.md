# Fé em Jesus BR - Christian Devotional App

## Overview

Fé em Jesus BR is a Progressive Web App (PWA) built for Brazilian Christians to engage with daily devotionals, Bible verses, and prayer tracking. The application provides a mobile-first experience with offline capabilities through service worker implementation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a full-stack TypeScript architecture with clear separation between client and server components:

- **Frontend**: React with TypeScript, using Vite for development and build
- **Backend**: Express.js with TypeScript 
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Authentication**: Simple email/password authentication with localStorage persistence

## Key Components

### Frontend Architecture
- **Framework**: React 18 with TypeScript and JSX
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: shadcn/ui built on Radix UI primitives
- **Styling**: Tailwind CSS with custom Christian-themed color palette (divine blue and golden accents)
- **Build Tool**: Vite with hot module replacement for development
- **PWA Features**: Service worker for offline functionality and app-like experience

### Backend Architecture
- **Server**: Express.js with TypeScript
- **API Design**: RESTful endpoints under `/api` prefix
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Storage**: Abstracted storage interface with in-memory implementation for development
- **Error Handling**: Centralized error middleware with structured responses

### Authentication System
- Simple email/password authentication
- JWT-less approach using session-based authentication
- User roles (regular user vs admin)
- localStorage for client-side session persistence
- Protected routes with AuthGuard component

### Database Schema
The application uses four main entities:
- **Users**: Authentication and user management
- **Devotionals**: Daily spiritual content with title, content, verse, and date
- **Verses**: Bible verses with book, chapter, verse references
- **Prayers**: User prayer requests and tracking

## Data Flow

1. **Authentication Flow**: Users register/login → credentials validated → user data stored in localStorage → protected routes accessible
2. **Content Delivery**: API endpoints serve devotionals, verses, and prayer data → React Query manages caching and synchronization
3. **Prayer Tracking**: Users submit prayers → stored with user association → statistics calculated for admin dashboard
4. **Admin Management**: Admin users access additional endpoints for content management and user statistics

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React, React DOM, React Hook Form with Zod validation
- **UI Framework**: Radix UI primitives, Lucide React icons
- **Database**: Neon serverless PostgreSQL, Drizzle ORM
- **Utilities**: date-fns for date handling, clsx and tailwind-merge for styling
- **Development**: Vite, TypeScript, ESBuild for production builds

### PWA Features
- Service worker registration for offline capability
- Web app manifest for mobile installation
- Responsive design optimized for mobile devices
- Bottom navigation for mobile-first experience

## Deployment Strategy

The application is designed for cloud deployment with the following characteristics:

- **Development**: Vite dev server with Express API
- **Production**: Static React build served by Express with API routes
- **Database**: PostgreSQL (configured for Neon serverless but compatible with any PostgreSQL instance)
- **Environment**: Uses DATABASE_URL environment variable for database connection
- **Build Process**: Vite builds the client, ESBuild bundles the server
- **Serving**: Express serves both static files and API endpoints

The architecture supports both development and production environments with proper environment-based configuration. The application can be easily deployed to platforms like Heroku, Vercel, or any Node.js hosting service that supports PostgreSQL databases.