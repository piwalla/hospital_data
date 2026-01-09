export interface CSSession {
  id: string;
  user_id: string;
  status: 'open' | 'closed' | 'pending';
  created_at: string;
  updated_at: string;
  assigned_admin_id?: string;
}

export interface CSMessage {
  id: string;
  session_id: string;
  sender_role: 'user' | 'admin';
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface CreateMessageData {
  session_id: string;
  content: string;
  sender_role: 'user' | 'admin';
}
