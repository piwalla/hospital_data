-- Create cs_sessions table
CREATE TABLE IF NOT EXISTS public.cs_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL, -- Clerk User ID
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed', 'pending')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assigned_admin_id TEXT
);

-- Create cs_messages table
CREATE TABLE IF NOT EXISTS public.cs_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.cs_sessions(id) ON DELETE CASCADE,
    sender_role TEXT NOT NULL CHECK (sender_role IN ('user', 'admin')),
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.cs_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cs_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for cs_sessions
CREATE POLICY "Users can create their own sessions"
    ON public.cs_sessions
    FOR INSERT
    TO authenticated
    WITH CHECK ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can view their own sessions"
    ON public.cs_sessions
    FOR SELECT
    TO authenticated
    USING ((auth.jwt() ->> 'sub') = user_id);

-- Create policies for cs_messages
CREATE POLICY "Users can insert messages to their sessions"
    ON public.cs_messages
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.cs_sessions
            WHERE id = session_id
            AND user_id = (auth.jwt() ->> 'sub')
        )
    );

CREATE POLICY "Users can view messages of their sessions"
    ON public.cs_messages
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.cs_sessions
            WHERE id = session_id
            AND user_id = (auth.jwt() ->> 'sub')
        )
    );

-- Create indexes for performance
CREATE INDEX idx_cs_sessions_user_id ON public.cs_sessions(user_id);
CREATE INDEX idx_cs_messages_session_id ON public.cs_messages(session_id);

-- Grant permissions (if needed for anon/authenticated roles, default is usually restrictive)
GRANT ALL ON public.cs_sessions TO authenticated;
GRANT ALL ON public.cs_messages TO authenticated;
