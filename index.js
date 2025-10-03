#!/usr/bin/env node

/**
 * REMOTE MCP SERVER FOR CLAUDE MOBILE
 * Exposes complete business system via SSE (Server-Sent Events)
 * URL: https://smartceo.com.au
 *
 * Provides Claude (Mobile/Web/Desktop) access to:
 * - Email management (IMAP/SMTP)
 * - Calendar & scheduling
 * - SDA property management
 * - CRM & lead tracking
 * - Business intelligence
 * - Supabase database
 * - N8N workflows
 * - All business tools
 */

import express from 'express';
import cors from 'cors';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import Imap from 'imap';
import { simpleParser } from 'mailparser';
import ical from 'node-ical';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Configuration
const SUPABASE_URL = 'https://wwciglseudmbifvmfxva.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3Y2lnbHNldWRtYmlmdm1meHZhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjYwNTc5OSwiZXhwIjoyMDY4MTgxNzk5fQ.Letj_MEjd6Bx5jhFYGDUWf2MxMQ3sPTHAJQqwu3dhLE';
const CALENDAR_URL = 'https://calendar.google.com/calendar/ical/tadros.tony1976%40gmail.com/private-f99f8f6f09b218acdd3ebc135c7e5211/basic.ics';
const N8N_API_URL = 'https://homelandersda.app.n8n.cloud/api/v1';
const N8N_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjYzVlODc2Yy0yMTFiLTQ5MDUtYjVkZi0xYzcxMzIyNmVkYTgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU4NDM1NjI2fQ.AlDcvX4qXDh3C4CtfLjKgorfFPoRJZKF_KcpGGOQ-1s';

// Email configuration
const IMAP_CONFIG = {
  user: 'tony@homelander.com.au',
  password: 'Tonytadros$6776',
  host: 'mail.homelander.com.au',
  port: 993,
  tls: true,
  tlsOptions: { rejectUnauthorized: false }
};

const SMTP_CONFIG = {
  host: 'mail.homelander.com.au',
  port: 587,
  secure: false,
  auth: {
    user: 'susie@homelander.com.au',
    pass: 'Homelander$2025'
  }
};

// Initialize clients
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const emailTransporter = nodemailer.createTransport(SMTP_CONFIG);

// MCP Server instance
let mcpServer = null;

// Tool implementations
class BusinessTools {

  // Email: Read emails via IMAP
  async readEmails(folder = 'INBOX', limit = 20, unreadOnly = true) {
    return new Promise((resolve, reject) => {
      const imap = new Imap(IMAP_CONFIG);
      const emails = [];

      imap.once('ready', () => {
        imap.openBox(folder, false, (err, box) => {
          if (err) { imap.end(); return reject(err); }

          const searchCriteria = unreadOnly ? ['UNSEEN'] : ['ALL'];

          imap.search(searchCriteria, (err, results) => {
            if (err) { imap.end(); return reject(err); }
            if (!results || results.length === 0) {
              imap.end();
              return resolve({ emails: [], count: 0, folder });
            }

            const fetchLimit = results.slice(-limit);
            const fetch = imap.fetch(fetchLimit, { bodies: '', markSeen: false });

            fetch.on('message', (msg, seqno) => {
              msg.on('body', (stream) => {
                simpleParser(stream, (err, parsed) => {
                  if (err) return;
                  emails.push({
                    id: seqno,
                    from: parsed.from?.text || 'Unknown',
                    to: parsed.to?.text || '',
                    subject: parsed.subject || 'No Subject',
                    date: parsed.date?.toISOString() || new Date().toISOString(),
                    text: parsed.text?.substring(0, 500) || '',
                    attachments: parsed.attachments?.length || 0
                  });
                });
              });
            });

            fetch.once('end', () => {
              setTimeout(() => {
                imap.end();
                resolve({
                  emails: emails.sort((a, b) => new Date(b.date) - new Date(a.date)),
                  count: emails.length,
                  folder
                });
              }, 500);
            });
          });
        });
      });

      imap.once('error', reject);
      imap.connect();
    });
  }

  // Email: Sort and categorize
  async sortEmails(limit = 50) {
    const emailData = await this.readEmails('INBOX', limit, false);
    const emails = emailData.emails;

    const categories = {
      urgent_investor: [],
      property_inquiry: [],
      sda_related: [],
      lead_followup: [],
      vendor_supplier: [],
      internal_team: [],
      general: [],
      low_priority: []
    };

    const urgencyKeywords = ['urgent', 'asap', 'immediate', 'critical', 'important'];
    const investorKeywords = ['investor', 'investment', 'portfolio', 'returns', 'capital'];
    const propertyKeywords = ['property', 'viewing', 'inspection', 'lease', 'rental', 'tenant'];
    const sdaKeywords = ['sda', 'ndis', 'disability', 'participant', 'support coordinator'];
    const leadKeywords = ['interested', 'inquiry', 'question', 'looking for', 'want to know'];

    for (const email of emails) {
      const content = `${email.subject} ${email.text}`.toLowerCase();

      if (urgencyKeywords.some(kw => content.includes(kw)) &&
          investorKeywords.some(kw => content.includes(kw))) {
        categories.urgent_investor.push({ ...email, priority: 10 });
      } else if (sdaKeywords.some(kw => content.includes(kw))) {
        categories.sda_related.push({ ...email, priority: 8 });
      } else if (propertyKeywords.some(kw => content.includes(kw))) {
        categories.property_inquiry.push({ ...email, priority: 7 });
      } else if (leadKeywords.some(kw => content.includes(kw))) {
        categories.lead_followup.push({ ...email, priority: 6 });
      } else {
        categories.general.push({ ...email, priority: 5 });
      }
    }

    return {
      total_emails: emails.length,
      categories,
      summary: `Sorted ${emails.length} emails into ${Object.keys(categories).filter(k => categories[k].length > 0).length} active categories`
    };
  }

  // Calendar: Get today's events
  async getCalendar() {
    try {
      const response = await axios.get(CALENDAR_URL);
      const events = ical.sync.parseICS(response.data);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayEvents = Object.values(events)
        .filter(event => event.type === 'VEVENT')
        .filter(event => {
          const start = new Date(event.start);
          return start >= today && start < tomorrow;
        })
        .map(event => ({
          summary: event.summary,
          start: event.start,
          end: event.end,
          location: event.location || 'No location',
          description: event.description || ''
        }))
        .sort((a, b) => new Date(a.start) - new Date(b.start));

      return {
        date: today.toISOString().split('T')[0],
        events: todayEvents,
        count: todayEvents.length
      };
    } catch (error) {
      return { error: error.message, events: [], count: 0 };
    }
  }

  // Business: Daily snapshot
  async getBusinessSnapshot() {
    const today = new Date().toISOString().split('T')[0];

    const [emailSummary, calendarData] = await Promise.all([
      this.sortEmails(20),
      this.getCalendar()
    ]);

    // Get property data from Supabase
    const { data: properties } = await supabase
      .from('living_well_properties')
      .select('*')
      .eq('status', 'available')
      .limit(10);

    return {
      date: today,
      urgent_emails: emailSummary.categories.urgent_investor.length,
      sda_inquiries: emailSummary.categories.sda_related.length,
      property_inquiries: emailSummary.categories.property_inquiry.length,
      total_unread_emails: emailSummary.total_emails,
      todays_events: calendarData.count,
      hot_properties: properties?.length || 0,
      summary: `${emailSummary.categories.urgent_investor.length} urgent items, ${calendarData.count} events today, ${properties?.length || 0} active properties`
    };
  }

  // Properties: Search SDA properties
  async searchProperties(filters = {}) {
    let query = supabase.from('living_well_properties').select('*');

    if (filters.maxPrice) {
      query = query.lte('price', filters.maxPrice);
    }
    if (filters.minPrice) {
      query = query.gte('price', filters.minPrice);
    }
    if (filters.suburb) {
      query = query.ilike('suburb', `%${filters.suburb}%`);
    }
    if (filters.bedrooms) {
      query = query.eq('bedrooms', filters.bedrooms);
    }
    if (filters.sdaCompliant) {
      query = query.eq('sda_compliant', true);
    }

    const { data, error } = await query.limit(50);

    if (error) return { error: error.message, properties: [] };

    return {
      properties: data,
      count: data.length,
      filters: filters
    };
  }

  // Email: Send business email
  async sendEmail(to, subject, body) {
    try {
      await emailTransporter.sendMail({
        from: 'susie@homelander.com.au',
        to,
        subject,
        text: body
      });
      return { success: true, message: `Email sent to ${to}` };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // N8N: Trigger workflow
  async triggerWorkflow(workflowId, data = {}) {
    try {
      const response = await axios.post(
        `${N8N_API_URL}/workflows/${workflowId}/execute`,
        data,
        {
          headers: {
            'X-N8N-API-KEY': N8N_API_KEY,
            'Content-Type': 'application/json'
          }
        }
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Database: Query Supabase
  async queryDatabase(table, filters = {}) {
    try {
      let query = supabase.from(table).select('*');

      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });

      const { data, error } = await query.limit(100);

      if (error) return { error: error.message, data: [] };
      return { data, count: data.length };
    } catch (error) {
      return { error: error.message, data: [] };
    }
  }
}

const tools = new BusinessTools();

// Create MCP Server
function createMCPServer() {
  const server = new Server(
    {
      name: 'smartceo-business-system',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      }
    }
  );

  // List available tools
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: 'read_emails',
          description: 'Read emails from tony@homelander.com.au inbox. Shows unread emails by default.',
          inputSchema: {
            type: 'object',
            properties: {
              folder: { type: 'string', enum: ['INBOX', 'Sent'], default: 'INBOX' },
              limit: { type: 'number', default: 20 },
              unread_only: { type: 'boolean', default: true }
            }
          }
        },
        {
          name: 'sort_emails',
          description: 'Sort and categorize emails by priority: urgent investor, SDA inquiries, property inquiries, leads, etc.',
          inputSchema: {
            type: 'object',
            properties: {
              limit: { type: 'number', default: 50 }
            }
          }
        },
        {
          name: 'get_calendar',
          description: 'Get today\'s calendar events and appointments from Google Calendar',
          inputSchema: { type: 'object', properties: {} }
        },
        {
          name: 'business_snapshot',
          description: 'Get daily business overview: urgent emails, events, hot properties, SDA inquiries',
          inputSchema: { type: 'object', properties: {} }
        },
        {
          name: 'search_properties',
          description: 'Search SDA properties in database. Filter by price, suburb, bedrooms, SDA compliance.',
          inputSchema: {
            type: 'object',
            properties: {
              maxPrice: { type: 'number', description: 'Maximum price' },
              minPrice: { type: 'number', description: 'Minimum price' },
              suburb: { type: 'string', description: 'Suburb name (partial match)' },
              bedrooms: { type: 'number', description: 'Number of bedrooms' },
              sdaCompliant: { type: 'boolean', description: 'SDA compliant only', default: true }
            }
          }
        },
        {
          name: 'send_email',
          description: 'Send business email from susie@homelander.com.au',
          inputSchema: {
            type: 'object',
            properties: {
              to: { type: 'string', description: 'Recipient email address' },
              subject: { type: 'string', description: 'Email subject' },
              body: { type: 'string', description: 'Email body text' }
            },
            required: ['to', 'subject', 'body']
          }
        },
        {
          name: 'trigger_workflow',
          description: 'Trigger N8N workflow by ID. Available workflows: property analysis, lead processing, etc.',
          inputSchema: {
            type: 'object',
            properties: {
              workflowId: { type: 'string', description: 'N8N workflow ID' },
              data: { type: 'object', description: 'Data to pass to workflow' }
            },
            required: ['workflowId']
          }
        },
        {
          name: 'query_database',
          description: 'Query Supabase database tables: living_well_properties, clients, leads, participants, etc.',
          inputSchema: {
            type: 'object',
            properties: {
              table: { type: 'string', description: 'Table name' },
              filters: { type: 'object', description: 'Filter conditions (key-value pairs)' }
            },
            required: ['table']
          }
        }
      ]
    };
  });

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      let result;

      switch (name) {
        case 'read_emails':
          result = await tools.readEmails(args.folder, args.limit, args.unread_only);
          break;

        case 'sort_emails':
          result = await tools.sortEmails(args.limit);
          break;

        case 'get_calendar':
          result = await tools.getCalendar();
          break;

        case 'business_snapshot':
          result = await tools.getBusinessSnapshot();
          break;

        case 'search_properties':
          result = await tools.searchProperties(args);
          break;

        case 'send_email':
          result = await tools.sendEmail(args.to, args.subject, args.body);
          break;

        case 'trigger_workflow':
          result = await tools.triggerWorkflow(args.workflowId, args.data);
          break;

        case 'query_database':
          result = await tools.queryDatabase(args.table, args.filters);
          break;

        default:
          throw new Error(`Unknown tool: ${name}`);
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ error: error.message }, null, 2)
          }
        ],
        isError: true
      };
    }
  });

  return server;
}

// SSE endpoint for Remote MCP
app.get('/mcp/sse', (req, res) => {
  console.log('📡 New MCP SSE connection from Claude');

  // Set SSE headers manually before creating transport
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });

  try {
    if (!mcpServer) {
      mcpServer = createMCPServer();
    }

    // Create transport with the response that already has headers set
    const transport = new SSEServerTransport('/mcp/messages', res);

    req.on('close', () => {
      console.log('🔌 SSE connection closed');
    });

    // Connect asynchronously
    mcpServer.connect(transport).then(() => {
      console.log('✅ MCP Server connected');
    }).catch((error) => {
      console.error('❌ MCP connection error:', error);
    });
  } catch (error) {
    console.error('❌ MCP setup error:', error);
    res.write(`event: error\ndata: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
});

// POST endpoint for Remote MCP messages
app.post('/mcp/messages', async (req, res) => {
  console.log('📨 MCP message received:', req.body?.method);
  // Messages are handled by SSE transport
  res.status(202).send();
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Remote MCP Server - SmartCEO Business System',
    timestamp: new Date().toISOString(),
    tools: 8
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'SmartCEO Business System - Remote MCP Server',
    version: '1.0.0',
    mcp_endpoint: '/mcp/sse',
    tools: [
      'read_emails',
      'sort_emails',
      'get_calendar',
      'business_snapshot',
      'search_properties',
      'send_email',
      'trigger_workflow',
      'query_database'
    ],
    status: 'operational'
  });
});

// Start server
const PORT_TO_USE = process.env.PORT || PORT;
app.listen(PORT_TO_USE, () => {
  console.log('🚀 Remote MCP Server Started');
  console.log(`📍 Server: http://localhost:${PORT_TO_USE}`);
  console.log(`🔗 MCP SSE: http://localhost:${PORT_TO_USE}/mcp/sse`);
  console.log(`📧 Email: tony@homelander.com.au`);
  console.log(`📊 Database: Supabase connected`);
  console.log(`📅 Calendar: Google Calendar integrated`);
  console.log(`🔧 Tools: 8 business tools available`);
  console.log('');
  console.log('✅ Ready for Claude Mobile/Web/Desktop connections');
});
