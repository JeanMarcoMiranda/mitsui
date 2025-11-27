import { supabase } from '../supabaseClient'

export const getBrands = async () => {
  const { data, error } = await supabase
    .from('brands')
    .select('id, name')

  if (error) throw error
  return data
}

export const getModelsByBrand = async (brandId: number) => {
  const { data, error } = await supabase
    .from('models')
    .select('id, name')
    .eq('brand_id', brandId)
    .order('name', { ascending: true })

  if (error) throw error
  return data
}

export const getHybridVersions = async () => {
  const { data, error } = await supabase
    .from('versions')
    .select(`
      specific_version,
      km_per_gallon,
      models (
        name,
        brands (
          name
        )
      )
    `)
    .eq('is_hybrid', true)

  if (error) throw error
  return data
}