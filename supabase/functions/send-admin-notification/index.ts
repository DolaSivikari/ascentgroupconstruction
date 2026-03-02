import { createClient } from 'npm:@supabase/supabase-js@2';
import { checkRateLimit, getClientIdentifier, createRateLimitResponse } from '../_shared/rateLimiter.ts';
import { createErrorResponse } from '../_shared/errorHandler.ts';

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
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders });
    }

    const supabaseAuth = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: authData, error: authError } = await supabaseAuth.auth.getUser(token);
    if (authError || !authData.user) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data: callerRole } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', authData.user.id)
      .single();

    if (!callerRole || !['admin', 'super_admin'].includes(callerRole.role)) {
      return new Response('Forbidden', { status: 403, headers: corsHeaders });
    }

    // Rate limiting: 10 requests per minute per IP
    const identifier = getClientIdentifier(req);
    const rateLimit = await checkRateLimit(supabase, identifier, 'send-admin-notification', 10, 1);

    if (!rateLimit.allowed) {
      return createRateLimitResponse(rateLimit.retry_after_seconds || 60, corsHeaders);
    }

    const { type, title, message, referenceId }: NotificationRequest = await req.json();

    // Strict input validation
    if (!type || !VALID_NOTIFICATION_TYPES.includes(type)) {
      return createErrorResponse(
        new Error('Invalid notification type'),
        'Invalid notification type',
        400,
        'send-admin-notification'
      );
    }

    if (!title || title.length > MAX_TITLE_LENGTH) {
      return createErrorResponse(
        new Error('Invalid title length'),
        'Invalid title length',
        400,
        'send-admin-notification'
      );
    }

    if (!message || message.length > MAX_MESSAGE_LENGTH) {
      return createErrorResponse(
        new Error('Invalid message length'),
        'Invalid message length',
        400,
        'send-admin-notification'
      );
    }

    if (!referenceId || typeof referenceId !== 'string') {
      return createErrorResponse(
        new Error('Invalid reference ID'),
        'Invalid reference ID',
        400,
        'send-admin-notification'
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
    return createErrorResponse(
      error,
      'Failed to send notification',
      500,
      'send-admin-notification'
    );
  }
});