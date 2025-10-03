# Remote MCP Server - SmartCEO Business System

Complete business system access for Claude Mobile, Web, and Desktop via Remote MCP (Model Context Protocol).

## 🚀 Features

This Remote MCP server provides Claude with access to your entire business system:

### 📧 Email Management
- **Read Emails** - IMAP access to tony@homelander.com.au
- **Sort Emails** - Intelligent categorization by priority (investor, property inquiries, SDA, leads)
- **Send Emails** - SMTP sending from susie@homelander.com.au

### 📅 Calendar
- **Get Calendar** - Today's Google Calendar events via iCal integration

### 📊 Business Intelligence
- **Business Snapshot** - Daily overview of key metrics, unread emails, calendar, hot leads
- **Search Properties** - Query SDA properties in Supabase database
- **Query Database** - Generic Supabase queries for any table

### 🔧 Automation
- **Trigger Workflow** - Execute N8N workflows via API

## 🔗 Endpoints

- `GET /` - Server info and available tools
- `GET /health` - Health check
- `GET /mcp/sse` - MCP Server-Sent Events (Claude connects here)
- `POST /mcp/messages` - MCP message handling

## 📦 Installation

```bash
npm install
```

## ⚙️ Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Required environment variables:
- Supabase credentials
- IMAP credentials (tony@homelander.com.au)
- SMTP credentials (susie@homelander.com.au)
- Google Calendar iCal URL
- N8N API credentials

## 🏃 Running

```bash
# Development
npm run dev

# Production
npm start
```

Server will start on `http://localhost:3000` (or PORT environment variable).

## 🌐 Deployment to AWS Amplify

This server is designed to be deployed to AWS Amplify and served at `https://smartceo.com.au`.

### Deploy Steps:

1. Push code to GitHub repository
2. Connect repository to AWS Amplify
3. Configure environment variables in Amplify console
4. Deploy automatically via GitHub integration

## 🔐 Connecting Claude

Once deployed to `https://smartceo.com.au`:

1. Go to https://claude.ai/settings
2. Navigate to "Developer" → "Custom Connectors"
3. Add new connector:
   - **Name**: SmartCEO Business System
   - **URL**: `https://smartceo.com.au/mcp/sse`
4. Save and enable

Settings sync automatically to Claude Mobile, Desktop, and Web.

## 🛠️ Available Tools

1. **read_emails** - Read emails from IMAP inbox
2. **sort_emails** - Categorize emails by priority/type
3. **get_calendar** - Get today's calendar events
4. **business_snapshot** - Daily business overview
5. **search_properties** - Search SDA properties
6. **send_email** - Send emails via SMTP
7. **trigger_workflow** - Execute N8N workflows
8. **query_database** - Query Supabase tables

## 📱 Usage

Once connected, use Claude naturally:

- "Read my emails from today"
- "What's on my calendar?"
- "Show me business snapshot"
- "Search for properties in Melbourne"
- "Send email to john@example.com with subject..."
- "Query the leads table where status is active"

## 🔧 Tech Stack

- **Node.js 18+** with ES modules
- **Express.js** - Web framework
- **@modelcontextprotocol/sdk** - MCP SDK with SSE transport
- **Supabase** - PostgreSQL database
- **Nodemailer** - SMTP email sending
- **node-imap** - IMAP email reading
- **node-ical** - Google Calendar integration
- **Axios** - N8N API calls

## 📄 License

Private - Tony Tadros / SmartCEO

## 🆘 Support

For issues or questions, contact: tony@homelander.com.au
