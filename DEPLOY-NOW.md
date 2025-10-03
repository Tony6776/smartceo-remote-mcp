# 🚀 DEPLOY NOW - Manual AWS Amplify Setup

## Quick Deployment Steps (5-10 minutes)

Your Remote MCP server is ready to deploy! Follow these steps:

---

## ✅ Step 1: Access AWS Amplify Console

Go to: **https://console.aws.amazon.com/amplify/**

---

## ✅ Step 2: Create New App

1. Click **"New app"** → **"Host web app"**
2. Choose **"GitHub"** as source provider
3. Click **"Continue"**
4. If prompted, authorize AWS Amplify to access your GitHub (should already be authorized)

---

## ✅ Step 3: Select Repository

1. **Repository**: Select **"Tony6776/smartceo-remote-mcp"**
2. **Branch**: Select **"main"**
3. Click **"Next"**

---

## ✅ Step 4: Configure App Settings

### App name:
```
smartceo-remote-mcp
```

### Build settings (should auto-detect amplify.yml):

If auto-detected, click **"Next"**

If NOT auto-detected, paste this:

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

### ⚠️ IMPORTANT: Enable SSR/Node.js Server

**Look for one of these options:**
- ✅ "Enable Server-Side Rendering (SSR)"
- ✅ "Node.js server"
- ✅ "Web Compute" platform

**This is CRITICAL** - the MCP server needs to run as a Node.js process, not static hosting!

---

## ✅ Step 5: Add Environment Variables

**BEFORE clicking "Save and deploy"**, scroll down to **"Environment variables"** section.

Click **"Add environment variable"** and add these:

### Required Variables:

| Variable Name | Value |
|--------------|-------|
| `PORT` | `3000` |
| `SUPABASE_URL` | `https://wwciglseudmbifvmfxva.supabase.co` |
| `SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3Y2lnbHNldWRtYmlmdm1meHZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc2NjI3OTksImV4cCI6MjA1MzIzODc5OX0.XBBiXbQF0yO78MDWYiACEGqD3nqg5PzUgcb23K0IWLM` |
| `IMAP_USER` | `tony@homelander.com.au` |
| `IMAP_PASSWORD` | `Tonytadros$6776` |
| `IMAP_HOST` | `mail.homelander.com.au` |
| `IMAP_PORT` | `993` |
| `SMTP_USER` | `susie@homelander.com.au` |
| `SMTP_PASSWORD` | `Homelander$2025` |
| `SMTP_HOST` | `mail.homelander.com.au` |
| `SMTP_PORT` | `587` |
| `CALENDAR_ICAL_URL` | `https://calendar.google.com/calendar/ical/tadros.tony1976%40gmail.com/public/basic.ics` |
| `N8N_API_URL` | `https://homelandersda.app.n8n.cloud/api/v1` |
| `N8N_API_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjYzVlODc2Yy0yMTFiLTQ5MDUtYjVkZi0xYzcxMzIyNmVkYTgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU4NDM1NjI2fQ.AlDcvX4qXDh3C4CtfLjKgorfFPoRJZKF_KcpGGOQ-1s` |

---

## ✅ Step 6: Save and Deploy

1. Click **"Save and deploy"**
2. ⏱️ Wait 3-5 minutes for build to complete
3. ✅ Once "main" branch shows **"Deployed"** status, continue

---

## ✅ Step 7: Get Amplify URL

After deployment completes, you'll see a URL like:

```
https://main.d1234abcd.amplifyapp.com
```

**Test the deployment:**

```bash
curl https://[your-amplify-url]/health
```

Should return:
```json
{
  "status": "ok",
  "service": "Remote MCP Server - SmartCEO Business System",
  "timestamp": "...",
  "tools": 8
}
```

✅ **If you see this, your Remote MCP server is LIVE!**

---

## ✅ Step 8: Connect Custom Domain (smartceo.com.au)

### Option A: Replace Existing RAG Site (Recommended)

Since `smartceo.com.au` currently hosts the broken RAG Action Watch, we'll replace it:

1. In your **NEW** Amplify app (smartceo-remote-mcp), click **"Domain management"**
2. Click **"Add domain"**
3. Enter: `smartceo.com.au`
4. Amplify will detect it's already in Route53
5. ⚠️ You may see a warning that domain is already in use
6. **Remove domain from OLD app first:**
   - Go to the **"rag-action-watch"** Amplify app
   - Click **"Domain management"**
   - Find `smartceo.com.au` → Click **"Actions"** → **"Remove domain"**
   - Confirm removal
7. **Go back to NEW app** (smartceo-remote-mcp)
8. Click **"Add domain"** again: `smartceo.com.au`
9. Select:
   - ✅ **Root domain**: smartceo.com.au → main
   - ✅ **www subdomain**: www.smartceo.com.au → main (optional)
10. Click **"Configure domain"** → **"Save"**

⏱️ **Wait 15-30 minutes** for:
- DNS propagation
- SSL certificate provisioning
- CloudFront distribution update

### Option B: Use Subdomain (Alternative)

If you want to keep the RAG site:

1. Add domain as: `mcp.smartceo.com.au`
2. This will create a subdomain for the MCP server
3. Update Claude settings to use: `https://mcp.smartceo.com.au/mcp/sse`

---

## ✅ Step 9: Verify HTTPS Endpoint

After DNS propagates (15-30 min), test:

```bash
# Health check
curl https://smartceo.com.au/health

# MCP SSE endpoint
curl https://smartceo.com.au/mcp/sse
```

✅ **If both work, you're ready for Claude!**

---

## ✅ Step 10: Add to Claude.ai

1. Go to: **https://claude.ai/settings**
2. Navigate to **"Developer"** or **"Integrations"**
3. Look for **"Custom Connectors"** or **"MCP Servers"**
4. Click **"Add connector"** or **"Add server"**
5. Fill in:
   - **Name**: `SmartCEO Business System`
   - **URL**: `https://smartceo.com.au/mcp/sse`
   - **Description**: `Complete business access - email, calendar, properties, database`
6. Click **"Save"**
7. Toggle **"Enabled"** to ON

⚡ **Settings sync automatically to:**
- ✅ Claude Mobile (iOS/Android)
- ✅ Claude Desktop (Mac/Windows/Linux)
- ✅ Claude Web (claude.ai)

---

## ✅ Step 11: Test from Claude Mobile

Open Claude Mobile app and ask:

```
Read my emails from today
```

```
What's on my calendar?
```

```
Show me a business snapshot
```

If these work, **DEPLOYMENT COMPLETE!** 🎉

---

## 🎉 SUCCESS CHECKLIST

- ✅ Amplify app created and deployed
- ✅ Environment variables configured
- ✅ Health endpoint returns 200 OK
- ✅ Domain smartceo.com.au points to new app
- ✅ HTTPS/SSL working
- ✅ Added to Claude.ai settings
- ✅ Tools working from Claude Mobile
- ✅ Full business system access via Claude!

---

## 🔧 Troubleshooting

### Build Fails

Check Amplify Console logs. Common issues:
- Missing environment variables
- Node.js version (needs 18+)
- npm install errors

**Fix**: Add `"engines": {"node": ">=18.0.0"}` in package.json (already done)

### Domain Not Working

- Wait 15-30 minutes for DNS propagation
- Check Route53 records
- Verify SSL certificate status in Amplify Console
- Try `nslookup smartceo.com.au`

### MCP Connection Fails

- Verify health endpoint works: `curl https://smartceo.com.au/health`
- Check exact URL in Claude settings: `https://smartceo.com.au/mcp/sse`
- Try removing and re-adding connector
- Check Amplify logs for errors

### Tools Return Errors

- Check Amplify Console logs
- Verify all environment variables are set
- Test credentials manually (email, Supabase)

---

## 📞 Support

If you need help:
- Check Amplify Console → "Monitoring" → "Logs"
- GitHub repo: https://github.com/Tony6776/smartceo-remote-mcp
- Email: tony@homelander.com.au

---

## 🚀 You're Done!

Your complete business system is now accessible via Claude Mobile, Web, and Desktop!

**Next steps:**
- Use Claude naturally to manage emails, calendar, properties
- Add more tools by updating index.js and pushing to GitHub
- Monitor usage in Amplify Console
- Scale as needed (Amplify handles this automatically)

**Enjoy your Claude-powered business system!** 🎉
