# How My Authentication Works

## Overview

Your RoomVibe app implements authentication using **Supabase Auth** with support for both email/password authentication and Google OAuth. The system is built on Next.js 15 with the App Router and uses Supabase's SSR (Server-Side Rendering) package for seamless client-server authentication.

## Key Components & Architecture

### 1. Supabase Client Setup

You have three different client configurations:

#### **Browser Client** (`src/utils/supabase/client.ts`)

```typescript
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

- Used for client-side operations
- Handles browser-specific auth state management
- Used in React components for real-time auth updates

#### **Server Client** (`src/utils/supabase/server.ts`)

```typescript
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          /* handles cookie setting */
        },
      },
    }
  );
}
```

- Used for server-side operations (API routes, server components)
- Handles cookies for session persistence
- Maintains auth state across server requests

#### **Middleware Client** (`src/utils/supabase/middleware.ts`)

```typescript
export async function updateSession(request: NextRequest) {
  // Creates a server client specifically for middleware
  // Refreshes auth tokens automatically
  // Handles cookie updates for session persistence
}
```

- Runs on every request via Next.js middleware
- Automatically refreshes expired tokens
- Ensures auth state is up-to-date

### 2. Authentication Flow

#### **Sign Up Process**

1. User fills out email/password form on `/auth/login`
2. `signup()` action is called in `src/app/auth/login/actions.ts`
3. Supabase creates user account
4. If email confirmation is required, user is redirected to `/auth/check-email`
5. User clicks confirmation link in email
6. Confirmation handled by `/auth/confirm/route.ts`
7. User is redirected to home page

#### **Sign In Process**

1. User enters credentials on `/auth/login`
2. `login()` action validates and signs in user
3. Supabase sets session cookies
4. User is redirected to home page
5. `AuthButton` component updates to show user info

#### **Google OAuth Process**

1. User clicks "Continue with Google" button
2. `signInWithGoogle()` action initiates OAuth flow
3. User is redirected to Google for authentication
4. Google redirects back to `/auth/callback`
5. Callback route exchanges code for session
6. User is redirected to home page

### 3. Session Management

#### **Middleware Protection** (`middleware.ts`)

```typescript
export async function middleware(request: NextRequest) {
  return await updateSession(request);
}
```

- Runs on every request
- Automatically refreshes tokens
- Maintains session state across page navigations

#### **Client-Side Auth State** (`src/components/AuthButton.tsx`)

```typescript
useEffect(() => {
  const supabase = createClient();

  // Get initial session
  supabase.auth.getSession().then(({ data: { session } }) => {
    setUser(session?.user ?? null);
  });

  // Listen for auth changes
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, session) => {
    setUser(session?.user ?? null);
  });

  return () => subscription.unsubscribe();
}, []);
```

- Listens for auth state changes in real-time
- Updates UI immediately when user signs in/out
- Handles session updates automatically

### 4. Route Protection

#### **Server-Side Protection** (`src/utils/auth.ts`)

```typescript
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/login");
  }
  return user;
}
```

- Used in server components (like `/private` page)
- Automatically redirects unauthenticated users
- Returns user object for authenticated users

#### **Client-Side Protection** (`src/app/components/UploadForm.tsx`)

```typescript
if (!user) {
  alert("Sie müssen angemeldet sein, um Bilder hochzuladen.");
  router.push("/auth/login");
  return;
}
```

- Checks auth state before allowing actions
- Redirects to login when needed
- Shows appropriate error messages

## Required Supabase Dashboard Setup

### 1. **Authentication Settings**

- **URL Configuration**: Set your site URL to `http://localhost:3000` (dev) and your production URL
- **Redirect URLs**: Add `/auth/callback` to allowed redirect URLs
- **Email Templates**: Default templates work, but you can customize them

### 2. **OAuth Providers**

- **Google**: Enable Google provider in Authentication > Providers
- **Configure Google OAuth**:
  - Get Google OAuth credentials from Google Console
  - Add Client ID and Secret to Supabase
  - Set authorized redirect URI to: `https://[your-project].supabase.co/auth/v1/callback`

### 3. **Email Settings**

- **SMTP**: Configure custom SMTP or use Supabase's default
- **Email Templates**: Customize confirmation and reset password emails
- **Email Confirmation**: Enable if you want users to verify their email

### 4. **Environment Variables Needed**

```env
NEXT_PUBLIC_SUPABASE_URL=https://[your-project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # (or your production URL)
```

### 5. **Row Level Security (RLS)**

- Your auth setup doesn't require custom RLS policies for the auth flow
- But you'll need RLS policies for any user-specific data tables
- The `auth.users` table is managed by Supabase automatically

## How Authentication Integrates with Your App

1. **Upload Protection**: Users must be signed in to upload images
2. **User-Specific Storage**: Images are stored in folders named with user IDs
3. **Session Persistence**: Users stay logged in across browser sessions
4. **Real-time Updates**: UI updates immediately when auth state changes
5. **Route Protection**: Private pages automatically redirect unauthenticated users

## Troubleshooting Common Issues

1. **"Invalid JWT" errors**: Usually means tokens expired - middleware should handle this automatically
2. **Redirect loops**: Check that your site URL matches your environment
3. **OAuth not working**: Verify redirect URLs are correctly configured
4. **Email not sending**: Check your SMTP settings or use Supabase's built-in email

## Dependencies Used

- `@supabase/supabase-js` (v2.50.0): Main Supabase client
- `@supabase/ssr` (v0.6.1): Server-side rendering helpers for Next.js
- Built-in Next.js features: middleware, server actions, cookies, redirects
