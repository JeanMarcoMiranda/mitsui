import { supabase } from '../supabaseClient'

// Tipo para la respuesta anidada de la versión (incluye modelo y marca)
interface VersionData {
  specific_version: string
  km_per_gallon: number
  is_hybrid: boolean
  models: {
    name: string
    brands: {
      name: string
    }
  }
}

// Tipo para la respuesta simple de marcas
export interface Brand {
  id: number | string
  name: string
}

// Tipo para la respuesta simple de modelos
export interface Model {
  id: number | string
  name: string
}

// Funciones ya existentes (simplificadas y tipadas)

export const getBrands = async (): Promise<Brand[]> => {
  const { data, error } = await supabase
    .from('brands')
    .select('id, name')
    .order('name', { ascending: true })

  if (error) throw error
  // Mapeamos el ID a string si es necesario en el front-end (si usas UUIDs)
  // Pero lo dejamos como número ya que en DB es INTEGER
  return data
}

export const getModelsByBrand = async (brandId: number): Promise<Model[]> => {
  const { data, error } = await supabase
    .from('models')
    .select('id, name')
    .eq('brand_id', brandId)
    .order('name', { ascending: true })

  if (error) throw error
  return data
}

export const getHybridVersions = async (): Promise<VersionData[]> => {
  const { data, error } = await supabase
    .from('versions')
    .select(`
      specific_version,
      km_per_gallon,
      is_hybrid,
      models (
        name,
        brands (
          name
        )
      )
    `)
    .eq('is_hybrid', true)

  if (error) throw error
  return data as VersionData[]
}


// NUEVA FUNCIÓN: Obtiene la eficiencia de un vehículo no-híbrido específico
export const getCurrentCarEfficiency = async (brandName: string, modelName: string) => {
  // Nota: Esto asume que tienes una versión 'default' o la primera versión no híbrida.
  // En una app real, el usuario elegiría la versión exacta. Aquí tomamos la primera versión no-híbrida que coincida.
  const { data, error } = await supabase
    .from('versions')
    .select(`km_per_gallon`)
    .eq('is_hybrid', false)
    .eq('models.name', modelName)
    .eq('models.brands.name', brandName)
    .limit(1)
    .single()

  if (error) throw error
  
  // Convertir km/galón a km/litro para mantener la lógica de tu cálculo anterior (1 galón = 3.78541 litros)
  // Tu data estática usaba km/L, la DB usa km/galón.
  const KM_PER_LITER = data.km_per_gallon / 3.78541

  return KM_PER_LITER // Retorna la eficiencia en km/L
}