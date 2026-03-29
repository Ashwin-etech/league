# Deployment Guide

## 🚀 Quick Deployment Setup

### 1. MongoDB Atlas Setup
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster (free tier)
4. Create a database user
5. Get your connection string
6. Add your IP to whitelist (0.0.0.0/0 for cloud access)

### 2. Backend Deployment (Render)
1. Push your code to GitHub
2. Go to [Render](https://render.com)
3. Connect your GitHub account
4. Click "New +" → "Web Service"
5. Select your repository
6. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Runtime**: Node 18+

7. Add Environment Variables:
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/league_management
   JWT_SECRET=your_long_random_secret_key
   JWT_EXPIRE=7d
   PORT=5000
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   ```

### 3. Frontend Deployment (Vercel)
1. Go to [Vercel](https://vercel.com)
2. Connect your GitHub account
3. Import your repository
4. Configure:
   - **Framework Preset**: React
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

5. Add Environment Variable:
   ```
   REACT_APP_API_URL=https://your-backend-domain.onrender.com
   ```

## 📋 Deployment Commands

### Local Build Test
```bash
npm run build
```

### Deploy Script
```bash
npm run deploy
```

## 🔧 Environment Variables

### Backend (.env)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/league_management
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random_for_production
JWT_EXPIRE=7d
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### Frontend (.env)
```env
REACT_APP_API_URL=https://your-backend-domain.onrender.com
```

## 🌐 Post-Deployment Steps

1. **Update CORS Settings**: Ensure your backend allows requests from your Vercel domain
2. **Test API Endpoints**: Check `/api/health` endpoint
3. **Verify Database Connection**: Ensure MongoDB Atlas is accessible
4. **Test Authentication**: Create/login with user accounts
5. **Update DNS**: If using custom domains

## 🔄 CI/CD Pipeline

Both Vercel and Render automatically deploy when you push to GitHub:
- **Main branch** → Production
- **Other branches** → Preview deployments

## 🐛 Troubleshooting

### Common Issues
1. **CORS Errors**: Update `FRONTEND_URL` in backend environment
2. **Database Connection**: Check MongoDB Atlas network access
3. **Build Failures**: Verify all dependencies are installed
4. **Environment Variables**: Ensure all required variables are set

### Health Checks
- Backend: `https://your-backend-domain.onrender.com/api/health`
- Frontend: `https://your-frontend-domain.vercel.app`

## 💡 Pro Tips

1. **Use Preview Deployments**: Test changes before production
2. **Monitor Logs**: Check Render and Vercel dashboards
3. **Database Optimization**: Use MongoDB Atlas indexes
4. **Security**: Keep JWT secret secure and use HTTPS
5. **Performance**: Enable caching on Vercel

## 📞 Support

- [Vercel Docs](https://vercel.com/docs)
- [Render Docs](https://render.com/docs)
- [MongoDB Atlas Docs](https://docs.mongodb.com/atlas)
