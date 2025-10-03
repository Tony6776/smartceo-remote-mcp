# 🎯 CONSOLE DEPLOYMENT - AWS Amplify Setup Complete

## ✅ AMPLIFY APP CREATED AND CONFIGURED

I've already created and configured your Amplify app via AWS CLI!

### ✅ App Details

- **App ID**: `d3jz63jbc4nwh1`
- **App Name**: smartceo-remote-mcp
- **Platform**: WEB_COMPUTE (Node.js server support)
- **Default Domain**: https://d3jz63jbc4nwh1.amplifyapp.com
- **Region**: us-west-2
- **Status**: ✅ CREATED with all environment variables configured

### ✅ Environment Variables - ALL CONFIGURED

All 14 environment variables are already set in the Amplify app:

✅ PORT=3000
✅ SUPABASE_URL=https://wwciglseudmbifvmfxva.supabase.co
✅ SUPABASE_ANON_KEY=[configured]
✅ IMAP_USER=tony@homelander.com.au
✅ IMAP_PASSWORD=Tonytadros$6776
✅ IMAP_HOST=mail.homelander.com.au
✅ IMAP_PORT=993
✅ SMTP_USER=susie@homelander.com.au
✅ SMTP_PASSWORD=Homelander$2025
✅ SMTP_HOST=mail.homelander.com.au
✅ SMTP_PORT=587
✅ CALENDAR_ICAL_URL=[configured]
✅ N8N_API_URL=https://homelandersda.app.n8n.cloud/api/v1
✅ N8N_API_KEY=[configured]

---

## 🚀 FINAL STEPS - Manual Web Console (5 minutes)

Since AWS CLI has limitations with GitHub OAuth, complete these final steps in the web console:

### Step 1: Open Your Amplify App

Go to: **https://console.aws.amazon.com/amplify/home?region=us-west-2#/d3jz63jbc4nwh1**

Or navigate:
1. https://console.aws.amazon.com/amplify/
2. Click on "smartceo-remote-mcp"

### Step 2: Connect GitHub Repository

1. Click **"Hosting environments"** tab (or "App settings" → "General")
2. Look for **"Connect repository"** or **"Connect GitHub"** button
3. Click it and authorize GitHub if needed
4. Select:
   - **Repository**: Tony6776/smartceo-remote-mcp
   - **Branch**: main
5. Click **"Next"** or **"Save"**

### Step 3: Verify Build Settings

The build settings should auto-detect from `amplify.yml`:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - echo "Build completed"
  artifacts:
    baseDirectory: /
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

**Important**: Ensure it's set to **"Node.js" or "Web Compute"** (not static hosting)

### Step 4: Deploy

1. Click **"Save and deploy"** (if connecting repo) or **"Redeploy this version"**
2. Or manually trigger: **"Actions"** → **"Redeploy"**
3. Watch the build logs (takes 3-5 minutes)

### Step 5: Verify Deployment

Once deployment completes, test:

```bash
# Test default Amplify domain
curl https://d3jz63jbc4nwh1.amplifyapp.com/health

# Should return:
{
  "status": "ok",
  "service": "Remote MCP Server - SmartCEO Business System",
  "timestamp": "...",
  "tools": 8
}
```

---

## 🌐 CONNECT DOMAIN: smartceo.com.au

### Option A: Replace RAG Site (Recommended)

1. **Remove domain from old app** first:
   - Go to: https://console.aws.amazon.com/amplify/home?region=us-west-2#/d3aqfqz4bjz5zy
   - Click **"Domain management"**
   - Find `smartceo.com.au` → **"Actions"** → **"Remove domain"**
   - Confirm

2. **Add to new app**:
   - Go to: https://console.aws.amazon.com/amplify/home?region=us-west-2#/d3jz63jbc4nwh1
   - Click **"Domain management"**
   - Click **"Add domain"**
   - Enter: `smartceo.com.au`
   - Amplify will auto-detect Route53
   - Select:
     - ✅ Root: smartceo.com.au → main
     - ✅ www: www.smartceo.com.au → main (optional)
   - Click **"Configure domain"** → **"Save"**

3. **Wait for DNS** (15-30 minutes):
   - SSL certificate provisioning
   - CloudFront distribution update
   - DNS propagation

### Option B: Use Subdomain

If you want to keep RAG site:

1. Add domain as: `mcp.smartceo.com.au`
2. Use MCP URL: `https://mcp.smartceo.com.au/mcp/sse`

---

## 🎯 ADD TO CLAUDE.AI

Once domain is working (https://smartceo.com.au/health returns 200):

1. Go to: **https://claude.ai/settings**
2. Find **"Developer"** or **"Integrations"** section
3. Look for **"Custom Connectors"** or **"MCP Servers"**
4. Click **"Add connector"**
5. Fill in:
   - **Name**: SmartCEO Business System
   - **URL**: `https://smartceo.com.au/mcp/sse`
   - **Description**: Complete business access
6. **Save** and toggle **ON**

Settings sync to Claude Mobile/Desktop/Web automatically!

---

## ✅ TEST FROM CLAUDE MOBILE

Open Claude Mobile and ask:

```
Read my emails from today
```

```
What's on my calendar?
```

```
Show me a business snapshot
```

If these work: **DEPLOYMENT COMPLETE!** 🎉

---

## 📊 WHAT'S BEEN AUTOMATED

✅ Amplify app created (d3jz63jbc4nwh1)
✅ Web Compute platform enabled (Node.js server)
✅ All 14 environment variables configured
✅ Branch created (main)
✅ Auto-build enabled
✅ Framework set to Node.js
✅ Webhook created for GitHub (manual connection needed)
✅ Build settings ready (amplify.yml)

**What you need to do manually:**
1. Connect GitHub repo in web console (3 clicks)
2. Trigger first deployment (1 click)
3. Connect smartceo.com.au domain (remove from old app, add to new)
4. Add to claude.ai settings

**Time: ~10-15 minutes + 30 min DNS wait**

---

## 🔧 ALTERNATIVE: Manual Deployment Via ZIP

If GitHub connection has issues, you can deploy via ZIP:

```bash
cd /Users/tt/Documents/claude-code/remote-mcp-server
zip -r deploy.zip . -x "*.git*" -x "node_modules/*"

# Then upload via Amplify Console → "Manual deploy"
```

---

## 🆘 TROUBLESHOOTING

### Build Fails

Check Amplify Console logs. Common issues:
- Missing environment variables (already configured ✅)
- Wrong platform (set to WEB_COMPUTE ✅)
- npm install errors (check logs)

### Domain Issues

- Wait 30 minutes for DNS
- Verify Route53 records
- Check SSL certificate status

### MCP Connection Fails

- Verify `/health` endpoint works
- Check exact URL in Claude settings
- Try removing and re-adding connector

---

## 📞 NEXT STEPS

1. **Now**: Open Amplify Console → Connect GitHub → Deploy
2. **+5 min**: Verify deployment at default Amplify URL
3. **+10 min**: Connect smartceo.com.au domain
4. **+40 min**: DNS propagates
5. **+45 min**: Add to claude.ai settings
6. **+46 min**: Test from Claude Mobile!

**Total: ~50 minutes to full deployment**

---

## 🎉 SUMMARY

Your Remote MCP server is **95% deployed**!

**What's done:**
- ✅ Code written and tested locally
- ✅ GitHub repo created and pushed
- ✅ Amplify app created and configured
- ✅ All environment variables set
- ✅ Build configuration ready

**What's left:**
- 🔄 Connect GitHub repo (3 clicks in web console)
- 🔄 Deploy (automatic after connection)
- 🔄 Connect domain (10 minutes)
- 🔄 Add to Claude.ai (5 minutes)

**You're minutes away from Claude-powered business system access!** 🚀
