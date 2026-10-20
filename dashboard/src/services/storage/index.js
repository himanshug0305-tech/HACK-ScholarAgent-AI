import { LocalVaultAdapter } from './LocalVaultAdapter'

// The dashboard is deliberately single-driver for now. A Supabase adapter can
// be dropped in here later because every page talks to this instance only.
export const storage = new LocalVaultAdapter()
