import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.74.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreateAdminRequest {
  email: string;
  password: string;
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client with service role (admin access)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
    
    const { email, password }: CreateAdminRequest = await req.json();
    
    // Validate inputs
    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Creating admin user: ${email}`);

    // Check if user already exists
    const { data: existingUser } = await supabase.auth.admin.listUsers();
    const userExists = existingUser?.users?.some(u => u.email === email);
    
    if (userExists) {
      console.log('User already exists, checking role...');
      
      // Find the user ID
      const user = existingUser?.users?.find(u => u.email === email);
      if (user) {
        // Check if they already have admin role
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (roleData) {
          return new Response(
            JSON.stringify({ 
              success: true,
              message: 'User already exists with admin role',
              userId: user.id,
              role: roleData.role
            }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        // User exists but no role - assign super_admin
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({ 
            user_id: user.id, 
            role: 'super_admin' 
          });
        
        if (roleError) {
          throw new Error(`Failed to assign role: ${roleError.message}`);
        }
        
        return new Response(
          JSON.stringify({ 
            success: true,
            message: 'Admin role assigned to existing user',
            userId: user.id
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Create new user with auto-confirmed email
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm so they can login immediately
      user_metadata: { 
        full_name: 'Hebun - Admin'
      }
    });
    
    if (createError) {
      console.error('User creation error:', createError);
      throw new Error(`Failed to create user: ${createError.message}`);
    }

    console.log(`User created successfully: ${newUser.user.id}`);

    // Create profile entry (if handle_new_user trigger doesn't exist)
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: newUser.user.id,
        email: email,
        full_name: 'Hebun - Admin'
      });
    
    // Ignore profile error if trigger already created it
    if (profileError) {
      console.log('Profile creation note:', profileError.message);
    }

    // Assign super_admin role
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({ 
        user_id: newUser.user.id, 
        role: 'super_admin' 
      });
    
    if (roleError) {
      console.error('Role assignment error:', roleError);
      throw new Error(`User created but failed to assign role: ${roleError.message}`);
    }

    console.log(`Super admin role assigned successfully to ${newUser.user.id}`);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Admin user created successfully! You can now sign in.',
        userId: newUser.user.id,
        email: email
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in create-admin-user:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to create admin user',
        details: error.toString()
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
