# MuscleOS Backend Deployment Guide

## Overview
The MuscleOS backend is a Node.js/Express server that provides authentication and data synchronization endpoints for the fitness tracking app.

## Current Architecture

### Endpoints
- **POST** `/api/auth/register` - Register new user
- **POST** `/api/auth/login` - Login user
- **POST** `/api/auth/refresh` - Refresh JWT token
- **GET** `/api/auth/me` - Get current user (protected)
- **POST** `/api/sync/logbook` - Save logbook (protected)
- **GET** `/api/sync/logbook` - Fetch logbook (protected)
- **POST** `/api/sync/calculations` - Save calculations (protected)
- **GET** `/api/sync/calculations` - Fetch calculations (protected)
- **GET** `/api/health` - Health check

### Technologies
- Node.js 16+
- Express.js
- JWT authentication (jsonwebtoken)
- bcryptjs for password hashing
- CORS support for frontend

### Data Storage
Currently: **In-memory storage** (resets on server restart)

For production, recommend adding:
- MongoDB / PostgreSQL for persistent data
- Redis for session management

## Local Development

### Setup
```bash
cd backend
npm install
```

### Create .env file
```bash
cp .env.example .env
# Edit .env with your local settings
```

### Run server
```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

Server runs on `http://localhost:5000`

## Deployment Options

### Option 1: Render.com (Recommended - Free tier)

1. **Create account** at https://render.com
2. **Connect GitHub** repository
3. **Create new Web Service**
   - Repository: `https://github.com/SeyRozzz/MuscleOS.git`
   - Root directory: `backend`
   - Runtime: `Node`
   - Build command: `npm install`
   - Start command: `node server.js`
4. **Environment Variables**
   - `NODE_ENV=production`
   - `JWT_SECRET=your_long_random_secret_key_here`
   - `PORT=5000` (optional, Render sets automatically)
5. **Deploy** - Service starts automatically

### Option 2: Railway.app (Alternative - Free tier)

1. **Create account** at https://railway.app
2. **New Project** → Link GitHub
3. **Add Service** → Select `backend` directory
4. **Environment** tab, add:
   - `NODE_ENV=production`
   - `JWT_SECRET=your_long_random_secret_key_here`
5. **Deploy** automatically on push

### Option 3: Heroku (Paid after free tier discontinued)

1. Install Heroku CLI
2. Login: `heroku login`
3. Deploy:
   ```bash
   heroku create muscleos-api
   heroku config:set JWT_SECRET=your_secret_key
   git subtree push --prefix backend heroku main
   ```

## Frontend Configuration

After deploying backend, update frontend API URL in `js/auth.js`:

```javascript
const API_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:5000'
  : 'https://your-render-app-name.onrender.com';  // Update with your deployment URL
```

## Production Checklist

- [ ] Generate strong `JWT_SECRET` (32+ characters, random)
- [ ] Configure `NODE_ENV=production`
- [ ] Update frontend `API_URL` to production backend
- [ ] Test all auth endpoints with deployed backend
- [ ] Verify CORS allows frontend domain
- [ ] Enable HTTPS (automatic on Render/Railway)
- [ ] Monitor logs for errors
- [ ] Plan database migration (currently in-memory)

## Next Steps

### Database Integration
Current in-memory storage is for development only. For production:

```javascript
// Example: Replace users object with MongoDB
const User = require('./models/User');
// ...
const user = await User.findOne({ email });
```

### Session Persistence
- Add MongoDB for user data
- Add Redis for JWT blacklisting
- Implement refresh token rotation

### Security Enhancements
- Rate limiting on auth endpoints
- Request validation middleware
- Helmet.js for security headers
- HTTPS enforcement

## Environment Variables

### Development (.env)
```
PORT=5000
JWT_SECRET=dev_secret_for_testing
NODE_ENV=development
```

### Production
```
PORT=5000
JWT_SECRET=long_random_production_secret_32_chars_min
NODE_ENV=production
```

## Troubleshooting

**Port already in use**: Change PORT env variable
**CORS errors**: Check frontend domain in server.js
**JWT errors**: Verify JWT_SECRET matches between frontend and backend
**500 errors**: Check logs in Render/Railway dashboard

## Support
For issues, check:
- Backend logs in deployment dashboard
- Frontend network tab (DevTools)
- Server startup messages

---
Last Updated: March 2025
API Version: 1.0.0
