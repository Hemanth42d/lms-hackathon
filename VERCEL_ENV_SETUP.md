# Vercel Environment Variables Setup

## Required Environment Variables in Vercel Dashboard

Go to your Vercel project settings → Environment Variables and add:

### Production Environment Variables:

1. **VITE_BACKEND_URL**
   - Value: `https://anthro-learn.onrender.com`
   - Environment: Production

2. **VITE_GEMINI_API**
   - Value: `AIzaSyAQuL4YNl3ggPuNIIYu8idHxgQ4uyKziLQ`
   - Environment: Production

## Steps to Configure:

1. Go to https://vercel.com/dashboard
2. Select your project `anthro-learn-frontend`
3. Go to Settings → Environment Variables
4. Add each variable with the values above
5. Select "Production" environment
6. Click "Save"
7. Redeploy your application

## After Setting Environment Variables:

Go to Deployments → Click on the latest deployment → Click "Redeploy"

This ensures all environment variables are properly loaded during the build.
