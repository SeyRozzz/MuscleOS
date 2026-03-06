# MuscleOS Deployment Guide

Complete guide for deploying MuscleOS to production.

## Architecture

```
┌─────────────────────────┐
│   Frontend (Frontend)   │
│   - HTML/CSS/JS         │
│   - Deployed on Netlify │
└────────────┬────────────┘
             │
             │ HTTPS Requests
             ↓  (JWT Auth)
┌─────────────────────────┐
│   Backend (API Server)  │
│   - Node.js/Express     │
│   - JWT Authentication  │
│   - Data Sync Endpoints │
│   - Deployed on Render  │
└─────────────────────────┘
```

## Phase 9: Complete Deployment

This phase includes:
1. ✅ Backend API setup (Node.js/Express)
2. ✅ JWT authentication system
3. ✅ Frontend integration with backend
4. 📋 Production deployment configuration
5. 📋 Environment variable setup
6. 📋 CORS configuration

## Frontend Deployment

### Already Deployed on Netlify
- URL: https://muscleos.netlify.app
- Auto-deploys from `main` branch on GitHub
- All frontend assets served from Netlify CDN

### To Update Frontend
```bash
git push origin main
# Netlify auto-deploys within 1-2 minutes
```

## Backend Deployment (Render.com Recommended)

### Step 1: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub
3. Connect your repository

### Step 2: Create Web Service
1. Click "New +" → "Web Service"
2. Select GitHub repository: `SeyRozzz/MuscleOS`
3. Settings:
   - **Name**: `muscleos-api` (or your preferred name)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`

### Step 3: Configure Environment Variables
In Render dashboard, add these environment variables:
```
NODE_ENV=production
JWT_SECRET=your_long_random_secret_key_here_32_chars_minimum
PORT=5000
```

### Step 4: Deploy
Click "Deploy" - Render builds and starts the server automatically

### Step 5: Get Service URL
After deployment, you'll see a URL like:
```
https://muscleos-api.onrender.com
```

## Step 6: Update Frontend API URL

Update `js/auth.js` line 15:
```javascript
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000'
  : 'https://muscleos-api.onrender.com';  // ← Update this with your Render URL
```

Then push to GitHub:
```bash
git add js/auth.js
git commit -m "Update backend API URL for production"
git push origin main
```

Netlify auto-deploys within 1-2 minutes.

## Step 7: Test Production Setup

### Test Authentication
1. Go to https://muscleos.netlify.app
2. Click "Compte" (Account tab)
3. Register new account
4. Check if account registers successfully
5. Login with new credentials
6. Check browser DevTools → Network tab for API calls

### Test Data Sync
1. Add an entry to Suivi (tracking)
2. Check if data syncs to backend
3. Logout and login again
4. Verify data persists after login

### Test API Directly
```bash
# Register
curl -X POST https://muscleos-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@email.com","password":"testpass123"}'

# Login
curl -X POST https://muscleos-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@email.com","password":"testpass123"}'

# Health check
curl https://muscleos-api.onrender.com/api/health
```

## Production Checklist

- [ ] Backend deployed on Render/Railway
- [ ] Backend URL generated and available
- [ ] JWT_SECRET set to strong random string (32+ chars)
- [ ] NODE_ENV set to `production`
- [ ] Frontend API_URL updated in `js/auth.js`
- [ ] Frontend re-deployed to Netlify
- [ ] Test registration flow end-to-end
- [ ] Test login/logout flow
- [ ] Test data sync (logbook + calculations)
- [ ] Verify HTTPS on both frontend and backend
- [ ] Monitor deployment logs for errors

## CORS Configuration

The backend already supports CORS for:
- `http://localhost` (development)
- `http://localhost:3000`
- `http://localhost:5500`
- `file://` (local testing)
- Production domains

To add more domains, update `backend/server.js` line 12-15:
```javascript
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? 'https://yourdomain.com'  // ← Add your domain here
    : ['http://localhost', ...],
}));
```

## Monitoring & Logs

### Render Dashboard
- Go to https://dashboard.render.com
- Click your service
- View "Logs" for runtime errors
- View "Metrics" for performance

### Frontend (Netlify)
- Go to https://app.netlify.com
- Click your site
- View "Deployments" tab for build logs
- View "Analytics" for traffic

## Troubleshooting

### "CORS error" when authenticating
- Check API_URL in `js/auth.js`
- Verify backend is running on Render dashboard
- Check backend logs for errors

### "Cannot reach backend" on production
- Verify Render service is active (check status)
- Check that JWT_SECRET is set
- Verify NODE_ENV=production

### "Token invalid" after login
- Check JWT_SECRET matches between frontend and backend
- Verify clock skew (server time sync)
- Clear localStorage cookies and try again

### Data not syncing
- Check network tab in DevTools
- Verify user is authenticated
- Check backend logs on Render

## Future Improvements

### Database Integration
Replace in-memory storage with persistent database:
- MongoDB (free tier on MongoDB Atlas)
- PostgreSQL (free tier on Render)
- Firebase Firestore (free tier on Google Cloud)

### Session Management
- Implement Redis for token caching
- Add refresh token rotation
- Implement token blacklisting

### Security Hardening
- Add rate limiting on auth endpoints
- Implement CAPTCHA for registration
- Add helmet.js for security headers
- Enable HTTPS enforcement

## Support Resources

- **Render Docs**: https://render.com/docs
- **Express.js Guide**: https://expressjs.com
- **JWT Explanation**: https://jwt.io
- **CORS Issues**: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS

## Success Indicators

You'll know everything is working when:
1. ✅ Frontend loads from Netlify HTTPS
2. ✅ Backend API responds from Render HTTPS
3. ✅ Can register new account end-to-end
4. ✅ Can login and logout
5. ✅ Can add logbook entries and they sync
6. ✅ Can refresh page and data persists
7. ✅ DevTools shows no CORS errors
8. ✅ All API calls return 2xx status codes

---

**Backend Version**: 1.0.0
**Last Updated**: March 2025
**Status**: Production Ready (In-Memory Storage)

Next Phase: Database Integration (Optional but Recommended)
