import { createClient } from '@supabase/supabase-js';
import { env } from './config';

export const client = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);
