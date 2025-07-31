# Fé em Jesus BR - Christian Devotional App

## Overview
Fé em Jesus BR is a comprehensive Progressive Web App (PWA) for Brazilian Christians, offering 10 advanced spiritual features. It provides daily devotionals, emotion-based guidance, spiritual challenges, AI-powered prayer assistance, shareable love cards, prayer requests, audio devotionals, and a mini Christian library. The application aims to provide daily inspiration and spiritual growth, supporting users through various life situations with a mobile-first experience, including night mode and a sponsor support system. The business vision is to become a leading digital spiritual resource, leveraging technology to foster faith and community.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture
The application features a full-stack TypeScript architecture with distinct client and server components.

### Core Technologies
- **Frontend**: React with TypeScript, Vite for development and build.
- **Backend**: Express.js with TypeScript.
- **Database**: PostgreSQL with Drizzle ORM for type-safe operations.
- **Styling**: Tailwind CSS with shadcn/ui component library.
- **State Management**: TanStack Query for server state management.
- **Authentication**: Simple email/password authentication using localStorage.

### Frontend Architecture
- **Framework**: React 18 with TypeScript and JSX.
- **Routing**: Wouter for lightweight client-side routing.
- **UI Components**: shadcn/ui built on Radix UI primitives.
- **Styling**: Tailwind CSS with a Christian-themed color palette (divine blue and golden accents), and a modern design inspired by Base44 for dashboard, AI chat, store, library, and video sections.
- **Build Tool**: Vite with hot module replacement.
- **PWA Features**: Service worker for offline functionality and app-like experience, including PWA installation hook.
- **Visual Enhancements**: Animated greetings, motivational messages, responsive design, and hover animations.

### Backend Architecture
- **Server**: Express.js with TypeScript.
- **API Design**: RESTful endpoints under `/api` prefix.
- **Database ORM**: Drizzle ORM with PostgreSQL dialect.
- **Storage**: Abstracted storage interface.
- **Error Handling**: Centralized error middleware.

### Authentication System
- Simple email/password authentication.
- Session-based authentication (JWT-less).
- User roles (regular user vs. admin).
- localStorage for client-side session persistence.
- Protected routes with AuthGuard component.

### Database Schema
The application uses an extended schema with twenty-five main entities, covering user management, content (devotionals, verses, library, YouTube videos), interactive features (prayers, emotions, challenges, AI requests, love cards), and administrative functions (sponsors, contributions, points, notifications, store products).

### Key Features
1.  **Emotion-Based Devotionals ("Sinto Hoje")**: AI-generated personalized devotionals based on user's emotional state.
2.  **Spiritual Challenges**: 7 and 21-day programs with daily content, progress tracking, and certificates.
3.  **AI Prayer Agent**: Conversational AI for personalized prayers and biblical encouragement.
4.  **Love Cards Gallery**: Shareable inspirational cards with WhatsApp integration and image download.
5.  **Prayer Request System**: Submit prayer needs and receive AI-generated personalized responses.
6.  **Mini Christian Library**: Organized categories of spiritual growth content.
7.  **Audio Devotionals**: Spoken devotional content.
8.  **Night Mode**: Automatic activation after 21h with a dark theme.
9.  **Sponsor System**: Partner ministry support with certificate generation, rotating ads, and a dedicated sponsor display.
10. **Complete Admin Panel**: Full CRUD operations for all content types, user management, content moderation, analytics, and system monitoring.
11. **User Contributions System**: Feedback, suggestions, and testimonials with admin review workflow.
12. **Offline Caching System**: localStorage/IndexedDB integration for verses and app content.
13. **Push Notifications**: Real-time notifications with customizable user preferences.
14. **Virtual Christian Store**: E-commerce integration with affiliate products, categories, search, filters, and external purchase links.
15. **YouTube Channel Integration**: Video gallery for @faithinjesusbr channel with categories, search, and metadata.
16. **Offline Certificate Generator**: System that generates personalized certificates with prayers and Bible verses, working entirely offline.

## External Dependencies

### Core Dependencies
-   **React Ecosystem**: React, React DOM, React Hook Form with Zod validation.
-   **UI Framework**: Radix UI primitives, Lucide React icons.
-   **Database**: Neon serverless PostgreSQL, Drizzle ORM.
-   **Utilities**: date-fns for date handling, clsx and tailwind-merge for styling.
-   **Development**: Vite, TypeScript, ESBuild for production builds.

### PWA Features
-   Service worker registration for offline capability.
-   Web app manifest for mobile installation.

### AI and Content APIs
-   **Bible-API.com**: For Bible verses.
-   **GetBible.net**: For Bible verses.
-   **HuggingFace Free AI**: `lorrabomfim/biblia-em-portugues` for Portuguese Christian responses.

### Payment & Affiliate (Conceptual)
-   Integration points for external purchase links in the virtual store.

### Video Integration
-   YouTube API for embedding and managing video content.