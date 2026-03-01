'use server'

import { createClient } from '@/utils/supabase/server'

export async function removeFromWishlist(itemId: number) {
  const supabase = await createClient()

 
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) throw new Error('Not authenticated')

  
  const { error } = await supabase
    .from('wishlist')
    .delete()
    .eq('user_id', user.id)
    .eq('item_id', itemId)

  if (error) throw new Error(error.message)

  return { success: true, message: 'Removed from wishlist' }
}