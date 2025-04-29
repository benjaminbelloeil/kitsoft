// This file is kept for backwards compatibility
// New code should use the client/server imports from utils/supabase/client or utils/supabase/server
import { createClient } from '@/utils/supabase/client';

// Re-export the createClient function to maintain backward compatibility
export default createClient;

/**
 * DEPRECATED: This file is maintained for compatibility with existing code.
 * For new code, please import directly from:
 *   - Client-side: @/utils/supabase/client
 *   - Server-side: @/utils/supabase/server
 */

/**
 * Use process.env.SUPABASE_SERVICE_ROLE_KEY only in secure server contexts,
 * never in client-side code or API routes without proper security checks.
 */