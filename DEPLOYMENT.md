# Deploying RelioSkin to Vercel with Convex

This guide walks you through deploying your RelioSkin application to production.

## Prerequisites

- Vercel account (sign up at https://vercel.com)
- Convex account (you already have one from dev)
- Git repository pushed to GitHub/GitLab/Bitbucket

## Step-by-Step Deployment

### 1. Deploy Convex Backend to Production

First, deploy your Convex functions to a production environment:

```bash
# Deploy Convex backend
npx convex deploy --cmd 'npm run build'
```

This will:
- Create a production Convex deployment
- Give you a production URL like `https://your-prod-name-123.convex.cloud`
- Run your build command to ensure everything compiles

**Important**: Save the production URL that's displayed!

### 2. Set Up Vercel Project

#### Option A: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to Vercel
vercel
```

#### Option B: Using Vercel Dashboard

1. Go to https://vercel.com/new
2. Import your Git repository
3. Vercel will auto-detect it as a Vite project
4. Don't deploy yet - we need to set environment variables first!

### 3. Configure Environment Variables in Vercel

In your Vercel project settings (or during initial setup):

1. Go to **Settings** → **Environment Variables**
2. Add the following variables for **Production**:

```
VITE_CONVEX_URL=https://your-production-deployment.convex.cloud
CONVEX_SITE_URL=https://your-app.vercel.app
```

**Note**: Replace with your actual values:
- `VITE_CONVEX_URL`: The URL from Step 1
- `CONVEX_SITE_URL`: Your Vercel app URL (you can update this after first deploy)

3. Add any other environment variables your app needs:
   - Stripe keys
   - Resend API keys
   - OAuth credentials
   - etc.

### 4. Update Convex Site URL

After your first Vercel deployment, you'll have your production URL. Update Convex:

```bash
# Set your production site URL in Convex
npx convex env set CONVEX_SITE_URL https://your-app.vercel.app --prod
```

### 5. Deploy to Vercel

```bash
# Deploy to production
vercel --prod
```

Or click **Deploy** in the Vercel dashboard.

## Verifying Deployment

1. Visit your Vercel URL
2. Check browser console for any errors
3. Test authentication flow
4. Test booking functionality
5. Monitor logs in Convex dashboard: https://dashboard.convex.dev

## Environment Management

### Development
- Uses `.env.local`
- Convex deployment: `dev:aromatic-wren-52`
- URL: `http://localhost:5175`

### Production
- Environment variables in Vercel
- Convex deployment: `prod:your-prod-name`
- URL: Your Vercel domain

## Common Issues & Solutions

### Issue: "Failed to fetch" errors
**Solution**: Check that `VITE_CONVEX_URL` is set correctly in Vercel

### Issue: Auth not working in production
**Solution**: Ensure `CONVEX_SITE_URL` matches your Vercel URL exactly

### Issue: Build fails on Vercel
**Solution**:
1. Check build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Run `npm run build` locally to test

### Issue: Environment variables not updating
**Solution**: Redeploy after changing environment variables in Vercel

## Continuous Deployment

Once set up, every push to your main branch will:
1. Trigger a Vercel build
2. Deploy your frontend automatically
3. Use your production Convex deployment

To update Convex functions:
```bash
npx convex deploy --prod
```

## Monitoring

- **Frontend logs**: Vercel Dashboard → Your Project → Logs
- **Backend logs**: Convex Dashboard → Logs
- **Performance**: Vercel Analytics (optional, paid feature)

## Custom Domain

1. Go to Vercel project → **Settings** → **Domains**
2. Add your custom domain
3. Update DNS records as instructed
4. Update `CONVEX_SITE_URL` to match your custom domain

## Rollback

If something goes wrong:
```bash
# Rollback Vercel deployment
vercel rollback

# Rollback Convex (from dashboard only)
# Go to dashboard.convex.dev → Deployments → Select previous version
```

## Support

- Vercel Docs: https://vercel.com/docs
- Convex Docs: https://docs.convex.dev
- Convex Discord: https://convex.dev/community
