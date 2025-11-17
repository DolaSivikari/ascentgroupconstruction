import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.74.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InviteUserRequest {
  email: string;
  password: string;
  fullName: string;
  role: string;
}

// Helper function for safe error responses
function createErrorResponse(error: any) {
  console.error('Function error:', {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });
  
  const isValidationError = error.message.includes('required') || 
                           error.message.includes('invalid') ||
                           error.message.includes('must be');
  
  const clientMessage = isValidationError 
    ? error.message
    : 'An error occurred processing your request. Please try again later.';
  
  return new Response(
    JSON.stringify({ 
      error: clientMessage,
      timestamp: new Date().toISOString()
    }),
    { 
      status: isValidationError ? 400 : 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
    
    // Verify caller is authenticated and is a super_admin
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user has super_admin role
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'super_admin')
      .maybeSingle();
      
    if (roleError || !roleData) {
      console.log(`Access denied for user ${user.id}: not a super_admin`);
      return new Response(
        JSON.stringify({ error: 'Forbidden: Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Parse request body
    const { email, password, fullName, role }: InviteUserRequest = await req.json();
    
    // Validate inputs
    if (!email || !password || !fullName || !role) {
      return new Response(
        JSON.stringify({ error: 'Email, password, full name, and role are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Creating user ${email} with role ${role} by admin ${user.email}`);

    // Create user with service role key (bypasses RLS)
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName }
    });
    
    if (createError) {
      throw createError;
    }

    console.log(`User created: ${newUser.user.id}`);

    // Assign role atomically
    const { error: roleInsertError } = await supabase
      .from('user_roles')
      .insert({ 
        user_id: newUser.user.id, 
        role 
      });
      
    if (roleInsertError) {
      // If role assignment fails, delete the user to maintain consistency
      console.error('Role assignment failed, cleaning up user:', roleInsertError);
      await supabase.auth.admin.deleteUser(newUser.user.id);
      throw new Error('Failed to assign user role');
    }

    console.log(`Role ${role} assigned to user ${newUser.user.id}`);

    return new Response(
      JSON.stringify({ 
        success: true,
        user: {
          id: newUser.user.id,
          email: newUser.user.email
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error: any) {
    return createErrorResponse(error);
  }
});
