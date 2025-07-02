# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

```bash
# Development
npm run dev              # Start development server
npm run dev:turbo        # Start with Turbo Mode
npm run dev:fast         # Development with experimental HTTPS

# Build & Production
npm run build            # Production build
npm run start            # Start production server
npm run analyze          # Bundle analysis (ANALYZE=true)

# Quality & Maintenance
npm run lint             # ESLint + Next.js linting
npm run clean            # Clean .next and out directories
```

## Architecture Overview

### Core Application Flow
RoomVibe is an AI-powered interior design app following this user journey:
**WelcomeScreen** → **UploadForm** → **AnalyzePage** → **SuggestionsPage** → **ChangeStylePage**

Key architectural decisions:
- **Next.js 15 App Router** with internationalized routing (`[locale]` pattern)
- **Zustand multi-store pattern** for scalable state management
- **Supabase integration** for auth, storage, and database
- **AI-first design** with OpenAI + Replicate integration
- **Mock-first development** with real/mock API switching

### State Management Architecture

The app uses three specialized Zustand stores:

1. **Main Store** (`/src/utils/store.ts`): Image workflow and suggestions
   - Dual URL strategy: `localImageUrl` (blob) + `hostedImageUrl` (Supabase)
   - Map-based style tracking for O(1) lookups
   - Comprehensive reset functions for workflow stages

2. **Credits Store** (`/src/utils/creditsStore.ts`): Payment and usage tracking
   - Optimistic updates with rollback capability
   - 30-second caching to prevent API spam
   - Type-safe custom error classes

3. **Settings Store** (`/src/utils/settingsStore.ts`): Persisted preferences
   - Mock mode toggle with localStorage persistence

### API Architecture Patterns

**Endpoint Organization:**
- Real APIs: `/api/analyze`, `/api/generate-image`, `/api/generate-prompt`
- Mock APIs: `/api/mock-*` (development/testing)
- Dynamic selection via `getAnalyzeEndpoint()` helper based on settings

**Key Integrations:**
- **OpenAI GPT-4**: Room analysis with 16 few-shot examples
- **Replicate Flux Kontext Pro**: Image generation
- **Stripe**: Credit purchasing with webhook processing
- **Supabase Storage**: User-specific file organization

### Authentication & Security Patterns

**Three-tier Supabase setup:**
- Browser client: Real-time auth state
- Server client: SSR with cookie sessions  
- Middleware client: Token refresh and persistence

**Route Protection:**
- `StateGuard` component protects routes requiring uploaded images
- Row Level Security policies on Supabase storage
- User-specific file paths: `room-images/{userId}/{timestamp-random}.{ext}`

### AI Integration Patterns

**Analysis Flow:**
1. Image upload → Supabase storage
2. OpenAI analysis with structured German prompts
3. Suggestion generation with confidence scores
4. Credit deduction on suggestion application

**Generation Flow:**
1. Style selection → Prompt engineering
2. Replicate API call with optimized parameters
3. Progress polling with user feedback
4. Result storage and state updates

### Component Architecture

**Compound Component Pattern:**
- Complex components broken into sub-components with dedicated folders
- Example: `UploadForm/` contains `components/`, `hooks/`, and main component
- Index files provide clean imports

**Key Shared Components:**
- `ActionBar`: Consistent navigation with responsive design
- `ErrorDisplay`: Centralized error handling UI
- `ImageDisplaySection`: Reusable image display with modal support
- `StateGuard`: Route protection wrapper

### Internationalization Setup

**next-intl Integration:**
- Locale-based routing with middleware
- Structured message files (`/messages/de.json`, `/messages/en.json`)
- Type-safe translation keys
- German-first UI (primary language)

## Development Patterns

### Environment Configuration
Required environment variables:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# AI Services  
OPENAI_API_KEY=
REPLICATE_API_TOKEN=

# Payments
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# App Config
NEXT_PUBLIC_SITE_URL=
```

### Mock Development Mode

The app includes comprehensive mock APIs for development:
- Toggle via Settings → Mock Mode
- Mock responses simulate real AI behavior
- Enables development without API costs
- Switch to production APIs via settings toggle

### Image Handling Patterns

**Upload Strategy:**
1. Client-side blob URL for immediate preview
2. Supabase upload with user-specific paths
3. State management of both URLs for different use cases
4. Automatic cleanup and URL management

**Optimization:**
- Next.js Image component for performance
- WebP/AVIF format support
- Responsive image loading

## Important Technical Notes

### Credit System Integration
- **Cost Model**: Analysis free, suggestions cost 5 credits
- **Transaction Flow**: Stripe webhooks → credit updates → usage tracking
- **Error Handling**: Custom error classes for insufficient credits
- **Audit Trail**: Full transaction logging in Supabase

### Animation & UI Standards
- **Framer Motion**: Physics-based animations with spring transitions
- **Accessibility**: `prefers-reduced-motion` support
- **Design System**: DaisyUI with custom "aura" theme
- **Apple-inspired**: Liquid glass aesthetics with backdrop blur effects

### Testing & Quality
- **No formal tests** currently - relies on TypeScript + ESLint
- **Mock mode** serves as integration testing
- **Error boundaries** for component-level error handling
- **Console logging** for debugging (removed in production)

## Common Tasks

### Adding New API Endpoints
1. Create real endpoint in `/api/`
2. Create corresponding mock in `/api/mock-`
3. Update endpoint selection helper
4. Add appropriate error handling

### Adding New UI Components
1. Follow PascalCase naming convention
2. Use compound component pattern for complex components
3. Include proper TypeScript interfaces
4. Add Framer Motion animations where appropriate
5. Ensure German UI text via message files

### Modifying State Management
1. Identify appropriate store (main/credits/settings)
2. Follow existing patterns for actions and selectors
3. Implement proper error handling
4. Add optimistic updates where beneficial

### Working with AI Integration
1. Review existing prompt engineering patterns
2. Test with mock mode first
3. Handle API errors gracefully
4. Consider credit implications for new features

## Key Files for Understanding

- `/src/utils/store.ts` - Main application state
- `/src/utils/creditsStore.ts` - Credit management
- `/middleware.ts` - Auth + i18n middleware
- `/src/utils/supabase/` - Database client setup
- `/src/components/StateGuard.tsx` - Route protection
- `/.cursor/rules/` - Development guidelines and patterns