import { createClient } from '@supabase/supabase-js';
import { env } from './config';
import type { Database } from './types/supabase';

export const client = createClient<Database>(
  env.SUPABASE_URL,
  env.SUPABASE_KEY
);
