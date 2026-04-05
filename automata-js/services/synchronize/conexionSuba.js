

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mkudxmassgrislkzuhvd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rdWR4bWFzc2dyaXNsa3p1aHZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NTgzMzIsImV4cCI6MjA5MDEzNDMzMn0.N0C46hLvPItuct4K8V7TyQ9RfLT4xFvxLJxW0qgo3As';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);