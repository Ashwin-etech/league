#!/bin/bash

# Deployment Script for League Management System
echo "🚀 Starting deployment process..."

# Build frontend
echo "📦 Building frontend..."
cd frontend
npm run build

echo "✅ Frontend build completed!"
echo ""
echo "📋 Next Steps:"
echo "1. Push your code to GitHub"
echo "2. Deploy frontend on Vercel: https://vercel.com"
echo "3. Deploy backend on Render: https://render.com"
echo "4. Set up MongoDB Atlas: https://www.mongodb.com/atlas"
echo ""
echo "🔧 Environment Variables Needed:"
echo "- Backend: MONGODB_URI, JWT_SECRET, FRONTEND_URL"
echo "- Frontend: REACT_APP_API_URL"
echo ""
echo "🌐 After deployment, update:"
echo "- FRONTEND_URL in backend environment"
echo "- REACT_APP_API_URL in frontend environment"
