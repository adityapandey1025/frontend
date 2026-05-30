# Frontend Deployment Instructions

## 🚀 Vercel Deployment (Recommended)

### Option 1: One-Click Deploy (Easiest)
1. Go to https://vercel.com/new
2. Import: `https://github.com/adityapandey1025/frontend`
3. Click Import
4. Fill environment variable:
   ```
   VITE_BACKEND_URL=https://syncmusic-backend-fnpx.onrender.com
   ```
5. Click Deploy

### Option 2: Manual Deploy
1. Go to https://vercel.com/dashboard
2. Click **Add New** → **Project**
3. Import repository: `adityapandey1025/frontend`
4. Framework: **Vite** (auto-detected)
5. Build Settings (should auto-fill):
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
6. Environment Variables:
   ```
   VITE_BACKEND_URL=https://syncmusic-backend-fnpx.onrender.com
   ```
7. Click **Deploy**
8. Wait 2-3 minutes

## ✅ Verification
- Check status at: https://vercel.com/dashboard
- Visit your deployment URL
- Should see SyncMusic home page
- Test create room and video loading

## 🔧 Troubleshooting

### Issue: Build fails silently
**Solution**: 
- Check `package.json` has all dependencies
- Run `npm install` locally and fix errors
- Check `npm audit` for security vulnerabilities

### Issue: Can't connect to backend
**Solution**:
- Verify VITE_BACKEND_URL env var is set correctly
- Backend must be deployed first
- Backend ALLOWED_ORIGINS must include frontend URL

### Issue: Video not loading
**Solution**:
- Check browser console for CORS errors
- Verify backend is running
- Test with different YouTube URLs

