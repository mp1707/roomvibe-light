# Supabase Authentication Setup Guide

## 1. Environment Variables Setup

Create a `.env.local` file in your project root with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Site URL for OAuth redirects
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional: Google OAuth credentials (if you need them for additional configuration)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## 2. Supabase Dashboard Configuration

### Step 1: Get your Supabase credentials

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Settings > API
4. Copy your `Project URL` and `anon/public` key
5. Add them to your `.env.local` file

### Step 2: Configure Google OAuth Provider

1. In your Supabase Dashboard, go to **Authentication > Providers**
2. Find **Google** in the list and click to configure it
3. Enable the Google provider
4. You'll need to set up a Google OAuth application:

#### Setting up Google OAuth:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to **Credentials** > **Create Credentials** > **OAuth 2.0 Client IDs**
5. Set up the OAuth consent screen if you haven't already
6. For **Application type**, choose **Web application**
7. Add authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - `https://yourdomain.com` (for production)
8. Add authorized redirect URIs:
   - `https://YOUR_SUPABASE_PROJECT_REF.supabase.co/auth/v1/callback`
   - Replace `YOUR_SUPABASE_PROJECT_REF` with your actual project reference
9. Copy the **Client ID** and **Client Secret**
10. Paste them into your Supabase Google provider configuration

### Step 3: Configure Auth Settings

1. In Supabase Dashboard, go to **Authentication > Settings**
2. Update **Site URL** to match your domain:
   - Development: `http://localhost:3000`
   - Production: `https://yourdomain.com`
3. Add **Redirect URLs**:
   - `http://localhost:3000/auth/callback`
   - `https://yourdomain.com/auth/callback` (for production)

### Step 4: Update Email Templates (Optional)

1. Go to **Authentication > Email Templates**
2. Update the **Confirm signup** template to use the new auth flow:
   - Change `{{ .ConfirmationURL }}` to `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email`

## 3. Authentication Flow

### Available Routes:

- `/auth/login` - Login/signup page with Google OAuth
- `/auth/callback` - OAuth callback handler
- `/auth/confirm` - Email confirmation handler
- `/auth/error` - Error page for auth failures
- `/private` - Example protected page

### Available Actions:

- Email/password login and signup
- Google OAuth login
- Sign out
- User session management

## 4. Using Auth in Your Components

### Server Components (Recommended):

```tsx
import { getCurrentUser, requireAuth } from "@/utils/auth";

// Get current user (returns null if not authenticated)
const user = await getCurrentUser();

// Require authentication (redirects to login if not authenticated)
const user = await requireAuth();
```

### Client Components:

```tsx
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

// Get current session (client-side)
const {
  data: { session },
} = await supabase.auth.getSession();

// Listen for auth changes
supabase.auth.onAuthStateChange((event, session) => {
  // Handle auth state changes
});
```

## 5. Protecting Routes

### Method 1: Server-side redirect

```tsx
// In your page component
import { requireAuth } from "@/utils/auth";

export default async function ProtectedPage() {
  const user = await requireAuth(); // Redirects to login if not authenticated

  return <div>Hello {user.email}!</div>;
}
```

### Method 2: Middleware protection

Add protected routes to your middleware matcher if needed.

## 6. Testing the Setup

1. Start your development server: `npm run dev`
2. Navigate to `/auth/login`
3. Try signing up with email or Google
4. Check if you're redirected properly after authentication
5. Test the `/private` route to ensure it's protected
6. Test sign out functionality

## 7. Production Deployment

1. Update your `.env.local` with production values
2. Configure your production domain in Supabase settings
3. Update Google OAuth redirect URIs with your production domain
4. Test the entire flow in production

## Troubleshooting

### Common Issues:

1. **OAuth redirect mismatch**: Make sure your redirect URIs match exactly in both Google Cloud Console and Supabase
2. **CORS errors**: Ensure your domain is added to Supabase's allowed origins
3. **Cookie issues**: The middleware handles cookie management automatically
4. **Email confirmation not working**: Check your email template configuration

### Debug Steps:

1. Check browser console for errors
2. Verify environment variables are loaded correctly
3. Check Supabase logs in the dashboard
4. Ensure middleware is running (check Network tab in dev tools)

## File Structure Created:

```
├── middleware.ts                     # Auth middleware
├── src/
│   ├── utils/
│   │   ├── supabase/
│   │   │   ├── client.ts            # Client-side Supabase client
│   │   │   ├── server.ts            # Server-side Supabase client
│   │   │   └── middleware.ts        # Middleware utilities
│   │   └── auth.ts                  # Authentication helpers
│   ├── components/
│   │   └── AuthButton.tsx           # Authentication button component
│   └── app/
│       ├── auth/
│       │   ├── login/
│       │   │   ├── page.tsx         # Login page
│       │   │   └── actions.ts       # Server actions
│       │   ├── callback/
│       │   │   └── route.ts         # OAuth callback
│       │   ├── confirm/
│       │   │   ├── route.ts         # Email confirmation
│       │   │   └── page.tsx         # Confirmation page
│       │   └── error/
│       │       └── page.tsx         # Error page
│       └── private/
│           └── page.tsx             # Example protected page
```

Your Supabase server-side authentication is now fully set up with Google OAuth support!
