// This file is kept for backward compatibility
// Use the dedicated Supabase client utilities instead:
// For client components: import { createClient } from '@/utils/supabase/client'
// For server components: import { createClient } from '@/utils/supabase/server'

import { createClient as createBrowserClient } from '@/utils/supabase/client';

const supabase = createBrowserClient();

export default supabase;