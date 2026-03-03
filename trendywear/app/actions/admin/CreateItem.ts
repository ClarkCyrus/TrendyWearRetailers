'use server'

import { createClient } from '@/utils/supabase/server'

interface PreviewFile extends File {
  preview: string
}

export async function createItem(data: {
  name: string
  description: string
  tags: string
  image_file: PreviewFile | null
  image_id: string
  basePrice: number
}) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  console.log('AUTH USER:', user?.id)
  console.log('AUTH ERROR:', authError)

  let imagePathArray = ['placeholder']

  //image upload query
  if (data.image_file) {
    const filePath = `Uploaded/${data.name}`
    const { data:uploadData, error:uploadError } = await supabase.storage
      .from("images")
      .upload(filePath, data.image_file, { contentType: data.image_file.type })

    if (uploadError || !uploadData) {
      console.error("Upload error:", uploadError)
      throw new Error(uploadError?.message || 'Failed to upload image')
    }

    imagePathArray = [uploadData.path] 
  }

  const { data: dbUser, error: dbError } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', user?.id)
    .single()

  console.log('DB USER:', dbUser)
  console.log('DB ERROR:', dbError)

  if (!dbUser?.is_admin) throw new Error('Unauthorized')

  const { data: item, error: itemError } = await supabase
    .from('items')
    .insert({
      name: data.name,
      description: data.description,
      tags: JSON.parse(data.tags),
      image_id: imagePathArray,
    })
    .select()
    .single()

  if (itemError || !item) throw new Error(itemError?.message || 'Failed to create item')

  const { error: priceError } = await supabase.from('prices').insert({
    item_id: item.id,
    price: data.basePrice,
    priority: 0,
    valid_from: new Date(),
    valid_to: null
  })

  if (priceError) throw new Error(priceError.message)

  return item
}