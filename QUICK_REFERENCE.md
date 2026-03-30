# Quick Deployment Reference

## 🚀 One-Click Deployment Commands

### Local Setup
```bash
# Install all dependencies
npm run install-all

# Start development servers
npm run dev

# Build for production
npm run build

# Run deployment script
npm run deploy
```

### Database Operations
```bash
# Seed database with sample data
cd backend && npm run seed

# Backup database
node scripts/backup-database.js

# Test database connection
node -e "require('./config/database.js')"
```

### Environment Setup
```bash
# Copy environment templates
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Generate secure JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 🔧 Platform-Specific Commands

### Render (Backend)
```bash
# View logs
curl https://api.render.com/v1/services/YOUR_SERVICE_ID/logs

# Trigger redeploy
curl -X POST https://api.render.com/v1/services/YOUR_SERVICE_ID/deploys

# Check health
curl https://your-api.onrender.com/api/health
```

### Vercel (Frontend)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy manually
vercel --prod

# View logs
vercel logs

# Check deployment
curl https://your-app.vercel.app
```

### MongoDB Atlas
```bash
# Connect using mongosh
mongosh "mongodb+srv://username:password@cluster.mongodb.net/league_management"

# Backup collection
mongodump --uri="CONNECTION_STRING" --collection=teams --out=./backup

# Restore collection
mongorestore --uri="CONNECTION_STRING" --collection=teams ./backup/teams.bson
```

## 🐛 Debugging Commands

### Backend Debugging
```bash
# Check server status
curl http://localhost:5000/api/health

# Test authentication
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Check database connection
node -e "require('./config/database.js')"
```

### Frontend Debugging
```bash
# Build with analysis
npm run build -- --analyze

# Check environment variables
npm run start | grep REACT_APP

# Test API connection
curl $REACT_APP_API_URL/api/health
```

## 📊 Monitoring Commands

### Performance Monitoring
```bash
# Check bundle size
npx webpack-bundle-analyzer build/static/js/*.js

# Lighthouse audit
npx lighthouse http://localhost:3000 --output html

# API response time
time curl https://your-api.onrender.com/api/health
```

### Security Checks
```bash
# Audit dependencies
npm audit

# Check for vulnerabilities
npm audit --audit-level=moderate

# Update dependencies
npm update
```

## 🔄 CI/CD Commands

### GitHub Actions
```bash
# Trigger workflow manually
gh workflow run deploy.yml

# Check workflow status
gh run list

# View workflow logs
gh run view
```

## 📱 Mobile Testing
```bash
# Test on different screen sizes
npx responsive-cli http://localhost:3000

# Chrome DevTools mobile simulation
# Open Chrome DevTools → Toggle device toolbar
```

## 🌐 Network Commands

### SSL/TLS Check
```bash
# Check SSL certificate
openssl s_client -connect your-api.onrender.com:443

# Check domain configuration
nslookup your-app.vercel.app
```

### DNS Configuration
```bash
# Check DNS propagation
dig your-domain.com

# Check MX records
dig your-domain.com MX
```

## 🚨 Emergency Commands

### Rollback
```bash
# Render rollback (via dashboard)
# 1. Go to Render dashboard
# 2. Select your service
# 3. Click "Deploy" → "Deploy from previous commit"

# Vercel rollback
vercel rollback

# Git rollback
git revert HEAD
git push origin main
```

### Database Recovery
```bash
# Restore from backup
mongorestore --uri="CONNECTION_STRING" --drop ./backup/league-management

# Check database integrity
mongosh --eval "db.stats()"
```

## 📞 Support Contacts

### Platform Support
- **Render**: https://render.com/support
- **Vercel**: https://vercel.com/support
- **MongoDB Atlas**: https://docs.mongodb.com/atlas/support/

### Community Resources
- **Stack Overflow**: Tag with `mongodb`, `express`, `react`, `vercel`, `render`
- **Discord**: Vercel and MongoDB communities
- **GitHub Issues**: Platform-specific issue trackers

---

## 💡 Pro Tips

1. **Always test locally before deploying**
2. **Keep environment variables secure**
3. **Monitor free tier usage limits**
4. **Set up alerts for downtime**
5. **Regular database backups are essential**
6. **Document any custom configurations**
7. **Test rollback procedures**
8. **Monitor performance regularly**

---

**🎯 Remember**: Your application is now production-ready with enterprise-level features!
