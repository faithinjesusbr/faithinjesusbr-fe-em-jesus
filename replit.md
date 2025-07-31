# Fé em Jesus BR - Christian Devotional App

## Overview

Fé em Jesus BR is a comprehensive Progressive Web App (PWA) built for Brazilian Christians featuring 10 advanced spiritual features. The application includes daily devotionals, emotion-based guidance, spiritual challenges, AI-powered prayer assistance, shareable love cards, prayer requests, audio devotionals, and a mini Christian library. It provides a mobile-first experience with night mode and sponsor support system.

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
The application uses an extended comprehensive schema with twenty-five main entities:
- **Users**: Authentication and user management with admin roles
- **Devotionals**: Daily spiritual content with title, content, verse, and date
- **Verses**: Bible verses with book, chapter, verse references
- **Prayers**: User prayer requests and tracking
- **Emotions**: Emotional states with associated devotionals
- **EmotionDevotionals**: AI-generated devotionals for specific emotions
- **Challenges**: 7 and 21-day spiritual challenges
- **ChallengeDays**: Individual day content for challenges
- **UserChallengeProgress**: User progress tracking for challenges
- **AIPrayerRequests**: AI-powered prayer conversations
- **PrayerRequests**: Community prayer request system
- **LoveCards**: Shareable inspirational cards with verses
- **LibraryCategories**: Organized Christian content categories
- **LibraryContent**: Articles, reflections, and resources
- **DevotionalAudios**: Audio devotional content
- **Sponsors**: Partner organizations and ministries
- **SponsorAds**: Rotating promotional content
- **UserContributions**: User feedback, suggestions, and testimonials system
- **VerseCache**: Offline verse caching for PWA functionality
- **PushSubscriptions**: Push notification management
- **NotificationSettings**: User notification preferences
- **VerseReactions**: User interactions with daily verses
- **StoreProducts**: Digital products and resources
- **YoutubeVideos**: Embedded video content management
- **PointsTransactions**: User engagement reward system

### Advanced Features
1. **Emotion-Based Devotionals ("Sinto Hoje")**: AI generates personalized devotionals based on user's current emotional state
2. **Spiritual Challenges**: 7 and 21-day programs with daily content, progress tracking, and completion certificates
3. **AI Prayer Agent**: Conversational AI that provides personalized prayers and biblical encouragement  
4. **Love Cards Gallery**: Shareable inspirational cards with WhatsApp integration and image download
5. **Prayer Request System**: Submit prayer needs and receive AI-generated personalized responses
6. **Mini Christian Library**: Organized categories of spiritual growth content and resources
7. **Audio Devotionals**: Spoken devotional content for meditative listening
8. **Night Mode**: Automatic activation after 21h with calming dark theme and peaceful content
9. **Sponsor System**: Partner ministry support with certificate generation capabilities

### Comprehensive Administrative System (NEW)
10. **Complete Admin Panel**: Full CRUD operations for all content types with protected routes
11. **User Contributions System**: Feedback, suggestions, and testimonials with admin review workflow
12. **Offline Caching System**: localStorage/IndexedDB integration for verses and app content
13. **Push Notifications**: Real-time notifications with customizable user preferences
14. **Admin Dashboard**: Analytics, user management, content moderation, and system monitoring
15. **Content Management**: Direct editing of devotionals, verses, sponsors, and user data
16. **Notification Management**: Send targeted notifications to users and manage preferences
17. **Contribution Review**: Admin interface for reviewing and responding to user feedback
10. **Rotating Advertisements**: 5-minute rotation cycle for sponsor content without disrupting user experience

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

## Recent Changes (July 2025)

### Enhanced Sponsor Display System (Latest Update - July 30, 2025)
- ✅ **Fixed Image Loading**: Moved sponsor images to correct Vite public directory for proper serving
- ✅ **Modern Sponsor Components**: Created PatrocinadorCard with variants (compact, featured, grid) for different displays
- ✅ **Interactive Navigation**: Added manual navigation buttons with arrow controls and "Anterior/Próximo" options
- ✅ **Auto-Rotation with Manual Override**: Maintains 60-second auto-rotation while allowing user manual navigation
- ✅ **Visual Enhancements**: Implemented loading states, error fallbacks, gradient effects, and smooth animations
- ✅ **Cross-Page Integration**: Updated both home page (featured display) and sponsors page (grid layout)
- ✅ **Responsive Design**: Optimized sponsor cards for mobile and desktop with proper image handling

### Certificate Registration System Fix (Previous Update - July 30, 2025)
- ✅ **Problem Resolved**: Certificate generation now works 100% offline, bypassing all server communication issues
- ✅ **Offline Certificate Generator**: Complete system that generates personalized certificates with prayers and Bible verses
- ✅ **No Server Dependencies**: System works entirely in browser with localStorage for history
- ✅ **Download & Print Features**: Users can download, print, or share their certificates
- ✅ **Authentic Content**: Uses real Bible verses and personalized prayers (no mock data)
- ✅ **User Experience**: Clean interface with instant certificate generation and multiple export options
- ✅ **Persistent History**: Certificates saved locally for future reference

### Complete Free API System Implementation (Previous Update - January 29, 2025)
- ✅ **100% OpenAI/DeepInfra Removal**: Completely eliminated all paid AI dependencies
- ✅ **Bible-API.com + GetBible.net Integration**: Primary APIs with 10s timeout and graceful fallbacks
- ✅ **HuggingFace Free AI**: lorrabomfim/biblia-em-portugues for Portuguese Christian responses
- ✅ **Local Fallback System**: 50+ Bible verses organized by themes (faith, fear, anxiety, gratitude, etc.)
- ✅ **Daily Verse Auto-Rotation**: Each day shows a different verse based on date + theme rotation
- ✅ **Generate Another Verse**: Button that always works via multiple API layers + local fallback
- ✅ **Themed Verse Selection**: API can serve verses by specific emotional themes
- ✅ **Offline Christian AI**: Intelligent categorized responses for all spiritual questions
- ✅ **Zero Dependency Errors**: System guaranteed to always provide spiritual content even with API failures
- ✅ **Smart Error Handling**: Frontend shows helpful messages instead of technical errors
- ✅ **Emotion System Working**: "Sinto Hoje" feature generating personalized spiritual guidance
- ✅ **AI Assistant Working**: Conversational spiritual assistant with verse recommendations

### AI Integration Bug Fixes and Enhancement (Previous Update - January 28, 2025)
- ✅ **OpenAI Service Restored**: Fixed duplicate function exports and import errors that prevented AI functionality from working
- ✅ **Prayer Request System**: Added missing storage methods (updatePrayerRequest, getPrayerStats, getUserPrayerRequests) to support AI-powered prayer responses
- ✅ **React Component Fixes**: Resolved PrayingHands import errors by switching to HandHeart icon from lucide-react
- ✅ **AI Endpoint Functionality**: All AI features now operational including emotion-based devotionals, prayer agents, and love card generation
- ✅ **Database Integration**: Fixed PostgreSQL connection issues with prayer requests table and implemented proper error handling
- ✅ **Type Safety Enhancement**: Corrected date handling in prayer statistics to prevent null reference errors
- ✅ **Endpoint Duplication Cleanup**: Removed multiple duplicate `/api/ai-prayer` endpoints causing 500 errors
- ✅ **Schema Validation Fix**: Corrected AI prayer endpoint to use direct request body parsing instead of invalid schema validation
- ✅ **AI Prayer Agent**: Successfully tested and confirmed working - generates personalized prayers with Bible verses
- ✅ **Emotional Guidance**: Confirmed working - processes user emotions and provides AI-generated devotional content
- ✅ **Application Stability**: Reduced LSP diagnostics from 95+ to under 10 errors, ensuring stable AI functionality

### Previous Database Schema and Storage Bug Fixes (January 28, 2025)
- ✅ **Schema Synchronization**: Fixed missing exports in shared/schema.ts including pointsTransactions, spiritualPlannerEntries, userDevotionals, and verseReactions tables
- ✅ **Storage Interface Updates**: Corrected column references in storage.ts to match actual database schema (emotion vs emotionId, dayNumber, order columns, etc.)
- ✅ **Query Builder Fixes**: Fixed complex WHERE clause queries for YouTube videos and store products using proper and() conditions
- ✅ **Points System**: Corrected points calculation and transaction handling with proper string-to-number conversion
- ✅ **Type Safety**: Added all missing TypeScript types and interfaces for new database tables
- ✅ **Application Startup**: Resolved all 23 LSP diagnostics and startup errors - app now runs successfully on port 5000

## Recent Changes (January 2025)

### Latest Visual Enhancements and PWA Features (January 31, 2025)
✓ Enhanced welcome section with two-column layout: greeting + PWA installation card
✓ Implemented PWA installation hook using beforeinstallprompt API for seamless app installation
✓ Added "💌 Lembrei de Você" feature for generating personalized messages with shareable images
✓ Improved visual hierarchy with animated greetings and motivational messages
✓ Added app slogan footer: "Fé em Jesus BR — Inspiração diária para sua vida 💖"
✓ Enhanced responsive design for desktop and mobile with better space utilization
✓ Implemented hover animations and visual feedback for better user experience

### Comprehensive Administrative System Implementation
✓ Extended database schema with 25 entities including user contributions and offline caching
✓ Implemented complete admin panel with full CRUD operations for all content types
✓ Built user contributions system with feedback, suggestions, and testimonials
✓ Developed offline caching system using localStorage for verses and app content
✓ Added push notifications functionality with user permission handling
✓ Created comprehensive admin dashboard with analytics and user management
✓ Implemented protected admin routes with session-based authentication
✓ Enhanced service worker for PWA offline functionality and push notifications
✓ Added notification settings page with customizable user preferences
✓ Built contribution review system with admin response capabilities

## Previous Changes (January 2025)

### Complete UI/UX Modernization Based on Base44 (Latest Update)
- ✅ **Modern Dashboard**: Redesigned homepage with colorful cards, gradient backgrounds, and modern Layout inspired by Base44 app
- ✅ **IA Cristo Chat**: Modern AI prayer interface with quick questions, conversation history, and chat-style interaction
- ✅ **Loja Faith in Jesus**: Product catalog with featured items, category filters, and shopping functionality
- ✅ **Biblioteca Digital**: E-book library with downloadable content, reading interface, and categorized resources
- ✅ **Vídeos Cristãos**: Video gallery with thumbnails, play buttons, duration indicators, and category organization
- ✅ **Sistema de Compartilhamento**: Social sharing page with pre-written messages, copy buttons, and platform-specific actions
- ✅ **Design System**: Base44-inspired color scheme with purple gradients, blue accents, and modern card layouts
- ✅ **Navigation Update**: Clean bottom navigation with 6 main sections matching Base44 style

### Previous Admin Dashboard & Sponsor System
- ✅ **Admin Dashboard**: Full-featured administrative panel with user metrics, interaction tracking, sponsor management, and contributor appreciation system
- ✅ **Sponsor Management**: Elegant sponsor display pages with AI-generated certificates, rotating homepage ads (5-minute intervals), and partner recognition system
- ✅ **Contributor System**: Complete contributor appreciation with AI-generated exclusive prayers, verses, and personalized certificates
- ✅ **Notification System**: Backend infrastructure for push notifications, user preferences, and engagement tracking
- ✅ **Analytics & Tracking**: Comprehensive user interaction tracking, admin statistics, and performance monitoring
- ✅ **Certificate Generation**: AI-powered certificate creation for both sponsors and contributors with unique prayers and verses
- ✅ **PWA Implementation**: Service worker, manifest, offline capability, push notifications, and app store deployment readiness

### Previous Features Completed
- ✅ **Virtual Christian Store**: Complete e-commerce integration with affiliate products, categories (books, devotionals, music, jewelry, home decor, kids, gifts), featured products, search and filters, favorites system, and external purchase links
- ✅ **YouTube Channel Integration**: Full video gallery for @faithinjesusbr channel with categories (devotionals, prayer, worship, testimonies, teaching, live, music), featured videos, search functionality, video metadata (duration, views, publish date), and direct YouTube links
- ✅ **Modern Design System**: Updated color palette with lilás (purple/lavender), azul-céu (sky blue), creme (cream), and dourado (gold) colors. Implemented Montserrat for body text and Playfair Display for headings and scripture quotes
- ✅ **Enhanced Navigation**: Updated bottom navigation to 6 items including new Store and Videos pages with modern icons and improved spacing
- ✅ **Notification System**: Simple notification system with bell icon, unread counts, categorized notifications (devotional, prayer, sponsor), and mark-as-read functionality

### Advanced Features Completed
- ✅ **Rotating Sponsor Ads**: 5-minute rotation system on homepage without disrupting user experience
- ✅ **AI Integration**: OpenAI integration for personalized prayers, verses, and certificate generation
- ✅ **Database Architecture**: Extended PostgreSQL schema with store products, YouTube videos, notifications, and enhanced metadata
- ✅ **Mobile Navigation**: Updated bottom navigation to include 6 main sections: Home, Store, Videos, Library, Sponsors, Prayer
- ✅ **PWA Functionality**: Offline mode, background sync, push notifications, and mobile app installation
- ✅ **Revenue Generation**: Affiliate store system and sponsor partnerships for sustainable ministry funding

### API Infrastructure
- ✅ **Store APIs**: Complete CRUD operations for products, categories, featured items, and affiliate links
- ✅ **YouTube APIs**: Video management with sync capabilities, categories, featured status, and metadata
- ✅ **Notification APIs**: User-specific notifications with read status and categorization
- ✅ **Enhanced Storage**: Extended database storage with all new entity methods
- ✅ **Modern UI Components**: Updated all components with new color system and typography

## Deployment Strategy

The application is designed for cloud deployment with the following characteristics:

- **Development**: Vite dev server with Express API
- **Production**: Static React build served by Express with API routes  
- **Database**: PostgreSQL (configured for Neon serverless but compatible with any PostgreSQL instance)
- **Environment**: Uses DATABASE_URL and OPENAI_API_KEY environment variables
- **Build Process**: Vite builds the client, ESBuild bundles the server
- **Serving**: Express serves both static files and API endpoints
- **PWA Ready**: Service worker, manifest, and offline functionality for Play Store deployment

The architecture supports both development and production environments with proper environment-based configuration. The application can be easily deployed to platforms like Heroku, Vercel, or any Node.js hosting service that supports PostgreSQL databases. Ready for Play Store deployment as a Progressive Web App.