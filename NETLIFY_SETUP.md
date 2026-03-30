# Netlify Setup Instructions

## Required GitHub Secrets

To deploy to Netlify, you need to add these secrets to your GitHub repository:

1. **NETLIFY_AUTH_TOKEN**
   - Get this from your Netlify account: Site settings > Build & deploy > Continuous Deployment > API access
   - Or from Netlify dashboard: User settings > Applications > Personal access tokens

2. **NETLIFY_SITE_ID**
   - Get this from your Netlify site: Site settings > Site details > Site information
   - Or from the Netlify CLI after linking: `netlify link`

## Setup Steps

1. **Create Netlify Account**
   - Sign up at [netlify.com](https://netlify.com)

2. **Create New Site**
   - Go to Netlify dashboard
   - Click "Add new site" > "Import an existing project"
   - Connect to your GitHub repository

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `frontend/build`
   - Base directory: `frontend`

4. **Environment Variables**
   - Add `REACT_APP_API_URL` = `https://league-w1ld.onrender.com`

5. **Get Site ID and Auth Token**
   - Follow the instructions above to get the required secrets
   - Add them to your GitHub repository secrets

## Alternative: Manual Deployment

If you prefer manual deployment instead of GitHub Actions:

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Deploy to Netlify:
   - Drag and drop the `build` folder to Netlify dashboard
   - Or use Netlify CLI: `netlify deploy --prod --dir=build`

## Benefits of Netlify

- Free SSL certificates
- Continuous deployment from GitHub
- Instant rollbacks
- Form handling
- Edge functions
- Better performance for static sites
