# AWS Amplify Deployment Guide

## 🚀 Deploy Remote MCP Server to smartceo.com.au

This guide walks through deploying the Remote MCP server to AWS Amplify with your existing domain.

---

## Step 1: Access AWS Amplify Console

1. Go to: https://console.aws.amazon.com/amplify/
2. Sign in with your AWS account
3. Select your region (same as where smartceo.com.au is hosted)

---

## Step 2: Create New Amplify App

1. Click **"New app"** → **"Host web app"**
2. Select **"GitHub"** as source
3. Authorize AWS Amplify to access your GitHub account (if not already done)
4. Select repository: **Tony6776/smartceo-remote-mcp**
5. Select branch: **main**
6. Click **"Next"**

---

## Step 3: Configure Build Settings

Amplify should auto-detect `amplify.yml`. If not, use these settings:

**Build configuration:**
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

**Advanced settings:**
- Check **"Enable Server-Side Rendering (SSR)"** or **"Node.js server"**
- Build command: `npm install`
- Start command: `node index.js`

Click **"Next"**

---

## Step 4: Configure Environment Variables

Before deploying, add these environment variables in Amplify Console:

1. Go to **"Environment variables"** section
2. Add the following variables:

```
PORT=3000
SUPABASE_URL=https://wwciglseudmbifvmfxva.supabase.co
SUPABASE_ANON_KEY=[your_supabase_anon_key]
IMAP_USER=tony@homelander.com.au
IMAP_PASSWORD=Tonytadros$6776
IMAP_HOST=mail.homelander.com.au
IMAP_PORT=993
SMTP_USER=susie@homelander.com.au
SMTP_PASSWORD=Homelander$2025
SMTP_HOST=mail.homelander.com.au
SMTP_PORT=587
CALENDAR_ICAL_URL=[your_google_calendar_ical_url]
N8N_API_URL=https://homelandersda.app.n8n.cloud/api/v1
N8N_API_KEY=[your_n8n_api_key]
```

**Important:** Replace placeholder values with actual credentials.

---

## Step 5: Deploy

1. Click **"Save and deploy"**
2. Wait for build to complete (usually 2-5 minutes)
3. Once deployed, you'll get an Amplify URL like: `https://main.d1234abcd.amplifyapp.com`

---

## Step 6: Connect Custom Domain (smartceo.com.au)

### Option A: If domain is already in Route53

1. In Amplify Console, go to **"Domain management"**
2. Click **"Add domain"**
3. Enter: `smartceo.com.au`
4. Amplify will auto-detect Route53 hosted zone
5. Select subdomain options:
   - **Root domain**: smartceo.com.au → main branch
   - **www subdomain**: www.smartceo.com.au → main branch (optional)
6. Click **"Configure domain"**
7. Click **"Save"**

Amplify will automatically:
- Create/update DNS records in Route53
- Provision SSL certificate via AWS Certificate Manager
- Configure CloudFront distribution
- Update DNS to point to Amplify

**Wait time:** 15-30 minutes for DNS propagation and SSL certificate

### Option B: Manual DNS Configuration

If Amplify doesn't auto-configure:

1. Note the Amplify app domain (e.g., `d1234abcd.amplifyapp.com`)
2. Go to Route53: https://console.aws.amazon.com/route53/
3. Select hosted zone: `smartceo.com.au`
4. Update or create these records:

**A Record (Root domain):**
- Name: `smartceo.com.au`
- Type: A - IPv4 address
- Alias: Yes
- Alias Target: [Amplify CloudFront distribution]

**CNAME Record (www subdomain - optional):**
- Name: `www.smartceo.com.au`
- Type: CNAME
- Value: `d1234abcd.amplifyapp.com`

5. Save changes

---

## Step 7: Verify Deployment

### Test HTTPS Endpoint

Wait for DNS propagation (can take 5-30 minutes), then test:

```bash
# Health check
curl https://smartceo.com.au/health

# Expected response:
{
  "status": "ok",
  "service": "Remote MCP Server - SmartCEO Business System",
  "timestamp": "2025-10-03T...",
  "tools": 8
}
```

### Test MCP SSE Endpoint

```bash
curl https://smartceo.com.au/mcp/sse
```

Should return SSE stream headers.

---

## Step 8: Add to Claude.ai Settings

Once `https://smartceo.com.au` is working:

1. Go to: https://claude.ai/settings
2. Navigate to **"Developer"** → **"Custom Connectors"** (or "Integrations")
3. Click **"Add connector"**
4. Fill in:
   - **Name**: SmartCEO Business System
   - **URL**: `https://smartceo.com.au/mcp/sse`
   - **Description**: Complete business system access (email, calendar, database, workflows)
5. Click **"Save"**
6. Toggle connector **ON**

Settings sync automatically to:
- ✅ Claude Mobile (iOS/Android)
- ✅ Claude Desktop
- ✅ Claude Web

---

## Step 9: Test from Claude

Open Claude Mobile/Web/Desktop and try:

```
Read my emails from today
```

```
What's on my calendar?
```

```
Show me business snapshot
```

```
Search for properties in Melbourne
```

If tools work, deployment is successful! 🎉

---

## Troubleshooting

### Build fails

- Check build logs in Amplify Console
- Verify `package.json` and `amplify.yml` are correct
- Ensure Node.js version is 18+

### Environment variables not working

- Double-check all env vars are set in Amplify Console
- Redeploy after adding/changing env vars
- Check server logs in Amplify Console

### Domain not resolving

- Wait 15-30 minutes for DNS propagation
- Verify Route53 records are correct
- Check SSL certificate status in Amplify Console
- Try `nslookup smartceo.com.au` to verify DNS

### MCP connection fails

- Verify HTTPS endpoint works: `curl https://smartceo.com.au/health`
- Check Claude.ai settings has correct URL
- Ensure URL is exactly: `https://smartceo.com.au/mcp/sse`
- Try removing and re-adding connector in Claude settings

### Tools return errors

- Check Amplify Console logs for server errors
- Verify environment variables (email passwords, API keys)
- Test individual endpoints via curl
- Check Supabase/N8N/Email credentials are correct

---

## Monitoring

### Amplify Console Logs

1. Go to Amplify Console
2. Select your app
3. Click **"Monitoring"**
4. View logs, metrics, and errors

### Check Server Status

```bash
curl https://smartceo.com.au/health
```

---

## Updating the Server

Changes pushed to GitHub `main` branch auto-deploy:

```bash
cd /Users/tt/Documents/claude-code/remote-mcp-server
git add .
git commit -m "Update server"
git push origin main
```

Amplify automatically:
1. Detects GitHub push
2. Runs build
3. Deploys to production
4. Updates https://smartceo.com.au

---

## Next Steps

1. ✅ Server deployed to smartceo.com.au
2. ✅ Claude connected via claude.ai settings
3. ✅ Test all 8 business tools
4. 🔄 Add more tools as needed (just update `index.js` and push)
5. 🔄 Monitor usage and optimize

---

## Support

For issues:
- Check Amplify Console logs first
- Review troubleshooting section above
- Contact: tony@homelander.com.au

---

**Deployment Target:** https://smartceo.com.au
**GitHub Repo:** https://github.com/Tony6776/smartceo-remote-mcp
**Protocol:** Remote MCP with SSE transport
**Infrastructure:** AWS Amplify + Route53 + CloudFront + Certificate Manager
