import { SupabaseClient } from "@supabase/supabase-js";
import { CSSession, CSMessage } from "@/lib/types/cs";

export async function getOrCreateSession(client: SupabaseClient, userId: string): Promise<{ session: CSSession | null, error: any }> {
  // Check for open session
  const { data: existing, error: fetchError } = await client
    .from('cs_sessions')
    .select('*')
    .eq('user_id', userId)
    .in('status', ['open', 'pending'])
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is 'Row not found'
    return { session: null, error: fetchError };
  }

  if (existing) {
    return { session: existing, error: null };
  }

  // Create new session
  const { data: newSession, error: createError } = await client
    .from('cs_sessions')
    .insert({
      user_id: userId,
      status: 'open'
    })
    .select()
    .single();

  return { session: newSession, error: createError };
}

export async function getMessages(client: SupabaseClient, sessionId: string) {
  return await client
    .from('cs_messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });
}

export async function sendMessage(client: SupabaseClient, sessionId: string, content: string, role: 'user' | 'admin') {
  return await client
    .from('cs_messages')
    .insert({
      session_id: sessionId,
      content,
      sender_role: role
    })
    .select()
    .single();
}

export function subscribeToMessages(client: SupabaseClient, sessionId: string, callback: (msg: CSMessage) => void) {
  return client
    .channel(`cs_chat:${sessionId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'cs_messages',
        filter: `session_id=eq.${sessionId}`
      },
      (payload) => {
        callback(payload.new as CSMessage);
      }
    )
    .subscribe();
}
