# Professional Creative Portfolio Website
 
A full-stack portfolio website built with Next.js 14, TypeScript, Tailwind CSS, Prisma, and NextAuth.js.
 
## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL (with Prisma ORM)
- **Authentication:** NextAuth.js
- **Media Storage:** Cloudinary
- **Icons:** Lucide React
 
## Features
- **Admin Panel:** Secure dashboard to manage portfolio items, certificates, and CV.
- **Portfolio:** Grid layout with category filters and lightbox view for images/videos.
- **About:** Personal bio, expertise display, and CV download.
- **Certificates:** Showcase professional credentials.
- **Responsive:** Mobile-first design for all devices.
- **Optimized:** Image and video optimization using Next.js components.
 
## Setup Instructions
 
### 1. Environment Variables
Create a `.env` file in the root directory based on `.env.example`:
```env
DATABASE_URL="your-postgresql-url"
NEXTAUTH_SECRET="your-secret"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="secure-password"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="your-upload-preset"
```
 
### 2. Install Dependencies
```bash
npm install
```
 
### 3. Database Setup
```bash
npx prisma db push
npm run prisma:seed # To create the initial admin user
```
 
### 4. Run Development Server
```bash
npm run dev
```
 
## Deployment
- **Database:** Use NeonDB for PostgreSQL.
- **Hosting:** Deploy on Vercel.
- **Media:** Configure Cloudinary for image and video hosting.
 
## Admin Access
Login at `/admin/login` using the credentials set in your environment variables.