// Supabase Edge Function: invite-admin
// Deploy with: supabase functions deploy invite-admin
// Requires SUPABASE_SERVICE_ROLE_KEY set as a function secret (never exposed to the client).
// Only callable by an authenticated user whose admin_profiles.role = 'super_admin'.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

Deno.serve(async (req) => {
  try {
    const authHeader = req.headers.get('Authorization') ?? ''
    const callerClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      global: { headers: { Authorization: authHeader } },
    })

    const { data: userData, error: userErr } = await callerClient.auth.getUser()
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    const { data: callerProfile } = await callerClient
      .from('admin_profiles')
      .select('role')
      .eq('id', userData.user.id)
      .single()

    if (callerProfile?.role !== 'super_admin') {
      return new Response(JSON.stringify({ error: 'Only super admins can invite new admins' }), { status: 403 })
    }

    const { email, full_name, role } = await req.json()
    if (!email || !full_name || !['admin', 'super_admin'].includes(role)) {
      return new Response(JSON.stringify({ error: 'Missing or invalid fields' }), { status: 400 })
    }

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)
    const { data: invited, error: inviteErr } = await admin.auth.admin.inviteUserByEmail(email)
    if (inviteErr || !invited.user) {
      return new Response(JSON.stringify({ error: inviteErr?.message ?? 'Invite failed' }), { status: 400 })
    }

    const { error: profileErr } = await admin.from('admin_profiles').insert({
      id: invited.user.id,
      email,
      full_name,
      role,
      is_active: true,
    })
    if (profileErr) {
      return new Response(JSON.stringify({ error: profileErr.message }), { status: 400 })
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 })
  }
})
