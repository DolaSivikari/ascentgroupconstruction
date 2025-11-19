import { createClient } from 'npm:@supabase/supabase-js@2';
import { checkRateLimit, getClientIdentifier, createRateLimitResponse } from '../_shared/rateLimiter.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationRequest {
  type: string;
  title: string;
  message: string;
  referenceId: string;
}

const VALID_NOTIFICATION_TYPES = ['contact', 'rfp', 'quote', 'resume', 'prequal'];
const MAX_TITLE_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 1000;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Rate limiting: 10 requests per minute per IP
    const identifier = getClientIdentifier(req);
    const rateLimit = await checkRateLimit(supabase, identifier, 'send-admin-notification', 10, 1);

    if (!rateLimit.allowed) {
      return createRateLimitResponse(rateLimit.retry_after_seconds || 60, corsHeaders);
    }

    const { type, title, message, referenceId }: NotificationRequest = await req.json();

    // Strict input validation
    if (!type || !VALID_NOTIFICATION_TYPES.includes(type)) {
      return new Response(
        JSON.stringify({ error: 'Invalid notification type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!title || title.length > MAX_TITLE_LENGTH) {
      return new Response(
        JSON.stringify({ error: 'Invalid title length' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!message || message.length > MAX_MESSAGE_LENGTH) {
      return new Response(
        JSON.stringify({ error: 'Invalid message length' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!referenceId || typeof referenceId !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid reference ID' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Sending admin notification: ${type} - ${title}`);

    // Get all admin users
    const { data: adminUsers, error: adminError } = await supabase
      .from('user_roles')
      .select('user_id')
      .in('role', ['admin', 'super_admin']);

    if (adminError) {
      console.error('Error fetching admin users:', adminError);
      throw adminError;
    }

    if (!adminUsers || adminUsers.length === 0) {
      console.log('No admin users found');
      return new Response(
        JSON.stringify({ success: true, message: 'No admins to notify' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create notifications for each admin
    const notifications = adminUsers.map(admin => ({
      user_id: admin.user_id,
      notification_type: type,
      reference_id: referenceId,
      title,
      message,
      is_read: false,
    }));

    const { error: notificationError } = await supabase
      .from('admin_notifications')
      .insert(notifications);

    if (notificationError) {
      console.error('Error creating notifications:', notificationError);
      throw notificationError;
    }

    console.log(`Successfully created ${notifications.length} notifications`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        notificationCount: notifications.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Notification error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
