# How My Image Upload Works

## Overview

Your RoomVibe app uses **Supabase Storage** for image uploads with a secure, user-based file organization system. The upload process includes authentication checks, file validation, progress tracking, and automatic URL generation for both local preview and hosted access.

## Architecture & Flow

### 1. **Upload Component Structure** (`src/app/components/UploadForm.tsx`)

#### **Key State Variables**

```typescript
const [user, setUser] = useState<any>(null); // Current authenticated user
const [isUploading, setIsUploading] = useState(false); // Upload status
const [uploadProgress, setUploadProgress] = useState(0); // Progress percentage
const [isDragging, setIsDragging] = useState(false); // Drag & drop state
```

#### **User Authentication Check**

```typescript
useEffect(() => {
  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);
  };
  getUser();
}, [supabase]);
```

- Gets current user on component mount
- Required for upload permission and file organization
- User ID is used to create user-specific folders

### 2. **File Upload Process**

#### **Step 1: File Validation**

```typescript
// Authentication check
if (!user) {
  alert("Sie müssen angemeldet sein, um Bilder hochzuladen.");
  router.push("/auth/login");
  return;
}

// File type validation
if (!file.type.startsWith("image/")) {
  alert("Bitte wählen Sie eine Bilddatei aus.");
  return;
}

// File size validation (10MB limit)
if (file.size > 10 * 1024 * 1024) {
  alert("Die Datei ist zu groß. Bitte wählen Sie ein Bild unter 10MB.");
  return;
}
```

#### **Step 2: Progress Simulation**

```typescript
const progressInterval = setInterval(() => {
  setUploadProgress((prev) => {
    if (prev >= 90) {
      clearInterval(progressInterval);
      return prev;
    }
    return prev + Math.random() * 15;
  });
}, 100);
```

- Provides user feedback during upload
- Simulates progress up to 90%
- Real completion happens when upload finishes

#### **Step 3: File Upload to Supabase Storage**

```typescript
// Generate unique filename with user ID and timestamp
const fileExt = file.name.split(".").pop();
const fileName = `${user.id}/${Date.now()}-${Math.random()
  .toString(36)
  .substring(2)}.${fileExt}`;

// Upload to Supabase Storage
const { data, error } = await supabase.storage
  .from("room-images") // Bucket name
  .upload(fileName, file, {
    cacheControl: "3600", // Cache for 1 hour
    upsert: false, // Don't overwrite existing files
  });
```

#### **Step 4: Get Public URL**

```typescript
// Get the public URL for the uploaded file
const {
  data: { publicUrl },
} = supabase.storage.from("room-images").getPublicUrl(data.path);

// Store both URLs in app state
setLocalImageUrl(file); // For immediate preview
setHostedImageUrl(publicUrl); // For API calls and sharing
```

### 3. **File Organization Strategy**

#### **Directory Structure in Supabase Storage**

```
room-images/                 (bucket)
├── user-id-1/              (user folder)
│   ├── 1703123456789-abc123.jpg
│   ├── 1703123789456-def456.png
│   └── ...
├── user-id-2/              (another user's folder)
│   ├── 1703124000000-ghi789.jpg
│   └── ...
```

#### **Filename Generation**

```typescript
const fileName = `${user.id}/${Date.now()}-${Math.random()
  .toString(36)
  .substring(2)}.${fileExt}`;
```

- **`user.id/`**: Creates user-specific folder
- **`Date.now()`**: Timestamp for ordering and uniqueness
- **`Math.random().toString(36).substring(2)`**: Additional random string
- **`.${fileExt}`**: Preserves original file extension

### 4. **Drag & Drop Implementation**

#### **Event Handlers**

```typescript
const handleDrop = useCallback(
  (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer?.files || []);
    const imageFile = files.find((file) => file.type.startsWith("image/"));

    if (imageFile) {
      handleFileSelect(imageFile);
    }
  },
  [handleFileSelect]
);

const handleDragEvents = useCallback((e: DragEvent<HTMLDivElement>) => {
  e.preventDefault();
  e.stopPropagation();

  if (e.type === "dragenter" || e.type === "dragover") {
    setIsDragging(true);
  } else if (e.type === "dragleave") {
    // Smart dragleave detection to avoid flickering
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragging(false);
    }
  }
}, []);
```

### 5. **State Management Integration**

#### **Zustand Store** (`src/utils/store.ts`)

```typescript
interface AppState {
  localImageUrl: string | null; // For immediate preview
  hostedImageUrl: string | null; // For API calls
  // ... other state
}
```

#### **URL Storage Strategy**

```typescript
setLocalImageUrl(file); // File object for immediate preview
setHostedImageUrl(publicUrl); // Supabase public URL for API calls
```

- **Local URL**: Used for immediate preview while processing
- **Hosted URL**: Used for AI API calls and sharing
- Both URLs stored to handle different use cases

### 6. **Progress & UI Feedback**

#### **Progress Indicator Component**

```typescript
const ProgressIndicator = ({ progress }: { progress: number }) => (
  <motion.div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-sm rounded-3xl">
    <motion.div
      className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
    <motion.p className="mt-4 text-sm font-medium text-base-content/70">
      {progress < 100
        ? `Wird hochgeladen... ${progress}%`
        : "Upload abgeschlossen!"}
    </motion.p>
  </motion.div>
);
```

#### **Visual States**

- **Idle**: Upload drop zone with instructions
- **Dragging**: Highlighted drop zone with animation
- **Uploading**: Progress spinner with percentage
- **Complete**: Success message before redirect

## Required Supabase Dashboard Setup

### 1. **Storage Bucket Creation**

1. Go to **Storage** in your Supabase dashboard
2. Create a new bucket named `room-images`
3. Set bucket to **Public** (for public URL access)
4. **File size limit**: Set to 10MB or your preferred limit

### 2. **Storage Policies (RLS)**

Since your bucket is public, you need these policies:

#### **Enable RLS on the bucket**

```sql
-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
```

#### **Upload Policy** (Allow authenticated users to upload to their folder)

```sql
CREATE POLICY "Users can upload images to their own folder" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'room-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

#### **Read Policy** (Allow anyone to view uploaded images)

```sql
CREATE POLICY "Anyone can view uploaded images" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'room-images');
```

#### **Delete Policy** (Allow users to delete their own images)

```sql
CREATE POLICY "Users can delete their own images" ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'room-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

### 3. **Environment Variables**

```env
NEXT_PUBLIC_SUPABASE_URL=https://[your-project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
```

### 4. **Next.js Image Configuration** (`next.config.ts`)

```typescript
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "*.supabase.co",
      pathname: "/storage/v1/object/public/**",
    },
  ],
}
```

- Allows Next.js Image component to load Supabase storage images
- Improves performance with optimized image loading

## How Upload Integrates with Your App

### 1. **Authentication Integration**

- Users must be signed in to upload
- User ID creates folder structure
- Session validates upload permissions

### 2. **File Processing Flow**

1. User drops/selects image → Upload to Supabase
2. Get public URL → Store in app state
3. Navigate to `/suggestions` → Process with AI
4. AI receives hosted URL → Generate suggestions

### 3. **Error Handling**

```typescript
try {
  // Upload logic
} catch (error) {
  console.error("Upload failed:", error);
  alert("Upload fehlgeschlagen. Bitte versuchen Sie es erneut.");
  setIsUploading(false);
  setUploadProgress(0);
  clearInterval(progressInterval);
}
```

### 4. **Cleanup & Performance**

- **Cache Control**: Files cached for 1 hour
- **Unique Filenames**: Prevents conflicts and caching issues
- **Progress Cleanup**: Intervals cleared on error or completion
- **User Folders**: Organized storage, easy cleanup per user

## File Types & Limitations

### **Supported Formats**

- **Validation**: `file.type.startsWith("image/")`
- **Common Types**: JPG, PNG, WEBP, GIF
- **File Extensions**: Preserved from original upload

### **Size Limits**

- **Client-side**: 10MB (configurable in code)
- **Supabase**: Default 50MB (configurable in dashboard)
- **Recommendation**: Keep under 5MB for better UX

### **Performance Considerations**

- **Resize Logic**: Available in `src/utils/resizeImage.ts` (not currently used)
- **Compression**: Could be added before upload
- **Thumbnails**: Could be generated server-side

## Alternative Upload API

Your app also has a Vercel Blob upload API (`src/app/api/uploadImage/route.ts`) that's not currently being used. The Supabase storage approach is preferred because:

1. **Better Integration**: Works seamlessly with Supabase Auth
2. **User Organization**: Built-in user folder structure
3. **Cost**: Supabase storage is included in most plans
4. **RLS Policies**: Better security with row-level security
5. **Consistency**: Everything in one platform

## Dependencies Used

- `@supabase/supabase-js` (v2.50.0): Storage client
- `framer-motion` (v12.18.1): Progress animations and drag feedback
- Built-in browser APIs: FileReader, drag events, File API
