/**
 * SDA PROPERTY ADMIN EXTENSION FOR REMOTE MCP SERVER
 *
 * Adds new tools for accessing:
 * - New Supabase instance (bqvptfdxnrzculgjcnjo.supabase.co)
 * - Tenancies table
 * - NDIA Payment Batches
 * - Landlord Statements
 * - Rental Payments
 * - Maintenance Requests
 *
 * Import this into index.js to extend the remote MCP server
 */

import { createClient } from '@supabase/supabase-js';

const SDA_ADMIN_URL = 'https://bqvptfdxnrzculgjcnjo.supabase.co';
const SDA_ADMIN_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxdnB0ZmR4bnJ6Y3VsZ2pjbmpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMjY5NDAsImV4cCI6MjA2OTgwMjk0MH0.I10e1TQkVntpEm3KSXmydNJQLbhJQ3MU4SyMt1lOvOk';

const sdaAdminClient = createClient(SDA_ADMIN_URL, SDA_ADMIN_KEY);

export class SDAPropertyAdminTools {
  /**
   * Get all participants from new SDA Admin system
   */
  async getParticipants(filters = {}) {
    try {
      let query = sdaAdminClient.from('participants').select('*');

      if (filters.status) query = query.eq('status', filters.status);
      if (filters.limit) query = query.limit(filters.limit);

      const { data, error } = await query;

      if (error) throw error;

      return {
        success: true,
        data,
        count: data?.length || 0,
        source: 'sda-admin-db',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get all landlords
   */
  async getLandlords(filters = {}) {
    try {
      let query = sdaAdminClient.from('landlords').select('*');

      if (filters.ndis_registered !== undefined) {
        query = query.eq('ndis_registered', filters.ndis_registered);
      }

      const { data, error } = await query;

      if (error) throw error;

      return {
        success: true,
        data,
        count: data?.length || 0,
        source: 'sda-admin-db',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get all investors
   */
  async getInvestors() {
    try {
      const { data, error } = await sdaAdminClient.from('investors').select('*');

      if (error) throw error;

      return {
        success: true,
        data,
        count: data?.length || 0,
        source: 'sda-admin-db',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get properties from new admin system
   */
  async getProperties(filters = {}) {
    try {
      let query = sdaAdminClient.from('properties').select('*');

      if (filters.status) query = query.eq('status', filters.status);
      if (filters.visible_on_participant_site !== undefined) {
        query = query.eq('visible_on_participant_site', filters.visible_on_participant_site);
      }
      if (filters.limit) query = query.limit(filters.limit);

      const { data, error } = await query;

      if (error) throw error;

      return {
        success: true,
        data,
        count: data?.length || 0,
        source: 'sda-admin-db',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get PLCG jobs (investment opportunities)
   */
  async getJobs(filters = {}) {
    try {
      let query = sdaAdminClient.from('jobs').select('*');

      if (filters.status) query = query.eq('status', filters.status);

      const { data, error } = await query;

      if (error) throw error;

      return {
        success: true,
        data,
        count: data?.length || 0,
        source: 'sda-admin-db',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get tenancies with full relationships
   */
  async getTenancies(filters = {}) {
    try {
      let query = sdaAdminClient
        .from('tenancies')
        .select('*, properties(*), participants(*), landlords(*)');

      if (filters.status) query = query.eq('status', filters.status);

      const { data, error } = await query;

      if (error) throw error;

      return {
        success: true,
        data,
        count: data?.length || 0,
        source: 'sda-admin-db',
        summary: {
          active: data?.filter(t => t.status === 'active').length || 0,
          pending: data?.filter(t => t.status === 'pending').length || 0,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get NDIA payment batches
   */
  async getNDIABatches(filters = {}) {
    try {
      let query = sdaAdminClient.from('ndia_payment_batches').select('*');

      if (filters.status) query = query.eq('status', filters.status);

      const { data, error } = await query.order('batch_date', { ascending: false });

      if (error) throw error;

      return {
        success: true,
        data,
        count: data?.length || 0,
        source: 'sda-admin-db',
        summary: {
          draft: data?.filter(b => b.status === 'draft').length || 0,
          submitted: data?.filter(b => b.status === 'submitted').length || 0,
          paid: data?.filter(b => b.status === 'paid').length || 0,
          totalAmount: data?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get rental payments
   */
  async getRentalPayments(filters = {}) {
    try {
      let query = sdaAdminClient.from('rental_payments').select('*, tenancies(*), participants(*), landlords(*)');

      if (filters.status) query = query.eq('status', filters.status);
      if (filters.tenancy_id) query = query.eq('tenancy_id', filters.tenancy_id);

      const { data, error } = await query.order('due_date', { ascending: false });

      if (error) throw error;

      return {
        success: true,
        data,
        count: data?.length || 0,
        source: 'sda-admin-db',
        summary: {
          pending: data?.filter(p => p.status === 'pending').length || 0,
          paid: data?.filter(p => p.status === 'paid').length || 0,
          overdue: data?.filter(p => p.status === 'overdue').length || 0,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get maintenance requests
   */
  async getMaintenanceRequests(filters = {}) {
    try {
      let query = sdaAdminClient.from('maintenance_requests').select('*, properties(*), landlords(*)');

      if (filters.status) query = query.eq('status', filters.status);
      if (filters.priority) query = query.eq('priority', filters.priority);
      if (filters.property_id) query = query.eq('property_id', filters.property_id);

      const { data, error } = await query.order('reported_date', { ascending: false });

      if (error) throw error;

      return {
        success: true,
        data,
        count: data?.length || 0,
        source: 'sda-admin-db',
        summary: {
          submitted: data?.filter(m => m.status === 'submitted').length || 0,
          in_progress: data?.filter(m => m.status === 'in_progress').length || 0,
          completed: data?.filter(m => m.status === 'completed').length || 0,
          emergency: data?.filter(m => m.priority === 'emergency').length || 0,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get landlord statements
   */
  async getLandlordStatements(filters = {}) {
    try {
      let query = sdaAdminClient.from('landlord_statements').select('*, landlords(*)');

      if (filters.landlord_id) query = query.eq('landlord_id', filters.landlord_id);
      if (filters.statement_type) query = query.eq('statement_type', filters.statement_type);

      const { data, error } = await query.order('period_end', { ascending: false });

      if (error) throw error;

      return {
        success: true,
        data,
        count: data?.length || 0,
        source: 'sda-admin-db',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Generate NDIA payment batch
   */
  async generateNDIABatch(organizationId = 'homelander') {
    try {
      const response = await fetch(`${SDA_ADMIN_URL}/functions/v1/ndia-payment-processor`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SDA_ADMIN_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'auto_process_monthly',
          organization_id: organizationId,
        }),
      });

      const data = await response.json();

      return {
        success: response.ok,
        data,
        source: 'edge-function',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Health check for SDA Admin system
   */
  async healthCheck() {
    const checks = {
      database: false,
      participants: false,
      properties: false,
      tenancies: false,
      ndiaSystem: false,
    };

    try {
      // Check database connection
      const { data: props } = await sdaAdminClient.from('properties').select('id').limit(1);
      checks.database = !!props;
      checks.properties = !!props;

      // Check participants table
      const { data: parts } = await sdaAdminClient.from('participants').select('id').limit(1);
      checks.participants = !!parts;

      // Check tenancies table
      const { data: tens } = await sdaAdminClient.from('tenancies').select('id').limit(1);
      checks.tenancies = !!tens;

      // Check NDIA system
      const { data: batches } = await sdaAdminClient.from('ndia_payment_batches').select('id').limit(1);
      checks.ndiaSystem = !!batches;

      const allHealthy = Object.values(checks).every(Boolean);

      return {
        success: true,
        status: allHealthy ? 'healthy' : 'degraded',
        checks,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        status: 'unhealthy',
        error: error.message,
        checks,
      };
    }
  }
}

export default new SDAPropertyAdminTools();
