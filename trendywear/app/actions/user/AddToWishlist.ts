'use server'

import { createClient } from '@/utils/supabase/server'

export async function addToWishlist(itemId: number) {
  const supabase = await createClient()

  // Get logged in user
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) throw new Error('Not authenticated')

  // Check if already in wishlist (avoid duplicates)
  const { data: existing } = await supabase
    .from('wishlist')
    .select('id')
    .eq('user_id', user.id)
    .eq('item_id', itemId)
    .single()

  if (existing) return { success: true, message: 'Already in wishlist' }

  //  Add to wishlist
  const { error } = await supabase
    .from('wishlist')
    .insert({
      user_id: user.id,
      item_id: itemId,
      created_at: new Date(),
    })

  if (error) throw new Error(error.message)

  return { success: true, message: 'Added to wishlist' }
}